import React, {useRef, useState, useEffect} from 'react';
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

import Carousel, {Pagination} from 'react-native-snap-carousel';

import {FoodItem} from '../../../components/Application/FoodItem/View';
import {CategoryItem} from '../../../components/Application/CategoryItem/View';
import {SearchButton} from '../../../components/Application/SearchButton/View';

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
import {ShopService} from '../../../apis/services';
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
import {cartCount} from '../../../redux/features/AddToCart/ProductSlice';
import {useTranslation} from 'react-i18next';
import {TextInput} from '../../../components/Global/TextInput/View';
import AppInput from '../../../components/Application/AppInput/View';

export const Ride = props => {
  const {t, i18n} = useTranslation();
  let inputRef = useRef();
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);
  const [categories, setCategories] = useState();
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

  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);

  useEffect(() => {}, []);

  return (
    <View
      style={[
        screenStyles.mainWrapper,
        {paddingTop: Globals.SAFE_AREA_INSET.top},
      ]}>
      <LinearGradient
        colors={[colors.activeColor, '#209650', colors.primaryGreenColor]}
        style={{
          padding: 0,
          width: '100%',

          // borderBottomLeftRadius: 15,
          // borderBottomRightRadius: 15,
        }}>
        <View
          style={{
            paddingBottom: hp(0.85),
            paddingHorizontal: 10,
            marginHorizontal: 10,
            marginBottom: 10,
          }}>
          <Variant1Header
            isVisiable={true}
            navigation={props.navigation}
            categoryTypeId={props?.route?.params?.categoryTypeId}
          />
        </View>
      </LinearGradient>

      <View style={screenStyles.parentWrapper}>
        <View style={screenStyles.promotionSliderContainer}>
          <Carousel
            ref={_carousel}
            //  data={slider_data}
            renderItem={({item}) => {
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
      </View>

      {/* <View
        style={{
          borderColor: '#d4d4d4',
          borderRadius: 5,
          borderWidth: 1,
          width: '90%',
          padding: 10,
        }}>
        <View>
          <Text style={screenStyles.sectionHeadingText}>
            Let's track your package
          </Text>

          <Text style={{ marginTop: 3, fontSize: 12 }}>
            Track your parcel delivery status
          </Text>

          <View style={{ marginTop: 10 }}>
            <AppInput
              {...globalStyles.secondaryInputStyle}
              textInputRef={r => (inputRef = r)}
              leftIcon={IconNames.Search}
              placeholder={'Enter Tracking #'}
              value={''}
              keyboardType={'email-address'}
            />
          </View>
        </View>
      </View> */}

      <View
        style={{
          width: '90%',
          paddingVertical: 10,
          marginTop: 10,
        }}>
        <Text style={screenStyles.sectionHeadingText}>Ride Anywhere</Text>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate(Routes.RIDE_DELIVERY_DETAILS, {
              pickupAddress: '',
              dropOffAddress: '',
              pickupLat: 0,
              pickupLng: 0,
              dropOffLat: 0,
              dropOffLng: 0,
              categoryTypeId: 3,
            });
          }}>
          <View
            style={{
              backgroundColor: colors.primaryGreenColor,
              padding: 16,
              borderRadius: 8,
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <SvgIcon
              type={IconNames.MapMarkerAlt}
              width={20}
              height={20}
              color={'white'}
            />
            <Text
              style={[
                screenStyles.sectionHeadingText,
                {marginStart: 10, color: 'white'},
              ]}>
              Set pickup & drop off location
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
