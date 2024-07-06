import {bool} from 'prop-types';
import axios from '../axios/axios';
import {handleHttpError} from '../errorHandle/errorHandle';
import DeviceInfo from 'react-native-device-info';

const getTrackOrders = async (categoryTypeId, orderId) => {
  try {
    const response = await axios.post(
      `/Order/track-details/${categoryTypeId}`,
      orderId,
    ); // Replace with your API endpoint
    //const response = await axios.post(`/Order/track-details/1`, ["715320", "673558"]); // Replace with your API endpoint
    return response;
  } catch (error) {
    console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};
const getMapTrackOrders = async orderId => {
  try {
    const response = await axios.get(
      `/Order/customer-order-track-details/${orderId}`,
    ); // Replace with your API endpoint

    //const response = await axios.get(`/Order/order-track-details/${orderId}`); // Replace with your API endpoint
    //const response = await axios.post(`/Order/track-details/1`, ["715320", "673558"]); // Replace with your API endpoint
    return response;
  } catch (error) {
    console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};

const getSingleMapTrackOrders = async orderId => {
  try {
    // const response = await axios.get(
    //   `/Order/customer-order-track-details/${orderId}`,
    // ); // Replace with your API endpoint

    const response = await axios.get(`/Order/order-track-details/${orderId}`); // Replace with your API endpoint
    //const response = await axios.post(`/Order/track-details/1`, ["715320", "673558"]); // Replace with your API endpoint
    return response;
  } catch (error) {
    console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};
const trackByOrder = async trackingNo => {
  try {
    const response = await axios.get(
      `/Order/get-order-by-tracking-no/${trackingNo}`,
    );
    return response;
  } catch (error) {
    console.log('Error in Get District: ', error);
    handleHttpError(error);
  }
};

export const TrackService = {
  getTrackOrders,
  getMapTrackOrders,
  getSingleMapTrackOrders,
  trackByOrder,
};
