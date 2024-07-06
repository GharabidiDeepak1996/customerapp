import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  deliveryId: 1,
  defaultAddress: '',
  defaultAddressTitle: 'Deliver here',
  lat: 0.0,
  lng: 0.0,
  defaultAddressID: 0,
  DefaultAddressDistrict: '',
  deliveryAddress: '',
  deliveryAddressId: 0,
  deliveryLat: 0.0,
  deliveryLng: 0.0,
  defaultSubDistrictId: 0,
};

const addressSlice = createSlice({
  name: 'addressReducer',
  initialState,
  reducers: {
    // addToCart: (state, action) => {
    //   //         // The logic for adding items to the cart
    //   //         // You can use your existing `handleAddToCart` logic here
    //   const {productObj, store, behavior} = action.payload;

    //   const updatedCart = [...state.cartItems];
    //   const storeIndex = updatedCart.findIndex(
    //     item => item.id === store.productId,
    //   );

    //   console.log('productIndex', storeIndex);

    //   if (storeIndex !== -1) {
    //     //Add new store when list 1>
    //     const productIndex = updatedCart[storeIndex].productlist.findIndex(
    //       item => item.id === productObj.id,
    //     );

    //     if (behavior === 'add') {
    //       state.cartCount += 1;

    //       if (productIndex !== -1) {
    //         updatedCart[storeIndex].productlist[productIndex].cartCount += 1;
    //       }
    //       //   } else {
    //       //     updatedCart[storeIndex].productlist.push({
    //       //       id: productObj.id,
    //       //       title: productObj.title,
    //       //       price: productObj.price,
    //       //       ratingValue: productObj.ratingValue,
    //       //       cartCount: productObj.cartCount + 1,
    //       //     });
    //       //   }
    //     } else if (behavior === 'subtract' && state.cartCount > 0) {
    //       state.cartCount -= 1;

    //       if (productIndex !== -1) {
    //         updatedCart[storeIndex].productlist[productIndex].cartCount -= 1;
    //       }
    //     }
    //   } else {
    //     //Add new store when list -1
    //     if (behavior === 'add') {
    //       state.cartCount += 1;

    //       updatedCart.push({
    //         id: store.productId,
    //         name: store.productName,
    //         price: store.price,
    //         stock: store.stockQuantity,
    //         productlist: [
    //           {
    //             id: productObj.id,
    //             title: productObj.title,
    //             price: productObj.price,
    //             weight: productObj.weight,
    //             cartCount: state.cartCount + 1,
    //           },
    //         ],
    //       });
    //     }
    //   }

    //   state.cartItems = updatedCart;
    // },
    setDeliveryIn: (state, action) => {
      console.log("dashboard option--------------------------", action.payload)
      state.deliveryId = action.payload
    },
    setDefaultAddress: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      //const { defaultAddress } = action.payload;

      console.log('addressslice', action.payload);

      state.defaultAddress = action.payload;
    },

    setLat: (state, action) => {
      console.log('sliceLat', action.payload);
      state.lat = action.payload;
    },

    setLng: (state, action) => {
      console.log('sliceLng', action.payload);
      state.lng = action.payload;
    },
    setDeliveryLat: (state, action) => {
      state.deliveryLat = action.payload;
    },

    setDeliveryLng: (state, action) => {
      console.log('sliceLng------------------------------------', action.payload,);
      state.deliveryLng = action.payload;
    },

    setDefaultAddressTitle: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      //const { defaultAddress } = action.payload;

      console.log('addressslice', action.payload);

      state.defaultAddressTitle = action.payload;
    },

    setDefaultSubDistrictId: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      //const { defaultAddress } = action.payload;

      console.log(
        'defaultSubDistrictId=============================',
        action.payload,
      );

      state.defaultSubDistrictId = action.payload;
    },

    setDefaultAddressID: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      //const { defaultAddress } = action.payload;

      console.log(
        'setDefaultAddressID----------------------->',
        action.payload,
      );

      state.defaultAddressID = action.payload;
    },

    setDeliveryAddress: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      //const { defaultAddress } = action.payload;

      console.log('setDeliveryAddress----------------------->', action.payload);

      state.deliveryAddress = action.payload;
    },
    setDeliveryAddressId: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      //const { defaultAddress } = action.payload;

      console.log('setDeliveryAddress----------------------->', action.payload);

      state.deliveryAddressId = action.payload;
    },
    setDefaultAddressDistrict: (state, action) => {
      console.log(
        'setDefaultAddressDistrict----------------------->',
        action.payload,
      );

      state.DefaultAddressDistrict = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setDeliveryIn,
  setDefaultAddress,
  setDefaultAddressTitle,
  setLat,
  setLng,
  setDefaultAddressID,
  setDeliveryAddress,
  setDeliveryAddressId,
  setDefaultAddressDistrict,
  setDeliveryLat,
  setDeliveryLng,
  setDefaultSubDistrictId,
} = addressSlice.actions;
//export const cartReducers = cartSlice.reducer;
export default addressSlice.reducer;
