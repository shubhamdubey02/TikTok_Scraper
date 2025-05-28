const { runBehanceScraper } = require("../scrapers/behance");
const { runClutchScraper } = require("../scrapers/clutch");
const { runDribbbleScraper } = require("../scrapers/dribbble");
const { runGoodFirmsScraper } = require("../scrapers/goodfirms");

async function runAllScrapers() {
    runClutchScraper();
    runGoodFirmsScraper();
    runDribbbleScraper();
    runBehanceScraper();
}

module.exports = { runAllScrapers };
