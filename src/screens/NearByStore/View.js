import React, { useState, useEffect } from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import BaseView from '../BaseView';
import IconNames from '../../../branding/carter/assets/IconNames';
import { Styles } from './Styles';
import { ShopService } from '../../apis/services';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native';
import { StoreItems } from '../../components/Application/StoreItems/View';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import AppConfig from '../../../branding/App_config';
import { CommonActions, useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';

const assets = AppConfig.assets.default;

export const NearByStore = props => {
  const { t, i18n } = useTranslation();

  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);
  const productCount = useSelector(state => state.product.cartCount);

  const { listNearByStore, navigation, categoryTypeId } = props.route.params;
  const [isLoading, setLoading] = useState(true);
  const [nearStore, setNearStore] = useState([]);

  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);

  useEffect(() => {
    if (categoryTypeId == 1) {
      getGroceryNearStore();
    } else if (categoryTypeId == 2) {
      getRestaurantNearStore();
    } else if (categoryTypeId == 5) {
      getFreshNearStore();
    }
  }, [categoryTypeId, latSlice]);

  const getGroceryNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      latitude: latSlice,
      longitude: lngSlice,
      userId: getUserId,
    };

    try {
      const responseNearShop = await ShopService.getGroceryNearShop(body);
      console.log('===========================', responseNearShop);

      if (responseNearShop.data.isSuccess) {
        responseNearShop.data.payload !== null &&
          setNearStore(responseNearShop.data.payload);

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('error==>', error);
      console.log('===========================', error);
    }
  };

  const getRestaurantNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    console.log('=====================34343=', categoryTypeId);

    let body = {
      latitude: latSlice,
      longitude: lngSlice,
      userId: getUserId,
    };

    try {
      const responseNearShop = await ShopService.getRestaurantNearShop(body);
      if (responseNearShop.data.isSuccess) {
        responseNearShop.data.payload !== null &&
          setNearStore(responseNearShop.data.payload);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('error==>', error);
    }
  };

  const getFreshNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    console.log('=====================34343=', categoryTypeId);

    let body = {
      latitude: latSlice,
      longitude: lngSlice,
      userId: getUserId,
    };

    try {
      const responseNearShop = await ShopService.getFreshNearShop(body);
      if (responseNearShop.data.isSuccess) {
        responseNearShop.data.payload !== null &&
          setNearStore(responseNearShop.data.payload);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('error==>', error);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (categoryTypeId == 1) {
  //       getGroceryNearStore();
  //     } else {
  //       getRestaurantNearStore();
  //     }
  //   }, []),
  // );
  return (
    <View style={[screenStyles.container]}>
      <BaseView
        navigation={props.navigation}
        title={
          categoryTypeId == 1
            ? t('Near by Stores')
            : categoryTypeId == 2
              ? t('Near by Restaurant')
              : t('Fresh Good Shopes')
        }
        rightIcon={productCount != 0 && IconNames.BagShopping}
        onRightIconPress={() => { }}
        headerWithBack={true}
        applyBottomSafeArea
        childView={() => {
          return (
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
              ) : nearStore.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={assets.near_store}
                      style={screenStyles.headerImage}
                    />

                    <Text style={screenStyles.title}>
                      {categoryTypeId == 1 ? 'No Store' : 'No Restaurant'}
                    </Text>
                    <Text style={screenStyles.subTitle}>
                      {categoryTypeId == 1
                        ? "We're sorry, but there are currently no serviceable stores in your area. Please change your delivery address."
                        : "We're sorry, but there are currently no serviceable restaurants in your area. Please change your delivery address."}
                    </Text>
                  </View>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={nearStore}
                  keyExtractor={(item, index) => {
                    return item.id;
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={Styles.foodFirstItem}>
                        <StoreItems
                          id={item.id}
                          partnerName={item.partnerName}
                          latitude={item.latitude}
                          longitude={item.longitude}
                          openingHrs={item.openingHrs}
                          closingHrs={item.closingHrs}
                          districtName={item.districtName}
                          photo={item.photo}
                          autoOpen={item.autoOpen}
                          navigation={navigation}
                          categoryTypeId={categoryTypeId}
                        />
                      </View>
                    );
                  }}
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
