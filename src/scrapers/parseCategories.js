const puppeteer = require('puppeteer');

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,  // set to true if you don't want to see browser
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to TikTok Shop...');
        await page.goto('https://www.tiktok.com/shop', {
            waitUntil: 'networkidle2',
            timeout: 60000,
        });

        console.log('Scrolling page to load all categories...');
        await autoScroll(page);

        console.log('Extracting categories...');
        const categories = await page.evaluate(() => {
            // Find all <a> tags linking to /shop/ with text
            const links = Array.from(document.querySelectorAll('a'));
            const categoryLinks = links.filter(a =>
                a.href.includes('/shop/') &&
                a.innerText.trim().length > 0
            );

            return categoryLinks.map(a => ({
                name: a.innerText.trim(),
                url: a.href,
                image: a.querySelector('img') ? a.querySelector('img').src : null,
                altText: a.querySelector('img') ? a.querySelector('img').alt : null,
            }));
        });

        console.log('Categories found:', categories.length);
        console.log(JSON.stringify(categories, null, 2));

    } catch (err) {
        console.error('Scraping failed:', err);
    } finally {
        await browser.close();
    }
})();
