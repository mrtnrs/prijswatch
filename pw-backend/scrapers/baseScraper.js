class BaseScraper {
  constructor(name, url, interval) {
    this.name = name;
    this.url = url;
    this.interval = interval;
  }

  async fetchProductsForPage(page) {
    throw new Error("fetchProductsForPage method must be implemented in a derived class.");
  }

  async fetchAllProducts() {
    throw new Error("fetchAllProducts method must be implemented in a derived class.");
  }
}

module.exports = BaseScraper;
