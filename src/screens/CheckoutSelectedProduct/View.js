import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Image,
  useColorScheme,
  ToastAndroid,
  Modal,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import { Styles } from './Styles';
import BaseView from '../BaseView';
import Config from '../../../branding/carter/configuration/Config';
import Routes from '../../navigation/Routes';
import { Divider, Text } from 'react-native-elements';
import AppButton from '../../components/Application/AppButton/View';
import { ProductService } from '../../apis/services/product';
import Globals from '../../utils/Globals';
import { CartItem } from '../../components/Application/CartItem/View';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AppHeader from '../../components/Application/AppHeader/View';
import { FocusAwareStatusBar } from '../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import AppConfig from '../../../branding/App_config';
import DropDownItem from '../../components/Application/DropDownItem/View';
import AppInput from '../../components/Application/AppInput/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import { AuthService } from '../../apis/services/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProducts,
  cartCount,
  clearProducts,
} from '../../redux/features/AddToCart/ProductSlice';
import { useTranslation } from 'react-i18next';
import { CustomDropDown } from '../../components/Application/CustomDropDown/View';
import {
  setDeliveryAddress,
  setDeliveryAddressId,
  setDeliveryIn,
  setDeliveryLat,
  setDeliveryLng,
} from '../../redux/features/Address/DefaultAddressSlice';
import { CommomService, PaymentService, ShopService } from '../../apis/services';
import { RadioButton } from 'react-native-paper';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import Clipboard from '@react-native-clipboard/clipboard';
import { Tooltip } from 'react-native-elements';
import { CommonAlert } from '../../utils/Alert';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
//import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

const CheckoutSelectedProduct = props => {
  //Transalation Language
  const { t, i18n } = useTranslation();

  const [bannersCarbonClick, setBannersCarbonClick] = useState([]);

  //props
  const {
    payload,
    categoryTypeId,
    totalAmt,
    totalWeight,
    totalDimensions,
    partnerLatitude,
    partnerLongitude,
    partnerSubDistrictId,
    coldStorageFee,
  } = props.route.params;

  //Style
  const { colors } = useTheme();
  const Fonts = AppConfig.fonts.default;
  const Typography = AppConfig.typography.default;
  const scheme = useColorScheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);
  const itemStyles = Styles(scheme, colors);

  //Redux
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);
  const cartCountQty = useSelector(state => state.product.cartCount);
  const addressIdCustomer = useSelector(
    state => state.addressReducer.defaultAddressID,
  );
  const deliveryAddress = useSelector(
    state => state.addressReducer.deliveryAddress,
  );
  const deliveryAddressId = useSelector(
    state => state.addressReducer.deliveryAddressId,
  );
  const defaultAddress = useSelector(
    state => state.addressReducer.defaultAddress,
  );
  const defaultAddressSubDistrictId = useSelector(
    state => state.addressReducer.defaultSubDistrictId,
  );

  let latSlice = useSelector(state => state.addressReducer.lat);
  let lngSlice = useSelector(state => state.addressReducer.lng);

  let deliveryLatSlice = useSelector(state => state.addressReducer.deliveryLat);
  let deliveryLngSlice = useSelector(state => state.addressReducer.deliveryLng);
  const MaxSendDistance = useSelector(
    state => state.dashboard.MaximumSendDistance,
  );
  let PaymentInterval = useSelector(state => state.dashboard.PaymentInterval); //deepak add

  //useState
  const [cartList, setCartList] = useState([]);
  const [paymentMth, setPaymentMth] = useState([]);
  const [second, SetSecond] = useState(0);
  const [minutes, setMinutes] = useState(PaymentInterval); //deepak add
  const [mobile, setMobile] = useState('');
  const [isCheckMobile, setCheckMobile] = useState(false);
  const [totalShipping, setTotalShipping] = useState('00');
  const [totalService, setTotalService] = useState('00');
  const [checked, setChecked] = useState('');
  const [checkedRates, setCheckedRates] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [merchantOrderId, setMerchantOrderId] = useState(
    String(Math.floor(100000 + Math.random() * 900000)),
  );
  const [isPaymentMethodValue, setIsPaymentMethodValue] = useState(0);
  const [isPaymentSelected, setIsPaymentSelected] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [name, setName] = useState('');
  const [errorUserName, setErrorUserName] = useState('');
  const [errorMobile, setErrorMobile] = useState('');
  const [isCheckUserName, setCheckUserName] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0); //subTotall
  const [isLoading, setLoading] = useState(false);
  const [dataRateFun, setDataRateFun] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isSelectedPaymentMethodError, setIsSelectedPaymentMethodError] =
    useState(false);
  //const [deliveryIn, setDeliveryIn] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isRateSelectedd, setisRateSelectedd] = useState(false);

  let time, interval;
  let inputRef = useRef();
  const scrollViewRef = useRef(null);
  let isRateSelected = useRef(0);
  const uniquePartnerNames = new Set();
  const _carousel = useRef();

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
  }, [minutes, second]); // Include minutes and second in dependency array

  useFocusEffect(
    React.useCallback(() => {
      //fetchDirections(); //deepak
      getBank();
      checkWalletBal();
      getCarbonClickBanners();
      (async () => {
        const userName = await AsyncStorage.getItem('displayName');
        const phone = await AsyncStorage.getItem('phoneNo');

        setName(userName);
        setMobile(phone);
      })();
    }, []),
  );

  useEffect(() => {
    console.log(
      'Again change addresss----',
      deliveryLatSlice + '-----' + deliveryLngSlice,
    );
    console.log('------------' + latSlice + '====' + lngSlice);

    // console.log("555555555", deliveryLatSlice + " " + deliveryLngSlice + "---" + latSlice + " " + lngSlice)
    if (deliveryLatSlice == 0 && deliveryLngSlice == 0) {
      dispatch(setDeliveryLat(latSlice));
      dispatch(setDeliveryLng(lngSlice));
    }

    if (deliveryLatSlice != 0 && deliveryLngSlice != 0) {
      //check if its local or multi-modal 12km or not
      fetchDirections();
      //check partner store is available for selected location
      if (categoryTypeId == 1) {
        getGroceryNearStore();
      } else if (categoryTypeId == 2) {
        getRestaurantNearStore();
      } else if (categoryTypeId == 5) {
        fetchCartedList();
      }
    } else {
      console.log('useEffect--deliveryLatSlice and deliveryLngSlice is zero');
    }
  }, [deliveryLatSlice, deliveryLngSlice]);

  const fetchDirections = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${partnerLatitude},${partnerLongitude}&destination=${latSlice},${lngSlice}&key=${Globals.googleApiKey}`,
      );

      const data = await response.json();

      if (data.status == 'ZERO_RESULTS') {
        //multi-modal
        //setDeliveryIn(2);
        dispatch(setDeliveryIn(2));
        setDistance(0);
        //fetchCartedList(2);
      }

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        setDistance(leg.distance.value);

        // Extract distance and duration information
        if (leg.distance.value > MaxSendDistance * 1000) {
          //setDeliveryIn(2);
          dispatch(setDeliveryIn(2));
          //fetchCartedList(2);
        } else {
          //setDeliveryIn(1);
          dispatch(setDeliveryIn(1));
          // if (leg.distance.value == 0) {
          //   alertForChooseDifferentStore();
          // } else {
          //   //fetchCartedList(1, leg.distance.value);
          // }
        }
      } else {
        console.error('Error fetching directions:::', data);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const getGroceryNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    let body = {
      latitude: deliveryLatSlice,
      longitude: deliveryLngSlice,
      userId: getUserId,
    };

    console.log('getGroceryNearStoreCheckout--Body', body);
    try {
      const responseNearShop = await ShopService.getGroceryNearShop(body);
      console.log(
        'getGroceryNearStoreCheckoutresponse----------',
        responseNearShop,
      );
      if (!responseNearShop.data.isSuccess) {
        //alertForNoServiceProvides();
        //if false - no service provide change address
        Alert.alert(
          'No Serviceable Stores',
          `We're sorry, but there are currently no serviceable stores in your area. Please change your delivery address.`,
          [
            {
              text: 'Ok',
              onPress: () => {
                dispatch(setDeliveryLat(0.0));
                dispatch(setDeliveryLng(0.0));
                dispatch(setDeliveryAddress(''));
                dispatch(setDeliveryAddressId(0));

                fetchDirections();
                //fetchCartedList(1);
              },
            },
          ],
        );
      } else {
        //if true - check validate product
        //if same address defaultAddress and deliverySlice
        // console.log("999999999999999999999999999", deliveryIn, distance)

        console.log(
          'validate product--',
          deliveryLatSlice +
          ' ' +
          deliveryLngSlice +
          '------' +
          latSlice +
          '  ' +
          lngSlice,
        );

        if (deliveryLatSlice == latSlice && deliveryLngSlice == lngSlice) {
          fetchCartedList();
        } else {
          validateProducts();
        }
      }
    } catch (error) {
      console.log('error==>', error);
    }
  };

  const getRestaurantNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      latitude: deliveryLatSlice,
      longitude: deliveryLngSlice,
      userId: getUserId,
    };
    console.log('getRestaurantNearStoreBody', body);
    try {
      const responseNearShop = await ShopService.getRestaurantNearShop(body);
      console.log(
        'oooooooooooooooooooooooooooooooooooooooo',
        responseNearShop.data,
      );

      if (!responseNearShop.data.isSuccess) {
        alertForNoServiceProvides();
        // responseNearShop.data.payload !== null &&
        //   setNearStore(responseNearShop.data.payload);
      } else {
        //if same address defaultAddress and deliverySlice
        if (deliveryLatSlice == latSlice && deliveryLngSlice == lngSlice) {
          console.log('fetchCartedList---------------------------6');
          fetchCartedList(1);
        } else {
          validateProducts();
        }
      }
    } catch (error) {
      console.log('error==>', error);
    }
  };

  const fetchCartedList = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');
      const data = await ProductService.getcartCountByStore(
        categoryTypeId,
        deliveryIn,
        getUserId,
      );

      if (data?.data?.isSuccess) {
        setFinalAmount(0); //pratik changes
        setCartList(data?.data?.payload);
        if (data?.data?.payload != null) {
          if (deliveryIn == 1) {
            getRateFunc(data?.data?.payload, distance, 1);
          } else if (deliveryIn == 2) {
            getRouteRate(data?.data?.payload);
          }

          data?.data?.payload.forEach(item => {
            setFinalAmount(val => {
              const valPirce = item.cartPrice;
              return (val += valPirce);
            });
          });

          console.log(
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            finalAmount,
          );
        }
      } else {
        setCartList(null);
        console.log('Errorlog-------------------------', data?.data);
      }
    } catch (error) {
      console.log('Errorlog-------------------------', error);
    }
  };

  const validateProducts = async () => {
    try {
      const idsToAdd = cartList.map(item => item.partnerId);
      console.log(
        'VALIIDAATTEE_PRODDUUCTTSS------------',
        idsToAdd +
        '------' +
        deliveryLatSlice +
        ' ' +
        deliveryLngSlice +
        '-------' +
        latSlice +
        ' ' +
        lngSlice,
      );

      let body = {
        partnerId: idsToAdd,
        latitude: latSlice,
        longitude: lngSlice,
      };

      console.log('validateproduct body-----', body);
      if (idsToAdd.length > 0) {
        const responseValidateProduct = await ProductService.getValidateProduct(
          body,
        );

        console.log('validateproduct response-----', responseValidateProduct);
        cartList.forEach((item, key) => {
          if (responseValidateProduct.data.isSuccess) {
            if (responseValidateProduct.data.payload.length > 0) {
              //setFinalAmount(0);
              try {
                const updatedCartList = cartList.filter(item =>
                  responseValidateProduct.data.payload.includes(item.partnerId),
                );
                setCartList(updatedCartList);
                getRateFunc(updatedCartList, 0, 1);

                updatedCartList.forEach((item, key) => {
                  setFinalAmount(val => {
                    console.log(
                      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                      val,
                    );
                    const valPirce = item.cartPrice;
                    return (val += valPirce);
                  });
                });
                alertForNoLongerProduct();
              } catch (error) {
                console.log('Error----', error);
              }
            } else {
              alertForNoServiceProvides();
            }
          }
        });
      }
    } catch (error) { }
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
          console.log('isSuccess false');
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
          autoplay
          autoplayInterval={5000}
          loop
        />
      </View>
    );
  };

  const cartCheckOut = async () => {
    try {
      if (name.length === 0) {
        setErrorUserName('Please enter name.');
        setCheckUserName(true);
        setLoading(false);
        return;
      }

      if (mobile.length === 0) {
        setErrorMobile('Please enter mobile number.');
        setCheckMobile(true);
        setLoading(false);
        return false;
      }

      if (deliveryIn == 2 && checkedRates == '') {
        setisRateSelectedd(true);
        return;
      }

      if (checked == '') {
        setIsSelectedPaymentMethodError(true);
        return;
      }

      if (isPaymentMethodValue == -1 && checked === 'VA') {
        setIsPaymentSelected(true);
        return;
      }

      if (checked == 'Wallet') {
        if (
          balance > 0 &&
          balance >=
          (deliveryIn == 1
            ? finalAmount +
            totalShipping +
            totalService +
            dataRateFun?.applicationFee +
            dataRateFun?.environmentalFee +
            (coldStorageFee && dataRateFun?.coldStorageFee)
            : deliveryIn == 2
              ? finalAmount +
              dataRateFun?.totalKgCost +
              dataRateFun?.applicationFee +
              dataRateFun?.environmentalFee +
              (coldStorageFee && dataRateFun?.coldStorageFee)
              : 0)
        ) {
          GroceryAndFoodPlaceOrder();
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
      }
      if (checked == 'Cash On Delivery') {
        GroceryAndFoodPlaceOrder();
      }

      if (checked == 'VA') {
        if (
          finalAmount +
          totalShipping +
          totalService +
          dataRateFun?.applicationFee +
          dataRateFun?.environmentalFee +
          (coldStorageFee && dataRateFun?.coldStorageFee) >
          10000
        ) {
          setModalVisible(true);
          getTransactionReqId();
          callApi();
        } else {
          ToastAndroid.show('Minimum Payment 10000 IDR', ToastAndroid.LONG);
        }
      }
      // if (selectedPayment == 0) {
      //   setLoading(false);
      //   setSetPaymentMode(true);
      //   //  scrollViewRef.current.scrollToFocusedInput();
      //   //scrollToBottom()
      //   return;
      // }
    } catch (erro) {
      console.log('Checkout====erro', erro);
      ToastAndroid.show(erro, ToastAndroid.LONG);
    }
  };

  const getBank = async () => {
    try {
      const response = await PaymentService.getBankDetails(finalAmount);
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
        finalAmount +
        totalShipping +
        totalService +
        (coldStorageFee && dataRateFun?.coldStorageFee) +
        dataRateFun?.applicationFee +
        dataRateFun?.environmentalFee,
      ),
      paymentMethod: dataRateFun?.paymentDetails.paymentCode,
      merchantOrderId: merchantOrderId,
      productDetails: '',
      additionalParam: '',
      merchantUserInfo: '',
      customerVaName: name,
      email: '',
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
        email: '',
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

    console.log('getTranscationIdResonse----------------', response?.data);
    if (response?.data?.isSuccess) {
      // setButtonName('Check Transaction');
      //bottomSheet open

      setDataRateFun(prevData => ({
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

  const getRateFunc = async (data, distance, deliveryInn) => {
    let arr = [];
    data?.map((item, key) => {
      return arr.push(item.partnerId);
    });

    console.log(
      'bodyCustomerRate====------------------------------>',
      distance,
    );
    let body = {
      deliveryOptionId:
        categoryTypeId == 1 || categoryTypeId == 2 ? 1 : deliveryIn,
      categoryTypeId: categoryTypeId,
      customerlatitude: latSlice,
      customerlongitude: lngSlice,
      partnerList: arr,
      dimensionId: 0,
      pickUplatitude: 0,
      pickUplongitude: 0,
      dropOfflatitude: 0,
      dropOfflongitude: 0,
      locationId: defaultAddressSubDistrictId,
      distance: distance == 0 || distance == undefined ? 0 : distance / 1000,
    };

    const partnerIdCounts = arr.reduce((acc, partner) => {
      acc[partner.partnerId] = (acc[partner.partnerId] || 0) + partner.size;
      return acc;
    }, {});

    try {
      const dataa = await ProductService.getRate(body);

      console.log('bodyCustomerRate====>', dataa.data.payload);

      if (dataa.data.isSuccess) {
        let item = dataa.data.payload;
        try {
          setDataRateFun(prevData => ({
            ...prevData,
            serviceFee: item?.serviceFee,
            shippingFee: item?.shippingFee,
            weightFee: item?.weightFee,
            wasliDeliveryFee: item?.wasliDeliveryFee,
            applicationFee: item?.applicationFee,
            warehouseServiceFee: item?.warehouseServiceFee,
            insuranceFee: item?.insuranceFee,
            totalAmount: item?.totalAmount,
            partnerRate: item?.partnerRate || [],
            environmentalFee: item?.environmentalFee,
            coldStorageFee: item?.coldStorageFee || 0,
          }));
          let totlShip = 0;
          let totlservice = 0;

          const uniquePartnerNamesss = new Set();

          //totlShipping
          setCartList(prevCartList => {
            return prevCartList?.map(cartItem => {
              const matchingPartnerRate = item?.partnerRate?.find(
                rateItem => rateItem.partnerId === cartItem.partnerId,
              );

              // // Use reduce to count occurrences of each partnerId
              // const partnerIdCounts = prevCartList.reduce((acc, log) => {
              //   const partnerId = log.partnerId;
              //   acc[partnerId] = (acc[partnerId] || 0) + 1;
              //   uniquePartnerId.add(acc);

              //   return acc;
              // }, {});

              // console.log("PartnerId Counts:", partnerIdCounts[0]);

              if (matchingPartnerRate) {
                //this for
                const uniquePartnerNamess = new Set(
                  prevCartList.map(item => item.partnerName),
                );

                if (uniquePartnerNamess.size > 1) {
                  if (!uniquePartnerNamesss.has(cartItem.partnerName)) {
                    uniquePartnerNamesss.add(cartItem.partnerName);
                    totlShip += matchingPartnerRate.shippingFee;
                  }
                } else {
                  totlShip = matchingPartnerRate.shippingFee;
                }

                // If a matching partnerRate is found, add the shippingFee to the cartItem
                setTotalShipping(totlShip);
                return {
                  ...cartItem,
                  shippingFee: matchingPartnerRate.shippingFee,
                };
              }

              return cartItem;
            });
          });
          // totlservice
          setCartList(prevCartList => {
            return prevCartList.map(cartItem => {
              const matchingPartnerRate = item?.partnerRate?.find(
                rateItem => rateItem.partnerId === cartItem.partnerId,
              );

              if (matchingPartnerRate) {
                const uniquePartnerNames = new Set(
                  prevCartList.map(item => item.partnerName),
                );

                if (uniquePartnerNames.size > 1) {
                  totlservice += matchingPartnerRate.serviceFee;
                } else {
                  totlservice = matchingPartnerRate.serviceFee;
                }

                // If a matching partnerRate is found, add the shippingFee to the cartItem
                setTotalService(totlservice);
                return {
                  ...cartItem,
                  serviceFee: matchingPartnerRate.serviceFee,
                };
              }

              return cartItem;
            });
          });

          // ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        } catch (err) {
          // ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
        }
      } else {
      }
    } catch (error) { }
  };

  const getRouteRate = async cartListt => {
    try {
      let body = {
        sourceLocationId: partnerSubDistrictId,
        destinationLocationId: defaultAddressSubDistrictId,
        Weight:
          Math.round(
            cartListt?.reduce(
              (totalWeight, item) => totalWeight + item.cartQty * item.weight,
              0,
            ),
          ) || 0,
      };

      const responseRouteRate = await CommomService.routeRate(body);

      if (responseRouteRate?.data.isSuccess) {
        // setRouteRate(responseRouteRate?.data.payload);

        setDataRateFun(prevData => ({
          ...prevData,
          applicationFee: responseRouteRate?.data?.payload?.applicationFee,
          environmentalFee: responseRouteRate?.data?.payload?.environmentalFee,
          coldStorageFee: responseRouteRate?.data?.payload?.coldStorageFee || 0,
          cheapestRate: responseRouteRate?.data?.payload?.cheapestRate,
          fastestRate: responseRouteRate?.data?.payload?.fastestRate,
        }));
        if (
          responseRouteRate?.data.payload.cheapestRate.routeId == 0 &&
          responseRouteRate?.data.payload.fastestRate.routeId == 0
        ) {
          Alert.alert(
            `Alert`,
            `Sorry, we currently do not service this location(s) `,
            [
              {
                text: 'ok',
                onPress: () => {
                  props.navigation.goBack();
                },
                style: 'cancel',
              },
            ],
          );
        } else {
        }
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const alertForNoServiceProvides = () => {
    Alert.alert(
      'No Serviceable Stores',
      "We're sorry, but there are currently no serviceable stores in your area. Please change your delivery address.",
      [
        {
          text: 'ok',
          onPress: () => {
            dispatch(setDeliveryLat(0.0));
            dispatch(setDeliveryLng(0.0));
            dispatch(setDeliveryAddress(''));
            dispatch(setDeliveryAddressId(0));
            console.log('fetchCartedList---------------------------7');
            fetchCartedList(1);
          },
          style: 'cancel',
        },
      ],
    );
  };

  const alertForNoLongerProduct = () => {
    CommonAlert(
      'Alert',
      'Few of the items in your cart are no longer available at this location',
    );
  };

  const alertForChooseDifferentStore = () => {
    CommonAlert('Alert', 'Please choose other store for delivery', () => {
      props.navigation.goBack();
    });
  };

  const hasMultiplePartnerNames = data => {
    const uniquePartnerNames = new Set(data.map(item => item.partnerName));
    return uniquePartnerNames.size > 1;
  };

  const formatNumberWithCommas = number => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // const formatter = new Intl.NumberFormat('en-US');
    // return formatter.format(number);
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

  const callApi = () => {
    interval = setInterval(checkTransactionStatus, 2000);

    return () => clearInterval(interval);
  };

  //check transaction
  const checkTransactionStatus = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    const uniqueId = await DeviceInfo.getUniqueId();
    var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const body = {
      userId: getUserId,
      merchantOrderId: merchantOrderId,
      transactionNo:
        checked == 'VA' ? await AsyncStorage.getItem('PaymentReference') : ' ',
      latitude: deliveryLatSlice,
      longitude: deliveryLngSlice,
      deviceId: uniqueId,
      paymentDate: date,
      paymentTypeId: 1,
      vaNumber: await AsyncStorage.getItem('PaymentRefNumber'),
    };
    const response = await PaymentService.getCheckTransactionStatus(
      body,
      merchantOrderId,
    );
    console.log(
      '000000000000000000000000000000checkTransactionStatus',
      response?.data,
    );
    if (response?.data?.isSuccess) {
      if (response?.data?.payload?.statusCode == '01') {
        //process show loader
        setDataRateFun(prevData => ({
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
        setDataRateFun(prevData => ({
          ...prevData,
          checkTransactionStatus: '00',
        }));

        GroceryAndFoodPlaceOrder();
      } else if (response?.data?.payload?.statusCode == '02') {
        //failer
        setDataRateFun(prevData => ({
          ...prevData,
          checkTransactionStatus: '02',
        }));
      }
    }
  };

  //place order
  const GroceryAndFoodPlaceOrder = async () => {
    var date = new Date().toLocaleString();
    const getUserId = await AsyncStorage.getItem('userId');

    //dispatch(clearProducts(categoryTypeId));

    let body = {
      orderDate: date,
      orderTypeId: categoryTypeId,
      orderStatusId: 2,
      deliveryOptionId: 1,
      customerId: getUserId, //userId
      customerName: name,
      customerPhoneNo: mobile,
      customerAddressId:
        deliveryAddressId == 0
          ? Number(addressIdCustomer)
          : Number(deliveryAddressId),
      senderDeliveryMethodId: dataRateFun?.senderDeliveryMethodId || 0, //use in intercity/ interIsland
      receiverShippingMethodId: dataRateFun?.receiverShippingMethodId || 0, //use in intercity/ interIsland
      totalQty: cartCountQty, //check whether if its ride
      promoCode: '',
      promoDiscount: 0,
      //totalAmount: deliveryIn !== 1 ? subTotall + totalShipping + wasliDeliveryFee : subTotall + totalShipping, // conditional totalAmount
      totalAmount:
        deliveryIn == 1
          ? finalAmount +
          totalService +
          totalShipping +
          dataRateFun?.environmentalFee +
          dataRateFun?.applicationFee +
          (coldStorageFee && dataRateFun?.coldStorageFee)
          : finalAmount +
          dataRateFun?.totalKgCost +
          dataRateFun?.applicationFee +
          dataRateFun?.environmentalFee +
          (coldStorageFee && dataRateFun?.coldStorageFee),
      totalDiscount: 0,
      serviceFee: dataRateFun?.serviceFee || totalService,
      shippingFee: totalShipping || 0,
      weightFee: dataRateFun?.weightFee || 0,

      levyFee: dataRateFun?.levyFee || 0,
      insuranceFee: dataRateFun?.insuranceFee || 0,
      warehouseServiceFee: dataRateFun?.warehouseServiceFee || 0,
      wasliDeliveryFee: dataRateFun?.wasliDeliveryFee || 0,
      deliveryInstruction: '',

      pickupAddressId: 0, //Ride and sender , it routing this data to another screen?
      dropoffAddressId: 0, //Ride and sender
      totalDistance: 0, //Ride and sender

      passengerName: '', //Ride
      passengerPhoneNo: '', //Ride
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
      packageWeight:
        deliveryIn == 1
          ? ''
          : String(
            Math.round(
              cartList?.reduce(
                (totalWeight, item) =>
                  totalWeight + item.cartQty * item.weight,
                0,
              ),
            ),
          ), //Sender intercity
      packageNote: '', //Sender common

      paymentMethodId: 0,
      paymentAmount:
        deliveryIn == 1
          ? finalAmount +
          totalService +
          totalShipping +
          dataRateFun?.environmentalFee +
          dataRateFun?.applicationFee +
          (coldStorageFee && dataRateFun?.coldStorageFee)
          : finalAmount +
          dataRateFun?.totalKgCost +
          dataRateFun?.applicationFee +
          dataRateFun?.environmentalFee +
          (coldStorageFee && dataRateFun?.coldStorageFee),

      accountNo: '',
      file: '',
      note: checked,

      orderDetails: cartList?.map(cartItem => {
        return {
          partnerId: cartItem.partnerId,
          totalItemAmount: cartItem?.cartPrice,
          totalItemDiscount: cartItem.regularPrice - cartItem.sellingPrice,
          totalWeight: cartItem?.weight,
          totalDimension:
            cartItem?.weight * cartItem?.length * cartItem?.height,
          partnerStoreId: cartItem.partnerStoreId,
          productId: cartItem.productId,
          qty: cartItem.cartQty,
          price: cartItem?.cartPrice,
          productDiscount: cartItem.regularPrice - cartItem.sellingPrice, //selling /regular price
          weight: cartItem.weight,
          dimension: cartItem.length * cartItem.height * cartItem.width,
          ServiceFee: cartItem?.serviceFee || 0,
          ShippingFee: cartItem?.shippingFee || 0,
        };
      }),

      transactionId:
        checked == 'VA' ? await AsyncStorage.getItem('PaymentReference') : ' ',
      PaymentTypeId: 1,
      PaymentMethod: checked,
      PaymentStatusId: 1,
      TransactionTypeId: 2,
      bankId: checked == 'VA' ? dataRateFun?.paymentDetails?.bankId : 0,
      applicationFee: dataRateFun?.applicationFee,
      environmentalFee: dataRateFun?.environmentalFee,
      coldStorageFee: dataRateFun?.coldStorageFee,
      routeId: deliveryIn == 1 ? 0 : dataRateFun?.routeId,
      routeOptionId: deliveryIn == 1 ? 0 : dataRateFun?.optionId,
    };

    console.log('Checkout body===', body);

    setLoading(true);
    const data = await ProductService.getCartCheckOut(body, categoryTypeId);
    setLoading(false);

    if (data?.data?.isSuccess) {
      setModalVisible(false);
      let routeData = {
        payload: data?.data?.payload,
        categoryTypeId: categoryTypeId,
        totalRp: formatNumberWithCommas(
          finalAmount +
          totalShipping +
          totalService +
          dataRateFun?.environmentalFee +
          dataRateFun?.applicationFee,
        ),
        product: cartCountQty,
        deliveryOptionId: deliveryIn,
      };
      try {
        dispatch(setDeliveryAddressId(''));
        dispatch(setDeliveryAddressId(0));
        props.navigation.navigate(Routes.ORDER_SUCCESS, {
          routeData: routeData,
        });

        dispatch(clearProducts(categoryTypeId));
      } catch (err) {
        console.log('Checkout====er555ro', err);
        ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
      }
    } else {
      console.log('Checkout====er555ro', data?.data);
    }
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={t('Checkout')}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.mainContainer}>
            <KeyboardAwareScrollView
              ref={scrollViewRef}
              extraScrollHeight={100} // Adjust this value as needed
              keyboardShouldPersistTaps={'never'}
              style={screenStyles.scrollViewContainer}
              contentContainerStyle={screenStyles.scrollViewContentContainer}
              getTextInputRefs={() => {
                return [inputRef];
              }}
              showsVerticalScrollIndicator={false}
              //  contentContainerStyle={{ flexGrow: 1 }}
              //extraScrollHeight={50}
              enableOnAndroid={true}
            // keyboardShouldPersistTaps="handled"
            >
              <View style={screenStyles.container}>
                {/*---------------------------------------- Product Details start--------------------------------------------- */}
                <View style={screenStyles.productDetailsContainer}>
                  <Text style={screenStyles.productDetailsTitle}>
                    {categoryTypeId == 1
                      ? t('Product Details')
                      : categoryTypeId == 2
                        ? t('Item Details')
                        : ''}
                  </Text>
                </View>

                <View style={screenStyles.productDetailsContainerItems}>
                  {/* ----------------------------------------------------------------------- */}
                  {cartList?.map((item, key) => {
                    const partnerName = item.partnerName;
                    const partnerId = item.partnerId;
                    if (!uniquePartnerNames.has(partnerName)) {
                      uniquePartnerNames.add(partnerName);

                      return (
                        <View key={key}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[itemStyles.priceText, { marginBottom: 4 }]}>
                              {item.partnerName}
                            </Text>
                            {hasMultiplePartnerNames(cartList) && (
                              <Text style={itemStyles.priceText}>
                                {' '}
                                (Shipping Fee Rp.{' '}
                                {formatNumberWithCommas(item.shippingFee)})
                              </Text>
                            )}
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2.6 }}>
                              <Text
                                style={[
                                  screenStyles.subtotalLabelText,
                                  {
                                    color: 'black',
                                    fontWeight: 'bold',
                                  },
                                ]}>
                                {item.cartQty} x {item.productName}
                                {/* {item.productName.length > 36
                                  ? `${item.productName.slice(0, 36 - 3)}...`
                                  : item.productName} */}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: Fonts.RUBIK_REGULAR,
                                  fontSize: Typography.P4,
                                }}>
                                Rp.{' '}
                                {formatNumberWithCommas(
                                  item.sellingPrice == 0
                                    ? item.regularPrice
                                    : item.sellingPrice,
                                )}
                                /{item.packagingName}
                              </Text>

                              {/* {hasMultiplePartnerNames(cartList) && (
<Text>Shipping Fee Rp. {item.shippingFee}</Text>
)} */}

                              {/* <Text>Shipping Fee Rp. {item.shippingFee}</Text> */}
                              {/* <Text>Service Fee Rp. {item.serviceFee || '0'}</Text> */}
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text style={[screenStyles.subtotalValueText]}>
                                Rp. {formatNumberWithCommas(item.cartPrice)}
                                {/*cartItem.regularPrice - cartItem.sellerPrice You may want to replace this with the actual value from your item */}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <View key={key}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{ flex: 2.6 }}>
                              <Text
                                style={[
                                  screenStyles.subtotalLabelText,
                                  { color: 'black', fontWeight: 'bold' },
                                ]}>
                                {item.cartQty} x {item.productName}
                                {/* {item.productName.length > 36
                                ? `${item.productName.slice(0, 36 - 3)}...`
                                : item.productName} */}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: Fonts.RUBIK_REGULAR,
                                  fontSize: Typography.P4,
                                }}>
                                Rp.{' '}
                                {formatNumberWithCommas(
                                  item.sellingPrice == 0
                                    ? item.regularPrice
                                    : item.sellingPrice,
                                )}
                                /{item.packagingName}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={screenStyles.subtotalValueText}>
                                Rp. {formatNumberWithCommas(item.cartPrice)}{' '}
                                {/*cartItem.regularPrice - cartItem.sellerPrice You may want to replace this with the actual value from your item */}
                              </Text>
                            </View>
                          </View>

                          {/* {hasMultiplePartnerNames(cartList) && (
                            <Text>
                              Shipping Fee Rp.{' '}
                              {formatNumberWithCommas(item.shippingFee)}
                            </Text>
                          )} */}
                        </View>
                      );
                    }
                  })}
                  {/* ------------------------------------------------------------------------- */}

                  <Divider style={screenStyles.horizontalDivider} />
                  <View style={screenStyles.totalContainer}>
                    <Text
                      style={{
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        fontSize: Typography.P4,
                        flex: 0.5,
                        color: colors.headingColor,
                      }}>
                      {t('Total')}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        fontSize: Typography.P4,
                        flex: 0.5,
                        textAlign: 'right',
                        color: colors.headingColor,
                      }}>
                      Rp. {formatNumberWithCommas(finalAmount)}
                    </Text>
                  </View>
                </View>
                {/*---------------------------------------- Product Details End--------------------------------------------- */}

                {/*-------------------------------------- Recipient Details start-------------------------------------------------- */}

                <View style={screenStyles.productDetailsContainer}>
                  <Text style={screenStyles.productDetailsTitle}>
                    {t('Recipient Details')}
                  </Text>
                </View>

                <View style={screenStyles.productDetailsContainerItems}>
                  {/* row 2 */}
                  <View>
                    <View>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('Name')}
                      </Text>
                      <AppInput
                        {...globalStyles.secondaryInputStyle}
                        textInputRef={r => (inputRef = r)}
                        leftIcon={IconNames.CircleUser}
                        placeholder={t('Enter name')}
                        value={name}
                        keyboardType={'default'}
                        onChangeText={userName => {
                          setName(userName);
                          setCheckUserName(false);
                        }}
                      />
                      {isCheckUserName && (
                        <Text
                          style={[
                            screenStyles.accountErrorText,
                            { alignSelf: 'flex-start', top: -12 },
                          ]}>
                          {errorUserName}
                        </Text>
                      )}
                    </View>

                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={screenStyles.subtotalLabelText}>
                          {t('Mobile Number')}
                        </Text>
                        {/* <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {
                            console.log('pressed');
                          }}>
                          <Text
                            style={{
                              fontSize: Typography.P5,
                              fontFamily: Fonts.RUBIK_MEDIUM,
                              color: colors.subHeadingSecondaryColor,
                            }}>
                            Change
                          </Text>
                        </TouchableOpacity> */}
                      </View>
                      <AppInput
                        {...globalStyles.secondaryInputStyle}
                        textInputRef={r => (inputRef = r)}
                        maxLength={13}
                        leftIcon={IconNames.CircleUser}
                        placeholder={t('Enter mobile number')}
                        value={mobile}
                        keyboardType={'number-pad'}
                        onChangeText={mobile => {
                          if (String(mobile).match(/[\s,.-]/g, '')) {
                          } else {
                            setMobile(mobile);
                          }
                          setCheckMobile(false);
                        }}
                      />
                      {isCheckMobile && (
                        <Text
                          style={[
                            screenStyles.accountErrorText,
                            { alignSelf: 'flex-start', top: -12 },
                          ]}>
                          {errorMobile}
                        </Text>
                      )}
                    </View>

                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={screenStyles.subtotalLabelText}>
                          {t('Address')}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {
                            props.navigation.navigate(
                              Routes.SAVED_ADDRESS_LIST,
                            );
                          }}>
                          <Text
                            style={{
                              fontSize: Typography.P5,
                              fontFamily: Fonts.RUBIK_MEDIUM,
                              color: colors.subHeadingSecondaryColor,
                            }}>
                            {t('Change')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* {fetchDirections()} */}
                      <Text style={screenStyles.disableInputStyle}>
                        {/* {defaultAddress} */}

                        {/* {defaultAddress
                        } */}
                        {deliveryAddress === undefined || deliveryAddress === ''
                          ? defaultAddress
                          : deliveryAddress}
                      </Text>
                    </View>
                  </View>
                </View>

                {/*-------------------------------------- Recipient Details End-------------------------------------------------- */}

                {/*-------------------------------------- Rate Start-------------------------------------------------- */}
                {deliveryIn == 2 && categoryTypeId == 5 && (
                  <View style={screenStyles.productDetailsContainer}>
                    <Text style={screenStyles.productDetailsTitle}>
                      {t('Rates')}
                    </Text>
                  </View>
                )}

                {deliveryIn == 2 && categoryTypeId == 5 && (
                  <View style={screenStyles.productDetailsContainerItems}>
                    {dataRateFun?.cheapestRate?.totalKgCost !== 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          width: '100%',
                          alignItems: 'center',
                        }}>
                        <RadioButton
                          color={colors.activeColor}
                          uncheckedColor={colors.activeColor}
                          value="first"
                          status={
                            checkedRates === 'first' ? 'checked' : 'unchecked'
                          }
                          onPress={() => {
                            // setIsSelectedPaymentMethodError(false);
                            setisRateSelectedd(false);
                            isRateSelected.current = 1;
                            setDataRateFun(prevData => ({
                              ...prevData,
                              routeId: dataRateFun?.fastestRate?.routeId,
                              totalKgCost:
                                dataRateFun?.fastestRate?.totalKgCost,
                              optionId: dataRateFun?.fastestRate?.optionId,
                            }));
                            setCheckedRates('first');
                          }}
                        />
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: '#d4d4d4',
                            borderRadius: 5,
                            paddingVertical: 8,
                            backgroundColor:
                              checkedRates == 'first'
                                ? colors.primaryGreenColor
                                : 'white',

                            paddingHorizontal: 6,
                            flex: 1,
                            marginBottom: 8,
                          }}>
                          <TouchableOpacity>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 1
                                        ? 'black'
                                        : 'white',
                                    fontWeight: 'bold',
                                  }}>
                                  Fastest Rate
                                </Text>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 1
                                        ? 'gray'
                                        : 'white',
                                  }}>
                                  {dataRateFun?.fastestRate?.duration} Hours
                                </Text>
                              </View>

                              <View>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 1
                                        ? 'gray'
                                        : 'white',
                                    alignSelf: 'flex-end',
                                  }}>
                                  From
                                </Text>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 1
                                        ? colors.activeColor
                                        : 'white',
                                    fontWeight: 'bold',
                                  }}>
                                  Rp. {dataRateFun?.fastestRate?.totalKgCost}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {dataRateFun?.cheapestRate?.totalKgCost !== 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          width: '100%',
                          alignItems: 'center',
                        }}>
                        <RadioButton
                          color={colors.activeColor}
                          uncheckedColor={colors.activeColor}
                          value="second"
                          status={
                            checkedRates === 'second' ? 'checked' : 'unchecked'
                          }
                          onPress={() => {
                            // setIsSelectedPaymentMethodError(false);

                            setCheckedRates('second');
                            setisRateSelectedd(false);
                            isRateSelected.current = 2;
                            setDataRateFun(prevData => ({
                              ...prevData,
                              routeId: dataRateFun?.cheapestRate?.routeId,
                              totalKgCost:
                                dataRateFun?.cheapestRate?.totalKgCost,
                              optionId: dataRateFun?.cheapestRate?.optionId,
                            }));
                          }}
                        />
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: '#d4d4d4',
                            borderRadius: 5,
                            paddingVertical: 8,
                            backgroundColor:
                              checkedRates == 'second'
                                ? colors.primaryGreenColor
                                : 'white',

                            paddingHorizontal: 6,
                            flex: 1,
                          }}>
                          <TouchableOpacity>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 2
                                        ? 'black'
                                        : 'white',
                                    fontWeight: 'bold',
                                  }}>
                                  Cheapest Rate
                                </Text>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 2
                                        ? 'gray'
                                        : 'white',
                                  }}>
                                  {dataRateFun?.cheapestRate?.duration} Hours
                                </Text>
                              </View>

                              <View>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 2
                                        ? 'gray'
                                        : 'white',
                                    alignSelf: 'flex-end',
                                  }}>
                                  From
                                </Text>
                                <Text
                                  style={{
                                    color:
                                      isRateSelected.current !== 2
                                        ? colors.activeColor
                                        : 'white',
                                    fontWeight: 'bold',
                                  }}>
                                  Rp. {dataRateFun?.cheapestRate?.totalKgCost}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {isRateSelectedd && (
                  <Text style={{ color: 'red' }}>Please select rate</Text>
                )}
                {/*-------------------------------------- Rate End-------------------------------------------------- */}

                {/*-------------------------------------- Payment Method Start-------------------------------------------------- */}
                <View style={screenStyles.productDetailsContainer}>
                  <Text style={screenStyles.productDetailsTitle}>
                    {t('Payment Method')}
                  </Text>
                </View>

                <View style={screenStyles.productDetailsContainerItems}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton
                      color={colors.activeColor}
                      uncheckedColor="#C0C0C0"
                      value="Wallet"
                      status={checked === 'Wallet' ? 'checked' : 'unchecked'}
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
                          props.navigation.navigate(Routes.TOPUP_WALLET);
                        }}>
                        <Text
                          style={{
                            fontSize: Typography.P4,
                            fontFamily: Fonts.RUBIK_MEDIUM,
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
                        status={checked === 'VA' ? 'checked' : 'unchecked'}
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
                            console.log(
                              '888888888888888888==========================8',
                              bankData[val]?.data,
                            );
                            const paymentImage =
                              bankData[val]?.value?.props.children[0]?.props
                                .source.uri;
                            const paymentName =
                              bankData[val]?.value?.props.children[1]?.props
                                .children;
                            const paymentMethod =
                              bankData[val]?.value?.props.children[2]?.props
                                .children;

                            setDataRateFun(prevData => ({
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
                            //value: MyComponent,
                            // value: ({
                            //   "paymentImage": "https://images.duitku.com/hotlink-ok/VA.PNG",
                            //   "paymentMethod": "VA",
                            //   "paymentName": "MAYBANK VA",
                            //   "totalFee": "0"
                            // })
                            value: (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text style={{ marginLeft: 5 }}>
                                  Select bank transfer/e-wallet
                                </Text>
                              </View>
                            ),
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
                        checked === 'Cash On Delivery' ? 'checked' : 'unchecked'
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

                {/*-------------------------------------- Payment Method  End-------------------------------------------------- */}

                {/* --------------------Carbon click banners-------------------------------------------------- */}

                {renderPromotionSlider()}

                {/*--------------------------------------CheckOut start-------------------------------------------------- */}
                <View style={screenStyles.productDetailsContainer}>
                  <Text style={screenStyles.productDetailsTitle}>
                    {t('Payment Details')}
                  </Text>
                </View>

                <View style={screenStyles.productDetailsContainerItems}>
                  <View
                    style={[
                      screenStyles.totalContainer,
                      { marginBottom: 3, justifyContent: 'space-between' },
                    ]}>
                    <Text style={screenStyles.subtotalLabelText}>
                      {categoryTypeId == 1
                        ? t('Total Products')
                        : categoryTypeId == 2
                          ? t('Total Items')
                          : ''}
                    </Text>
                    <Text style={screenStyles.subtotalValueText}>
                      {cartList?.length}
                    </Text>
                  </View>

                  {Math.round(totalWeight) != 0 && (
                    <View
                      style={[
                        screenStyles.totalContainer,
                        { marginBottom: 3, justifyContent: 'space-between' },
                      ]}>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('Total Weight')}
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        {Math.round(
                          cartList?.reduce(
                            (totalWeight, item) =>
                              totalWeight + item.cartQty * item.weight,
                            0,
                          ),
                        ) + ' kg'}
                        {/* {Math.round(totalWeight)} kg */}
                      </Text>
                    </View>
                  )}

                  {Math.round(totalDimensions) != 0 && (
                    <View
                      style={[
                        screenStyles.totalContainer,
                        { marginBottom: 3, justifyContent: 'space-between' },
                      ]}>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('Total Dimension')}
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        {cartList?.reduce(
                          (totalDimension, item) =>
                            parseFloat(
                              totalDimension +
                              item.cartQty *
                              (item.height * item.length * item.width),
                            ),
                          0,
                        ) + ' cm3'}
                        {/* {Math.round(totalDimensions)} cm3 */}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      screenStyles.totalContainer,
                      { marginBottom: 3, justifyContent: 'space-between' },
                    ]}>
                    <Text style={screenStyles.subtotalLabelText}>
                      {t('Total Shopping')}
                    </Text>
                    <Text style={screenStyles.subtotalValueText}>
                      Rp. {formatNumberWithCommas(finalAmount)}
                    </Text>
                  </View>

                  {deliveryIn == 1 && (
                    <View
                      style={[
                        screenStyles.totalContainer,
                        { marginBottom: 3, justifyContent: 'space-between' },
                      ]}>
                      <Text style={screenStyles.subtotalLabelText}>
                        Shipping Fee
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        Rp. {formatNumberWithCommas(totalShipping)}
                      </Text>
                    </View>
                  )}

                  {deliveryIn == 1 && (
                    <View
                      style={[
                        screenStyles.totalContainer,
                        { marginBottom: 3, justifyContent: 'space-between' },
                      ]}>
                      <Text style={screenStyles.subtotalLabelText}>
                        Service Fee
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        Rp. {formatNumberWithCommas(totalService)}
                      </Text>
                    </View>
                  )}

                  {coldStorageFee && (
                    <View
                      style={[
                        screenStyles.totalContainer,
                        { marginBottom: 3, justifyContent: 'space-between' },
                      ]}>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('ColdStorage Fee')}
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        Rp.{' '}
                        {formatNumberWithCommas(dataRateFun?.coldStorageFee)}
                      </Text>
                    </View>
                  )}
                  {deliveryIn == 2 && (
                    <View
                      style={[
                        screenStyles.totalContainer,
                        { marginBottom: 3, justifyContent: 'space-between' },
                      ]}>
                      <Text style={screenStyles.subtotalLabelText}>
                        {t('Rates')}
                      </Text>
                      <Text style={screenStyles.subtotalValueText}>
                        Rp. {formatNumberWithCommas(dataRateFun?.totalKgCost)}
                      </Text>
                    </View>
                  )}

                  <View style={[screenStyles.Box1, { marginBottom: 10 }]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={[screenStyles.subtotalLabelText]}>
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
                              With each order, users directly contribute to
                              supporting environmental initiative managed by
                              CarbonClick. For more information, click on the
                              banner above.
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
                      Rp.{' '}
                      {formatNumberWithCommas(
                        dataRateFun?.environmentalFee +
                        dataRateFun?.applicationFee,
                      )}
                    </Text>
                  </View>

                  <Divider style={screenStyles.horizontalDivider} />

                  {/* Total Amount 2*/}
                  <View style={screenStyles.totalContainer}>
                    <Text style={screenStyles.totalLabelText}>
                      {t('Total Amount')}
                    </Text>
                    <Text
                      style={[
                        screenStyles.totalValueText,
                        { color: colors.activeColor },
                      ]}>
                      Rp.{' '}
                      {deliveryIn == 1 &&
                        formatNumberWithCommas(
                          finalAmount +
                          totalShipping +
                          totalService +
                          dataRateFun?.applicationFee +
                          dataRateFun?.environmentalFee +
                          (coldStorageFee && dataRateFun?.coldStorageFee),
                        )}
                      {deliveryIn == 2 &&
                        formatNumberWithCommas(
                          finalAmount +
                          dataRateFun?.totalKgCost +
                          dataRateFun?.applicationFee +
                          dataRateFun?.environmentalFee +
                          (coldStorageFee && dataRateFun?.coldStorageFee),
                        )}
                    </Text>
                  </View>
                </View>

                {/*--------------------------------------CheckOut end-------------------------------------------------- */}
              </View>
            </KeyboardAwareScrollView>

            <View style={screenStyles.bottomButton}>
              <AppButton
                title={t('Place Order')}
                loader={isLoading}
                onPress={() => {
                  cartCheckOut();
                  // props.navigation.goBack();
                }}
              />
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
                        : dataRateFun?.checkTransactionStatus == '00'
                          ? 'Transaction Request'
                          : 'Transaction Request Failed'}
                    </Text>
                    <Text style={screenStyles.modalSubTitleText}>
                      {minutes > 0 || (minutes === 0 && second > 0)
                        ? "Transaction is begin processed, please wait.. don't tap back or exit app."
                        : dataRateFun?.checkTransactionStatus == '00'
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
                          fontFamily: Fonts.RUBIK_REGULAR,
                          fontSize: Typography.P3,
                          color: colors.headingColor,
                        }}>
                        Pay Before
                      </Text>

                      <Text
                        style={{
                          fontFamily: Fonts.RUBIK_REGULAR,
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
                              uri: `${dataRateFun?.paymentDetails?.paymentImage}`,
                            }}
                            style={{ width: 68, height: 18 }}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              fontFamily: Fonts.RUBIK_REGULAR,
                              fontSize: Typography.P3,
                              color: colors.headingColor,
                            }}>
                            {dataRateFun?.paymentDetails?.paymentName}{' '}
                          </Text>
                        </View>

                        <Text
                          style={{
                            fontFamily: Fonts.RUBIK_REGULAR,
                            fontSize: Typography.P3,
                            color:
                              minutes > 0 || (minutes === 0 && second > 0)
                                ? colors.headingColor
                                : dataRateFun?.checkTransactionStatus == '00'
                                  ? colors.activeColor
                                  : colors.red,
                          }}>
                          {minutes > 0 || (minutes === 0 && second > 0)
                            ? dataRateFun.PaymentRefNumber
                            : dataRateFun?.checkTransactionStatus == '00'
                              ? 'Transaction success'
                              : 'Transaction failed,Please retry'}
                        </Text>
                      </View>

                      {dataRateFun?.checkTransactionStatus !== '00' && (
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
                                Clipboard.setString(
                                  dataRateFun.PaymentRefNumber,
                                );
                                ToastAndroid.show(
                                  `Transaction id has been copied ${dataRateFun.PaymentRefNumber}`,
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
                                  fontFamily: Fonts.RUBIK_MEDIUM,
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

export default CheckoutSelectedProduct;
