import axios from 'axios';
import Globals from '../../utils/Globals';
import { baseUrl } from '../../utils/baseApi';
console.log("Globals.baseUrl===>", baseUrl)
const instance = axios.create({
  //http://103.209.36.67:1167/
  //baseURL: 'http://172.16.0.2:1166/customer/', // Replace with your API base URL
  //baseURL: 'http://103.209.36.67:1166/customer/',
  baseURL: Globals.baseUrl,
  timeout: 15000,
  timeoutErrorMessage: 'TIMEOUT',
  headers: {
    'Content-Type': 'application/json', // Set the Content-Type header to application/json
  },
});

export default instance;
