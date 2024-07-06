import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosHttpClient } from '../../../apis/axiosHttpClient';
import axiosErrorHandler from '../../../apis/axiosErrorHandler';
export const doRegister = createAsyncThunk(
  'register',
  async (requestData, thunkAPI) => {
    try {
      const response = await axiosHttpClient(null).post(
        'Customer/register',
        requestData,
      );
      console.log('RegService===', response.status);
      return response.data;
    } catch (error) {
      console.log('RegService4654===', error.message);

      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
