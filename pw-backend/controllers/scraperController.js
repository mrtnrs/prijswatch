const apiScraper = require('../scrapers/apiScraper');
const productController = require('./productController');
const { Price } = require('../models');


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
