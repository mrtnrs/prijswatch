const scrapeWebshop1 = require('../scrapers/webshop1Scraper');

const Product = require('../models/Product');
const Price = require('../models/Price');
const Webshop = require('../models/Webshop');

exports.scrapeAndStoreData = async (req, res) => {
  try {
    const url = 'https://example-webshop.com/products';
    const scrapedData = await scrapeWebshop1(url);

    // Insert or update the data in the database using your Sequelize models.
    // This will involve creating or updating records in the Products, Webshops, and Prices tables.
    console.log(scrapedData);

    res.status(200).json({ message: 'Scraping and storing data completed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while scraping and storing data.' });
  }
};