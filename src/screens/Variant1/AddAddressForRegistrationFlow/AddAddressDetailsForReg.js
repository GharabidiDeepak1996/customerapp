import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BaseView from '../../BaseView';
import IconNames from '../../../../branding/carter/assets/IconNames';
import {SvgIcon} from '../../../components/Application/SvgIcon/View';
import {useTheme} from '@react-navigation/native';
import {Button, CheckBox} from 'react-native-elements';
import AppConfig from '../../../../branding/App_config';
import {useColorScheme} from 'react-native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import AppButton from '../../../components/Application/AppButton/View';
import AppInput from '../../../components/Application/AppInput/View';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import {Styles} from './Style';

import {ToastAndroid} from 'react-native';
import {
  setDefaultAddress,
  setLat,
  setLatLng,
  setLng,
} from '../../../redux/features/Address/DefaultAddressSlice';
import {setDefaultAddressTitle} from '../../../redux/features/Address/DefaultAddressSlice';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

import Geocoder from 'react-native-geocoding';
import {TextInput} from '../../../components/Global/TextInput/View';
import {ScrollView} from 'react-native-gesture-handler';
import Routes from '../../../navigation/Routes';
import {useDispatch, useSelector} from 'react-redux';
import Globals from '../../../utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthService} from '../../../apis/services';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
const baseUrl = Globals.baseUrl;

const AddAddressDetailsForReg = props => {
  const saveAddressapiUrl = `${baseUrl}/Address`;
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const addressId = props.route.params.addressId;
  console.log('addressId', props.route.params);
  const editAddressApiUrl = `${baseUrl}/Address/${addressId}`;

  const scheme = useColorScheme();
  const {colors} = useTheme();
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

  const [buildingHouseNumber, setBuildingHouseNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [landmark, setLandmark] = useState(props.route.params.landmark || '');
  const [road, setRoad] = useState(props.route.params.road || '');
  const [state, setState] = useState(props.route.params.state || '');
  const [subDistrict, setSubDistrict] = useState(
    props.route.params.district || '',
  );
  const [district, setDistrict] = useState('');

  const {t, i18n} = useTranslation();

  const [postalCode, setPostalCode] = useState(
    props.route.params.postalCode || '',
  );
  const [addressAs, setAddressAs] = useState(props.route.params.title || '');
  const [town, setTown] = useState(props.route.params.district || '');
  const [ward, setWard] = useState(props.route.params.ward || '');
  const dispatch = useDispatch();
  const [locationID, setLocationID] = useState('');
  const [data, setData] = useState({});
  const [isAddressAs, setIsAddressAs] = useState(false);

  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [province, setProvince] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [filteredStoreList, setFilteredStoreList] = useState([]);

  // const [address,setAddress] = useState(props.route.params.longitude);
  let inputRef = useRef();
  const onSearch = search => {
    if (search !== '') {
      // setProvince(tempData);

      // const filteredList = province.filter(item =>
      //   item.locationName.toLowerCase().includes(search.toLowerCase()),
      // );

      const filteredList = province.filter(
        item =>
          item.districtName.toLowerCase().includes(search.toLowerCase()) ||
          item.subDistrictName.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredStoreList(filteredList);
    } else {
      setProvince(province);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthService.getLocationId(deliveryIn);
        if (response?.data?.isSuccess) {
          // const foundLocation = response.data.payload.find(
          //   item => item.locationName.toLowerCase() == subDistrict.toLowerCase());

          console.log('Api--subdist------'.response?.data?.payload);
          const foundLocation = response.data.payload.find(
            item =>
              item.districtName.toLowerCase() === subDistrict.toLowerCase() ||
              item.subDistrictName.toLowerCase() === subDistrict.toLowerCase(),
          );

          if (foundLocation) {
            // getRateFunc(foundLocation.locationId);
            setLocationID(foundLocation.locationId);
          } else {
            setLocationID('');
          }

          setProvince(response.data.payload);
          setFilteredStoreList(response.data.payload);
        } else {
          ToastAndroid.show(response?.data.message, ToastAndroid.LONG);
        }
      } catch (error) {
        console.log('Error in handleRegister:', error);
        ToastAndroid.show(
          'An error occurred while registering: ' + error.message,
          ToastAndroid.LONG,
        );
      }
    };

    fetchData();
  }, [deliveryIn]);

  // const saveAddress = async () => {
  //   // const getUserId = await AsyncStorage.getItem('userId');
  //   // const getaccount = await AsyncStorage.getItem('accountId');

  //   console.log('latlng', latitude, longitude);

  //   axios
  //     .post(saveAddressapiUrl, {
  //       accountId: getaccount._z,
  //       mapAddress: subAddress,
  //       address1: buildingHouseNumber + ', ' + buildingName,
  //       address2: subAddress,
  //       subDistrictName: town,
  //       subDistrictId: locationID,
  //       districtId: 0,
  //       districtName: subDistrict,
  //       provinceId: 0,
  //       provinceName: postalCode,
  //       postalCode: postalCode,
  //       landmark: landmark,
  //       title: addressAs,
  //       latitude: latitude,
  //       longitude: longitude,
  //       userId: getUserId._z,
  //     })
  //     .then(response => {
  //       try {
  //         console.log('payloaddd-->:', response.data.message);
  //         //setData(response.data.payload);
  //         ToastAndroid.show(response.data.message, ToastAndroid.LONG);
  //         //props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
  //         dispatch(setDefaultAddress(subAddress));
  //         dispatch(setDefaultAddressTitle(addressTitle));
  //         dispatch(setLat(latitude));
  //         dispatch(setLng(longitude));
  //         props.navigation.pop(3);
  //       } catch (e) {
  //         ToastAndroid.show(
  //           'Something went wrong, please try again..',
  //           ToastAndroid.LONG,
  //         );
  //         props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
  //       }
  //     })
  //     .catch(error => {
  //       // Handle errors here
  //       console.error('Error:', error);
  //     });
  // };

  // const editAddress = async () => {
  //   // const getUserId = await AsyncStorage.getItem('userId');
  //   // const getaccount = await AsyncStorage.getItem('accountId');

  //   console.log('latlng', latitude, longitude);
  //   console.log('addressIdonapicall', props.route.params.addressId);
  //   console.log('defaultAddress value edit----------', defaultAddress);

  //   axios
  //     .put(editAddressApiUrl, {
  //       DefaultAddress: defaultAddress,
  //       accountId: getaccount._z,
  //       mapAddress: subAddress,
  //       address1: buildingHouseNumber + ', ' + buildingName,
  //       address2: subAddress,
  //       subDistrictName: town,
  //       subDistrictId: locationID,
  //       districtId: 0,
  //       districtName: subDistrict,
  //       provinceId: 0,
  //       provinceName: postalCode,
  //       postalCode: postalCode,
  //       landmark: landmark,
  //       title: addressAs,
  //       latitude: latitude,
  //       longitude: longitude,
  //       userId: getUserId._z,
  //     })
  //     .then(response => {
  //       try {
  //         console.log('payloaddd-->:', response.data.message);
  //         //setData(response.data.payload);
  //         ToastAndroid.show(response.data.message, ToastAndroid.LONG);
  //         //props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
  //         dispatch(setDefaultAddress(subAddress));
  //         dispatch(setDefaultAddressTitle(addressTitle));
  //         dispatch(setLat(latitude));
  //         dispatch(setLng(longitude));
  //         props.navigation.pop(3);
  //       } catch (e) {
  //         ToastAndroid.show(
  //           'Something went wrong, please try again..',
  //           ToastAndroid.LONG,
  //         );
  //         props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
  //       }
  //     })
  //     .catch(error => {
  //       // Handle errors here
  //       console.error('Error:', error);
  //     });
  // };

  const [isAddress1, setIsAddress1] = useState(false);
  const [isAddress2, setIsAddress2] = useState(false);
  const [isLandMark, setIsLandMark] = useState(false);
  const [isRoad, setIsRoad] = useState(false);
  const [isProvince, setIsProvince] = useState(false);
  const [isDistrict, setIsDistrict] = useState(false);
  const [isSubDistrict, setIsSubDistrict] = useState(false);
  const [isPostalCode, setIsPostalCode] = useState(false);

  const handleValidationForAddress = async () => {
    if (buildingHouseNumber.length === 0) {
      setIsAddress1(true);
      return;
    } else if (buildingName.length === 0) {
      setIsAddress2(true);
      return;
    } else if (landmark.length === 0) {
      setIsLandMark(true);
      return;
    } else if (road.length === 0) {
      setIsRoad(true);
      return;
    } else if (province.length === 0) {
      setIsProvince(true);
      return;
    }
    // else if (town.length === 0) {
    //   setIsDistrict(true);
    //   return;
    // }
    else if (locationID.length === 0) {
      setIsSubDistrict(true);
      return;
    } else if (postalCode.length === 0) {
      setIsPostalCode(true);
      return;
    } else if (addressAs.length === 0) {
      setIsAddressAs(true);
      return;
    } else {
      props.navigation.navigate(Routes.SIGNUP_FORM_SCREEN1, {
        addressForRegistration:
          buildingHouseNumber +
          ', ' +
          buildingName +
          ', ' +
          landmark +
          ', ' +
          road +
          ', ' +
          subAddress,
        latitude: latitude,
        longitude: longitude,
        address1: buildingHouseNumber,
        address2: buildingName,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtName: district,
        provinceName: state,
        landmark: landmark,
        title: addressAs,
        postalCode: postalCode,
      });
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <BaseView
        navigation={props.navigation}
        title={t('Add Address Details')}
        //headerWithBack  --comment
        applyBottomSafeArea
        childContainerStyle={{flex: 1}}
        childView={() => {
          return (
            <View style={{flex: 1}}>
              <KeyboardAwareScrollView
                fadingEdgeLength={200}
                keyboardShouldPersistTaps={'never'}
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View style={{flex: 1, margin: 20}}>
                    <View style={{flexDirection: 'row'}}>
                      <SvgIcon
                        type={IconNames.MapMarkerAlt}
                        width={22}
                        height={22}
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

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 26},
                      ]}>
                      {t('Building/House Number')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter building/house number')}
                      value={buildingHouseNumber}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsAddress1(false);
                        setBuildingHouseNumber(value);
                      }}
                    />

                    {isAddress1 && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter building/house number')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Building Name')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter building name')}
                      value={buildingName}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsAddress2(false);
                        setBuildingName(value);
                      }}
                    />

                    {isAddress2 && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter building name')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Landmark')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter landmark')}
                      value={landmark}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsLandMark(false);
                        setLandmark(value);
                      }}
                    />

                    {isLandMark && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter landmark')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Road')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter road')}
                      value={road}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsRoad(false);
                        setRoad(value);
                      }}
                    />

                    {isRoad && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter road')}
                      </Text>
                    )}

                    {/* <Text
                    style={[
                      screenStyles.accountText,
                      {alignSelf: 'flex-start', marginTop: 8},
                    ]}>
                    {'Ward'}
                  </Text>
                  <AppInput
                    {...globalStyles.secondaryInputStyle}
                    textInputRef={r => (inputRef = r)}
                    showLeftIcon={false}
                    placeholder={'Enter ward'}
                    value={ward}
                    keyboardType={'default'}
                    onChangeText={value => {
                      setWard(value);
                    }}
                  /> */}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Province')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter province')}
                      value={state}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsProvince(false);
                        setState(value);
                      }}
                    />

                    {isProvince && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter province')}
                      </Text>
                    )}

                    {/* <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('District')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter district')}
                      value={town}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsDistrict(false);
                        setTown(value);
                      }}
                    />

                    {isDistrict && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter district')}
                      </Text>
                    )} */}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('District')}
                    </Text>
                    {/* <Text
                      style={[
                        screenStyles.inputLabel,
                        { alignSelf: 'flex-start', marginTop: 8 },
                      ]}>
                      {t('Sub District')}
                    </Text> */}
                    <View>
                      {/* Province */}
                      <View>
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            height: 44,
                            alignSelf: 'center',

                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: '#d4d4d4',
                            backgroundColor: 'white',
                            paddingHorizontal: 12,
                          }}
                          onPress={() => {
                            setClicked(!clicked);
                          }}>
                          <Text>
                            {selectedCountry == ''
                              ? 'Select district'
                              : selectedCountry}
                          </Text>
                          {clicked ? (
                            <Image
                              source={require('../../../../branding/carter/assets/images/upload.png')}
                              style={{width: 14, height: 14}}
                            />
                          ) : (
                            <Image
                              source={require('../../../../branding/carter/assets/images/dropdown.png')}
                              style={{width: 14, height: 14}}
                            />
                          )}
                        </TouchableOpacity>
                        {clicked ? (
                          <View
                            style={{
                              marginTop: 10,
                              //height: 300,
                              alignSelf: 'center',
                              width: '100%',
                              backgroundColor: '#fff',
                              borderWidth: 1,
                              borderColor: '#d4d4d4',
                            }}>
                            <TextInput
                              placeholder="Search..."
                              value={search}
                              textInputRef={r => (inputRef = r)}
                              onChangeText={txt => {
                                onSearch(txt);
                                setSearch(txt);
                              }}
                            />

                            <FlatList
                              data={filteredStoreList}
                              scrollEnabled={true}
                              renderItem={({item, index}) => {
                                return (
                                  <TouchableOpacity
                                    style={{
                                      width: '85%',
                                      alignSelf: 'center',
                                      height: 50,
                                      justifyContent: 'center',
                                      borderBottomWidth: 0.5,
                                      borderColor: '#8e8e8e',
                                    }}
                                    onPress={() => {
                                      //setSelectedCountry(item.country);
                                      if (item.locationId !== '') {
                                        // Additional logic if needed
                                        setIsSubDistrict(false);
                                        setSubDistrict(item.subDistrictName);
                                        setLocationID(item.locationId);
                                        setDistrict(item.districtName);
                                      }

                                      setSelectedCountry(
                                        item.districtName +
                                          ', ' +
                                          item.subDistrictName,
                                      );
                                      setClicked(!clicked);
                                      onSearch('');
                                      setSearch('');
                                    }}>
                                    <Text style={{fontWeight: '600'}}>
                                      {item.districtName +
                                        ', ' +
                                        item.subDistrictName}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                            />
                          </View>
                        ) : null}
                      </View>
                    </View>

                    {isSubDistrict && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please select district')}
                      </Text>
                    )}

                    {/* <AppInput
                    {...globalStyles.secondaryInputStyle}
                    textInputRef={r => (inputRef = r)}
                    showLeftIcon={false}
                    placeholder={'Enter subdistrict'}
                    value={subDistrict}
                    keyboardType={'default'}
                    onChangeText={value => {
                      setSubDistrict(value);
                    }}
                  /> */}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Postal Code')}
                    </Text>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('Enter postal code')}
                      value={postalCode}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsPostalCode(false);
                        setPostalCode(value);
                      }}
                    />

                    {isPostalCode && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter postal code')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.inputLabel,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Save Address As')}
                    </Text>

                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      showLeftIcon={false}
                      placeholder={t('e.g. Home / Work / Other')}
                      value={addressAs}
                      keyboardType={'default'}
                      onChangeText={value => {
                        setIsAddressAs(false);
                        setAddressAs(value);
                      }}
                    />

                    {isAddressAs && (
                      <Text
                        style={[
                          screenStyles.accountText,
                          {alignSelf: 'flex-start', color: 'red'},
                        ]}>
                        {t('Please enter save as')}
                      </Text>
                    )}
                  </View>
                </View>
              </KeyboardAwareScrollView>

              <View style={{marginTop: 10, marginHorizontal: 16}}>
                <AppButton
                  title={t('Set Address')}
                  onPress={() => {
                    handleValidationForAddress();
                  }}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AddAddressDetailsForReg;
