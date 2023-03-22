// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }

// const proxyServers = [
//   // 'http://78.47.233.96:8080',
//   // 'http://195.201.41.237:8080',
//   'http://116.203.252.129:8080',
//   'http://167.235.255.199:8080',
//   'http://13.95.173.197:80'
// ];

// const userAgents = [
//   // Chrome
//   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
//   'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
//   'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
//   'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36',

//   // Firefox
//   'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
//   'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
//   'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
//   'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',

//   // Safari
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5',
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',

//   // Edge
//   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
//   'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',

//   // Internet Explorer
//   'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
//   'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
//   'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)'
// ]

// function getRandomUserAgent() {
//   return userAgents[Math.floor(Math.random() * userAgents.length)];
// }

// function getRandomProxy() {
//   return proxyServers[Math.floor(Math.random() * proxyServers.length)];
// }

// function delay(min, max) {
//   const randomDelay = Math.floor(Math.random() * (max - min + 1) + min);
//   return new Promise((resolve) => setTimeout(resolve, randomDelay));
// }

// async function scrapeWebshop1(baseURL) {

//   const proxyUrl = getRandomProxy();
//   console.log('using ' + proxyUrl);

//   const browser = await puppeteer.launch({
//   headless: false,
//   args: [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//   ],
// });
//   let currentPage = 1;
//   let isLastPage = false;
//   const products = [];

//   while (!isLastPage) {
//     const page = await browser.newPage();
//     await page.setUserAgent(getRandomUserAgent());
//     await page.setViewport({ width: 1280, height: 800 });
//     await page.evaluateOnNewDocument(() => {
//     const originalRTCPeerConnection = window.RTCPeerConnection;
//       window.RTCPeerConnection = function (...args) {
//         const pc = new originalRTCPeerConnection(...args);
//         pc.createDataChannel('');
//         return pc;
//       };
//     });
//     await page.setExtraHTTPHeaders({
//       'Feature-Policy': 'sync-xhr "none"'
//     });
//     const url = `${baseURL}?page=${currentPage}&pageSize=96`;
//     await Promise.all([
//       page.goto(url),
//       page.waitForNavigation({ waitUntil: 'networkidle0' }), // or try 'networkidle2'
//     ]);
//     await delay(5000, 10000); // Wait for a random delay between 5 to 10 seconds

//     const content = await page.content();
//     if (content.includes('Access Denied')) {
//       console.log('Access denied, rotating proxy and retrying...');
//       await page.close();
//       await scrapeWebshop1(baseURL);
//     } else {

//     console.log('hey');

//     // Replace the selectors below with the appropriate selectors for the webshop you're targeting
//     const productSelector = 'section.product-grid-results > div.row > div'; // e.g., CSS class for product container
//     const nextPageSelector = 'div.pagination-numbers > span:first-of-type'; // e.g., CSS selector for the next page button

//     await page.waitForSelector(productSelector);
//     const productTiles = await page.$$(productSelector);

//     console.log(productTiles);

//     for (const productTile of productTiles) {
//       const trackingDataJSON = await productTile.$eval('[data-tracking-commerce]', el => el.getAttribute('data-tracking-commerce'));
//       const trackingData = JSON.parse(trackingDataJSON);

//       const name = trackingData.name;
//       const id = trackingData.id;
//       const price = trackingData.price;
//       const category = trackingData.category;

//       products.push({
//         id,
//         name,
//         price,
//         category
//       });
//     }

//     const nextPageButton = await page.$(nextPageSelector);
//     if (nextPageButton) {
//       currentPage++;
//     } else {
//       isLastPage = true;
//     }

//     await page.close();
//   }

//   await browser.close();
//   return products;
// }
// }

// module.exports = scrapeWebshop1;