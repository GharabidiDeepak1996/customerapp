import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
//test push

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { FoodItem } from '../../../components/Application/FoodItem/View';
import { CategoryItem } from '../../../components/Application/CategoryItem/View';
import { SearchButton } from '../../../components/Application/SearchButton/View';
import { useFocusEffect } from '@react-navigation/native';

import { Styles } from './Styles';
import Routes from '../../../navigation/Routes';
import Globals from '../../../utils/Globals';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FavouritesBottomSheet } from '../../../components/Application/FavouritesBottomSheet/View';
import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { FocusAwareStatusBar } from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import { Variant1Header } from '../Header/View';
import axios from 'axios';
import AppConfig from '../../../../branding/App_config';
import { ProductService } from '../../../apis/services/product';
import { BestSellingStoreItem } from '../../../components/Application/BestSellingStoreItem/View';
import { NearByStore } from '../../../components/Application/NearByStoreItem/View';
import { ShopService } from '../../../apis/services';
const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
import { useDispatch, useSelector } from 'react-redux';
import { cartCount } from '../../../redux/features/AddToCart/ProductSlice';
import { useTranslation } from 'react-i18next';
import { GlobalSearchButton } from '../../../components/Application/GlobalSearchButton/View';

//Constants
const slider_data = [
  {
    img: require('./Assets/Images/c_slider_img_1.png'),
  },
  {
    img: require('./Assets/Images/c_slider_img_2.png'),
  },
  {
    img: require('./Assets/Images/c_slider_img_3.png'),
  },
];

export const Grocery = props => {
  const { t, i18n } = useTranslation();

  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);
  const [categories, setCategories] = useState();
  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);

  console.log('LAT_LNG_+_+_+_+_+_+_+_', latSlice, lngSlice);
  const [nearStore, setNearStore] = useState();

  const [categoryTypeId, setCategoryTypeId] = useState(
    props?.route?.params?.categoryTypeId,
  );
  const [isLoaderCate, setLoaderCate] = useState(true);
  const [isLoaderBestSeller, setLoaderBestSeller] = useState(true);
  const [isLoaderNearByStore, setLoaderNearByStore] = useState(true);
  const [bestSellingName, setBestSellingName] = useState('');

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

  const Item = ({ icons, onPress, name }) => (
    <View>
      <TouchableOpacity
        style={{ marginHorizontal: 6 }}
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
          data={slider_data}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
              //   onPress={() => {
              //     props.navigation.navigate(Routes.POPULAR_DEALS);
              //   }
              // }
              >
                <Image
                  source={item.img}
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
          dotsLength={slider_data.length}
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
      // Your code to re-render or fetch data goes here
      console.log('jjjjjjjjjjjjjjjjjjjjjjj');
      if (categoryTypeId == 1) {
        getGroceryNearStore();
      } else {
        getRestaurantNearStore();
      }
      getCartCount(props?.route?.params?.categoryTypeId);
      getCategories(props?.route?.params?.categoryTypeId);
      setLoaderCate(true);
      setLoaderNearByStore(true);
      // ...
    }, []),
  );

  const getCartCount = async categoryTypeId => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const data = await ProductService.getcartCountByStore(
        categoryTypeId,
        deliveryIn,
        getUserId
      );

      if (data.data.payload == null) {
        let count = 0; //cartCount
        dispatch(cartCount({ count }));
      } else {
        let count = data.data.payload.length;
        dispatch(cartCount({ count }));
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

    try {
      const responseNearShop = await ShopService.getGroceryNearShop(body);
      if (responseNearShop.data.isSuccess) {
        setLoaderNearByStore(false);
        responseNearShop.data.payload !== null &&
          setNearStore(responseNearShop.data.payload);
      } else {
        setLoaderNearByStore(false);
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
        responseNearShop.data.payload !== null &&
          setNearStore(responseNearShop.data.payload);
      } else {
        setLoaderNearByStore(false);
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

  return (
    <View
      style={[
        screenStyles.mainWrapper,
        { paddingTop: Globals.SAFE_AREA_INSET.top },
      ]}>
      <FocusAwareStatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      <View style={{ marginTop: 10, width: '100%', paddingHorizontal: 16 }}>
        <Variant1Header
          isVisiable={true}
          navigation={props.navigation}
          categoryTypeId={props?.route?.params?.categoryTypeId}
        />
      </View>

      <View style={screenStyles.parentWrapper}>
        {/* {(categoryTypeId == 1) && <SearchButton
          onPress={() => { }}
          onChangeText={text => setSearchQuery(text)}
          onSearch={handleSearch} // Pass the handleSearch function to the SearchButton
          placeholder={"Groceries, products, shops & more"}
        />}

        {(categoryTypeId == 2) && <SearchButton
          onPress={() => { }}
          onChangeText={text => setSearchQuery(text)}
          onSearch={handleSearch} // Pass the handleSearch function to the SearchButton
          placeholder={"Foods, dishes, restaurants & more"}
        />} */}

        <GlobalSearchButton
          onPress={() =>
            props.navigation.navigate(Routes.SEARCH, {
              categoryTypeId: categoryTypeId,
            })
          }
        />

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
                    style={{ marginTop: 0, marginBottom: 10 }}
                    renderItem={({ item, index }) => {
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
                      marginBottom: 10,
                    }}
                    keyExtractor={(item, index) => {
                      return item.id;
                    }}
                    renderItem={({ item, index }) => {
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
                            categoryTypeId={props?.route.params.categoryTypeId}
                          />
                        </View>
                      );
                    }}
                  />
                )}

                {/*------------------- start ----------------------------*/}
                {/* Best Selling Store */}
                {/* <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate(Routes.BESTSELLINGSTORE_LIST, {
                      navigation: props.navigation,
                    });
                  }}>
                  <View style={screenStyles.sectionHeading}>
                    <Text style={screenStyles.sectionHeadingText}>
                      {props?.route.params.categoryTypeId == 1
                        ? t('Best Selling Store')
                        : t('Best Selling Restaurant ')}
                    </Text>
                    <SvgIcon
                      type={IconNames.ArrowRight}
                      width={20}
                      height={20}
                      color={colors.subHeadingColor}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={{ fontFamily: Fonts.RUBIK_REGULAR }}>
                  No best selling stores are available right now.
                </Text> */}
                {/* {isLoaderNearByStore ? (
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={Globals.foodItems}
                    style={{ marginTop: 0, marginBottom: 10 }}
                    renderItem={({ item, index }) => {
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
                    data={nearStore}
                    style={{ marginTop: 0, marginBottom: 10 }}
                    keyExtractor={(item, index) => {
                      return item.id;
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View>
                          <BestSellingStoreItem
                            navigation={props.navigation}
                            id={item.id}
                            partnerName={item.partnerName}
                            latitude={item.latitude}
                            longitude={item.longitude}
                            openingHrs={item.openingHrs}
                            closingHrs={item.closingHrs}
                            districtName={item.districtName}
                            photo={item.photo}
                          />
                        </View>
                      );
                    }}
                  />
                )} */}

                {/* Near by Store */}
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      '--------------Categotr',
                      props?.route.params.categoryTypeId,
                    );
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
                        : t('Near by Restaurant ')}
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
                    style={{ marginTop: 0, marginBottom: 10 }}
                    renderItem={({ item, index }) => {
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
                    data={nearStore}
                    style={{ marginTop: 0, marginBottom: 10 }}
                    keyExtractor={(item, index) => {
                      return item.id;
                    }}
                    renderItem={({ item, index }) => {
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
                            categoryTypeId={props?.route.params.categoryTypeId}
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

      <RBSheet
        ref={ref => {
          _favouriteSheet = ref;
        }}
        height={hp(42)}>
        <FavouritesBottomSheet
          onItemSelect={() => {
            _favouriteSheet.close();
          }}
        />
      </RBSheet>
    </View>
  );
};
