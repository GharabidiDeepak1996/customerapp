import React, {useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import {Text, Rating, AirbnbRating} from 'react-native-elements';
import Routes from '../../../navigation/Routes';
import {Styles} from './Styles';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {SvgIcon} from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Globals from '../../../utils/Globals';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {StoreBottomSheet} from '../StoreBottomSheet/View';
import {FavouritesBottomSheet} from '../FavouritesBottomSheet/View';
import {ToastAndroid} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addProducts,
  cartCount,
  deleteProduct,
  removeProduct,
  totalPrice,
  foodTotalPrice,
  foodAddProduct,
  RestAlreadyExit,
  foodRemoveProduct,
  foodClearProduct,
  RestaurantsName,
} from '../../../redux/features/AddToCart/ProductSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {ProductService} from '../../../apis/services/product';
import {useTranslation} from 'react-i18next';
import {formatNumberWithCommas} from '../../../utils/FormatNumberWithCommas';

export const FoodStoreItem = props => {
  const {t, i18n} = useTranslation();

  //Redux tool kit
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);
  const isAddingAnotherRest = useSelector(
    state => state?.product?.isReplaceFood?.isAddingAnotherRest,
  );
  const productCount = useSelector(state => state.product.cartCount);
  const foodItemsArry = useSelector(state => state.product.foodItems);
  const restNameArry = useSelector(state => state?.product?.restaurantsName);

  //storebottom sheet
  const isStoreBottomSheetOpen = true;
  const [showStoreBottomSheetComponent, setStoreBottomSheetComponent] =
    useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [isLoading, setLoading] = useState(false);

  //Theme based styling and colors
  const {colors} = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  const {
    navigation,
    openingHrs,
    closingHrs,
    categoryId,
    categoryName,
    categoryDescription,
    packagingId,
    packagingName,
    weight,
    length,
    width,
    height,
    sellingPrice,
    stockQuantity,
    ratingCount,
    averageRating,
    productTypeId,
    productStoreDescription,
    productName,
    bestSeller,
    returnable,
    cancellable,
    partnerStoreId,
    userId,
    productId,
    partnerId,
    sku,
    specification,
    regularPrice,
    partnerName,
    productImageUrl,
    ownerName,
    groceryList,
    setSelectedProduct,
    categoryTypeId,
    productPackagingId,
    isStore,
    isStoreOpen,
  } = props;

  const _storeBottomSheetComponent = () => {
    setStoreBottomSheetComponent(props);
  };

  const product = useSelector(state =>
    state.product.foodItems.find(
      item =>
        item.partnerId === partnerId &&
        item.productId === productId &&
        item.partnerStoreId === partnerStoreId,
    ),
  );

  let isAlreadyExist = useSelector(state =>
    state.product.foodItems.filter(item => item.partnerId === partnerId),
  );

  useEffect(() => {
    if (productCount > 0) {
      if (isAlreadyExist.length > 0) {
        //smae
        let isThere = false;
        dispatch(RestAlreadyExit(isThere));
      } else {
        //diffrent
        let isThere = true;
        dispatch(RestAlreadyExit(isThere));
      }
    }
  }, [partnerId]);

  const uniqueId = DeviceInfo.getUniqueId();

  //getting qty
  const productQty = product ? product.qty : 0;
  // const updateCartPrice = product ? product.qty : 0;
  //Clear Food Cart
  // const ClearFoodCart = async () => {
  //   try {
  //     const getUserId = await AsyncStorage.getItem('userId');

  //     foodItemsArry.map(async item => {
  //       let count = 0;
  //       let body = {
  //         userId: getUserId,
  //         productId: item.productId,
  //         partnerId: item.partnerId,
  //         userCartItemId: item.userCartItemId,
  //         userCartId: item.userCartId,
  //         qty: 0,
  //         price: 0,
  //         CategoryTypeId: categoryTypeId,
  //       };
  //       console.log('slkjdkfkjjdhjfdskhkjssldks6468546', body);
  //       const updatedCart = await ProductService.alterCartCountByStore(body);
  //       console.log(
  //         'slkjdkfkjjdhjfdskhkjssldks6468546--------------',
  //         updatedCart.data,
  //       );
  //       try {
  //         if (updatedCart.data.isSuccess) {
  //           await dispatch(foodClearProduct(item));
  //           let isThere = false;
  //           await dispatch(RestAlreadyExit(isThere));
  //           await dispatch(cartCount({ count }));
  //           await replacedCartItem();
  //         }
  //       } catch (error) {
  //         console.log('09080889080', error);
  //       }
  //     });
  //   } catch (err) {
  //     console.log('989789780940----', err);
  //   }
  // };

  // Function to render loader
  const renderLoader = () => {
    return (
      <View>
        <ActivityIndicator size="small" color={'white'} />
      </View>
    );
  };

  const ClearFoodCart = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      // Use Promise.all to wait for all async operations in the map
      await Promise.all(
        foodItemsArry.map(async item => {
          let count = 0;
          let body = {
            userId: getUserId,
            productId: item.productId,
            partnerId: item.partnerId,
            userCartItemId: item.userCartItemId,
            userCartId: item.userCartId,
            qty: 0,
            price: 0,
            CategoryTypeId: categoryTypeId,
          };
          const updatedCart = await ProductService.alterCartCountByStore(body);

          try {
            if (updatedCart.data.isSuccess) {
              await dispatch(foodClearProduct(item));
              let isThere = false;
              await dispatch(RestAlreadyExit(isThere));
              await dispatch(cartCount({count}));
            }
          } catch (error) {
            console.log('09080889080', error);
          }
        }),
      );

      // Call replacedCartItem here after the dispatch statements
      await replacedCartItem();
    } catch (err) {
      console.log('989789780940----', err);
    }
  };

  const replacedCartItem = async () => {
    //if cart is replacing than add new product into cart
    const getUserId = await AsyncStorage.getItem('userId');

    const data = await ProductService.getcartCountByStore(
      categoryTypeId,
      deliveryIn,
      getUserId,
    );
    if (data.data.payload == null) {
      let body = {
        userId: getUserId, //,30032,
        partnerId: partnerId,
        productPackagingId: productPackagingId,
        qty: productQty + 1,
        price: sellingPrice == 0 ? regularPrice : sellingPrice,
        deviceId: uniqueId._z, //"6ed0ee10b72e038b",
        DeliveryOptionId: deliveryIn,
        CategoryTypeId: categoryTypeId,
      };

      let restName = partnerName;
      dispatch(RestaurantsName(restName));

      const data = await ProductService.addCartCountByStore(body);
      if (data.data.isSuccess) {
        let totalPricess = sellingPrice == 0 ? regularPrice : sellingPrice;
        let behaviour = 'Add';

        //here one more condition need to be add
        //dispatch(addProducts(groceryList));

        const data = await ProductService.getcartCountByStore(
          categoryTypeId,
          deliveryIn,
          getUserId,
        );
        if (data?.data?.isSuccess) {
          //data.data.payload
          let count = data.data.payload ? data.data.payload.length : 0;
          let userCartItemId = 0;
          let userCartId = 0;

          // let tempArry = state.foodItems.filter(
          //   item => item.partnerId == action.payload.partnerId,
          // );
          data.data.payload.forEach(item => {
            if (item.productPackagingId == productPackagingId) {
              userCartItemId = item.userCartItemId;
              userCartId = item.userCartId;
            }
          });

          dispatch(
            foodAddProduct({
              groceryList,
              userCartItemId,
              userCartId,
            }),
          );
          dispatch(foodTotalPrice({totalPricess, behaviour}));
          dispatch(cartCount({count}));
        }
      } else {
        // Handle errors or show a message to the user
        console.error('Failed to add to cart. Please try again.');
      }
    }
    return;
    if (foodItemsArry.length == 0) {
      console.log('if cart is replacing than add new product into cart');

      // console.log("RestaurantsName===========", restNameArry[0].rest)
    } else {
    }
  };
  return (
    <View style={itemStyles.container}>
      <View>
        <Image
          source={{uri: `${Globals.imgBaseURL}/${productImageUrl}`}}
          style={itemStyles.foodItemImage}
        />
        {/* Discount */}
        {/* <View style={itemStyles.discountBanner}>
            <Text style={itemStyles.discountText}>10% OFF</Text>
          </View> */}

        {/* stockQuantity === 0 || stockQuantity < 0
                ? itemStyles.disableAddToCartButton
                : itemStyles.addToCartButton */}
      </View>

      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            // navigation.navigate(Routes.PRODUCT_DETAIL, {
            //   item: props,
            // });
          }}>
          <View>
            {!isStore && (
              <Text style={itemStyles.titleStoreText}>{partnerName}</Text>
            )}

            <Text
              style={[itemStyles.titleText, {width: '90%'}]}
              numberOfLines={2}>
              {productName}
            </Text>

            {/* {averageRating > 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgIcon type={IconNames.StarGray} width={16} height={16} />
                <Text style={itemStyles.ratingText}>--</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgIcon
                  type={IconNames.Star}
                  width={16}
                  height={16}
                  color="gray"
                />
                <Text style={itemStyles.ratingText}>{averageRating}</Text>
                <Text style={itemStyles.ratingText}>
                  {'(' + ratingCount + ' review)'}
                </Text>
              </View>
            )} */}

            {averageRating !== 0 && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SvgIcon
                  type={IconNames.Star}
                  width={16}
                  height={16}
                  color="gray"
                />
                <Text style={itemStyles.ratingText}>{averageRating}</Text>
                <Text style={itemStyles.ratingText}>
                  {'(' + ratingCount + ' review)'}
                </Text>
              </View>
            )}

            <View style={{flexDirection: 'row'}}>
              <Text style={itemStyles.quantity}>{packagingName}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={itemStyles.discountPrice}>
                Rp.{' '}
                {formatNumberWithCommas(
                  sellingPrice !== 0 ? sellingPrice : regularPrice,
                )}
              </Text>
              {sellingPrice !== 0 && (
                <Text style={itemStyles.priceText}>
                  Rp. {formatNumberWithCommas(regularPrice)}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>

        {console.log('00000000000000000000000000000000', isStore)}
        <View
          style={
            isStoreOpen
              ? itemStyles.addToCartButton
              : itemStyles.disableAddToCartButton
          }>
          {productQty == 0 || productQty < 0 ? (
            <TouchableOpacity
              disabled={!isStoreOpen ? true : false}
              onPress={async () => {
                setLoading(true);
                try {
                  const getUserId = await AsyncStorage.getItem('userId');
                  let body = {
                    userId: getUserId, //,30032,
                    partnerId: partnerId,
                    productPackagingId: productPackagingId,
                    qty: productQty + 1,
                    price: sellingPrice == 0 ? regularPrice : sellingPrice,
                    deviceId: uniqueId._z, //"6ed0ee10b72e038b",
                    DeliveryOptionId: deliveryIn,
                    CategoryTypeId: categoryTypeId,
                  };

                  let restName = partnerName;

                  // console.log("jjjjjjjjjjjjjjjjj", restNameArry.length)
                  // if (restNameArry.length <= 1 || restNameArry.length == undefined) {
                  //   dispatch(RestaurantsName(restName))
                  // }

                  dispatch(RestaurantsName(restName));

                  // console.log("RestaurantsName===========", restNameArry[0].rest)

                  if (!isAddingAnotherRest) {
                    const data = await ProductService.addCartCountByStore(body);
                    if (data.data.isSuccess) {
                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;
                      let behaviour = 'Add';

                      //here one more condition need to be add
                      //dispatch(addProducts(groceryList));

                      const data = await ProductService.getcartCountByStore(
                        categoryTypeId,
                        deliveryIn,
                        getUserId,
                      );
                      if (data?.data?.isSuccess) {
                        //data.data.payload
                        let count = data.data.payload
                          ? data.data.payload.length
                          : 0;
                        let userCartItemId = 0;
                        let userCartId = 0;

                        // let tempArry = state.foodItems.filter(
                        //   item => item.partnerId == action.payload.partnerId,
                        // );
                        data.data.payload.forEach(item => {
                          if (item.productPackagingId == productPackagingId) {
                            userCartItemId = item.userCartItemId;
                            userCartId = item.userCartId;
                          }
                        });

                        dispatch(
                          foodAddProduct({
                            groceryList,
                            userCartItemId,
                            userCartId,
                          }),
                        );
                        dispatch(foodTotalPrice({totalPricess, behaviour}));
                        dispatch(cartCount({count}));
                        setLoading(false);
                      }
                    } else {
                      // Handle errors or show a message to the user
                      console.error('Failed to add to cart. Please try again.');
                    }
                  } else {
                    // createTwoButtonAlert();
                    setModalVisible(true);
                  }
                } catch (error) {
                  console.log('errorFoodStoreItem----', error);
                }
              }}
              style={itemStyles.addToCartContainer}>
              {isLoading ? (
                renderLoader()
              ) : (
                <SvgIcon
                  type={IconNames.BagShopping}
                  width={16}
                  height={16}
                  color={isStoreOpen ? 'white' : '#C6C6C6'}
                  style={itemStyles.addCartIcon}
                />
              )}

              <Text
                style={
                  isStoreOpen
                    ? itemStyles.addCartText
                    : itemStyles.addCartDisableText
                }>
                {t('Add to cart')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={itemStyles.cartUpdateContainer}>
              <TouchableOpacity
                style={[
                  itemStyles.cartUpdateActionContainer,
                  {
                    borderRightWidth: 1,
                  },
                ]}
                onPress={async () => {
                  setLoading(true);
                  if (productQty > 1) {
                  } else {
                    const getUserId = await AsyncStorage.getItem('userId');

                    const data = await ProductService.getcartCountByStore(
                      categoryTypeId,
                      deliveryIn,
                      getUserId,
                    );
                    console.log('fooooooooooddddddddddddddd', data);
                    if (data?.data?.isSuccess) {
                      //data.data.payload
                      let count = data.data.payload
                        ? data.data.payload.length - 1
                        : 0;

                      dispatch(cartCount({count}));
                      setLoading(false);
                    }
                  }
                  const getUserId = await AsyncStorage.getItem('userId');

                  const finalPrice =
                    sellingPrice == 0 ? regularPrice : sellingPrice;
                  let updatePrice = 0;
                  let userCartId = 0;
                  let userCartItemId = 0;
                  //alter for updated price
                  const data = await ProductService.getcartCountByStore(
                    categoryTypeId,
                    deliveryIn,
                    getUserId,
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
                      CategoryTypeId: categoryTypeId,
                    };

                    const updatedCart =
                      await ProductService.alterCartCountByStore(body);

                    if (updatedCart.data.isSuccess) {
                      let behaviour = 'Sub';

                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;

                      dispatch(foodTotalPrice({totalPricess, behaviour}));
                      dispatch(foodRemoveProduct(groceryList));
                      setLoading(false);
                      //dispatch(removeProduct(groceryList));
                    }
                  }
                }}>
                {isLoading ? (
                  renderLoader()
                ) : (
                  <SvgIcon
                    type={IconNames.Minus}
                    width={15}
                    height={15}
                    color={'white'}
                  />
                )}
              </TouchableOpacity>

              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {productQty}
              </Text>

              <TouchableOpacity
                style={[
                  itemStyles.cartUpdateActionContainer,
                  {
                    borderLeftWidth: 1,
                  },
                ]}
                onPress={async () => {
                  setLoading(true);
                  try {
                    const getUserId = await AsyncStorage.getItem('userId');
                    const finalPrice =
                      sellingPrice == 0 ? regularPrice : sellingPrice;
                    let updatePrice = 0;
                    let userCartId = 0;
                    let userCartItemId = 0;
                    //alter for updated price
                    const data = await ProductService.getcartCountByStore(
                      categoryTypeId,
                      deliveryIn,
                      getUserId,
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
                        CategoryTypeId: categoryTypeId,
                      };

                      const updatedCart =
                        await ProductService.alterCartCountByStore(body);
                      if (updatedCart.data.isSuccess) {
                        let totalPricess =
                          sellingPrice == 0 ? regularPrice : sellingPrice;
                        let behaviour = 'Add';

                        dispatch(foodTotalPrice({totalPricess, behaviour}));
                        dispatch(
                          foodAddProduct({
                            groceryList,
                            userCartItemId,
                            userCartId,
                          }),
                        );
                        setLoading(false);
                        //dispatch(addProducts(groceryList));
                      }
                    } else {
                      console.log(
                        'Something went worng in getcart or alter',
                        data?.data?.message,
                      );
                    }
                  } catch (error) {
                    console.log('Add to error', error);
                  }
                }}>
                {isLoading ? (
                  renderLoader()
                ) : (
                  <SvgIcon
                    type={IconNames.Plus}
                    width={15}
                    height={15}
                    color={'white'}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* <TouchableOpacity
            onPress={() => {


              navigation.navigate(Routes.STORE_FOOD_SELLING, {
                openingHrs: openingHrs,
                closingHrs: closingHrs,
                categoryId: categoryId,
                categoryTypeId: categoryTypeId,
                productName: productName,
                productId: productId,
                partnerId: partnerId,
                packagingName: packagingName,
                productImageUrl: productImageUrl,
                length: length,
                width: width,
                height: height,
                navigation: navigation,
              })


            }}>
            <Text style={itemStyles.subText}>View all store selling this</Text>
          </TouchableOpacity> */}
      </View>

      {/* {showStoreBottomSheetComponent && (
          <StoreBottomSheet
            productList={showStoreBottomSheetComponent}
            navigation={navigation}
            CloseStoreBottonSheet={() => {
              setStoreBottomSheetComponent(!showStoreBottomSheetComponent);
            }}
          />
        )} */}

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}>
          <View
            style={{
              flex: 1,
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',

              alignSelf: 'center',
              marginHorizontal: 17,
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
              }}>
              <View>
                <Text
                  style={[
                    itemStyles.titleStoreText,
                    {
                      alignSelf: 'center',
                    },
                  ]}>
                  Replace Cart Item?
                </Text>
                <Text style={[itemStyles.ratingText]}>
                  {restNameArry && restNameArry[0] && restNameArry[0]?.rest
                    ? `Your cart contains dishes from ${restNameArry[0]?.rest}. Do you want to discard the selection and add dishes from ${restNameArry[1]?.rest}?`
                    : 'Error: Unable to retrieve restaurant information.'}
                </Text>
                {/* <Button title="Close" onPress={toggleModal} /> */}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={[itemStyles.addToCartButton, {flex: 1}]}>
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={itemStyles.addToCartContainer}>
                    <Text style={itemStyles.addCartText}>No</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    itemStyles.addToCartButton,
                    {backgroundColor: colors.activeColor, flex: 1},
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      toggleModal();
                      ClearFoodCart();
                    }}
                    style={itemStyles.addToCartContainer}>
                    <Text style={[itemStyles.addCartText, {color: 'white'}]}>
                      Replace
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
