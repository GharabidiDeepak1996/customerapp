import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  FlatList,
  ToastAndroid,
  StyleSheet,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Text, Rating } from 'react-native-elements';
import Routes from '../../navigation/Routes';
import { StylesNew } from './Styles';
import AppHeader from '../../components/Application/AppHeader/View';
import { Counter } from '../../components/Global/Counter/View';
import StarRating from 'react-native-star-rating';
import { FavouritesBottomSheet } from '../../components/Application/FavouritesBottomSheet/View';
import RBSheet from 'react-native-raw-bottom-sheet';
import ReadMore from '@fawazahmed/react-native-read-more';
import AppButton from '../../components/Application/AppButton/View';
import { useTheme } from '@react-navigation/native';
import IconNames from '../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import { FocusAwareStatusBar } from '../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import Globals from '../../utils/Globals';
import axios from 'axios';
import { ProductSuggest } from '../../components/Application/ProductSuggest/View';
import AppConfig from '../../../branding/App_config';
import { AuthService } from '../../apis/services/Auth';
const Fonts = AppConfig.fonts.default;
const baseUrl = Globals.baseUrl;
const Typography = AppConfig.typography.default;
import { useDispatch, useSelector } from 'react-redux';
import {
  addProducts,
  cartCount,
  removeProduct,
} from '../../redux/features/AddToCart/ProductSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductService } from '../../apis/services';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

function StoreList(props) {
  const [isStoreOpenh, setStoreOpenh] = useState(false);

  const {
    productPackagingId,
    partnerName,
    regularPrice,
    sellingPrice,
    stockQuantity,
    productId,
    partnerId,
    partnerStoreId,
    openingHrs,
    closingHrs,
  } = props.item;
  const { screenStyles, colors, categoryTypeId, navigation } = props;
  //redux toolkit
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const product = useSelector(state =>
    state.product.cartItems.find(
      item =>
        item.partnerId === partnerId &&
        item.productId === productId &&
        item.partnerStoreId === partnerStoreId,
    ),
  );
  const productQty = product ? product.qty : 0;
  const uniqueId = DeviceInfo.getUniqueId();

  // function isStoreOpen(openingHrs, closingHrs) {

  //   // var currentDate = moment(new Date()).format('hh:mm A');
  //   // let openStore = '';
  //   // if (currentDate >= openingHrs) {
  //   //   if (currentDate < closingHrs) {
  //   //     console.log('Store is open.');
  //   //     return (openStore = 'Open');
  //   //   } else {
  //   //     console.log('Store is closed.');
  //   //     return (openStore = 'Close');
  //   //   }
  //   // } else {
  //   //   console.log('Store is closed.');
  //   //   return (openStore = 'Close');
  //   // }

  //   try {
  //     //var currentDate = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
  //     var currentDate = moment(new Date()).format('hh:mm A');
  //     //const formattedOpeningHours = moment(openingHours, 'hh:mm A').format('hh:mm A');

  //     let openStore = '';

  //     console.log('product-------12771', currentDate, openingHrs, currentDate >= openingHrs, currentDate < closingHrs);

  //     if (currentDate >= openingHrs || currentDate < closingHrs) {
  //       console.log('Store is open.');
  //       return (openStore = 'Open');
  //     } else {
  //       console.log('Store is close.');
  //       return (openStore = 'Close');
  //     }
  //   } catch (err) {
  //     console.log('product-------121', err);
  //   }
  // }

  // const isStoreOpen = (openingHrs, closingHrs) => {
  //   try {
  //     var currentDate = moment(new Date()).format('hh:mm A');

  //     let openStore = '';

  //     console.log('product-------12771', currentDate, openingHrs, currentDate >= openingHrs, currentDate < closingHrs);

  //     if (moment(currentDate, 'hh:mm A').isBetween(moment(openingHrs, 'hh:mm A'), moment(closingHrs, 'hh:mm A'), null, '[]')) {
  //       console.log('Store is open.');
  //       setStoreOpenh(true)
  //       return (openStore = 'Open');
  //     } else {
  //       console.log('Store is closed.');
  //       setStoreOpenh(false)
  //       return (openStore = 'Closed');
  //     }
  //   } catch (err) {
  //     console.log('product-------121', err);
  //   }
  // }

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
          )
        ) {
          console.log('Store is open.');
          setStoreOpenh(true);
          return (openStore = 'Open');
        } else {
          console.log('Store is closed.');
          setStoreOpenh(false);
          return (openStore = 'Closed');
        }
      } catch (err) {
        console.log('product-------121', err);
      }
    };

    determineStoreOpenStatus();
  }, [openingHrs, closingHrs]);

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 12,
          margin: 8,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              backgroundColor: '#1b8346',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 3,
              color: 'white',
              marginBottom: 8,
              width: '22%',
              textAlign: 'center',
            }}>
            {isStoreOpenh ? 'Open' : 'Closed'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            {partnerName}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.RUBIK_MEDIUM,
              color: '#1b8346',
              fontSize: Typography.P3,
            }}>
            {/* Rp:{props.item.price} */}
            Rp:{regularPrice}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(Routes.STORE, {
                restaurantId: partnerId,
                partnerName: partnerName,
                openingHrs: openingHrs,
                closingHrs: closingHrs,
                categoryTypeId: categoryTypeId,
                navigation: navigation,
              });
            }}>
            <Text style={{ textDecorationLine: 'underline' }}>Visit store</Text>
          </TouchableWithoutFeedback>
          {/* Add to cart  !isStoreOpenh ??*/}
          {console.log('=====================================', isStoreOpenh)}
          <View
            style={
              !isStoreOpenh ??
                (props.item.stockQuantity === 0 || props.item.stockQuantity < 0)
                ? styles.buttonDeActiveContainer
                : styles.buttonActiveContainer
            }>
            {productQty == 0 || productQty < 0 ? (
              <TouchableOpacity
                disabled={!isStoreOpenh ? true : false}
                onPress={async () => {
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

                    const data = await ProductService.addCartCountByStore(body);
                    if (data.data.isSuccess) {
                      dispatch(addProducts(props.item));

                      const data = await ProductService.getcartCountByStore(
                        categoryTypeId,
                        deliveryIn,
                      );
                      if (data?.data?.isSuccess) {
                        let count = data.data.payload
                          ? data.data.payload.length
                          : 0;
                        dispatch(cartCount({ count }));
                      }
                    } else {
                      // Handle errors or show a message to the user
                      console.error('Failed to add to cart. Please try again.');
                    }
                  } catch (error) {
                    console.log('errorStoreFoodSelling----', error);
                  }
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <SvgIcon
                    type={IconNames.BagShopping}
                    width={20}
                    height={20}
                    color={!isStoreOpenh ? '#C6C6C6' : '#4E9F3D'}
                    style={{ marginRight: 12 }}
                  />
                  {/* //props.itemStyles.addCartText */}

                  <Text
                    style={
                      !isStoreOpenh
                        ? styles.addCartDisableText
                        : styles.addCartText
                    }>
                    {'Add To Cart'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                }}>
                <TouchableOpacity
                  //props.item.stockQuantity
                  onPress={async () => {
                    if (productQty > 1) {
                    } else {
                      const data = await ProductService.getcartCountByStore(
                        categoryTypeId,
                        deliveryIn,
                      );
                      if (data?.data?.isSuccess) {
                        //data.data.payload
                        let count = data.data.payload
                          ? data.data.payload.length - 1
                          : 0;
                        console.log(
                          '=--------------------------------productQty',
                          count,
                        );

                        dispatch(cartCount({ count }));
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
                        dispatch(removeProduct({ groceryList: props.item, getUserId: getUserId }))
                        //dispatch(removeProduct(props.item));
                      }
                    }
                  }}>
                  <SvgIcon
                    type={IconNames.Minus}
                    width={15}
                    height={15}
                    color={colors.activeColor}
                  />
                </TouchableOpacity>

                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                  {productQty}
                </Text>

                <TouchableOpacity
                  onPress={async () => {
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
                          qty: productQty + 1,
                          price: updatePrice + finalPrice,
                          CategoryTypeId: categoryTypeId,
                        };

                        const updatedCart =
                          await ProductService.alterCartCountByStore(body);
                        if (updatedCart.data.isSuccess) {
                          dispatch(addProducts(props.item));
                        }
                      } else {
                        ToastAndroid.show(
                          'Something went worng in getcart or alter' +
                          data?.data?.message,
                          ToastAndroid.SHORT,
                        );
                      }
                    } catch (error) {
                      console.log('Add to error====', error);
                    }
                  }}>
                  <SvgIcon
                    type={IconNames.Plus}
                    width={15}
                    height={15}
                    color={colors.activeColor}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}
export const StoreFoodSelling = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = StylesNew(scheme, colors);
  const [storeSelling, setStoreSelling] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const {
    productImageUrl,
    categoryTypeId,
    productName,
    productId,
    partnerId,
    packagingName,
    categoryId,
    length,
    width,
    height,
    navigation,
  } = props.route.params;

  useEffect(() => {
    getShopList(productId);
  }, []);

  const getShopList = async productId => {
    try {
      let response = await AuthService.getStoreDetails(productId);

      if (response?.data?.isSuccess) {
        let newArray = response?.data?.payload;
        setStoreSelling(newArray); // Move this line inside the 'if' block
        // setLoaderParent(false);
        // setShowError(false);
      } else {
        // setLoaderParent(false);
        // setShowError(true);
        //setErrorMessage
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={screenStyles.container}>
      <FocusAwareStatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      <AppHeader
        navigation={props.navigation}
        headerWithBackground
        headerWithBack
        darkIcons
        title={productName}
      />

      <View style={screenStyles.imageContainer}>
        <Image
          source={{ uri: `${Globals.imgBaseURL}/${productImageUrl}` }}
          resizeMode={'contain'}
          style={screenStyles.mainImage}
        />
      </View>

      <View style={screenStyles.bottomContainerMain}>
        <View style={screenStyles.bottomContainerUpper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={screenStyles.nameText}>{productName}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={screenStyles.cartCounterText}>{packagingName}</Text>

              <Text
                style={{
                  marginHorizontal: 3,
                  textAlignVertical: 'center',
                }}>
                •
              </Text>

              <View>
                {/* weightText */}
                <Text style={screenStyles.cartCounterText} numberOfLines={2}>
                  Dimensions {length * width * height} cm³
                </Text>
              </View>
            </View>

            <Text style={screenStyles.cartCounterText1}>
              Buy from below stores
            </Text>

            {storeSelling.map((item, key) => {
              return (
                <StoreList
                  key={key}
                  item={item}
                  screenStyles={screenStyles}
                  colors={colors}
                  categoryTypeId={categoryTypeId}
                  navigation={navigation}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 12,
    //flex: 1
    // height: heightPercentageToDP(40),
  },
  addCartDisableText: {
    color: '#C6C6C6',
  },
  addCartText: {
    color: '#4E9F3D',
  },
  buttonActiveContainer: {
    borderColor: '#4E9F3D',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 130,
    // alignContent: 'center',
    //alignSelf: 'center',
  },
  buttonDeActiveContainer: {
    backgroundColor: '#eeeeee',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 130,
  },
});
