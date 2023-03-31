const { Op } = require("sequelize");
const { Product, Scraper, MetaProduct } = require('../models');
const scraperController = require("../controllers/scraperController");
const { sanitizeTitleAndExtractMetadata } = require("../controllers/productMatcher");
const stringSimilarity = require('string-similarity');
const slugify = require('slugify');

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const generateSlug = (productName) => {
  return slugify(productName, {
    lower: true,
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
  });
};

class ScraperManager {
  constructor() {}

  async loadScrapers() {
    const scrapersData = await Scraper.findAll({
      where: {
        active: true,
      },
    });

    return scrapersData;
  }

  async findLocalMatchingMetaProduct(scrapedProduct, metaProducts) {
    const threshold = 0.8;
    const target = scrapedProduct;
    const candidates = metaProducts;

    const result = stringSimilarity.findBestMatch(target, candidates);

    if (result.bestMatch.rating >= threshold) {
      return metaProducts[result.bestMatchIndex];
    } else {
      return null;
    }
  }

async matchUnlinkedProducts() {
  const BATCH_SIZE = 50;
  let offset = 0;
  let unlinkedProductsBatch;

  do {
    unlinkedProductsBatch = await Product.findAll({
      where: { metaProductId: null },
      limit: BATCH_SIZE,
      offset: offset,
    });

    for (const scrapedProduct of unlinkedProductsBatch) {
      console.log(scrapedProduct);
      console.log(scrapedProduct.category);
      const categoryMetaProducts = await MetaProduct.findAll({
        where: { category: scrapedProduct.category },
      });

      // local check
      const localMatch = await this.findLocalMatchingMetaProduct(
        scrapedProduct.name,
        categoryMetaProducts.map((metaProduct) => metaProduct.dataValues.name)
      );

      if (localMatch) {
        await Product.update(
          { metaProductId: localMatch.id },
          { where: { id: scrapedProduct.id } }
        );
      } else {
        try {
          const { sanitizedTitle, metadata } = await sanitizeTitleAndExtractMetadata(scrapedProduct.name, scrapedProduct);
          const slug = generateSlug(sanitizedTitle);
          const brand = scrapedProduct.brand || (metadata && metadata.brand) || null;

          const newMetaProduct = await MetaProduct.create({
            name: sanitizedTitle,
            brand: brand,
            category: scrapedProduct.category,
            slug,
          });
          await Product.update(
            { metaProductId: newMetaProduct.id },
            { where: { id: scrapedProduct.id } }
          );
        } catch (error) {
          console.error(`Error processing product ID: ${scrapedProduct.id}: ${error.message}`);
          await Product.update(
            { needsreview: true },
            { where: { id: scrapedProduct.id } }
          );
        }
      }
    }

    offset += BATCH_SIZE;
  } while (unlinkedProductsBatch.length > 0);
}


  async runDueScrapers() {
    const scrapers = await this.loadScrapers();

    for (const scraper of scrapers) {
      const { interval, lastRun, id } = scraper;
      const currentTime = new Date();
      const nextRun = new Date(lastRun.getTime() + interval * 60 * 1000);

      if (currentTime >= nextRun) {
        try {
          await scraperController.runScraper({ params: { scraperId: id } }, null, false);
          await Scraper.update(
            { lastRun: currentTime },
            { where: { id: id } }
          );
          console.log(`Scraper ${id} ran successfully.`);
        } catch (error) {
          console.error(`Error running scraper ${id}: ${error.message}`);
        }
      }
    }

    await this.matchUnlinkedProducts();
  }
}

module.exports = ScraperManager;

