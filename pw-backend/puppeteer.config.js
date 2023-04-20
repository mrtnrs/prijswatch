const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  headless: true,
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
  // Set the executablePath for Puppeteer to use the environment variable.
  // "executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=egl'
  ]
};
