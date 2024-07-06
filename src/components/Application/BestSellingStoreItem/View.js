import React, { useEffect } from 'react';
import { Image, Text, ToastAndroid, TouchableWithoutFeedback, View } from 'react-native';
import Routes from '../../../navigation/Routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Globals from '../../../utils/Globals';
import Styles from './Styles';
import { Rating } from 'react-native-elements';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { useTheme } from '@react-navigation/native';
import { ShopService } from '../../../apis/services';

export const BestSellingStoreItem = props => {
  const { colors } = useTheme();

  const {
    partnerName,
    id,
    latitude,
    longitude,
    openingHrs,
    closingHrs,
    districtName,
    photo,
    navigation
  } = props;
  return (
    <TouchableWithoutFeedback onPress={() => {
      //navigation.navigate(Routes.STORE)
      ToastAndroid.show("API require-------------", ToastAndroid.SHORT)
    }}>
      <View style={Styles.bestSellerCardView}>
        <View style={Styles.bestsellerImageContainer}>
          <Image
            resizeMode="cover"
            style={Styles.bestsellerImage}
            source={{
              uri: `${Globals.imgBaseURL}/${photo}`,
            }}
          />
        </View>
        <View
          style={[
            Styles.bestsellerPercentageContainer,
            { backgroundColor: colors.primaryGreenColor },
          ]}>
          {/* <FontAwesomeIcon
                  icon={faPercent}
                  style={Styles.bestsellerPercentage}
                  size={12}
                /> */}
          <Text style={{ color: 'white' }}>%</Text>
          <Text style={Styles.bestsellerText}>Promotion</Text>
        </View>
        <View style={{ paddingHorizontal: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={Styles.ratingText}>4.3</Text>
            {/* <Text style={{ marginLeft: 2, marginRight: 6 }}>4.3</Text> */}
            <Rating
              imageSize={14}
              readonly
              startingValue={1}
            //style={{ styles.rating }}
            />
          </View>
          <Text style={Styles.titleText} numberOfLines={1}>
            {partnerName}
          </Text>

          {/* location */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 6,
            }}>
            <SvgIcon
              type={IconNames.MapMarkedAlt}
              width={18}
              height={18}
              color="gray"
            />
            {/* <Text style={{ marginLeft: 6 }}>Ji Jababeka . 2km </Text> */}
            <Text style={Styles.subText}>Ji Jababeka . 2km </Text>
          </View>
          {/* time */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgIcon type={IconNames.Clock} width={18} height={18} color="gray" />
            {/* <Text style={{ marginLeft: 6 }}>{openingHrs} - {closingHrs} </Text> */}
            <Text style={Styles.subText}>
              {openingHrs} - {closingHrs}{' '}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>

  );
};
