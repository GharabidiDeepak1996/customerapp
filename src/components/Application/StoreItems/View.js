import { View, TouchableWithoutFeedback, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Styles } from './Styles';
import { Rating } from 'react-native-elements';
import Globals from '../../../utils/Globals';
import { Image } from 'react-native';
import colors from '../../../../branding/carter/styles/light/Colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Routes from '../../../navigation/Routes';
import { useState } from 'react';
import moment from 'moment';

export const StoreItems = props => {
  const [isStoreOpenh, setStoreOpenh] = useState(false);

  //Theme based styling and colors
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  const {
    id,
    partnerName,
    latitude,
    longitude,
    openingHrs,
    closingHrs,
    districtName,
    photo,
    autoOpen,
    navigation,
    categoryTypeId,

  } = props;

  useEffect(() => {
    const determineStoreOpenStatus = () => {
      try {
        var currentDate = moment(new Date()).format('hh:mm A');
        let openStore = '';

        //console.log('product-------12771', currentDate, openingHrs, currentDate >= openingHrs, currentDate < closingHrs);

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
    <View style={itemStyles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.STORE, {
            restaurantId: id,
            partnerName: partnerName,
            openingHrs: openingHrs,
            closingHrs: closingHrs,
            categoryTypeId: categoryTypeId,
            navigation: navigation,
            isStoreOpen: isStoreOpenh
            //avarageRating: avarageRating,
          });
        }}>
        <View style={[itemStyles.mainContainer]}>
          <View
            style={{
              flexDirection: 'row',
              flex: 3,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}>
            <View style={{ flex: 0.55, justifyContent: 'center' }}>
              <Image
                source={{ uri: `${Globals.imgBaseURL}/${photo}` }}
                style={itemStyles.foodItemImage}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={itemStyles.storeOpenBg}>
                  <Text style={[itemStyles.ratingText]}>
                    {isStoreOpenh ? 'Open' : 'Closed'}
                  </Text>
                </View>

                {/* <View style={itemStyles.discountBanner}>
                                    <Text style={itemStyles.discountText}>GET 10% OFF</Text>
                                </View> */}
              </View>
              <Text style={itemStyles.titleText} numberOfLines={2}>
                {partnerName}
              </Text>

              {/* <View
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
                                <Text style={itemStyles.ratingText}>4</Text>
                                <Text style={itemStyles.ratingText}> (72 reviews)</Text>
                            </View> */}

              {/* location */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: hp(0.2),
                }}>
                <SvgIcon
                  type={IconNames.MapMarkedAlt}
                  width={16}
                  height={16}
                  color="gray"
                />
                <Text style={itemStyles.subText}>{districtName}</Text>
              </View>
              {/* time */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgIcon
                  type={IconNames.Clock}
                  width={16}
                  height={16}
                  color="gray"
                />
                <Text style={itemStyles.subText}>
                  {openingHrs} - {closingHrs}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
