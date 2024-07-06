import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  cartItems: [], // Initialize the cartItems array as an empty array
  cartCount: 0, // Initialize the cartCount as 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      //         // The logic for adding items to the cart
      //         // You can use your existing `handleAddToCart` logic here
      const { productObj, store, behavior } = action.payload;

      const updatedCart = [...state.cartItems];
      const storeIndex = updatedCart.findIndex(
        item => item.id === store.productId,
      );

      console.log('productIndex', storeIndex);

      if (storeIndex !== -1) {
        //Add new store when list 1>
        const productIndex = updatedCart[storeIndex].productlist.findIndex(
          item => item.id === productObj.id,
        );

        if (behavior === 'add') {
          state.cartCount += 1;

          if (productIndex !== -1) {
            updatedCart[storeIndex].productlist[productIndex].cartCount += 1;
          }
          //   } else {
          //     updatedCart[storeIndex].productlist.push({
          //       id: productObj.id,
          //       title: productObj.title,
          //       price: productObj.price,
          //       ratingValue: productObj.ratingValue,
          //       cartCount: productObj.cartCount + 1,
          //     });
          //   }
        } else if (behavior === 'subtract' && state.cartCount > 0) {
          state.cartCount -= 1;

          if (productIndex !== -1) {
            updatedCart[storeIndex].productlist[productIndex].cartCount -= 1;
          }
        }
      } else {
        //Add new store when list -1
        if (behavior === 'add') {
          state.cartCount += 1;

          updatedCart.push({
            id: store.productId,
            name: store.productName,
            price: store.price,
            stock: store.stockQuantity,
            productlist: [
              {
                id: productObj.id,
                title: productObj.title,
                price: productObj.price,
                weight: productObj.weight,
                cartCount: state.cartCount + 1,
              },
            ],
          });
        }
      }

      state.cartItems = updatedCart;
    },

    removeFromCart: (state, action) => {
      // The logic for removing items from the cart
      // You can adapt your existing logic here
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart } = cartSlice.actions;
//export const cartReducers = cartSlice.reducer;
export default cartSlice.reducer;
