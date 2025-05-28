function extractCountryAndRegion(location) {
    console.log('location,', location)
    const locationParts = location.split(',').map(part => part.trim());

    // If location has only one part, consider it as the country
    if (locationParts.length === 1) {
        return { region: null, country: locationParts[0] };
    }

    // If location has two parts, assume the first is the region and the second is the country
    if (locationParts.length === 2) {
        return { region: locationParts[0], country: locationParts[1] };
    }

    // Handle other cases or return null if unexpected format
    return { region: null, country: locationParts[locationParts.length - 1] };
}


module.exports = {
    extractCountryAndRegion
}