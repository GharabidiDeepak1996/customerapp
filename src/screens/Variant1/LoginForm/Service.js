import {createAsyncThunk} from '@reduxjs/toolkit';
import {axiosHttpClient} from '../../../apis/axiosHttpClient';
import axiosErrorHandler from '../../../apis/axiosErrorHandler';
export const doLogin = createAsyncThunk(
  'login',
  async (requestData, thunkAPI) => {
    try {
      const response = await axiosHttpClient(null).post(
        'Authentication/login',
        requestData,
      );
      console.log('LoginService===', response.status);
      return response.data;
    } catch (error) {
      console.log('LoginService4654===', error.message);

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
