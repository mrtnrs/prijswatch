const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer');

class PuppeteerScraper extends BaseScraper {
  constructor(scraperSettings) {
    super(scraperSettings.name, scraperSettings.url, scraperSettings.interval, scraperSettings.scrapeSettings);
    this.scraperSettings = scraperSettings;
  }

    sanitizePrice(price) {
    return parseFloat(price.replace(/[^0-9.,]+/g, '').replace(',', '.'));
  }

  prependUrl(url) {
    const baseUrl = 'https://coolblue.be';
    return baseUrl + url;
  }

  extractBrand(name) {
    return name.split(' ')[0];
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

    let items = [];
    let currentPage = 1;
    let hasNextPage = true;
    let currentUrl = this.url;

    while (hasNextPage && currentUrl) {
      console.log(currentPage);
      // Scrape the data from the current page
      await page.goto(currentUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200); // Wait for 2 seconds

      const nameElements = await page.$$(productNameSelector);
      const priceElements = await page.$$(productPriceSelector);
      const itemElements = await page.$$(itemSelector);

      const names = await Promise.all(nameElements.map(el => el.evaluate(el => el.textContent.trim())));
      const prices = await Promise.all(priceElements.map(el => el.evaluate(el => el.textContent.trim())));
      const urls = await Promise.all(itemElements.map(el => el.evaluate(el => el.getAttribute('href'))));

      const pageItems = names.map((name, index) => {
        const brand = this.extractBrand(name);
        return {
        code: 1,
        category: this.scraperSettings.category,
        name,
        brand,
        price: this.sanitizePrice(prices[index]),
        url: this.prependUrl(urls[index]),
        }
      });

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
