// pw-backend/scrapers/apiScraper.js
const BaseScraper = require('./baseScraper');
const axios = require("axios");
const resizeAndUpload = require("../util/resizeAndUpload");


class ApiScraper extends BaseScraper {
  constructor(scraperSettings) {
     super(scraperSettings.name, scraperSettings.url, scraperSettings.interval, scraperSettings.scrapeSettings);
     this.pagination = scraperSettings.pagination;
    // Any ApiScraper-specific code
  }



  async scrape() {
    try {

  const fetchProductsForPage = async (page) => {

    console.log('FETCHPRODUCTSFORPAGE');
    // const url = `https://api.krefel.be/api/v2/krefel/categories/C937/products?fields=FULL&currentPage=${page}&pageSize=96&lang=nl`;
    const url = this.pagination ? `${this.url}&currentPage=${page}&pageSize=96&lang=nl` : this.url;
    const { data } = await axios.get(url);

    console.log('API response data:', data); // Log the response data

    if (data.products.length === 0) {
      return null;
    }

return await Promise.all(data.products.map(async (product) => {
  const {
    code,
    name,
    price,
    images,
    brand,
    categories,
    url,
  } = product;

  const imageUrl = images && images[0] ? images[0].url : null;
  const category = categories && categories[0] ? categories[0].name : null;
  const productUrl = `https://www.krefel.be/nl${url}`;

  let resizedImageUrl = null;
  try {
    resizedImageUrl = imageUrl ? await resizeAndUpload(imageUrl, 200, 200) : null;
  } catch (error) {
    console.error(`Error resizing and uploading image: ${error}`);
  }

  const mappedProduct = {
    code,
    name,
    brand: brand.name,
    category,
    imageUrl: resizedImageUrl,
    url: productUrl,
    price: {
      value: price.value,
      currency: price.currencyIso,
      formattedValue: price.formattedValue,
    },
  };

  return mappedProduct;
}));

    }

    if (this.pagination) {
      const page = 0;
      const scrapedData = await fetchProductsForPage(page);
      return scrapedData;
    } else {
      const scrapedData = await fetchProductsForPage();
      return scrapedData;
    }

    } catch (error) {
      console.error('Error while scraping:', error);
    return { error: 'An error occurred while scraping. Please check the provided URL and try again.' };
    }

  }
}

module.exports = ApiScraper;



const fetchProductsForPage = async (page) => {
  const url = `https://api.krefel.be/api/v2/krefel/categories/C937/products?fields=FULL&currentPage=${page}&pageSize=96&lang=nl`;

  const { data } = await axios.get(url);

  if (data.products.length === 0) {
    return null;
  }

  return data.products.map((product) => {
    const {
      code,
      name,
      price,
      images,
      brand,
      categories,
      url,
    } = product;

    const imageUrl = images && images[0] ? images[0].url : null;
    const category = categories && categories[0] ? categories[0].name : null;
    const productUrl = `https://www.krefel.be/nl${url}`

    const mappedProduct = {
      code,
      name,
      brand: brand.name,
      category,
      imageUrl,
      url: productUrl,
      price: {
        value: price.value,
        currency: price.currencyIso,
        formattedValue: price.formattedValue,
      },
    };

    return mappedProduct;

  });
};

