const puppeteer = require('puppeteer');

const { USER_AGENT } = process.env;

async function launchBrowser(status = true) {
    return await puppeteer.launch({
        headless: status,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
}

async function createPage(browser, userAgent = USER_AGENT) {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    return page;
}

async function safeGoto(page, url, timeout = 60000) {
    console.log('urlurl', url);
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout,
    });
}

async function waitForSelectorSafe(page, selector) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout: 15000 });
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    launchBrowser,
    createPage,
    safeGoto,
    waitForSelectorSafe,
};
