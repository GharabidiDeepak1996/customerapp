

export function formatNumberWithCommas(x) {


    if (x !== undefined && x !== null) {
        // Use x.toString() and replace commas
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        // Handle the case when x is undefined or null
        return "Invalid input"; // or any other appropriate message
    }

    // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //return x.toString().replace(/\B(?!.*\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    //return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}