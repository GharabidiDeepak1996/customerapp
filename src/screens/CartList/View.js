import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';

import BaseView from '../BaseView';
import Routes from '../../navigation/Routes';
import { CartItem } from '../../components/Application/CartItem/View';
import { Divider, Text } from 'react-native-elements';
import { Styles } from './Styles';
import Globals from '../../utils/Globals';
import AppButton from '../../components/Application/AppButton/View';
import { CommonActions, useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import Config from '../../../branding/carter/configuration/Config';
import { ProductService } from '../../apis/services/product';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { log } from 'react-native-reanimated';
import { parse } from 'react-native-svg';
import AppConfig from '../../../branding/App_config';
import { addToCart } from '../../redux/features/Cart/cartSlice';
import { ActivityIndicator } from 'react-native';
import {
  cartCount,
  clearProducts,
} from '../../redux/features/AddToCart/ProductSlice';
import { useTranslation } from 'react-i18next';
import { formatDecimalNumber } from '../../utils/FormatDecimalNumber';
import { formatNumberWithCommas } from '../../utils/FormatNumberWithCommas';
import {
  setDeliveryAddress,
  setDeliveryAddressId,
} from '../../redux/features/Address/DefaultAddressSlice';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartList = props => {
  //Language Translation
  const { t, i18n } = useTranslation();

  //Redux
  const dispatch = useDispatch();
  const cartCountQty = useSelector(state => state.product.cartCount);
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  //Theme based styling and colors
  const Fonts = AppConfig.fonts.default;
  const Typography = AppConfig.typography.default;

  const { colors } = useTheme();
  const scheme = useColorScheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);
  const assets = AppConfig.assets.default;

  //internal states
  const [cartList, setCartList] = useState();
  const [isLoading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen is focused');
      fetchCartedList();
    }, []),
  );

  const fetchCartedList = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      let checkOut = 0;
      let cartQty = 0;
      var totalWeight = 0;
      let totalDimensions = 0;
      let count = 0;
      let partnerLatitude = 0;
      let partnerLongitude = 0;
      let subDistrictId = 0;
      let parCartQty = 0;
      let parWeight = 0;
      let parXy = 0;
      let parZy = 0;

      const data = await ProductService.getcartCountByStore(
        props.route.params.categoryTypeId,
        1,
        getUserId,
      );

      console.log(
        '99999999999999999000000000000000000000000000',
        data.data.payload,
      );
      if (data?.data?.isSuccess) {
        setLoading(false);

        if (data?.data?.payload.length > 0) {
          //loop for cart price
          count = data?.data?.payload.length || 0;

          partnerLatitude = data?.data?.payload[0].partnerLatitude;
          partnerLongitude = data?.data?.payload[0].partnerLongitude;
          subDistrictId = data?.data?.payload[0].subDistrictId;

          data?.data?.payload.map((item, key) => {
            checkOut += item.cartPrice;
            cartQty += item.cartQty;
            totalWeight += item.weight * item.cartQty;
            totalDimensions +=
              item.length * item.width * item.height * item.cartQty;

            parCartQty = item.cartQty;

            //loop for attribute
            // item.attribute.map((item, key) => {
            //   if (item.name == 'Weight') {
            //     const xc = item.value * parCartQty;
            //     parXy += xc;

            //     setTotalWeight(parXy);
            //   } else if (item.name === 'Dimensions') {
            //     const xc = item.value * parCartQty;
            //     parZy += xc;
            //     setTotalDimensions(parZy);
            //     //totalDimensions += parseInt(item.value);
            //   }
            // });
          });

          dispatch(cartCount({ count }));

          setCartList(prevData => ({
            ...prevData,
            payload: data?.data?.payload || [],
            totalWeight: totalWeight,
            totalDimensions: totalDimensions,
            totalAmt: checkOut,
            partnerLatitude: partnerLatitude,
            partnerLongitude: partnerLongitude,
            subDistrictId: subDistrictId,
          }));
          setLoading(false);
        }
      } else {
        count = 0;
        dispatch(cartCount({ count }));
        setLoading(false);
        setCartList(prevData => ({
          ...prevData,
          payload: [],
        }));
      }
    } catch (error) {
      console.log('Errorlog', error);
      setLoading(false);
    }
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={t('Cart')}
      showAppHeader={true}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          // style={[screenStyles.container, { backgroundColor: 'red' }]}
          <View
            style={{
              flex: 1,
              backgroundColor: '#f5f5f5',
              marginHorizontal: -16,
              paddingHorizontal: 16,
            }}>
            {isLoading ? (
              <ActivityIndicator
                color={colors.activeColor}
                size="large"
                style={{ flex: 1 }}
              />
            ) : cartList?.payload?.length > 0 ? (
              <View style={{ flex: 0.9 }}>
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.RUBIK_MEDIUM,
                      fontSize: Typography.P2,
                      color: colors.subHeadingColor,
                      marginBottom: 6,
                    }}>
                    {/* {t('Product Details')} */}
                    {cartList?.payload[0].productTypeId == 2 &&
                      t('Item Details')}
                    {(cartList?.payload[0].productTypeId == 1 ||
                      cartList?.payload[0].productTypeId == 5) &&
                      t('Product Details')}
                  </Text>
                </View>

                <FlatList
                  showsVerticalScrollIndicator={true}
                  persistentScrollbar={true}
                  // style={screenStyles.listContainer}
                  // persistentScrollbar={true}
                  data={cartList?.payload}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={screenStyles.flatListFirstItemContainer}>
                        <CartItem
                          productStoreId={item.productStoreId}
                          userId={item.userId}
                          productId={item.productId}
                          partnerId={item.partnerId}
                          userCartId={item.userCartId}
                          userCartItemId={item.userCartItemId}
                          title={item.productName}
                          image={item.productImageUrl}
                          //bigImage={item.bigImage}
                          price={item.price}
                          sellingPrice={item.sellingPrice}
                          regularPrice={item.regularPrice}
                          weight={item.weight}
                          discount={item.discount}
                          cartPrice={item.cartPrice}
                          cartCount={item.cartQty}
                          cartCountChange={count => { }}
                          navigation={props.navigation}
                          fetchCartedList={fetchCartedList}
                          isVerticalUI={true}
                          categoryTypeId={props.route.params.categoryTypeId}
                          partnerName={item.partnerName}
                          specification={item.specification}
                          length={item.length}
                          width={item.width}
                          height={item.height}
                          cartList={item}
                          stockQuantity={item.stockQuantity}
                          partnerStoreId={item.partnerStoreId}
                          packagingName={item.packagingName}
                          ratingCount={item.ratingCount}
                          productTypeId={item.productTypeId}
                          coldStorageFee={item.coldStorageFee}
                        />
                      </View>
                    );
                  }}
                />

                <View
                  style={{
                    backgroundColor: 'white',
                    marginHorizontal: -16,
                    paddingHorizontal: 16,
                  }}>
                  <View style={{ marginVertical: 10 }}>
                    <Text
                      style={{
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        fontSize: Typography.P2,
                        color: colors.subHeadingColor,
                      }}>
                      {t('Order Details')}
                    </Text>
                  </View>
                  <View style={screenStyles.totalContainer}>
                    <Text style={screenStyles.subtotalLabelText}>
                      {/* {t('Total Products')} */}
                      {cartList?.payload[0].productTypeId == 1 &&
                        'Total Products'}
                      {(cartList?.payload[0].productTypeId == 2 ||
                        cartList?.payload[0].productTypeId == 5) &&
                        'Total Items'}
                    </Text>
                    <Text style={screenStyles.subtotalValueText}>
                      {cartCountQty}
                    </Text>
                  </View>

                  {cartList?.payload[0].productTypeId !== 2 && (
                    <View style={screenStyles.totalContainer}>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('Total Weight')}
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        {formatDecimalNumber(cartList?.totalWeight)} kg
                        {/* {Math.round(totalWeight)} kg */}
                      </Text>
                    </View>
                  )}

                  {cartList?.payload[0].productTypeId !== 2 && (
                    <View style={screenStyles.totalContainer}>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('Total Dimension')}
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        {Math.round(cartList?.totalDimensions)} cm3
                      </Text>
                    </View>
                  )}

                  <Divider style={screenStyles.horizontalDivider} />

                  <View style={screenStyles.totalContainer}>
                    <Text style={screenStyles.totalLabelText}>
                      {t('Total Amount')}
                    </Text>
                    <Text style={screenStyles.totalValueText}>
                      Rp. {formatNumberWithCommas(cartList?.totalAmt)}
                    </Text>
                  </View>
                </View>

                <View style={[screenStyles.bottomContainer, { flex: 0.001 }]}>
                  <AppButton
                    title={t('Checkout')}
                    onPress={() => {
                      dispatch(setDeliveryAddress(''));
                      dispatch(setDeliveryAddressId(0));

                      props.navigation.navigate(
                        Routes.CHECKOUT_SELECTED_PRODUCT,
                        {
                          payload: cartList?.payload,
                          categoryTypeId: props.route.params.categoryTypeId,
                          totalAmt: cartList?.totalAmt,
                          totalWeight: cartList?.totalWeight,
                          totalDimensions: cartList?.totalDimensions,
                          partnerLatitude: cartList?.partnerLatitude,
                          partnerLongitude: cartList?.partnerLongitude,
                          partnerSubDistrictId: cartList?.subDistrictId,
                          coldStorageFee: cartList?.payload[0].coldStorageFee,
                        },
                      );
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={assets.no_cart}
                    style={screenStyles.headerImage}
                  />

                  <Text style={screenStyles.title}>Empty Cart</Text>
                  <Text style={[screenStyles.subTitle, { marginBottom: 10 }]}>
                    Your cart is currently empty. Add some goodies and let's get
                    shopping!
                  </Text>
                  <AppButton
                    title={t('Continue Shopping')}
                    onPress={() => {
                      props.navigation.goBack();
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        );
      }}
    />
  );
};
