const puppeteer_extra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { USER_AGENT } = process.env;
puppeteer_extra.use(StealthPlugin());

async function launchBrowser_extra(status = true) {
    return await puppeteer_extra.launch({
        headless: status,
        args: [
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--disable-setuid-sandbox",
        ],
    });
}

async function safeGoto_extra(page, url, timeout = 60000) {
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout,
    });
}
async function setupPage_extra(browser) {
    const page = await browser.newPage();

    await page.setUserAgent(
        USER_AGENT
    );

    await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
    });

    return page;
}

module.exports = {
    puppeteer_extra,
    launchBrowser_extra,
    setupPage_extra,
    safeGoto_extra
};
