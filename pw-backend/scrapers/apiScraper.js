// pw-backend/scrapers/apiScraper.js
const BaseScraper = require('./baseScraper');
const axios = require("axios");
const resizeAndUpload = require("../util/resizeAndUpload");

class ApiScraper extends BaseScraper {
  constructor(scraperSettings, apiConfig) {
    super(scraperSettings.name, scraperSettings.url, scraperSettings.interval, scraperSettings.scrapeSettings);
    this.apiConfig = apiConfig;
    this.dataPath = apiConfig.dataPath; // Add this line
    this.productMappingFunction = apiConfig.productMappingFunction;
  }

  async scrape() {
    try {
      const fetchProductsForPage = async (page) => {
        let url = this.url;

        if (this.apiConfig.pagination) {
          url += `&${this.apiConfig.pageParam}=${page}&${this.apiConfig.pageSizeParam}=${this.apiConfig.pageSize}`;
        }

        const { data } = await axios.get(url);
        console.log('API response data:', data); // Log the response data

        const products = this.dataPath.split('.').reduce((obj, path) => obj[path], data);


        if (products.length === 0) {
          return null;
        }

        return await Promise.all(products.map(async (product) => {
          const mappedProduct = eval(`(${this.productMappingFunction})`)(product);

          const imageUrl = mappedProduct.imageUrl;
          let resizedImageUrl = null;
          try {
            resizedImageUrl = imageUrl ? await resizeAndUpload(imageUrl, 200, 200) : null;
          } catch (error) {
            console.error(`Error resizing and uploading image: ${error}`);
          }

          mappedProduct.imageUrl = resizedImageUrl;
          return mappedProduct;
        }));
      }

      if (this.apiConfig.pagination) {
        let page = 0;
        let scrapedData = [];
        let products;

        do {
          products = await fetchProductsForPage(page);
          if (products) {
            scrapedData.push(...products);
            page++;
          }
        } while (products);

        return scrapedData;
      } else {
        return await fetchProductsForPage();
      }
    } catch (error) {
      console.error('Error while scraping:', error);
      return { error: 'An error occurred while scraping. Please check the provided URL and try again.' };
    }
  }
}

module.exports = ApiScraper;
