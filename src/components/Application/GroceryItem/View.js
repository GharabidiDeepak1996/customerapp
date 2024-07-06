import React, {useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  StyleSheet,
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
  groceryTotalPrice,
  freshGoodTotalPrice,
  freshGoodAddProducts,
  freshGoodRemoveProduct,
} from '../../../redux/features/AddToCart/ProductSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {ProductService} from '../../../apis/services/product';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {formatNumberWithCommas} from '../../../utils/FormatNumberWithCommas';

export const GroceryItem = props => {
  const {t, i18n} = useTranslation();

  //Redux tool kit
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  //storebottom sheet
  const isStoreBottomSheetOpen = true;
  const [showStoreBottomSheetComponent, setStoreBottomSheetComponent] =
    useState(false);
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
    onMessage,
    autoOpen,
  } = props;

  const _storeBottomSheetComponent = () => {
    setStoreBottomSheetComponent(props);
  };

  const product = useSelector(state =>
    state.product.cartItems.find(
      item =>
        item.partnerId === partnerId &&
        item.productId === productId &&
        item.partnerStoreId === partnerStoreId,
    ),
  );

  const uniqueId = DeviceInfo.getUniqueId();

  //getting qty
  const productQty = product ? product.qty : 0;
  // const updateCartPrice = product ? product.qty : 0;
  const [isStoreOpenh, setStoreOpenh] = useState(false);

  useEffect(() => {
    const determineStoreOpenStatus = () => {
      try {
        var currentDate = moment(new Date()).format('hh:mm A');
        let openStore = '';

        if (
          moment(currentDate, 'hh:mm A').isBetween(
            moment(openingHrs, 'hh:mm A'),
            moment(closingHrs, 'hh:mm A'),
            null,
            '[]',
          ) &&
          autoOpen
        ) {
          setStoreOpenh(false);
          return (openStore = 'Open');
        } else {
          setStoreOpenh(true);
          return (openStore = 'Closed');
        }
      } catch (err) {
        console.log('product-------121', err);
      }
    };

    determineStoreOpenStatus();
  }, []);
  //openingHrs, closingHrs

  const handleSendMessage = () => {
    // Send message to the parent component using the callback
    onMessage(true);
  };

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

  return (
    <View style={itemStyles.container}>
      <View style={{width: '40%', alignItems: 'center'}}>
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
        <View
          style={[
            isStoreOpenh || stockQuantity === 0 || stockQuantity < 0
              ? itemStyles.disableAddToCartButton
              : itemStyles.addToCartButton,
          ]}>
          {productQty == 0 || productQty < 0 ? (
            <TouchableOpacity
              //disabled={(isStoreOpenh && (stockQuantity === 0 || stockQuantity < 0))}
              disabled={isStoreOpenh || stockQuantity <= 0}
              onPress={async () => {
                setLoading(true);
                try {
                  //handleSendMessage()
                  const getUserId = await AsyncStorage.getItem('userId');
                  let body = {
                    userId: getUserId, //,30032,
                    partnerId: partnerId,
                    productPackagingId: productPackagingId,
                    qty: productQty + 1,
                    price: sellingPrice == 0 ? regularPrice : sellingPrice,
                    deviceId: uniqueId._z,
                    DeliveryOptionId: deliveryIn,
                    CategoryTypeId: categoryTypeId,
                  };

                  const data = await ProductService.addCartCountByStore(body);

                  if (data.data.isSuccess) {
                    let totalPricess =
                      sellingPrice == 0 ? regularPrice : sellingPrice;
                    let behaviour = 'Add';
                    {
                      categoryTypeId == 1 &&
                        dispatch(addProducts({groceryList, getUserId}));
                    }
                    {
                      categoryTypeId == 1 &&
                        dispatch(groceryTotalPrice({totalPricess, behaviour}));
                    }

                    {
                      categoryTypeId == 5 &&
                        dispatch(
                          freshGoodAddProducts({groceryList, getUserId}),
                        );
                    }
                    {
                      categoryTypeId == 5 &&
                        dispatch(
                          freshGoodTotalPrice({totalPricess, behaviour}),
                        );
                    }
                    const data = await ProductService.getcartCountByStore(
                      categoryTypeId,
                      1,
                      getUserId,
                    );

                    console.log(
                      'Response add to cart--------------',
                      data?.data,
                    );
                    if (data?.data?.isSuccess) {
                      //data.data.payload

                      let count = data.data.payload
                        ? data.data.payload.length
                        : 0;

                      dispatch(cartCount({count}));

                      setLoading(false);
                    }
                  } else {
                    // Handle errors or show a message to the user
                    console.error('Faileddd to add to cart. Please try again.');
                  }
                } catch (error) {
                  console.log('errorGrocrtyiYem----', error);
                }
              }}
              style={itemStyles.addToCartContainer}>
              {stockQuantity > 0 &&
                (isLoading ? (
                  renderLoader()
                ) : (
                  <SvgIcon
                    type={IconNames.BagShopping}
                    width={14}
                    height={14}
                    color={
                      isStoreOpenh || stockQuantity === 0 || stockQuantity < 0
                        ? colors.inactiveColor
                        : colors.activeColor
                    }
                    style={itemStyles.addCartIcon}
                  />
                ))}

              <Text
                style={
                  isStoreOpenh || stockQuantity === 0 || stockQuantity < 0
                    ? itemStyles.addCartDisableText
                    : itemStyles.addCartText
                }>
                {stockQuantity === 0 || stockQuantity < 0
                  ? t('Out of stock')
                  : t('Add to cart')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={itemStyles.cartUpdateContainer}>
              <TouchableOpacity
                style={[itemStyles.cartUpdateActionContainer]}
                onPress={async () => {
                  const getUserId = await AsyncStorage.getItem('userId');
                  setLoading(true);
                  if (productQty > 1) {
                  } else {
                    // handleSendMessage()
                    const data = await ProductService.getcartCountByStore(
                      categoryTypeId,
                      1,
                      getUserId,
                    );
                    if (data?.data?.isSuccess) {
                      //data.data.payload
                      let count = data.data.payload
                        ? data.data.payload.length - 1
                        : 0;

                      setLoading(false);
                      dispatch(cartCount({count}));
                    }
                  }

                  const finalPrice =
                    sellingPrice == 0 ? regularPrice : sellingPrice;
                  let updatePrice = 0;
                  let userCartId = 0;
                  let userCartItemId = 0;
                  //alter for updated price
                  const data = await ProductService.getcartCountByStore(
                    categoryTypeId,
                    1,
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

                    console.log('alterCartCountByStore__________', body);

                    const updatedCart =
                      await ProductService.alterCartCountByStore(body);
                    if (updatedCart.data.isSuccess) {
                      let behaviour = 'Sub';

                      let totalPricess =
                        sellingPrice == 0 ? regularPrice : sellingPrice;

                      {
                        categoryTypeId == 1 &&
                          dispatch(
                            groceryTotalPrice({totalPricess, behaviour}),
                          );
                      }
                      {
                        categoryTypeId == 1 &&
                          dispatch(removeProduct({groceryList, getUserId}));
                      }

                      {
                        categoryTypeId == 5 &&
                          dispatch(
                            freshGoodRemoveProduct({groceryList, getUserId}),
                          );
                      }
                      {
                        categoryTypeId == 5 &&
                          dispatch(
                            freshGoodTotalPrice({totalPricess, behaviour}),
                          );
                      }

                      setLoading(false);
                    }
                  }
                  // } else {
                  //   console.log("Add to error minsssssssssssssssss", productQty)

                  //   dispatch(deleteProduct(groceryList))
                  // }
                }}>
                {isLoading ? (
                  renderLoader()
                ) : (
                  <SvgIcon
                    type={IconNames.Minus}
                    width={15}
                    height={15}
                    color={colors.activeColor}
                  />
                )}
              </TouchableOpacity>

              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  paddingHorizontal: 12,
                }}>
                {productQty}
              </Text>

              <TouchableOpacity
                disabled={productQty == stockQuantity ? true : false}
                style={[
                  itemStyles.cartUpdateActionContainer,
                  // {
                  //   borderLeftWidth: 1,
                  // },
                ]}
                onPress={async () => {
                  setLoading(true);
                  if (stockQuantity >= productQty + 1) {
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
                        1,
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

                        console.log('alterCartCountByStore__________', body);

                        if (updatedCart.data.isSuccess) {
                          let totalPricess =
                            sellingPrice == 0 ? regularPrice : sellingPrice;
                          let behaviour = 'Add';
                          {
                            categoryTypeId == 1 &&
                              dispatch(addProducts({groceryList, getUserId}));
                          }
                          {
                            categoryTypeId == 1 &&
                              dispatch(
                                groceryTotalPrice({totalPricess, behaviour}),
                              );
                          }

                          {
                            categoryTypeId == 5 &&
                              dispatch(
                                freshGoodAddProducts({groceryList, getUserId}),
                              );
                          }
                          {
                            categoryTypeId == 5 &&
                              dispatch(
                                freshGoodTotalPrice({totalPricess, behaviour}),
                              );
                          }

                          setLoading(false);
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
                  } else {
                    console.log('out of stock quntity');
                    ToastAndroid.show(
                      'out of stock quntity',
                      ToastAndroid.SHORT,
                    );
                  }
                }}>
                {isLoading ? (
                  renderLoader()
                ) : (
                  <SvgIcon
                    type={
                      productQty == stockQuantity
                        ? IconNames.BagShopping
                        : IconNames.Plus
                    }
                    width={15}
                    height={15}
                    color={colors.activeColor}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={{width: '60%'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(Routes.PRODUCT_DETAIL, {
              productDetails: props,
              categoryTypeId: categoryTypeId,
            });
          }}>
          <View>
            {!isStore && (
              <Text style={itemStyles.titleStoreText}>{t(partnerName)}</Text>
            )}

            <Text style={itemStyles.titleText} numberOfLines={2}>
              {productName}
            </Text>

            {/* {averageRating != 0 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgIcon
                type={IconNames.Star}
                width={18}
                height={18}
                color="gray"
              />
              <Text style={itemStyles.ratingText}>{averageRating}</Text>
              <Text style={itemStyles.ratingText}>{"(" + ratingCount + " review)"}</Text>
            </View>} */}

            {/* {averageRating == 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgIcon type={IconNames.StarGray} width={16} height={16} />
                <Text style={itemStyles.ratingText}>--</Text>
              </View>
            ) : */}
            {averageRating !== 0 && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SvgIcon
                  type={IconNames.Star}
                  width={18}
                  height={18}
                  color="gray"
                />
                <Text style={itemStyles.ratingText}>{averageRating}</Text>
                <Text style={itemStyles.ratingText}>
                  {'(' + ratingCount + ' review)'}
                </Text>
              </View>
            )}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={itemStyles.quantity}>Stock {stockQuantity}</Text>
              <Text style={{marginHorizontal: 3}}>•</Text>
              <Text style={itemStyles.quantity}>{packagingName}</Text>
              <Text style={{marginHorizontal: 3}}>•</Text>
              <View>
                <Text style={itemStyles.quantity} numberOfLines={2}>
                  {Math.round(length * width * height)} cm³
                </Text>
              </View>
            </View>

            <Text style={itemStyles.discountPrice}>
              Rp.{' '}
              {formatNumberWithCommas(
                sellingPrice == 0 ? regularPrice : sellingPrice,
              )}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Routes.STORE_SELLING, {
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
                });
              }}>
              <Text style={itemStyles.subText} numberOfLines={2}>
                {t('View all store selling this')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {showStoreBottomSheetComponent && (
        <StoreBottomSheet
          productList={showStoreBottomSheetComponent}
          navigation={navigation}
          CloseStoreBottonSheet={() => {
            setStoreBottomSheetComponent(!showStoreBottomSheetComponent);
          }}
        />
      )}
    </View>
  );
};
