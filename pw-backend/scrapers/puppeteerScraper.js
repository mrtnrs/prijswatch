const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer');
const resizeAndUpload = require("../util/resizeAndUpload");


function extractBaseUrl(url) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
}


class PuppeteerScraper extends BaseScraper {
  constructor(scraperSettings) {
    super(scraperSettings.name, scraperSettings.url, scraperSettings.interval, scraperSettings.scrapeSettings);
    this.scraperSettings = scraperSettings;
    this.baseUrl = extractBaseUrl(scraperSettings.url);
  }

    sanitizePrice(price) {
    return parseFloat(price.replace(/[^0-9.,]+/g, '').replace(',', '.'));
  }

  prependUrl(url) {
    return this.baseUrl + url;
  }

  extractBrand(name) {
    return name.split(' ')[0];
  }

  getCombinedSelector(containerSelector, selector) {
    return containerSelector ? `${containerSelector} ${selector}` : selector;
  }

  async scrape() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    const productNameSelector = this.scraperSettings.productNameSelector;
    const productPriceSelector = this.scraperSettings.productPriceSelector;
    const itemSelector = this.scraperSettings.urlSelector;
    const nextPageSelector = this.scraperSettings.nextPageSelector;
    const pagination = this.scraperSettings.pagination;
    const productImageSelector = this.scraperSettings.productImageSelector;
    const containerSelector = this.scraperSettings.containerSelector;


    let items = [];
    let currentPage = 1;
    let hasNextPage = true;
    let currentUrl = this.url;

    while (hasNextPage && currentUrl) {
      console.log(currentPage);
      // Scrape the data from the current page
      await page.goto(currentUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500); // Wait for 2 seconds

const nameElements = await page.$$(this.getCombinedSelector(containerSelector, productNameSelector));
const priceElements = await page.$$(this.getCombinedSelector(containerSelector, productPriceSelector));
const itemElements = await page.$$(this.getCombinedSelector(containerSelector, itemSelector));
await page.waitForSelector(this.getCombinedSelector(containerSelector, productImageSelector));
const imageElements = productImageSelector ? await page.$$(this.getCombinedSelector(containerSelector, productImageSelector)) : [];

      const names = await Promise.all(nameElements.map(el => el.evaluate(el => el.textContent.trim())));
      const prices = await Promise.all(priceElements.map(el => el.evaluate(el => el.textContent.trim())));
      const urls = await Promise.all(itemElements.map(el => el.evaluate(el => el.getAttribute('href'))));
const imageUrls = productImageSelector
  ? await Promise.all(
      imageElements.map(async (el) => {
        return await page.evaluate((el) => {
          const src = el.getAttribute('src');
          const srcset = el.getAttribute('srcset');
          return src ? src : srcset ? srcset.split(' ')[0] : null;
        }, el);
      })
    )
  : [];


// Add this line to log the image URLs fetched
console.log('Image URLs fetched:', imageUrls);

const pageItems = await Promise.all(names.map(async (name, index) => {
  let resizedImageUrl = null;
  try {
    resizedImageUrl = imageUrls[index] ? await resizeAndUpload(imageUrls[index]) : null;
    // Add this log in the main scraping code after resizing and uploading the image
console.log("Resized image URL:", resizedImageUrl);
  } catch (error) {
    console.error(`Error resizing and uploading image: ${error}`);
  }
  const brand = this.extractBrand(name);
  return {
    code: 1,
    category: this.scraperSettings.category,
    name,
    brand,
    price: this.sanitizePrice(prices[index]),
    url: this.prependUrl(urls[index]),
    imageUrl: resizedImageUrl,
  }
}));


      items.push(...pageItems);

       // Check if there is a next page
  const lastPaginationItem = await page.$('nav > ul.pagination > li.pagination__item:last-child');
      let nextPageHref = null;

      if (lastPaginationItem) {
        const nextPageElement = await page.$('nav > ul.pagination > li.pagination__item:last-child > a.pagination__link[aria-label="Ga naar de volgende pagina"]');
        if (nextPageElement) {
          nextPageHref = await nextPageElement.evaluate(el => el.href);
          currentPage++;
          currentUrl = nextPageHref;
        } else {
          currentUrl = null;
        }
      } else {
        currentUrl = null;
      }

    }

    await browser.close();
    console.log('items:');
    console.log(items);
    return items;
  }
}

module.exports = PuppeteerScraper;
