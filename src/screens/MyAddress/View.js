import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  useColorScheme,
  View,
  ToastAndroid,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BaseView from '../BaseView';
import Routes from '../../navigation/Routes';
import Globals from '../../utils/Globals';
import {AddressItem} from '../../components/Application/AddressItem/View';
import AppButton from '../../components/Application/AppButton/View';
import {Styles} from './Styles';
import {useTheme} from '@react-navigation/native';
import IconNames from '../../../branding/carter/assets/IconNames';
import {AddressContentItem} from '../../components/Application/AddressContentItem/View';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {SvgIcon} from '../../components/Application/SvgIcon/View';
import AppConfig from '../../../branding/App_config';
const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
const baseUrl = Globals.baseUrl;
import {useFocusEffect} from '@react-navigation/native';
import {Image} from 'react-native';
import {t} from 'i18next';
import {LocalStorageSet} from '../../localStorage';
const assets = AppConfig.assets.default;

const MyAddress = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const screenStyles = Styles(scheme, colors);
  const [data, setListAddress] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const isFromCourier = props.route.params.isFromCourier;

  const isPickupClicked = props.route.params.isPickupClicked;
  const isAgainChangeAddress = props.route.params.isAgainChangeAddress;

  const isDropOffClicked = props.route.params.isDropOffClicked;

  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');

  console.log('isFromCourier--------------', isFromCourier);

  //Internal states
  const [activeSections, setActiveSections] = useState([]);

  let isNew = true;
  console.log('props.route.params.isNew', props.route.params.isNew);
  if (props.route.params.isNew === undefined) {
    isNew = true;
  } else {
    isNew = props.route.params.isNew;
  }

  console.log('isNewisNewisNew', isNew);

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
          setListAddress(response.data.payload);
          setFilteredData(response.data.payload);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  const deleteAddress = async addressId => {
    const deleteApiUrl = `${baseUrl}/Address/delete-address/${addressId}`;
    axios
      .post(deleteApiUrl)
      .then(response => {
        setLoading(false);
        if (response.data.isSuccess) {
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

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

  useFocusEffect(
    React.useCallback(() => {
      getAddress();
    }, []),
  );

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const newData = data.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.address1.toLowerCase().includes(query.toLowerCase()) ||
          item.address2.toLowerCase().includes(query.toLowerCase()) ||
          item.mapAddress.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={t('My Address Book')}
      //rightIcon={IconNames.PlusCircle}
      onRightIconPress={() => {
        props.navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
          isNew: isNew,
          isdefault: false,
          isFromSend: isFromCourier,
          isFromRide: false,
          isPickupClicked: props.route.params.isPickupClicked,
          isDropOffClicked: props.route.params.isDropOffClicked,
        });
      }}
      // headerWithBack
      onBackPress={() => {
        props.navigation.goBack();
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            {isLoading ? (
              <ActivityIndicator
                color={colors.activeColor}
                size="large"
                style={{flex: 1}}
              />
            ) : data?.length === 0 ? (
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
                  <Image
                    source={assets.no_address}
                    style={screenStyles.headerImage}
                  />

                  <Text style={screenStyles.title}>No Address</Text>
                  <Text style={screenStyles.subTitle}>
                    Oops, it looks like you haven't entered your address yet.
                    Please add your delivery address to proceed.
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                {data?.length > 3 && (
                  <TextInput
                    placeholder="Search Address"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    selectionColor={colors.activeColor}
                    style={screenStyles.searchContainer}
                  />
                )}
                {filteredData.length != 0 && (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    //style={screenStyles.scrollViewContainer}
                  >
                    {filteredData.map((item, key) => {
                      return (
                        <View>
                          {item.savedAddress && (
                            <TouchableOpacity
                              onPress={() => {
                                if (isFromCourier) {
                                  if (isPickupClicked) {
                                    props.navigation.navigate(Routes.COURIER, {
                                      pickupTitle: item.title,
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
                                      dropOffTitle: '',
                                      dropOffAddress: '',
                                      dropOffLat: 0.0,
                                      dropOffLng: 0.0,
                                      idd: 0,
                                      subDistrictTitle: '',
                                      subDistrictIdDropOff: 0,
                                      isAgainChangeAddress:
                                        isAgainChangeAddress,
                                    });
                                  } else if (isDropOffClicked) {
                                    props.navigation.navigate(Routes.COURIER, {
                                      dropOffTitle: item.title,
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
                                      subDistrictIdDropOff: item.subDistrictId,
                                    });
                                  }
                                }
                              }}>
                              <View style={screenStyles.boxContainer}>
                                <View>
                                  {item.defaultAddress && (
                                    <Text
                                      style={{
                                        fontSize: Typography.P5,
                                        fontFamily: Fonts.RUBIK_MEDIUM,
                                        color: colors.activeColor,
                                        backgroundColor: '#e5f2eb',
                                        width: '20%',
                                        borderRadius: 5,
                                        marginTop: 10,
                                        marginBottom: 5,
                                        padding: 3,
                                        textAlign: 'center',
                                      }}>
                                      Default
                                    </Text>
                                  )}

                                  <Text
                                    style={{
                                      fontSize: Typography.P3,
                                      fontFamily: Fonts.RUBIK_MEDIUM,
                                      color: 'black',
                                    }}>
                                    {item.title}
                                  </Text>
                                  <Text>
                                    {item.address1 +
                                      ', ' +
                                      item.address2 +
                                      ', ' +
                                      item.mapAddress}
                                  </Text>
                                  <Text>Landmark : {item.landmark}</Text>
                                  <Text>Postal code : {item.postalCode}</Text>

                                  {!item.defaultAddress && !isFromCourier && (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      {/* Edit */}

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
                                                  console.log(
                                                    'Yes Pressed----------------',
                                                    item,
                                                  ),
                                                    LocalStorageSet(
                                                      'editAddress',
                                                      item,
                                                    );
                                                  props.navigation.navigate(
                                                    Routes.ADD_ADDRESS_FROM_MAP,
                                                    {
                                                      latitude: item.latitude,
                                                      longitude: item.longitude,
                                                      addressDescription:
                                                        item.mapAddress,

                                                      addressTitle: item.title,
                                                      landmark: item.landmark,
                                                      title: item.title,
                                                      road: '',
                                                      state: item.province,
                                                      subDistrict:
                                                        item.subDistrict,
                                                      subDistrictId:
                                                        item.subDistrictId,
                                                      district: item.district,
                                                      postalCode:
                                                        item.postalCode,
                                                      isNew: false,
                                                      isEdit: true,
                                                      addressId: item.addressId,
                                                      isdefault:
                                                        item.defaultAddress,
                                                      address1: item.address1,
                                                      address2: item.address2,
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
                                            {t('Edit')}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>

                                      {/* Delete */}
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
                                            {t('Delete')}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                )}

                {filteredData.length == 0 && (
                  <View>
                    <Text>No data found.</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      }}
    />
  );
};

export default MyAddress;
