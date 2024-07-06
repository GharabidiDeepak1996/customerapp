import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {doRegister} from './Service';

const initialState = {
  data: null,
  isLoading: false,
  isError: false,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  extraReducers: builder => {
    builder.addCase(doRegister.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(doRegister.fulfilled, (state, action) => {
      console.log('fulfilled', action.payload);
      state.isLoading = false;

      state.data = action.payload;
    });
    builder.addCase(doRegister.rejected, (state, action) => {
      console.log('rejected', action);

      (state.isLoading = false), (state.isError = true);
    });
  },
});

// Action creators are generated for each case reducer function
//export const {setPayloadMessage} = loginSlice.actions;
export default registerSlice.reducer;
