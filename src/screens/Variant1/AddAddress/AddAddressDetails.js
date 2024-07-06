import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BaseView from '../../BaseView';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import { useTheme } from '@react-navigation/native';
import { Button, CheckBox } from 'react-native-elements';
import { Styles } from './Style';
import AppConfig from '../../../../branding/App_config';
import { useColorScheme } from 'react-native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import AppButton from '../../../components/Application/AppButton/View';
import AppInput from '../../../components/Application/AppInput/View';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { ToastAndroid } from 'react-native';
import {
  setDefaultAddress,
  setLat,
  setLatLng,
  setLng,
  setDeliveryAddress,
  setDeliveryAddressId,
  setDeliveryLng,
  setDeliveryLat,
} from '../../../redux/features/Address/DefaultAddressSlice';
import { setDefaultAddressTitle } from '../../../redux/features/Address/DefaultAddressSlice';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
import DropDownItem from '../../../components/Application/DropDownItem/View';

import Geocoder from 'react-native-geocoding';
import { TextInput } from '../../../components/Global/TextInput/View';
import { ScrollView } from 'react-native-gesture-handler';
import Routes from '../../../navigation/Routes';
import { useDispatch, useSelector } from 'react-redux';
import Globals from '../../../utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../../../apis/services';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import {
  LocalStorageClear,
  LocalStorageGet,
  LocalStorageSet,
} from '../../../localStorage';
import { Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
const baseUrl = Globals.baseUrl;

export const AddAddressDetails = props => {
  const saveAddressapiUrl = `${baseUrl}/Address`;
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const addressId = props.route.params.addressId;
  // console.log('addressId', props.route.params.addressId);
  const editAddressApiUrl = `${baseUrl}/Address/${addressId}`;

  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);
  const [latitude, setLatitude] = useState(props.route.params.latitude);
  const [longitude, setLongitude] = useState(props.route.params.longitude);
  const [editAddressLocal, setEditAddressLocal] = useState();
  const [subAddress, setAubAddress] = useState(
    props.route.params.addressDescription,
  );

  const getUserId = AsyncStorage.getItem('userId');
  const getaccount = AsyncStorage.getItem('accountId');
  const [addressTitle, setAddressTitle] = useState(
    props.route.params.addressTitle,
  );
  // console.log('getaccount', getaccount);
  const [defaultAddress, setAsDefaultAddress] = useState(
    props.route.params.isDefault,
  );

  const [saveToAddressList, setSaveToAddressList] = useState(false);

  const [isNew, setIsNew] = useState(props.route.params.isNew);

  const [isEdit, setIsEdit] = useState(props.route.params.isEdit);

  const [isLoading, setLoading] = useState(false);

  const [buildingHouseNumber, setBuildingHouseNumber] = useState(
    props.route.params.address1 || '',
  );
  const [buildingName, setBuildingName] = useState(
    props.route.params.address2 || '',
  );
  const [landmark, setLandmark] = useState(props.route.params.landmark || '');
  const [road, setRoad] = useState(props.route.params.road || '');
  const [state, setState] = useState(props.route.params.state || '');
  const [subDistrict, setSubDistrict] = useState(
    props.route.params.subDistrict || '',
  );
  const [district, setDistrict] = useState('');

  const { t, i18n } = useTranslation();

  const [postalCode, setPostalCode] = useState(
    props.route.params.postalCode || '',
  );
  const [addressAs, setAddressAs] = useState(props.route.params.title || '');
  const [town, setTown] = useState(props.route.params.district || '');
  const [ward, setWard] = useState(props.route.params.ward || '');
  const dispatch = useDispatch();
  const [locationID, setLocationID] = useState('');
  const [data, setData] = useState({});

  const [isAddress1, setIsAddress1] = useState(false);
  const [isAddress2, setIsAddress2] = useState(false);
  const [isLandMark, setIsLandMark] = useState(false);
  const [isRoad, setIsRoad] = useState(false);
  const [isProvince, setIsProvince] = useState(false);
  const [isDistrict, setIsDistrict] = useState('');
  const [isSubDistrict, setIsSubDistrict] = useState(false);
  const [isPostalCode, setIsPostalCode] = useState(false);
  const [isAddressAs, setIsAddressAs] = useState(false);

  const [isFromSend, setIsFromSend] = useState(props.route.params.isFromSend);

  const [isFromRide, setIsFromRide] = useState(props.route.params.isFromRide);

  const isFromPlaceOrder = props.route.params.isFromPlaceOrder || false;

  // console.log('isFromPlaceOrder::::::::::::::::::::::::', isFromPlaceOrder);

  const [isDropOffClicked, setisDropOffClicked] = useState(
    props.route.params.isDropOffClicked || false,
  );
  const [isPickupClicked, setisPickupClicked] = useState(
    props.route.params.isPickupClicked || false,
  );

  // const [address,setAddress] = useState(props.route.params.longitude);
  let inputRef = useRef();
  const scrollViewRef = useRef(null);
  const inputScrollRef = useRef(null);

  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [province, setProvince] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    props.route.params.subDistrict || '',
  );
  const [filteredStoreList, setFilteredStoreList] = useState([]);
  ``;
  const searchRef = useRef();
  const onSearch = search => {
    if (search !== '') {
      // let tempData = province.filter(item => {
      //   return item.locationName.toLowerCase().indexOf(search.toLowerCase()) > -1;
      // });
      // setProvince(tempData);

      // const filteredList = province.filter(item =>
      //   (item.subDistrictName.toLowerCase() || item.districtName.toLowerCase()).includes(search.toLowerCase()),
      // );

      const filteredList = province.filter(
        item =>
          item.subDistrictName.toLowerCase().includes(search.toLowerCase()) ||
          item.districtName.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredStoreList(filteredList);
    } else {
      setProvince(province);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEdit) {
          const editAddress = await LocalStorageGet('editAddress');
          console.log('editAddress=====>', editAddress);
          if (editAddress) {
            setEditAddressLocal(editAddress);
            const mapAddressArray = editAddress?.mapAddress
              .split(',')
              .map(item => item.trim());
            // console.log('mapAddressArray======>', mapAddressArray);
            setBuildingHouseNumber(props?.route?.params?.address1);
            setBuildingName(props?.route?.params?.address2);
            setState(editAddress?.province);
            setTown(editAddress?.district);
            setAddressAs(editAddress?.title);
            setData(prevData => ({
              ...prevData,
              locationId: editAddress?.subDistrictId,
              locationName: editAddress?.subDistrict,
            }));
            setSubDistrict(editAddress?.subDistrict);
            setLocationID(editAddress?.subDistrictId);
          }
        }

        const response = await AuthService.getLocationId(deliveryIn);

        console.log('editAddress=====>', response);
        if (response?.data?.isSuccess) {
          // const foundLocation = response.data.payload.find(
          //   item =>(item.districtName.toLowerCase() || item.subDistrictName.toLowerCase()) == subDistrict.toLowerCase());

          const foundLocation = response.data.payload.find(
            item =>
              item.districtName.toLowerCase() === subDistrict.toLowerCase() ||
              item.subDistrictName.toLowerCase() === subDistrict.toLowerCase(),
          );

          if (foundLocation) {
            // getRateFunc(foundLocation.locationId);
            setLocationID(foundLocation.locationId);
          } else {
            if (editAddress) {
            } else {
              setLocationID('');
            }
          }

          //console.log("GetProvince--------223232233", response.data.payload)[{"locationId": 241, "locationName": "Agats"},
          let newArray = response.data.payload.map(item => {
            return { key: item.locationId, value: item.locationName };
          });

          //  setProvince(newArray);
          setProvince(response.data.payload);
          setFilteredStoreList(response.data.payload);
        } else {
          ToastAndroid.show(response?.data.message, ToastAndroid.LONG);
        }
      } catch (error) {
        // console.log('Error in handleRegister:', error);
        ToastAndroid.show(
          'An error occurred while registering: ' + error.message,
          ToastAndroid.LONG,
        );
      }
    };

    fetchData();
  }, [deliveryIn]);

  const saveToAddressListForSend = async () => {
    // const getUserId = await AsyncStorage.getItem('userId');
    // const getaccount = await AsyncStorage.getItem('accountId');
    setLoading(true);
    // console.log('latlng', latitude, longitude);
    // console.log('defaultAddress value----------', defaultAddress);
    // console.log('isFromSend value----------', isFromSend);
    // console.log('isFromRide value----------', isFromRide);

    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber,
        address2: buildingName,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: true,
      })
      .then(response => {
        try {
          setLoading(false);
          // console.log('payloaddd-->:', response.data.message);

          ToastAndroid.show(
            'New address added to my address book',
            ToastAndroid.LONG,
          );

          // if (isPickupClicked) {
          //   getPickupAddressId();
          // } else if (isDropOffClicked) {
          //   getDropOffAddressId();
          // }

          if (isFromRide) {
            if (isPickupClicked) {
              getPickupAddressIdForRide();
            } else if (isDropOffClicked) {
              getDropOffAddressIdForRide();
            }
          } else if (isFromSend) {
            if (isPickupClicked) {
              getPickupAddressIdIfSaveToList();
            } else if (isDropOffClicked) {
              getDropOffAddressIdIfSaveToList();
            }
          }

          // if (isPickupClicked) {
          //   getPickupAddressIdIfSaveToList();
          // } else if (isDropOffClicked) {
          //   getDropOffAddressIdIfSaveToList();
          // }
        } catch (e) {
          setLoading(false);
          ToastAndroid.show(
            'Something went wrong, please try again..',
            ToastAndroid.LONG,
          );
          props.navigation.pop(3);
        }
      })
      .catch(error => {
        setLoading(false);
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const saveAddress = async () => {
    // const getUserId = await AsyncStorage.getItem('userId');
    // const getaccount = await AsyncStorage.getItem('accountId');
    setLoading(true);
    // console.log('latlng', latitude, longitude);
    // console.log('defaultAddress value----------', defaultAddress);
    // console.log('isFromSend value----------', isFromSend);
    // console.log('isFromRide value----------', isFromRide);

    console.log('isnewwww subdistrict name value----------', subDistrict);
    console.log('isnewwww district name value----------', town);

    let body = {
      accountId: getaccount._z,
      //mapAddress: buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
      mapAddress: subAddress,
      address1: buildingHouseNumber,
      address2: buildingName,
      subDistrictName: subDistrict,
      subDistrictId: locationID,
      districtId: 0,
      districtName: district,
      provinceId: 0,
      provinceName: state,
      postalCode: postalCode,
      landmark: landmark,
      title: addressAs,
      latitude: latitude,
      longitude: longitude,
      userId: getUserId._z,
      DefaultAddress: defaultAddress,
      savedAddress: true,
    };

    console.log('bodyyyyyyyyyyyyy===>>>', body);

    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber,
        address2: buildingName,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: district,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: true,
      })
      .then(response => {
        try {
          setLoading(false);
          console.log('payloaddd-->:', response);
          //setData(response.data.payload);
          //ToastAndroid.show(response.data.message, ToastAndroid.LONG);
          Alert.alert('Success', 'Address added successfully', [
            {
              text: 'ok',
              onPress: () => {
                LocalStorageClear('editAddress');
                props.navigation.pop(3);
              },
              style: 'cancel',
            },
          ]);
          //props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
          //dispatch(setDefaultAddress(subAddress));
          //dispatch(setDefaultAddressTitle(addressAs));
          //dispatch(setLat(latitude));
          //dispatch(setLng(longitude));
        } catch (e) {
          setLoading(false);
          ToastAndroid.show(
            'Something went wrong, please try again..',
            ToastAndroid.LONG,
          );
          props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
        }
      })
      .catch(error => {
        setLoading(false);
        // Handle errors here
        console.error('Error:', error);
      });
  };

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
      //scrollToBottom()
      setIsProvince(true);
      return;
    }
    // else if (town.length === 0) {
    //   //scrollToBottom()
    //   setIsDistrict(true);
    //   return;
    // }
    else if (locationID.length === 0) {
      scrollToBottom();
      // console.log('locationID======>', locationID);
      setIsSubDistrict(true);
      return;
    } else if (postalCode.length === 0) {
      scrollToBottom();
      setIsPostalCode(true);
      return;
    } else if (
      !isFromRide &&
      !isFromSend &&
      addressAs.length === 0 &&
      !isFromPlaceOrder
    ) {
      // console.log('newaddress----');
      scrollToBottom();
      setIsAddressAs(true);
      return;

      // console.log('newaddress----------------');
    } else if (isFromSend && saveToAddressList && addressAs.length === 0) {
      scrollToBottom();
      setIsAddressAs(true);
      return;
    } else {
      if (isNew) {
        // console.log('newaddressnewaddress----------------');
        saveAddress();
      } else if (isFromSend || isFromRide) {
        if (saveToAddressList) {
          saveToAddressListForSend();
        } else {
          if (isFromRide) {
            if (isPickupClicked) {
              getPickupAddressIdForRide();
            } else if (isDropOffClicked) {
              getDropOffAddressIdForRide();
            }
          } else if (isFromSend) {
            if (isPickupClicked) {
              getPickupAddressId();
            } else if (isDropOffClicked) {
              getDropOffAddressId();
            }
          }
        }
      } else if (isFromRide) {
        if (isPickupClicked) {
          getPickupAddressIdForRide();
        } else if (isDropOffClicked) {
          getDropOffAddressIdForRide();
        }
      } else if (isFromPlaceOrder) {
        getAddressIdForPlaceOrder();
      } else {
        console.log('editaddress', addressId);
        if (addressId !== 0) {
          editAddress();
        }
      }
      //saveAddress();
    }
  };

  const getAddressIdForPlaceOrder = async () => {
    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        // console.log('AddressIDForPLACEORDER###########', response.data.payload);
        if (response.data.isSuccess) {
          //add latlng
          dispatch(
            setDeliveryAddress(
              buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
            ),
          );
          dispatch(setDeliveryLat(latitude));
          dispatch(setDeliveryLng(longitude));
          dispatch(setDeliveryAddressId(response.data.payload));
          props.navigation.pop(3);
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const getPickupAddressId = async () => {
    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        // console.log('pickupIIIIDDDDDDD###########', response.data.payload);
        if (response.data.isSuccess) {
          response.data.payload,
            props.navigation.navigate(Routes.COURIER, {
              pickupAddress:
                buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
              pickupLat: latitude,
              pickupLng: longitude,
              idp: response.data.payload,
              subDistrictTitle: subDistrict,
              subDistrictIdPickUp: locationID,
              pickupTitle: addressTitle,
            });
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const getDropOffAddressId = async () => {
    // const getUserId = await AsyncStorage.getItem('userId');
    // const getaccount = await AsyncStorage.getItem('accountId');

    // console.log('latlng', latitude, longitude);
    // console.log('defaultAddress value----------', defaultAddress);
    // console.log('isFromSend value----------', isFromSend);
    // console.log('isFromRide value----------', isFromRide);

    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        // console.log('DropOffIIIDDDDD##########', response.data.payload);
        if (response.data.isSuccess) {
          props.navigation.navigate(Routes.COURIER, {
            dropOffAddress:
              buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
            dropOffLat: latitude,
            dropOffLng: longitude,
            idd: response.data.payload,
            subDistrictTitle: subDistrict,
            subDistrictIdDropOff: locationID,
            dropOffTitle: addressTitle,
          });
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const getPickupAddressIdIfSaveToList = async () => {
    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        console.log(
          'pickupIIIIDDDDDDD###########',
          latitude,
          longitude,
          response.data.payload,
          subDistrict,
          locationID,
          addressAs,
        );
        if (response.data.isSuccess) {
          response.data.payload,
            props.navigation.navigate(Routes.COURIER, {
              pickupAddress:
                buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
              pickupLat: latitude,
              pickupLng: longitude,
              idp: response.data.payload,
              subDistrictTitle: subDistrict,
              subDistrictIdPickUp: locationID,
              pickupTitle: addressAs,
              // dropOffLat: latitude,
              // dropOffLng: longitude,
            });
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const getDropOffAddressIdIfSaveToList = async () => {
    // const getUserId = await AsyncStorage.getItem('userId');
    // const getaccount = await AsyncStorage.getItem('accountId');

    // console.log('latlng', latitude, longitude);
    // console.log('defaultAddress value----------', defaultAddress);
    // console.log('isFromSend value----------', isFromSend);
    // console.log('isFromRide value----------', isFromRide);

    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        console.log(
          'DropOffIIIDDDDD##########',
          latitude,
          longitude,
          response.data.payload,
          subDistrict,
          locationID,
          addressAs,
        );
        if (response.data.isSuccess) {
          props.navigation.navigate(Routes.COURIER, {
            dropOffAddress:
              buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
            dropOffLat: latitude,
            dropOffLng: longitude,
            idd: response.data.payload,
            subDistrictTitle: subDistrict,
            subDistrictIdDropOff: locationID,
            dropOffTitle: addressAs,
          });
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const getPickupAddressIdForRide = async () => {
    // const getUserId = await AsyncStorage.getItem('userId');
    // const getaccount = await AsyncStorage.getItem('accountId');

    // console.log('latlng', latitude, longitude);
    // console.log('defaultAddress value----------', defaultAddress);
    // console.log('isFromSend value----------', isFromSend);
    // console.log('isFromRide value----------', isFromRide);

    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        // console.log('pickupIIIIDDDDDDD###########', response.data.payload);
        if (response.data.isSuccess) {
          props.navigation.navigate(Routes.RIDE_DELIVERY_DETAILS, {
            pickupAddress:
              buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
            pickupLat: latitude,
            pickupLng: longitude,
            idp: response.data.payload,
            subDistrictTitle: subDistrict,
            subDistrictIdPickUp: locationID,
          });
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const getDropOffAddressIdForRide = async () => {
    // const getUserId = await AsyncStorage.getItem('userId');
    // const getaccount = await AsyncStorage.getItem('accountId');

    // console.log('latlng', latitude, longitude);
    // console.log('defaultAddress value----------', defaultAddress);
    // console.log('isFromSend value----------', isFromSend);
    // console.log('isFromRide value----------', isFromRide);

    axios
      .post(saveAddressapiUrl, {
        accountId: getaccount._z,
        mapAddress: subAddress,
        address1: buildingHouseNumber + ', ' + buildingName,
        address2: subAddress,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId._z,
        DefaultAddress: defaultAddress,
        savedAddress: false,
      })
      .then(response => {
        // console.log('DropOffIIIDDDDD##########', response.data.payload);
        if (response.data.isSuccess) {
          props.navigation.navigate(Routes.RIDE_DELIVERY_DETAILS, {
            dropOffAddress:
              buildingHouseNumber + ', ' + buildingName + ', ' + subAddress,
            dropOffLat: latitude,
            dropOffLng: longitude,
            idd: response.data.payload,
            subDistrictTitle: subDistrict,
            subDistrictIdPickUp: locationID,
          });
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };

  const editAddress = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    const getaccount = await AsyncStorage.getItem('accountId');

    //console.log('latlng', latitude, longitude);
    console.log('addressIdonapicall', props.route.params.addressId);
    //console.log('defaultAddress value edit----------', defaultAddress);

    let body = {
      DefaultAddress: defaultAddress,
      savedAddress: true,
      accountId: getaccount._z,
      mapAddress: subAddress,
      //mapAddress: buildingHouseNumber + ', ' + buildingName + subAddress,
      address1: buildingHouseNumber,
      address2: buildingName,
      subDistrictName: subDistrict,
      subDistrictId: locationID,
      districtId: 0,
      districtName: town,
      provinceId: 0,
      provinceName: state,
      postalCode: postalCode,
      landmark: landmark,
      title: addressAs,
      latitude: latitude,
      longitude: longitude,
      userId: getUserId,
    };

    console.log('editAddress======================body===', body);

    axios
      .post(editAddressApiUrl, {
        DefaultAddress: defaultAddress,
        savedAddress: true,
        accountId: getaccount._z,
        mapAddress: subAddress,
        //mapAddress: buildingHouseNumber + ', ' + buildingName + subAddress,
        address1: buildingHouseNumber,
        address2: buildingName,
        subDistrictName: subDistrict,
        subDistrictId: locationID,
        districtId: 0,
        districtName: town,
        provinceId: 0,
        provinceName: state,
        postalCode: postalCode,
        landmark: landmark,
        title: addressAs,
        latitude: latitude,
        longitude: longitude,
        userId: getUserId,
      })
      .then(response => {
        try {
          console.log('payloaddd-->:', response.data);
          //setData(response.data.payload);
          Alert.alert('Success', response.data.message, [
            {
              text: 'ok',
              onPress: () => {
                props.navigation.pop(3);
              },
              style: 'cancel',
            },
          ]);
          //ToastAndroid.show(response.data.message, ToastAndroid.LONG);
          //props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
          //dispatch(setDefaultAddress(subAddress));
          //dispatch(setDefaultAddressTitle(addressTitle));
          //dispatch(setLat(latitude));
          //dispatch(setLng(longitude));
        } catch (e) {
          ToastAndroid.show(
            'Something went wrong, please try again..',
            ToastAndroid.LONG,
          );
          props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  };
  // const scrollToBottom = () => {
  //   // inputScrollRef.current.measureLayout(
  //   //   scrollViewRef.current.getInnerViewNode(),
  //   //   (x, y) => {
  //   //     console.log("-==-=-=-=", y)
  //   //     scrollViewSizeChanged(y);
  //   //   }
  //   // );
  //   console.log("-==-=-=-=", inputScrollRef.current)
  //   if (inputScrollRef.current) {
  //     inputScrollRef.current.measureLayout(
  //       scrollViewRef.current.getInnerViewNode(),
  //       (x, y) => {
  //         console.log("-==-=-=-=", y)
  //         scrollViewSizeChanged(y);
  //       }
  //     );
  //   }
  // };
  const scrollViewSizeChanged = () => {
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  };
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <BaseView
        navigation={props.navigation}
        title={t('Add Address Details')}
        headerWithBack
        applyBottomSafeArea
        childContainerStyle={{ flex: 1 }}
        childView={() => {
          return (
            <View style={{ flex: 1 }}>
              <ScrollView
                ref={scrollViewRef}
                onLayout={event => {
                  // console.log(
                  //   'Scrollview--------------------------------',
                  //   event.nativeEvent.layout,
                  // );
                }}
                fadingEdgeLength={200}
                showsVerticalScrollIndicator={false}
                decelerationRate={'normal'}
                style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <View style={{ flex: 1, margin: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
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
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 26 },
                      ]}>
                      {t('Building / House Number')}
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
                          { alignSelf: 'flex-start', color: 'red' },
                        ]}>
                        {t('Please enter building/house number')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 8 },
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
                          { alignSelf: 'flex-start', color: 'red' },
                        ]}>
                        {t('Please enter building name')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 8 },
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
                          { alignSelf: 'flex-start', color: 'red' },
                        ]}>
                        {t('Please enter landmark')}
                      </Text>
                    )}

                    <Text
                      style={[
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 8 },
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
                          { alignSelf: 'flex-start', color: 'red' },
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
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 8 },
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
                          { alignSelf: 'flex-start', color: 'red' },
                        ]}>
                        {t('Please enter province')}
                      </Text>
                    )}

                    {/* <Text
                      style={[
                        screenStyles.accountText,
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

                    {/* <Text
                      style={[
                        screenStyles.accountText,
                        {alignSelf: 'flex-start', marginTop: 8},
                      ]}>
                      {t('Subdistrict')}
                    </Text> */}
                    <Text
                      style={[
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 8 },
                      ]}>
                      {t('District')}
                    </Text>
                    <View>
                      {/* Subdistrict=========================================================== */}
                      <View>
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            height: 44,
                            alignSelf: 'center',
                            borderRadius: 6,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
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
                              style={{ width: 14, height: 14 }}
                            />
                          ) : (
                            <Image
                              source={require('../../../../branding/carter/assets/images/dropdown.png')}
                              style={{ width: 14, height: 14 }}
                            />
                          )}
                        </TouchableOpacity>
                        {clicked ? (
                          <View
                            style={{
                              //  height: 180,
                              borderRadius: 6,
                              marginTop: 10,
                              alignSelf: 'center',
                              width: '100%',
                              backgroundColor: '#fff',
                              borderWidth: 1,
                              borderColor: '#d4d4d4',
                              // position: 'absolute',
                              // zIndex: 99999,
                              // top: 40
                            }}>
                            <TextInput
                              placeholder={
                                selectedCountry == ''
                                  ? 'Type here'
                                  : `${selectedCountry}`
                              }
                              value={search}
                              borderColor={'#d4d4d4'}
                              borderRadius={5}
                              borderWidth={1}
                              marginTop={10}
                              paddingHorizontal={15}
                              textInputRef={r => (inputRef = r)}
                              onChangeText={txt => {
                                onSearch(txt);
                                setSearch(txt);
                              }}
                            />

                            <FlatList
                              data={filteredStoreList}
                              scrollEnabled={true}
                              renderItem={({ item, index }) => {
                                return (
                                  <KeyboardAwareScrollView
                                    keyboardShouldPersistTaps={'never'}>
                                    <TouchableOpacity
                                      style={{
                                        width: '90%',
                                        alignSelf: 'center',
                                        height: 50,
                                        justifyContent: 'center',
                                        borderBottomWidth: 0.5,
                                        borderColor: '#d4d4d4',
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
                                        ); //Deepak
                                        setClicked(!clicked);
                                        onSearch('');
                                        setSearch('');
                                      }}>
                                      <Text style={{ fontWeight: '600' }}>
                                        {item.districtName +
                                          ', ' +
                                          item.subDistrictName}
                                      </Text>
                                    </TouchableOpacity>
                                  </KeyboardAwareScrollView>
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
                          { alignSelf: 'flex-start', color: 'red' },
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
                        screenStyles.accountText,
                        { alignSelf: 'flex-start', marginTop: 8 },
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
                          { alignSelf: 'flex-start', color: 'red' },
                        ]}>
                        {t('Please enter postal code')}
                      </Text>
                    )}

                    {(isNew || isEdit) && (
                      <View>
                        <Text
                          style={[
                            screenStyles.accountText,
                            { alignSelf: 'flex-start', marginTop: 18 },
                          ]}>
                          {t('Save Address As')}
                        </Text>

                        <AppInput
                          {...globalStyles.secondaryInputStyle}
                          textInputRef={r => (inputRef = r)}
                          showLeftIcon={false}
                          // ref={inputScrollRef}
                          placeholder={t('Home / Work / Other')}
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
                              { alignSelf: 'flex-start', color: 'red' },
                            ]}>
                            {t('Please enter save as')}
                          </Text>
                        )}

                        <CheckBox
                          title={t('Set as default')}
                          checked={defaultAddress}
                          textStyle={{
                            fontSize: Typography.P5,
                            marginStart: 5,
                            fontFamily: fonts.RUBIK_REGULAR,
                            color: 'gray',
                          }}
                          containerStyle={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            margin: 0,
                            padding: 6,
                            paddingStart: 0,
                            marginStart: 0,
                          }}
                          onPress={() => setAsDefaultAddress(!defaultAddress)}
                          checkedIcon={
                            <SvgIcon
                              type={IconNames.CheckCircle}
                              width={22}
                              height={22}
                              color={colors.primaryGreenColor}
                            />
                          }
                          uncheckedIcon={
                            <SvgIcon
                              type={IconNames.CheckCircle}
                              width={20}
                              height={20}
                              color={colors.headerPrimaryColor}
                            />
                          }
                        />
                      </View>
                    )}

                    {(isFromSend || isFromRide) && (
                      <View style={{ marginTop: 10 }}>
                        <BouncyCheckbox
                          size={18}
                          fillColor="#2d2e7d"
                          unfillColor="#FFFFFF"
                          text="Save to my address book"
                          iconStyle={{
                            borderColor: '#2d2e7d',
                            borderWidth: 1,
                            borderRadius: 4,
                            marginRight: 0,
                          }}
                          innerIconStyle={{ borderWidth: 1, borderRadius: 4 }}
                          textStyle={{
                            fontFamily: 'JosefinSans-Regular',
                            fontSize: 14,
                            marginLeft: 0,
                            textDecorationLine: 'none',
                          }}
                          onPress={isChecked => {
                            console.log('isChecked-=-=-=-=-=-=-=', isChecked);
                            if (isChecked) {
                              scrollToBottom();
                              setSaveToAddressList(true);
                            } else {
                              setSaveToAddressList(false);
                            }
                          }}
                          isChecked={false}
                        />

                        {/* <CheckBox
                          title={t('Set as default')}
                          checked={defaultAddress}
                          textStyle={{
                            fontSize: Typography.P5,
                            marginStart: 5,
                            fontFamily: fonts.RUBIK_REGULAR,
                            color: 'gray',
                          }}
                          containerStyle={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            margin: 0,
                            padding: 6,
                            paddingStart: 0,
                            marginStart: 0,
                          }}
                          onPress={() => setAsDefaultAddress(!defaultAddress)}
                          checkedIcon={
                            <SvgIcon
                              type={IconNames.CheckCircle}
                              width={22}
                              height={22}
                              color={colors.primaryGreenColor}
                            />
                          }
                          uncheckedIcon={
                            <SvgIcon
                              type={IconNames.CheckCircle}
                              width={20}
                              height={20}
                              color={colors.headerPrimaryColor}
                            />
                          }
                        /> */}
                      </View>
                    )}

                    {saveToAddressList && (
                      <View>
                        <Text
                          style={[
                            screenStyles.accountText,
                            { alignSelf: 'flex-start', marginTop: 18 },
                          ]}>
                          {t('Save Address As')}
                        </Text>

                        <AppInput
                          {...globalStyles.secondaryInputStyle}
                          textInputRef={r => (inputRef = r)}
                          showLeftIcon={false}
                          // ref={inputScrollRef}
                          placeholder={t('Home / Work / Other')}
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
                              { alignSelf: 'flex-start', color: 'red' },
                            ]}>
                            {t('Please enter save as')}
                          </Text>
                        )}
                      </View>
                    )}

                    {/* {!isFromSend ||
                    (isFromRide && (
                      <View>
                        <Text
                          style={[
                            screenStyles.accountText,
                            {alignSelf: 'flex-start', marginTop: 18},
                          ]}>
                          {'Save address as'}
                        </Text>

                        <AppInput
                          {...globalStyles.secondaryInputStyle}
                          textInputRef={r => (inputRef = r)}
                          showLeftIcon={false}
                          placeholder={'Home / Work / Other'}
                          value={addressAs}
                          keyboardType={'default'}
                          onChangeText={value => {
                            setAddressAs(value);
                          }}
                        />

                        <CheckBox
                          title="Set as default"
                          checked={defaultAddress}
                          textStyle={{
                            fontSize: Typography.P5,
                            marginStart: 5,
                            fontFamily: fonts.RUBIK_REGULAR,
                            color: 'gray',
                          }}
                          containerStyle={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            margin: 0,
                            padding: 6,
                            paddingStart: 0,
                            marginStart: 0,
                          }}
                          onPress={() => setAsDefaultAddress(!defaultAddress)}
                          checkedIcon={
                            <SvgIcon
                              type={IconNames.CheckCircle}
                              width={22}
                              height={22}
                              color={colors.primaryGreenColor}
                            />
                          }
                          uncheckedIcon={
                            <SvgIcon
                              type={IconNames.CheckCircle}
                              width={20}
                              height={20}
                              color={colors.headerPrimaryColor}
                            />
                          }
                        />
                      </View>
                    ))} */}
                  </View>
                </View>
              </ScrollView>
              <View style={{ marginTop: 10, marginHorizontal: 16 }}>
                <AppButton
                  title={t('Save Address')}
                  loader={isLoading}
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

// const mapStyle = [
//     {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
//     {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
//     {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
//     {
//       featureType: 'administrative.locality',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#d59563'}],
//     },
//     {
//       featureType: 'poi',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#d59563'}],
//     },
//     {
//       featureType: 'poi.park',
//       elementType: 'geometry',
//       stylers: [{color: '#263c3f'}],
//     },
//     {
//       featureType: 'poi.park',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#6b9a76'}],
//     },
//     {
//       featureType: 'road',
//       elementType: 'geometry',
//       stylers: [{color: '#38414e'}],
//     },
//     {
//       featureType: 'road',
//       elementType: 'geometry.stroke',
//       stylers: [{color: '#212a37'}],
//     },
//     {
//       featureType: 'road',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#9ca5b3'}],
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'geometry',
//       stylers: [{color: '#746855'}],
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'geometry.stroke',
//       stylers: [{color: '#1f2835'}],
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#f3d19c'}],
//     },
//     {
//       featureType: 'transit',
//       elementType: 'geometry',
//       stylers: [{color: '#2f3948'}],
//     },
//     {
//       featureType: 'transit.station',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#d59563'}],
//     },
//     {
//       featureType: 'water',
//       elementType: 'geometry',
//       stylers: [{color: '#17263c'}],
//     },
//     {
//       featureType: 'water',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#515c6d'}],
//     },
//     {
//       featureType: 'water',
//       elementType: 'labels.text.stroke',
//       stylers: [{color: '#17263c'}],
//     },
//   ];
//   const styles = StyleSheet.create({
//     container: {
//         flex:1,
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       alignItems: 'center',
//       justifyContent: 'flex-end',
//     },
//     mapStyle: {
//         flex:0.8,
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//     },
//   });

// <ScrollView
//   showsVerticalScrollIndicator={false}
//   style={{ flex: 1 }}>
//   <View style={{ flex: 1, flexDirection: 'column' }}>
//     <View style={{ flex: 1, margin: 20 }}>
//       <View style={{ flexDirection: 'row' }}>
//         <SvgIcon
//           type={IconNames.MapMarkerAlt}
//           width={22}
//           height={22}
//           color={colors.primaryGreenColor}
//         />

//         <Text
//           style={{
//             fontFamily: fonts.RUBIK_MEDIUM,
//             fontSize: Typography.P2,
//             marginStart: 5,
//             color: colors.headingColor,
//           }}>
//           {addressTitle}
//         </Text>
//       </View>

//       <Text
//         style={{
//           fontFamily: fonts.RUBIK_REGULAR,
//           fontSize: Typography.P3,
//           marginStart: 5,
//           marginTop: 10,
//           color: colors.headingColor,
//         }}>
//         {subAddress}
//       </Text>

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 26 },
//         ]}>
//         {'Building / House Number'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter building/house number'}
//         value={buildingHouseNumber}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setBuildingHouseNumber(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Building Name'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter building name'}
//         value={buildingName}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setBuildingName(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Landmark'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter landmark'}
//         value={landmark}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setLandmark(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Road'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter road'}
//         value={road}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setRoad(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Ward'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter ward'}
//         value={ward}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setWard(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Subdistrict'}
//       </Text>
//       <View style={{ marginTop: 10 }}>
//         {/* Province */}
//         <View style={{
//           backgroundColor: '#FFF',
//           borderColor: '#d4d4d4',
//           borderRadius: 10, // Set the desired borderRadius here
//           marginBottom: 10,
//           width: "100%",
//           marginVertical: 7,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingLeft: '7%',
//           borderWidth: 1,
//           height: heightPercentageToDP(5.7)

//         }}>
//           <SvgIcon type={IconNames.MapMarkedAlt} width={20} height={20} color={globalStyles.primaryInputStyle.iconColor} />
//           <Picker
//             selectedValue={data?.locationId}
//             onValueChange={(locationId, index) => {
//               const selectedLocation = province[index];
//               setData((prevData) => ({
//                 ...prevData,
//                 locationId,
//                 locationName: selectedLocation?.locationName || "",
//               }));
//               setSubDistrict(selectedLocation?.locationName || "");
//               if (locationId !== "") {
//                 // Additional logic if needed
//                 setLocationID(locationId);
//               }
//             }}
//             style={{ width: '93%' }}
//           >
//             <Picker.Item label={t("Select Sub District")} value="" color={globalStyles.primaryInputStyle.placeholderTextColor} />
//             {province && province?.map((item) => (
//               <Picker.Item key={item.locationId} label={item.locationName} value={item.locationId} color="#3B3B43" />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       {/* <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter subdistrict'}
//         value={subDistrict}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setSubDistrict(value);
//         }}
//       /> */}

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Town'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter town'}
//         value={town}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setTown(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 8 },
//         ]}>
//         {'Province, Postal code'}
//       </Text>
//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Enter province, postal code'}
//         value={postalCode}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setPostalCode(value);
//         }}
//       />

//       <Text
//         style={[
//           screenStyles.accountText,
//           { alignSelf: 'flex-start', marginTop: 18 },
//         ]}>
//         {'Save address as'}
//       </Text>

//       <AppInput
//         {...globalStyles.secondaryInputStyle}
//         textInputRef={r => (inputRef = r)}
//         showLeftIcon={false}
//         placeholder={'Home / Work / Other'}
//         value={addressAs}
//         keyboardType={'default'}
//         onChangeText={value => {
//           setAddressAs(value);
//         }}
//       />

//       <CheckBox
//         title="Set as default"
//         checked={defaultAddress}
//         textStyle={{
//           fontSize: Typography.P5,
//           marginStart: 5,
//           fontFamily: fonts.RUBIK_REGULAR,
//           color: 'gray',
//         }}
//         containerStyle={{
//           backgroundColor: 'transparent',
//           borderColor: 'transparent',
//           margin: 0,
//           padding: 6,
//           paddingStart: 0,
//           marginStart: 0,
//         }}
//         onPress={() => setAsDefaultAddress(!defaultAddress)}
//         checkedIcon={
//           <SvgIcon
//             type={IconNames.CheckCircle}
//             width={22}
//             height={22}
//             color={colors.primaryGreenColor}
//           />
//         }
//         uncheckedIcon={
//           <SvgIcon
//             type={IconNames.CheckCircle}
//             width={20}
//             height={20}
//             color={colors.headerPrimaryColor}
//           />
//         }
//       />

//       <View style={{ marginTop: 10 }}>
//         <AppButton
//           title={'Save Address'}
//           onPress={() => {
//             if (isNew) {
//               console.log('newaddress');
//               saveAddress();
//             } else {
//               console.log('editaddress');
//               if (addressId !== 0) {
//                 editAddress();
//               }
//             }
//             //saveAddress();
//           }}
//         />
//       </View>
//     </View>
//   </View>
// </ScrollView>
