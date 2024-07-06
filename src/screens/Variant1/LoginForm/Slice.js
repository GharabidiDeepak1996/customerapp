import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doLogin } from './Service';
import { act } from 'react-test-renderer';

const initialState = {
  data: null,
  isLoading: false,
  isError: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers: builder => {
    builder.addCase(doLogin.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(doLogin.fulfilled, (state, action) => {
      console.log('fulfilled', action.payload);
      state.isLoading = false;

      state.data = action.payload;
    });
    builder.addCase(doLogin.rejected, (state, action) => {
      console.log('rejected', action);

      (state.isLoading = false), (state.isError = true);
    });
  },
});

// Action creators are generated for each case reducer function
//export const {setPayloadMessage} = loginSlice.actions;
export default loginSlice.reducer;
