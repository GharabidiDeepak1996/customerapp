import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  notificationData: [],
  notificationMessage: '',
  notificationChatId: '',
};

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationStore: (state, action) => {
      state.notificationMessage = action.payload;
      console.log('============storeee=================', action.payload);
    },
    notificationChatSessionId: (state, action) => {
      state.notificationChatId = action.payload;
      console.log('============storeee=================', action.payload);
    },
  },
});

export const { notificationStore, notificationChatSessionId } = NotificationSlice.actions;
export default NotificationSlice.reducer;
