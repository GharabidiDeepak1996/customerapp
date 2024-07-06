import React, { useEffect, useState } from 'react';

import { Text } from 'react-native-elements';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Styles } from './Styles';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppConfig from '../../../../branding/App_config';
import { useTheme } from '@react-navigation/native';
import { SvgIcon } from '../../Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';

import { ProductService } from '../../../apis/services/product';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addProducts,
  cartCount,
  deleteProduct,
  removeProduct,
  groceryTotalPrice,
  foodTotalPrice,
  foodRemoveProduct,
  foodAddProduct,
  freshGoodAddProducts,
  freshGoodTotalPrice,
  freshGoodRemoveProduct,
} from '../../../redux/features/AddToCart/ProductSlice';
import { ActivityIndicator } from 'react-native';

const PropTypes = require('prop-types');

const assets = AppConfig.assets.default;

export const Counter = props => {
  //Theme based styling and colors
  const { colors } = useTheme();
  const itemStyles = Styles(colors);

  //Default Props
  const spacing = props.spacing || wp('12');
  const borderWidth = props.borderWidth || 1;
  const outerBorder = props.outerBorder || false;
  const isVertical = props.isVertical || false;
  const cartQuntity = props.cartCount || 0;
  const cartPrices = props.cartPrice || 0;
  const price = props.price || 0;
  const regularPrice = props.regularPrice || 0;
  const sellingPrice = props.sellingPrice || 0;
  const productTypeId = props.productTypeId || 0;

  const userCartItemId = props.userCartItemId || 0;
  const userCartId = props.userCartId || 0;
  const partnerId = props.partnerId || 0;
  const productId = props.productId || 0;
  const userId = props.userId || 0;
  const stockQuantity = props.stockQuantity || 0;
  const partnerStoreId = props.partnerStoreId || 0;

  //Constants
  const borderColor = colors.borderColorLight;

  //Internal states
  const [cartCountt, setCartCount] = useState(cartQuntity);
  const [cartPrice, setCartPrice] = useState(cartPrices);
  const [cartData, setCartData] = useState([]);
  // Internal state for loading
  const [isLoading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  //redux
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  //Grocery
  const product = useSelector(state =>
    state?.product?.cartItems?.find(
      item =>
        item.partnerId === partnerId &&
        item.productId === productId &&
        item.partnerStoreId === partnerStoreId,
    ),
  );
  const productQty = product ? product.qty : 0;

  //food
  const food = useSelector(state =>
    state.product.foodItems.find(
      item =>
        item.partnerId === partnerId &&
        item.productId === productId &&
        item.partnerStoreId === partnerStoreId,
    ),
  );
  const FoodProductQty = food ? food.qty : 0;
  function getUserCartItemId(cartQty, cartPrice) {
    setCartCount(cartQty);
    setCartPrice(cartPrice);
    // let userCartItemId = 0;
    // try {
    //   for (const item of cartData) {
    //     if (item.partnerId == partnerId && item.productId == productId) {
    //       userCartItemId += item.userCartItemId || 0;
    //     }
    //   }
    // } catch (error) {
    //   console.log('userCartItemIdError', userCartItemId);
    // }
    // return userCartItemId;
  }

  // Function to render loader
  const renderLoader = () => {
    return (
      <View>
        <ActivityIndicator
          size="small"
          color={colors.subHeadingSecondaryColor}
        />
      </View>
    );
  };
  // const _cartCountChange = behavior => {
  //   setLoading(true); // Set loading to false after completing the operation

  //   if (behavior === 'add') {
  //     const finalPrice = sellerPrice == 0 ? regularPrice : sellerPrice;
  //     let updateCarQ = cartCountt + 1;
  //     let updateCarP = cartPrice + finalPrice;
  //     updateCart(updateCarQ, updateCarP, behavior);

  //     console.log("============================================", props.cartList)
  //     //dispatch(addProducts(props.cartList))
  //     // props.onCounterDataChange(2);
  //   } else if (behavior === 'subtract' && (cartCountt > 0)) {
  //     console.log('kkkkgk-------', behavior);
  //     const finalPrice = sellerPrice == 0 ? regularPrice : sellerPrice;

  //     let updateCarQ = cartCountt - 1;
  //     let updateCarP = cartPrice - finalPrice;
  //     updateCart(updateCarQ, updateCarP, behavior);

  //     // dispatch(removeProduct(props.cartList))
  //   }
  // };

  const updateCart = async (cartQuntity, updatePrice, behavior) => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      userId: getUserId,
      productId: productId,
      partnerId: partnerId,
      userCartItemId: userCartItemId,
      userCartId: userCartId,
      qty: cartQuntity,
      price: updatePrice,
      CategoryTypeId: props.categoryTypeId,
    };

    try {
      const data = await ProductService.alterCartCountByStore(body);
      if (data.data.isSuccess) {
        setLoading(false);
        const data = await ProductService.getcartCountByStore(
          props.categoryTypeId,
          deliveryIn,
        );

        //Add and remove
        if (behavior == 'add') {
          dispatch(addProducts(props.cartList));
        } else if (behavior == 'subtract' && cartCountt > 0) {
          dispatch(removeProduct(props.cartList));
        }

        if (data?.data?.isSuccess) {
          props.fetchCartedList();
          setLoading(false);

          try {
            for (const item of data.data.payload) {
              console.log('updateCartId15------->', 'remove14');
              if (item.partnerId == partnerId && item.productId == productId) {
                //

                //
                setCartCount(item.cartQty);
                setCartPrice(item.cartPrice);
                props.fetchCartedList();
              }
            }
          } catch (error) {
            console.log('updateCartId17------->', 'remove14');
            console.log('counter--', error);
          }
        } else {
          console.log('updateCartId18------->', 'remove14');
          //when product qty 1
          setCartCount(0);
          setCartPrice(0);
          props.fetchCartedList();
          let count = 0;
          setLoading(false);

          dispatch(cartCount({ count }));
          dispatch(addProducts([]));
        }
      }
    } catch (error) {
      console.log('error==>', error);
    }
  };

  const getHorizontalCounter = () => {
    return (
      <View
        style={[
          itemStyles.horizontalContainer,
          {
            borderWidth: outerBorder ? borderWidth : 0,
            borderColor,
          },
        ]}>
        <TouchableOpacity
          style={[
            itemStyles.actionContainer,
            {
              width: spacing,
              height: spacing,
              borderRightColor: borderColor,
              borderRightWidth: borderWidth,
            },
          ]}
          onPress={() => {
            _cartCountChange('subtract');
          }}>
          <SvgIcon
            type={IconNames.Minus}//Horizontal
            width={18}
            height={18}
            color={colors.subHeadingSecondaryColor}
          />
        </TouchableOpacity>

        <View
          style={[
            itemStyles.actionContainer,
            {
              width: spacing,
            },
          ]}>
          <Text style={itemStyles.counterText}>{cartCountt}</Text>
        </View>

        <TouchableOpacity
          style={[
            itemStyles.actionContainer,
            {
              width: spacing,
              height: spacing,
              borderLeftColor: borderColor,
              borderLeftWidth: borderWidth,
            },
          ]}
          onPress={() => {
            _cartCountChange('add');
          }}>
          <SvgIcon
            type={IconNames.Plus}//Horizontal
            width={18}
            height={18}
            color={colors.subHeadingSecondaryColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const getVerticalCounter = () => {
    // const dispatch = useDispatch();

    // const fetchData = async () => {
    //   //   const cartCount = useSelector(state => state.product.cartCount);

    //   try {
    //     console.log('home');
    //     const data = await ProductService.getcartCountByStore(
    //       props.categoryTypeId,
    //     );

    //     if (data.data.payload == null) {
    //       let count = 0;
    //       dispatch(cartCount({ count }));
    //     } else {
    //       let count = data.data.payload.length;
    //       dispatch(cartCount({ count }));
    //     }
    //   } catch (error) {
    //     console.log('error', error);
    //   }
    // };

    return (
      <View style={itemStyles.verticalContainer}>
        <TouchableOpacity
          style={[
            itemStyles.actionContainer,
            {
              width: spacing,
              height: spacing,
              borderBottomColor: borderColor,
              borderBottomWidth: borderWidth,
              borderLeftColor: borderColor,
              borderLeftWidth: borderWidth,
            },
          ]}
          onPress={async () => {
            setLoading(true);
            if (props.categoryTypeId == 1 || props.categoryTypeId == 5) {
              if (stockQuantity >= productQty + 1) {
                // _cartCountChange('add');
                //fetchData();
                try {
                  const getUserId = await AsyncStorage.getItem('userId');
                  const finalPrice =
                    sellingPrice == 0 ? regularPrice : sellingPrice;
                  let updatePrice = 0;
                  let userCartId = 0;
                  let userCartItemId = 0;

                  const data = await ProductService.getcartCountByStore(
                    props.categoryTypeId,
                    deliveryIn,
                    getUserId
                  );

                  if (data?.data?.isSuccess) {
                    data.data.payload.map((item, key) => {
                      if (
                        item.partnerId === partnerId &&
                        item.productId === productId &&
                        item.partnerStoreId === partnerStoreId
                      ) {
                        // Update values based on conditions
                        updatePrice = item.cartPrice;
                        userCartId = item.userCartId;
                        userCartItemId = item.userCartItemId;
                      }
                    });

                    // const product = useSelector(state =>
                    //   state.product.find(item => (item.partnerId === partnerId && item.productId === productId && item.partnerStoreId === partnerStoreId))
                    // );

                    let body = {
                      userId: getUserId,
                      productId: productId,
                      partnerId: partnerId,
                      userCartItemId: userCartItemId,
                      userCartId: userCartId,
                      qty: productQty + 1,
                      price: updatePrice + finalPrice,
                      CategoryTypeId: props.categoryTypeId,
                    };

                    const updatedCart =
                      await ProductService.alterCartCountByStore(body);
                    if (updatedCart.data.isSuccess) {
                      props.fetchCartedList();
                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;
                      let behaviour = 'Add';

                      // dispatch(groceryTotalPrice({ totalPricess, behaviour }));
                      // dispatch(addProducts(props.cartList));
                      { props.categoryTypeId == 1 && dispatch(groceryTotalPrice({ totalPricess, behaviour })); }
                      { props.categoryTypeId == 1 && dispatch(addProducts({ groceryList: props.cartList, getUserId: getUserId })); }

                      { props.categoryTypeId == 5 && dispatch(freshGoodAddProducts({ groceryList: props.cartList, getUserId: getUserId })); }
                      { props.categoryTypeId == 5 && dispatch(freshGoodTotalPrice({ totalPricess, behaviour })); }

                      setLoading(false);
                    }
                  } else {
                    ToastAndroid.show(
                      'Something went worng in getcart or alter' +
                      data?.data?.message,
                      ToastAndroid.SHORT,
                    );
                  }
                } catch (err) { }
              } else {
                ToastAndroid.show('out of stock quntity', ToastAndroid.SHORT);
                setLoading(false);
              }
            } else
              if (props.categoryTypeId == 2) {
                // _cartCountChange('add');
                //fetchData();
                try {
                  const getUserId = await AsyncStorage.getItem('userId');
                  const finalPrice =
                    sellingPrice == 0 ? regularPrice : sellingPrice;
                  let updatePrice = 0;
                  let userCartId = 0;
                  let userCartItemId = 0;

                  const data = await ProductService.getcartCountByStore(
                    props.categoryTypeId,
                    deliveryIn,
                    getUserId
                  );

                  if (data?.data?.isSuccess) {
                    data.data.payload.map((item, key) => {
                      if (
                        item.partnerId === partnerId &&
                        item.productId === productId &&
                        item.partnerStoreId === partnerStoreId
                      ) {
                        // Update values based on conditions
                        updatePrice = item.cartPrice;
                        userCartId = item.userCartId;
                        userCartItemId = item.userCartItemId;
                      }
                    });

                    // const product = useSelector(state =>
                    //   state.product.find(item => (item.partnerId === partnerId && item.productId === productId && item.partnerStoreId === partnerStoreId))
                    // );

                    let body = {
                      userId: getUserId,
                      productId: productId,
                      partnerId: partnerId,
                      userCartItemId: userCartItemId,
                      userCartId: userCartId,
                      qty: FoodProductQty + 1,
                      price: updatePrice + finalPrice,
                      CategoryTypeId: props.categoryTypeId,
                    };

                    const updatedCart =
                      await ProductService.alterCartCountByStore(body);
                    if (updatedCart.data.isSuccess) {
                      props.fetchCartedList();
                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;
                      let behaviour = 'Add';

                      dispatch(foodTotalPrice({ totalPricess, behaviour }));
                      dispatch(foodAddProduct({ groceryList: props.cartList, userCartItemId, userCartId }));

                      setLoading(false);
                    }
                  } else {
                    ToastAndroid.show(
                      'Something went worng in getcart or alter' +
                      data?.data?.message,
                      ToastAndroid.SHORT,
                    );
                  }
                } catch (err) { }
              }

            // This function will be executed after handleAddToCart completes
          }}>
          {isLoading ? (
            renderLoader()
          ) : (
            <SvgIcon
              type={IconNames.Plus} //Vertical
              width={18}
              height={18}
              color={colors.subHeadingSecondaryColor}
            />
          )}
        </TouchableOpacity>

        <View
          style={[
            itemStyles.actionContainer,
            {
              width: spacing,
              height: spacing,
              borderLeftColor: borderColor,
              borderLeftWidth: borderWidth,
            },
          ]}>
          <Text style={itemStyles.counterText}>
            {(props.categoryTypeId == 1 || props.categoryTypeId == 5) ? productQty : FoodProductQty}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            itemStyles.actionContainer,
            {
              width: spacing,
              height: spacing,
              borderTopColor: borderColor,
              borderTopWidth: borderWidth,
              borderLeftColor: borderColor,
              borderLeftWidth: borderWidth,
            },
          ]}
          onPress={async () => {
            const getUserId = await AsyncStorage.getItem('userId');

            setLoading(true);
            if (props.categoryTypeId == 1 || props.categoryTypeId == 5) {
              if (productQty - 1 >= 0 && productQty - 1 != -1) {
                const data1 = await ProductService.getcartCountByStore(
                  props.categoryTypeId,
                  deliveryIn,
                  getUserId
                );
                if (data1?.data?.isSuccess) {
                  let count = data1.data.payload
                    ? data1.data.payload.length
                    : 0;

                  dispatch(cartCount({ count }));

                  const finalPrice =
                    sellingPrice == 0 ? regularPrice : sellingPrice;
                  let updatePrice = 0;
                  let userCartId = 0;
                  let userCartItemId = 0;
                  //alter for updated price
                  const data = await ProductService.getcartCountByStore(
                    props.categoryTypeId,
                    deliveryIn,
                    getUserId
                  );
                  if (data?.data?.isSuccess) {
                    data.data.payload.map((item, key) => {
                      if (
                        item.partnerId === partnerId &&
                        item.productId === productId &&
                        item.partnerStoreId === partnerStoreId
                      ) {
                        // Update values based on conditions
                        updatePrice = item.cartPrice;
                        userCartId = item.userCartId;
                        userCartItemId = item.userCartItemId;
                      }
                    });

                    let body = {
                      userId: getUserId,
                      productId: productId,
                      partnerId: partnerId,
                      userCartItemId: userCartItemId,
                      userCartId: userCartId,
                      qty: productQty - 1,
                      price: updatePrice - finalPrice,
                      CategoryTypeId: props.categoryTypeId,
                    };

                    const updatedCart =
                      await ProductService.alterCartCountByStore(body);
                    if (updatedCart.data.isSuccess) {
                      props.fetchCartedList();

                      let behaviour = 'Sub';

                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;

                      // dispatch(groceryTotalPrice({ totalPricess, behaviour }));
                      // dispatch(removeProduct(props.cartList));

                      { props.categoryTypeId == 1 && dispatch(groceryTotalPrice({ totalPricess, behaviour })); }
                      { props.categoryTypeId == 1 && dispatch(removeProduct({ groceryList: props.cartList, getUserId: getUserId })); }

                      { props.categoryTypeId == 5 && dispatch(freshGoodRemoveProduct({ groceryList: props.cartList, getUserId: getUserId })); }
                      { props.categoryTypeId == 5 && dispatch(freshGoodTotalPrice({ totalPricess, behaviour })); }
                      setTimeout(() => {
                        setLoading(false);
                      }, 2000);
                    } else {
                      console.log(
                        '---------------------------5454544------',
                        updatedCart,
                      );
                    }
                  }
                }
              }
            } else if (props.categoryTypeId == 2) {
              const getUserId = await AsyncStorage.getItem('userId');

              if (FoodProductQty - 1 >= 0 && FoodProductQty - 1 != -1) {
                const data1 = await ProductService.getcartCountByStore(
                  props.categoryTypeId,
                  deliveryIn,
                  getUserId
                );
                if (data1?.data?.isSuccess) {
                  let count = data1.data.payload
                    ? data1.data.payload.length
                    : 0;

                  dispatch(cartCount({ count }));

                  const finalPrice =
                    sellingPrice == 0 ? regularPrice : sellingPrice;
                  let updatePrice = 0;
                  let userCartId = 0;
                  let userCartItemId = 0;
                  //alter for updated price
                  const data = await ProductService.getcartCountByStore(
                    props.categoryTypeId,
                    deliveryIn,
                    getUserId
                  );
                  if (data?.data?.isSuccess) {
                    data.data.payload.map((item, key) => {
                      if (
                        item.partnerId === partnerId &&
                        item.productId === productId &&
                        item.partnerStoreId === partnerStoreId
                      ) {
                        // Update values based on conditions
                        updatePrice = item.cartPrice;
                        userCartId = item.userCartId;
                        userCartItemId = item.userCartItemId;
                      }
                    });

                    let body = {
                      userId: getUserId,
                      productId: productId,
                      partnerId: partnerId,
                      userCartItemId: userCartItemId,
                      userCartId: userCartId,
                      qty: FoodProductQty - 1,
                      price: updatePrice - finalPrice,
                      CategoryTypeId: props.categoryTypeId,
                    };

                    const updatedCart = await ProductService.alterCartCountByStore(body);
                    if (updatedCart.data.isSuccess) {
                      props.fetchCartedList();

                      let behaviour = 'Sub';

                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;

                      dispatch(foodTotalPrice({ totalPricess, behaviour }));
                      dispatch(foodRemoveProduct(props.cartList));

                      setTimeout(() => {
                        setLoading(false);
                      }, 2000);
                    } else {
                      console.log(
                        '---------------------------5454544------',
                        updatedCart,
                      );
                    }
                  }
                }
              }
            }
          }}>
          {isLoading ? (
            renderLoader()
          ) : (
            <SvgIcon
              type={IconNames.Minus}//Vertical
              width={18}
              height={18}
              color={colors.subHeadingSecondaryColor}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    // <View>{isVertical ? getVerticalCounter() : getHorizontalCounter()}</View>
    <View>
      {isVertical ? getVerticalCounter() : <></>}
      {/* {isLoading ? renderLoader() : null} */}
    </View>
  );
};

Counter.propTypes = {
  spacing: PropTypes.number,
  borderWidth: PropTypes.number,
  outerBorder: PropTypes.bool,
  isVertical: PropTypes.bool,
};
