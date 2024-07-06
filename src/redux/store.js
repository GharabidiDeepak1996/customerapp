import { configureStore } from '@reduxjs/toolkit';
//persist
import { combineReducers } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

import cartReducer from './features/Cart/cartSlice';
import loginReducer from '../screens/Variant1/LoginForm/Slice';
import cartapislice from './features/Cart/cartapislice';
import registerSlice from '../screens/Variant1/Signup/Slice';
import addressReducer from './features/Address/DefaultAddressSlice';
import dashboardSlice from './features/Dashboard/dashboardSlice';
//import productSlice from './features/Product/productSlice'
//import { productReducers } from './features/Product/productSlice';
import ProductSlice from './features/AddToCart/ProductSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import persistStore from 'redux-persist/es/persistStore';
import notificationSlice from './features/Notification/notificationSlice';
const rootReducer = combineReducers({
  cart: cartReducer,
  loginReducer: loginReducer,
  cartApiReducer: cartapislice,
  registerReducer: registerSlice,
  addressReducer: addressReducer,
  product: ProductSlice, // Use the persistedReducer for the 'product' slice
  dashboard: dashboardSlice,
  notification: notificationSlice
});

const persistConfig = {
  key: 'root',
  versions: 1,
  storage: AsyncStorage,
  //whitelist:['cart','product']
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const mystore = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(mystore);
export { mystore, persistor };

// export default store = configureStore({
//   reducer: {
//     cart: cartReducer,
//     loginReducer: loginReducer,
//     cartApiReducer: cartapislice,
//     registerReducer: registerSlice,
//     addressReducer: addressReducer,
//     product: ProductSlice, // Use the persistedReducer for the 'product' slice
//     dashboard: dashboardSlice

//   },
// });
