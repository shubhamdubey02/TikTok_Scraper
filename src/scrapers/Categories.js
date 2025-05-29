const fs = require('fs');
const puppeteer = require('puppeteer');
const { findElementWithFallback } = require('../helpers/Scraper.helper');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to TikTok Shop...');
        await page.goto('https://www.tiktok.com/shop', {
            waitUntil: 'networkidle2',
            timeout: 60000,
        });


        await new Promise(resolve => setTimeout(resolve, 5000));


        const categoryElement = await findElementWithFallback(page, {
            text: 'Design',
            partialClass: 'category-item-',
            fallbackSelector: 'a[data-id]',
            fallbackIndex: 0,
            click: false,
        });

        if (!categoryElement) {
            console.log('❌ No category element found.');
            return;
        }


        const categories = await page.$$eval('a[data-id]', (items) =>
            items
                .filter(item => item.querySelector('h3'))
                .map((item) => ({
                    id: item.getAttribute('data-id') || '',
                    name: item.querySelector('h3')?.innerText.trim() || '',
                    url: item.href || '',
                    image: item.querySelector('img')?.src || '',
                }))
        );

        console.log(`✅ Categories found: ${categories.length}`);
        fs.writeFileSync('Categories.json', JSON.stringify(categories, null, 2));
        console.log('✅ Data saved to Categories.json');

    } catch (err) {
        console.error('❌ Scraping failed:', err.message);
    } finally {
        await browser.close();
        console.log('✅ Browser closed');
    }
})();
