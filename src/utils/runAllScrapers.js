const scrapeCategories = require('../scrapers/Categories');
const scrapeFashionAccessories = require('../scrapers/subCategories');
const { closeBrowser } = require('../scrapers/puppeteerBrowser');

(async () => {
    await scrapeCategories();
    await scrapeFashionAccessories();
    await closeBrowser(); // Only close after all tasks are done
})();
