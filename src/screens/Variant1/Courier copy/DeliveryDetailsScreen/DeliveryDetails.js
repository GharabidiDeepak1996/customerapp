import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  ToastAndroid,
  useColorScheme,
  View,
  Alert,
  BackHandler,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';

import { Tooltip } from 'react-native-elements';
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
} from '../../../../apis/services';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';

import MapView, { Marker, Polyline } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import AppButton from '../../../../components/Application/AppButton/View';
import { useTranslation } from 'react-i18next';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Picker } from '@react-native-picker/picker';
import { formatNumberWithCommas } from '../../../../utils/FormatNumberWithCommas';
import { RadioButton } from 'react-native-paper';
import Globals from '../../../../utils/Globals';
import Clipboard from '@react-native-clipboard/clipboard';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const RIDEDETAILS = props => {
  let time, interval;

  const mapViewRef = useRef(null);
  const [isDropOffClicked, setIsDropOffClicked] = useState(false);
  const { t, i18n } = useTranslation();

  const [isContinueClicked, setIsContinueClicked] = useState(false);

  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  let PaymentInterval = useSelector(state => state.dashboard.PaymentInterval); //deepak add

  const [senderName, setSenderName] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [ButtonName, setButtonName] = useState('Continue');
  const [senderMobile, setSenderMobile] = useState(false);
  const [province, setProvince] = useState([]);
  const [showSubDistrict, setShowSubDistrict] = useState(false);
  const [locationID, setLocationID] = useState('');
  const [checked, setChecked] = useState('');
  const [balance, setBalance] = useState(0);
  const [second, SetSecond] = useState(0);
  const [minutes, setMinutes] = useState(PaymentInterval); //deepak add
  //package details
  const [quantity, setQuantity] = useState();
  const [weight, setWeight] = useState();
  const [totalCost, setTotalCost] = useState();

  const MaxSendDistance = useSelector(
    state => state.dashboard.MaximumSendDistance,
  );

  const [weightOfSingleItem, setWeightOfSingleItem] = useState();
  const [totalCostOfSingleItem, setTotalCostOfSingleItem] = useState();

  // const [pickupLat, setPickupLat] = useState(0);
  // const [pickupLng, setPickupLng] = useState(0);

  // const [dropOffLat, setDropOffLat] = useState(0);
  // const [dropOffLng, setDropOffLng] = useState(0);
  const [data, setData] = useState({});
  const [recipientName, setRecipientName] = useState('');
  const [recipientMobile, setRecipientMobile] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [dimensionsDropdown, setDimensionsDropdown] = useState([]);
  const [typesOfGoodsData, setTypesOfGoodsData] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSelectedPaymentMethodError, setIsSelectedPaymentMethodError] =
    useState(false);

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const pickup = props.route.params.pickupAddress || '';
  const dropOffAddress = props.route.params.dropOffAddress || '';
  const pickupAddressId = props.route.params.idp || '';
  const dropoffAddressId = props.route.params.idd || '';
  const subDistrictTitle = props.route.param?.subDistrict || '';

  const subDistrictIdPickUp = props.route.params.subDistrictIdPickUp || 0;

  const idp = props.route.params.idp;

  const idd = props.route.params.idd;

  const categoryTypeId = props.route.params.categoryTypeId || '';
  const addressIdCustomer = useSelector(
    state => state.addressReducer.defaultAddressID,
  );

  const pickupLat = props.route.params.pickupLat || 0;
  const pickupLng = props.route.params.pickupLng || 0;

  const dropOffLat = props.route.params.dropOffLat || 0;
  const dropOffLng = props.route.params.dropOffLng || 0;
  const pickupLocation = { latitude: pickupLat, longitude: pickupLng };
  const dropOffLocation = { latitude: dropOffLat, longitude: dropOffLng };
  const [distance, setDistance] = useState(0);
  const [distanceInMeters, setDistanceInMeters] = useState(0);
  const [eta, setEta] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [bannersCarbonClick, setBannersCarbonClick] = useState([]);

  const [isSenderNameError, setIsSenderNameError] = useState(false);
  const [isSenderMobileError, setIsSenderMobileError] = useState(false);
  const [isPaymentMethodValue, setIsPaymentMethodValue] = useState(0);
  const [isPaymentSelected, setIsPaymentSelected] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [merchantOrderId, setMerchantOrderId] = useState(
    String(Math.floor(100000 + Math.random() * 900000)),
  );
  let inputRef = useRef();
  const _carousel = useRef();

  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  const paymentMethodDropdown = [{ key: '1', value: 'Cash on delivery' }];

  const getDimensions = async () => {
    try {
      const data = await ProductService.getDimensionForSend();
      if (data?.data?.isSuccess) {
        console.log('dattaa', data?.data?.payload);
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

  const getTypesOfGoods = async () => {
    try {
      const data = await ProductService.getTypesOfGoodsForSend();
      if (data?.data?.isSuccess) {
        console.log('getTypesOfGoodsForSend--------', data?.data?.payload);
        let newArray = data.data.payload.map(item => {
          return { key: item.id, value: item.name, weight: item.weight };
        });
        setTypesOfGoodsData(newArray);
      } else {
        setTypesOfGoodsData(null);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthService.getLocationId(deliveryIn);

        console.log('responseeee', deliveryIn);

        if (response?.data?.isSuccess) {
          const foundLocation = response.data.payload.find(
            item =>
              item.districtName.toLowerCase() ===
              subDistrictTitle.toLowerCase() ||
              item.subDistrictName.toLowerCase() ===
              subDistrictTitle.toLowerCase(),
          );

          console.log('foundLocation====>', foundLocation);
          if (foundLocation) {
            // getRateFunc(foundLocation.locationId);
            setLocationID(foundLocation.locationId);
          } else {
            setShowSubDistrict(true);
          }

          setProvince(response.data.payload);
        } else {
          console.log('responseeee_falseeee', response.data);
          ToastAndroid.show(response?.data.message);
        }
      } catch (error) {
        console.log('Error in Ride:', error);
        ToastAndroid.show(
          'An error occurred while registering: ' + error.message,
          ToastAndroid.LONG,
        );
      }
    };

    fetchData();
  }, [deliveryIn, subDistrictTitle]);

  useEffect(() => {
    (async () => {
      const userName = await AsyncStorage.getItem('displayName');
      const phone = await AsyncStorage.getItem('phoneNo');

      setName(userName);
      setMobile(phone);
    })();
    console.log(
      '========================================================',
      deliveryIn,
    );
  }, []);

  useEffect(() => {
    checkWalletBal();
    getBank();
    getCarbonClickBanners();

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

  // useEffect(() => {

  //   if (
  //     pickupLat != 0 &&
  //     pickupLng != 0 &&
  //     dropOffLat != 0 &&
  //     dropOffLng != 0 &&
  //     subDistrictIdPickUp != 0
  //   ) {
  //     getRateFunc();
  //   }

  // }, [pickupLat, pickupLng, dropOffLat, dropOffLng, subDistrictIdPickUp]);

  const getRateFunc = async (subDistrictIdPickUp, meterinDistance) => {
    let body = {
      deliveryOptionId: deliveryIn,
      categoryTypeId: categoryTypeId,
      customerlatitude: pickupLat,
      customerlongitude: pickupLng,
      partnerList: [],
      dimensionId: 0,
      pickUplatitude: pickupLat,
      pickUplongitude: pickupLng,
      dropOfflatitude: dropOffLat,
      dropOfflongitude: dropOffLng,
      locationId: subDistrictIdPickUp,
      distance: meterinDistance / 1000,
    };

    console.log('boooooooooooody========>', body);

    try {
      const dataa = await ProductService.getRate(body);

      if (dataa.data.isSuccess) {
        let item = dataa.data.payload;
        console.log('resssppoonnsseee========>', item);
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
            environmentalFee: item?.environmentalFee,
          }));
          ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        } catch (err) {
          ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        }
      } else {
        ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
      }
    } catch (error) { }
  };
  const MyComponent = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ marginLeft: 5 }}>Select bank transfer/e-waller</Text>
      </View>
    );
  };
  useEffect(() => {
    time = setInterval(() => {
      if (second === 0) {
        if (minutes === 0) {
          clearInterval(time); // Countdown finished, clear interval
        } else {
          setMinutes(minutes - 1);
          SetSecond(59);
        }
      } else {
        SetSecond(second - 1);
      }
    }, 1000);

    return () => clearInterval(time); // Cleanup interval on component unmount
  }, [minutes, second]);

  const handleBookDelivery = async () => {
    var date = new Date().toLocaleString();
    const getUserId = await AsyncStorage.getItem('userId');

    let distanceInKM = 0;
    let distanceString = distance;

    if (distanceString == 0) {
      distanceInKM = 0;
    } else {
      // let numericString = distanceString.replace(/[^0-9]/g, '');
      // const numericValue = parseFloat(distanceString.replace(/[^\d\.]/g, ''));
      // distanceInKM = parseInt(numericValue);
      const numericValue = parseFloat(distanceString.replace(/[^0-9.]/g, ''));
      distanceInKM = numericValue;
      console.log('44444444444444', numericValue);
    }

    let body = {
      orderDate: date,
      orderTypeId: categoryTypeId,
      orderStatusId: 2,
      deliveryOptionId: deliveryIn,
      customerId: getUserId, //userId
      customerName: name,
      customerPhoneNo: mobile,
      customerAddressId: addressIdCustomer || 0,
      senderDeliveryMethodId: 0, //use in intercity/ interIsland
      receiverShippingMethodId: 0, //use in intercity/ interIsland
      totalQty: 0, //check whether if its ride
      promoCode: '',
      promoDiscount: 0,

      totalAmount:
        data?.serviceFee +
        data?.shippingFee +
        data?.weightFee +
        data?.applicationFee +
        data?.environmentalFee || 0,
      totalDiscount: 0,
      serviceFee: data?.serviceFee || 0,
      shippingFee: data?.shippingFee || 0,
      weightFee: data?.weightFee || 0,

      levyFee: data?.levyFee || 0,
      insuranceFee: data?.insuranceFee || 0,
      warehouseServiceFee: data?.warehouseServiceFee || 0,
      wasliDeliveryFee: data?.wasliDeliveryFee || 0,
      deliveryInstruction: '',

      pickupAddressId: idp, //Ride and sender , it routing this data to another screen?
      dropoffAddressId: idd, //Ride and sender
      //totalDistance: parseInt(distance, 10), //Ride and sender
      totalDistance: distanceInKM, //Ride and sender
      passengerName: data?.senderName || '', //Ride
      passengerPhoneNo: data?.senderPhone || '', //Ride
      pickupNote: '', //Ride

      senderName: '', //Sender common
      senderPhoneNo: '', //Sender commmon
      receipientName: '', //Sender common
      receipientPhoneNo: '', //Sender common
      packageName: '', //Sender local
      dimensionId: 0, //Sender local
      sendTypeId: 0, //Sender intercity
      packageQty: 0, //Sender intercity
      packageImage: '', //Sender common
      packageWeight: '', //Sender intercity
      packageNote: '', //Sender common

      paymentMethodId: data?.paymentMethod,
      paymentAmount:
        data?.serviceFee + data?.shippingFee + data?.weightFee || 0,
      transactionId: 'xxxxxx',
      accountNo: '',
      file: '',
      paymentStatusId: 1,
      note: checked,
      orderDetails: [],
      TransactionId:
        checked == 'VA' ? await AsyncStorage.getItem('PaymentReference') : ' ',
      PaymentTypeId: 1,
      paymentMethod: checked,
      TransactionTypeId: 2,
      bankId: 'VA' ? data?.paymentDetails?.bankId : 0,
      applicationFee: data?.applicationFee,
      environmentalFee: data?.environmentalFee,
      coldStorageFee: 0,
    };

    console.log(
      '=================handleBookDelivery===BODY===================',
      body,
    );

    try {
      setLoading(true);
      const data = await ProductService.getCartCheckOut(body, categoryTypeId);
      setLoading(false);
      if (data.data.isSuccess) {
        clearInterval(time);
        setIsOrderPlaced(true);
        try {
          Alert.alert(
            'Ride booked successfully.',
            'Please continue to track order',
            [
              {
                text: 'Continue',
                onPress: () => {
                  console.log(
                    '=================handleBookDelivery-alert======================',
                  );

                  setModalVisible(false);
                  //   props.navigation.dispatch(
                  //     CommonActions.reset({
                  //         index: 1,
                  //         routes: [{name: Routes.HOME_VARIANT2}],
                  //     }),
                  // );
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
        setIsOrderPlaced(false);

        ToastAndroid.show(
          'Something went wrong, please try again later..',
          ToastAndroid.LONG,
        );
        console.log('Ride-Booking-response-------', data?.data);
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
          leg.distance.value + '---------' + leg.distance.text,
        );
        if (
          (leg.distance.value < 1000 ||
            leg.distance.value > MaxSendDistance * 1000) &&
          deliveryIn === 1
        ) {
          Alert.alert(
            `Pick-up and drop locations are too ${leg.distance.value < 1000
              ? 'near'
              : leg.distance.value > MaxSendDistance * 1000
                ? 'far'
                : ''
            }  (${leg.distance.text})`,
            `Local delivery accepts orders within ${MaxSendDistance} Km of radius only`,
            [
              {
                text: 'Ok',
                onPress: () => {
                  props.navigation.goBack();

                  //this.props.navigation.goBack({key: 'EditCover'});
                  // this.props.navigation.goBack({routeName: 'EditCover'});
                },
                style: 'cancel',
              },
            ],
          );
        } else {
          getRateFunc(subDistrictIdPickUp, leg.distance.value);
          setDistance(leg.distance.text);
          setDistanceInMeters(leg.distance.value);
          setEta(leg.duration.text);
        }
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    if (deliveryIn === 1) {
      getDimensions();
    } else {
      getTypesOfGoods();
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
      //getRateFunc(subDistrictIdPickUp);
    }

    //console.log('pickup valueeesss---------', pickupLocation, dropOffLocation);
    // if (pickupLocation && dropOffLocation) {
    //   getRateFunc(subDistrictIdPickUp);
    //   // console.log(
    //   //   'pickup valueeesss---------',
    //   //   pickupLocation,
    //   //   dropOffLocation,
    //   // );
    // }
  }, [pickupLocation, dropOffLocation]);

  const handleValidation = async () => {
    //return false;
    console.log('SENDERNAME-=-=-=-=-=-=-', data.senderPhone);
    if (data.senderName === '' || data.senderName === undefined) {
      console.log('senderName');
      setIsSenderNameError(true);
      return false;
    } else if (data.senderPhone === undefined || data.senderPhone === '') {
      console.log('senderPhone');
      setIsSenderMobileError(true);
      return false;
    }
    //  else if (data.senderPhone.length < 10) {
    //   console.log('senderPhone');
    //   setIsSenderMobileError(true);
    //   return false;
    // }
    else if (checked == '') {
      setIsSelectedPaymentMethodError(true);
    } else if (isPaymentMethodValue == -1 && checked === 'VA') {
      setIsPaymentSelected(true);
      return false;
    } else {
      if (checked == 'Cash On Delivery') {
        handleBookDelivery();
      } else if (checked == 'Wallet') {
        if (
          balance > 0 &&
          balance >=
          (data?.serviceFee + data?.shippingFee + data?.weightFee || 0)
        ) {
          // call Api for update wallet balance
          handleBookDelivery();
        } else {
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
      } else if (checked == 'VA') {
        if (
          (data?.serviceFee +
            data?.shippingFee +
            data?.weightFee +
            data?.applicationFee +
            data?.environmentalFee || 0) > 10000
        ) {
          setModalVisible(true);
          getTransactionReqId();
          callApi();
        } else {
          ToastAndroid.show('Minimum Payment 10000 IDR', ToastAndroid.LONG);
        }
      }
    }
    // } else {
    //   if (deliveryIn === 1) {
    //     handleBookDelivery();
    //     return true;
    //   }
    // }
  };

  const callApi = () => {
    interval = setInterval(checkTransactionStatus, 5000);

    return () => clearInterval(interval);
  };

  const checkTransactionStatus = async () => {
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

    console.log('checkTransStatus====', body);

    const response = await PaymentService.getCheckTransactionStatus(
      body,
      merchantOrderId,
    );
    console.log('checkTransStatusresponse====', response?.data);

    if (response?.data?.isSuccess) {
      if (response?.data?.payload?.statusCode == '01') {
        //process show loader
        setData(prevData => ({
          ...prevData,
          checkTransactionStatus: '01',
        }));
      } else if (response?.data?.payload?.statusCode == '00') {
        //success
        console.log(
          '000000000000000000000000000000checkTransactionStatus',
          response?.data?.payload?.statusCode,
        );
        // useRef

        clearInterval(time);
        clearInterval(interval);
        setMinutes(0);
        SetSecond(0);
        setData(prevData => ({
          ...prevData,
          checkTransactionStatus: '00',
        }));

        if (!isOrderPlaced) {
          handleBookDelivery();
        }
      } else if (response?.data?.payload?.statusCode == '02') {
        //failer
        setData(prevData => ({
          ...prevData,
          checkTransactionStatus: '02',
        }));
      }
    }
  };

  const getTransactionReqId = async () => {
    let body = {
      paymentAmount: String(
        data?.serviceFee +
        data?.shippingFee +
        data?.weightFee +
        data?.applicationFee +
        data?.environmentalFee || 0,
      ),
      paymentMethod: data?.paymentDetails.paymentCode,
      merchantOrderId: merchantOrderId,
      productDetails: '',
      additionalParam: '',
      merchantUserInfo: '',
      customerVaName: data?.senderName,
      email: '',
      phoneNumber: data?.senderPhone,
      itemDetails: [
        // {
        //   name: packageName,
        //   price: totalKgCost,
        //   quantity: packageQty
        // },
      ],
      customerDetail: {
        firstName: data?.senderName,
        lastName: '',
        email: '',
        phoneNumber: data?.senderPhone,
        billingAddress: {
          firstName: data?.senderName,
          lastName: '',
          address: 'Jl. Kembanga',
          city: 'Jakarta',
          postalCode: String(11530),
          phone: data?.senderPhone,
          countryCode: String(91),
        },
        shippingAddress: {
          firstName: data?.senderName,
          lastName: '',
          address: 'Jl. Kembangan Raya',
          city: 'Jakarta',
          postalCode: String(11530),
          phone: data?.senderPhone,
          countryCode: String(91),
        },
      },
      expiryPeriod: PaymentInterval, //deepak add
    };

    console.log('getTranscationIdBody----------------', body);

    const response = await PaymentService.getTranscationId(body);
    console.log('getTranscationIdResonse----------------', response?.data);
    if (response?.data?.isSuccess) {
      // setButtonName('Check Transaction');
      //bottomSheet open

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
      console.log(
        'getTranscationIdResonse----------------',
        response?.data.message,
      );
    }
  };

  const checkWalletBal = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const response = await PaymentService.checkWalletBalance(getUserId);

      if (response?.data?.isSuccess) {
        setBalance(response?.data?.payload);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const getBank = async () => {
    try {
      const response = await PaymentService.getBankDetails(
        data?.serviceFee + data?.shippingFee + data?.weightFee || 0,
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

  const getCarbonClickBanners = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
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
  return (
    <BaseView
      navigation={props.navigation}
      title={'Ride Details'}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                {/* --------------------Location Details start-------------------------------------------------- */}
                <Text style={screenStyles.headerText}>
                  {pickup === '' ? 'Select Location' : 'Location Details'}
                </Text>
                <View style={screenStyles.Box}>
                  {pickup === '' ? (
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate(Routes.My_AddressRide, {
                          isFromRide: true,
                          pickupAddress: '',
                          isPickupClicked: true,
                          isDropOffClicked: false,
                          isFromSend: false,
                        });
                      }}>
                      <View style={[screenStyles.innerBox, { marginBottom: 8 }]}>
                        <SvgIcon
                          type={IconNames.MapMarkerAlt}
                          width={20}
                          height={20}
                          color={colors.subHeadingColor}
                        />
                        <Text
                          style={{
                            marginStart: 10,
                            color: colors.subHeadingColor,
                          }}>
                          Set pickup location
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <View style={screenStyles.textLoc}>
                        <Text style={{ color: 'black' }}>Pickup from</Text>

                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate(Routes.My_AddressRide, {
                              isFromRide: true,
                              pickupAddress: '',
                              isPickupClicked: true,
                              isDropOffClicked: false,
                              isFromSend: false,
                            });
                          }}>
                          <Text
                            style={{
                              marginStart: 0,
                              color: colors.primaryGreenColor,
                              fontWeight: 'bold',
                            }}>
                            Change
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={[screenStyles.innerBox1, { marginBottom: 8 }]}>
                        {/* <SvgIcon
                        type={IconNames.MapMarkerAlt}
                        width={20}
                        height={20}
                        color={'#d4d4d4'}
                      /> */}
                        <Text style={{ color: 'black' }}>{pickup}</Text>
                      </View>
                    </View>
                  )}

                  {dropOffAddress === '' ? (
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate(Routes.My_AddressRide, {
                          isFromRide: true,
                          dropOffAddress: '',
                          isPickupClicked: false,
                          isDropOffClicked: true,
                          isFromSend: false,
                        });
                      }}>
                      <View style={screenStyles.innerBox}>
                        <SvgIcon
                          type={IconNames.MapMarkerAlt}
                          width={20}
                          height={20}
                          color={colors.subHeadingColor}
                        />
                        <Text
                          style={{
                            marginStart: 10,
                            color: colors.subHeadingColor,
                          }}>
                          Set delivery location
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <View style={screenStyles.textLoc}>
                        <Text style={{ color: 'black' }}>Deliver to</Text>

                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate(Routes.My_AddressRide, {
                              isFromRide: true,
                              dropOffAddress: '',
                              isPickupClicked: false,
                              isDropOffClicked: true,
                              isFromSend: false,
                            });
                          }}>
                          <Text
                            style={{
                              color: colors.primaryGreenColor,
                              fontWeight: 'bold',
                            }}>
                            Change
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={screenStyles.innerBox1}>
                        {/* <SvgIcon
                        type={IconNames.MapMarkerAlt}
                        width={20}
                        height={20}
                        color={'#d4d4d4'}
                      /> */}
                        <Text style={{ color: 'black' }}>{dropOffAddress}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* --------------------Location Details end-------------------------------------------------- */}

                {/* --------------------Map View Start-------------------------------------------------- */}

                {pickupLat === 0 ||
                  pickupLng === 0 ||
                  dropOffLat === 0 ||
                  dropOffLng === 0 ? (
                  <View></View>
                ) : (
                  <View
                    style={{
                      backgroundColor: 'red',
                      height: 200,
                      marginBottom: 28,
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
                      <MapViewDirections
                        origin={pickupLocation}
                        destination={dropOffLocation}
                        apikey={Globals.googleApiKey}
                        strokeWidth={3}
                        strokeColor="#000000"
                        optimizeWaypoints={true}
                      />
                    </MapView>

                    <View
                      style={[
                        screenStyles.mapContainer,
                        { backgroundColor: 'white', paddingVertical: 6 },
                      ]}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={screenStyles.textDis}>Distance</Text>

                        <Text
                          style={[
                            screenStyles.textDis,
                            {
                              fontFamily: fonts.RUBIK_MEDIUM,
                              fontSize: Typography.P4,
                              marginRight: 20,
                            },
                          ]}>
                          : {distance == 0 ? 'NA' : distance}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={screenStyles.textDis}>ETA</Text>

                        <Text
                          style={[
                            screenStyles.textDis,
                            {
                              fontFamily: fonts.RUBIK_MEDIUM,
                              fontSize: Typography.P4,
                            },
                          ]}>
                          : {eta == 0 ? 'NA' : eta}
                        </Text>
                      </View>
                    </View>
                    {/* <View
                      style={{
                        padding: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderColor: '#d4d4d4',
                        borderWidth: 1,
                      }}>
                      <View style={{ marginLeft: 16 }}>
                        <Text style={{ textAlign: 'center' }}>
                          Distance
                        </Text>
                        <Text
                          style={{
                            fontFamily: fonts.RUBIK_MEDIUM,
                            fontSize: Typography.P3,
                            color: colors.headingColor,
                            textAlign: 'center',
                          }}>
                          {distance == 0 ? 'NA' : distance}
                        </Text>
                      </View>
                      <View style={{ marginRight: 16 }}>
                        <Text style={{ textAlign: 'center' }}>ETA</Text>
                        <Text
                          style={{
                            fontFamily: fonts.RUBIK_MEDIUM,
                            fontSize: Typography.P3,
                            color: colors.headingColor,
                          }}>
                          {eta == 0 ? 'NA' : eta}
                        </Text>
                      </View>
                    </View> */}
                  </View>
                )}
                {/* --------------------Map View end-------------------------------------------------- */}

                {pickup === '' || dropOffAddress === '' ? (
                  <Text></Text>
                ) : (
                  <View>
                    {/* --------------------Sender Details-------------------------------------------------- */}
                    <View style={{ marginTop: 10 }}>
                      <Text style={[screenStyles.headerText]}>
                        Personal Details
                      </Text>

                      <View style={screenStyles.Box}>
                        <AppInput
                          textInputRef={r => (inputRef = r)}
                          leftIcon={IconNames.UserAlt}
                          containerStyle={[
                            screenStyles.inputText,
                            { marginBottom: 8 },
                          ]}
                          placeholder={'Enter name'}
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
                            Please enter name
                          </Text>
                        )}

                        <AppInput
                          textInputRef={r => (inputRef = r)}
                          leftIcon={IconNames.PhoneFlip}
                          containerStyle={screenStyles.inputText}
                          placeholder={'Enter mobile number'}
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
                          <Text style={{ color: 'red' }}>
                            Please enter mobile number
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
                    {/* --------------------Payment method Start-------------------------------------------------- */}
                    <View>
                      <Text style={screenStyles.headerText}>
                        Payment Method
                      </Text>

                      <View style={screenStyles.Box}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <RadioButton
                            color={colors.activeColor}
                            uncheckedColor="#C0C0C0"
                            value="Wallet"
                            status={
                              checked === 'Wallet' ? 'checked' : 'unchecked'
                            }
                            onPress={() => {
                              //getRateFunc(subDistrictIdPickUp);
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
                                props.navigation.navigate(Routes.TOPUP_WALLET);
                              }}>
                              <Text
                                style={{
                                  fontSize: Typography.P4,
                                  fontFamily: fonts.RUBIK_MEDIUM,
                                  color: colors.subHeadingSecondaryColor,
                                  marginLeft: 12,
                                }}>
                                Top up
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton
                              color={colors.activeColor}
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
                                  //getRateFunc(subDistrictIdPickUp);

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
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <RadioButton
                            color={colors.activeColor}
                            uncheckedColor="#C0C0C0"
                            value="Cash On Delivery"
                            status={
                              checked === 'Cash On Delivery'
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => {
                              //getRateFunc(subDistrictIdPickUp);

                              setIsSelectedPaymentMethodError(false);
                              setChecked('Cash On Delivery');
                            }}
                          />
                          <Text style={screenStyles.textPayment}>
                            Cash On Delivery
                          </Text>
                        </View>
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
                    {/* --------------------Payment method end-------------------------------------------------- */}
                    {/* --------------------Carbon click banners-------------------------------------------------- */}

                    {renderPromotionSlider()}

                    {/* --------------------fare Details-------------------------------------------------- */}
                    <View>
                      <Text style={screenStyles.headerText}>Fare Details</Text>

                      <View style={screenStyles.Box}>
                        <View>
                          <View style={screenStyles.Box1}>
                            <Text style={screenStyles.subtotalLabelText}>
                              Distance
                            </Text>
                            <Text style={screenStyles.subtotalValueText}>
                              {distance == 0 ? 'NA' : distance}
                            </Text>
                          </View>

                          <View style={screenStyles.Box1}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text style={screenStyles.subtotalLabelText}>
                                Fare
                              </Text>
                              <TouchableOpacity onPress={() => { }}>
                                <Tooltip
                                  popover={
                                    <Text
                                      style={{
                                        color: '#1b8346',
                                        fontSize: 11,
                                      }}>
                                      Service fee + Shipping fee
                                    </Text>
                                  }
                                  backgroundColor="#E5f2Eb"
                                  overlayColor="transparent"
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
                              Rp.{' '}
                              {data?.serviceFee === undefined
                                ? 0
                                : formatNumberWithCommas(
                                  data?.serviceFee +
                                  data?.shippingFee +
                                  data?.weightFee,
                                )}
                            </Text>
                          </View>

                          {/* <View style={screenStyles.Box1}>
                            <Text style={screenStyles.subtotalLabelText}>
                              Application Fee
                            </Text>
                            <Text style={screenStyles.subtotalValueText}>
                              Rp.
                              {formatNumberWithCommas(data?.applicationFee)}
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
                                        color: '#1b8346',
                                        fontSize: 11,
                                      }}>
                                      With each order, users directly contribute
                                      to supporting environmental initiative
                                      managed by CarbonClick. For more
                                      information, click on the banner above.
                                    </Text>
                                  }
                                  backgroundColor="#E5f2Eb"
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
                              Rp.{' '}
                              {formatNumberWithCommas(
                                data?.environmentalFee + data?.applicationFee,
                              )}
                            </Text>
                          </View>

                          <View
                            style={[screenStyles.divider, { marginTop: 8 }]}
                          />

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
                                data?.serviceFee === undefined
                                  ? 0
                                  : data?.serviceFee +
                                  data?.shippingFee +
                                  data?.weightFee +
                                  data?.applicationFee +
                                  data?.environmentalFee,
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View>
              {/* --------------------Continue Button-------------------------------------------------- */}
              {pickup === '' || dropOffAddress === '' ? (
                <Text></Text>
              ) : (
                <AppButton
                  title={t('Book Ride')}
                  // disabled={isButtonDisable}
                  loader={isLoading}
                  onPress={() => {
                    handleValidation();
                  }}
                />
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
