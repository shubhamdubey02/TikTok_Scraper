const puppeteer = require('puppeteer');
const fs = require('fs');

let browser;  // global browser object

async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized'],
        });
        console.log('✅ Browser launched');
    }
    return browser;
}

/**
 * Scrapes categories from TikTok Shop pages and saves to JSON file.
 * @param {string} url - URL to scrape.
 * @param {string} outputFilename - JSON output filename.
 */
async function openNewTabAndDoSomething(url, outputFilename) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log(`Navigated to ${url}`);

        // Optional delay to let dynamic content load (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the category elements to load
        await page.waitForSelector('.category-item-Y9CQFP', { timeout: 30000 });

        // Extract data from the page
        const data = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.category-item-Y9CQFP'));
            return items.map(el => ({
                name: el.querySelector('h3')?.innerText.trim() || '',
                link: el.href,
                image: el.querySelector('img')?.src || ''
            }));
        });

        // Save data to JSON file
        fs.writeFileSync(outputFilename, JSON.stringify(data, null, 2));
        console.log(`✅ Data saved to ${outputFilename}`);

    } catch (err) {
        console.error('❌ Error scraping:', err);
    } finally {
        await page.close();
        console.log('Tab closed');
    }
}

(async () => {
    await openNewTabAndDoSomething('https://www.tiktok.com/shop', 'tiktok_shop_categories.json');
    await openNewTabAndDoSomething('https://www.tiktok.com/shop/c/fashion-accessories/605248', 'fashion_accessories.json');

    if (browser) {
        await browser.close();
        console.log('Browser closed');
    }
})();
