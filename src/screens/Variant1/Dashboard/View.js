import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
  ToastAndroid,
  ScrollView,
} from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Styles} from './Styles';
import Routes from '../../../navigation/Routes';
import Globals from '../../../utils/Globals';
import {useTheme} from '@react-navigation/native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';

import {Variant1Header} from '../Header/View';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {BackHandler, DeviceEventEmitter} from 'react-native';
import {CommomService} from '../../../apis/services/Common';
import AppConfig from '../../../../branding/App_config';
import {
  deliveryIn,
  setAutoRefreshTrackingInterval,
  setConfigurationTesting,
  setCustomerMinWallterAmount,
  setMaximumRideDistance,
  setMaximumSendDistance,
  setMinimumRideDistance,
  setMinimumSendDistance,
  setNearByCity,
  setNearByFreshGoodsDistance,
  setNearByRestaurantDistance,
  setNearByShopDistance,
  setPaymentInterval,
  setShowHeading,
} from '../../../redux/features/Dashboard/dashboardSlice';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const fonts = AppConfig.fonts.default;
import {useTranslation} from 'react-i18next';
import {GlobalSearchButton} from '../../../components/Application/GlobalSearchButton/View';
import {LocalStorageGet, LocalStorageSet} from '../../../localStorage';
import {useFocusEffect} from '@react-navigation/native';
import {AuthService, ChatService} from '../../../apis/services';
import PushController from '../../../utils/PushController';
import {notificationStore} from '../../../redux/features/Notification/notificationSlice';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCreditCard,
  faDroplet,
  faLightbulb,
  faPhone,
  faWifi,
  faPlugCircleBolt,
  faPlugCirclePlus,
  faPlugCircleXmark,
  faPlug,
  faSignal5,
  faHandHoldingDroplet,
  faTarpDroplet,
  faDropletSlash,
  faEyeDropper,
} from '@fortawesome/free-solid-svg-icons';
import {watchPosition} from 'react-native-geolocation-service';

export const Variant1Dashboard = React.memo(props => {
  //translation and navigation
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  //redux
  let notify = useSelector(state => state.notification.notificationMessage);
  const dispatch = useDispatch();

  const [categoriesTypes, setCategoriType] = useState([]);
  const [deliverInData, setDeliverInData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  if (notify == 'New Order') {
    props.navigation.navigate(Routes.MY_ORDERS);
    dispatch(notificationStore(''));
  }
  const [refreshing, setRefreshing] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [interDeliveryName, setInterDeliveryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [bannersCarbonClick, setBannersCarbonClick] = useState([]);

  const [deliveryInId, setDeliveryInId] = useState(0);

  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  const [showStoreBottomSheetComponent, setStoreBottomSheetComponent] =
    useState(false);

  const Item = ({icons, onPress, name, imgURL}) => (
    <View>
      <TouchableOpacity
        // style={[screenStyles.item, { borderWidth: 0.5, }]}
        activeOpacity={0.6}
        onPress={onPress}>
        <Image
          style={{
            width: widthPercentageToDP(45),
            height: heightPercentageToDP(22),
            alignSelf: 'center',
            // marginEnd: 10,
          }}
          resizeMode="contain"
          source={{
            uri: `${Globals.imgBaseURL}${imgURL}`,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const deliveryBasedServices = async deliveryInId => {
    try {
      setLoading(true);
      let response = await CommomService.getCategoriesTypes(deliveryInId);

      if (response.data.isSuccess) {
        setLoading(false);
        console.log('HOMEPAGE ICONS----------------', response.data);
        setCategoriType(response.data.payload);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    if (checkPermission !== RESULTS.GRANTED) {
      const request = await requestNotificationPermission();
      if (request !== RESULTS.GRANTED) {
        // permission not granted
      }
    }
  };

  useEffect(() => {
    getDeliveryOptions();

    getConfiguration();
    getChatServiceFunc();
  }, []);

  const getChatServiceFunc = async () => {
    try {
      let response = await ChatService.getChatService();
      if (!response?.data?.isSuccess) {
        ToastAndroid.show(
          response?.data.message ||
            'An error occurred during get getChatService.',
          ToastAndroid.LONG,
        );
        return;
      } else {
        console.log('response get getChatService ==>', response?.data?.payload);
        LocalStorageSet('chatService', response?.data?.payload);
      }
    } catch (error) {
      // Cast 'error' to 'any' to handle the TypeScript error
      console.log('Error in getChatService:', error);
      ToastAndroid.show(
        'An error occurred while getChatService: ' + error.message,
        ToastAndroid.LONG,
      );
    }
  };

  const getConfiguration = async () => {
    const response = await CommomService.configs();
    try {
      if (response?.data?.isSuccess) {
        const NearByShopDistance = response.data.payload.find(
          item => item.name == 'NearByShopDistance',
        );
        const NearByRestaurantDistance = response.data.payload.find(
          item => item.name == 'NearByRestaurantDistance',
        );
        const ConfigurationTesting = response.data.payload.find(
          item => item.name == 'Configuration testing',
        );
        const MinimumSendDistance = response.data.payload.find(
          item => item.name == 'MinimumSendDistance',
        );
        const MaximumSendDistance = response.data.payload.find(
          item => item.name == 'MaximumSendDistance',
        );
        const MinimumRideDistance = response.data.payload.find(
          item => item.name == 'MinimumRideDistance',
        );
        const MaximumRideDistance = response.data.payload.find(
          item => item.name == 'MaximumRideDistance',
        );
        const CustomerMinWallterAmount = response.data.payload.find(
          item => item.name == 'Customer Min Wallter Amount',
        );
        const NearByCity = response.data.payload.find(
          item => item.name == 'Near By City',
        );
        const NearByFreshGoodsDistance = response.data.payload.find(
          item => item.name == 'NearByFreshGoodsDistance',
        );
        const AutoRefreshTrackingInterval = response.data.payload.find(
          item => item.name == 'AutoRefreshTrackingInterval',
        );
        const ShowHeading = response.data.payload.find(
          item => item.name == 'ShowHeading',
        );
        const PaymentInterval = response.data.payload.find(
          item => item.name == 'PaymentInterval',
        );

        dispatch(setMaximumSendDistance(Number(MaximumSendDistance.value)));
        dispatch(setShowHeading(Number(ShowHeading.value)));
        dispatch(setNearByShopDistance(Number(NearByShopDistance.value)));
        dispatch(setMaximumRideDistance(Number(MaximumRideDistance.value)));
        dispatch(setPaymentInterval(Number(PaymentInterval.value)));
        dispatch(
          setNearByRestaurantDistance(Number(NearByRestaurantDistance.value)),
        );
        dispatch(setConfigurationTesting(Number(ConfigurationTesting.value)));
        dispatch(setMinimumSendDistance(Number(MinimumSendDistance.value)));
        dispatch(setMinimumRideDistance(Number(MinimumRideDistance.value)));
        dispatch(
          setCustomerMinWallterAmount(Number(CustomerMinWallterAmount.value)),
        );
        dispatch(setNearByCity(Number(NearByCity.value)));
        dispatch(
          setNearByFreshGoodsDistance(Number(NearByFreshGoodsDistance.value)),
        );
        dispatch(
          setAutoRefreshTrackingInterval(
            Number(AutoRefreshTrackingInterval.value),
          ),
        );
      } else {
        console.log(
          'isSuccess false in configuration--',
          response?.data?.message,
        );
      }
    } catch (error) {
      console.log('Error in configuration---', error);
    }
  };

  const getDeliveryOptions = async () => {
    setLoading(true);
    const apiUrl = `${Globals.baseUrl}/Delivery/get-delivery-options`;
    console.log('serviceUrll', apiUrl);
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          if (response.data.payload !== null) {
            console.log('payload not null', response.data.payload[0].id);
            setDeliverInData(response.data.payload);
            setDeliveryInId(response.data.payload[0].id);
            setLoading(false);
            deliveryBasedServices(response.data.payload[0].id);
          } else {
            console.log('payload null');
            console.log(response.data.message);
            setLoading(false);
          }
        } else {
          console.log('isSuccess false');
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        // setCurrentLocation('');
        //dispatch(setDefaultAddress(''));
        setLoading(false);
        console.error('Error:', error);
      });
  };

  const _carousel = useRef();

  useEffect(() => {
    getDashBoardBanners();
  }, []);

  const getDashBoardBanners = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          const filterGroceryBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Home',
          );
          console.log('dashboard---home----->', filterGroceryBanners);
          setBannersCarbonClick(filterGroceryBanners);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const renderPromotionSlider = () => {
    return (
      <View>
        <Carousel
          ref={_carousel}
          //data={slider_data}
          data={bannersCarbonClick}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => {}}>
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

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('Exit', 'Are you sure you want to exit this app?', [
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              BackHandler.exitApp();
              //  RNExitApp.exitApp();
            },
          },
        ]);
        //RNExitApp.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => {
        // Your cleanup code when the screen is unfocused
        backHandler.remove();
      };
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDashBoardBanners().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <PushController navigation={props.navigation} />
      <View style={{flex: 1}}>
        {/* deliver in-------------------------------------------------------------- */}

        <LinearGradient
          //colors={[colors.buttonBackground, '#31b5e7', '#ffffff']}
          colors={['#ffffff', '#ffffff', '#ffffff']}
          angle={180}
          useAngle={true}
          style={{
            padding: 0,
          }}>
          <View
            style={{
              marginBottom: hp(0.85),
              //paddingBottom: hp(0.85),
              paddingHorizontal: 10,
              marginHorizontal: 10,
            }}>
            <Variant1Header isVisiable={false} navigation={props.navigation} />
          </View>

          {/* Search Bar-------------------------------------------------------------------------------------------------------- */}

          <View style={{width: '100%'}}>
            <GlobalSearchButton
              name={'Dishes, Restaurants, Groceries & More'}
              onPress={() => {
                //Hide deepak
                //  props.navigation.navigate(Routes.SEARCH)
                ToastAndroid.show(
                  'Service is not available',
                  ToastAndroid.SHORT,
                );
              }}
            />
          </View>
        </LinearGradient>

        {/* horizontal */}
        <View
          style={{
            flexDirection: 'row',
            //justifyContent: 'space-evenly',
            justifyContent: 'space-around',
            alignContent: 'center',

            height: heightPercentageToDP(8),
            marginTop: 5,
            marginBottom: 12,
          }}>
          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Under Process', ToastAndroid.SHORT);
            }}>
            <View
              style={{
                width: widthPercentageToDP(16),
                padding: 4,
              }}>
              <View
                style={[
                  screenStyles.newServicesBorder,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <FontAwesomeIcon
                  icon={faPlug}
                  style={{color: '#444'}}
                  size={24}
                />
              </View>
              <Text style={screenStyles.newServicesLabels}>Electricity</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Under Process', ToastAndroid.SHORT);
            }}>
            <View
              style={{
                width: widthPercentageToDP(16),
                padding: 4,
              }}>
              <View
                style={[
                  screenStyles.newServicesBorder,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <FontAwesomeIcon
                  icon={faDroplet}
                  style={{color: '#444'}}
                  size={24}
                />
              </View>
              <Text style={screenStyles.newServicesLabels}>Water Bill</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Under Process', ToastAndroid.SHORT);
            }}>
            <View
              style={{
                width: widthPercentageToDP(16),
                padding: 4,
              }}>
              <View
                style={[
                  screenStyles.newServicesBorder,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <FontAwesomeIcon
                  icon={faWifi}
                  style={{color: '#444'}}
                  size={24}
                />
              </View>
              <Text style={screenStyles.newServicesLabels}>Internet</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Under Process', ToastAndroid.SHORT);
            }}>
            <View
              style={{
                width: widthPercentageToDP(16),
                padding: 4,
              }}>
              <View
                style={[
                  screenStyles.newServicesBorder,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <FontAwesomeIcon
                  icon={faSignal5}
                  style={{color: '#444'}}
                  size={24}
                />
              </View>
              <Text style={screenStyles.newServicesLabels}>Mobile Data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              ToastAndroid.show('Under Process', ToastAndroid.SHORT);
            }}>
            <View
              style={{
                width: widthPercentageToDP(15),
                padding: 4,
              }}>
              <View
                style={[
                  screenStyles.newServicesBorder,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <FontAwesomeIcon
                  icon={faCreditCard}
                  style={{color: '#444'}}
                  size={24}
                />
              </View>
              <Text style={screenStyles.newServicesLabels}>E-Money</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[screenStyles.mainWrapper, {marginTop: 0}]}>
          {/* category types */}
          {isLoading ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={Globals.foodItems}
              numColumns={2}
              style={{marginTop: 0, marginBottom: 200}}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({item, index}) => {
                return (
                  <View>
                    <ShimmerPlaceholder
                      style={{
                        width: wp('100%'),
                        height: hp('18'),

                        marginBottom: wp('2'),
                        borderRadius: 4,
                      }}></ShimmerPlaceholder>
                  </View>
                );
              }}
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                height: heightPercentageToDP(65),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                {/* live banner */}
                {renderPromotionSlider()}

                {/* categoriesTypes list */}
                {categoriesTypes.map(item => {
                  return (
                    <View style={[screenStyles.foodLastItems]}>
                      <Item
                        name={item.name}
                        imgURL={item.categoryTypeImage}
                        onPress={() => {
                          if (item.categoryTypeId == 1) {
                            //Grocery
                            // props.navigation.navigate(item.categoryTypeName, {
                            //   categoryTypeId: item.categoryTypeId,
                            // });
                            //Hide Deepak
                            ToastAndroid.show(
                              'Coming Soon',
                              ToastAndroid.SHORT,
                            );
                            return;
                            props.navigation.navigate(Routes.GROCERY, {
                              //categoryTypeId: item.categoryTypeId,
                            });
                          } else if (item.categoryTypeId == 2) {
                            //Hide Deepak
                            ToastAndroid.show(
                              'Coming Soon',
                              ToastAndroid.SHORT,
                            );
                            return;
                            //Food
                            props.navigation.navigate(Routes.FOOD, {
                              categoryTypeId: item.categoryTypeId,
                            });
                          } else if (item.categoryTypeId == 4) {
                            //send
                            props.navigation.navigate(Routes.COURIER, {
                              categoryTypeId: item.categoryTypeId,
                            });
                          } else if (item.categoryTypeId == 3) {
                            //Ride
                            ToastAndroid.show(
                              'Coming Soon',
                              ToastAndroid.SHORT,
                            );
                            return;
                            props.navigation.navigate(Routes.RIDE, {
                              categoryTypeId: item.categoryTypeId,
                            });
                          } else if (item.categoryTypeId == 5) {
                            //Hide Deepak
                            ToastAndroid.show(
                              'Coming Soon',
                              ToastAndroid.SHORT,
                            );
                            return;
                            //Fresh
                            props.navigation.navigate(Routes.FRESH_GOODS, {
                              categoryTypeId: item.categoryTypeId,
                            });
                          }
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
});
