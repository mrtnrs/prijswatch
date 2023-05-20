const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const resizeAndUpload = require("../util/resizeAndUpload");
const getExistingProduct = require("../util/getExistingProduct");
const puppeteerConfig = require('../puppeteer.config.js');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

puppeteer.use(stealthPlugin());

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
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol) {
        return url;
      }
    } catch (err) {
      return this.baseUrl + url;
    }
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


// Function to get a random user-agent
 getRandomUserAgent() {

    // Define the list of user-agents
const userAgentList = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
];

  return userAgentList[Math.floor(Math.random() * userAgentList.length)];
}


  // This function is responsible for setting up the page with the necessary configurations
  async setupPage(page) {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    await page.setExtraHTTPHeaders({
      'Referer': 'https://www.google.com/',
    });
    await page.emulateTimezone("Europe/Amsterdam");
  }

  // Extract retry mechanism into a separate function
  async loadPageWithRetry(browser, url, maxAttempts) {
    let attempts = 0;
    let page;
    console.log('line 105: attempts: ', attempts);
    console.log(`line 105: Attempt ${attempts + 1} to load page: ${url}`);
    while (attempts < maxAttempts) {
      try {
        if (page) {
          console.log('closing page line 109');
          await page.close();  // Close the previous page before opening a new one
          console.log('Page closed. 111');
        }
        console.log('Creating new page... 112');
        page = await browser.newPage();
        console.log('New page created. 114');
        await page.authenticate({
          username: process.env.SCRAPER_USER,
          password: process.env.SCRAPER_PASS,
        });

               try {
         await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
        } catch (error) {
          console.error('Error loading page:', error);
        }

        if (page.isClosed()) {
          console.log('Page is closed, launching a new page...');
          attempts++;
        } else {
          return page; // Page loaded successfully
        }
      } catch (error) {
        console.error(`Error scraping: ${error}`);
        attempts++;
      }
    }
    console.error('Failed to load page after maximum attempts');
    return null; // Failed to load page after max attempts
  }



  // Extract browser relaunching and page loading into a separate function
  async relaunchBrowserAndLoadPage(browser, url, maxAttempts) {
    let attempts = 0;
    let page;
    console.log('relaunchBrowserAndLoadPage attampts line 142:', attempts);
    while (attempts < maxAttempts) {
      try {
        console.log('closing browser, 145');
        await browser.close();

        if (page && !page.isClosed()) {
          console.log('closing page line 149');
          await page.close();  // Close the previous page before opening a new one
        }

        browser = await puppeteer.launch({
          headless: true,
          timeout: 30000, // 60 seconds
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            `--proxy-server=p.webshare.io:80`
          ],
          userAgent: this.getRandomUserAgent(),
        });
        console.log('Creating new page... 164');
        page = await browser.newPage();
        await page.authenticate({
          username: process.env.SCRAPER_USER,
          password: process.env.SCRAPER_PASS,
        });

        console.log('Navigating to URL... 171');
        console.log(`Line 179: Attempt ${attempts + 1} to load page with proxy: ${url}`);
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
          console.log('Navigation completed. 173');
        } catch (error) {
          console.error('line 176: ', error);
        }

        if (!page.isClosed()) {
          return page; // Page loaded successfully
        }

        console.log('Page is closed, launching a new browser...');
        attempts++;
      } catch (error) {
        console.error(`Error scraping: ${error}`);
        attempts++;
      }
    }

    throw new Error('Failed to load page after maximum attempts');
  }

  // SCRAPE :: FETCH PRODUCT DATA

async fetchProductData(page, containerSelector, productNameSelector, productPriceSelector, itemSelector, productImageSelector, category) {
  // Fetch elements
  const nameElements = await page.$$(this.getCombinedSelector(containerSelector, productNameSelector));
  const priceElements = await page.$$(this.getCombinedSelector(containerSelector, productPriceSelector));
  const itemElements = await page.$$(this.getCombinedSelector(containerSelector, itemSelector));
  const imageElements = productImageSelector ? await page.$$(this.getCombinedSelector(containerSelector, productImageSelector)) : [];

  // Extract data
  const names = await Promise.all(nameElements.map(el => el.evaluate(el => el.textContent.trim())));
  const prices = await Promise.all(priceElements.map(el => el.evaluate(el => el.textContent.trim())));
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

  // Process data
  const pageItems = await Promise.allSettled(names.map(async (name, index) => {
    const productUrl = this.prependUrl(urls[index]);
    const existingProduct = await getExistingProduct(productUrl, category);
    let resizedImageUrl = null;
    if (existingProduct) {
      if (!existingProduct.imageUrl && imageUrls[index]) {
        resizedImageUrl = await resizeAndUpload(imageUrls[index], names[index]);
      } else {
        resizedImageUrl = existingProduct.imageUrl;
      }
    } else {
      resizedImageUrl = imageUrls[index] ? await resizeAndUpload(imageUrls[index], names[index]) : null;
    }

    const brand = this.extractBrand(name);
    const sanitizedPrice = this.sanitizePrice(prices[index]);

    if (sanitizedPrice === null) {
      console.error(`Error: Price is null for item: ${name}`);
      return null;
    }

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

  // Filter out rejected promises
  const fulfilledItems = pageItems
    .filter(item => item.status === 'fulfilled')
    .map(item => item.value);

  return fulfilledItems;
}


  // SCRAPE :: INITIALISE CODE

  async scrape() {
    
    // Define configuration constants
    const MIN_DELAY = 1000; // 1 second
    const MAX_DELAY = 5000; // 5 seconds
    // Define configuration values
    const MAX_ATTEMPTS = 5;
    const TIMEOUT = 20000; // 20 seconds
    
    console.log('scrape go');

    let launchOptions = {
      headless: true
    };

    if (process.env.ENVIRONMENT === "production") {
      console.log('production environment settings');
      launchOptions = {
        ...launchOptions,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    console.log('Creating new page... 289');
    let page = await browser.newPage();
    console.log('New page created. 291');

    console.log('page launched');
    await this.setupPage(page);

    const productNameSelector = this.scraperSettings.productNameSelector;
    const productPriceSelector = this.scraperSettings.productPriceSelector;
    const itemSelector = this.scraperSettings.urlSelector;
    const nextPageSelector = this.scraperSettings.nextPageSelector;
    const pagination = this.scraperSettings.pagination;
    const productImageSelector = this.scraperSettings.productImageSelector;
    const containerSelector = this.scraperSettings.containerSelector;
    const decategorie = this.scraperSettings.category;

    console.log('fetching scraper data, for example: ', decategorie);

    let items = [];
    let currentPage = 1;
    let hasNextPage = true;
    let currentUrl = this.url;
    console.log(`Line 323: Current URL: ${currentUrl}`);

    try {

      while (hasNextPage && currentUrl) {

        console.log(`Current page (line 320): ${currentPage}`);
        page = await this.loadPageWithRetry(browser, this.url, MAX_ATTEMPTS);
        console.log('After loading page // line 316 ');
        console.log('Page is closed:', page.isClosed());

        if (!page) {
          console.log('Failed to load page');
          return; // Failed to load page
        }

        console.log('After loading page');


        let randomDelay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
        await page.waitForTimeout(randomDelay);

        console.log('Timeout passed; fetching data - line 335');

        

        if (!page) {
          console.error('Failed to load page');
          page = await this.relaunchBrowserAndLoadPage(browser, this.url, MAX_ATTEMPTS);
          // return; // Failed to load page
        }

        let htmlContent = await page.content();
        console.log(htmlContent ? `Page content: ${htmlContent}` : 'No page content');

        await page.waitForSelector(this.getCombinedSelector(containerSelector, productNameSelector), { timeout: TIMEOUT });
        console.log('After waiting for product name selector');


        try {
          await page.waitForSelector(this.getCombinedSelector(containerSelector, productPriceSelector));
        } catch (error) {
          console.error(`Error waiting for product price selector: ${error}`);
          return;
        }

        try {
          await page.waitForSelector(this.getCombinedSelector(containerSelector, itemSelector));
        } catch (error) {
          console.error(`Error waiting for item selector: ${error}`);
          return;
        }


        const pageItems = await this.fetchProductData(page, containerSelector, productNameSelector, productPriceSelector, itemSelector, productImageSelector, decategorie);
        items.push(...pageItems);

        // SCRAPE :: HANDLE PAGINATION AND FINALISE

        try {
          while (hasNextPage && currentUrl) {
            const lastPaginationItem = await page.$('nav > ul.pagination > li.pagination__item:last-child');
            let nextPageHref = null;

            if (lastPaginationItem) {
              const nextPageElement = await page.$('nav > ul.pagination > li.pagination__item:last-child > a.pagination__link[aria-label="Ga naar de volgende pagina"]');
                if (nextPageElement) {
                  nextPageHref = await nextPageElement.evaluate(el => el.href);
                  currentPage++;
                  currentUrl = nextPageHref;
                  this.url = nextPageHref;
                  hasNextPage = true;  // There's a next page
                } else {
                  currentUrl = null;
                  await page.close();
                  hasNextPage = false;  // There's no next page
                }
            } else {
              currentUrl = null;
              await page.close();
            }
          }
        } catch (error) {
          console.error('Error in main scrape function:', error);
        } finally {
          await browser.close();
        }
      }
    } catch (error) {
      console.error('Error in scrape function:', error);
      page = await this.relaunchBrowserAndLoadPage(browser, this.url, MAX_ATTEMPTS);
    }

    return items;

  }
}

module.exports = PuppeteerScraper;
