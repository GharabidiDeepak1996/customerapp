import React, { useRef, useState, useEffect, PermissionsAndroid } from 'react';
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  StyleSheet,
  Alert,
  ToastAndroid,
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import Geocoder from 'react-native-geocoding';
import { setDefaultAddress } from '../../../redux/features/Address/DefaultAddressSlice';
import { useDispatch, useSelector } from 'react-redux';
import Globals from '../../../utils/Globals';
import axios from 'axios';
import Styles from './Style';
import AppConfig from '../../../../branding/App_config';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { Button } from 'react-native-elements';
import AppButton from '../../../components/Application/AppButton/View';
import Routes from '../../../navigation/Routes';

const fonts = AppConfig.fonts.default;

Geocoder.init(Globals.googleApiKey);

export const ServiceLocation = props => {
  //Theme based styling and colors
  // const scheme = useColorScheme();
  const { colors } = useTheme();
  // const globalStyles = scheme === "dark" ? commonDarkStyles(colors) : commonLightStyles(colors);
  // const screenStyles = Styles(globalStyles, colors);

  const [currentLocation, setCurrentLocation] = useState('');
  const dispatch = useDispatch();

  const latFromAutoCompletePlaces = props.route.params.latitude;
  const lngFromAutoCompletePlaces = props.route.params.longitude;

  const defaultAddress = useSelector(
    state => state.addressReducer.defaultAddress,
  );
  const defaultAddressTitle = useSelector(
    state => state.addressReducer.defaultAddressTitle,
  );
  console.log(
    'fromplaceslatlong',
    latFromAutoCompletePlaces,
    lngFromAutoCompletePlaces,
  );

  const [district, setDistrict] = useState(props.route.params.district);

  console.log(defaultAddress);

  useEffect(() => {
    console.log(
      'fromplaceslatlong',
      latFromAutoCompletePlaces,
      lngFromAutoCompletePlaces,
    );
    console.log('calling_getAddFromLatLong');
    if (latFromAutoCompletePlaces !== 0 && lngFromAutoCompletePlaces !== 0) {
      getAddFromLatLong(latFromAutoCompletePlaces, lngFromAutoCompletePlaces);
    }

    // Geolocation.getCurrentPosition(
    //   (position) => {

    //     const crd = position.coords;

    //     console.log(crd.latitude, crd.longitude);

    //    getAddFromLatLong(crd.latitude, crd.longitude)

    //   },
    //   (error) => { console.log("error") },
    // );
  }, [district, latFromAutoCompletePlaces, lngFromAutoCompletePlaces]);

  async function getAddFromLatLong(latitude, longitude) {
    Geocoder.from(latitude, longitude)
      .then(json => {
        var addressComponent = json.results[1];
        var length = addressComponent.address_components.length;
        console.log('addressComponent', addressComponent);
        console.log(
          'city',
          addressComponent.address_components[length - 6].long_name,
        );
        console.log(
          'state',
          addressComponent.address_components[length - 3].long_name,
        );
        console.log(
          'country',
          addressComponent.address_components[length - 2].long_name,
        );
        console.log(
          'code',
          addressComponent.address_components[length - 1].long_name,
        );
        console.log('lat', addressComponent.geometry.location.lat);
        console.log('long', addressComponent.geometry.location.lng);
        console.log('Address', addressComponent.formatted_address);
        console.log(
          'serviceUrll',
          addressComponent.address_components[length - 6].long_name,
        );

        setDistrict(addressComponent.address_components[length - 6].long_name);

        ServicedLocation(
          addressComponent.address_components[length - 6].long_name,
          addressComponent.formatted_address,
        );

        // if(ServicedLocation(addressComponent.address_components[length - 6].long_name)) {
        //   console.log("availablleeeeeeeeeeeeeeeeeeeee")
        // }else{
        //   console.log("uunnnnavailablleeeeeeeeeeeeeeeeeeeee")
        // }

        // setCurrentLocation(addressComponent.formatted_address);
        // dispatch(setDefaultAddress(addressComponent.formatted_address));
      })
      .catch(error => {
        console.warn(error);
      });
  }

  const ServicedLocation = async (district, address) => {
    const apiUrl = `${Globals.baseUrl}/ServicedLocation/${district}`;
    console.log('serviceUrll', apiUrl);
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          if (response.data.payload.serviced === false) {
            setCurrentLocation('');
            dispatch(setDefaultAddress(''));

            console.log('uuunnnavailablleeeeeeeeeeeeeeeeeeeee');
          } else {
            console.log('availablleeeeeeeeeeeeeeeeeeeee');
            setCurrentLocation(address);
            dispatch(setDefaultAddress(address));
            props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
          }
        } else {
          console.log('uuunnnavailablleeeeeeeeeeeeeeeeeeeee');

          setCurrentLocation('');
          dispatch(setDefaultAddress(''));
        }
      })
      .catch(error => {
        setCurrentLocation('');
        dispatch(setDefaultAddress(''));

        console.error('Error:', error);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
      }}>
      <View style={{ marginVertical: 30, alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 15,
            fontFamily: fonts.RUBIK_LIGHT,
            color: 'black',
            marginTop: 10,
            textAlign: 'center',
            marginVertical: 30,
          }}>
          Region - {district}
        </Text>
        <SvgIcon
          type={IconNames.MapMarkerAlt}
          width={40}
          height={40}
          color={colors.primaryGreenColor}
        />

        <View
          style={{
            backgroundColor: colors.primaryGreenColor,
            width: 40,
            height: 10,
            borderRadius: 25,
          }}
        />
      </View>

      <Text
        style={{ fontSize: 22, fontFamily: fonts.RUBIK_MEDIUM, color: 'black' }}>
        Location not servicable
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontFamily: fonts.RUBIK_LIGHT,
          color: 'black',
          marginTop: 10,
          textAlign: 'center',
          marginHorizontal: 30,
        }}>
        Our team is working tirelessly to bring all in one delivery service to
        your location
      </Text>

      <View style={{ marginTop: 20 }}>
        <AppButton
          title={'Try Changing Location'}
          onPress={() => {
            props.navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
              isNew: false,
              isFromServiceLocation: true,
              isFromSend: false,
            });
          }}
        />
      </View>
    </View>
  );
};

// const styles = {
//   titleText: {
//     fontFamily: fonts.RUBIK_MEDIUM,
//     fontSize: Typography.H8,
//     marginBottom: hp("0.5"),
//     color: colors.headingColor
// },
// }
