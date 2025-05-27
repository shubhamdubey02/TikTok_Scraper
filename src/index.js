require('dotenv').config();
const connectDB = require('./database');
const { scrapeTikTokShop } = require('./scrapers/tiktokShop');

(async () => {
  await connectDB();
  await scrapeTikTokShop();
})();

