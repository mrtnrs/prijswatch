const BaseScraper = require('./baseScraper');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const resizeAndUpload = require("../util/resizeAndUpload");
const getExistingProduct = require("../util/getExistingProduct");
const puppeteerConfig = require('../puppeteer.config.js');

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



async loadPage(page, url, retries = 3, delay = 500, useProxy = false) {
  const userAgentList = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    // Add more user agents if needed
  ];

    const proxies = [
    "185.199.229.156:7492",
    "185.199.228.220:7300",
    "185.199.231.45:8382",
    "188.74.210.207:6286",
    "188.74.183.10:8279",
    "188.74.210.21:6100",
    "45.155.68.129:8133",
    "154.95.36.199:6893",
    "45.94.47.66:8110",
     "145.239.85.58:9300",       // Poland
  "46.4.96.137:1080",         // Germany
  "47.91.88.100:1080",        // Germany “Frankfurt am Main”
  "45.77.56.114:30205",       // United Kingdom London
  "82.196.11.105:1080",       // Netherlands Amsterdam
  "51.254.69.243:3128",       // France
  "178.62.193.19:1080",       // Netherlands Amsterdam
  "188.226.141.127:1080",     // Netherlands Amsterdam
  "217.23.6.40:1080",         // Netherlands
  "185.153.198.226:32498",    // Moldova
  "81.171.24.199:3128",       // Netherlands
  "108.61.175.7:31802",       // United Kingdom London
  "176.31.200.104:3128",      // France
  "83.77.118.53:17171",       // Switzerland Ebikon
  "163.172.182.164:3128",     // France
  "163.172.168.124:3128",     // France
  "5.199.171.227:3128",       // Lithuania
  "51.68.207.81:80",          // United Kingdom
  "91.211.245.176:8080",      // Lithuania
  "164.68.98.169:9300",       // Germany
  "188.100.212.208:21129",    // Germany Dormagen
  "83.77.118.53:17171",       // Switzerland Ebikon
  "83.79.50.233:64527",   
  ];

  function getRandomUserAgent() {
    return userAgentList[Math.floor(Math.random() * userAgentList.length)];
  }

  function getRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
  }

function getRandomProxy() {
    return proxies[Math.floor(Math.random() * proxies.length)];
  }



    async function applyBrowserSettings(page) {
    // Set custom User-Agent, Accept-Language, and Platform
    const override = {
      userAgent: getRandomUserAgent(),
      acceptLanguage: "nl-NL,nl;q=0.9", // Updated to Dutch
      platform: "Win32",
    };

  try {
    // Get the client (CDPSession) from the page
    const client = await page.target().createCDPSession();

    // Send the setUserAgentOverride command using the client
    await client.send("Network.setUserAgentOverride", override);
  } catch (error) {
    console.error(`Failed to set user agent override: ${error.message}`);
  }

    // Emulate a specific timezone
    await page.emulateTimezone("Europe/Amsterdam");

    // Disable WebRTC, getUserMedia, and service workers
    await page.evaluateOnNewDocument(() => {
      // Disable WebRTC and getUserMedia
      const customRTC = (val) => {
        console.warn(`Blocked: ${val}`);
        return undefined;
      };

      window.__defineGetter__("MediaStreamTrack", () => customRTC("window.MediaStreamTrack"));
      navigator.__defineGetter__("getUserMedia", () => customRTC("navigator.getUserMedia"));

      // Disable service workers
      const fnSW = () => {};
      navigator.serviceWorker.register = () => new Promise(fnSW, fnSW);
    });
  }

    async function loadWithProxy(page, url) {
    const proxy = getRandomProxy();
    const [host, port] = proxy.split(':');
    const proxyUrl = `http://${proxy}`;

    console.log(`Using proxy: ${proxy}`);
    console.log(`Using user agent: ${userAgent}`);

    if (proxy.includes('@')) {
      const [creds, address] = proxy.split('@');
      await page.setExtraHTTPHeaders({
        'Proxy-Authorization': `Basic ${Buffer.from(creds).toString('base64')}`,
      });
    }

    await page.setUserAgent(getRandomUserAgent());
    try {
      await applyBrowserSettings(page);
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
        proxy: {
          server: proxyUrl,
          username: '',
          password: '',
        },
      });
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.log('Navigation timeout, retrying with a different proxy...');
        throw error;
      } else {
        throw error;
      }
    }
  }

  try {

    console.log(`Loading page: ${url}`);

    if (useProxy) {
      await loadWithProxy(page, url);
    } else {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    }

    // Log response content
    page.on('response', async (response) => {
      if (response.url() === url) {
        const responseBody = await response.text();
        console.log(`[RESPONSE]`, responseBody);
      }
    });

  } catch (error) {
    console.error(`Error loading page: ${error}`);

        // Log the page content on error
    const pageContent = await page.content();
    console.log(`[ERROR PAGE CONTENT]`, pageContent);

    if (!useProxy) {
      console.log("Retrying with proxy...");
      await this.loadPage(page, url, retries, delay, true);
    } else if (retries > 0) {
      console.log(`Retrying with a different proxy... (Attempts remaining: ${retries})`);
      await this.sleep(getRandomDelay(delay, delay + 500));
      await this.loadPage(page, url, retries - 1, delay + 500, true);
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
    console.log(puppeteerConfig);

    // const browser = await puppeteer.launch({
    //   executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    //   args: process.env.PUPPETEER_ARGS.split(' '),
    //   headless: true
    // });

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    await page.setExtraHTTPHeaders({
      'Referer': 'https://www.google.com/',
    });
    await page.emulateTimezone("Europe/Amsterdam");

    const productNameSelector = this.scraperSettings.productNameSelector;
    const productPriceSelector = this.scraperSettings.productPriceSelector;
    const itemSelector = this.scraperSettings.urlSelector;
    const nextPageSelector = this.scraperSettings.nextPageSelector;
    const pagination = this.scraperSettings.pagination;
    const productImageSelector = this.scraperSettings.productImageSelector;
    const containerSelector = this.scraperSettings.containerSelector;
    const decategorie = this.scraperSettings.category;


    let items = [];
    let currentPage = 1;
    let hasNextPage = true;
    let currentUrl = this.url;

    while (hasNextPage && currentUrl) {
      console.log(currentPage);
      // Scrape the data from the current page

      try {
        await this.loadPage(page, currentUrl);
      } catch (error) {
        console.error('Error in scrape function:', error);
        break;
      }

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
const existingProduct = await getExistingProduct(productUrl, decategorie);
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
