import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Image,
  ToastAndroid,
  useColorScheme,
  View,
  Alert,
  BackHandler,
  Modal,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Tooltip, Text } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

import AsyncStorage from '@react-native-async-storage/async-storage';

import BaseView from '../../../BaseView';
import { ScrollView } from 'react-native-gesture-handler';
import IconNames from '../../../../../branding/carter/assets/IconNames';
import colors from '../../../../../branding/carter/styles/light/Colors';
import { SvgIcon } from '../../../../components/Application/SvgIcon/View';
import Routes from '../../../../navigation/Routes';
import { useTheme } from '@react-navigation/native';

import AppConfig from '../../../../../branding/App_config';
import AppInput from '../../../../components/Application/AppInput/View';

import { commonDarkStyles } from '../../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../../branding/carter/styles/light/Style';
import { Styles } from '../Styles';
import DropDownItem from '../../../../components/Application/DropDownItem/View';
import {
  AuthService,
  PaymentService,
  ProductService,
  TrackService,
} from '../../../../apis/services';
import { useDispatch, useSelector } from 'react-redux';

import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AppButton from '../../../../components/Application/AppButton/View';
import { useTranslation } from 'react-i18next';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { RadioButton } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import Globals from '../../../../utils/Globals';
import axios from 'axios';
import { formatNumberWithCommas } from '../../../../utils/FormatNumberWithCommas';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import { color } from 'react-native-reanimated';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const DeliveryDetails = props => {
  let time, interval;

  //style
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  //translation
  const { t, i18n } = useTranslation();

  //useRef
  const mapViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  let inputRef = useRef();

  let PaymentInterval = useSelector(state => state.dashboard.PaymentInterval); //deepak add

  //local state save
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [ButtonName, setButtonName] = useState('Make Payment');
  const [isSenderNameError, setIsSenderNameError] = useState(false);
  const [isSenderMobileError, setIsSenderMobileError] = useState(false);
  const [isRecipientNameError, setIsRecipientNameError] = useState(false);
  const [isRecipientMobileError, setIsRecipientMobileError] = useState(false);
  const [isSelectedPaymentMethodError, setIsSelectedPaymentMethodError] =
    useState(false);
  const [isPaymentSelected, setIsPaymentSelected] = useState(false);
  const [isPaymentMethodValue, setIsPaymentMethodValue] = useState(0);
  const [checked, setChecked] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [totalCostTemp, setTotalCostTemp] = useState(0);
  const [second, setSecond] = useState(0);
  const [minutes, setMinutes] = useState(PaymentInterval); //deepak add
  const [data, setData] = useState({});
  const [deliveryTypeData, setDeliveryTypeData] = useState([]);
  const [pickupTypeData, setPickupTypeData] = useState([]);
  const [deliveryTypeId, setDeliveryTypeId] = useState(0);
  const [pickupTypeId, setPickupTypeId] = useState(0);
  const [merchantOrderId, setMerchantOrderId] = useState(
    String(Math.floor(100000 + Math.random() * 900000)),
  );
  const [province, setProvince] = useState([]);
  const [showSubDistrict, setShowSubDistrict] = useState(false);
  const [locationID, setLocationID] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [dimensionsDropdown, setDimensionsDropdown] = useState();
  const [bankData, setBankData] = useState([]);
  const [name, setName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [distance, setDistance] = useState(0);
  const [distanceInMeters, setDistanceInMeters] = useState(0);
  const [eta, setEta] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [routeId11, setRouteId] = useState(0);
  const [balance, setBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const [bannersCarbonClick, setBannersCarbonClick] = useState([]);

  //redux
  const addressIdCustomer = useSelector(
    state => state.addressReducer.defaultAddressID,
  );
  const MaxSendDistance = useSelector(
    state => state.dashboard.MaximumSendDistance,
  );
  const toDegrees = radians => radians * (180 / Math.PI);
  const toRad = value => (value * Math.PI) / 180;

  const [isStart, setIsStart] = useState(false);
  const updateStateForStart = data =>
    setIsStart(state => ({ ...state, ...data }));

  //Props

  const {
    deliveryIn,
    pickupAddress = '',
    dropOffAddress = '',
    dropOffLat = 0,
    dropOffLng = 0,
    totalKgCost = 0,
    packageWeight = 0,
    packageQty = 0,
    packageName,
    dimensionId,
    routeId,
    optionId,
    duration,
    applicationFee,
    subDistrict = '',
    categoryTypeId = '',
    pickupLat = 0,
    pickupLng = 0,
    subDistrictIdPickUp,
    subDistrictIdDropOff,
    pickupAddressId,
    dropOffAddressId,
    fare,
    insuranceFee,
    levyFee,
    serviceFee,
    shippingFee,
    weightFee,
    warehouseServiceFee,
    wasliDeliveryFee,
    environmentalFee,
    coldStorageFee,
    Perishable,
    isInterIsLand,
    warehouseFee,
    interIslandRateId,
    interIslandVal,
    interIsLandShippingCost,
  } = props?.route?.params;

  const pickupLocation = { latitude: pickupLat, longitude: pickupLng };
  const dropOffLocation = { latitude: dropOffLat, longitude: dropOffLng };

  const _carousel = useRef();

  useEffect(() => {
    getCarbonClickBanners();
    console.log('DeliveryDetails-4545-------------', isInterIsLand);
  }, []);

  const getCarbonClickBanners = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;

    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          // console.log(
          //   'isSuccess trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          // );
          const filterGroceryBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Checkout',
          );
          setBannersCarbonClick(filterGroceryBanners);
        } else {
          // console.log('isSuccess false');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const renderPromotionSlider = () => {
    return (
      <View style={screenStyles.carbonClickSliderStyle}>
        <Carousel
          ref={_carousel}
          //data={slider_data}
          data={bannersCarbonClick}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.carbonclick.com/');
                }}>
                <Image
                  source={{
                    uri: `${Globals.imgBaseURL}/${item.imageUrl}`,
                  }}
                  style={screenStyles.promotionSliderContainer}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            );
          }}
          sliderWidth={globalStyles.gridWidth}
          itemWidth={globalStyles.gridWidth}
          autoplay={false}
          loop
        />
      </View>
    );
  };

  useEffect(() => {
    if (deliveryIn === 1) {
      getDimensions();
    } else {
      //getTypesOfGoods();
    }

    // Check if both pickup and drop-off coordinates are available
    if (pickupLat && pickupLng && dropOffLat && dropOffLng) {
      fetchDirections();
    }

    const routeCoordinatesData = [
      { latitude: pickupLat, longitude: pickupLng },
      // ... intermediate coordinates
      { latitude: dropOffLat, longitude: dropOffLng },
    ];

    setRouteCoordinates(routeCoordinatesData);
  }, [pickupLat, pickupLng, dropOffLat, dropOffLng]);

  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.fitToCoordinates([pickupLocation, dropOffLocation], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [pickupLocation, dropOffLocation]);

  useEffect(() => {
    (async () => {
      const userName = await AsyncStorage.getItem('displayName');
      const phone = await AsyncStorage.getItem('phoneNo');
      const UserEmail = await AsyncStorage.getItem('email');

      setName(userName);
      setMobile(phone);
      setCustomerEmail(UserEmail);
    })();
  }, []);

  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      // Your code to re-render or fetch data goes here
      getBank();
      if (mapViewRef.current) {
        mapViewRef.current.fitToCoordinates([pickupLocation, dropOffLocation], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
      // ...
    }, []),
  );

  useEffect(() => {
    getData();
    checkWalletBal();
    const fetchData = async () => {
      try {
        const response = await AuthService.getLocationId(deliveryIn);
        if (response?.data?.isSuccess) {
          const foundLocation = response.data.payload.find(
            item =>
              item.districtName.toLowerCase() === subDistrict.toLowerCase() ||
              item.subDistrictName.toLowerCase() === subDistrict.toLowerCase(),
          );

          if (foundLocation) {
            // getRateFunc(foundLocation.locationId);
            setLocationID(foundLocation.locationId);
          } else {
            setShowSubDistrict(true);
          }

          setProvince(response.data.payload);
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

    // if (deliveryIn == 1) {
    //   getRateFunc()
    // }
  }, [deliveryIn, subDistrict]);

  const getData = async () => {
    try {
      const getUserName = await AsyncStorage.getItem('displayName');
      const getMobile = await AsyncStorage.getItem('phoneNo');

      setData(prevData => ({
        ...prevData,
        senderName: getUserName,
        senderPhone: getMobile,
      }));
    } catch (e) {
      // error reading value
    }
  };

  const getDimensions = async () => {
    try {
      const data = await ProductService.getDimensionForSend();
      if (data?.data?.isSuccess) {
        // console.log(
        //   'getDimensions=======================',
        //   data?.data?.payload,
        // );
        let newArray = data.data.payload.map(item => {
          return { key: item.id, value: item.dimension };
        });
        setDimensionsDropdown(newArray);
      } else {
        setDimensionsDropdown(null);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const getBank = async () => {
    try {
      const response = await PaymentService.getBankDetails(
        deliveryIn === 1
          ? fare +
          applicationFee +
          environmentalFee +
          (coldStorageFee === undefined ? 0 : coldStorageFee)
          : deliveryIn === 2
            ? applicationFee +
            totalKgCost +
            environmentalFee +
            (coldStorageFee === undefined ? 0 : coldStorageFee)
            : 0,
      );
      if (response?.data?.isSuccess) {
        let newArray = response?.data.payload.map((item, key) => {
          return {
            key: key,
            value: (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: `${Globals.imgBaseURL}${item.paymentImage}` }}
                  style={{ width: 68, height: 18 }}
                  resizeMode="contain"
                />

                <Text style={{ marginLeft: 5 }}>{item.paymentName}</Text>
                <Text style={{ marginLeft: 5 }}>{item.paymentMethod}</Text>
              </View>
            ),
            data: item.paymentCode,
            // value: item.paymentName
            // value: response?.data.payload.paymentFee[key]
          };
        });

        setBankData(newArray);
      } else {
        setBankData(null);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const getTransactionReqId = async () => {
    let body = {
      paymentAmount: String(
        deliveryIn === 1
          ? fare + applicationFee + environmentalFee + coldStorageFee
          : deliveryIn === 2
            ? totalKgCost +
            applicationFee +
            environmentalFee +
            coldStorageFee +
            (isInterIsLand ? warehouseFee : 0) +
            (isInterIsLand ? interIsLandShippingCost : 0)
            : 0,
      ),
      paymentMethod: data?.paymentDetails?.paymentCode,
      merchantOrderId: merchantOrderId,
      productDetails: packageName,
      additionalParam: '',
      merchantUserInfo: '',
      customerVaName: name,
      email: customerEmail,
      phoneNumber: mobile,
      itemDetails: [
        // {
        //   name: packageName,
        //   price: totalKgCost,
        //   quantity: packageQty
        // },
      ],
      customerDetail: {
        firstName: name,
        lastName: '',
        email: customerEmail,
        phoneNumber: mobile,
        billingAddress: {
          firstName: name,
          lastName: '',
          address: 'Jl. Kembanga',
          city: 'Jakarta',
          postalCode: String(11530),
          phone: mobile,
          countryCode: String(91),
        },
        shippingAddress: {
          firstName: name,
          lastName: '',
          address: 'Jl. Kembangan Raya',
          city: 'Jakarta',
          postalCode: String(11530),
          phone: mobile,
          countryCode: String(91),
        },
      },
      expiryPeriod: PaymentInterval, //deepak add
    };

    console.log('getTranscationIdBody----------------', body);

    const response = await PaymentService.getTranscationId(body);
    console.log(
      'getTranscationId----Respons--SEND--------------',
      response?.data,
    );

    if (response?.data?.isSuccess) {
      // setButtonName('Check Transaction');
      //bottomSheet open
      // console.log(
      //   'getTranscationIdResonse----------------',
      //   response?.data.payload,
      // );
      console.log(
        'getTranscationId----Respons-------SEND---------',
        response?.data?.payload,
      );

      setData(prevData => ({
        ...prevData,
        PaymentRefNumber: response?.data?.payload?.vaNumber,
        PaymentReference: response?.data?.payload?.reference,
      }));

      await AsyncStorage.setItem(
        'PaymentReference',
        response?.data?.payload?.reference,
      );
      await AsyncStorage.setItem(
        'PaymentRefNumber',
        response?.data?.payload?.vaNumber,
      );
    } else {
      // console.log(
      //   'getTranscationIdResonse----------------',
      //   response?.data.message,
      // );
    }
  };

  const MyComponent = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ marginLeft: 5 }}>Select bank transfer/e-wallet</Text>
      </View>
    );
  };

  const getRateFunc = async (locationId, val) => {
    let body = {
      deliveryOptionId: deliveryIn,
      categoryTypeId: categoryTypeId,
      customerlatitude: pickupLat,
      customerlongitude: pickupLng,
      partnerList: [],
      dimensionId: val,
      pickUplatitude: pickupLat,
      pickUplongitude: pickupLng,
      dropOfflatitude: dropOffLat,
      dropOfflongitude: dropOffLng,
      locationId: locationId,
      distance: distanceInMeters / 1000,
    };

    // console.log('bodyDeliveryDetaol====>', body);

    try {
      const dataa = await ProductService.getRate(body);
      if (dataa.data.isSuccess) {
        let item = dataa.data.payload;
        try {
          setData(prevData => ({
            ...prevData,
            serviceFee: item?.serviceFee,
            shippingFee: item?.shippingFee,
            weightFee: item?.weightFee,
            wasliDeliveryFee: item?.wasliDeliveryFee,
            applicationFee: item?.applicationFee,
            warehouseServiceFee: item?.warehouseServiceFee,
            insuranceFee: item?.insuranceFee,
            totalAmount: item?.totalAmount,
          }));
          ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        } catch (err) {
          ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        }
      } else {
      }
    } catch (error) { }
  };

  const handleBookDelivery = async () => {
    var date = new Date().toLocaleString();
    const getUserId = await AsyncStorage.getItem('userId');
    let distanceInKM = 0;
    // let distanceString = distance;

    // if (distanceString == 0) {
    //   distanceInKM = 0
    // } else {
    //   // let numericString = distanceString.replace(/[^0-9]/g, '');
    //   // const numericValue = parseFloat(distanceString.replace(/[^\d\.]/g, ''));
    //   // distanceInKM = parseInt(numericValue);
    //   const numericValue = parseFloat(distanceString.replace(/[^0-9.]/g, ''));
    //   distanceInKM = numericValue
    //   console.log("44444444444444", distance)
    // }

    const body = {
      orderDate: date,
      orderTypeId: categoryTypeId,
      orderStatusId: 2,
      deliveryOptionId: deliveryIn,
      customerId: getUserId, //userId
      customerName: name,
      customerPhoneNo: mobile,
      customerAddressId: addressIdCustomer,
      senderDeliveryMethodId: deliveryIn == 1 ? 0 : pickupTypeId, //use in intercity/ interIsland
      receiverShippingMethodId: deliveryIn == 1 ? 0 : deliveryTypeId, //use in intercity/ interIsland
      totalQty: packageQty, //check whether if its ride
      promoCode: '',
      promoDiscount: 0,
      totalAmount:
        deliveryIn == 1
          ? fare + applicationFee + environmentalFee + coldStorageFee
          : totalKgCost +
          applicationFee +
          environmentalFee +
          coldStorageFee +
          (isInterIsLand ? warehouseFee : 0) +
          (isInterIsLand ? interIsLandShippingCost : 0),
      totalDiscount: 0,
      serviceFee: deliveryIn == 1 ? serviceFee : 0,
      shippingFee: deliveryIn == 1 ? shippingFee : 0,
      weightFee: deliveryIn == 1 ? weightFee : 0,

      levyFee: deliveryIn == 1 ? levyFee : 0,
      insuranceFee: deliveryIn == 1 ? insuranceFee : 0,
      warehouseServiceFee: deliveryIn == 1 ? warehouseServiceFee : 0,
      wasliDeliveryFee: deliveryIn == 1 ? wasliDeliveryFee : 0,
      deliveryInstruction: '',

      pickupAddressId: pickupAddressId, //Ride and sender , it routing this data to another screen?
      dropoffAddressId: dropOffAddressId, //Ride and sender
      totalDistance: distanceInKM, //Ride and sender

      passengerName: '', //Ride
      passengerPhoneNo: '', //Ride
      pickupNote: '', //Ride

      senderName: data?.senderName || '', //Sender common
      senderPhoneNo: data?.senderPhone || '', //Sender commmon
      receipientName: data?.receiverName || '', //Sender common
      receipientPhoneNo: data?.receiverPhone || '', //Sender common
      packageName: packageName, //Sender local
      dimensionId: packageWeight <= 5 ? 1 : 2, //dimensionId if below 5 send 1 else above 5 send 2
      sendTypeId: deliveryIn == 1 ? 0 : deliveryTypeId, //Sender intercity
      packageQty: packageQty, //Sender intercity
      packageImage: '', //Sender common
      packageWeight: packageWeight, //Sender intercity
      packageNote: '', //Sender common

      paymentAmount:
        deliveryIn == 1
          ? fare + applicationFee + environmentalFee + coldStorageFee
          : totalKgCost +
          applicationFee +
          environmentalFee +
          coldStorageFee +
          (isInterIsLand ? warehouseFee : 0) +
          (isInterIsLand ? interIsLandShippingCost : 0),
      transactionId:
        checked == 'VA' ? await AsyncStorage.getItem('PaymentReference') : ' ',
      //transactionId: checked == 'VA' ? data?.PaymentReference : '',
      accountNo: '',
      file: '',
      note: checked,
      orderDetails: [],
      routeId: deliveryIn == 1 ? 0 : routeId,
      routeOptionId: deliveryIn == 1 ? 0 : optionId,
      PaymentTypeId: 1,
      paymentMethod: checked,
      paymentStatusId: 1,
      TransactionTypeId: 2,
      bankId: 'VA' ? data?.paymentDetails?.bankId : 0,
      applicationFee: applicationFee,
      environmentalFee: environmentalFee,
      coldStorageFee: coldStorageFee,
      Perishable: Perishable,
      InterIslandRateId: isInterIsLand ? interIslandRateId : 0,
      WarehouseFee: isInterIsLand ? warehouseFee : 0,
      interIslandShippingCost: isInterIsLand ? interIsLandShippingCost : 0,
    };

    console.log('Send----bodyDeliveryDetails=======>', body);

    try {
      clearInterval(time);
      clearInterval(interval);
      setIsOrderPlaced(true);
      setLoading(true);
      const data = await ProductService.getCartCheckOut(body, categoryTypeId);
      setLoading(false);
      // console.log('response====>', data.data);
      if (data.data.isSuccess) {
        // console.log("isOrderplaced ---- if set", isOrderPlaced)

        clearInterval(time);
        setIsOrderPlaced(true);
        try {
          Alert.alert(
            'Order placed successfully',
            'Please continue to track order',
            [
              {
                text: 'Continue',
                onPress: () => {
                  setModalVisible(false);

                  props.navigation.navigate(Routes.MY_ORDERS, { hideBack: true });
                  //dispatch(clearProducts());
                },
              },
            ],
          );

          //ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        } catch (err) {
          ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        }
      } else {
        // setIsOrderPlaced(false);
        // console.log("isOrderplaced ---- else set", isOrderPlaced)
      }
    } catch (error) { }
  };
  const fetchDirections = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLat},${pickupLng}&destination=${dropOffLat},${dropOffLng}&key=${Globals.googleApiKey}`,
      );
      const data = await response.json();
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        // Extract distance and duration information
        console.log(
          'rounding_distanceeee',
          leg.distance.value,
          '------',
          MaxSendDistance * 1000,
          '-----',
          deliveryIn,
        );

        setDistance(leg.distance.text);
        setDistanceInMeters(leg.distance.value);
        if (deliveryIn == 1) {
          setEta(leg.duration.text);
        } else {
          setEta(0);
        }
      } else {
        setDistance(haversine(pickupLat, pickupLng, dropOffLat, dropOffLng));
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const r = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = r * c; // Distance in kilometers
    return d;
  };

  const handleValidationForLocal = async () => {
    //return false;
    // console.log('SENDERNAME-=-=-=-=-=-=-', data.senderPhone);
    if (data.senderName === '' || data.senderName === undefined) {
      // console.log('senderName');

      setIsSenderNameError(true);
      return false;
    } else if (data.senderPhone === undefined || data.senderPhone === '') {
      // console.log('senderPhone');
      setIsSenderMobileError(true);
      return false;
    }
    // } else if (data.senderPhone.length < 10) {
    //   console.log('senderPhone');
    //   setIsSenderMobileError(true);
    //   return false;
    // }
    else if (data.receiverName === '' || data.receiverName === undefined) {
      // console.log('receiverName');
      handleScrollToInput(170);
      setIsRecipientNameError(true);
      return false;
    } else if (data.receiverPhone === undefined || data.receiverPhone === '') {
      // console.log('receiverPhone');
      handleScrollToInput(570);
      setIsRecipientMobileError(true);
      return false;
    }
    // if (data.receiverPhone.length < 10) {
    //   console.log('receiverPhone');
    //   handleScrollToInput(570);
    //   setIsRecipientMobileError(true);
    //   return false;
    // }
    else if (checked == '') {
      handleScrollToInput(670);

      setIsSelectedPaymentMethodError(true);
    } else if (isPaymentMethodValue == -1 && checked === 'VA') {
      setIsPaymentSelected(true);
      return false;
    } else {
      if (checked == 'VA') {
        if (
          (deliveryIn == 1
            ? fare + applicationFee + environmentalFee + coldStorageFee
            : totalKgCost +
            applicationFee +
            environmentalFee +
            coldStorageFee +
            (isInterIsLand ? warehouseFee : 0) +
            (isInterIsLand ? interIsLandShippingCost : 0)) > 10000
        ) {
          updateStateForStart(true);
          setModalVisible(true);
          getTransactionReqId();
          callApi();
        } else {
          ToastAndroid.show('Minimum Payment 10000 IDR', ToastAndroid.LONG);
        }
      } else if (checked == 'Cash On Delivery') {
        handleBookDelivery();
      } else if (checked == 'Wallet') {
        if (
          balance > 0 &&
          balance >=
          (deliveryIn == 1
            ? fare + applicationFee + environmentalFee + coldStorageFee
            : totalKgCost +
            applicationFee +
            environmentalFee +
            coldStorageFee +
            (isInterIsLand ? warehouseFee : 0) +
            (isInterIsLand ? interIsLandShippingCost : 0))
        ) {
          // call Api for update wallet balance
          handleBookDelivery();
          // ToastAndroid.show('wallent balance', ToastAndroid.LONG);
        } else {
          console.log(balance);
          console.log(
            deliveryIn == 1
              ? fare + applicationFee + environmentalFee + coldStorageFee
              : totalKgCost +
              applicationFee +
              environmentalFee +
              coldStorageFee +
              (isInterIsLand ? warehouseFee : 0) +
              (isInterIsLand ? interIsLandShippingCost : 0),
          );
          Alert.alert(
            'Insuffcient Wallet Balance',
            'Do you want to topup your wallet?',
            [
              {
                text: 'No',
                onPress: () => { },
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => {
                  props.navigation.navigate(Routes.TOPUP_WALLET);
                },
              },
            ],
          );
        }
      }
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (
  //         data?.PaymentReference != null &&
  //         checked === 'VA' &&
  //         (await AsyncStorage.getItem('PaymentReference')) === '00'
  //       ) {
  //         setModalVisible(!modalVisible);
  //       }
  //     } catch (error) {
  //       // Handle any errors that may occur during AsyncStorage retrieval or other async operations
  //       console.error('Error:', error);
  //     }
  //   };

  //   fetchData();
  // }, [data?.PaymentReference, checked?.checkTransactionStatus]);

  const getPickupType = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getPickupTypeForInterCity();
      setLoading(false);
      // console.log('response====>', data.data);
      if (data.data.isSuccess) {
        // console.log('getPickupTypeForInterCity------', data.data);

        let newArray = data.data.payload.map(item => {
          return { key: item.id, value: item.name };
        });
        setPickupTypeData(newArray);
        getDeliveryType();
      } else {
        ToastAndroid.show(
          'Something went wrong, please try again',
          ToastAndroid.LONG,
        );
      }
    } catch (error) { }
  };

  const getDeliveryType = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getDeliverTypeForInterCity();
      setLoading(false);
      // console.log('response====>', data.data);
      if (data.data.isSuccess) {
        // console.log('getDeliverTypeForInterCity------', data.data);
        let newArray = data.data.payload.map(item => {
          return { key: item.id, value: item.name };
        });
        setDeliveryTypeData(newArray);
        getTotalCostForInterCity();
      } else {
        ToastAndroid.show(
          'Something went wrong, please try again',
          ToastAndroid.LONG,
        );
      }
    } catch (error) { }
  };

  const getTotalCostForInterCity = async () => {
    let body = {
      sourceLocationId: subDistrictIdPickUp,
      destinationLocationId: subDistrictIdDropOff,
    };

    // console.log('body===dsds=>', body);

    try {
      setLoading(true);
      const data = await ProductService.getRouteRateForInterCitySend(body);
      setLoading(false);
      // console.log('response====>', data.data);
      if (data.data.isSuccess) {
        try {
          setRouteId(data.data.payload.id);
          setTotalCostTemp(data.data.payload.cost);
          setTotalCost(data.data.payload.cost);
          setIsContinueClicked(true);
          // setButtonName("Make Payment");
          return true;
        } catch (err) {
          ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        }
      } else {
        ToastAndroid.show(
          'Something went wrong, please try again',
          ToastAndroid.LONG,
        );
      }
    } catch (error) { }
  };

  const handleScrollToInput = position => {
    scrollViewRef.current?.scrollTo({ y: position, animated: true });
  };

  useEffect(() => {
    const decrementTime = () => {
      time = setInterval(() => {
        if (second === 0) {
          if (minutes === 0) {
            clearInterval(time); // Countdown finished, clear interval
          } else {
            setMinutes(minutes - 1);
            setSecond(59);
          }
        } else {
          setSecond(second - 1);
        }
      }, 1000);
    };

    if (isStart) {
      decrementTime();
    }

    return () => clearInterval(time); // Cleanup interval on component unmount
  }, [minutes, second, isStart]); // Include minutes and second in dependency array

  const callApi = () => {
    interval = setInterval(checkTransactionStatus, 5000);

    return () => clearInterval(interval);
  };

  const checkTransactionStatus = async () => {
    //console.log('hit checkTransactionStatus ===>', isOrderPlaced);
    const getUserId = await AsyncStorage.getItem('userId');
    const uniqueId = await DeviceInfo.getUniqueId();
    var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const body = {
      userId: getUserId,
      merchantOrderId: merchantOrderId,
      transactionNo:
        checked == 'VA' ? await AsyncStorage.getItem('PaymentReference') : ' ',
      latitude: pickupLat,
      longitude: pickupLng,
      deviceId: uniqueId,
      paymentDate: date,
      paymentTypeId: 1,
      vaNumber: await AsyncStorage.getItem('PaymentRefNumber'),
    };

    const response = await PaymentService.getCheckTransactionStatus(
      body,
      merchantOrderId,
    );
    // console.log(
    //   '000000000000000000000000000000checkTransactionStatus',
    //   response?.data,
    // );
    if (response?.data?.isSuccess) {
      if (response?.data?.payload?.statusCode == '01') {
        //process show loader
        setData(prevData => ({
          ...prevData,
          checkTransactionStatus: '01',
        }));
      } else if (response?.data?.payload?.statusCode == '00') {
        //success
        // console.log(
        //   '000000000000000000000000000000checkTransactionStatus',
        //   response?.data?.payload?.statusCode,
        // );
        // useRef

        clearInterval(time);
        clearInterval(interval);
        setMinutes(0);
        setSecond(0);
        setData(prevData => ({
          ...prevData,
          checkTransactionStatus: '00',
        }));

        // if (!isOrderPlaced) {
        //   handleBookDelivery();
        // }

        handleBookDelivery();
      } else if (response?.data?.payload?.statusCode == '02') {
        //failer
        setData(prevData => ({
          ...prevData,
          checkTransactionStatus: '02',
        }));
      }
    }
  };

  const checkWalletBal = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const response = await PaymentService.checkWalletBalance(getUserId);

      // console.log(
      //   '=======================================================',
      //   response?.data,
      // );
      if (response?.data?.isSuccess) {
        setBalance(response?.data?.payload);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };
  //console.log('isOrderplaced ', isOrderPlaced);

  return (
    <BaseView
      navigation={props.navigation}
      title={t('Delivery Details')}
      headerWithBack={true}
      onBackPress={() => {
        props.navigation.navigate(Routes.COURIER)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.mainContainer}>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}>
              <View>
                {/* --------------------Location Details start-------------------------------------------------- */}
                <Text style={screenStyles.headerText}>Location Details</Text>

                <View style={screenStyles.Box}>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={screenStyles.BoxContent}>Pickup From</Text>

                    <Text style={[screenStyles.BoxContent, { color: 'gray' }]}>
                      {pickupAddress}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 8 }}>
                    <Text style={screenStyles.BoxContent}>Deliver to</Text>

                    <Text style={[screenStyles.BoxContent, { color: 'gray' }]}>
                      {dropOffAddress}
                    </Text>
                  </View>

                  {ButtonName == 'Make Payment' && (
                    <View style={screenStyles.divider} />
                  )}

                  {ButtonName == 'Make Payment' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 8,
                      }}>
                      {/* <Text style={screenStyles.textDis}>Distance</Text> */}

                      {/* <Text
                        style={[
                          screenStyles.textDis,
                          { fontFamily: fonts.RUBIK_MEDIUM, marginRight: 20 },
                        ]}>
                        : {distance == 0 ? 'NA' : distance}
                      </Text> */}

                      <Text style={screenStyles.textDis}>
                        Delivery expected by
                      </Text>
                      <Text
                        style={[
                          screenStyles.textDis,
                          { fontFamily: fonts.RUBIK_MEDIUM },
                        ]}>
                        : {eta !== 0 ? eta : duration}
                      </Text>
                    </View>
                  )}
                </View>

                {/* --------------------Location Details End-------------------------------------------------- */}

                {/* map view start*/}

                {pickupLat === 0 ||
                  pickupLng === 0 ||
                  dropOffLat === 0 ||
                  dropOffLng === 0 ? (
                  <Text>Error</Text>
                ) : (
                  ButtonName == 'Make Payment' && (
                    <View
                      style={{
                        backgroundColor: 'red',
                        height: 200,
                        padding: 0,
                        marginBottom: 12,
                        borderRadius: 4,
                      }}>
                      <MapView
                        ref={mapViewRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 4,
                        }}
                        scrollEnabled={true}
                        initialRegion={{
                          latitude: pickupLocation.latitude,
                          longitude: pickupLocation.longitude,
                          latitudeDelta: 0.01, // Adjust this value for more or less zoom
                          longitudeDelta: 0.01, // Adjust this value for more or less zoom
                        }}>
                        <Marker
                          coordinate={pickupLocation}
                          title="Pickup"
                          pinColor="green">
                          <Image
                            source={require('../../../../../branding/carter/assets/images/source.png')}
                          // style={styles.markerImage}
                          />
                        </Marker>
                        <Marker
                          coordinate={dropOffLocation}
                          title="Drop-off"
                          pinColor="tomato">
                          <Image
                            source={require('../../../../../branding/carter/assets/images/destination.png')}
                          // style={styles.markerImage}
                          />
                        </Marker>
                        {isInterIsLand && (
                          <Polygon
                            strokeWidth={1.8}
                            strokeColor="#000000"
                            coordinates={[pickupLocation, dropOffLocation]}
                          />
                        )}
                        {!isInterIsLand && (
                          <MapViewDirections
                            origin={pickupLocation}
                            destination={dropOffLocation}
                            apikey={Globals.googleApiKey}
                            strokeWidth={3}
                            strokeColor="#000000"
                            optimizeWaypoints={true}
                          />
                        )}
                      </MapView>
                    </View>
                  )
                )}

                {/* map view end*/}

                {/* person details */}
                {ButtonName == 'Make Payment' && (
                  <View>
                    {/* --------------------Sender Details-------------------------------------------------- */}

                    <View>
                      <Text style={screenStyles.headerText}>
                        {t('Sender Details')}
                      </Text>

                      <View style={screenStyles.Box}>
                        <View>
                          <AppInput
                            textInputRef={r => (inputRef = r)}
                            leftIcon={IconNames.UserAlt}
                            containerStyle={screenStyles.inputText}
                            placeholder={t('Enter name')}
                            value={data?.senderName}
                            onChangeText={text => {
                              setIsSenderNameError(false);
                              setData(prevData => ({
                                ...prevData,
                                senderName: text,
                              }));
                            }}
                          />

                          {isSenderNameError && (
                            <Text style={screenStyles.errorInputText}>
                              {t('Name is required')}
                            </Text>
                          )}

                          <AppInput
                            textInputRef={r => (inputRef = r)}
                            leftIcon={IconNames.PhoneFlip}
                            containerStyle={screenStyles.inputText}
                            placeholder={t('Enter mobile number')}
                            keyboardType={'number-pad'}
                            maxLength={15}
                            value={data?.senderPhone}
                            onChangeText={text => {
                              setIsSenderMobileError(false);
                              if (String(text).match(/[\s,.-]/g, '')) {
                              } else {
                                setData(prevData => ({
                                  ...prevData,
                                  senderPhone: text,
                                }));
                              }
                            }}
                          />

                          {isSenderMobileError && (
                            <Text style={screenStyles.errorInputText}>
                              Mobile number is required
                              {/* {data.senderPhone === undefined ||
                              data.senderPhone === ''
                                ? 'Mobile number is required'
                                : data.senderPhone.length < 10
                                ? 'Please enter correct mobile number'
                                : ''} */}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* --------------------Recipients Details-------------------------------------------------- */}
                    <View>
                      <Text style={screenStyles.headerText}>
                        {t('Recipients Details')}
                      </Text>

                      <View style={screenStyles.Box}>
                        <View>
                          <AppInput
                            textInputRef={r => (inputRef = r)}
                            leftIcon={IconNames.UserAlt}
                            containerStyle={screenStyles.inputText}
                            placeholder={t('Enter name')}
                            // keyboardType={'email-address'}
                            value={data?.receiverName}
                            onChangeText={text => {
                              setIsRecipientNameError(false);
                              setData(prevData => ({
                                ...prevData,
                                receiverName: text,
                              }));
                            }}
                          />

                          {isRecipientNameError && (
                            <Text style={screenStyles.errorInputText}>
                              {t('Name is required')}
                            </Text>
                          )}

                          <AppInput
                            textInputRef={r => (inputRef = r)}
                            leftIcon={IconNames.PhoneFlip}
                            containerStyle={screenStyles.inputText}
                            placeholder={t('Enter mobile number')}
                            maxLength={15}
                            keyboardType={'number-pad'}
                            value={data?.receiverPhone}
                            onChangeText={text => {
                              setIsRecipientMobileError(false);
                              if (String(text).match(/[\s,.-]/g, '')) {
                              } else {
                                setData(prevData => ({
                                  ...prevData,
                                  receiverPhone: text,
                                }));
                              }
                            }}
                          />

                          {isRecipientMobileError && (
                            <Text style={screenStyles.errorInputText}>
                              Mobile number is required
                              {/* {data.receiverPhone === undefined ||
                                data.receiverPhone === ''
                                ? 'Mobile number is required'
                                : data.receiverPhone.length < 10
                                  ? 'Please enter correct mobile number'
                                  : ''} */}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                    {/* --------------------Package Details-------------------------------------------------- */}
                    <View>
                      <Text style={screenStyles.headerText}>
                        {t('Package Details')}
                      </Text>

                      <View style={[screenStyles.Box]}>
                        {/* <Text
                          style={{
                            fontSize: Typography.P3,
                            fontFamily: fonts.RUBIK_MEDIUM,
                            color: 'black',
                          }}>
                          {packageName}
                        </Text> */}
                        <Text style={screenStyles.headerSubtitleText}>
                          Package Name:{' '}
                          <Text style={{ color: 'black', fontWeight: 'bold' }}>
                            {packageName}
                          </Text>
                        </Text>
                        {isInterIsLand && (
                          <Text style={screenStyles.headerSubtitleText}>
                            Item Type:{' '}
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>
                              {interIslandVal}
                            </Text>
                          </Text>
                        )}
                        <Text style={screenStyles.headerSubtitleText}>
                          {/* Package Type:{' '} */}
                          Types of Goods:{' '}
                          <Text style={{ color: 'black', fontWeight: 'bold' }}>
                            {Perishable ? 'Wet' : 'Dry'}
                          </Text>
                        </Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Weight:{' '}
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>
                              {packageWeight} {'kg'}{' '}
                            </Text>
                          </Text>
                          <Text style={screenStyles.headerSubtitleText}>
                            Quantity:{' '}
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>
                              {packageQty}
                            </Text>
                          </Text>
                        </View>
                        {deliveryIn == 2 && (
                          <Text style={screenStyles.headerSubtitleText}>
                            Delivery Method:{' '}
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>
                              {optionId == 1 ? 'Fastest' : 'Cheapest'}
                            </Text>
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                )}

                {/* --------------------Package & Fare Details UI based on DeliverIn ID-------------------------------------------------- */}

                {pickupAddress === '' || dropOffAddress === '' ? (
                  <Text>Please select pickup & deliver to address</Text>
                ) : (
                  <View>
                    {/* --------------------Payment method start-------------------------------------------------- */}
                    {ButtonName == 'Make Payment' && (
                      <View>
                        <Text style={screenStyles.headerText}>
                          Payment Method
                        </Text>

                        <View style={screenStyles.Box}>
                          {/* Wallet */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton
                              color={colors.radioButtonActive}
                              uncheckedColor="#C0C0C0"
                              value="Wallet"
                              status={
                                checked === 'Wallet' ? 'checked' : 'unchecked'
                              }
                              onPress={() => {
                                setIsSelectedPaymentMethodError(false);
                                setChecked('Wallet');
                              }}
                            />
                            <Text style={screenStyles.textPayment}>
                              Wallet{' '}
                              <Text style={screenStyles.textPaymentHighlight}>
                                (Rp. {formatNumberWithCommas(balance)})
                              </Text>
                            </Text>

                            {balance == 0 && (
                              <TouchableOpacity
                                onPress={() => {
                                  props.navigation.navigate(
                                    Routes.TOPUP_WALLET,
                                  );
                                }}>
                                <Text
                                  style={{
                                    fontSize: Typography.P4,
                                    fontFamily: fonts.RUBIK_MEDIUM,
                                    color: colors.activeColor,
                                    marginLeft: 12,
                                  }}>
                                  Top up
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          {/* Bank Transfer */}
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <RadioButton
                                color={colors.radioButtonActive}
                                uncheckedColor="#C0C0C0"
                                value="VA"
                                status={
                                  checked === 'VA' ? 'checked' : 'unchecked'
                                }
                                onPress={() => {
                                  setIsSelectedPaymentMethodError(false);
                                  setChecked('VA');
                                }}
                              />
                              <Text style={screenStyles.textPayment}>
                                Bank Transfer/E-Wallet
                              </Text>
                            </View>

                            {checked === 'VA' && (
                              <View
                                style={{
                                  width: '100%',
                                }}>
                                <DropDownItem
                                  defaultContainerStyle={{
                                    width: '100%',
                                    borderColor: '#d4d4d4',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    marginBottom: 5,
                                    backgroundColor: 'white',
                                  }}
                                  setSelected={val => {
                                    const bankId = val + 1;
                                    const paymentImage =
                                      bankData[val]?.value?.props.children[0]
                                        ?.props.source.uri;

                                    const paymentName =
                                      bankData[val]?.value?.props.children[1]
                                        ?.props.children;
                                    const paymentMethod =
                                      bankData[val]?.value?.props.children[2]
                                        ?.props.children;
                                    setData(prevData => ({
                                      ...prevData,
                                      paymentDetails: {
                                        paymentImage: paymentImage,
                                        paymentName: paymentName,
                                        paymentMethod: paymentMethod,
                                        bankId: bankId,
                                        paymentCode: bankData[val]?.data,
                                      },
                                    }));
                                    setIsPaymentMethodValue(val);
                                    setIsPaymentSelected(false);
                                  }}
                                  data={bankData}
                                  save={'key'}
                                  defaultOption={{
                                    key: -1,
                                    value: MyComponent,
                                  }}
                                />
                                {isPaymentSelected && (
                                  <Text style={{ color: 'red' }}>
                                    Please select bank transfer/e-wallet
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>
                          {/* COD */}
                          {!isInterIsLand && (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <RadioButton
                                color={colors.radioButtonActive}
                                uncheckedColor="#C0C0C0"
                                value="Cash On Delivery"
                                status={
                                  checked === 'Cash On Delivery'
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                onPress={() => {
                                  setIsSelectedPaymentMethodError(false);
                                  setChecked('Cash On Delivery');
                                }}
                              />
                              <Text style={screenStyles.textPayment}>
                                Cash On Delivery
                              </Text>
                            </View>
                          )}
                          {isSelectedPaymentMethodError && (
                            <Text
                              style={{
                                color: 'red',
                                marginBottom: 8,
                                marginTop: -6,
                              }}>
                              Please select payment method
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    {/* --------------------Payment method End-------------------------------------------------- */}

                    {/* --------------------Carbon click banners-------------------------------------------------- */}

                    {renderPromotionSlider()}

                    {/* --------------------fare Details-------------------------------------------------- */}

                    <View>
                      <Text style={screenStyles.headerText}>Fare Details</Text>

                      <View style={screenStyles.Box}>
                        <View>
                          {/* <View style={screenStyles.Box1}>
                            <Text style={screenStyles.subtotalLabelText}>
                              Distance
                            </Text>
                            <Text style={screenStyles.subtotalValueText}>
                              {distance}
                            </Text>
                          </View> */}

                          {isInterIsLand && (
                            <View style={screenStyles.Box1}>
                              <Text style={screenStyles.subtotalLabelText}>
                                Shipping Cost
                              </Text>
                              <Text style={screenStyles.subtotalValueText}>
                                Rp.{' '}
                                {formatNumberWithCommas(
                                  interIsLandShippingCost,
                                )}
                              </Text>
                            </View>
                          )}

                          {isInterIsLand && (
                            <View style={screenStyles.Box1}>
                              <Text style={screenStyles.subtotalLabelText}>
                                Warehouse Fee
                              </Text>
                              <Text style={screenStyles.subtotalValueText}>
                                Rp. {formatNumberWithCommas(warehouseFee)}
                              </Text>
                            </View>
                          )}

                          {deliveryIn === 1 && (
                            <View>
                              <View style={screenStyles.Box1}>
                                <Text style={screenStyles.subtotalLabelText}>
                                  Delivery Fee
                                </Text>
                                <Text style={screenStyles.subtotalValueText}>
                                  Rp. {formatNumberWithCommas(fare)}
                                </Text>
                              </View>

                              {coldStorageFee != 0 &&
                                coldStorageFee != undefined && (
                                  <View style={screenStyles.Box1}>
                                    <Text
                                      style={screenStyles.subtotalLabelText}>
                                      Cold Storage Fee
                                    </Text>
                                    <Text
                                      style={screenStyles.subtotalValueText}>
                                      Rp.{' '}
                                      {formatNumberWithCommas(coldStorageFee)}
                                    </Text>
                                  </View>
                                )}

                              <View style={screenStyles.Box1}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text style={screenStyles.subtotalLabelText}>
                                    Application + Environmental Fee
                                  </Text>
                                  <TouchableOpacity onPress={() => { }}>
                                    <Tooltip
                                      popover={
                                        <Text
                                          style={{
                                            color: colors.activeColor,
                                            fontSize: 11,
                                          }}>
                                          With each order, users directly
                                          contribute to supporting environmental
                                          initiative managed by CarbonClick. For
                                          more information, click on the banner
                                          above.
                                        </Text>
                                      }
                                      backgroundColor="#d4eeff"
                                      overlayColor="transparent"
                                      height={80}
                                      width={280}
                                      containerStyle={{
                                        borderRadius: 8,
                                        elevation: 5,
                                      }}>
                                      <SvgIcon
                                        type={IconNames.Info}
                                        width={17}
                                        height={17}
                                        style={{ marginLeft: 3 }}
                                      />
                                    </Tooltip>
                                  </TouchableOpacity>
                                </View>

                                <Text style={screenStyles.subtotalValueText}>
                                  Rp. {environmentalFee + applicationFee}
                                </Text>
                              </View>
                            </View>
                          )}

                          {deliveryIn === 2 && (
                            <View>
                              {/* <View
                                style={screenStyles.Box1}>
                                <Text style={screenStyles.subtotalLabelText}>Rate selected</Text>
                                <Text style={screenStyles.subtotalValueText}>{optionId == 1 ? "Cheapest" : "Fastest"}</Text>
                              </View> */}
                              <View style={screenStyles.Box1}>
                                <Text style={screenStyles.subtotalLabelText}>
                                  Delivery Fee
                                  {/* {optionId == 1 ? '(Cheapest)' : '(Fastest)'} */}
                                </Text>
                                <Text style={screenStyles.subtotalValueText}>
                                  Rp. {formatNumberWithCommas(totalKgCost)}
                                </Text>
                              </View>

                              {coldStorageFee != 0 &&
                                coldStorageFee != undefined && (
                                  <View style={screenStyles.Box1}>
                                    <Text
                                      style={screenStyles.subtotalLabelText}>
                                      Cold Storage Fee
                                    </Text>
                                    <Text
                                      style={screenStyles.subtotalValueText}>
                                      Rp.{' '}
                                      {formatNumberWithCommas(coldStorageFee)}
                                    </Text>
                                  </View>
                                )}

                              {/* <View style={screenStyles.Box1}>
                                <Text style={screenStyles.subtotalLabelText}>
                                  Application Fee
                                  
                                </Text>
                                <Text style={screenStyles.subtotalValueText}>
                                  Rp. {formatNumberWithCommas(applicationFee)}
                                </Text>
                              </View> */}

                              {/* <View style={screenStyles.Box1}>
                                <Text style={screenStyles.subtotalLabelText}>
                                  Application
                                </Text>
                                <Text style={screenStyles.subtotalValueText}>
                                  Rp. {formatNumberWithCommas(applicationFee)}
                                </Text>
                              </View> */}
                              <View style={screenStyles.Box1}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text style={screenStyles.subtotalLabelText}>
                                    Application + Environmental Fee
                                  </Text>
                                  <TouchableOpacity onPress={() => { }}>
                                    <Tooltip
                                      popover={
                                        <Text
                                          style={{
                                            color: colors.activeColor,
                                            fontSize: 11,
                                          }}>
                                          With each order, users directly
                                          contribute to supporting environmental
                                          initiative managed by CarbonClick. For
                                          more information, click on the banner
                                          above.
                                        </Text>
                                      }
                                      backgroundColor={colors.toolTipBg}
                                      overlayColor="transparent"
                                      height={80}
                                      width={280}
                                      containerStyle={{
                                        borderRadius: 8,
                                        elevation: 5,
                                      }}>
                                      <SvgIcon
                                        type={IconNames.Info}
                                        width={17}
                                        height={17}
                                        style={{ marginLeft: 3, }}
                                        color={colors.activeColor}
                                      />
                                    </Tooltip>
                                  </TouchableOpacity>
                                </View>

                                <Text style={screenStyles.subtotalValueText}>
                                  Rp.{' '}
                                  {formatNumberWithCommas(
                                    environmentalFee + applicationFee,
                                  )}
                                </Text>
                              </View>
                            </View>
                          )}

                          <View
                            style={[screenStyles.divider, { marginTop: 8 }]}
                          />

                          {deliveryIn === 1 && (
                            <View style={screenStyles.Box1}>
                              <Text style={screenStyles.totalLabelText}>
                                Total Amount
                              </Text>
                              <Text
                                style={[
                                  screenStyles.totalValueText,
                                  { color: colors.activeColor },
                                ]}>
                                Rp.{' '}
                                {formatNumberWithCommas(
                                  fare +
                                  applicationFee +
                                  environmentalFee +
                                  coldStorageFee,
                                )}
                              </Text>
                            </View>
                          )}

                          {deliveryIn === 2 && (
                            <View style={screenStyles.Box1}>
                              <Text style={screenStyles.totalLabelText}>
                                Total Amount
                              </Text>
                              <Text
                                style={[
                                  screenStyles.totalValueText,
                                  { color: colors.activeColor },
                                ]}>
                                Rp.{' '}
                                {formatNumberWithCommas(
                                  applicationFee +
                                  totalKgCost +
                                  environmentalFee +
                                  coldStorageFee +
                                  (isInterIsLand ? warehouseFee : 0) +
                                  (isInterIsLand
                                    ? interIsLandShippingCost
                                    : 0),
                                )}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
            <View style={{ marginBottom: 0 }}>
              {/* --------------------Continue Button-------------------------------------------------- */}
              {pickupAddress === '' || dropOffAddress === '' ? (
                <Text></Text>
              ) : (
                ButtonName == 'Make Payment' && (
                  <AppButton
                    title={t(ButtonName)}
                    // disabled={isButtonDisable}
                    loader={isLoading}
                    onPress={() => {
                      handleValidationForLocal();
                    }}
                  />
                )
              )}
            </View>
            {modalVisible && (
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={screenStyles.centeredView}>
                  <View style={screenStyles.modalView}>
                    <Text style={screenStyles.modalTitleText}>
                      {minutes > 0 || (minutes === 0 && second > 0)
                        ? 'Transaction Request'
                        : data?.checkTransactionStatus == '00'
                          ? 'Transaction Request'
                          : 'Transaction Request Failed'}
                    </Text>
                    <Text style={screenStyles.modalSubTitleText}>
                      {minutes > 0 || (minutes === 0 && second > 0)
                        ? "Transaction is begin processed, please wait.. don't tap back or exit app."
                        : data?.checkTransactionStatus == '00'
                          ? "Transaction is begin processed, please wait.. don't tap back or exit app."
                          : 'Please tap on retry to generate new virtual code.'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        justifyContent: 'flex-end',
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.RUBIK_REGULAR,
                          fontSize: Typography.P3,
                          color: colors.headingColor,
                        }}>
                        Pay Before
                      </Text>

                      <Text
                        style={{
                          fontFamily: fonts.RUBIK_REGULAR,
                          fontSize: Typography.P3,
                          color: colors.white,
                          backgroundColor: 'red',
                          marginLeft: 6,
                          paddingHorizontal: 6,
                          borderRadius: 8,
                          alignSelf: 'center',
                        }}>{`${minutes.toString().padStart(2, '0')}:${second
                          .toString()
                          .padStart(2, '0')}`}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#d4d4d4',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: 'white',
                      }}>
                      <View style={{ flex: 2 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            source={{
                              uri: `${data?.paymentDetails?.paymentImage}`,
                            }}
                            style={{ width: 68, height: 18 }}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              fontFamily: fonts.RUBIK_REGULAR,
                              fontSize: Typography.P3,
                              color: colors.headingColor,
                            }}>
                            {data?.paymentDetails?.paymentName +
                              ' ' +
                              data?.paymentDetails?.paymentMethod}{' '}
                          </Text>
                        </View>

                        <Text
                          style={{
                            fontFamily: fonts.RUBIK_REGULAR,
                            fontSize: Typography.P3,
                            color:
                              minutes > 0 || (minutes === 0 && second > 0)
                                ? colors.headingColor
                                : data?.checkTransactionStatus == '00'
                                  ? colors.activeColor
                                  : colors.red,
                          }}>
                          {minutes > 0 || (minutes === 0 && second > 0)
                            ? data.PaymentRefNumber
                            : data?.checkTransactionStatus == '00'
                              ? 'Transaction success'
                              : 'Transaction failed,Please retry'}
                        </Text>
                      </View>

                      {data?.checkTransactionStatus !== '00' && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              // console.log('sadddddddddddddddddddddd');
                              // var content = await Clipboard.getString();
                              if (
                                minutes > 0 ||
                                (minutes === 0 && second > 0)
                              ) {
                                Clipboard.setString(data.PaymentRefNumber);
                                ToastAndroid.show(
                                  `Transaction id has been copied ${data.PaymentRefNumber}`,
                                  ToastAndroid.SHORT,
                                );
                              } else {
                                //reset time
                                setMinutes(PaymentInterval);
                                getTransactionReqId();
                                updateStateForStart(true);
                              }
                            }}>
                            <View
                              style={{
                                borderColor: colors.activeColor,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                borderRadius: 6,
                                backgroundColor: colors.bannerBlueSecondary,
                                paddingHorizontal: 16,
                                paddingVertical: 6,
                                flexDirection: 'row',
                              }}>
                              <SvgIcon
                                type={
                                  minutes > 0 || (minutes === 0 && second > 0)
                                    ? IconNames.Copy
                                    : IconNames.RotateRight
                                }
                                width={18}
                                height={18}
                                color={colors.primaryGreenColor}
                              />
                              <Text
                                style={{
                                  fontFamily: fonts.RUBIK_MEDIUM,
                                  fontSize: Typography.P2,
                                  color: colors.activeColor,
                                  marginLeft: 6,
                                }}>
                                {minutes > 0 || (minutes === 0 && second > 0)
                                  ? 'Copy'
                                  : 'Retry'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        );
      }}
    />
  );
};
