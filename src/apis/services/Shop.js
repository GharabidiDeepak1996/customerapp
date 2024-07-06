import DeviceInfo from 'react-native-device-info';
import axios from '../axios/axios';
import { handleHttpError } from '../errorHandle/errorHandle';
const getGroceryNearShop = async (body) => {
  console.log("================================", body)
  try {
    const response = await axios.post('/ShopOwner/get-nearby-shops', body);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
}
const getRestaurantNearShop = async (body) => {
  console.log("================================", body)

  try {
    const response = await axios.post('/RestaurantPartner/get-nearby-shops', body);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
}
const getFreshNearShop = async (body) => {
  try {
    const response = await axios.post('/Retailer/get-nearby-shops', body);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
}

const getCategories = async categoryTypeId => {
  try {
    const response = await axios.get(
      `/Category/get-categories/${categoryTypeId}`,
    ); // Replace with your API endpoint

    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getStoreWiseProduct = async (storeId, uniqueId, categoryTypeId) => {
  console.log('getStoreWiseProduct===========================', storeId, uniqueId, categoryTypeId);
  let response
  try {
    if (categoryTypeId == 1 || categoryTypeId == 2) {
      response = await axios.get(
        `/Product/get-partner-wise-products/${storeId}/${uniqueId}`,
      );
    } else if (categoryTypeId == 5) {
      response = await axios.get(
        `/Retailer/get-partner-wise-products/${storeId}/${uniqueId}`,
      );
    }

    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getUserFavourites = async UserId => {
  try {
    const response = await axios.get(`/UserFavoritePartner/${UserId}`);

    console.log('get-partner-wise--', response);

    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
export const ShopService = {
  getGroceryNearShop,
  getRestaurantNearShop,
  getFreshNearShop,
  getCategories,
  getStoreWiseProduct,
  getUserFavourites,
};
