import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import Routes from '../../../navigation/Routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Globals from '../../../utils/Globals';
import Styles from './Styles';
import { Rating } from 'react-native-elements';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { useTheme } from '@react-navigation/native';
import { Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductService } from '../../../apis/services';
import moment from 'moment';

export const NearByStore = props => {
  const { colors } = useTheme();

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
  const [isStoreOpenh, setStoreOpenh] = useState(false);

  const {
    partnerName,
    id,
    latitude,
    longitude,
    openingHrs,
    closingHrs,
    districtName,
    photo,
    navigation,
    categoryTypeId,
    ratingCount,
    avarageRating,
    userFavorite,
    autoOpen
  } = props;

  const [isFav, setIsFav] = useState(userFavorite);

  const addToFav = async () => {
    try {
      const UserId = await AsyncStorage.getItem('userId');

      let body = {
        UserId: UserId, //,30032,
        partnerId: id,
      };

      const data = await ProductService.addToFavourite(body);
      //console.log('addToFav-------------------', data);
      if (data.data.payload === null) {
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
      //console.log('removeFromFav UserId', UserId);
      //console.log('removeFromFav partnerId', restaurantId);

      const data = await ProductService.removeFromFavourite(UserId, id);

      //console.log('removeFromFav--------------', data);
      if (data.data.payload == null) {
        console.log('removeFromFav nnnuuullllll', data.data);
      } else {
        setIsFav(false);
        console.log('removeFromFav not nnnuuullllll', data.data);
      }
    } catch (error) {
      console.log('Food Product----------------', error);
    }
  };

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
    <View>
      {categoryTypeId == 2 && (
        <View
          style={[
            Styles.favouriteContainer,
            {
              position: 'absolute',
              right: 16,
              zIndex: 999,
              alignSelf: 'flex-end',
            },
          ]}>
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
                  color={'#ffffff'}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ zIndex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(Routes.STORE, {
              restaurantId: id,
              partnerName: partnerName,
              openingHrs: openingHrs,
              closingHrs: closingHrs,
              categoryTypeId: categoryTypeId,
              navigation: navigation,
              avarageRating: avarageRating,
              userFavorite: userFavorite,
              isStoreOpen: isStoreOpenh
            });
          }}>
          <View style={[Styles.bestSellerCardView, { zIndex: 1 }]}>
            <View style={[Styles.bestsellerImageContainer, { zIndex: 1 }]}>
              <ImageBackground
                resizeMode="cover"
                imageStyle={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                style={[Styles.bestsellerImage, { zIndex: 1 }]}
                source={{
                  uri: `${Globals.imgBaseURL}/${photo}`,
                }}></ImageBackground>
            </View>
            {/* <View
          style={[
            Styles.bestsellerPercentageContainer,
            { backgroundColor: colors.primaryGreenColor },
          ]}>
          
          <Text style={Styles.bestsellerText}>% Promotion</Text>
        </View> */}

            <View style={{ padding: 10 }}>
              {/* avarageRating == 0 ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <SvgIcon
              type={IconNames.StarGray}
              width={16}
              height={16}

            />
            <Text style={Styles.ratingText}>--</Text>
          </View> :  */}
              {/* {avarageRating !== 0 &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Rating
                imageSize={14}
                readonly={true}
                startingValue={5}
                ratingCount={1}
              //style={{ styles.rating }}
              />
              <Text style={Styles.ratingText}>{avarageRating}</Text>
              <Text style={Styles.ratingText}>({ratingCount + " " + "reviews"})</Text>
            </View>} */}
              <Text style={Styles.titleText} numberOfLines={1}>
                {partnerName}
              </Text>

              {/* location */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <SvgIcon
                  type={IconNames.MapMarkedAlt}
                  width={12}
                  height={12}
                  color="gray"
                />
                {/* <Text style={{ marginLeft: 6 }}>Ji Jababeka . 2km </Text> */}
                <Text style={Styles.subText}>{districtName}</Text>
              </View>
              {/* time */}

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgIcon
                  type={IconNames.Clock}
                  width={12}
                  height={12}
                  color="gray"
                />
                {/* <Text style={{ marginLeft: 6 }}>{openingHrs} - {closingHrs} </Text> */}
                <Text style={Styles.subText}>
                  {openingHrs} - {closingHrs}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
