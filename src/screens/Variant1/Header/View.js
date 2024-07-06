import React, {useRef, useState, useEffect, PermissionsAndroid} from 'react';
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';
import {Image} from 'react-native-elements';
import {Styles} from './Styles';
import {useTheme, useFocusEffect} from '@react-navigation/native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import {SvgIcon} from '../../../components/Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Routes from '../../../navigation/Routes';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {
  setDefaultAddress,
  setDefaultAddressID,
  setDefaultAddressTitle,
  setLat,
  setLng,
  setDefaultAddressDistrict,
  setDefaultSubDistrictId,
  setDeliveryLat,
  setDeliveryLng,
} from '../../../redux/features/Address/DefaultAddressSlice';
import {useDispatch, useSelector} from 'react-redux';
import Globals from '../../../utils/Globals';
import axios from 'axios';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

Geocoder.init(Globals.googleApiKey);

//import AppConfig from '../../../branding/App_config';
import AppConfig from '../../../../branding/App_config';
const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
import {useTranslation} from 'react-i18next';

const fonts = AppConfig.fonts.default;
export const Variant1Header = React.memo(props => {
  // Use useSelector to access values from the Redux store
  const assets = AppConfig.assets.default;
  const cartCount = useSelector(state => state.product.cartCount);
  const [currentLocation, setCurrentLocation] = useState('');
  const [isSetMargin, setIsSetMargin] = useState('');
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  const defaultAddress = useSelector(
    state => state.addressReducer.defaultAddress,
  );
  const defaultAddressTitle = useSelector(
    state => state.addressReducer.defaultAddressTitle,
  );

  const reduxLat = useSelector(state => state.addressReducer.lat);
  const reduxLng = useSelector(state => state.addressReducer.lng);
  const addressID = useSelector(state => state.addressReducer.defaultAddressID);
  const {colors} = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      getAddressList();
    }, []),
  );

  const getAddressList = async () => {
    const getUserName = await AsyncStorage.getItem('displayName');
    setUserName(getUserName);
    const topMargin = AsyncStorage.getItem('topMargin');
    const getUserId = await AsyncStorage.getItem('userId');
    const isSetMargin = await AsyncStorage.getItem('topMargin');
    setIsSetMargin(isSetMargin);

    const userId = JSON.parse(getUserId);
    const apiUrl = `${Globals.baseUrl}/Address/${userId}`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          //isSuccess - true fetch data from API
          const defaultAddresses = response.data.payload.filter(
            address => address.defaultAddress,
          ); //"defaultAddress": true,

          if (defaultAddress === '') {
            if (defaultAddresses.length === 0) {
              getGeolocation(reduxLat, reduxLng);
            } else {
              dispatch(
                setDefaultAddress(
                  defaultAddresses[0]?.mapAddress +
                    ' ' +
                    defaultAddresses[0]?.landmark +
                    ' ' +
                    defaultAddresses[0]?.postalCode,
                ),
              );
              dispatch(setDefaultAddressTitle(defaultAddresses[0]?.title));
              dispatch(setLat(defaultAddresses[0]?.latitude));
              dispatch(setLng(defaultAddresses[0]?.longitude));
              dispatch(setDefaultAddressID(defaultAddresses[0]?.addressId));
              dispatch(
                setDefaultAddressDistrict(defaultAddresses[0]?.district),
              );
              dispatch(setDeliveryLng(defaultAddresses[0]?.longitude));
              dispatch(setDeliveryLat(defaultAddresses[0]?.latitude));
              dispatch(
                setDefaultSubDistrictId(defaultAddresses[0]?.subDistrictId),
              );
            }
          }
        } else {
          //isSuccess - false set current address
          getGeolocation(reduxLat, reduxLng);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const getGeolocation = (reduxLat, reduxLng) => {
    Geolocation.getCurrentPosition(
      position => {
        const crd = position.coords;
        if (reduxLat === 0.0 && reduxLng === 0.0) {
          getAddFromLatLong(crd.latitude, crd.longitude);
        } else {
          getAddFromLatLong(reduxLat, reduxLng);
        }
      },
      error => {
        console.log('error');
      },
    );
  };

  const getAddFromLatLong = async (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        var addressComponent = json.results[1];
        var length = addressComponent.address_components.length;

        // console.log('state',addressComponent.address_components[length - 3].long_name,);
        // console.log('country',addressComponent.address_components[length - 2].long_name,);
        // console.log('code',addressComponent.address_components[length - 1].long_name,);
        // console.log('lat', addressComponent.geometry.location.lat);
        // console.log('long', addressComponent.geometry.location.lng);
        // console.log('Address', addressComponent.formatted_address);
        // console.log( 'serviceUrll',addressComponent.address_components[length - 6].long_name, );

        setCurrentLocation(addressComponent.formatted_address);
        //dispatch(setDefaultAddress(addressComponent.formatted_address));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View
      style={{
        width: '100%',
        marginBottom: 5,
        //backgroundColor: 'red',
        marginTop: isSetMargin === 'false' ? hp(2) : hp(4),
        flexDirection: 'row',
      }}>
      <View style={{flex: 0.6}}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate(Routes.BOTTOM_ADDRESS_SHEET);
          }}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: Typography.P1,
                  flexWrap: 'wrap',
                }}>
                Hi
              </Text>
              <Text
                style={{
                  marginStart: hp(0.5),
                  fontWeight: 'bold',
                  color: '#414042',
                  fontSize: Typography.P1,
                  flexWrap: 'wrap',
                }}>
                {userName}!
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(0.5),
              }}>
              <SvgIcon
                type={IconNames.MapMarkerAlt}
                width={14}
                height={14}
                color={'red'}
              />
              <Text
                style={{
                  fontSize: Typography.P4,
                  color: 'black',

                  fontFamily: fonts.RUBIK_REGULAR,
                  width: '80%',
                }}
                numberOfLines={1}>
                {defaultAddress || currentLocation}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            //source={{uri: `${Globals.imgBaseURL}/${bannerImageUrl}`}}
            source={assets.logo_login}
            resizeMode={'contain'}
            style={{
              width: 130,
              height: 40,
            }}
          />
        </View>
      </View>

      {/* {(props.categoryTypeId == 1 ||
        props.categoryTypeId == 5 ||
        props.categoryTypeId == 2) && (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {props.isVisiable && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.CART, {
                    categoryTypeId: props.categoryTypeId,
                  });
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 999,
                    elevation: 8,
                  }}>
                  <SvgIcon
                    type={IconNames.BagShopping}
                    width={18}
                    height={18}
                    color={colors.activeColor}
                  />
                </View>
              </TouchableOpacity>

              {cartCount !== 0 && (
                <Text style={styles.cartCount}>{cartCount}</Text>
              )}
            </View>
          )}
        </View>
      )} */}
    </View>
  );
});

const styles = StyleSheet.create({
  cartCount: {
    backgroundColor: 'red',
    borderRadius: 50,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    right: -10,
    // top: -7,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
