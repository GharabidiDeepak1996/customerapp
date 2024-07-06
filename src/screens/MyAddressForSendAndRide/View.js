import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  useColorScheme,
  View,
  ToastAndroid,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import BaseView from '../BaseView';
import Routes from '../../navigation/Routes';
import Globals from '../../utils/Globals';
import { AddressItem } from '../../components/Application/AddressItem/View';
import AppButton from '../../components/Application/AppButton/View';
import { Styles } from './Styles';
import { useTheme } from '@react-navigation/native';
import IconNames from '../../../branding/carter/assets/IconNames';
import { AddressContentItem } from '../../components/Application/AddressContentItem/View';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import AppConfig from '../../../branding/App_config';
const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
const baseUrl = Globals.baseUrl;
import { useFocusEffect } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export const MyAddressForSendAndRide = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = Styles(scheme, colors);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [hideMyAddress, setHideMyAddress] = useState(false);

  const isFromCourier = props.route.params.isFromCourier;

  const isPickupClicked = props.route.params.isPickupClicked;

  const isDropOffClicked = props.route.params.isDropOffClicked;

  console.log('isFromCourier--------------', isFromCourier);

  //Internal states
  const [activeSections, setActiveSections] = useState([]);

  const renderAddressesHeader = (section, index, isActive) => {
    if (index === 0) {
      return (
        <View style={screenStyles.addressFirstItem}>
          <AddressItem
            isTouchable={false}
            isActive={isActive}
            showAnimatedIcon
            item={section}
          />
        </View>
      );
    } else if (index === data.length - 1) {
      return (
        <View style={screenStyles.addressLastItem}>
          <AddressItem
            isTouchable={false}
            isActive={isActive}
            showAnimatedIcon
            item={section}
          />
        </View>
      );
    } else {
      return (
        <AddressItem
          isTouchable={false}
          isActive={isActive}
          showAnimatedIcon
          item={section}
        />
      );
    }
  };

  const renderAddressesContent = section => {
    return <AddressContentItem data={section} />;
  };

  const _updateSections = allActiveSections => {
    setActiveSections(allActiveSections);
  };

  const getAddress = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    const apiUrl = `${baseUrl}/Address/${getUserId}`;
    axios
      .get(apiUrl)
      .then(response => {
        setLoading(false);
        if (response.data.isSuccess) {
          console.log('payloaddd:', response.data.payload);
          setData(response.data.payload);
        } else {
          console.log('oooooooooooooooooooooo');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  const deleteAddress = async addressId => {
    const deleteApiUrl = `${baseUrl}/Address/${addressId}`;
    axios
      .post(deleteApiUrl)
      .then(response => {
        setLoading(false);
        if (response.data.isSuccess) {
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          console.log('payloaddd:', response.data.message);
          getAddress();
        } else {
          ToastAndroid.show('Please add new Address', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  const handlePlaceSelected = async (
    place_id,
    details,
    lat,
    lng,
    subAddress,
    addressTitle,
  ) => {
    try {
      console.log('place_id', place_id);
      // if (!(place_id === '')) {
      //   throw new Error('Invalid place details');
      // }

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

        setRoad(road);
        setDistrict(district);
        setState(state);
        setPostal_code(postal_code);
        setTown(town);
        setWard(ward);

        props.navigation.navigate(Routes.ADD_ADDRESS_FROM_MAP, {
          latitude: lat,
          longitude: lng,
          addressDescription: subAddress,
          addressTitle: addressTitle,
          isNew: isNew,
          addressId: addressId,
          road: road,
          postalCode: postal_code,
          district: district,
          state: state,
          town: town,
          ward: ward,
          isDefault: isDefault,
        });
      } else {
        throw new Error('Invalid response from Geocoding API');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAddress();
    }, []),
  );
  return (
    <BaseView
      navigation={props.navigation}
      title={t('Set location')}
      // rightIcon={IconNames.PlusCircle}
      // onRightIconPress={() => {
      //   props.navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
      //     isNew: true,
      //     isdefault: false,
      //   });
      // }}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            <View
              style={{
                marginTop: 10,
                padding: 5,
                height: 50,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  width: '100%',
                  height: hideMyAddress ? 550 : 60,
                }}
                onPress={() => {
                  setHideMyAddress(true);
                }}>
                <GooglePlacesAutocomplete
                  placeholder={t('Search Location')}
                  styles={{
                    description: {
                      color: 'black',
                    },
                  }}
                  numberOfLines={2}
                  GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                  fetchDetails={true} // you need this to fetch the details object onPress
                  onPress={(data, details = null) => {
                    console.log('address_details', data, '---------------');
                    handlePlaceSelected(
                      data.place_id,
                      details,
                      details.geometry.location.lat,
                      details.geometry.location.lng,
                      data.description,
                      data.structured_formatting.main_text,
                    );
                  }}
                  query={{
                    key: Globals.googleApiKey,
                    language: 'en',
                  }}
                  currentLocation={true}
                  currentLocationLabel="Current location"
                  onFail={error => console.error(error)}
                />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator
                color={colors.activeColor}
                size="large"
                style={{ flex: 1 }}
              />
            ) : data.length == 0 ? (
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
                  <Text>No Address</Text>
                  <Text style={{ textAlign: 'center' }}>
                    Oops, it looks like you haven't entered your address yet.
                    Please add your delivery address to proceed.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {console.log('hideMyAddress=================', hideMyAddress)}
                {!hideMyAddress ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={screenStyles.scrollViewContainer}>
                    {data.map((item, key) => {
                      console.log('item===>', item);
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (isFromCourier) {
                              console.log(item.address2);
                              if (isPickupClicked) {
                                props.navigation.navigate(
                                  Routes.COURIER_DELIVERY_DETAILS,
                                  {
                                    pickupAddress:
                                      item.address1 + ', ' + item.address2,
                                    pickupLat: item.latitude,
                                    pickupLng: item.longitude,
                                    idp: item?.addressId,
                                    subDistrictTitle: item?.subDistrict,
                                  },
                                );
                              } else if (isDropOffClicked) {
                                props.navigation.navigate(
                                  Routes.COURIER_DELIVERY_DETAILS,
                                  {
                                    dropOffAddress:
                                      item.address1 + ', ' + item.address2,
                                    dropOffLat: item.latitude,
                                    dropOffLng: item.longitude,
                                    idd: item?.addressId,
                                    subDistrictTitle: item?.subDistrict,
                                  },
                                );
                              }
                            }
                          }}>
                          <View
                            style={{
                              marginTop: 13,
                              flexDirection: 'row',
                              flex: 7,
                              borderWidth: 0.5,
                              borderRadius: 10,
                              borderColor: colors.primaryGreenColor,
                              backgroundColor: 'white',
                            }}>
                            <View
                              style={{
                                flex: 0.3,

                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <View
                                style={{
                                  //padding: 15,
                                  backgroundColor: '#ffffff',
                                  // marginHorizontal: 10,
                                  // marginVertical: 10,
                                  // borderRadius: 999,
                                }}>
                                {/* <SvgIcon
                            type={IconNames.MapMarkerAlt}
                            width={25}
                            height={25}
                            color={colors.primaryGreenColor}
                          /> */}
                              </View>
                            </View>

                            <View style={{ flex: 6.7, paddingVertical: 10 }}>
                              <Text
                                style={{
                                  fontSize: Typography.P3,
                                  fontFamily: Fonts.RUBIK_MEDIUM,
                                  color: 'black',
                                }}>
                                {item.title}
                              </Text>
                              <Text style={screenStyles.headerSubtitleText}>
                                {item.address2}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View></View>
                )}
              </View>
            )}
          </View>
        );
      }}
    />
  );
};
