import { Platform } from "react-native";

const baseUrl = Platform.select({
    local: process.env.BASE_URL,
    development: process.env.BASE_URL,
    production: process.env.BASE_URL,

});
const imgBaseURL = Platform.select({
    local: process.env.IMAGE_BASE_URL,
    development: process.env.IMAGE_BASE_URL,
    production: process.env.IMAGE_BASE_URL,
});

const baseUrlForPayment = Platform.select({
    local: process.env.BASE_URL_PAYMENT,
    development: process.env.BASE_URL_PAYMENT,
    production: process.env.BASE_URL_PAYMENT,
});

export { baseUrl, baseUrlForPayment, imgBaseURL }