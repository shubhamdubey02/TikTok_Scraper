const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Set to false to avoid detection
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto('https://www.tiktok.com/shop/c/fashion-accessories/605248', {
        waitUntil: 'networkidle2',
        timeout: 0,
    });

    // Wait longer and more reliably
    try {
        await page.waitForSelector('.category-item-Y9CQFP', { timeout: 45000 });
    } catch (e) {
        console.error('❌ Selector not found:', e);
        await browser.close();
        return;
    }

    const data = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.category-item-Y9CQFP'));
        return items.map(el => ({
            name: el.querySelector('h3')?.innerText.trim() || '',
            link: el.href,
            image: el.querySelector('img')?.src || ''
        }));
    });

    console.log(data);

    fs.writeFileSync('fashion_accessories.json', JSON.stringify(data, null, 2));

    await browser.close();
})();
