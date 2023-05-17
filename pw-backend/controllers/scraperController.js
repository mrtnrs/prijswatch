const apiScraper = require('../scrapers/apiScraper');
const stringSimilarity = require('string-similarity');
const productController = require('./productController');
const { Price, Scraper, ScraperError, MetaProduct, Category } = require('../models');
const slugify = require('slugify');

const ApiScraper = require('../scrapers/apiScraper');
const PuppeteerScraper = require('../scrapers/puppeteerScraper');

// const ScraperManager = require("../scrapers/scraperManager");
// const scraperManager = new ScraperManager();
const { findMatchingMetaProduct, MIN_SIMILARITY_SCORE } = require('./productMatcher');

const resizeAndUpload = require("../util/resizeAndUpload");


// fetch all scrapers

exports.getAllScrapers = async (req, res) => {
  console.log('hai');
  try {
    console.log('hey');
    const scrapers = await Scraper.findAll();
    return res.status(200).json({scrapers: scrapers});
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching scrapers', error });
  }
};


// RUN SCRAPER

exports.runScraper = async (req, res, saveData = true) => {
  console.log("Running scraper... scraperController");
  const scraperId = req.params.id;
  console.log(scraperId);
  const scraperSettings = await Scraper.findByPk(scraperId);
  if (!scraperSettings) {
    console.log('no scraperSettings');
    return res.status(404).json({ message: "Scraper not found sc 20" });
  }

  let scraperInstance;
  if (scraperSettings.type === "api") {
    console.log('api detected');
    scraperInstance = new ApiScraper(scraperSettings.settings);
  } else if (scraperSettings.type === "puppeteer") {
    scraperInstance = new PuppeteerScraper(scraperSettings.settings);
  } else {
    return res.status(400).json({ message: "Invalid scraper type" });
  }

  const startTime = new Date();
  let totalProducts = 0;
  let changedProducts = 0;

  let response = {
    message: saveData ? "Scraper ran successfully" : "Scraper test ran successfully",
    data: []
  };

  console.log('runScraper line 62');

  try {
    console.log('controllers/scraperController runScraper()');
    const scrapedData = await scraperInstance.scrape(); // Run the scraper
    const errorList = scraperInstance.errors || [];
    console.log('saveData - scraperController.js line 68');
    console.log(saveData);
    if (saveData) {
      const category = await Category.findByPk(scraperSettings.settings.category);
      console.log('saveData - scraperController.js line 72');
      const savedProducts = await Promise.all(
        scrapedData.map(async (data) => {
          try {
            console.log('runScraper line 71');
            const { price, ...productData } = data;
            productData.webshopId = scraperSettings.webshopId;
            productData.categoryId = scraperSettings.settings.category;
            productData.category = category.name;

            if (!productData.url) {
              console.error("Missing URL:", productData);
              return null;
            }

            console.log('runScraper line 82', productData.url);

            const product = await productController.createOrUpdateProduct(productData); // Save the product

            // Fetch the last price associated with the product
            const lastPrice = await Price.findOne({
              where: { productId: product.id },
              order: [["createdAt", "DESC"]],
            });



            totalProducts++;
            console.log(totalProducts);

            console.log('last price associated with product: ', lastPrice);
            console.log('scraped price: ', price.value);
            console.log('typeof last price associated with product: ', typeof lastPrice);
            console.log('typeof scraped price: ', typeof price.value);

            if (!lastPrice || lastPrice.value !== price.value) {
              changedProducts++;
              const savedPrice = await Price.create({
                ...price,
                productId: product.id,
              });

              return {
                product,
                price: savedPrice,
              };
            } else {
              console.log('Price is the same, nothing changed');
            }
          } catch (error) {
            console.error('Error processing product:', error);
          }
        })
        );

      response.data = savedProducts.filter((product) => product !== null);

      await Scraper.update(
      {
        lastRun: startTime,
        lastRunStatus: "success",
        totalProducts,
        changedProducts,
      },
      { where: { id: scraperId } }
      );

      const maxErrorEntries = 100;
      const errorPromises = [];

      for (const error of errorList) {
        errorPromises.push(ScraperError.create({ scraperId, error: JSON.stringify(error) }));
      }

      await Promise.all(errorPromises);

      const errorsToDelete = await ScraperError.findAll({
        where: { scraperId },
        order: [["createdAt", "ASC"]],
        offset: maxErrorEntries - 1,
      });

    if (errorsToDelete.length > 0) {
        await ScraperError.destroy({
          where: {
            id: {
              [Op.in]: errorsToDelete.map((error) => error.id),
            },
          },
        });
      }
    }
    if (res) {
      res.status(200).json(response); // Move this line here, outside of the if (saveData) block
    }
    console.log('scraping finished successfully')
  } catch (error) {
    console.log(error);
    await Scraper.update(
      {
        lastRunStatus: "failure",
        totalProducts,
        changedProducts,
      },
      { where: { id: scraperId } }
    );

    res.status(500).json({
      message: "An error occurred while running the scraper",
      error: error.message,
    });
    console.log(error);
  }
};



// update scraper

  exports.updateScraper = async (req, res) => {
    try {
      const { scraperId } = req.params;
      const { webshopId, scraperSettings } = req.body;
      const { url, scrapeInterval, category, type, saveStatus, pagination, paginationParameter, pageSize } = scraperSettings;

    // You can add validation for the input data if needed

      const updatedScraper = await Scraper.update({
        type: type.toLowerCase(),
        settings: {
          url,
          category,
          pagination,
          paginationParameter,
          pageSize,
          ...(type === 'Puppeteer' && {
            urlSelector: scraperSettings.urlSelector,
            productNameSelector: scraperSettings.productNameSelector,
            productPriceSelector: scraperSettings.productPriceSelector,
            nextPageSelector: scraperSettings.nextPageSelector,
            containerSelector: scraperSettings.containerSelector,
            productImageSelector: scraperSettings.productImageSelector,
          }),
        },
        interval: scrapeInterval,
        webshopId,
        active: saveStatus === 'active',
      }, {
        where: { id: scraperId },
        returning: true,
        plain: true,
      });

      res.status(200).json({ message: "Scraper updated successfully", scraper: updatedScraper[1] });
    } catch (error) {
      console.error("Error updating scraper:", error);
      res.status(500).json({ error: error.message });
    }
  };


// delete scraper 

  exports.deleteScraper = async (req, res) => {
    try {
      const { id } = req.params;

      const scraper = await Scraper.findByPk(id);

      if (!scraper) {
        return res.status(404).json({ message: 'Scraper not found' });
      }

      await scraper.destroy();

      res.status(200).json({ message: 'Scraper deleted successfully' });
    } catch (error) {
      console.error('Error deleting scraper:', error);
      res.status(500).json({ error: error.message });
    }
  };

// set scraper to run

  exports.updateActiveState = async (req, res) => {
    try {
      const { scraperId } = req.params;
      const { active } = req.body;

      await Scraper.update(
        { active },
        { where: { id: scraperId } }
        );

      res.status(200).json({ message: 'Scraper active state updated successfully' });
    } catch (error) {
      console.error('Error updating scraper active state:', error);
      res.status(500).json({ error: error.message });
    }
  };




// save scraper

  exports.saveScraper = async (req, res) => {
    try {
      const { webshopId, scraperSettings } = req.body;
      const { url, scrapeInterval, category, type, saveStatus, pagination, paginationParameter, pageSize } = scraperSettings;
      const randomNum = Math.floor(Math.random() * 10000);
    // You can add validation for the input data if needed

      const newScraper = await Scraper.create({
      name: `${type}-${category}-${randomNum}`, // You can customize the name as needed
      type: type.toLowerCase(),
      settings: {
        url,
        category,
        pagination,
        paginationParameter,
        pageSize,
        ...(type === 'Puppeteer' && {
          urlSelector: scraperSettings.urlSelector,
          productNameSelector: scraperSettings.productNameSelector,
          productPriceSelector: scraperSettings.productPriceSelector,
          nextPageSelector: scraperSettings.nextPageSelector,
          containerSelector: scraperSettings.containerSelector,
          productImageSelector: scraperSettings.productImageSelector,
        }),
      },
      interval: scrapeInterval,
      webshopId,
      active: saveStatus === 'active',
    });

      res.status(201).json({ message: "Scraper created successfully", scraper: newScraper });
    } catch (error) {
      console.error("Error saving scraper:", error);
      res.status(500).json({ error: error.message });
    }
  };


// test scraper

  exports.testScraper = async (req, res) => {
    try {
      const scraperSettings = req.body.scraperSettings;
      const { type } = scraperSettings;

      let scraperInstance;
      console.log('haki');
      if (type === 'API') {
        scraperInstance = new apiScraper(scraperSettings);
      } else if (type === 'Puppeteer') {
        scraperInstance = new PuppeteerScraper(scraperSettings);
      } else {
        return res.status(400).json({ message: 'Invalid scraper type' });
      }

      const scrapedData = await scraperInstance.scrape();

      return res.status(200).json({ scrapedData });
    } catch (error) {
      console.error('Error testing scraper:', error);
      return res.status(500).json({ error: error.message });
    }
  };


// Remove a scraper
// exports.removeScraper = async (req, res) => {
//   const { name } = req.body;
//   scraperManager.unregisterScraper(name);
//   res.status(200).send({ message: "Scraper removed successfully." });
// };

// Get a scraper
// exports.getScraper = async (req, res) => {
//   const { name } = req.params;
//   const scraper = scraperManager.getScraper(name);
//   res.status(200).send(scraper);
// };

// create new Scraper

  function createScraperInstance(type, settings) {
    switch (type) {
    case 'api':
      return new ApiScraper(settings);
    case 'puppeteer':
      return new PuppeteerScraper(settings);
    default:
      return null;
    }
  }

  exports.handleScrapedProduct = async (scrapedProduct) => {
    const allMetaProducts = await MetaProduct.findAll({ where: { category: scrapedProduct.category } });
    const result = await findMatchingMetaProduct(scrapedProduct, allMetaProducts);

    const generateSlug = (productName) => {
      return slugify(productName, {
        lower: true,
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
      });
    };

    let metaProduct;
    if (result.match) {
    // Update the product with the matched MetaProduct ID
      metaProduct = result.match;
    } else if (result.create) {
    // Create a new MetaProduct with the sanitized title
      const slug = generateSlug(result.create.sanitizedTitle);

      metaProduct = await MetaProduct.create({
        name: result.create.sanitizedTitle,
        brand: scrapedProduct.brand,
        category: scrapedProduct.category,
        imageUrl: scrapedProduct.imageUrl,
        needsReview: true,
        slug,
      });

    } else {
      throw new Error('Unexpected result from findMatchingMetaProduct');
    }

  // Update the product with the MetaProduct ID and additional information
    await Product.update({ metaProductId: metaProduct.id, ...result.create.additionalInfo }, { where: { id: scrapedProduct.id } });
  };


