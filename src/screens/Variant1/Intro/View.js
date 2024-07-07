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

const Variant1Intro = () => {
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
    // await requestNotificationPermission();
    //await requestStoragePermission();
    // await requestPermission(
    //   PermissionsAndroid.PERMISSIONS.CAMERA,
    //   'Camera Permission',
    //   'To continue, turn on device camera to capture photos.',
    // );
  };

  const requestPermission = async (permission, title, message) => {
    try {
      const granted = await PermissionsAndroid.request(permission, {
        title: title,
        message: message,
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`${title} permission granted. You can now use it.`);
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log(
          `${title} permission denied, and user selected "Never Ask Again".`,
        );
        Alert.alert(
          `${title} Permission Required`,
          `To use this app, please enable ${title.toLowerCase()} in your device settings.`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      } else {
        console.log(`${title} permission denied.`);
        Alert.alert(
          `${title} Permission Required`,
          `To use this app, please grant ${title.toLowerCase()} access.`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      }
    } catch (error) {
      console.log(`${title} permission error:`, error);
      return false;
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'To continue, turn on device storage to save photos.',
          buttonPositive: 'OK',
        },
      );

      // Handle the result of the permission request accordingly
      // ...
    } catch (error) {
      console.log('Error requesting storage Permission:', error);
    }
  };

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.NOTIFICATIONS,
        );
      } catch (error) {
        console.error(error);
      }
    }
  };
  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message:
            'To continue, turn on device notification which uses Google’s notification services.',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('notification permission granted.');
        //getLocation();
        return true;
      }
      // else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      //   console.log(
      //     'notification permission denied, and user selected "Never Ask Again".',
      //   );
      //   // Show an alert explaining the necessity of location permission and guide the user to settings
      //   Alert.alert(
      //     'Notification Permission Required',
      //     'To use this app, please enable notification services in your device settings.',
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           // Redirect the user to app settings
      //           if (Platform.OS === 'android') {
      //             Linking.openSettings();
      //           }
      //         },
      //       },
      //     ],
      //   );
      //   return false;
      // } else {
      //   console.log('notification permission denied.');
      //   // Show an alert informing the user about the necessity of location permission
      //   Alert.alert(
      //     'NOtification Permission Required',
      //     'To use this app, please grant notification access.',
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
      //           // Close the app
      //           if (Platform.OS === 'android') {
      //             Linking.openSettings();
      //           }
      //         },
      //       },
      //     ],
      //   );
      //   return false;
      // }
    } catch (error) {
      console.log('Error requesting notification permission:', error);
    }
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

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message:
            'To continue, turn on device location which uses Google’s location services.',
          // buttonNeutral: 'Ask Me Later',
          // buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(
          'Location permission granted. You can now use Geolocation.',
        );
        //getLocation();
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log(
          'Location permission denied, and user selected "Never Ask Again".',
        );
        // Show an alert explaining the necessity of location permission and guide the user to settings
        Alert.alert(
          'Location Permission Required',
          'To use this app, please enable location services in your device settings.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Redirect the user to app settings
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      } else {
        console.log('Location permission denied.');
        // Show an alert informing the user about the necessity of location permission
        Alert.alert(
          'Location Permission Required',
          'To use this app, please grant location access.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Close the app
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
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
