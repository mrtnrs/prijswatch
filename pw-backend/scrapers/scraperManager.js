class ScraperManager {
  constructor() {
    this.scrapers = {};
  }

  registerScraper(name, scraper) {
    this.scrapers[name] = scraper;
  }

  unregisterScraper(name) {
    delete this.scrapers[name];
  }

  getScraper(name) {
    return this.scrapers[name];
  }

  getAllScrapers() {
    return this.scrapers;
  }

  async runScraper(name) {
    const scraper = this.getScraper(name);

    if (!scraper) {
      throw new Error(`Scraper "${name}" not found.`);
    }

    return scraper.fetchAllProducts();
  }
}

module.exports = ScraperManager;
