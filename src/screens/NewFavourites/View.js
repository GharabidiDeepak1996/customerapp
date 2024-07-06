import React, { useState, useEffect } from 'react';
import { View, Text, useColorScheme } from 'react-native';
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
import { Image } from 'react-native';
const assets = AppConfig.assets.default;
import { useTheme } from '@react-navigation/native';
import Routes from '../../navigation/Routes';

export const NewFavourites = props => {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  const { t, i18n } = useTranslation();

  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);
  const { navigation } = props.route.params;
  const [isLoading, setLoading] = useState(true);
  const [nearStore, setNearStore] = useState([]);
  const [isdata, setIsdata] = useState(true);

  //   const getGroceryNearStore = async () => {
  //     const getUserId = await AsyncStorage.getItem('userId');

  //     console.log('latlong----', latSlice, lngSlice, getUserId);

  //     let body = {
  //       latitude: latSlice,
  //       longitude: lngSlice,
  //       userId: getUserId,
  //     };

  //     try {
  //       const responseNearShop = await ShopService.getGroceryNearShop(body);

  //       console.log(responseNearShop.data);
  //       if (responseNearShop.data.isSuccess) {
  //         responseNearShop.data.payload !== null &&
  //           setNearStore(responseNearShop.data.payload);
  //         setLoading(false);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.log('error==>', error);
  //       console.log('===========================', error);
  //     }
  //   };

  const getUserFavourites = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    try {
      const responseNearShop = await ShopService.getUserFavourites(getUserId);

      if (responseNearShop?.data?.isSuccess) {
        responseNearShop?.data?.payload !== null &&
          setNearStore(responseNearShop?.data?.payload);
        setLoading(false);
        setIsdata(true);
      } else {
        setIsdata(false);

        setLoading(false);
      }
    } catch (error) {
      setIsdata(false);
      console.log('error==>', error);
      console.log('===========================', error);
    }
  };

  useEffect(() => {
    //getGroceryNearStore();
    getUserFavourites();
    // if (categoryTypeId == 1) {
    //   getGroceryNearStore();
    // } else {
    //   getRestaurantNearStore();
    // }
  }, []);

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       if (categoryTypeId === 1) {
  //         getGroceryNearStore();
  //       } else {
  //         getRestaurantNearStore();
  //       }
  //     }, []),
  //   );
  return (
    <View style={itemStyles.container}>
      <BaseView
        navigation={props.navigation}
        title={t('Favourites')}
        headerWithBack={true}
        onBackPress={() => {
          props.navigation.navigate(Routes.PROFILE)
        }}
        applyBottomSafeArea
        childView={() => {
          return (
            <View
              style={{
                flex: 1,
                width: '100%',
              }}>
              {isLoading ? (
                <ActivityIndicator
                  color={colors.activeColor}
                  size="large"
                  style={{ flex: 1 }}
                />
              ) : (
                <View>
                  {!isdata ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={assets.no_favourites}
                        style={itemStyles.headerImage}
                      />

                      <Text style={itemStyles.title}>No Favorites</Text>
                      <Text style={itemStyles.subTitle}>
                        Your favorites list is currently empty. Start adding
                        stores/restaurants you love by tapping the heart icon!
                      </Text>
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
                          <View style={itemStyles.foodFirstItem}>
                            <View>
                              <StoreItems
                                id={item.id}
                                partnerName={item.partnerName}
                                latitude={item.latitude}
                                longitude={item.longitude}
                                openingHrs={item.openingHrs}
                                closingHrs={item.closingHrs}
                                districtName={item.districtName}
                                photo={item.photo}
                                navigation={navigation}
                              />
                            </View>
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
