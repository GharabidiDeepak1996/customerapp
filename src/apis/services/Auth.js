import { bool } from 'prop-types';
import axios from '../axios/axios';
import { handleHttpError } from '../errorHandle/errorHandle';
import DeviceInfo from 'react-native-device-info';
// Example function to make a request

const RegisterShop = async body => {
  console.log('bodyRegisterShop', body);
  try {
    const response = await axios.post('/Shop/register', body); // Replace with your API endpoint
    console.log('DataShopResponse=>', response.data);
    return response;
  } catch (error) {
    console.log('Error in Register Shop:', error);
    handleHttpError(error);
  }
};
const RegisterTransporter = async body => {
  console.log('bodyRegisterTransporter', body);
  try {
    const response = await axios.post('/Transporter/register', body); // Replace with your API endpoint
    console.log('DataTransporterResponse=>', response.data);
    return response;
  } catch (error) {
    console.log('Error in Register Transporter:', error);
    handleHttpError(error);
  }
};
const RegisterRestaurant = async body => {
  console.log('bodyRegisterRestaurant', body);

  try {
    const response = await axios.post('/Restaurant/register', body); // Replace with your API endpoint
    console.log('DataRestaurantResponse=>', response.data);
    return response;
  } catch (error) {
    console.log('Error in Register Restaurant:', error);
    handleHttpError(error);
  }
};

const RegisterCourier = async body => {
  console.log('bodyRegisterCourier', body);
  try {
    const response = await axios.post('/Courier/register', body); // Replace with your API endpoint
    console.log('DataCourierResponse=>', response.data);
    return response;
  } catch (error) {
    console.log('Error in Register Courier:', error);
    handleHttpError(error);
  }
};

const LoginUser = async body => {
  console.log('bodyLoginUser', body);
  try {
    const response = await axios.post('/Authentication/login', body); // Replace with your API endpoint
    console.log('DataLoginResponse', response.data);
    return response;
  } catch (error) {
    console.log('Error in Login User:', error);
    handleHttpError(error);
    //return error;
  }
};

const ForgotPassword = async body => {
  console.log('bodyLoginUser', body);
  try {
    const response = await axios.post('Customer/forget-password', body); // Replace with your API endpoint
    console.log('DataResponseForgotPassword=>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Forgot Password Reset:', error);
    handleHttpError(error);
  }
};
const getProvince = async body => {
  console.log('bodyLoginUser', body);
  try {
    const response = await axios.get('/Province'); // Replace with your API endpoint
    console.log('DataResponsegetProvince=>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in getProvince:', error);
    handleHttpError(error);
  }
};

const getCity = async id => {
  try {
    const response = await axios.get(`/City/${id}`); // Replace with your API endpoint
    console.log('bodygetCity:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Get City: ', error);
    handleHttpError(error);
  }
};
const getStoreDetails = async productId => {
  console.log('product-wise-shops===', productId);
  const deviceId = await DeviceInfo.getUniqueId();
  try {
    const response = await axios.get(
      `/Product/get-product-wise-shops/${productId}/${deviceId}`,
    ); // Replace with your API endpoint
    console.log('DataResponsegetStoreDetails=>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in getStoreDetails:', productId);
    handleHttpError(error);
  }
};

const getDistrict = async id => {
  try {
    const response = await axios.get(`/District/${id}`); // Replace with your API endpoint
    console.log('bodygetDistrict:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};

const registerUser = async body => {
  try {
    const response = await axios.post('/Customer/register', body); // Replace with your API endpoint
    return response;
  } catch (error) {
    console.log('Error in registerUser: ', error);

    handleHttpError(error);
  }
  // try {
  //   axios.post('/Customer/register', body).then((res) => {
  //     console.log('in registerUser: ', res);
  //     //  return res
  //   }).catch((error) => {
  //     console.log('in registerUser error: ', error);
  //     // return error
  //   })
  // } catch (err) {
  //   console.log('in registerUser---: ', err);
  // }
};

const addToCart = async body => {
  try {
    const response = await axios.post('Cart/add-to-cart', body); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const logout = async body => {
  try {
    const response = await axios.post('authentication/logout', body); // Replace with your API endpoint
    return response;
  } catch (err) {
    handleHttpError(err);
    console.log('Error', err);
  }
};
const getProvincee = async () => {
  try {
    const response = await axios.get(`/ServicedLocation/get-serviced-district`); // Replace with your API endpoint
    console.log('bodygetDistrict:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};
const getLocationId = async deliveryType => {
  try {
    console.log('response location id ====>:', deliveryType);
    const response = await axios.get(
      `/ServicedLocation/get-serviced-location/${deliveryType}`,
    ); // Replace with your API endpoint
    // console.log('response location id ====>:', response.data);
    return response;
  } catch (error) {
    // console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};

const getWelcomeBanners = async () => {
  try {
    const response = await axios.get(`/Banner`); // Replace with your API endpoint
    console.log('response Banner  ====>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in response Banner: ', error);
    handleHttpError(error);
  }
};

const setChangePassword = async (body, userId) => {
  console.log('body===>', body);
  console.log('body===>', userId);

  try {
    const response = await axios.post(
      `customer/change-password/${userId}`,
      body,
    ); // Replace with your API endpoint
    console.log('response set Change Password=>>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Get set Change Password: ', error);
    handleHttpError(error);
  }
};
export const AuthService = {
  RegisterCourier,
  RegisterShop,
  RegisterTransporter,
  RegisterRestaurant,
  LoginUser,
  registerUser,
  ForgotPassword,
  getDistrict,
  getCity,
  getProvince,
  addToCart,
  getStoreDetails,
  logout,
  getProvincee,
  getLocationId,
  setChangePassword,

  getWelcomeBanners,
};
