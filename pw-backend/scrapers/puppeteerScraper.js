const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer');
const resizeAndUpload = require("../util/resizeAndUpload");
const getExistingProduct = require("../util/getExistingProduct");


function extractBaseUrl(url) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
}


class PuppeteerScraper extends BaseScraper {
  constructor(scraperSettings) {
    super(scraperSettings.name, scraperSettings.url, scraperSettings.interval, scraperSettings.scrapeSettings);
    this.scraperSettings = scraperSettings;
    this.baseUrl = extractBaseUrl(scraperSettings.url);
    this.categoryId = scraperSettings.categoryId;
  }

    sanitizePrice(price) {
      const sanitized = parseFloat(price.replace(/[^0-9.,]+/g, '').replace(',', '.'));
      console.log(`Sanitizing price "${price}" => ${sanitized}`);
      return sanitized;
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

   sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async loadPage(page, url, retries = 3, delay = 500) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  } catch (error) {
    console.error(`Error loading page: ${error}`);
    if (retries > 0) {
      console.log(`Retrying... (Attempts remaining: ${retries})`);
      await this.sleep(delay);
      await this.loadPage(page, url, retries - 1, delay + 500);
    } else {
      console.error(`Failed to load page after ${retries + 1} attempts: ${url}`);
      throw error;
    }
  }
}

async waitForImageLoad(page, selector, timeout = 5000) {
  await page.evaluate(async (selector, timeout) => {
    const image = document.querySelector(selector);
    if (!image) return;

    return new Promise((resolve, reject) => {
      if (image.complete) {
        resolve();
      } else {
        image.addEventListener('load', resolve);
        image.addEventListener('error', reject);
        setTimeout(() => reject(new Error('Image load timeout')), timeout);
      }
    });
  }, selector, timeout);
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
      await this.loadPage(page, currentUrl);
      await page.waitForTimeout(1500); // Wait for 2 seconds

const nameElements = await page.$$(this.getCombinedSelector(containerSelector, productNameSelector));
console.log('productPriceSelector');
await page.waitForSelector(this.getCombinedSelector(containerSelector, productPriceSelector)); 
const priceElements = await page.$$(this.getCombinedSelector(containerSelector, productPriceSelector));
const itemElements = await page.$$(this.getCombinedSelector(containerSelector, itemSelector));
await page.waitForSelector(this.getCombinedSelector(containerSelector, productImageSelector));
const imageElements = productImageSelector ? await page.$$(this.getCombinedSelector(containerSelector, productImageSelector)) : [];

      const names = await Promise.all(nameElements.map(el => el.evaluate(el => el.textContent.trim())));
      const prices = await Promise.all(priceElements.map(el => el.evaluate(el => el.textContent.trim())));
      console.log('prices', prices);
      const urls = await Promise.all(itemElements.map(el => el.evaluate(el => el.getAttribute('href'))));
      const imageUrls = productImageSelector
      ? await Promise.all(
          imageElements.map(async (el, index) => {
            await this.waitForImageLoad(page, this.getCombinedSelector(containerSelector, productImageSelector), 10000);
            return await page.evaluate((el) => {
              const src = el.getAttribute('src');
              const srcset = el.getAttribute('srcset');
              return src ? src : srcset ? srcset.split(' ')[0] : null;
            }, el);
          })
        )
      : [];

const pageItems = await Promise.allSettled(names.map(async (name, index) => {
  
const productUrl = this.prependUrl(urls[index]);
const existingProduct = await getExistingProduct(productUrl, this.categoryId);
let resizedImageUrl = null;
if (existingProduct) {
  if (!existingProduct.imageUrl && imageUrls[index]) {
    try {
      resizedImageUrl = await resizeAndUpload(imageUrls[index], names[index]);
    } catch (error) {
      console.error(`Error resizing and uploading image: ${error}`);
    }
  } else {
    resizedImageUrl = existingProduct.imageUrl;
  }
} else {
  try {
    resizedImageUrl = imageUrls[index] ? await resizeAndUpload(imageUrls[index], names[index]) : null;
  } catch (error) {
    console.error(`Error resizing and uploading image: ${error}`);
  }
}

  const brand = this.extractBrand(name);
  const sanitizedPrice = this.sanitizePrice(prices[index]);
  
  if (sanitizedPrice === null) {
    console.error(`Error: Price is null for item: ${name}`);
    return null;
  }

  console.log(`Product: ${name} | Price: ${prices[index]} | Sanitized Price: ${sanitizedPrice}`);

  console.log('settings');
  console.log(this.scraperSettings.category);

  return {
    code: 1,
    category: this.scraperSettings.category,
    name,
    brand,
    price: { value: sanitizedPrice },
    url: this.prependUrl(urls[index]),
    imageUrl: resizedImageUrl,
  }
}));

const fulfilledItems = pageItems
  .filter(item => item.status === 'fulfilled')
  .map(item => item.value);

      items.push(...fulfilledItems);

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
    return items;
  }
}

module.exports = PuppeteerScraper;
