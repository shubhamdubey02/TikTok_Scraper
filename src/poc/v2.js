const fs = require('fs');
const { puppeteer, launch } = require('../config/puppeteerConfig');

// Extract seller info + sold count + rating from product page
const getSellerAndStatsFromPDP = async (page, productUrl) => {
    try {
        console.log(`🔍 Navigating to PDP: ${productUrl}`);
        await page.goto(productUrl, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.product-title', { timeout: 10000 });
        await new Promise(res => setTimeout(res, 2000)); // Allow lazy elements to load

        const data = await page.evaluate(() => {
            const sellerElement = document.querySelector('.seller-c27aRQ');
            const name = sellerElement ? sellerElement.innerText.replace('Sold by ', '').trim() : 'N/A';

            const freeShipping = !!document.querySelector('.free-shipping__label-qxQlot');

            const soldEl = document.querySelector('.info__sold-ZdTfzQ') || document.querySelector('.sold');
            const soldCount = soldEl ? soldEl.innerText.trim().replace(/[^0-9]/g, '') : '0';

            const ratingEl = document.querySelector('.score') || document.querySelector('.product-rating span');
            const rating = ratingEl ? ratingEl.innerText.trim() : 'N/A';

            return {
                seller: {
                    name,
                    freeShipping,
                },
                soldCount,
                rating
            };
        });

        console.log(`🛍️ Seller, rating, and sold count:`, data);
        return data;
    } catch (err) {
        console.warn(`⚠️ PDP load failed for: ${productUrl}`);
        return {
            seller: { name: 'N/A', freeShipping: false },
            soldCount: '0',
            rating: 'N/A'
        };
    }
};

const getProductInsightsFromPDP = async (page, productUrl) => {
    try {
        console.log(`📊 Navigating to insights: ${productUrl}`);
        await page.goto(productUrl, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.scores-lYofhX', { timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const insights = await page.evaluate(() => {
            const shopPerformance = document.querySelector('.overall-M6xlSS > div:nth-child(2)')?.innerText.trim() || 'No data';

            const ratingText = document.querySelector('.group-fRVnAq span')?.innerText.trim() || 'N/A';
            const ratingProgress = document.querySelector('.group-fRVnAq div > div')?.style.width.trim() || 'N/A';

            const shippingText = document.querySelector('.group-fRVnAq:nth-child(2) span')?.innerText.trim() || 'N/A';
            const shippingProgress = document.querySelector('.group-fRVnAq:nth-child(2) div > div')?.style.width.trim() || 'N/A';

            const responseText = document.querySelector('.group-fRVnAq:nth-child(3) span')?.innerText.trim() || 'N/A';
            const responseProgress = document.querySelector('.group-fRVnAq:nth-child(3) div > div')?.style.width.trim() || 'N/A';

            return {
                shopPerformance,
                rating: { text: ratingText, progress: ratingProgress },
                shipping: { text: shippingText, progress: shippingProgress },
                responseTime: { text: responseText, progress: responseProgress }
            };
        });

        console.log(`📊 Product insights scraped:`, insights);
        return insights;
    } catch (err) {
        console.warn(`⚠️ Insights load failed for: ${productUrl}`);
        return {};
    }
};

(async () => {
    const browser = await puppeteer.launch(launch);
    const page = await browser.newPage();

    console.log('🌍 Launching TikTok Shop scraper...');
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    try {
        await page.goto('https://www.tiktok.com/shop', { waitUntil: 'networkidle2' });
        console.log('✅ Shop page loaded.');

        await new Promise(res => setTimeout(res, 10000)); // Ensure page fully loaded

        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('li.product-item');
            const result = [];

            for (const el of items) {
                const title = el.querySelector('h3.product-title')?.innerText.trim() || '';
                const price = el.querySelector('.sale-price .price')?.innerText.trim() || '';
                const imageUrl = el.querySelector('img.product-image')?.src || '';
                const productLink = el.querySelector('a#product_card_title_a')?.href || '';

                if (title && price && imageUrl && productLink) {
                    result.push({ title, price: `$${price}`, imageUrl, productLink });
                }
            }

            return result;
        });

        console.log(`🔍 Found ${products.length} products. Extracting details...`);

        for (const product of products) {
            const { seller, soldCount, rating } = await getSellerAndStatsFromPDP(page, product.productLink);
            product.seller = seller;
            product.soldCount = soldCount;
            product.rating = rating;

            const insights = await getProductInsightsFromPDP(page, product.productLink);
            product.insights = insights;
        }

        fs.writeFileSync('scraped_products2.json', JSON.stringify(products, null, 2));
        console.log('✅ Saved scraped data to scraped_products2.json');
    } catch (err) {
        console.error('❌ Scraper error:', err.message);
    } finally {
        await browser.close();
        console.log('🔒 Browser closed');
    }
})();
