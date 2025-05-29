const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
        console.log('🔗 Navigating to Fashion Accessories category...');
        await page.goto('https://www.tiktok.com/shop/c/fashion-accessories/605248', {
            waitUntil: 'networkidle2',
            timeout: 0,
        });


        await page.waitForSelector('a[data-id]', { timeout: 45000 });


        const data = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('a[data-id]'));
            return items
                .filter(el => el.querySelector('h3'))
                .map(el => ({
                    id: el.getAttribute('data-id') || '',
                    name: el.querySelector('h3')?.innerText.trim() || '',
                    link: el.href || '',
                    image: el.querySelector('img')?.src || '',
                }));
        });

        console.log(`✅ Categories extracted: ${data.length}`);
        fs.writeFileSync('fashion_accessories.json', JSON.stringify(data, null, 2));
        console.log('✅ Data saved to fashion_accessories.json');

    } catch (err) {
        console.error('❌ Error during scraping:', err.message);
    } finally {
        await browser.close();
        console.log('✅ Browser closed');
    }
})();
