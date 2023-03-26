class BaseScraper {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  async fetchProductsForPage(page) {
    throw new Error("fetchProductsForPage method must be implemented in a derived class.");
  }

  async fetchAllProducts() {
    throw new Error("fetchAllProducts method must be implemented in a derived class.");
  }
}

module.exports = BaseScraper;
