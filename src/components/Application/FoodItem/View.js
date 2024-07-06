import React, { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  StyleSheet,
} from 'react-native';
import { Text, Rating, AirbnbRating } from 'react-native-elements';
import Routes from '../../../navigation/Routes';
import { Styles } from './Styles';
import { useTheme } from '@react-navigation/native';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Globals from '../../../utils/Globals';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import { ToastAndroid } from 'react-native';
import { ProductService } from '../../../apis/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FoodItem = props => {
  //Theme based styling and colors
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);
  const [heartFillIcon, setHeartFilledIcon] = useState(IconNames.HeartFilled);
  const [heartFillIconColor, setHeartFilledIconColor] = useState(
    colors.heartFilled,
  );
  const [emptyHeartFillIcon, setEmptyHeartFilledIcon] = useState(
    IconNames.Heart,
  );
  const [emptyHeartFillIconColor, setEmptyHeartFilledIconColor] = useState(
    colors.heartEmpty,
  );

  const {
    storeImage,
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
    partnerStoreDescription,
    productName,
    productDescription,
    bestSeller,
    returnable,
    cancellable,
    partnerStoreId,
    userId,
    productId,
    partnerId,
    specification,
    sku,
    regularPrice,
    partnerName,
    productImageUrl,
    ownerName,
    productPackagingId,
    navigation,
    categoryTypeId,
    favourite,
    userFavorite,
    autoOpen
  } = props;

  const [isFav, setIsFav] = useState(userFavorite);
  const [isStoreOpenh, setStoreOpenh] = useState(false);
  // function isStoreOpen(openingHrs, closingHrs) {
  //   try {
  //     //var currentDate = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
  //     var currentDate = moment(new Date()).format('hh:mm A');
  //     //const formattedOpeningHours = moment(openingHours, 'hh:mm A').format('hh:mm A');

  //     console.log('Store is open.');
  //     let openStore = '';

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

  //  const addToFavourite1 = async () => {
  //    const getUserId = await AsyncStorage.getItem('userId');
  //    const userId = JSON.parse(getUserId);

  //    const apiUrl = `${baseUrl}/UserFavoritePartner/save`;
  //    console.log('=================', apiUrl);
  //    axios
  //      .get(apiUrl)
  //      .then(response => {
  //        console.log('=================', response.data);

  //        if (response.data.isSuccess) {
  //          console.log('payloaddd:', response.data.payload);
  //          setData(response.data.payload);
  //        } else {
  //          //pop
  //        }
  //      })
  //      .catch(error => {
  //        console.error('Error:', error);
  //      });
  //  };

  //   const removeFromFavourite1 = async () => {
  //     const getUserId = await AsyncStorage.getItem('userId');
  //     const userId = JSON.parse(getUserId);

  //     const apiUrl = `${baseUrl}/Address/${userId}`;
  //     console.log('=================', apiUrl);
  //     axios
  //       .get(apiUrl)
  //       .then(response => {
  //         console.log('=================', response.data);

  //         if (response.data.isSuccess) {
  //           console.log('payloaddd:', response.data.payload);
  //           setData(response.data.payload);
  //         } else {
  //           //pop
  //         }
  //       })
  //       .catch(error => {
  //         console.error('Error:', error);
  //       });
  //   };

  const addToFav = async () => {
    try {
      const UserId = await AsyncStorage.getItem('userId');

      let body = {
        UserId: UserId, //,30032,
        partnerId: partnerId,
      };

      const data = await ProductService.addToFavourite(body);
      //console.log('addToFav-------------------', data);
      if (data?.data?.payload === null) {
        console.log('nnnuuullllll', data.data);
      } else {
        setIsFav(true);
        console.log('not nnnuuullllll', data.data);
      }
    } catch (error) {
      console.log('Food Product----------------', error);
    }
  };

  const removeFromFav = async () => {
    try {
      const UserId = await AsyncStorage.getItem('userId');
      console.log('removeFromFav UserId', UserId);
      console.log('removeFromFav partnerId', partnerId);

      const data = await ProductService.removeFromFavourite(UserId, partnerId);

      //console.log('removeFromFav--------------', data);
      if (data?.data?.payload == null) {
        console.log('removeFromFav nnnuuullllll', data.data);
      } else {
        setIsFav(false);
        console.log('removeFromFav not nnnuuullllll', data.data);
      }
    } catch (error) {
      console.log('Food Product----------------', error);
    }
  };

  // function isStoreOpen(openingHrs, closingHrs) {
  //   try {
  //     var currentDate = moment(new Date()).format('hh:mm A');
  //     let openStore = '';

  //     console.log("9999999999999999999999999995555555555555555555", autoOpen)

  //     if (moment(currentDate, 'hh:mm A').isBetween(moment(openingHrs, 'hh:mm A'), moment(closingHrs, 'hh:mm A'), null, '[]')) {
  //       // setStoreOpenh(true);
  //       return (openStore = 'Open');
  //     } else {
  //       // setStoreOpenh(false);
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
          if (autoOpen) {
            setStoreOpenh(true);
            return (openStore = 'Open');
          } else {
            setStoreOpenh(false);
            return (openStore = 'Closed');
          }
        } else {
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
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(Routes.STORE, {
          avarageRating: averageRating,
          restaurantId: partnerId,
          partnerName: partnerName,
          openingHrs: openingHrs,
          closingHrs: closingHrs,
          categoryTypeId: categoryTypeId,
          navigation: navigation,
          isStoreOpen: isStoreOpenh
        });
      }}>
      <View style={itemStyles.container}>
        <View
          style={{
            flex: 0.58,
            alignItems: 'center',
          }}>
          <Image
            source={{ uri: `${Globals.imgBaseURL}/${storeImage}` }}
            style={[itemStyles.foodItemImage]}
          />

          <View
            style={{
              position: 'relative',
              backgroundColor: 'green',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 4,
              top: 0,
              alignSelf: 'center',
            }}>
            <Text style={{ color: 'white' }}>
              {isStoreOpenh ? "Open" : "Close"}
              {/* {isStoreOpen(openingHrs, closingHrs)} */}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <View style={itemStyles.discountBanner}>
              <Text style={itemStyles.discountText}>GET 10% OFF</Text>
            </View> */}

            <Text
              style={[itemStyles.titleText, { width: '50%' }]}
              numberOfLines={1}>
              {partnerName}
            </Text>

            <View style={itemStyles.favouriteContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (isFav) {
                    setIsFav(false);
                    removeFromFav();
                  } else {
                    setIsFav(true);
                    addToFav();
                  }
                }}>
                <View>
                  {/* <SvgIcon
                    type={IconNames.HeartFilled}
                    width={20}
                    height={20}
                    color={colors.heartFilled}
                  /> */}
                  {isFav ? (
                    <SvgIcon
                      type={heartFillIcon}
                      width={20}
                      height={20}
                      color={heartFillIconColor}
                    />
                  ) : (
                    <SvgIcon
                      type={emptyHeartFillIcon}
                      width={20}
                      height={20}
                      color={emptyHeartFillIconColor}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {averageRating == 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: hp(0.5),
              }}>
              <SvgIcon type={IconNames.StarGray} width={16} height={16} />
              <Text style={itemStyles.ratingText}>--</Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: hp(0.5),
              }}>
              <SvgIcon
                type={IconNames.Star}
                width={18}
                height={18}
                color="gray"
              />
              <Text style={itemStyles.ratingText}>{averageRating}</Text>
              <Text style={itemStyles.ratingText}>
                {' '}
                {ratingCount + ' reviews'}
              </Text>
            </View>
          )}

          {/* location */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp(0.2),
            }}>
            <SvgIcon
              type={IconNames.MapMarkedAlt}
              width={18}
              height={18}
              color="gray"
            />
            <Text style={itemStyles.subText}>Ji Jababeka . 2km </Text>
          </View>
          {/* time */}
          {openingHrs != null && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgIcon
                type={IconNames.Clock}
                width={18}
                height={18}
                color="gray"
              />
              <Text style={itemStyles.subText}>
                {openingHrs} - {closingHrs}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
