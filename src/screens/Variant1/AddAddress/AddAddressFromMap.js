import { View, Text, SafeAreaView, StyleSheet, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BaseView from '../../BaseView';
import { useFocusEffect } from '@react-navigation/native';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import { useTheme } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Styles } from './Style';
import AppConfig from '../../../../branding/App_config';
import { useColorScheme } from 'react-native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import AppButton from '../../../components/Application/AppButton/View';
import Routes from '../../../navigation/Routes';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

// Import Map and Marker
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { t } from 'i18next';
import Globals from '../../../utils/Globals';

Geocoder.init(Globals.googleApiKey);

export const AddAddressFromMap = props => {
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);
  const [latitude, setLatitude] = useState(props.route.params.latitude);
  const [longitude, setLongitude] = useState(props.route.params.longitude);
  const [subAddress, setAubAddress] = useState(
    props.route.params.addressDescription,
  );
  const [addressTitle, setAddressTitle] = useState(
    props.route.params.addressTitle,
  );
  const [address1, setAddress1] = useState(props.route.params.address1 || '');
  const [address2, setAddress2] = useState(props.route.params.address2 || '');
  const [landmark, setLandmark] = useState(props.route.params.landmark);
  const [title, setTitle] = useState(props.route.params.title);
  const [postalCode, setPostalCode] = useState(props.route.params.postalCode);
  const [road, setRoad] = useState(props.route.params.road);
  const [district, setDistrict] = useState(props.route.params.district);
  const [state, setState] = useState(props.route.params.state);
  const [town, setTown] = useState(props.route.params.town);
  const [ward, setWard] = useState(props.route.params.ward);
  // const [address,setAddress] = useState(props.route.params.longitude);

  const isNew = props.route.params.isNew;
  const isEdit = props.route.params.isEdit || false;
  console.log('IS__EDDIIITTTT-----------', isEdit);
  const addressId = props.route.params.addressId || 0;
  const isDefault = props.route.params.isdefault || false;

  const isPickupClicked = props.route.params.isPickupClicked || false;
  const isDropOffClicked = props.route.params.isDropOffClicked || false;

  const isFromPlaceOrder = props.route.params.isFromPlaceOrder || false;

  const isFromSend = props.route.params.isFromSend;
  const isFromRide = props.route.params.isFromRide;

  if (isNew === null || isDefault === null) {
    props.navigation.pop();
    console.log('isNew', isNew);
    console.log('isDefault', isDefault);
    ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
  } else {
    console.log('isNew', isNew);
    console.log('isDefault', isDefault);
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('Address Changed use effect*********************');
      setLatitude(props.route.params.latitude);
      setLongitude(props.route.params.longitude);
      setAubAddress(props.route.params.addressDescription);
      setAddressTitle(props.route.params.addressTitle);
      setLandmark(props.route.params.landmark);
      setTitle(props.route.params.title);
      setPostalCode(props.route.params.postalCode);
      setRoad(props.route.params.road);
      setDistrict(props.route.params.district);
      setState(props.route.params.state);
      setTown(props.route.params.town);
      setWard(props.route.params.ward);
      setAddress1(props.route.params.address1);
      setAddress2(props.route.params.address2);
    }, [props.route.params.addressDescription, props.route.params.title]),
  );

  const getAddFromLatLong = async (latitude, longitude) => {
    const json = await Geocoder.from(latitude, longitude);

    var addressComponent = json.results[1];

    console.log('pplllaaccesss_aappppiiii:::', addressComponent);
    console.log('lat', addressComponent.geometry.location.lat);
    console.log('long', addressComponent.geometry.location.lng);
    console.log('Address', addressComponent.formatted_address);
    console.log('global_code', addressComponent.plus_code.global_code);

    setAubAddress(addressComponent.formatted_address);
    setAddressTitle(addressComponent.plus_code.global_code);

    handlePlaceSelected(addressComponent.place_id);

    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?place_id=${addressComponent.place_id}&key=AIzaSyAXeZyTIWhKv2FaRwgJGHcdOuh9WqW0bVw`,
    // );

    //  console.log('pplllaaccesss_aappppiiii:::', response);
  };

  const handlePlaceSelected = async place_id => {
    try {
      console.log('place_id', place_id);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${Globals.googleApiKey}`,
      );

      // if (!response.ok) {
      //   throw new Error('Error fetching address details');
      // }

      console.log('places_api_response', response);
      const result = await response.json();

      if (
        result.status === 'OK' &&
        result.results &&
        result.results.length > 0
      ) {
        // Extract address components
        const { address_components } = result.results[0];
        let road = '';
        let district = '';
        let state = '';
        let postal_code = '';
        let town = '';
        let ward = '';

        // Extract road, district, and state from address components
        address_components.forEach(component => {
          if (component.types.includes('route')) {
            road = component.long_name;
          } else if (
            component.types.includes('administrative_area_level_3') ||
            component.types.includes('sublocality')
          ) {
            district = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (component.types.includes('postal_code')) {
            postal_code = component.long_name;
          } else if (
            component.types.includes('locality') ||
            component.types.includes('sublocality')
          ) {
            town = component.long_name;
          } else if (
            component.types.includes('sublocality_level_2') ||
            component.types.includes('sublocality_level_1')
          ) {
            ward = component.long_name;
          }
        });

        // Use the extracted information as needed
        console.log('Road:', road);
        console.log('District:', district);
        console.log('State:', state);
        console.log('postalcode:', postal_code);
        console.log('town:', town);
        console.log('ward:', ward);
        console.log('subAddress:', subAddress);
        console.log('addressTitle:', addressTitle);

        setRoad(road);
        setDistrict(district);
        setState(state);
        setPostalCode(postal_code);
        setTown(town);
        setWard(ward);
      } else {
        throw new Error('Invalid response from Geocoding API');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <BaseView
        navigation={props.navigation}
        title={t('Confirm Location')}
        headerWithBack
        applyBottomSafeArea
        childContainerStyle={{ flex: 1 }}
        childView={() => {
          return (
            <View style={{ flex: 1 }}>
              <MapView
                style={{ flex: 0.8 }}
                onRegionChange={region => {
                  setLatitude(region.latitude);
                  setLongitude(region.longitude);
                  //getAddFromLatLong(region.latitude, region.longitude);
                }}
                onRegionChangeComplete={region => {
                  setLatitude(region.latitude);
                  setLongitude(region.longitude);
                  getAddFromLatLong(region.latitude, region.longitude);
                }}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                }}
              //customMapStyle={mapStyle}
              >
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  onDrag={e => {
                    console.log('lllllllllllllllllllllllllllllllllll', e);
                    console.log('');
                  }}
                  title={'Marker'}
                  description={'use this location'}
                />
              </MapView>

              <View
                style={{
                  flex: 0.2,
                  marginHorizontal: 20,
                  marginTop: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SvgIcon
                      type={IconNames.MapMarkerAlt}
                      width={20}
                      height={20}
                      color={colors.primaryGreenColor}
                    />

                    <Text
                      style={{
                        fontFamily: fonts.RUBIK_MEDIUM,
                        fontSize: Typography.P2,
                        marginStart: 5,
                        color: colors.headingColor,
                      }}>
                      {addressTitle}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
                        isNew: isNew,
                        isEdit: isEdit,
                        isDefault: isDefault,
                        isDropOffClicked: isDropOffClicked,
                        isPickupClicked: isPickupClicked,
                        isFromSend: isFromSend,
                        isFromRide: isFromRide,
                      });
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginBottom: 10,
                      }}>
                      <SvgIcon
                        type={IconNames.Pencil}
                        width={15}
                        height={15}
                        color={colors.primaryGreenColor}
                      />

                      <Text
                        style={{
                          fontFamily: fonts.RUBIK_MEDIUM,
                          fontSize: Typography.P4,
                          marginStart: 5,
                          color: colors.primaryGreenColor,
                        }}>
                        {t('Change')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontFamily: fonts.RUBIK_REGULAR,
                    fontSize: Typography.P3,
                    marginStart: 5,
                    marginTop: 10,
                    color: colors.headingColor,
                  }}>
                  {subAddress}
                </Text>

                <View style={{ marginTop: 10 }}>
                  <AppButton
                    title={t('Use this location')}
                    onPress={() => {
                      console.log(
                        'propps-passed-----------',
                        props.route.params,
                      );
                      props.navigation.navigate(Routes.ADD_ADDRESS_DETAILS, {
                        latitude: latitude,
                        longitude: longitude,
                        addressDescription: subAddress,
                        addressTitle: addressTitle,
                        landmark: landmark,
                        title: title,
                        postalCode: postalCode,
                        isNew: isNew,
                        isEdit: isEdit,
                        addressId: addressId,
                        district: district,
                        state: state,
                        road: road,
                        town: town,
                        ward: ward,
                        address1: address1,
                        address2: address2,
                        isDefault: isDefault,
                        isFromSend: isFromSend,
                        isFromRide: isFromRide,
                        isFromPlaceOrder: isFromPlaceOrder,
                        isDropOffClicked: isDropOffClicked,
                        isPickupClicked: isPickupClicked,
                        subDistrict: props.route.params.subDistrict,
                        subDistrictId: props.route.params.subDistrictId,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    flex: 0.8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
