import React, {useRef, useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
//test push

import Carousel, {Pagination} from 'react-native-snap-carousel';

import {FoodItem} from '../../../components/Application/FoodItem/View';
import {CategoryItem} from '../../../components/Application/CategoryItem/View';
import {SearchButton} from '../../../components/Application/SearchButton/View';
import {useFocusEffect} from '@react-navigation/native';

import {Styles} from './Styles';
import Routes from '../../../navigation/Routes';
import Globals from '../../../utils/Globals';
import RBSheet from 'react-native-raw-bottom-sheet';
import {FavouritesBottomSheet} from '../../../components/Application/FavouritesBottomSheet/View';
import {useTheme} from '@react-navigation/native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import {SvgIcon} from '../../../components/Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import {FocusAwareStatusBar} from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import {Variant1Header} from '../Header/View';
import axios from 'axios';
import AppConfig from '../../../../branding/App_config';
import {ProductService} from '../../../apis/services/product';
import {BestSellingStoreItem} from '../../../components/Application/BestSellingStoreItem/View';
import {NearByStore} from '../../../components/Application/NearByStoreItem/View';
import {ChatService, ShopService} from '../../../apis/services';
const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
import {useDispatch, useSelector} from 'react-redux';
import {
  addProducts,
  cartCount,
  clearProducts,
  freshGoodAddProducts,
  freshGoodTotalPrice,
  groceryTotalPrice,
} from '../../../redux/features/AddToCart/ProductSlice';
import {useTranslation} from 'react-i18next';
import {GlobalSearchButton} from '../../../components/Application/GlobalSearchButton/View';
import {showToast} from '../../../utils/ToastMessage';
import {BottomCartItem} from '../../../components/Application/BottomCartItem/View';

//Constants
// const slider_data = [
//   {
//     img: require('./Assets/Images/c_slider_img_1.png'),
//   },
//   {
//     img: require('./Assets/Images/c_slider_img_2.png'),
//   },
//   {
//     img: require('./Assets/Images/c_slider_img_3.png'),
//   },
// ];

export const Variant1Home = props => {
  const {t, i18n} = useTranslation();

  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);
  const [categories, setCategories] = useState();
  const [nearStore, setNearStore] = useState([]);
  const [bannersForGrocery, setBannersForGrocery] = useState([]);
  const [bannersForFood, setBannersForFood] = useState([]);
  const [bannersForFresh, setBannersForFresh] = useState([]);

  const [categoryTypeId, setCategoryTypeId] = useState(
    props?.route?.params?.categoryTypeId,
  );
  const [isLoaderCate, setLoaderCate] = useState(true);
  const [isLoaderBestSeller, setLoaderBestSeller] = useState(true);
  const [isLoaderNearByStore, setLoaderNearByStore] = useState(true);
  const [bestSellingName, setBestSellingName] = useState('');
  const [showButton, setShowButton] = useState(true);

  //Redux
  const dispatch = useDispatch();

  //References
  const _carousel = useRef();
  let _favouriteSheet = useRef();

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);
  const cartCountt = useSelector(state => state.product.cartCount);

  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);
  //  const lngSelectedSlice = useSelector(state => state.addressReducer.deliveryLat);

  const Item = ({icons, onPress, name}) => (
    <View>
      <TouchableOpacity
        style={{marginHorizontal: 6}}
        activeOpacity={0.6}
        onPress={onPress}>
        <View
          style={{
            width: 100,
            height: 140,
            borderRadius: 7,
            backgroundColor: 'white',
            borderColor: 'black',
            borderWidth: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              textTransform: 'uppercase',
              fontFamily: Fonts.RUBIK_MEDIUM,
              fontSize: Typography.P4,
            }}>
            {name}
          </Text>

          {/* <Image
                      style={{width:"100%",height:210,borderRadius:7}}
                      resizeMode='cover'
                      source={icons}
                     /> */}
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPromotionSlider = () => {
    return (
      <View style={screenStyles.promotionSliderContainer}>
        <Carousel
          ref={_carousel}
          //data={slider_data}
          data={
            categoryTypeId == 1
              ? bannersForGrocery
              : categoryTypeId == 2
              ? bannersForFood
              : bannersForFresh
          }
          renderItem={({item}) => {
            return (
              <TouchableOpacity
              //   onPress={() => {
              //     props.navigation.navigate(Routes.POPULAR_DEALS);
              //   }
              // }
              >
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
          // onSnapToItem={index => setActiveSlideIndex(index)}
          autoplay
          autoplayInterval={5000}
          loop
        />
        <Pagination
          //dotsLength={slider_data.length}
          dotsLength={
            categoryTypeId == 1
              ? bannersForGrocery.length
              : categoryTypeId == 2
              ? bannersForFood.length
              : bannersForFresh.length
          }
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
    );
  };

  const handleSearch = query => {
    // Update the searchQuery state with the received query
    // Perform any additional actions related to search (if needed)
    // ... your search logic ...
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (categoryTypeId === 1) {
  //         await getGroceryNearStore();
  //       } else {
  //         await getRestaurantNearStore();
  //       }

  //       await getCartCount(props?.route?.params?.categoryTypeId);
  //       await getCategories(props?.route?.params?.categoryTypeId);

  //       setLoaderCate(true);
  //       setLoaderNearByStore(true);
  //     } catch (error) {
  //       // Handle errors here
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  /////////////////deepak///////////////////////

  // useEffect(() => {
  //   // if (categoryTypeId === 1) {
  //   //   // setBestSellingName('Store');
  //   //   getGroceryNearStore();
  //   // } else {
  //   //   //setBestSellingName('Restaurant');
  //   //   getRestaurantNearStore();
  //   //
  //   // }

  //   if (categoryTypeId == 1) {
  //     getGroceryNearStore();
  //   } else {
  //     getRestaurantNearStore();
  //   }
  //   getCartCount(props?.route?.params?.categoryTypeId);
  //   getCategories(props?.route?.params?.categoryTypeId);
  //   setLoaderCate(true)
  //   setLoaderNearByStore(true)
  // }, [latSlice]);

  /////////////////deepak///////////////////////

  //latSlice, lngSlice
  useFocusEffect(
    React.useCallback(() => {
      fetchDataForDeviceToDevice();
      if (categoryTypeId == 1) {
        getWelcomeBannersForGrocery();
        getGroceryNearStore();
      } else if (categoryTypeId == 2) {
        getWelcomeBannersForFood();
        getRestaurantNearStore();
      } else if (categoryTypeId == 5) {
        getWelcomeBannersForFresh();
        getFreshNearStore();
      }
      getCartCount(props?.route?.params?.categoryTypeId);
      getCategories(props?.route?.params?.categoryTypeId);
      setLoaderCate(true);
      setLoaderNearByStore(true);
      //getChatServiceFunc()

      // ...
    }, [latSlice, lngSlice]),
  );
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
  // Grocery Banner
  const getWelcomeBannersForGrocery = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;

    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          const filterGroceryBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Grocery',
          );
          setBannersForGrocery(filterGroceryBanners);
        } else {
          console.log('isSuccess false');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // Food Banner
  const getWelcomeBannersForFood = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          console.log('get-Banneerrss#################', response.data.payload);
          const filterFoodBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Food',
          );
          setBannersForFood(filterFoodBanners);
        } else {
          console.log('isSuccess false');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // Fresh Banner
  const getWelcomeBannersForFresh = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;

    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          const filterFreshBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Fresh Goods',
          );
          setBannersForFresh(filterFreshBanners);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const getCartCount = async categoryTypeId => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const data = await ProductService.getcartCountByStore(
        categoryTypeId,
        deliveryIn,
        getUserId,
      );

      if (data.data.payload == null) {
        let count = 0; //cartCount
        dispatch(cartCount({count}));
        dispatch(clearProducts(categoryTypeId));
      } else {
        let count = data.data.payload.length;
        dispatch(cartCount({count}));
      }
    } catch (error) {
      console.log('getcartCountByStore---home', error);
    }
  };

  const getGroceryNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      latitude: latSlice,
      longitude: lngSlice,
      userId: getUserId,
    };

    console.log('getGroceryNearStoreHome_Request=======', body);

    try {
      const responseNearShop = await ShopService.getGroceryNearShop(body);
      console.log('getGroceryNearStoreHome_Response=======', responseNearShop);

      if (responseNearShop.data.isSuccess) {
        setLoaderNearByStore(false);

        setNearStore(responseNearShop.data.payload);
      } else {
        setLoaderNearByStore(false);
        setNearStore([]);
      }
    } catch (error) {
      setLoaderNearByStore(false);
      console.log('error==>', error);
    }
  };

  const getRestaurantNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      latitude: latSlice,
      longitude: lngSlice,
      userId: getUserId,
    };

    try {
      const responseNearShop = await ShopService.getRestaurantNearShop(body);
      if (responseNearShop.data.isSuccess) {
        setLoaderNearByStore(false);

        setNearStore(responseNearShop.data.payload);
        console.log(
          'getRestaurantNearStore-------------',
          responseNearShop.data.payload,
        );
      } else {
        setLoaderNearByStore(false);
        setNearStore([]);
      }
    } catch (error) {
      setLoaderNearByStore(false);
      console.log('error==>', error);
    }
  };

  const getFreshNearStore = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      latitude: latSlice,
      longitude: lngSlice,
      userId: getUserId,
    };

    console.log('-----------------freshtohome-----------', body);

    try {
      const responseNearShop = await ShopService.getFreshNearShop(body);
      if (responseNearShop.data.isSuccess) {
        setLoaderNearByStore(false);

        setNearStore(responseNearShop.data.payload);
      } else {
        setLoaderNearByStore(false);
        setNearStore([]);
      }
    } catch (error) {
      setLoaderNearByStore(false);
      console.log('error==>', error);
    }
  };

  const getCategories = async categoryTypeId => {
    try {
      const responseCategori = await ShopService.getCategories(categoryTypeId);
      setLoaderCate(true);
      if (responseCategori?.data.isSuccess) {
        setLoaderCate(false);
        responseCategori.data.payload !== null &&
          setCategories(responseCategori.data.payload);
      } else {
        setLoaderCate(false);
      }
    } catch (error) {
      setLoaderCate(false);
      console.log('errorgetCategories==>', error);
    }
  };

  const scrollToTop = (layoutMeasurement, contentOffset, contentSize) => {
    if (layoutMeasurement.height + contentOffset.y <= contentSize.height - 20) {
      return setShowButton(true);
    } else {
      return setShowButton(false);
    }
  };
  const onScroll = event => {
    scrollToTop(
      event.nativeEvent.layoutMeasurement,
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
    );
  };
  //initialize
  const fetchDataForDeviceToDevice = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    const data = await ProductService.getcartCountByStore(
      categoryTypeId,
      deliveryIn,
      getUserId,
    );
    if (data?.data?.isSuccess) {
      //data.data.payload

      let count = data.data.payload ? data.data.payload.length : 0;
      dispatch(cartCount({count}));

      let totalPrice = 0;
      data?.data.payload.map((val, key) => {
        totalPrice = totalPrice + val.cartPrice;
      });

      {
        categoryTypeId == 1 &&
          dispatch(
            addProducts({
              groceryList: data.data.payload,
              getUserId: getUserId,
              behaviour: 'Home',
            }),
          );
      }
      {
        categoryTypeId == 1 &&
          dispatch(
            groceryTotalPrice({totalPricess: totalPrice, behaviour: 'Home'}),
          );
      }

      {
        categoryTypeId == 5 &&
          dispatch(
            freshGoodAddProducts({
              groceryList: data.data.payload,
              getUserId: getUserId,
              behaviour: 'Home',
            }),
          );
      }
      {
        categoryTypeId == 5 &&
          dispatch(
            freshGoodTotalPrice({totalPricess: totalPrice, behaviour: 'Home'}),
          );
      }
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <LinearGradient
        //colors={['#4E9F3D', '#209650', colors.primaryGreenColor]}
        colors={[colors.buttonBackground, '#31b5e7', '#ffffff']}
        angle={180}
        useAngle={true}
        style={{
          padding: 0,
          // borderBottomLeftRadius: 15,
          // borderBottomRightRadius: 15,
        }}>
        <View
          style={{
            paddingBottom: hp(0.85),
            paddingHorizontal: 10,
            marginHorizontal: 10,
          }}>
          <Variant1Header
            isVisiable={true}
            navigation={props.navigation}
            categoryTypeId={props?.route?.params?.categoryTypeId}
          />
        </View>

        {/* Search Bar-------------------------------------------------------------------------------------------------------- */}
        <View style={{width: '100%'}}>
          <GlobalSearchButton
            name={
              categoryTypeId == 1
                ? 'Mart'
                : categoryTypeId == 2
                ? 'Food'
                : categoryTypeId == 5
                ? 'Fresh Good'
                : ''
            }
            onPress={() =>
              props.navigation.navigate(Routes.SEARCH, {
                categoryTypeId: categoryTypeId,
              })
            }
          />
        </View>
      </LinearGradient>

      <ScrollView onScroll={onScroll}>
        <View style={screenStyles.parentWrapper}>
          {/* Grocery Items */}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Globals.foodItems}
            numColumns={2}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            ListHeaderComponent={() => {
              return (
                <>
                  {renderPromotionSlider()}

                  {/* Categories */}
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(Routes.CATEGORY_LIST, {
                        categoryTypeId: props?.route.params.categoryTypeId,
                      });
                    }}>
                    <View style={screenStyles.sectionHeading}>
                      <Text style={screenStyles.sectionHeadingText}>
                        {t('Categories')}
                      </Text>

                      <SvgIcon
                        type={IconNames.ArrowRight}
                        width={20}
                        height={20}
                        color={colors.subHeadingColor}
                      />
                    </View>
                  </TouchableOpacity>

                  {isLoaderCate ? (
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={Globals.foodItems}
                      style={{marginTop: 0, marginBottom: 10}}
                      renderItem={({item, index}) => {
                        return (
                          <View>
                            <ShimmerPlaceholder
                              style={{
                                width: wp('29%'),
                                height: hp('18'),
                                marginRight: wp('2'),
                                marginBottom: wp('2'),
                                borderRadius: 4,
                              }}></ShimmerPlaceholder>
                          </View>
                        );
                      }}
                    />
                  ) : (
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={categories}
                      style={{
                        marginTop: 0,
                        marginBottom: 5,
                      }}
                      keyExtractor={(item, index) => {
                        return item.id;
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <View>
                            <CategoryItem
                              navigation={props.navigation}
                              secondaryTitle={item.secondaryTitle}
                              secondaryColor={item.secondaryColor}
                              primaryTitle={item.name}
                              primaryColor={item.primaryColor}
                              iconBgColor={item.iconBgColor}
                              iconURI={item.iconURI}
                              bgURI={item.bgURI}
                              imgURL={item.imageUrl}
                              categoryId={item.id}
                              categoryTypeId={
                                props?.route.params.categoryTypeId
                              }
                            />
                          </View>
                        );
                      }}
                    />
                  )}

                  {/* Near by Store */}
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(Routes.NEARBYSTORE_LIST, {
                        listNearByStore: nearStore,
                        navigation: props.navigation,
                        categoryTypeId: props?.route.params.categoryTypeId,
                      });
                    }}>
                    <View style={screenStyles.sectionHeading}>
                      <Text style={screenStyles.sectionHeadingText}>
                        {props?.route.params.categoryTypeId == 1
                          ? t('Near by Stores')
                          : props?.route.params.categoryTypeId == 2
                          ? t('Near by Restaurant')
                          : t('Fresh Good Shops')}
                      </Text>
                      <SvgIcon
                        type={IconNames.ArrowRight}
                        width={20}
                        height={20}
                        color={colors.subHeadingColor}
                      />
                    </View>
                  </TouchableOpacity>

                  {isLoaderNearByStore ? (
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={Globals.foodItems}
                      style={{marginTop: 0, marginBottom: 10}}
                      renderItem={({item, index}) => {
                        return (
                          <View>
                            <ShimmerPlaceholder
                              style={{
                                width: wp('29%'),
                                height: hp('18'),
                                marginRight: wp('2'),
                                marginBottom: wp('2'),
                                borderRadius: 4,
                              }}></ShimmerPlaceholder>
                          </View>
                        );
                      }}
                    />
                  ) : nearStore.length == 0 ? (
                    props?.route.params.categoryTypeId == 1 ? (
                      <Text>
                        We're sorry, but there are currently no serviceable
                        stores in your area. Please change your delivery
                        address.
                      </Text>
                    ) : props?.route.params.categoryTypeId == 2 ? (
                      <Text>
                        We're sorry, but there are currently no serviceable
                        restaurants in your area. Please change your delivery
                        address.
                      </Text>
                    ) : (
                      <Text>
                        We're sorry, but there are currently no serviceable Shop
                        in your area. Please change your delivery address.
                      </Text>
                    )
                  ) : (
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={nearStore}
                      style={{marginTop: 0, marginBottom: 10}}
                      keyExtractor={(item, index) => {
                        return item.id;
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <View>
                            <NearByStore
                              navigation={props.navigation}
                              id={item.id}
                              partnerName={item.partnerName}
                              latitude={item.latitude}
                              longitude={item.longitude}
                              openingHrs={item.openingHrs}
                              closingHrs={item.closingHrs}
                              districtName={item.districtName}
                              photo={item.photo}
                              ratingCount={item.ratingCount}
                              avarageRating={item.avarageRating}
                              userFavorite={item.isfavorite}
                              categoryTypeId={
                                props?.route.params.categoryTypeId
                              }
                              autoOpen={item.autoOpen}
                            />
                          </View>
                        );
                      }}
                    />
                  )}
                </>
              );
            }}
          />
        </View>
      </ScrollView>

      {cartCountt !== 0 && showButton && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 18,
            width: '90%',
          }}>
          <BottomCartItem
            categoryTypeId={props?.route.params.categoryTypeId}
            navigation={props.navigation}
          />
        </View>
      )}
    </View>
  );
};
