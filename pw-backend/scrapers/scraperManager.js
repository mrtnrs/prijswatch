const { Op } = require("sequelize");
const { Product, Scraper } = require('../models');
const scraperController = require("../controllers/scraperController");
const findMatchingMetaProduct = require("../controllers/productMatcher")

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


  async matchUnlinkedProducts() {
    const BATCH_SIZE = 100;
    let offset = 0;
    let unlinkedProductsBatch;

    do {
      unlinkedProductsBatch = await Product.findAll({
        where: { metaProductId: null },
        limit: BATCH_SIZE,
        offset: offset,
      });

      for (const scrapedProduct of unlinkedProductsBatch) {
        await scraperController.handleScrapedProduct(scrapedProduct);
      }

      offset += BATCH_SIZE;
    } while (unlinkedProductsBatch.length > 0);
  }


}

module.exports = ScraperManager;
