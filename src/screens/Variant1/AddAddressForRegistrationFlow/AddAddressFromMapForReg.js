import { View, Text, SafeAreaView, StyleSheet, ToastAndroid } from 'react-native';
import React, { useRef, useState } from 'react';
import BaseView from '../../BaseView';
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

export const AddAddressFromMapForReg = props => {
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
  const [landmark, setLandmark] = useState(props.route.params.landmark);
  const [title, setTitle] = useState(props.route.params.title);
  const [postalCode, setPostalCode] = useState(props.route.params.postalCode);
  const [road, setRoad] = useState(props.route.params.road);
  const [district, setDistrict] = useState(props.route.params.district);
  const [state, setState] = useState(props.route.params.state);
  const [town, setTown] = useState(props.route.params.town);
  const [ward, setWard] = useState(props.route.params.ward);
  // const [address,setAddress] = useState(props.route.params.longitude);

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
                  getAddFromLatLong(region.latitude, region.longitude);
                }}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              //customMapStyle={mapStyle}
              >
                <Marker
                  draggable
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  onDragEnd={e =>
                    alert(JSON.stringify(e.nativeEvent.coordinate))
                  }
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
                      width={14}
                      height={14}
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
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate(
                          Routes.PLACES_AUTO_COMPLETE_FOR_REG,
                        );
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <SvgIcon
                          type={IconNames.Pencil}
                          width={12}
                          height={12}
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
                      props.navigation.navigate(
                        Routes.ADD_ADDRESS_DETAILS_FOR_REG,
                        {
                          latitude: latitude,
                          longitude: longitude,
                          addressDescription: subAddress,
                          addressTitle: addressTitle,
                          landmark: landmark,
                          title: title,
                          postalCode: postalCode,
                          district: district,
                          state: state,
                          road: road,
                          town: town,
                          ward: ward,
                        },
                      );
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
