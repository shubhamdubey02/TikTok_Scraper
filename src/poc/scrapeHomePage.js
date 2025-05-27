const fs = require('fs');
const { puppeteer, launch } = require('../config/puppeteerConfig');

// Function to extract seller info from the product page
const getSellerInfoFromPDP = async (page, productUrl) => {
    try {
        console.log(`🔍 Navigating to product page: ${productUrl}`);
        await page.goto(productUrl, { waitUntil: 'networkidle2' });

        console.log('⏳ Waiting for product description to load...');
        await page.waitForSelector('.title-v0v6fK', { timeout: 10000 });  // Wait for the title element to load

        // Wait for a few more seconds to ensure the content has fully loaded
        await new Promise(resolve => setTimeout(resolve, 2000));  // Replacing waitForTimeout with setTimeout

        console.log(`👩‍💼 Scraping seller info from: ${productUrl}`);
        const seller = await page.evaluate(() => {
            // Extract seller info from the container
            const sellerElement = document.querySelector('.seller-c27aRQ');
            const name = sellerElement ? sellerElement.innerText.replace('Sold by ', '') : 'N/A';
            
            // Extract sold count
            const soldCountElement = document.querySelector('.info__sold-ZdTfzQ');
            const soldCount = soldCountElement ? soldCountElement.innerText : 'N/A';

            // Check for free shipping
            const freeShippingElement = document.querySelector('.free-shipping__label-qxQlot');
            const freeShipping = freeShippingElement ? true : false;

            return { name, soldCount, freeShipping };
        });

        console.log(`🛍️ Seller info scraped:`, seller);
        return seller;
    } catch (err) {
        console.warn(`⚠️ PDP load failed for: ${productUrl}`);
        return {};
    }
};

// Function to extract product insights
const getProductInsightsFromPDP = async (page, productUrl) => {
    try {
        console.log(`🔍 Navigating to product insights page: ${productUrl}`);
        await page.goto(productUrl, { waitUntil: 'networkidle2' });

        console.log('⏳ Waiting for product data to load...');
        await page.waitForSelector('.scores-lYofhX', { timeout: 10000 });  // Wait for product insights section to load

        // Wait for a few more seconds to ensure the content has fully loaded
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`🔍 Scraping product insights from: ${productUrl}`);
        const productInsights = await page.evaluate(() => {
            const shopPerformance = document.querySelector('.overall-M6xlSS > div:nth-child(2)')?.innerText.trim() || 'No performance data available';
            const ratingText = document.querySelector('.group-fRVnAq span')?.innerText.trim() || 'No rating available';
            const ratingProgress = document.querySelector('.group-fRVnAq div > div')?.style.width.trim() || 'No rating progress available';
            const shipsWithinText = document.querySelector('.group-fRVnAq:nth-child(2) span')?.innerText.trim() || 'No shipping info available';
            const shipsWithinProgress = document.querySelector('.group-fRVnAq:nth-child(2) div > div')?.style.width.trim() || 'No shipping progress available';
            const respondsWithinText = document.querySelector('.group-fRVnAq:nth-child(3) span')?.innerText.trim() || 'No response time info available';
            const respondsWithinProgress = document.querySelector('.group-fRVnAq:nth-child(3) div > div')?.style.width.trim() || 'No response time progress available';

            return {
                shopPerformance,
                rating: {
                    text: ratingText,
                    progress: ratingProgress
                },
                shipping: {
                    text: shipsWithinText,
                    progress: shipsWithinProgress
                },
                responseTime: {
                    text: respondsWithinText,
                    progress: respondsWithinProgress
                }
            };
        });

        console.log(`🛍️ Product insights scraped:`, productInsights);
        return productInsights;
    } catch (err) {
        console.warn(`⚠️ Product insights load failed for: ${productUrl}`);
        return {};
    }
};


(async () => {
    const browser = await puppeteer.launch(launch);
    const page = await browser.newPage();

    console.log('🔄 Launching browser and opening new page...');
    
    await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    );

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });

    try {
        console.log('🌐 Navigating to TikTok Shop...');
        // Navigate to TikTok Shop page
        await page.goto('https://www.tiktok.com/shop', { waitUntil: 'networkidle2' });
        console.log('✅ TikTok Shop page loaded.');
        
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for page to load

        console.log('🔍 Scraping product data...');
        // Scrape products
        const products = await page.evaluate(async () => {
            const productEls = document.querySelectorAll('li.product-item');
            const results = [];

            // Use a loop that supports async/await
            for (const el of productEls) {
                const title = el.querySelector('h3.product-title')?.innerText.trim() || '';
                const price = el.querySelector('.sale-price .price')?.innerText.trim() || '';
                const imageUrl = el.querySelector('img.product-image')?.src || '';
                const productLink = el.querySelector('a#product_card_title_a')?.href || '';

                console.log(`📦 Found product: ${title}`);
                
                if (title && price && imageUrl && productLink) {
                    results.push({
                        title,
                        price: `$${price}`,
                        imageUrl,
                        productLink
                    });
                } else {
                    console.warn(`⚠️ Missing required data for product: ${title}`);
                }
            }

            return results;
        });

        console.log(`🛍️ Scraped Products:`, products);

        // Now, for each product, scrape the seller and product insights
        for (const product of products) {
            const sellerInfo = await getSellerInfoFromPDP(page, product.productLink);
            product.seller = sellerInfo;  // Add seller info to product object

            const productInsights = await getProductInsightsFromPDP(page, product.productLink);
            product.insights = productInsights;  // Add product insights to product object
        }

        console.log('🛍️ Final Products with Seller and Product Insights:', products);

        // Save the scraped data to a JSON file
        fs.writeFileSync('scraped_products.json', JSON.stringify(products, null, 2));
        console.log('✅ Product data saved to scraped_products.json');
    } catch (error) {
        console.error('❌ Scraping failed:', error.message);
    } finally {
        console.log('🔚 Closing browser...');
        await browser.close();
    }
})();
