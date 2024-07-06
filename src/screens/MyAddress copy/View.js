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
import { useTranslation } from 'react-i18next';

export const MyAddressRide = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = Styles(scheme, colors);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { t, i18n } = useTranslation();

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
          ToastAndroid.show('Please add new Address', ToastAndroid.LONG);
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

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <BaseView
      navigation={props.navigation}
      title={t('My Address Book')}
      rightIcon={IconNames.PlusCircle}
      onRightIconPress={() => {
        props.navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
          isNew: false,
          isdefault: false,
          isFromRide: true,
          isFromSend: false,
          isPickupClicked: props.route.params.isPickupClicked,
          isDropOffClicked: props.route.params.isDropOffClicked,
        });
      }}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            {isLoading ? (
              <ActivityIndicator
                color="#2d2e7d"
                size="large"
                style={{ flex: 1 }}
              />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={screenStyles.scrollViewContainer}>
                {data.map((item, key) => {
                  console.log('item===>', item);
                  return (
                    <View>
                      {item.savedAddress && (
                        <TouchableOpacity
                          onPress={() => {
                            console.log(
                              'isPickupClicked---isDropOffClicked',
                              isPickupClicked,
                              isDropOffClicked,
                            );
                            if (isPickupClicked) {
                              props.navigation.navigate(
                                Routes.RIDE_DELIVERY_DETAILS,
                                {
                                  pickupAddress:
                                    item.address1 +
                                    ',' +
                                    item.address2 +
                                    ',' +
                                    item.mapAddress,
                                  pickupLat: item.latitude,
                                  pickupLng: item.longitude,
                                  idp: item?.addressId,
                                  subDistrictTitle: item?.subDistrict,
                                  subDistrictIdPickUp: item.subDistrictId,
                                },
                              );
                            } else if (isDropOffClicked) {
                              props.navigation.navigate(
                                Routes.RIDE_DELIVERY_DETAILS,
                                {
                                  dropOffAddress:
                                    item.address1 +
                                    ',' +
                                    item.address2 +
                                    ',' +
                                    item.mapAddress,
                                  dropOffLat: item.latitude,
                                  dropOffLng: item.longitude,
                                  idd: item?.addressId,
                                  subDistrictTitle: item?.subDistrict,
                                },
                              );
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

                            <View style={{ flex: 6.7, marginBottom: 10 }}>
                              {/* {item.defaultAddress ? (
                            <Text
                              style={{
                                fontSize: Typography.P5,
                                fontFamily: Fonts.RUBIK_REGULAR,
                                color: colors.activeColor,
                                backgroundColor: '#f1fce6',
                                width: '20%',
                                padding: 2,

                                borderRadius: 5,
                                marginTop: 10,
                                marginBottom: 5,
                              }}>
                              Default
                            </Text>
                          ) : (
                            <Text></Text>
                          )} */}

                              <Text
                                style={{
                                  fontSize: Typography.P3,
                                  fontFamily: Fonts.RUBIK_MEDIUM,
                                  color: 'black',
                                  marginVertical: 10,
                                }}>
                                {item.title}
                              </Text>
                              <Text style={screenStyles.headerSubtitleText}>
                                {item.address1 +
                                  ',' +
                                  item.address2 +
                                  ',' +
                                  item.mapAddress}
                              </Text>
                              <Text style={screenStyles.headerSubtitleText}>
                                Landmark : {item.landmark}
                              </Text>
                              <Text style={screenStyles.headerSubtitleText}>
                                Postal code : {item.postalCode}
                              </Text>
                              {/* <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 10,
                              marginBottom: 20,
                            }}>
                           
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  'Edit address',
                                  'Are you sure you want to edit this address?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () => {
                                        props.navigation.navigate(
                                          Routes.ADD_ADDRESS_FROM_MAP,
                                          {
                                            latitude: item.latitude,
                                            longitude: item.longitude,
                                            addressDescription: item.address2,
                                            addressTitle: item.address1,
                                            landmark: item.landmark,
                                            title: item.title,
                                            postalCode: item.postalCode,
                                            isNew: false,
                                            addressId: item.addressId,
                                            isdefault: item.defaultAddress,
                                            isFromSend: true,
                                          },
                                        );
                                      },
                                    },
                                  ],
                                );
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <SvgIcon
                                  type={IconNames.Pencil}
                                  width={10}
                                  height={10}
                                  color={colors.primaryGreenColor}
                                />
                                <Text
                                  style={{
                                    marginStart: 5,
                                    color: colors.primaryGreenColor,
                                  }}>
                                  Edit
                                </Text>
                              </View>
                            </TouchableOpacity>

                         
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  'Delete address',
                                  'Are you sure you want to delete this address?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () => {
                                        deleteAddress(item.addressId);
                                      },
                                    },
                                  ],
                                );
                              }}
                              activeOpacity={0.1}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginStart: 20,
                                }}>
                                <SvgIcon
                                  type={IconNames.TrashAlt}
                                  width={10}
                                  height={10}
                                  color={colors.primaryGreenColor}
                                />
                                <Text
                                  style={{
                                    marginStart: 5,
                                    color: colors.primaryGreenColor,
                                  }}>
                                  Delete
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View> */}
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        );
      }}
    />
  );
};
