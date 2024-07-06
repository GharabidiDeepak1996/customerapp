import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {doAddToCart} from './service';

const initialState = {
  data: null,
  isLoading: false,
  isError: false,
};

const cartApiSlice = createSlice({
  name: 'CartApi',
  initialState,
  extraReducers: builder => {
    builder.addCase(doAddToCart.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(doAddToCart.fulfilled, (state, action) => {
      console.log('fulfilled', action.payload);
      state.isLoading = false;

      state.data = action.payload;
    });
    builder.addCase(doAddToCart.rejected, (state, action) => {
      console.log('rejected', action);

      (state.isLoading = false), (state.isError = true);
    });
  },
});

// Action creators are generated for each case reducer function
//export const {setPayloadMessage} = loginSlice.actions;
export default cartApiSlice.reducer;
