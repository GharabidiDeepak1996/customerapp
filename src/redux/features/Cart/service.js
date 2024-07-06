import {createAsyncThunk} from '@reduxjs/toolkit';
import {axiosHttpClient} from '../../../apis/axiosHttpClient';
import axiosErrorHandler from '../../../apis/axiosErrorHandler';
export const doAddToCart = createAsyncThunk(
  'cart',
  async (requestData, thunkAPI) => {
    try {
      const response = await axiosHttpClient(null).post(
        'Cart/add-to-cart',
        requestData,
      );
      console.log('doAddToCart===', response.status);
      return response.data;
    } catch (error) {
      console.log('doAddToCart===', error.message);

      return thunkAPI.rejectWithValue(error.message);
      // console.log(
      //   'LoginService===',
      //   thunkAPI.rejectWithValue(error.response.data),
      // );
      // throw axiosErrorHandler(error);
      // return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
