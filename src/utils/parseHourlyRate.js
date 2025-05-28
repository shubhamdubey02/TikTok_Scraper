
function parseHourlyRate(hourlyRateStr) {
    if (!hourlyRateStr) return [];

    hourlyRateStr = hourlyRateStr.toLowerCase().replace('/hr', '').trim();

    const result = [];

    // Range
    if (hourlyRateStr.includes(' - ')) {
        const [min, max] = hourlyRateStr.split(' - ').map(x => x.trim());
        result.push({ type: 'min-rate', value: min });
        result.push({ type: 'max-rate', value: max });
        return result;
    }

    // Fixed less-than
    if (hourlyRateStr.startsWith('<')) {
        result.push({ type: 'fixed:less-than', value: hourlyRateStr.replace('<', '').trim() });
        return result;
    }

    // Fixed greater-than
    if (hourlyRateStr.startsWith('>')) {
        result.push({ type: 'fixed:greater-than', value: hourlyRateStr.replace('>', '').trim() });
        return result;
    }

    // From
    if (hourlyRateStr.startsWith('from ')) {
        result.push({ type: 'min-rate', value: hourlyRateStr.replace('from', '').trim() });
        return result;
    }

    // Starting at
    if (hourlyRateStr.startsWith('starting at ')) {
        result.push({ type: 'min-rate', value: hourlyRateStr.replace('starting at', '').trim() });
        return result;
    }

    // Upto / up to
    if (hourlyRateStr.startsWith('upto ')) {
        result.push({ type: 'max-rate', value: hourlyRateStr.replace('upto', '').trim() });
        return result;
    }

    if (hourlyRateStr.startsWith('up to ')) {
        result.push({ type: 'max-rate', value: hourlyRateStr.replace('up to', '').trim() });
        return result;
    }

    // Exact value
    if (/^\$\d+/.test(hourlyRateStr)) {
        result.push({ type: 'fixed:exact', value: hourlyRateStr.trim() });
        return result;
    }

    return []; // Unknown pattern
}


module.exports = {
    parseHourlyRate
}