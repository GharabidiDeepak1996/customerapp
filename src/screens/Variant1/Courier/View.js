import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
//test push

import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Styles} from './Styles';
import Routes from '../../../navigation/Routes';
import Globals from '../../../utils/Globals';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import IconNames from '../../../../branding/carter/assets/IconNames';
import {Variant1Header} from '../Header/View';
import AppConfig from '../../../../branding/App_config';
import {ProductService} from '../../../apis/services/product';
import {CommomService, ShopService, TrackService} from '../../../apis/services';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import AppInput from '../../../components/Application/AppInput/View';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {RadioButton} from 'react-native-paper';
import {SvgIcon} from '../../../components/Application/SvgIcon/View';
import {formatNumberWithCommas} from '../../../utils/FormatNumberWithCommas';
import DropDownItem from '../../../components/Application/DropDownItem/View';
import axios from 'axios';

//Constants

export const Courier = props => {
  //Props
  const {
    pickupAddress = '',
    pickupTitle = '',
    dropOffTitle = '',
    dropOffAddress = '',
    pickupLat = 0,
    pickupLng = 0,
    dropOffLat = 0,
    dropOffLng = 0,
    subDistrictIdPickUp,
    subDistrictIdDropOff,
    idp,
    idd,
    isAgainChangeAddress,
  } = props?.route?.params;

  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  //navigation and translation
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  //useRef
  let inputRef = useRef();
  const scrollViewRef = useRef(null);
  const _carousel = useRef();
  let isRateSelected = useRef(0);
  //let isBackPressed = useRef(false);
  const [isBackPressed, setisBackPressed] = useState(false);
  //local useState
  const [deliveryIn, setDeliveryIn] = useState(0);
  let [isService, setIsService] = useState(true);
  const [bannersCarbonClick, setBannersCarbonClick] = useState([]);
  const [data, setData] = useState({packageWeight: 0});
  const [routeRate, setRouteRate] = useState();
  const [validRoute, setValidRoute] = useState();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPackageNameError, setIsPackageNameError] = useState(false);
  const [isPackageQantityError, setIsPackageQantityError] = useState(false);
  const [isPackageWeightError, setIsPackageWeightError] = useState(false);
  const [perishableError, setPerishableError] = useState(false);
  const [isRateSelectedd, setisRateSelectedd] = useState(false);
  const [isLessThan1M, setLessThan1M] = useState(false);
  const [trackingError, setTrackingError] = useState(false);
  const [interIsLandRate, setInterIsLandRate] = useState([]);

  const [perishable, setPerishable] = useState(false);
  const [nonPerishable, setNonPerishable] = useState(false);

  const [distanceInMeters, setDistanceInMeters] = useState(0);
  const [checked, setChecked] = useState('');

  const MaxSendDistance = useSelector(
    state => state.dashboard.MaximumSendDistance,
  );
  const MinimumSendDistance = useSelector(
    state => state.dashboard.MinimumSendDistance,
  );

  useEffect(() => {
    getDashBoardBanners();

    // Check if both pickup and drop-off coordinates are available
    if (pickupLat && pickupLng && dropOffLat && dropOffLng) {
      fetchDirections();
    }

    return () => {};
  }, [pickupLat, pickupLng, dropOffLat, dropOffLng, deliveryIn]);

  const fetchDirections = async () => {
    console.log(
      'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
      pickupLat,
      pickupLng,
      dropOffLat,
      dropOffLng,
    );
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLat},${pickupLng}&destination=${dropOffLat},${dropOffLng}&key=${Globals.googleApiKey}`,
      );
      const data = await response.json();
      console.log(
        'fetchDirections----->',
        data.status,
        '---',
        MaxSendDistance * 1000,
      );

      if (data.status === 'ZERO_RESULTS') {
        setDeliveryIn(2);

        checkValidRoute();
        console.log('fetchDirections22----->Zero resullt');
      }
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        // leg.distance.text,leg.distance.value
        if (leg.distance.value > MaxSendDistance * 1000) {
          setDeliveryIn(2);
          checkValidRoute();
        } else {
          setDeliveryIn(1);
          setDistanceInMeters(leg.distance.value);

          console.log(
            'FetcgDirection---MaxSendDistance----->',
            leg.distance.value,
            MaxSendDistance * 1000,
            deliveryIn,
          );

          if (
            leg.distance.value < 1000 ||
            leg.distance.value > MaxSendDistance * 1000
          ) {
            setIsService(false);

            Alert.alert(
              `Pick-up and drop locations are too ${
                leg.distance.value < 1000
                  ? 'near'
                  : leg.distance.value > MaxSendDistance * 1000
                  ? 'far'
                  : ''
              } (${leg.distance.text})`,
              `Local  delivery accepts orders within ${MaxSendDistance} Km of radius only.`,
              [
                {
                  text: 'Close',
                  onPress: () => {
                    //props.navigation.goBack();
                    console.log('Cancel Pressed');
                  },
                  style: 'cancel',
                },
              ],
            );
          }
        }
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const checkValidRoute = async () => {
    console.log(
      'check Validate body----',
      subDistrictIdPickUp,
      subDistrictIdDropOff,
    );

    const response = await CommomService.isValidRoutes(
      subDistrictIdPickUp,
      subDistrictIdDropOff,
    );
    console.log('check Validate routes----', response?.data.payload);

    if (response?.data?.isSuccess) {
      if (response?.data?.payload.routeId != 0) {
        {
          response?.data.payload.routeLists[0].isInterIsLand &&
            getInterIsLandRte();
        }

        setValidRoute(response?.data.payload);
      } else {
        setIsService(false);
        Alert.alert(
          `Alert`,
          `Sorry, we currently do not service this location(s) `,
          [
            {
              text: 'ok',
              onPress: () => {
                setData(prevData => ({
                  ...prevData,
                  packageWeight: 0,
                }));
              },
              style: 'cancel',
            },
          ],
        );
      }
    }
  };

  const getInterIsLandRte = async () => {
    try {
      const data = await ProductService.getInterIsLandRate();
      //console.log('InterIslandRate----', data?.data);

      if (data?.data?.isSuccess) {
        let interIsLandArry = data.data.payload.map(item => {
          return {
            key: item.id,
            value: item.name,
            data: {
              minKg: item.minKg,
              maxKg: item.maxKg,
              cost: item.cost,
              warehouseFee: item.warehouseFee,
              InterIslandRateId: item.id,
              InterIslandVal: item.name,
            },
          };
        });
        setInterIsLandRate(interIsLandArry);
      }
    } catch (error) {
      console.log('ErrorloginInterIslandRate----', error);
    }
  };

  const getRouteRate = async (weight, routeOptId) => {
    try {
      let body = {
        routeId: validRoute?.routeId,
        routeIdOptionId: routeOptId,
        weight: parseInt(weight) || 0,
      };

      console.log('Send-RouteRate--body--->', body);
      const responseRouteRate = await CommomService.routeRate(body);

      if (responseRouteRate?.data.isSuccess) {
        console.log(
          'Send-RouteRate--response--->',
          responseRouteRate?.data.payload,
        );
        setisBackPressed(true);
        setRouteRate(responseRouteRate?.data.payload);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const getRateFunc = async (locationId, val) => {
    let body = {
      deliveryOptionId: deliveryIn,
      categoryTypeId: 4,
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
      //distance: distance,
    };

    console.log('Send-RateFunc--body--->', body);

    try {
      const dataa = await ProductService.getRate(body);
      if (dataa?.data.isSuccess) {
        let item = dataa.data.payload;
        console.log('Send-RateFunc--response--->', item);
        if (
          dataa?.data.payload.serviceFee == 0 &&
          dataa?.data.payload.shippingFee == 0
        ) {
          setIsService(false);
          Alert.alert(
            `Alert`,
            `Sorry, we currently do not service this location(s) `,
            [
              {
                text: 'ok',
                onPress: () => {
                  setData(prevData => ({
                    ...prevData,
                    packageWeight: 0,
                  }));
                },
                style: 'cancel',
              },
            ],
          );
        } else {
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
              coldStorageFee: item?.coldStorageFee,
            }));

            goToNextPage(
              item?.serviceFee,
              item?.shippingFee,
              item?.weightFee,
              item?.wasliDeliveryFee,
              item?.applicationFee,
              item?.warehouseServiceFee,
              item?.insuranceFee,
              item?.totalAmount,
              item?.environmentalFee,
              item?.coldStorageFee,
            );
            //ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
          } catch (err) {
            // ToastAndroid.show(data?.data.message, ToastAndroid.LONG);
          }
        }
      }
    } catch (error) {
      console.log('67857857579=======', error);
    }
  };

  const validateFields = () => {
    if (perishable == false && nonPerishable == false) {
      setPerishableError(true);
      return false;
    } else if (data?.packageName == undefined || data?.packageName == '') {
      setIsPackageNameError(true);
      return false;
    } else if (data?.packageQty == undefined || data?.packageQty == 0) {
      setIsPackageQantityError(true);
      return false;
    } else if (data?.packageWeight == undefined || data?.packageWeight == 0) {
      setIsPackageWeightError(true);
      return false;
    } else if (isRateSelected.current == 0) {
      if (deliveryIn == 1) {
        if (distanceInMeters == 0) {
          Alert.alert(
            'Alert',
            'Distance should be greater than equal to 1KM.',
            [
              {
                text: 'ok',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
          );
          return false;
        }
        return true;
      } else if (deliveryIn == 2) {
        setisRateSelectedd(true);
        return false;
      }

      return null;
    }
    return true;
  };

  const scrollToBottom = possition => {
    if (scrollViewRef.current) {
      scrollViewRef.current?.scrollTo({y: possition, animated: true});
    }
  };

  const goToNextPage = (
    serviceFee,
    shippingFee,
    weightFee,
    wasliDeliveryFee,
    applicationFee,
    warehouseServiceFee,
    insuranceFee,
    totalAmount,
    environmentalFee,
    coldStorageFee,
  ) => {
    if (validateFields()) {
      // const multimodelRoute = validRoute?.routeLists.find(route => route.id === 1);
      // const TraxRoute = validRoute?.routeLists.find(route => route.id === 2);

      props.navigation.navigate(Routes.COURIER_DELIVERY_DETAILS, {
        pickupTitle: pickupTitle,
        dropOffTitle: dropOffTitle,
        pickupAddress: pickupAddress,
        dropOffAddress: dropOffAddress,
        pickupLat: pickupLat,
        pickupLng: pickupLng,
        dropOffLat: dropOffLat,
        dropOffLng: dropOffLng,
        categoryTypeId: 4,
        subDistrict: '',
        deliveryIn: deliveryIn,
        subDistrictIdPickUp: subDistrictIdPickUp,
        destinationLocationId: subDistrictIdDropOff,
        routeId: data?.routeId, //------->>>
        optionId: data?.optionId,
        packageName: data?.packageName,
        packageQty: data?.packageQty,
        packageWeight: data?.packageWeight,
        totalKgCost: data?.totalKgCost,
        duration: data?.duration,
        pickupAddressId: idp,
        dropOffAddressId: idd,
        fare: serviceFee + shippingFee + weightFee,
        applicationFee:
          deliveryIn == 1 ? applicationFee : routeRate?.applicationFee,
        insuranceFee: data?.insuranceFee || 0,
        levyFee: data?.levyFee || 0,
        serviceFee: data?.serviceFee || 0,
        shippingFee: data?.shippingFee || 0,
        weightFee: data?.weightFee || 0,
        warehouseServiceFee: data?.warehouseServiceFee || 0,
        wasliDeliveryFee: data?.wasliDeliveryFee || 0,
        dimensionId: data?.dimensionId || 0,
        Perishable: perishable,
        coldStorageFee:
          perishable === true
            ? deliveryIn == 1
              ? coldStorageFee
              : routeRate?.coldStorageFee
            : 0,
        environmentalFee:
          deliveryIn == 1 ? environmentalFee : routeRate?.environmentalFee,
        isInterIsLand: data?.selectedRateInterIsLand,
        warehouseFee: data?.warehouseFee,
        interIslandRateId: data?.InterIslandRateId,
        interIslandVal: data?.InterIslandVal,
        interIsLandShippingCost: data?.cost,
        selectedRateName: data?.selectedRateName,
      });
    }
  };

  {
    /* Find the rate */
  }
  const getRatesOnClick = () => {
    if (deliveryIn == 1) {
      if (Number(data?.packageWeight) > 0 && Number(data?.packageWeight) <= 5) {
        setData(prevData => ({
          ...prevData,
          dimensionId: 1,
        }));
        if (distanceInMeters > 0) {
          getRateFunc(subDistrictIdPickUp, 1);
        }
      }

      if (
        Number(data?.packageWeight) > 5 &&
        Number(data?.packageWeight) <= 30
      ) {
        setData(prevData => ({
          ...prevData,
          dimensionId: 2,
        }));
        if (distanceInMeters > 0) {
          getRateFunc(subDistrictIdPickUp, 2);
        }
      }

      //Instant deliveries should be less than 30 Kg
      if (Number(data?.packageWeight) > 30) {
        Alert.alert('Alert', 'Instant deliveries should be less than 30 Kg', [
          {
            text: 'ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]);
      }
    }

    //cheapest and fastest
    if (deliveryIn == 2) {
      if (data?.packageWeight.length != 0) {
        getRouteRate(data?.packageWeight, 0); //0 is for routeIdOption
      }
    }
    // //Trax and multimodal
    // if (deliveryIn == 2) {

    //   if (data?.packageWeight.length != 0) {
    //     // console.log("8888888888888888888888", text >= data.minKg, "=====", text <= data.maxKg, "=======", (validRoute?.routeLists.find(route => route.id === 2) != undefined))
    //     if (
    //       (validRoute?.routeLists.find(route => route.id === 1) != undefined &&
    //         (!validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand && data?.packageWeight >= 1)) ||

    //       (validRoute?.routeLists.find(route => route.id === 1) != undefined &&
    //         (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand &&
    //           data?.packageWeight >= 1 && data?.packageWeight >= data.minKg && data?.packageWeight <= data.maxKg)) ||

    //       (//if multimode =true , Trax=false
    //         (validRoute?.routeLists.length == 2 &&
    //           validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand) ?

    //           (
    //             validRoute?.routeLists.find(route => route.id === 1) != undefined &&
    //             (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand &&
    //               data?.packageWeight >= 1 && data?.packageWeight >= data.minKg && data?.packageWeight <= data.maxKg)
    //           ) ://if multimode =false , Trax=false
    //           (validRoute?.routeLists.length == 2 &&
    //             validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand === false &&
    //             validRoute?.routeLists.find(route => route.id === 2)?.isInterIsLand === false
    //           ) ?//if equal to 1 thn multimodel ans grater than 1 trax
    //             (
    //               (data?.packageWeight === 1) ? (validRoute?.routeLists.find(route => route.id === 1) != undefined &&
    //                 (!validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand && data?.packageWeight >= 1)
    //               ) ://call Trax
    //                 (data?.packageWeight > 1) && (
    //                   validRoute?.routeLists.find(route => route.id === 2) != undefined &&
    //                   (!validRoute?.routeLists.find(route => route.id === 2)?.isInterIsLand && data?.packageWeight > 1)
    //                 )

    //             ) ://this condition for trax

    //             (
    //               validRoute?.routeLists.find(route => route.id === 2) != undefined &&
    //               (!validRoute?.routeLists.find(route => route.id === 2)?.isInterIsLand && data?.packageWeight > 1)
    //             )
    //       )
    //     ) {

    //       let routeRateId = 0;
    //       if (
    //         (
    //           validRoute?.routeLists.find(route => route.id === 1) != undefined && validRoute?.routeLists.length == 1 &&
    //           (!validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand && data?.packageWeight >= 1)
    //         ) || (
    //           validRoute?.routeLists.find(route => route.id === 1) != undefined && validRoute?.routeLists.length == 1 &&
    //           (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand && data?.packageWeight == 1)
    //         ) || (
    //           validRoute?.routeLists.find(route => route.id === 1) != undefined && validRoute?.routeLists.length == 1 &&
    //           (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand && data?.packageWeight > 1)
    //         ) || (
    //           validRoute?.routeLists.find(route => route.id === 1) != undefined && validRoute?.routeLists.length == 2 &&
    //           (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand)
    //         ) || (
    //           validRoute?.routeLists.find(route => route.id === 1) != undefined && validRoute?.routeLists.length == 2 &&
    //           (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand == false && data?.packageWeight == 1)
    //         )
    //       ) {
    //         routeRateId = 1
    //       } else if (
    //         (validRoute?.routeLists.find(route => route.id === 2) != undefined &&
    //           (!validRoute?.routeLists.find(route => route.id === 2)?.isInterIsLand && data?.packageWeight > 1)
    //         ) || (
    //           validRoute?.routeLists.find(route => route.id === 2) != undefined && validRoute?.routeLists.length == 2 &&
    //           (validRoute?.routeLists.find(route => route.id === 2)?.isInterIsLand == false && data?.packageWeight > 1)
    //         )
    //       ) {
    //         routeRateId = 2
    //       }

    //       console.log("getRouteRate-----",)

    //       getRouteRate(data?.packageWeight, routeRateId);
    //     } else {
    //       //error pop
    //       console.log("Erorr Pop-----", validRoute?.routeLists.find(route => route.id === 1))
    //       if (
    //         (
    //           validRoute?.routeLists.find(route => route.id === 1) != undefined &&
    //           (!validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand && data?.packageWeight >= 1)
    //         )
    //         ||
    //         (
    //           validRoute?.routeLists.find(route => route.id === 2) != undefined &&
    //           (!validRoute?.routeLists.find(route => route.id === 2)?.isInterIsLand && data?.packageWeight == 1 &&
    //             !validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand)
    //         )
    //       ) {
    //         Alert.alert(
    //           'Alert',
    //           'Rate is not available',
    //           [
    //             {
    //               text: 'ok',
    //               onPress: () => console.log('Cancel Pressed'),
    //               style: 'cancel',
    //             },
    //           ],
    //         );
    //         return
    //       } else if (//(!(text >= data.minKg) || !(text <= data.maxKg)) text.length != 0 && text < data.minKg &&
    //         validRoute?.routeLists.find(route => route.id === 1) != undefined &&
    //         (validRoute?.routeLists.find(route => route.id === 1)?.isInterIsLand) &&
    //         data?.packageWeight.length != 0 && (data?.packageWeight < data.minKg || data?.packageWeight > data.maxKg)
    //       ) {
    //         Alert.alert(
    //           'Alert',
    //           'The weight range selected does not match with entered weight.',
    //           [
    //             {
    //               text: 'ok',
    //               onPress: () => console.log('Cancel Pressed'),
    //               style: 'cancel',
    //             },
    //           ],
    //         );
    //         return
    //       }

    //     }
    //   }

    // }

    setData(prevData => ({
      ...prevData,
      packageWeight: data?.packageWeight.length == 0 ? 0 : data?.packageWeight,
    }));
  };

  const handleKeyPress = ({nativeEvent}) => {
    const {key} = nativeEvent;

    // Check if the pressed key is the backspace key
    if (key === 'Backspace') {
      console.log('IsBackSpace-----------');
      setisBackPressed(false);
    }
  };

  const getTrackByOrder = async trackNo => {
    try {
      let response = await TrackService.trackByOrder(trackNo);

      let item = response?.data?.payload;
      if (response?.data?.isSuccess) {
        console.log('track_id__response__________', item?.orderTypeId);
        console.log('track_id__response__________', item?.orderId);
        console.log('track_id__response__________', item?.totalQty);
        console.log('track_id__response__________', item?.totalAmount);
        props.navigation.navigate(Routes.MAP_TRACK_ORDERS, {
          categoryTypeId: item?.orderTypeId,
          orderId: item?.orderNo,
          product: item?.totalQty,
          totalRp: formatNumberWithCommas(item?.totalAmount),
        });
      } else {
        console.log('track_id__response__________', response?.data);
      }
    } catch (error) {
      console.log('track_id__error__________', error.message);
      ToastAndroid.show(
        'An error occurred while get Track Order: ' + error.message,
        ToastAndroid.LONG,
      );
    }
  };

  const MyComponent = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginLeft: 5}}>Select item type</Text>
      </View>
    );
  };

  const getDashBoardBanners = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          const filterGroceryBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Send',
          );
          console.log('dashboard---home>', filterGroceryBanners);
          setBannersCarbonClick(filterGroceryBanners);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  return (
    <View
      style={[
        screenStyles.mainWrapper,
        {paddingTop: Globals.SAFE_AREA_INSET.top},
      ]}>
      <LinearGradient
        //colors={[colors.buttonBackground, '#31b5e7', '#b0eeff']}
        colors={['#f5f5f5', '#f5f5f5', '#f5f5f5']}
        style={screenStyles.linearGradient}>
        <View style={screenStyles.linearGradientView}>
          <Variant1Header
            isVisiable={true}
            navigation={props.navigation}
            categoryTypeId={props?.route?.params?.categoryTypeId}
          />
        </View>
      </LinearGradient>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        scrollEnabled={true}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{width: '90%'}}>
        {/* Banner */}
        <View style={screenStyles.promotionSliderContainer}>
          <Carousel
            ref={_carousel}
            data={bannersCarbonClick}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // props.navigation.navigate(Routes.POPULAR_DEALS);
                  }}>
                  <Image
                    source={{
                      uri: `${Globals.imgBaseURL}/${item.imageUrl}`,
                    }}
                    style={screenStyles.promotionSliderContainer}
                    resizeMode={'contain'}
                  />
                  {/* <Image
                    source={item.img}
                    style={screenStyles.promotionSliderContainer}
                    resizeMode={'contain'}
                  /> */}
                </TouchableOpacity>
              );
            }}
            sliderWidth={globalStyles.gridWidth}
            itemWidth={globalStyles.gridWidth}
            onSnapToItem={index => setActiveSlideIndex(index)}
            autoplay
            autoplayInterval={5000}
            loop
          />
          <Pagination
            dotsLength={bannersCarbonClick.length}
            activeDotIndex={activeSlideIndex}
            dotColor={colors.paginationDotActiveColor}
            dotStyle={screenStyles.promotionSliderActiveDot}
            inactiveDotStyle={screenStyles.promotionSliderInActiveDot}
            inactiveDotColor={colors.primaryBackground}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1}
            carouselRef={_carousel}
            containerStyle={screenStyles.promotionPaginationContainer}
          />
        </View>

        <View style={screenStyles.containerTrackPackage}>
          <View style={{flex: 0.2, alignSelf: 'center'}}>
            <Text
              style={[
                screenStyles.sectionHeadingText,
                {
                  color: 'white',
                  textAlignVertical: 'center',
                },
              ]}>
              Track
            </Text>

            <Text style={{fontSize: 10, color: 'white'}}>Package</Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={screenStyles.containerEnterTrack}>ASLX</Text>
              <AppInput
                {...globalStyles.secondaryInputStyle}
                textInputRef={r => (inputRef = r)}
                showLeftIcon={false}
                // leftIcon={IconNames.Search}
                placeholder={t('Enter tracking #')}
                value={data?.trackNo}
                containerStyle={{borderRadius: 0, flex: 1}}
                keyboardType={'default'}
                maxLength={15}
                onChangeText={val => {
                  setTrackingError(false);
                  setData(prevData => ({
                    ...prevData,
                    trackNo: val,
                  }));
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (data?.trackNo !== null && data?.trackNo?.length > 10) {
                    setTrackingError(false);
                    getTrackByOrder(data?.trackNo);
                  } else {
                    setTrackingError(true);
                  }
                  // props.navigation.navigate(Routes.MAP_TRACK_ORDERS, {
                  //   categoryTypeId: 4,
                  //   trackingNo:44466
                  // });
                }}
                style={{
                  paddingHorizontal: 6,
                  justifyContent: 'center',
                }}>
                <SvgIcon
                  type={IconNames.ArrowRight}
                  width={18}
                  height={18}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>

            {trackingError && (
              <Text
                style={{
                  color: '#FF7F7F',
                  fontSize: 13,
                  marginTop: 4,
                }}>
                Please enter tracking number
              </Text>
            )}
          </View>
        </View>

        <View style={{width: '100%'}}>
          <Text
            style={{
              fontFamily: Fonts.RUBIK_MEDIUM,
              fontSize: Typography.P2,
              color: colors.headingColor,
              width: '100%',
              marginBottom: 3,
            }}>
            Send Package
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#d4d4d4',
              borderRadius: 5,
              backgroundColor: 'white',
              paddingHorizontal: 14,
              marginBottom: 7,
              paddingTop: 10,
              paddingBottom: 15,
            }}>
            {/* pickup Location */}
            {pickupAddress === '' ? (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.My_Address, {
                    isFromCourier: true,
                    pickupAddress: '',
                    isPickupClicked: true,
                    isDropOffClicked: false,
                    isNew: false,
                    isAgainChangeAddress: false,
                  });
                }}>
                <View
                  style={{
                    padding: 10,
                    borderRadius: 4,
                    marginBottom: 5,
                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      marginStart: 10,
                      color: colors.subHeadingColor,
                    }}>
                    {t('Select pick up location')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  borderRadius: 4,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text style={{color: 'black'}}>{t('Pick up from')}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(Routes.My_Address, {
                        isFromCourier: true,
                        pickupAddress: '',
                        isPickupClicked: true,
                        isDropOffClicked: false,
                        isNew: false,
                        isAgainChangeAddress: true,
                      });
                      //is changing address again
                      // setIsAgainChangeAddress(true)

                      //once click on change button clear rates and weight.

                      setValidRoute();
                      setData(prevData => ({
                        ...prevData,
                        packageWeight: 0,
                        packageName: '',
                        packageQty: 0,
                        maxKg: 0,
                        minKg: 0,
                        cost: 0,
                        warehouseFee: 0,
                        InterIslandRateId: 0,
                        InterIslandVal: '',
                      }));

                      setPerishable(false);
                      setNonPerishable(false);

                      setChecked('');
                      setIsService(true);
                    }}>
                    <Text
                      style={{
                        marginStart: 0,
                        color: colors.primaryGreenColor,
                        fontWeight: 'bold',
                      }}>
                      {t('Change')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    padding: 10,
                    borderRadius: 4,
                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}>
                  <Text style={{marginStart: 0, color: 'black'}}>
                    {pickupTitle}
                  </Text>
                </View>
              </View>
            )}

            {/* delivert location */}
            {dropOffAddress === '' ? (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.My_Address, {
                    isFromCourier: true,
                    dropOffAddress: '',
                    isPickupClicked: false,
                    isDropOffClicked: true,
                    isNew: false,
                    isAgainChangeAddress: false,
                    pickupTitle: pickupTitle, // Maintain the existing
                    pickupAddress: pickupAddress, // Maintain the existing
                    pickupLat: pickupLat, // Maintain the existing
                    pickupLng: pickupLng, // Maintain the existing
                    idp: idp, // Maintain the existing
                    subDistrictIdPickUp: subDistrictIdPickUp, // Maintain the existing
                  });
                }}>
                <View
                  style={{
                    padding: 10,
                    borderRadius: 4,
                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      marginStart: 10,
                      color: colors.subHeadingColor,
                    }}>
                    {t('Select delivery location')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  borderRadius: 4,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                    }}>
                    {t('Deliver to')}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(Routes.My_Address, {
                        isFromCourier: true,
                        dropOffAddress: '',
                        isPickupClicked: false,
                        isDropOffClicked: true,
                        isNew: false,
                        isAgainChangeAddress: false,
                        pickupTitle: pickupTitle, // Maintain the existing
                        pickupAddress: pickupAddress, // Maintain the existing
                        pickupLat: pickupLat, // Maintain the existing
                        pickupLng: pickupLng, // Maintain the existing
                        idp: idp, // Maintain the existing
                        subDistrictIdPickUp: subDistrictIdPickUp, // Maintain the existing
                      });
                      setData(prevData => ({
                        ...prevData,
                        packageWeight: 0,
                      }));
                      setChecked('');
                      setIsService(true);
                    }}>
                    <Text
                      style={{
                        marginStart: 0,
                        color: colors.primaryGreenColor,
                        fontWeight: 'bold',
                      }}>
                      {t('Change')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    padding: 10,
                    borderRadius: 4,

                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <Text style={{marginStart: 0, color: 'black'}}>
                    {dropOffTitle}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {pickupLat !== 0 && dropOffLat !== 0 && isService && (
            <Text
              style={{
                fontFamily: Fonts.RUBIK_MEDIUM,
                fontSize: Typography.P2,
                color: colors.headingColor,
                marginBottom: 3,

                width: '100%',
              }}>
              Item Details
            </Text>
          )}

          {pickupLat !== 0 && dropOffLat !== 0 && isService && (
            <View style={screenStyles.itemDetailsContainer}>
              {/* Wet/Dry */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginBottom: perishableError ? 0 : 15,
                  }}>
                  <View style={{flex: 0.5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        color="#2d2e7d"
                        uncheckedColor="#C0C0C0"
                        value="VA"
                        status={perishable ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setPerishableError(false);
                          if (perishable) {
                            setPerishable(false);
                            setNonPerishable(false);
                          } else {
                            setPerishable(true);
                            setNonPerishable(false);
                          }
                        }}
                      />
                      <Text style={screenStyles.textPayment}>Wet</Text>
                    </View>
                  </View>

                  <View style={{flex: 0.5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        color="#2d2e7d"
                        uncheckedColor="#C0C0C0"
                        value="VA"
                        status={nonPerishable ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setPerishableError(false);
                          if (nonPerishable) {
                            setNonPerishable(false);
                            setPerishable(false);
                          } else {
                            setNonPerishable(true);
                            setPerishable(false);
                          }
                        }}
                      />
                      <Text style={screenStyles.textPayment}>Dry</Text>
                    </View>
                  </View>
                </View>

                {perishableError && (
                  <Text style={{color: 'red', marginBottom: 15}}>
                    Please select item type you want to send
                  </Text>
                )}
              </View>

              {/* Package Name */}
              <View>
                <AppInput
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.Courier}
                  containerStyle={{
                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor: 'white',
                    marginBottom: 8,
                  }}
                  placeholder={'Package name'}
                  value={data?.packageName}
                  onChangeText={text => {
                    setIsPackageNameError(false);
                    setData(prevData => ({
                      ...prevData,
                      packageName: text,
                    }));
                  }}
                  //autoFocus={true}
                  // returnKeyLabel={"next"}
                  // returnKeyType={"next"}
                  keyboardType={'default'}
                />

                {isPackageNameError && (
                  <Text style={{color: 'red'}}>Enter package name</Text>
                )}
              </View>

              {/* Item Type */}
              {deliveryIn == 2 &&
                validRoute?.routeLists.find(route => route.id === 1)
                  ?.isInterIsLand && (
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
                      console.log(
                        'InterIsland selected val---------',
                        interIsLandRate[val - 1],
                      );

                      setData(prevData => ({
                        ...prevData,
                        packageWeight: 0,
                        maxKg: interIsLandRate[val - 1]?.data?.maxKg,
                        minKg: interIsLandRate[val - 1]?.data?.minKg,
                        cost: interIsLandRate[val - 1]?.data?.cost,
                        warehouseFee:
                          interIsLandRate[val - 1]?.data?.warehouseFee,
                        InterIslandRateId:
                          interIsLandRate[val - 1]?.data?.InterIslandRateId,
                        InterIslandVal:
                          interIsLandRate[val - 1]?.data?.InterIslandVal,
                      }));
                    }}
                    data={interIsLandRate}
                    save={'key'}
                    defaultOption={{
                      key: -1,
                      value: MyComponent,
                    }}
                  />
                )}

              {/* Quality and weight */}
              <View style={{flexDirection: 'row', flex: 1}}>
                {/* Quality */}
                <View style={{flex: 1, marginRight: 2}}>
                  <AppInput
                    textInputRef={r => (inputRef = r)}
                    showLeftIcon={false}
                    containerStyle={{
                      borderColor: '#d4d4d4',
                      borderWidth: 1,
                      borderRadius: 4,
                      backgroundColor: 'white',
                    }}
                    placeholder={'Quantity'}
                    value={data?.packageQty}
                    //autoFocus={true}
                    // returnKeyLabel={"next"}
                    // returnKeyType={"next"}
                    keyboardType={'numeric'}
                    onChangeText={text => {
                      //setQuantity(text);
                      const regex = /[ ,.\-]/;

                      if (regex.test(text)) {
                        ToastAndroid.show(
                          'Please add valid quantity',
                          ToastAndroid.SHORT,
                        );
                      } else {
                        setIsPackageQantityError(false);
                        setData(prevData => ({
                          ...prevData,
                          packageQty: text,
                        }));
                      }
                    }}
                  />

                  {isPackageQantityError && (
                    <Text style={{color: 'red'}}>Qantity is required</Text>
                  )}
                </View>

                {/* Weight */}
                <View style={{flex: 1, marginLeft: 2}}>
                  <AppInput
                    textInputRef={r => (inputRef = r)}
                    showLeftIcon={false}
                    containerStyle={{
                      borderColor: '#d4d4d4',
                      borderWidth: 1,
                      borderRadius: 4,
                      backgroundColor: 'white',
                    }}
                    placeholder={'Weight in kg'}
                    value={data?.packageWeight}
                    keyboardType={'number-pad'}
                    onKeyPress={handleKeyPress}
                    onChangeText={text => {
                      setIsPackageWeightError(false);
                      setisBackPressed(false);
                      //check enter valid number
                      const regex = /[ @'/_,.\-]/;
                      if (regex.test(text)) {
                        ToastAndroid.show(
                          'Please add valid weight',
                          ToastAndroid.SHORT,
                        );
                        return false;
                      }

                      setData(prevData => ({
                        ...prevData,
                        packageWeight: text,
                      }));

                      // if (
                      //   validRoute?.routeLists[0].isInterIsLand &&
                      //   text.length != 0 &&
                      //   (!(text >= data.minKg) || !(text <= data.maxKg))
                      // ) {
                      //   Alert.alert(
                      //     'Weight',
                      //     'Please select item type based on item weight.',
                      //     [
                      //       {
                      //         text: 'ok',
                      //         onPress: () => console.log('Cancel Pressed'),
                      //         style: 'cancel',
                      //       },
                      //     ],
                      //   );
                      //   // return false;
                      // }
                    }}
                  />

                  {isPackageWeightError && (
                    <Text style={{color: 'red'}}>Weight is required</Text>
                  )}
                </View>
              </View>
              {/* Find the rate */}
              <View>
                <TouchableOpacity
                  onPress={() => {
                    scrollToBottom(390);
                    getRatesOnClick();
                    Keyboard.dismiss();
                  }}>
                  <View
                    style={{
                      backgroundColor: colors.primaryGreenColor,
                      padding: 8,
                      borderRadius: 8,
                      marginTop: 10,
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        screenStyles.sectionHeadingText,
                        {color: 'white'},
                      ]}>
                      Find the rates
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Text Rate */}
          {isBackPressed &&
          data?.packageWeight != 0 &&
          routeRate?.rate?.cost != 0 &&
          deliveryIn == 2 ? (
            <Text
              style={{
                fontFamily: Fonts.RUBIK_MEDIUM,
                fontSize: Typography.P2,
                color: colors.headingColor,
                marginVertical: 10,
                width: '100%',
              }}>
              Rate
            </Text>
          ) : null}

          {/* Rate values*/}
          {isBackPressed &&
            data?.packageWeight != 0 &&
            routeRate != null &&
            deliveryIn == 2 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  {routeRate?.fastestRate?.totalKgCost !== 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        width: '100%',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        color="#2d2e7d"
                        uncheckedColor="#2d2e7d"
                        value="first"
                        status={checked === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => {
                          scrollToBottom(490);
                          // setIsSelectedPaymentMethodError(false);
                          setisRateSelectedd(false);
                          isRateSelected.current = 1;
                          setData(prevData => ({
                            ...prevData,
                            routeId: routeRate?.fastestRate?.routeId,
                            totalKgCost: routeRate?.fastestRate?.totalKgCost,
                            optionId: routeRate?.fastestRate?.optionId,
                            duration: routeRate?.fastestRate?.duration,
                            selectedRateId: validRoute?.routeLists.find(
                              item => item.id === 1,
                            )?.id,
                            selectedRateName: validRoute?.routeLists.find(
                              item => item.id === 1,
                            )?.name,
                            selectedRateInterIsLand:
                              validRoute?.routeLists.find(item => item.id === 1)
                                ?.isInterIsLand,
                          }));
                          setChecked('first');
                        }}
                      />
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#d4d4d4',
                          borderRadius: 5,
                          paddingVertical: 8,
                          backgroundColor:
                            checked == 'first'
                              ? colors.primaryGreenColor
                              : 'white',
                          alignItems: 'center',
                          paddingHorizontal: 6,
                        }}>
                        <TouchableOpacity>
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
                                    ? 'black'
                                    : 'white',
                              }}>
                              {routeRate?.fastestRate?.duration} Hours
                            </Text>

                            <View
                              style={{
                                borderWidth: 0.5,
                                marginVertical: 6,
                                borderColor:
                                  checked == 'first' ? 'white' : 'black',
                                width: '100%',
                              }}></View>
                            <Text
                              style={{
                                color:
                                  isRateSelected.current !== 1
                                    ? 'black'
                                    : 'white',
                              }}>
                              From Rp {routeRate?.fastestRate?.totalKgCost}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {routeRate?.cheapestRate?.totalKgCost !== 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        width: '100%',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        color="#2d2e7d"
                        uncheckedColor="#2d2e7d"
                        value="second"
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => {
                          scrollToBottom(490);
                          // setIsSelectedPaymentMethodError(false);

                          setisRateSelectedd(false);
                          isRateSelected.current = 2;
                          setData(prevData => ({
                            ...prevData,
                            routeId: routeRate?.cheapestRate?.routeId,
                            totalKgCost: routeRate?.cheapestRate?.totalKgCost,
                            optionId: routeRate?.cheapestRate?.optionId,
                            duration: routeRate?.cheapestRate?.duration,
                            selectedRateId: validRoute?.routeLists.find(
                              item => item.id === 0,
                            )?.id,
                            selectedRateName: validRoute?.routeLists.find(
                              item => item.id === 0,
                            )?.name,
                            selectedRateInterIsLand:
                              validRoute?.routeLists.find(item => item.id === 0)
                                ?.isInterIsLand,
                          }));
                          setChecked('second');
                        }}
                      />
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#d4d4d4',
                          borderRadius: 5,
                          paddingVertical: 8,
                          backgroundColor:
                            checked == 'second'
                              ? colors.primaryGreenColor
                              : 'white',
                          alignItems: 'center',
                          paddingHorizontal: 6,
                        }}>
                        <TouchableOpacity>
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
                                    ? 'black'
                                    : 'white',
                              }}>
                              {routeRate?.cheapestRate?.duration} Hours
                            </Text>

                            <View
                              style={{
                                borderWidth: 0.5,
                                marginVertical: 6,
                                borderColor:
                                  isRateSelected.current !== 2
                                    ? 'black'
                                    : 'white',
                                width: '100%',
                              }}></View>
                            <Text
                              style={{
                                color:
                                  isRateSelected.current !== 2
                                    ? 'black'
                                    : 'white',
                              }}>
                              From Rp {routeRate?.cheapestRate?.totalKgCost}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

          {/* Please select rate*/}
          {isRateSelectedd && data.packageWeight !== 0 && (
            <Text style={{color: 'red'}}>Please select rate</Text>
          )}

          {/* Button Next*/}
          {isBackPressed && data?.packageWeight != 0 && (
            <View style={{marginBottom: 23}}>
              <TouchableOpacity
                onPress={() => {
                  goToNextPage();
                }}>
                <View
                  style={{
                    backgroundColor: colors.primaryGreenColor,
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 10,
                    flexDirection: 'row',
                    width: '30%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={[screenStyles.sectionHeadingText, {color: 'white'}]}>
                    Next
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
