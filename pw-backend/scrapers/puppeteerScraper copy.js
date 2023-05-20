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

  async loadPage(page, url, retries = 4, delay = 500, useProxy = true) {
    const userAgentList = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    ];


    function getRandomUserAgent() {
      userAgentList.sort(() => Math.random() - 0.5);
      return userAgentList[Math.floor(Math.random() * userAgentList.length)];
    }

    function getRandomDelay(min, max) {
      return Math.random() * (max - min) + min;
    }

    async function getPlatform(userAgent) {
      if (userAgent.includes('Win')) {
        return 'Win32';
      } else if (userAgent.includes('Macintosh')) {
        return 'MacIntel';
      } else {
        return 'Linux x86_64';
      }
    }

    function shuffle(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    
      return array;
    }


    async function applyBrowserSettings(page) {

      const userAgent = getRandomUserAgent();
      const override = {
        userAgent,
        acceptLanguage: "nl-NL,nl;q=0.9",
        platform: await getPlatform(userAgent),
      };

      try {
        const client = await page.target().createCDPSession();
        await client.send("Network.setUserAgentOverride", override);
      } catch (error) {
        console.error(`Failed to set user agent override: ${error.message}`);
      }

      await page.emulateTimezone("Europe/Amsterdam");
      await page.evaluateOnNewDocument(() => {
        const customRTC = (val) => {
          console.warn(`Blocked: ${val}`);
          return undefined;
        };

        window.__defineGetter__("MediaStreamTrack", () => customRTC("window.MediaStreamTrack"));
        navigator.__defineGetter__("getUserMedia", () => customRTC("navigator.getUserMedia"));

        const fnSW = () => {};
        navigator.serviceWorker.register = () => new Promise(fnSW, fnSW);
      });
    }

async function loadWithProxy(page, url) {
  const proxy = 'p.webshare.io:80';
  const proxyUrl = `http://${proxy}`;

  console.log(`Using proxy: ${proxy}`);

  await page.setUserAgent(getRandomUserAgent());
  try {
    await applyBrowserSettings(page);
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
      proxy: {
        server: proxyUrl,
        username: process.env.SCRAPER_USER,
        password: process.env.SCRAPER_PASS,
      },
    });
    if (response.status() === 403) {
      throw new Error('Server refused the request (403 error)');
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('Navigation timeout, retrying with a different proxy...');
    } else if (error.message === 'Server refused the request (403 error)') {
      console.log('Server refused the request (403 error), retrying with a different proxy...');
    } else {
      console.log('Tried but failed, next...');
      return;
    }
  }
}

     try {
    console.log(`Loading page: ${url}`);

    if (useProxy) {
      console.log("Retrying with proxy...");
      await page.browser().close(); // Close current browser

      const proxyBrowser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          `--proxy-server=p.webshare.io:80`,
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ]
      });
      page = await proxyBrowser.newPage();  // assign new page instance from new browser
      await page.authenticate({
        username: process.env.SCRAPER_USER,
        password: process.env.SCRAPER_PASS,
      });

      if (page.isClosed()) {
        console.error('Page has been closed, cannot continue');
        return;
      }

      console.log('Before loading page in loadPage function - line 192');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      console.log('After loading page in loadPage function');
      console.log('Page is closed:', page.isClosed());

      page.on('error', err => {
        console.error('Page error:', err);
      });


      page.on('response', async (response) => {
        if (response.url() === url) {
          console.log('getting response');
          const responseBody = await response.text();
        }
      });
    } else {
       console.log('Before loading page in loadPage function - line 209');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
        console.log('After loading page in loadPage function');
        console.log('Page is closed:', page.isClosed());

      page.on('response', async (response) => {
        if (response.url() === url) {
          console.log('getting response');
          const responseBody = await response.text();
        }
      });
    }
  } catch (error) {
  console.error(`Error loading page: ${error}`);

  if (!useProxy) {
    await this.loadPage(page, url, retries, delay, true);
  } else if (retries > 0) {
    console.log(`Retrying with a different proxy... (Attempts remaining: ${retries})`);
    await this.sleep(getRandomDelay(delay, delay + 500));
    await page.browser().close(); // Close current browser
    await this.loadPage(page, url, retries - 1, delay + 500, true);
  } else {
    console.error(`Failed to load page after ${retries + 1} attempts: ${url}`);
    return; // Skip this scraper
  }
}

  return page;
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

  // SCRAPE :: INITIALISE CODE

  async scrape() {

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
         // '--disable-setuid-sandbox',
         // '--disable-dev-shm-usage'
        ]
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    let page = await browser.newPage();

    console.log('page launched');

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

    console.log('fetching scraper data, for example: ', decategorie);

    let items = [];
    let currentPage = 1;
    let hasNextPage = true;
    let currentUrl = this.url;

    try {

    while (hasNextPage && currentUrl) {
      console.log(currentPage);

  try {
    page = await this.loadPage(await browser.newPage(), this.url);
      console.log('After loading page // line 316 ');
      console.log('Page is closed:', page.isClosed());
  } catch (error) {
    console.error(`Error scraping: ${error}`);
    return;
  }

        let minDelay = 1000; // 1 second, adjust as needed
        let maxDelay = 5000; // 5 seconds, adjust as needed
        let randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        
        await page.waitForTimeout(randomDelay);
      console.log('Timeout passed; fetching data - line 310');
      // 1
console.log('Before waiting for product name selector');
  
  let pageLoaded = page.isClosed();
let attempts = 0;
const maxAttempts = 5;

while (pageLoaded && attempts < maxAttempts) {
  try {

    await browser.close();

    browser = await puppeteer.launch({
      headless: true,
      timeout: 30000, // 60 seconds
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        `--proxy-server=p.webshare.io:80`
      ]
    });
    page = await browser.newPage();  // assign new page instance from new browser
    await page.authenticate({
      username: process.env.SCRAPER_USER,
      password: process.env.SCRAPER_PASS,
    });

    page = await this.loadPage(page, this.url);
    console.log('After loading page // line 316 ');

    if (page.isClosed()) {
      console.log('Page is closed, launching a new browser...');
      attempts++;
    } else {
      pageLoaded = true;
    }
  } catch (error) {
    console.error(`Error scraping: ${error}`);
    return;
  }
}

if (attempts === maxAttempts) {
  console.error('Failed to load page after maximum attempts');
  return;
}



try {
  let htmlContent = await page.content();
  if(htmlContent) {
    console.log('log content');
      console.log(htmlContent);
  } else {
    console.log('no content');
  }

  await page.waitForSelector(this.getCombinedSelector(containerSelector, productNameSelector), { timeout: 20000 });
} catch (error) {
  console.error(`Error waiting for product name selector: ${error}`);
  console.log('Page is closed:', page.isClosed());
  return;
}
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


      // 2
      const nameElements = await page.$$(this.getCombinedSelector(containerSelector, productNameSelector));
      const priceElements = await page.$$(this.getCombinedSelector(containerSelector, productPriceSelector));
      const itemElements = await page.$$(this.getCombinedSelector(containerSelector, itemSelector));

      console.log('productPriceSelector');
      
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
        console.log('check for existing product with url: ', productUrl);
        const existingProduct = await getExistingProduct(productUrl, decategorie);
        console.log('is existing product? ', existingProduct);
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
          await page.close();
        }
      } else {
        currentUrl = null;
        await page.close();
      }
    }

    }  catch(error) {
      console.error('Error in main scrape function:', error);
    } finally {
      await browser.close();
    }
    return items;
  }
}

module.exports = PuppeteerScraper;
