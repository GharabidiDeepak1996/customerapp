import axios from 'axios';
import {handleHttpError} from '../errorHandle/errorHandle';
import Globals from '../../utils/Globals';

const getBankDetails = async amount => {
  try {
    console.log('0000000000000000000000', `${Globals.baseUrl}/Bank`);
    const response = await axios.get(`${Globals.baseUrl}/Bank`); // Replace with your API endpoint

    return response;
  } catch (error) {
    console.log('getBankDetails ====>', amount);
    handleHttpError(error);
  }
  // try {
  //     const response = await axios.get(`${Globals.baseUrlForPayment}/Payment/${amount}`); // Replace with your API endpoint

  //     return response;
  // } catch (error) {
  //     console.log('getBankDetails ====>', amount);
  //     handleHttpError(error);
  // }
};

const getTranscationId = async body => {
  try {
    const response = await axios.post(
      `${Globals.baseUrlForPayment}/Payment`,
      body,
    ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
const getCheckTransactionStatus = async (body, merchantOrderId) => {
  try {
    console.log('getCheckTransactionStatus_body===============', body);

    const response = await axios.post(
      `${Globals.baseUrlForPayment}/Payment/check-transaction/${merchantOrderId}`,
      body,
    ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};
const checkWalletBalance = async userId => {
  try {
    const response = await axios.get(
      `${Globals.baseUrl}/Wallet/balance-amount/${userId}`,
    ); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const addWallet = async body => {
  try {
    const response = await axios.post(`${Globals.baseUrl}/Wallet/top-up`, body); // Replace with your API endpoint
    return response;
  } catch (error) {
    handleHttpError(error);
  }
};

const getPaymentMethod = async body => {
  try {
    const response = await axios.get('/PaymentMethod'); // Replace with your API endpoint
    console.log('DataResponsegetPaymentMethod=>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in getPaymentMethod:', error);
    handleHttpError(error);
  }
};
export const PaymentService = {
  getBankDetails,
  getTranscationId,
  getCheckTransactionStatus,
  checkWalletBalance,
  addWallet,
  getPaymentMethod,
};
