import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  useColorScheme,
  View,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Routes from '../../../navigation/Routes';
import {CommonActions, StackActions, useTheme} from '@react-navigation/native';
import {Styles} from './Style';
import Globals from '../../../utils/Globals';
import AppButton from '../../../components/Application/AppButton/View';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import {FocusAwareStatusBar} from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../../utils/i18n';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  requestLocationPermission,
  requestNotificationPermission,
  requestStoragePermission,
} from '../../../utils/Permission';

const Variant1Intro = props => {
  const {t, i18n} = useTranslation();
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);

  //Internal States
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showIntroApp, setShowIntroApp] = useState(false);
  const [welcomeBanners, setWelcomeBanners] = useState([]);

  //References
  let _carouselRef = useRef();

  const _renderItem = ({item, index}) => {
    return (
      <View style={screenStyles.introItemContainer}>
        {/* <Image source={item.headerImg} style={screenStyles.introItemImage} />
        <Text style={screenStyles.introItemTitle}>{t(item.title)}</Text>
        <Text style={screenStyles.introItemSubtitle}>{t(item.subtitle)}</Text> */}

        <Image
          source={{
            uri: `${Globals.imgBaseURL}/${item.imageUrl}`,
          }}
          style={screenStyles.introItemImage}
        />
        <Text style={screenStyles.introItemTitle}>{item.title}</Text>
        <Text style={screenStyles.introItemSubtitle}>{item.description}</Text>
      </View>
    );
  };
  const introSliderBoolean = async value => {
    try {
      await AsyncStorage.setItem('isIntroRead', JSON.stringify(value));
    } catch (error) {
      console.log('AsyncStorage IntroSlider', error);
    }
  };

  const setMargin = async value => {
    try {
      await AsyncStorage.setItem('topMargin', value);
      console.log('topMargin-------set------', value);
    } catch (error) {
      console.log('AsyncStorage IntroSlider topMargin', error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('isIntroRead', (err, value) => {
      if (value != null && value) {
        AsyncStorage.getItem('isAlreadyLogin', (err, value) => {
          if (value) {
            setMargin('false');
            props.navigation.dispatch(
              StackActions.replace(Routes.HOME_VARIANT1),
            );
            return;
          } else {
            // props.navigation.dispatch(
            //     StackActions.replace(Routes.TRACK_ORDERS)
            // )
            // return
            setMargin('false');
            props.navigation.dispatch(
              StackActions.replace(Routes.LOGIN_FORM_SCREEN1),
            );
            return;
          }
        });
      } else {
        setMargin('true');
        getWelcomeBanners();
        fetchPermission();
        setShowIntroApp(true);
      }
    });
  }, []);

  const fetchPermission = async () => {
    await requestLocationPermission();
    await requestNotificationPermission();
    await requestStoragePermission();
  };

  const getWelcomeBanners = async () => {
    const apiUrl = `${Globals.baseUrl}/Banner`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          const filterWelcomeBanners = response.data.payload.filter(
            banners => banners.bannerTypeName == 'Welcome',
          );
          setWelcomeBanners(filterWelcomeBanners);
        } else {
          console.log('isSuccess false');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView
      style={screenStyles.container}
      showsVerticalScrollIndicator={false}>
      {showIntroApp && (
        <View style={screenStyles.container}>
          <FocusAwareStatusBar
            backgroundColor={colors.primaryBackground}
            barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
          />

          {/* Banner */}
          <View style={screenStyles.introUpperContainer}>
            <Carousel
              ref={c => {
                _carouselRef = c;
              }}
              data={welcomeBanners}
              renderItem={_renderItem}
              sliderWidth={wp('100%')}
              itemWidth={wp('100%')}
              onSnapToItem={index => {
                setActiveSlideIndex(index);
              }}
            />

            <Pagination
              dotsLength={welcomeBanners.length}
              activeDotIndex={activeSlideIndex}
              dotColor={colors.paginationDotActiveColor}
              inactiveDotColor={colors.paginationDotInActiveColor}
              inactiveDotOpacity={0.4}
              inactiveDotScale={1}
              carouselRef={_carouselRef}
              dotStyle={screenStyles.paginationDotStyle}
              inactiveDotStyle={screenStyles.paginationInactiveDotStyle}
            />
          </View>

          <View style={screenStyles.introLowerContainer}>
            {/* Button1 */}
            <AppButton
              title={activeSlideIndex === 0 ? t('Get started') : t('Skip')}
              onPress={() => {
                introSliderBoolean(true);
                props.navigation.dispatch(
                  StackActions.replace(Routes.LOGIN_FORM_SCREEN1),
                );
              }}
              buttonStyle={screenStyles.buttonStyle}
            />

            {/* Button2 */}
            <AppButton
              title={t('Language')}
              onPress={() => {
                props.navigation.navigate(Routes.LANGUAGE_POP_UP);
              }}
              buttonStyle={screenStyles.buttonStyle}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Variant1Intro;
