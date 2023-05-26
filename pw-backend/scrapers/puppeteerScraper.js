const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const resizeAndUpload = require("../util/resizeAndUpload");
const getExistingProduct = require("../util/getExistingProduct");
const puppeteerConfig = require('../puppeteer.config.js');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const useProxy = require('puppeteer-page-proxy');
const { HeaderGenerator } = require('header-generator');
const https = require('https');


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
    console.log(price);
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

  randomDelay(minDelay, maxDelay) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
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
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0',
];

  return userAgentList[Math.floor(Math.random() * userAgentList.length)];
}

getPlatform(userAgent) {
  if (userAgent.includes('Win')) {
    return 'Win32';
  } else if (userAgent.includes('Macintosh')) {
    return 'MacIntel';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    return 'iOS';
  } else {
    return 'Linux x86_64';
  }
}

async getProxiesFromPubProxy() {
  const response = await fetch('http://pubproxy.com/api/proxy?limit=10&format=json&type=http,https');
  const data = await response.json();

  return data.data.map(proxy => `${proxy.type}://${proxy.ipPort}`);
}



async getProxyFromSpys() {

  let lastUsedProxy = '';
  const proxyURL = 'https://spys.me/proxy.txt';
  let proxyList = [];
  return new Promise((resolve, reject) => {
    https.get(proxyURL, (res) => {
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        const lines = rawData.split('\n');
        for (let line of lines) {
          const data = line.split(' ');
          let ipAddress = data[0];
          let countryCode = ipAddress.split(':')[0].slice(0, 2);
          let isGooglePassed = data[3] === '+';
          let isHttps = data[2] === 'S';
          let acceptedCountries = ['BE', 'FR', 'GB', 'NL', 'DE', 'ES'];
          if (acceptedCountries.includes(countryCode) && isGooglePassed && isHttps) {
            const formattedProxy = 'https://' + ipAddress;
            proxyList.push(formattedProxy);
          }
        }
        resolve(proxyList);
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
};



  // This function is responsible for setting up the page with the necessary configurations
  async setupPage(page, attempt) {
    console.log('entering setupPage - 119');
    // const userAgent = this.getRandomUserAgent();
    // const timezone = "Europe/Amsterdam";
    let proxy = null;

    const headerGenerator = new HeaderGenerator({
        browsers: [
            {name: "firefox", minVersion: 80},
            {name: "chrome", minVersion: 87},
            "safari"
        ],
        devices: ["desktop"],
        operatingSystems: ["windows", "macos", "linux"]
    });

    const headers = headerGenerator.getHeaders({
        operatingSystems: ["windows", "macos", "linux"],
        locales: ["nl-NL", "en-US", "en", "de-DE", "fr-FR"]
    });

    console.log('generated header: ', headers);

    // Set the user agent and locale
    await page.setUserAgent(headers['user-agent']);
    await page.setExtraHTTPHeaders({
        'Accept-Language': headers['accept-language']
    });

    // await page.setViewport({
    //   width: 1920,
    //   height: 1080,
    // });

    // Set the other headers
    const otherHeaders = {...headers};
    delete otherHeaders['user-agent'];
    delete otherHeaders['accept-language'];
    await page.setExtraHTTPHeaders(otherHeaders);

    // await page.evaluateOnNewDocument(() => {
    //   window.innerWidth = window.outerWidth = screen.width = screen.availWidth = 1920;
    //   window.innerHeight = window.outerHeight = screen.height = screen.availHeight = 1080;
    //   window.devicePixelRatio = 1;
    // });



    await page.evaluateOnNewDocument(() => {
        // Prevent webdriver detection
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });



        // Add an empty permissions object to the navigator
        navigator.permissions = {
            query: () => Promise.resolve({ state: "denied" }),
        };

        // Provide stub functions / properties for the window's MediaStreamTrack, getDisplayMedia and navigator's getUserMedia
        window.MediaStreamTrack = function() {};
        window.MediaStreamTrack.prototype.getSources = function() {};

        window.navigator.mediaDevices = {
            getDisplayMedia: () => {},
            getUserMedia: () => Promise.resolve(new MediaStream()),
        };

        // Spoof languages
        Object.defineProperty(Object.getPrototypeOf(navigator), 'languages', { get: () => ["en-US", "en"] });
        Object.defineProperty(Object.getPrototypeOf(navigator), 'language', { get: () => "en-US" });
    });

        // Media Capabilities Spoofing
    await page.evaluateOnNewDocument(() => {
        HTMLVideoElement.prototype.canPlayType = () => "probably";
        HTMLAudioElement.prototype.canPlayType = () => "probably";
    });

    // Screen Resolution Spoofing
    // await page.evaluateOnNewDocument(() => {
    //     Object.defineProperty(screen, 'width', { get: () => 1920 });
    //     Object.defineProperty(screen, 'height', { get: () => 1080 });
    //     Object.defineProperty(window, 'innerWidth', { get: () => 1920 });
    //     Object.defineProperty(window, 'innerHeight', { get: () => 1080 });
    // });

    // Document Properties - always indicate that the document is in focus and visible
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(document, 'visibilityState', { get: () => "visible" });
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'hasFocus', { value: () => true });
    });

    // Plugins and MimeTypes Spoofer
    await page.evaluateOnNewDocument(() => {
        const fakePluginArray = [
            { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
            { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
        ];

        const fakeMimeTypeArray = [
            { type: 'application/pdf', suffixes: 'pdf', description: '', __plugin__: fakePluginArray[0] },
            { type: 'application/x-nacl', suffixes: '', description: 'Native Client Executable', __plugin__: fakePluginArray[2] },
            { type: 'application/x-pnacl', suffixes: '', description: 'Portable Native Client Executable', __plugin__: fakePluginArray[2] }
        ];

        Object.defineProperty(navigator, 'plugins', { get: () => fakePluginArray });
        Object.defineProperty(navigator, 'mimeTypes', { get: () => fakeMimeTypeArray });
    });

    await page.evaluateOnNewDocument(() => {
    const fakePluginArray = [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
        { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
    ];

      function FakePluginArray() {
          this.length = fakePluginArray.length;
          for (let i = 0; i < fakePluginArray.length; i++) {
            this[i] = fakePluginArray[i];
        }
      }

      FakePluginArray.prototype = Object.create(PluginArray.prototype);

      Object.defineProperty(navigator, 'plugins', { get: () => new FakePluginArray() });
    });

    await page.setViewport({
      width: 768,
      height: 1024,
    });


    await page.evaluateOnNewDocument(() => {
    Object.defineProperty(window, 'innerWidth', { get: () => 768 });
    Object.defineProperty(window, 'innerHeight', { get: () => 1024 });
    Object.defineProperty(window, 'outerWidth', { get: () => 768 });
    Object.defineProperty(window, 'outerHeight', { get: () => 1024 });
    Object.defineProperty(screen, 'width', { get: () => 768 });
    Object.defineProperty(screen, 'height', { get: () => 1024 });
    Object.defineProperty(screen, 'availWidth', { get: () => 768 });
    Object.defineProperty(screen, 'availHeight', { get: () => 1024 });
});



    await page.evaluateOnNewDocument(() => {
    window.navigator.__proto__.webdriver = null;
    window.navigator.__proto__.domAutomation = null;
    window.navigator.__proto__.domAutomationController = null;
});

    await page.evaluateOnNewDocument(() => {
    const windowDetectionKeys = [
        "_phantom",
        "__nightmare",
        "_selenium",
        "callPhantom",
        "callSelenium",
        "_Selenium_IDE_Recorder",
    ];

    const documentDetectionKeys = [
        "__webdriver_evaluate",
        "__selenium_evaluate",
        "__webdriver_script_function",
        "__webdriver_script_func",
        "__webdriver_script_fn",
        "__fxdriver_evaluate",
        "__driver_unwrapped",
        "__webdriver_unwrapped",
        "__driver_evaluate",
        "__selenium_unwrapped",
        "__fxdriver_unwrapped",
        "_Selenium_IDE_Recorder",
        "_selenium",
        "calledSelenium",
        "_WEBDRIVER_ELEM_CACHE",
        "ChromeDriverw",
        "driver-evaluate",
        "webdriver-evaluate",
        "selenium-evaluate",
        "webdriverCommand",
        "webdriver-evaluate-response",
        "__webdriverFunc",
        "__webdriver_script_fn",
        "__$webdriverAsyncExecutor",
        "__lastWatirAlert",
        "__lastWatirConfirm",
        "__lastWatirPrompt",
        "$chrome_asyncScriptInfo",
        "$cdc_asdjflasutopfhvcZLmcfl_"
    ];

    for (const key of windowDetectionKeys) {
        try {
            delete window[key];
        } catch (e) {}
    }

    for (const key of documentDetectionKeys) {
        try {
            delete document[key];
        } catch (e) {}
    }
});


    await page.evaluateOnNewDocument(() => {
      delete window['chrome'];
      delete window['$cdc_asdjflasutopfhvcZLmcfl_'];
      delete window['$wdc_'];
      delete window['$chrome_asyncScriptInfo'];
      delete window['$crx'];
      delete navigator.__proto__.webdriver;
      navigator.permissions = {
        query: () => Promise.resolve({ state: "granted" }),
      };
      Object.defineProperty(document, 'webdriver', { get: () => undefined });
      Object.defineProperty(document, 'driver', { get: () => undefined });
      Object.defineProperty(document, 'selenium', { get: () => undefined });

  });





  //     await page.evaluateOnNewDocument(() => {
  //   
  // });

    // WebGL Vendor and Renderer Spoofing
    await page.evaluateOnNewDocument(() => {
        const getParameter = WebGLRenderingContext.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            // UNMASKED_VENDOR_WEBGL
            if (parameter === 37445) {
                return 'Intel Open Source Technology Center';
            }
            // UNMASKED_RENDERER_WEBGL
            if (parameter === 37446) {
                return 'Mesa DRI Intel(R) Ivybridge Mobile ';
            }
            return getParameter(parameter);
        };
    });

    await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

await page.evaluateOnNewDocument(() => {
    function mockPluginsAndMimeTypes() {
        const makePluginArray = () => {
            const arr = [];
            arr.refresh = () => {};
            return arr;
        };

        const plugins = ['Chrome PDF Plugin', 'Chrome PDF Viewer', 'Native Client'];
        const pluginArray = makePluginArray();

        plugins.forEach((name) => {
            const mock = {
                description: 'Portable Document Format',
                filename: 'internal-pdf-viewer',
                length: 1,
                name,
            };
            pluginArray.push(mock);
        });

        const mimeTypes = ['application/pdf', 'application/x-google-chrome-pdf', 'application/x-nacl'];
        const mimeTypeArray = makePluginArray();

        mimeTypes.forEach((type) => {
            const mock = {
                description: 'Portable Document Format',
                suffixes: 'pdf',
                type,
            };
            mimeTypeArray.push(mock);
        });

        Object.defineProperty(navigator, 'plugins', {
            get: () => pluginArray,
        });

        Object.defineProperty(navigator, 'mimeTypes', {
            get: () => mimeTypeArray,
        });
    }

    try {
        mockPluginsAndMimeTypes();
    } catch (err) {
        console.error(err);
    }
});


    await page.evaluateOnNewDocument(() => {
      delete navigator.__proto__.webdriver;
    });



    // try {
    //   await page.goto('https://bot.sannysoft.com/');
    //   console.log(await page.content());
    // } catch (error) {
    //   console.error(error);
    // }


    const deUrl = this.url.toLowerCase().includes('dreamland');
    console.log('is Dreamland?', deUrl);
    if ((attempt > 0 && attempt < 4) || deUrl) {
      console.log('we apply a little proxy - 108');
      proxy = 'http://bgekvwfm-ES-IT-NL-rotate:gvpxqiw0tqdy@p.webshare.io:80';  // your proxy here
      await useProxy(page, proxy);
    } else if (attempt < 7 && attempt > 0) { 
      console.log('using PubProxy');
    const proxyList = await this.getProxiesFromPubProxy();
    proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
    console.log('proxy = ', proxy);
    await useProxy(page, proxy);
    }
     else if (attempt < 10 && attempt > 0) { 
      console.log('using proxyList');
      const proxyList = await this.getProxyFromSpys();
        proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
      console.log('proxy = ', proxy);
      await useProxy(page, proxy);
    }


    await page.setRequestInterception(true);
page.on('request', (req) => {
    if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'media'){
        req.abort();
    }
    else {
        req.continue();
    }
});

    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`Opening page with user-agent ${userAgent} and proxy IP ${proxy ? proxy : 'none'}`);

  }


      // await page.setUserAgent(userAgent);

    // page = await newInjectedPage(
    //     browser,
    //     {
    //         // Constraints for the generated fingerprint
    //         fingerprintOptions: {
    //             devices: ['desktop', 'mobile'],
    //             operatingSystems: ['windows', 'macos', 'linux', 'android', 'ios'],
    //         },
    //     },
    // );
    
    // Viewport randomization
    // const viewportWidth = 800 + Math.floor(Math.random() * 600);
    // const viewportHeight = 600 + Math.floor(Math.random() * 400);
    // await page.setViewport({ width: viewportWidth, height: viewportHeight });

    // await page.setExtraHTTPHeaders({
    //   'Referer': 'https://www.google.com/',
    // });
    // await page.emulateTimezone(timezone);

    // Apply browser settings
    // const override = {
    //   userAgent,
    //   acceptLanguage: "nl-NL,nl;q=0.9",
    //   platform: await this.getPlatform(userAgent),
    // };

    // try {
    //   const client = await page.target().createCDPSession();
    //   await client.send("Network.setUserAgentOverride", override);
    // } catch (error) {
    //   console.error(`Failed to set user agent override: ${error.message}`);
    // }


  // Verify the data is present
  async navigateToPage(page, url) {
    console.log('Navigating to:', url);
    try {
      page.setCacheEnabled(false);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    } catch (error) {
      console.error(`Failed to navigate to ${url}: ${error}`);
      throw error;  // throw the error again so it can be caught in the main scrape function
    }
  }

  async isDataPresent(page, containerSelector, productNameSelector, productPriceSelector, itemSelector) {
    const TIMEOUT = 35000; // adjust this value to fit your needs

    // define selectors that should be present on the page
    const selectors = [
        // add the CSS selectors of the elements you want to check
        // e.g., "#container .product-name", "#container .product-price", "#container .item"
        this.getCombinedSelector(containerSelector, productNameSelector),
        this.getCombinedSelector(containerSelector, productPriceSelector),
        this.getCombinedSelector(containerSelector, itemSelector),
    ];

    // try to find each selector with a timeout
    for (const selector of selectors) {
        try {
            await page.waitForSelector(selector, { timeout: TIMEOUT });
        } catch (error) {
            console.error(`Error waiting for selector "${selector}": ${error}`);
            return false; // data is not present
        }
    }

    // if all selectors were found, data is present
    return true;
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
          await this.waitForImageLoad(page, this.getCombinedSelector(containerSelector, productImageSelector), 15000);
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

  console.log('fetchProductData has ran');
  return fulfilledItems;
}


  // SCRAPE :: INITIALISE CODE

  async scrape() {
    console.log(' initialise scrape - 299');

    // Define configuration constants
    // Fetch specific scraper settings & data
    let attempt = 0;
    const MAX_RETRIES = 10;
    const MIN_DELAY = 1000; // 2 seconds
    const MAX_DELAY = 2500; // 5 seconds

    // set stealth

    puppeteer.use(stealthPlugin());
    puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());

    const productNameSelector = this.scraperSettings.productNameSelector;
    const productPriceSelector = this.scraperSettings.productPriceSelector;
    const itemSelector = this.scraperSettings.urlSelector;
    const nextPageSelector = this.scraperSettings.nextPageSelector;
    const pagination = this.scraperSettings.pagination;
    const productImageSelector = this.scraperSettings.productImageSelector;
    const containerSelector = this.scraperSettings.containerSelector;
    const decategorie = this.scraperSettings.category;

    // set launchOptions to start browser
    let launchOptions = {
      headless: true
    };

    // set options if production only..
    if (process.env.ENVIRONMENT === "production") {
      console.log('production environment settings');
      launchOptions = {
        ...launchOptions,
        ignoreHTTPSErrors: true,
        devtools: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
          "--disable-features=IsolateOrigins,site-per-process", 
          '--blink-settings=imagesEnabled=true',
          '--disable-features=site-per-process',
          '--disable-accelerated-2d-canvas',
          '--flag-switches-begin',
          '--disable-site-isolation-trials',
          '--flag-switches-end',
          "--disable-notifications", // to disable native notification window on Mac OS 
          "--no-zygote",
          '--single-process',
        ]
      };
    }

    // launch browser
    const browser = await puppeteer.launch(launchOptions);
    let page;

    while (attempt < MAX_RETRIES) {
      try {

        if (page && !page.isClosed()) {
          this.randomDelay(10000, 20000);
          console.log('Closing existing page...');
          await page.close();
          this.randomDelay(1000, 10000);
        }

        // create new page
        console.log('Creating new page... 338');
        page = await browser.newPage();
        console.log('Page created, applying settings - 345');
        // call to setupPage where we apply settings and proxy if not first attempt
        await this.setupPage(page, attempt);
        console.log('After applying settings and or proxy - 350');

         // attempt to load page
        console.log('attempting to load ', this.url);
        await this.navigateToPage(page, this.url);
        console.log('After loading page - 353');

        console.log('Page loaded; attempting to detect correct data - 279');
        console.log('Running random delay');
        this.randomDelay(1000, 3500);


        // verify page contents, logs html for debugging

        // if(await page.content()){
        //   console.log(await page.content());
        // }

        // Data detection: check if the correct data is present on the page
        if (!await this.isDataPresent(page, containerSelector, productNameSelector, productPriceSelector, itemSelector)) {
          throw new Error('Data not found on page');
        }

        // If everything goes well, break the loop
        console.log('All seems well, moving to scraping process - 365');
        break;

      } catch (error) {
        // If an error occurs, log it, close the page, and increment the attempt counter
        console.error(`Scrape attempt ${attempt+1} failed: ${error}`);

        await page.close();
        attempt++;
      } 
    }

    if (attempt >= MAX_RETRIES) {
      await browser.close();
      throw new Error('Max retries exceeded');
    }

    // WE SHOULD ONLY PASS THIS IF DATA IS CORRECTLY LOADED

    let items = [];
    let currentPage = 1;
    let hasNextPage = true;
    let currentUrl = this.url;
    console.log(`Line 383: Current URL: ${currentUrl}`);

    try {

      console.log('initiate scraping process - 390');

      while (hasNextPage && currentUrl) {
        console.log('Current page: ', currentPage);

        let randomDelay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
        await page.waitForTimeout(randomDelay);

        const pageItems = await this.fetchProductData(page, containerSelector, productNameSelector, productPriceSelector, itemSelector, productImageSelector, decategorie);
        console.log('got pageItems');
        items.push(...pageItems);

        // IN CASE OF PAGINATION
        // CHANGE FOR DIFFERENT WEBSHOPS
        try {

            if(nextPageSelector){

            console.log('pagination activated');
            const lastPaginationItem = await page.$(nextPageSelector);
            console.log('fetching paginationItem');
            console.log('lastPaginationItem: ', lastPaginationItem);
            let nextPageHref = null;

            if (lastPaginationItem) {
                  console.log('pagination detected');
                  console.log('volgende pagina knop detected');
                  nextPageHref = await lastPaginationItem.evaluate(el => el.href);
                  currentPage++;
                  currentUrl = nextPageHref;
                  this.url = nextPageHref;
                  hasNextPage = true;  // There's a next page
                  console.log('going to next page');
                  await this.navigateToPage(page, nextPageHref);
            } else {
              currentUrl = null;
              hasNextPage = false;
              await page.close();
            }
          } else {
              currentUrl = null;
              hasNextPage = false;
              await page.close();
          }
        } catch (error) {
          console.error('Error in main scrape function:', error);
          await page.close();
        }
      }
      console.log('return items: ', items);
      return items;
    } catch (error) {
      console.error('Error in main scrape function:', error);
    } finally {
      await browser.close();
    }
  }


}
        

module.exports = PuppeteerScraper;
