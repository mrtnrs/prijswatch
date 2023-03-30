const { Op } = require("sequelize");
const Scraper = require("../models/Scraper");
const scraperController = require("../controllers/scraperController"); // Move require statement here

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
  }
}

module.exports = ScraperManager;
