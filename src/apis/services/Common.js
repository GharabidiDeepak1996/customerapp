import axios from '../axios/axios';
import { handleHttpError } from '../errorHandle/errorHandle';

const getCategoriesList = async categoryTypeId => {
  try {
    const response = await axios.get(
      `/Category/get-categories/${categoryTypeId}`,
    ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
// const getCategoriesTypes = async () => {
//   try {
//     const response = await axios.get(`/Category/get-category-types`); // Replace with your API endpoint
//     return response;
//   } catch (error) {
//     handleHttpError(error);
//   }
// };

const getCategoriesTypes = async deliveryInId => {
  try {
    console.log('apivalue_deliveryInId', deliveryInId);
    const response = await axios.get(
      `/delivery/get-delivery-based-category-types/${deliveryInId}`,
    ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getRatingQuestion = async () => {
  try {
    const response = await axios.get(`/Rating`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const submitRating = async requestData => {
  try {
    const response = await axios.post(`/Rating`, requestData); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const validateOtp = async body => {
  try {
    console.log("validate opt data rece--->", body)
    const response = await axios.post(`/Customer/validated-otp`, body); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const configs = async () => {
  try {
    const response = await axios.get(`/Customer/get-configs`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
}

const golbalFilter = async (item, categoryTypeId) => {
  try {
    console.log(`========================>/Filter/${item}/${categoryTypeId}`);
    const response = await axios.get(`/Filter/${item}/${categoryTypeId} `); // Replace with your API endpoint
    console.log('global filter =====>', response.data.payload[0]);
    return response;
  } catch (error) {
    console.log('88888888888888888888888888888', error);
    // handleHttpError(error);
  }
};

const getMyOrders = async getUserId => {
  try {
    console.log(
      `========================>//Order/get-all-orders/${getUserId}}`,
    );
    const response = await axios.get(`/Order/get-all-orders/${getUserId}`); // Replace with your API endpoint
    console.log('get-all-orders =====>', response.data.payload);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getAllTransactions = async getUserId => {
  try {
    console.log(`========================>///Wallet//${getUserId}}`);
    const response = await axios.get(`/Wallet/${getUserId}`); // Replace with your API endpoint
    console.log('getAllTransactions =====>', response.data.payload);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getWalletHistory = async getUserId => {
  try {
    console.log(`========================>///Wallet//${getUserId}}`);
    const response = await axios.get(`/Wallet/wallet-history/${getUserId}`); // Replace with your API endpoint
    console.log('getAllTransactions =====>', response.data.payload);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
const getProfileUpdate = async (getUserId, body) => {
  try {
    const response = await axios.post(`/Customer/update-user-profile/${getUserId}`, body); // Replace with your API endpoint
    console.log('getProfileUpdate =====>', response?.data?.payload);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const isValidRoutes = async (sourceAddressId, destinationAddressId) => {
  try {

    const response = await axios.get(`/Route/valid-route/${sourceAddressId}/${destinationAddressId}`);
    console.log("check Validate body form serviceAPI----", sourceAddressId, destinationAddressId)

    return response;
  } catch (error) {
    handleHttpError(error);
  }
}

const routeRate = async requestData => {
  try {
    const response = await axios.post(`/Rate/route-rate`, requestData); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
export const CommomService = {
  getCategoriesList,
  getCategoriesTypes,
  getRatingQuestion,
  submitRating,
  validateOtp,
  golbalFilter,
  getMyOrders,
  getAllTransactions,
  getWalletHistory,
  routeRate,
  isValidRoutes,
  configs,
  getProfileUpdate
};
