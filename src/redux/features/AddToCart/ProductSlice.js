import { createSlice } from '@reduxjs/toolkit';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // or another storage engine

const initialState = {
  cartItems: [], // Initialize the cartItems array as an empty array
  cartCount: 0, // Initialize the cartCount as 0
  totalPrice: 0,
  foodTotalPrice: 0,
  groceryTotalPrice: 0,
  freshGoodTotalPrice: 0,
  foodItems: [],
  isReplaceFood: {
    isAddingAnotherRest: false, // Assuming you want to initialize it with a boolean value
    existingRestName: '', // Assuming you want to initialize it with an empty string
  },
  restaurantsName: [],
};

const ProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    //Grocery
    addProducts: (state, action) => {

      const existingProductIndex = state.cartItems.findIndex(
        item =>
          item.partnerId === action.payload.groceryList.partnerId &&
          item.productId === action.payload.groceryList.productId &&
          item.userId === action.payload.getUserId &&
          item.partnerStoreId === action.payload.groceryList.partnerStoreId,
      ); //if intro not declared
      //const existingProductIndex = state.cartItems.findIndex((item) => item.partnerId === action.payload.partnerId); //if intro declared.
      // && item.productId === action.payload.productId
      console.log("reduxToolkiiiiiiiiiiiii", action.payload)

      if (existingProductIndex !== -1) {
        console.log('Product already exists in the cart, increase quantity',);
        state.cartItems[existingProductIndex].qty += 1;
      } else {
        console.log(' Product does not exist in the cart, add it',);

        state.cartItems.push({
          categoryId: action.payload.groceryList.categoryId,
          categoryName: action.payload.groceryList.categoryName,
          sellingPrice: action.payload.groceryList.sellingPrice,
          stockQuantity: action.payload.groceryList.stockQuantity,
          regularPrice: action.payload.groceryList.regularPrice,
          partnerStoreId: action.payload.groceryList.partnerStoreId,
          userId: action.payload.getUserId,
          productId: action.payload.groceryList.productId,
          partnerId: action.payload.groceryList.partnerId,
          partnerName: action.payload.groceryList.partnerName,
          qty: 1,
        });



        // state.cartItems.push({
        //     categoryId: action.payload.categoryId,
        //     categoryName: action.payload.categoryName,
        //     sellingPrice: action.payload.sellingPrice,
        //     stockQuantity: action.payload.stockQuantity,
        //     regularPrice: action.payload.regularPrice,
        //     partnerStoreId: action.payload.partnerStoreId,
        //     userId: action.payload.userId,
        //     productId: action.payload.productId,
        //     partnerId: action.payload.partnerId,
        //     partnerName: action.payload.partnerName,
        //     qty: 1
        // });
        // state.cartCount += 1
        // state.qty += 1
      }

      //if device change
      if (action.payload.behaviour == 'Home') {
        console.log("DifferentDevice------------", action.payload)
        action.payload.groceryList.map((val, key) => {
          state.cartItems.push({
            categoryId: val.categoryId,
            categoryName: val.categoryName,
            sellingPrice: val.sellingPrice,
            stockQuantity: val.stockQuantity,
            regularPrice: val.regularPrice,
            partnerStoreId: val.partnerStoreId,
            userId: action.payload.getUserId,
            productId: val.productId,
            partnerId: val.partnerId,
            partnerName: val.partnerName,
            qty: val.cartQty,
          });
        })
      }
    },
    removeProduct: (state, action) => {
      //
      const existingProductIndex = state.cartItems.findIndex(
        item =>
          item.partnerId === action.payload.groceryList.partnerId &&
          item.productId === action.payload.groceryList.productId &&
          item.userId === action.payload.getUserId &&
          item.partnerStoreId === action.payload.groceryList.partnerStoreId,
      ); //if intro not declared

      if (existingProductIndex !== -1) {
        console.log(' Product 1 qty not removed', existingProductIndex, '----', action.payload.partnerId,);
        state.cartItems[existingProductIndex].qty -= 1;

        if (state.cartItems[existingProductIndex].qty == 0) {
          const indexToRemove = state.cartItems.findIndex(
            item =>
              item.productId === action.payload.groceryList.productId &&
              item.partnerName === action.payload.groceryList.partnerName,
          );
          if (indexToRemove !== -1) {
            state.cartItems.splice(indexToRemove, 1);
          }
          console.log('sfjisdfidhidh if', state.cartItems);
        }
      } else {
        console.log(' Product remove from cart', existingProductIndex, '----', action.payload.partnerId,);
      }
    },
    groceryTotalPrice: (state, action) => {
      const price = action.payload.totalPricess;
      console.log("FreshFooodSlice------------------------------------", price)
      if (action.payload.behaviour == 'Add') {
        state.groceryTotalPrice += price;
      } else if (action.payload.behaviour == 'Sub') {
        state.groceryTotalPrice -= price;
      } else if (action.payload.behaviour == 'Home') {
        state.groceryTotalPrice = price;
      }

      console.log(
        'productCount------------------------------------',
        action.payload.behaviour,
      );
    },

    //fresh Good
    freshGoodAddProducts: (state, action) => {
      const existingProductIndex = state.cartItems.findIndex(
        item =>
          item.partnerId === action.payload.groceryList.partnerId &&
          item.productId === action.payload.groceryList.productId &&
          item.userId === action.payload.getUserId &&
          item.partnerStoreId === action.payload.groceryList.partnerStoreId,
      ); //if intro not declared
      //const existingProductIndex = state.cartItems.findIndex((item) => item.partnerId === action.payload.partnerId); //if intro declared.
      // && item.productId === action.payload.productId

      if (existingProductIndex !== -1) {
        console.log('Product already exists in the cart, increase quantity', existingProductIndex, '----',);
        state.cartItems[existingProductIndex].qty += 1;
      } else {
        console.log(' Product does not exist in the cart, add it', existingProductIndex, '----',);

        state.cartItems.push({
          categoryId: action.payload.groceryList.categoryId,
          categoryName: action.payload.groceryList.categoryName,
          sellingPrice: action.payload.groceryList.sellingPrice,
          stockQuantity: action.payload.groceryList.stockQuantity,
          regularPrice: action.payload.groceryList.regularPrice,
          partnerStoreId: action.payload.groceryList.partnerStoreId,
          userId: action.payload.getUserId,
          productId: action.payload.groceryList.productId,
          partnerId: action.payload.groceryList.partnerId,
          partnerName: action.payload.groceryList.partnerName,
          qty: 1,
        });

        // state.cartItems.push({
        //     categoryId: action.payload.categoryId,
        //     categoryName: action.payload.categoryName,
        //     sellingPrice: action.payload.sellingPrice,
        //     stockQuantity: action.payload.stockQuantity,
        //     regularPrice: action.payload.regularPrice,
        //     partnerStoreId: action.payload.partnerStoreId,
        //     userId: action.payload.userId,
        //     productId: action.payload.productId,
        //     partnerId: action.payload.partnerId,
        //     partnerName: action.payload.partnerName,
        //     qty: 1
        // });
        // state.cartCount += 1
        // state.qty += 1
      }
      //if device change
      if (action.payload.behaviour == 'Home') {
        console.log("DifferentDevice------------", action.payload)
        action.payload.groceryList.map((val, key) => {
          state.cartItems.push({
            categoryId: val.categoryId,
            categoryName: val.categoryName,
            sellingPrice: val.sellingPrice,
            stockQuantity: val.stockQuantity,
            regularPrice: val.regularPrice,
            partnerStoreId: val.partnerStoreId,
            userId: action.payload.getUserId,
            productId: val.productId,
            partnerId: val.partnerId,
            partnerName: val.partnerName,
            qty: val.cartQty,
          });
        })
      }
    },
    freshGoodRemoveProduct: (state, action) => {
      //
      const existingProductIndex = state.cartItems.findIndex(
        item =>
          item.partnerId === action.payload.groceryList.partnerId &&
          item.productId === action.payload.groceryList.productId &&
          item.userId === action.payload.getUserId &&
          item.partnerStoreId === action.payload.groceryList.partnerStoreId,
      ); //if intro not declared

      if (existingProductIndex !== -1) {
        console.log(' Product 1 qty not removed', existingProductIndex, '----');
        state.cartItems[existingProductIndex].qty -= 1;

        if (state.cartItems[existingProductIndex].qty == 0) {
          const indexToRemove = state.cartItems.findIndex(
            item =>
              item.productId === action.payload.groceryList.productId &&
              item.partnerName === action.payload.groceryList.partnerName,
          );
          if (indexToRemove !== -1) {
            state.cartItems.splice(indexToRemove, 1);
          }
        }
      } else {
        console.log(' Product remove from cart', existingProductIndex, '----',);
      }
    },
    freshGoodTotalPrice: (state, action) => {
      const price = action.payload.totalPricess;
      console.log("FreshFooodSlice------------------------------------", price)
      if (action.payload.behaviour == 'Add') {
        state.freshGoodTotalPrice += price;
      } else if (action.payload.behaviour == 'Sub') {
        state.freshGoodTotalPrice -= price;
      }

      console.log(
        'productCount------------------------------------',
        action.payload.behaviour,
      );
    },

    //Food or restru
    foodAddProduct: (state, action) => {
      //1 =>equal and 2 => different
      // const hasMultiplePartnerNames = (data) => {
      //     const uniquePartnerNames = new Set(data.map(item => item.partnerName));
      //     console.log("=======================.....", uniquePartnerNames.size)
      //     return uniquePartnerNames.size > 1;
      // };

      // if (payload.length >= 2) {
      //     const uniquePartnerIds = new Set(payload.map(item => item.partnerId));
      //     state.areAllPartnerIdsSame = uniquePartnerIds.size === 1;
      //   } else {
      //     state.areAllPartnerIdsSame = true; // If there's only one or no item, consider them as same
      //   }

      try {
        const existingProductIndex = state.foodItems.findIndex(item => {
          const payloadPartnerId = action?.payload?.groceryList?.partnerId || 0; // You can replace '' with an appropriate default value
          const payloadproductId = action?.payload?.groceryList?.productId || 0; // You can replace '' with an appropriate default value
          const payloadpartnerStoreId = action?.payload?.groceryList?.partnerStoreId || 0; // You can replace '' with an appropriate default value
          //const userId = action?.payload?.getUserId || 0

          return (
            item.partnerId == payloadPartnerId &&
            item.productId == payloadproductId &&

            item.partnerStoreId == payloadpartnerStoreId
          );
        }); //if intro not declared

        if (existingProductIndex !== -1) {
          console.log('Food Product already exists in the cart, increase quantity', existingProductIndex);
          state.foodItems[existingProductIndex].qty += 1;
        } else {
          console.log('Food Product does not exist in the cart, add it', existingProductIndex, '----',);

          if (state.foodItems.length > 0) {
            let tempArry = state.foodItems.filter(
              item => item.partnerId == action.payload.groceryList.partnerId,
            );
            console.log('tempArry--------------->', state.foodItems[0].partnerId, action.payload.groceryList.partnerId);
            if (state.foodItems[0].partnerId == action.payload.groceryList.partnerId) {//1 equal
              state.foodItems.push({
                categoryId: action.payload.groceryList.categoryId,
                categoryName: action.payload.groceryList.categoryName,
                sellingPrice: action.payload.groceryList.sellingPrice,
                stockQuantity: action.payload.groceryList.stockQuantity,
                regularPrice: action.payload.groceryList.regularPrice,
                partnerStoreId: action.payload.groceryList.partnerStoreId,
                userId: action.payload.groceryList.userId,
                productId: action.payload.groceryList.productId,
                partnerId: action.payload.groceryList.partnerId,
                partnerName: action.payload.groceryList.partnerName,
                qty: 1,
                userCartItemId: action?.payload?.userCartItemId,
                userCartId: action?.payload?.userCartId,
              });
              state.isReplaceFood.isAddingAnotherRest = false;
            } else {
              console.log('Already in restru');
              state.isReplaceFood.isAddingAnotherRest = true;
              state.isReplaceFood.existingRestName = '';
              // console.log("bantai tuh dusra dukaan hai, allowed nahi karonga storing")
            }
          } else {
            console.log(
              'elsee================================',
              action.payload,
            );
            action.payload;
            state.foodItems.push({
              categoryId: action.payload.groceryList.categoryId,
              categoryName: action.payload.groceryList.categoryName,
              sellingPrice: action.payload.groceryList.sellingPrice,
              stockQuantity: action.payload.groceryList.stockQuantity,
              regularPrice: action.payload.groceryList.regularPrice,
              partnerStoreId: action.payload.groceryList.partnerStoreId,
              userId: action.payload.groceryList.userId,
              productId: action.payload.groceryList.productId,
              partnerId: action.payload.groceryList.partnerId,
              partnerName: action.payload.groceryList.partnerName,
              qty: 1,
              userCartItemId: action?.payload?.userCartItemId,
              userCartId: action?.payload?.userCartId,
            });
          }
        }
      } catch (error) {
        console.log('ctach in add food', error);
      }
      console.log('============foodSlice12=============', state.foodItems);
    },

    foodRemoveProduct: (state, action) => {
      console.log('fjgkhjdhhfdhdfkhfjk', action.payload);
      const existingProductIndex = state.foodItems.findIndex(
        item =>
          item.partnerId === action.payload.partnerId &&
          item.productId === action.payload.productId &&
          item.partnerStoreId === action.payload.partnerStoreId,
      ); //if intro not declared

      if (existingProductIndex !== -1) {
        state.foodItems[existingProductIndex].qty -= 1;
        // If qty is 0, remove the item from foodItems

        if (state.foodItems[existingProductIndex].qty == 0) {
          const indexToRemove = state.foodItems.findIndex(
            item => item.productId === action.payload.productId,
          );
          if (indexToRemove !== -1) {
            state.foodItems.splice(indexToRemove, 1);
            console.log('sfjisdfidhidh if', state.foodItems);
          }
        }
      } else {
        console.log(
          ' Food Product remove from cart',
          existingProductIndex,
          '----',
          action.payload.partnerId,
        );
      }
      console.log('============foodSlice=============', state.foodItems);
    },

    foodTotalPrice: (state, action) => {
      const price = action.payload.totalPricess;
      if (action.payload.behaviour == 'Add') {
        state.foodTotalPrice += price;
      } else if (action.payload.behaviour == 'Sub') {
        state.foodTotalPrice -= price;
      }

      console.log('foodTotalPrice------------------------------------', action.payload.behaviour,);
    },

    RestAlreadyExit: (state, action) => {
      console.log('action=============', action);
      state.isReplaceFood.isAddingAnotherRest = action.payload;
    },
    foodClearProduct: (state, action) => {
      try {
        const existingProductIndex = state.foodItems.findIndex(
          item =>
            item.partnerId === action.payload.partnerId &&
            item.productId === action.payload.productId &&
            item.partnerStoreId === action.payload.partnerStoreId,
        );

        if (existingProductIndex !== -1) {
          if (state.foodItems[existingProductIndex].qty > 0) {
            const indexToRemove = state.foodItems.findIndex(
              item => item.productId === action.payload.productId,
            );
            if (indexToRemove !== -1) {
              state.foodItems.splice(indexToRemove, 1);
              console.log('sfjisdfidhidh if', state.foodItems);
            }
          }
        }

        if (state.foodItems.length == 0) {
          state.foodTotalPrice = 0;
          state.foodItems = [];
          state.restaurantsName = [];
        }
        console.log(
          'action=============',

          state.foodItems.length,
        );
      } catch (error) {
        console.log('89try7rt879rr7', error);
      }
    },
    RestaurantsName: (state, action) => {
      const indexToReplace = 1; // Change this to the desired index
      //Ensure that state.restaurantsName is always an array
      state.restaurantsName = state.restaurantsName || [];

      // Clone the array to avoid direct mutation
      const clonedRestaurantsName = [...state.restaurantsName];

      if (clonedRestaurantsName.length <= 1) {
        // Push a new element into the array
        clonedRestaurantsName.push({
          rest: action.payload,
        });
      } else {
        // // Use splice to insert the new element at the specified index
        // clonedRestaurantsName.splice(indexToInsert, 1, {
        //     rest: action.payload,
        // });
        // Replace the data at the specified index
        clonedRestaurantsName[indexToReplace] = {
          rest: action.payload,
        };
      }

      // Update state with the cloned array
      state.restaurantsName = clonedRestaurantsName;

      //state.restaurantsName = [];

      console.log('===================acti', clonedRestaurantsName);
    },

    ///////////////////////

    deleteProduct: (state, action) => {
      //
      const existingProductIndex = state.cartItems.findIndex(
        item =>
          item.partnerId === action.payload.partnerId &&
          item.productId === action.payload.productId &&
          item.partnerStoreId === action.payload.partnerStoreId,
      ); //if intro not declared

      if (existingProductIndex !== -1) {
        console.log(
          ' Product 1 qty removed',
          existingProductIndex,
          '----',
          action.payload.partnerId,
        );
        state.cartItems[existingProductIndex].qty -= 1;
      } else {
        console.log(
          ' Product remove from cart',
          existingProductIndex,
          '----',
          action.payload.partnerId,
        );
      }
    },

    cartCount: (state, action) => {
      const { count } = action.payload;
      state.cartCount = count;
    },

    totalPrice: (state, action) => {
      const price = action.payload.totalPricess;

      if (action.payload.behaviour == 'Add') {
        state.totalPrice += price;
      } else if (action.payload.behaviour == 'Sub') {
        state.totalPrice -= price;
      }

      console.log(
        'productCount------------------------------------',
        action.payload.behaviour,
      );
    },


    clearProducts: (state, action) => {
      console.log("4444444444444444", state, action)
      if (action.payload == 1) {
        return {
          ...state,
          cartItems: [],
          groceryTotalPrice: 0
        };
      } else if (action.payload == 2) {
        return {
          ...state,
          foodItems: [],
          foodTotalPrice: 0,
          isReplaceFood: {
            isAddingAnotherRest: false, // Assuming you want to initialize it with a boolean value
            existingRestName: '', // Assuming you want to initialize it with an empty string
          },
          restaurantsName: [],
        };
      } else if (action.payload == 5) {
        return {
          ...state,
          cartItems: [],
          freshGoodTotalPrice: 0
        };
      }

      //Action 1
      // const existingProductIndex = state.cartItems.findIndex(
      //   item =>
      //     item.partnerId === action.payload.partnerId &&
      //     item.productId === action.payload.productId &&
      //     item.partnerStoreId === action.payload.partnerStoreId,
      // );

      // if (existingProductIndex !== -1) {
      //   // Remove the item from the array using splice
      //   state.cartItems.splice(existingProductIndex, 1);
      // }
      //Action 2
      // Reset the state to its initial values
      //return initialState;
    },

  },
});

export const {
  addProducts,
  freshGoodAddProducts,
  removeProduct,
  freshGoodRemoveProduct,
  deleteProduct,
  cartCount,
  clearProducts,
  totalPrice,
  foodTotalPrice,
  groceryTotalPrice,
  freshGoodTotalPrice,
  foodAddProduct,
  foodRemoveProduct,
  RestAlreadyExit,
  foodClearProduct,
  RestaurantsName,
} = ProductSlice.actions;
export default ProductSlice.reducer;

// const persistConfig = {
//     key: 'root',
//     storage,
//     // Other configuration options if needed
// };

// const persistedReducer = persistReducer(persistConfig, ProductSlice.reducer);

// export const { addProducts, removeProduct, deleteProduct, cartCount, clearProducts } = ProductSlice.actions;
// export default persistedReducer;
