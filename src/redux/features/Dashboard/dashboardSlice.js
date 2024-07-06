import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deliveryId: 1,
  NearByShopDistance: 0,
  NearByRestaurantDistance: 0,
  ConfigurationTesting: 0,
  MinimumSendDistance: 0,
  MaximumSendDistance: 0,
  MinimumRideDistance: 0,
  MaximumRideDistance: 0,
  ShowHeading: 0,//0 - false , 1 - true
  PaymentInterval: 0,
  CustomerMinWallterAmount: 0,
  NearByCity: 0,
  NearByFreshGoodsDistance: 0,
  AutoRefreshTrackingInterval: 0
};

const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    //All values are assign to state.
    setNearByShopDistance: (state, action) => { state.NearByShopDistance = action.payload },
    setNearByRestaurantDistance: (state, action) => { state.NearByRestaurantDistance = action.payload },
    setConfigurationTesting: (state, action) => { state.ConfigurationTesting = action.payload },

    setMinimumSendDistance: (state, action) => { state.MinimumSendDistance = action.payload },
    setMaximumSendDistance: (state, action) => { state.MaximumSendDistance = action.payload },

    setMinimumRideDistance: (state, action) => { state.MinimumRideDistance = action.payload },
    setMaximumRideDistance: (state, action) => { state.MaximumRideDistance = action.payload },

    setPaymentInterval: (state, action) => { state.PaymentInterval = action.payload },

    setCustomerMinWallterAmount: (state, action) => { state.CustomerMinWallterAmount = action.payload },
    setNearByCity: (state, action) => { state.NearByCity = action.payload },
    setNearByFreshGoodsDistance: (state, action) => { state.NearByFreshGoodsDistance = action.payload },
    setAutoRefreshTrackingInterval: (state, action) => { state.AutoRefreshTrackingInterval = action.payload },
    setShowHeading: (state, action) => { state.ShowHeading = action.payload },

  },
});

export const { deliveryIn, setMinimumSendDistance, setMaximumSendDistance, setShowHeading, setMinimumRideDistance, setMaximumRideDistance, setPaymentInterval, setNearByShopDistance,
  setNearByRestaurantDistance, setCustomerMinWallterAmount, setNearByCity, setNearByFreshGoodsDistance, setAutoRefreshTrackingInterval, setConfigurationTesting, } = DashboardSlice.actions;
export default DashboardSlice.reducer;

