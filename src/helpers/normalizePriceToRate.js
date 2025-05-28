function normalizePriceToRate(priceString) {
    if (!priceString || typeof priceString !== 'string') return [];

    const cleaned = priceString.toLowerCase().replace(/,/g, '');
    const match = cleaned.match(/\$([\d.]+)/);
    if (!match) return [];

    const value = match[1];

    let type = 'fixed'; // default
    if (cleaned.includes('/hr') || cleaned.includes('hour')) {
        type = 'hourly';
    }

    return [{ type, value }];
}

module.exports = { normalizePriceToRate };
