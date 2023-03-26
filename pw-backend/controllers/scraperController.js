const apiScraper = require('../scrapers/apiScraper');
const productController = require('./productController');
const { Price } = require('../models');

const ScraperManager = require("../scrapers/scraperManager");
const scraperManager = new ScraperManager();


exports.runScraper = async (req, res) => {
  console.log('Running scraper...');
  try {
    console.log('hey');
    const scrapedData = await apiScraper(); // Run the scraper
    console.log('Products fetched:', scrapedData);
    const savedProducts = await Promise.all(
      scrapedData.map(async (data) => {
        const { price, ...productData } = data;

        // Log the product data to debug
        console.log('Product Data:', productData);

            if (!productData.url) {
      console.error('Missing URL:', productData);
      return null;
    }


        const product = await productController.createOrUpdateProduct(productData); // Save the product

         // Fetch the last price associated with the product
      const lastPrice = await Price.findOne({
        where: { productId: product.id },
        order: [['createdAt', 'DESC']],
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

        // Return the saved product and price data
        return {
          product,
          price: savedPrice,
        };
      })
    );

    res.status(200).json({
      message: 'Scraper ran successfully',
      data: savedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while running the scraper',
      error: error.message,
    });
  }
};

// Add a new scraper
exports.addScraper = async (req, res) => {
  const { name, scraper } = req.body;
  scraperManager.registerScraper(name, scraper);
  res.status(201).send({ message: "Scraper added successfully." });
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
