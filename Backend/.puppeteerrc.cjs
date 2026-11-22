const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Store the Chrome binary inside the Backend folder so Render doesn't delete it
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
