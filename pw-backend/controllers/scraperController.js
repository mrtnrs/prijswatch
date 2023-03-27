const apiScraper = require('../scrapers/apiScraper');
const productController = require('./productController');
const { Price, Scraper } = require('../models');

const ApiScraper = require('../scrapers/apiScraper');
const PuppeteerScraper = require('../scrapers/puppeteerScraper');

const ScraperManager = require("../scrapers/scraperManager");
const scraperManager = new ScraperManager();


exports.runScraper = async (req, res, saveData = true) => {
  console.log("Running scraper...");
  const { scraperId } = req.params;

  // Retrieve the scraper settings from the database
  //const scraperSettings = await Scraper.findByPk(scraperId);

  if (!scraperSettings) {
    return res.status(404).json({ message: "Scraper not found sc 20" });
  }

  let scraperInstance;
  if (scraperSettings.type === "api") {
    scraperInstance = new ApiScraper(scraperSettings.settings);
  } else if (scraperSettings.type === "puppeteer") {
    scraperInstance = new PuppeteerScraper(scraperSettings.settings);
  } else {
    return res.status(400).json({ message: "Invalid scraper type" });
  }

  try {
    const scrapedData = await scraperInstance.run(); // Run the scraper
    // Process the scraped data and save it to the database...
    console.log("************");
    console.log(scrapedData);
    console.log("************");

    if (saveData) {
      // Process the scraped data and save it to the database...

      // Your existing implementation for saving the products and prices
      const savedProducts = await Promise.all(
        scrapedData.map(async (data) => {
          const { price, ...productData } = data;

          // Log the product data to debug
          console.log("Product Data:", productData);

          if (!productData.url) {
            console.error("Missing URL:", productData);
            // CATCH CASE PRODUCT NO EXISTO
            return null;
          }

          const product = await productController.createOrUpdateProduct(productData); // Save the product

          // Fetch the last price associated with the product
          const lastPrice = await Price.findOne({
            where: { productId: product.id },
            order: [["createdAt", "DESC"]],
          });

          if (!lastPrice || lastPrice.value !== price.value) {
            const savedPrice = await Price.create({
              ...price,
              productId: product.id,
            });

            return {
              product,
              price: savedPrice,
            };
          }
        })
      );

      res.status(200).json({
        message: saveData ? "Scraper ran successfully" : "Scraper test ran successfully",
        data: savedProducts,
      });
    } else {
      res.status(200).json({
        message: "Scraper test ran successfully",
        data: scrapedData,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while running the scraper",
      error: error.message,
    });
  }
};

/*
curl -X POST -H "Content-Type: application/json" -d '{
  "type": "ApiScraper",
  "name": "TestApiScraper",
  "url": "https://api.krefel.be/api/v2/krefel/categories/C937/products?fields=FULL&currentPage=${page}&pageSize=96&lang=nl",
  "interval": 86400,
  "scrapeSettings": {
    "apiKey": "your_api_key",
    "otherSetting": "value"
  }
}' http://localhost:3001/test-run-scraper

*/
  // try {
  //   console.log('hey');
  //   const scrapedData = await apiScraper(); // Run the scraper
  //   console.log('Products fetched:', scrapedData);
  //   


  //      

  //   }

  //       // Return the saved product and price data
  //       return {
  //         product,
  //         price: savedPrice,
  //       };
  //     })
  //   );

//     res.status(200).json({
//       message: 'Scraper ran successfully',
//       data: savedProducts,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'An error occurred while running the scraper',
//       error: error.message,
//     });
//   }
// };

// exports.runScraper = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const scraperRecord = await Scraper.findOne({ where: { name } });

//     if (!scraperRecord) {
//       return res.status(404).send({ message: "Scraper not found." });
//     }

//     const { type, settings } = scraperRecord;

//     // Initialize the correct scraper based on the type
//     let scraper;
//     if (type === 'api') {
//       scraper = new APIScraper(settings);
//     } else if (type === 'puppeteer') {
//       scraper = new PuppeteerScraper(settings);
//     } else {
//       return res.status(400).send({ message: "Invalid scraper type." });
//     }

//     // Run the scraper and process the results
//     const scrapedData = await scraper.run();

//     // ... (Handle the scraped data and save it to the database)

//     res.status(200).json({
//       message: 'Scraper ran successfully',
//       data: processedData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'An error occurred while running the scraper',
//       error: error.message,
//     });
//   }
// };


// Add a new scraper
exports.addScraper = async (req, res) => {
  try {
    const { name, type, settings, interval, webshopId } = req.body;
    const newScraper = await Scraper.create({
      name,
      type,
      settings,
      interval,
      webshopId,
    });
    res.status(201).send({ message: "Scraper added successfully.", data: newScraper });
  } catch (error) {
    res.status(500).send({ message: "An error occurred while adding the scraper.", error: error.message });
  }
};

// test scraper

exports.testScraper = async (req, res) => {
  try {
    const scraperSettings = req.body.scraperSettings;
    const { type } = scraperSettings;

    let scraperInstance;

    if (type === 'API') {
      scraperInstance = new apiScraper(scraperSettings);
    } else if (type === 'Puppeteer') {
      scraperInstance = new puppeteerScraper(scraperSettings);
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
exports.removeScraper = async (req, res) => {
  const { name } = req.body;
  scraperManager.unregisterScraper(name);
  res.status(200).send({ message: "Scraper removed successfully." });
};

// Get a scraper
exports.getScraper = async (req, res) => {
  const { name } = req.params;
  const scraper = scraperManager.getScraper(name);
  res.status(200).send(scraper);
};

// Get all scrapers
exports.getAllScrapers = async (req, res) => {
  const scrapers = scraperManager.getAllScrapers();
  res.status(200).send(scrapers);
};

// Run a scraper by name
exports.runScraperByName = async (req, res) => {
  // ... code for running a scraper by name
};



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

