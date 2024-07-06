import axios from 'axios';
import Globals from '../utils/Globals';

export const axiosHttpClient = (token = null) => {
  // const baseURL = process.env.BASE_URL_ASLI_LOCAL;
  const baseURL = Globals.baseURL;
  let defaultOptions;
  if (!!token) {
    defaultOptions = {
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        //TokenKey: token,
      },
    };
  } else {
    defaultOptions = {
      baseURL: Globals.baseURL,
      //baseURL: process.env.BASE_URL_ASLI_LOCAL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
  console.log(defaultOptions);
  let instance = axios.create(defaultOptions);
  instance.interceptors.request.use(function (config) {
    return config;
  });
  instance.interceptors.response.use(
    response => {
      console.log('Axio response', JSON.stringify(response.data));
      return response;
    },
    error => {
      console.log('Axio error', JSON.stringify(response.data));
      return Promise.reject(error);
    },
  );
  return instance;
};
