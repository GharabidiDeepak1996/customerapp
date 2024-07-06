import DeviceInfo from 'react-native-device-info';
import axios from '../axios/axios';
import { handleHttpError } from '../errorHandle/errorHandle';
// Example function to make a request
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/Cart/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const getOrderHistory = async userId => {
  try {
    const response = await axios.get(`/Order/${userId}`); // Replace with your API endpoint
    return response;
  } catch (error) { }
};
const getProducts = async () => {
  try {
    const response = await axios.get('/Product'); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getcartCountByStore = async (
  categoryTypeId,
  deliveryOptionId,
  userId,
) => {
  const uniqueId = await DeviceInfo.getUniqueId();

  try {
    const response = await axios.get(
      `/cart/${uniqueId}/${categoryTypeId}/${categoryTypeId == 1 || categoryTypeId == 2 ? 1 : deliveryOptionId
      }/${userId}`,
    ); // Replace with your API endpoint

    console.log('getcartCountByStore', response);

    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
const alterCartCountByStore = async body => {
  try {
    //console.log('alterCartCountByStore_body====>', body);
    const response = await axios.post('/Cart/remove-cart-item', body);
    return response;
  } catch (error) {
    console.log('/Cart/remove-cart-item====>', error);
    handleHttpError(error);
  }
};

const addCartCountByStore = async body => {
  try {
    const response = await axios.post('/Cart/add-to-cart', body); // Replace with your API endpoint
    console.log('addCartCountByStoreBody', body);
    console.log('addCartCountByStoreResponse', response);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getCartCheckOut = async (body, categoryTypeId) => {
  console.log('Body------getCartCheckOut------>', body);
  try {
    if (categoryTypeId == 1) {
      const response = await axios.post('/ShopOwner/create-orders', body); // for grocery
      console.log(
        'response---getCartCheckOut---/ShopOwner/create-orders>',
        response.data,
      );
      return response;
    } else if (categoryTypeId == 2) {
      const response = await axios.post(
        '/RestaurantPartner/create-orders',
        body,
      ); //for food
      console.log(
        'response---getCartCheckOut---/RestaurantPartner/create-orders>',
        response.data,
      );
      return response;
    } else if (categoryTypeId == 4) {
      const response = await axios.post('/Order/create-send-order', body); //for send
      console.log(
        'response---getCartCheckOut---/Order/create-send-order>',
        response.data,
      );
      return response;
    } else if (categoryTypeId == 3) {
      const response = await axios.post('/Order/create-ride-order', body); //for ride
      console.log(
        'response---getCartCheckOut---/Order/create-ride-order>',
        response.data,
      );
      return response;
    } else if (categoryTypeId == 5) {
      const response = await axios.post('/Order/create-freshGoods-order', body); //for Fresh Good
      console.log(
        'response---getCartCheckOut---/Order/create-freshGoods-order>',
        response.data,
      );
      return response;
    }
  } catch (error) {
    console.log('/ShopOwner/create-orders====>', error);

    handleHttpError(error);
  }
};

const getRouteRateForInterCitySend = async body => {
  try {
    const response = await axios.post('/Rate/route-rate', body); // for grocery
    return response;
  } catch (error) {
    console.log('/Rate/route-rate====>', error);

    handleHttpError(error);
  }
};
const getValidateProduct = async body => {
  try {
    const response = await axios.post('/Address/validate-address', body); // for grocery
    return response;
  } catch (error) {
    console.log('/Rate/route-rate====>', error);

    handleHttpError(error);
  }
};

const getGroceryProduct = async (categoryId, userId, body) => {
  console.log('Grocery PRodu', body);

  try {
    const response = await axios.post(
      '/RestaurantPartner/category-wise-products',
      body,
    ); // Replace with your API endpoint
    // const response = await axios.get(
    //   `/ShopOwner/${categoryId}/${userId}/products`,
    // ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
const getFoodProduct = async (categoryId, userId, body) => {
  console.log('Food PRodu', body);
  try {
    const response = await axios.post(`ShopOwner/category-wise-products`, body); // Replace with your API endpoint
    // const response = await axios.get(
    //   `/ShopOwner/${categoryId}/${userId}/products`,
    // ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getFreshProduct = async (categoryId, userId, body) => {
  try {
    const response = await axios.post(`Retailer/category-wise-products`, body); // Replace with your API endpoint
    // const response = await axios.get(
    //   `/ShopOwner/${categoryId}/${userId}/products`,
    // ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

// const addToFavourites = async request => {
//   console.log('-==-=-=-=--==================-', request);
//   try {
//     const response = await axios.post(`UserFavoritePartner/save`, request); // Replace with your API endpoint
//     return response;
//   } catch (error) {
//     handleHttpError(error);
//   }
// };

const getDimensionForSend = async () => {
  try {
    const response = await axios.get(`/Dimension/get-dimensions`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getRate = async body => {
  try {
    const response = await axios.post(`/Rate`, body); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getInterIsLandRate = async () => {
  try {
    const response = await axios.get(`/InterIslandRate`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getPaymentMethods = async () => {
  try {
    const response = await axios.get(`/Dimension/get-dimensions`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getTypesOfGoodsForSend = async () => {
  try {
    const response = await axios.get(`/SendType`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getPickupTypeForInterCity = async () => {
  try {
    const response = await axios.get(`/TransitionMethods/get-pickup-method`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getDeliverTypeForInterCity = async () => {
  try {
    const response = await axios.get(`/TransitionMethods/get-delivery-method`); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const addToFavourite = async body => {
  console.log('body rate ====>', body);
  try {
    const response = await axios.post(`/UserFavoritePartner/save`, body); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const removeFromFavourite = async (UserId, PartnerId) => {
  try {
    const response = await axios.post(
      `/UserFavoritePartner/remove/${UserId}/${PartnerId}`,
    );
    console.log('removeFromFavourite', response.data);
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

export const ProductService = {
  getProducts,
  getcartCountByStore,
  alterCartCountByStore,
  addCartCountByStore,
  getCartCheckOut,
  getRouteRateForInterCitySend,
  getPickupTypeForInterCity,
  getDeliverTypeForInterCity,
  getOrderHistory,
  getGroceryProduct,
  getFoodProduct,
  getFreshProduct,
  //addToFavourites,
  getDimensionForSend,
  getPaymentMethods,
  getRate,
  getTypesOfGoodsForSend,
  addToFavourite,
  removeFromFavourite,
  getValidateProduct,
  getInterIsLandRate
};
