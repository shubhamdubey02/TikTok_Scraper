function stringToNumber(str) {
    // Remove any commas from the string
    const cleanedString = str.replace(/,/g, '');

    // Convert the cleaned string to a number
    const number = Number(cleanedString);

    // Check if the conversion was successful, if not return 0 or handle it as needed
    if (isNaN(number)) {
        console.warn(`Invalid number format: ${str}`);
        return 0; // or throw an error depending on your needs
    }

    return number;
}
module.exports = { stringToNumber }