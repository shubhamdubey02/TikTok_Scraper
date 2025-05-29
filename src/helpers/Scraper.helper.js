async function findElementWithFallback(page, {
    text,
    partialClass,
    fallbackSelector,
    fallbackIndex = 0,
    click = true,
} = {}) {
    let element = null;

    if (text) {
        try {
            const elements = await page.$x(`//a[contains(text(), '${text}')]`);
            if (elements.length > 0) {
                element = elements[0];
                if (click) await element.click();
                return element;
            }
        } catch { }
    }

    if (partialClass) {
        try {
            await page.waitForSelector(`a[class*="${partialClass}"]`, { timeout: 3000 });
            const elements = await page.$$(`a[class*="${partialClass}"]`);
            if (elements.length > 0) {
                element = elements[0];
                if (click) await element.click();
                return element;
            }
        } catch { }
    }


    if (fallbackSelector) {
        try {
            const elements = await page.$$(fallbackSelector);
            if (elements.length > fallbackIndex) {
                element = elements[fallbackIndex];
                if (click) await element.click();
                return element;
            }
        } catch { }
    }

    return null;
}

module.exports = { findElementWithFallback };
