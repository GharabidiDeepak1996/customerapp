


export const formatDecimalNumber = (number) => {
    const parsedNumber = parseFloat(number);

    if (isNaN(parsedNumber) || !isFinite(parsedNumber)) {
        return number; // Return as is if it's not a valid number
    }

    // Check if the number has decimal places
    const hasDecimal = parsedNumber % 1 !== 0;

    // Return the number rounded to two decimal places if it's a decimal, otherwise return the original number
    return hasDecimal ? parseFloat(parsedNumber.toFixed(2)) : parsedNumber;
};
