import React, {useRef, useState, useEffect, version} from 'react';
import {
  ToastAndroid,
  useColorScheme,
  View,
  ImageBackground,
} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';
import AppConfig from '../../../../branding/App_config';
import AppInput from '../../../components/Application/AppInput/View';
import Routes from '../../../navigation/Routes';
import {Styles} from './Style';
import {CommonActions, useTheme} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AppButton from '../../../components/Application/AppButton/View';
import {
  buttonHeight,
  commonDarkStyles,
} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import {FocusAwareStatusBar} from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import {AuthService} from '../../../apis/services/Auth';
import {useDispatch, useSelector} from 'react-redux';
import CryptoJS from 'crypto-js';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {
  setLat,
  setLng,
} from '../../../redux/features/Address/DefaultAddressSlice';
import PushController from '../../../utils/PushController';
import {useFocusEffect} from '@react-navigation/native';
//import PushNotification from 'react-native-push-notification';
import {useTranslation} from 'react-i18next';
import {getIsConnected} from '../../../utils/NetworkCheck';
import {Banner} from '../../../utils/Banner';
import Globals from '../../../utils/Globals';
Geocoder.init(Globals.googleApiKey);

const assets = AppConfig.assets.default;

const Variant1LoginFormScreen = props => {
  //redux tool kit
  const dispatch = useDispatch();

  //translater
  const {t, i18n} = useTranslation();

  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);

  //Internal States
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errorMobile, setErrorMobile] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [isCheckMobile, setCheckMobile] = useState(false);
  const [isCheckPassword, setCheckPassword] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState('');
  const [latLocal, setLatLocal] = useState(0);
  const [lngLocal, setLngLocal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [countryCode, setCountryCode] = useState('US');
  const [withFilter, setWithFilter] = useState(true);
  const [withFlagButton, setWithFlagButton] = useState(false);
  const [visible, setVisible] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: '62',
    name: 'Indonesia',
  });
  const onSelect = country => {
    console.log('selectedCountryInLoginscreen=-------', country);
    setSelectedCountry(country);
    setVisible(false);
  };

  //References
  let inputRef = useRef();
  let ref = useRef();

  useEffect(() => {
    (async () => {
      let rememberMee = await AsyncStorage.getItem('isRemember');
      let mobileNu = await AsyncStorage.getItem('mobilenoLocal');
      let password = await AsyncStorage.getItem('passwordLocal');
      let firebaseToke = await AsyncStorage.getItem('firebaseToken');

      console.log('Login Form---->', firebaseToke);
      setFirebaseToken(firebaseToke);
      if (rememberMee) {
        setMobile(mobileNu?.replace(/['"]+/g, ''));
        setPassword(password?.replace(/['"]+/g, ''));
        setRememberMe(true);
      }
    })();

    Geolocation.getCurrentPosition(
      position => {
        const crd = position.coords;

        setLatLocal(crd.latitude);
        setLngLocal(crd.longitude);
      },
      error => {
        console.log('error');
      },
    );

    const fetchBanner = async () => {
      try {
        const imageUrl = await Banner('Login');
        setBannerImageUrl(imageUrl);
      } catch (error) {
        console.error('Error in YourComponent:', error);
      }
    };

    fetchBanner();
  }, []);

  // useEffect(() => {
  //   // Define your notification channel
  //   PushNotification.createChannel(
  //     {
  //       channelId: 'your_channel_1',
  //       channelName: 'Your Channel Name',
  //       channelDescription: 'Your Channel Description', // optional
  //       playSound: true, // optional
  //       soundName: 'default', // optional
  //       importance: 4, // optional
  //       vibrate: true, // optional
  //     },
  //     created => console.log(`Channel created: ${created}`),
  //   );
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      setCheckMobile(false);
      setCheckPassword(false);
      setRememberMe(false);
      setLoading(false);
    }, []),
  );

  const handleLogin = async () => {
    setLoading(true);
    const uniqueId = await DeviceInfo.getUniqueId();

    if (mobile.length === 0) {
      //!isNaN(mobile)
      setErrorMobile(t('Please enter mobile number'));
      setCheckMobile(true);
      setLoading(false);

      return false;
    } else if (mobile.length < 10 || mobile.length > 15) {
      setErrorMobile(t('Mobile number should be between 10 to 15'));
      setCheckMobile(true);
      setLoading(false);
      return false;
    } else if (password.length === 0) {
      setErrorPassword(t('Please enter password'));
      setCheckPassword(true);
      setLoading(false);

      return false;
    } else if (password.length > 0 && password.length < 6) {
      setErrorPassword(t('Password should not be less than 6'));
      setCheckPassword(true);
      setLoading(false);

      return false;
    } else {
      const uniqueId = await DeviceInfo.getUniqueId();
      const hashedPassword = CryptoJS.SHA256(password).toString();

      try {
        let loginRequest = {
          mobileNo: mobile,
          countryCode: '+' + selectedCountry.callingCode,
          password: hashedPassword,
          deviceId: uniqueId,
          latitude: latLocal,
          longitude: lngLocal,
          firebaseToken: firebaseToken?.replace(/\"/g, ''),
        };

        let response = await AuthService.LoginUser(loginRequest);

        if (response?.data?.isSuccess) {
          AsyncStorage.setItem('isAlreadyLogin', JSON.stringify(true));
          setLoading(false);

          if (rememberMe) {
            AsyncStorage.setItem('mobilenoLocal', JSON.stringify(mobile));
            AsyncStorage.setItem('passwordLocal', JSON.stringify(password));

            AsyncStorage.setItem('isRemember', JSON.stringify(rememberMe));

            //AsyncStorage.setItem("rememberMe", { checkbox: true, mobile: mobile, password: hashedPassword })
          } else {
            AsyncStorage.removeItem('mobilenoLocal');
            AsyncStorage.removeItem('passwordLocal');
            AsyncStorage.setItem('isRemember', JSON.stringify(rememberMe));

            //AsyncStorage.setItem("rememberMe")
          }

          if (response?.data?.payload?.user?.userId !== undefined) {
            AsyncStorage.setItem(
              'userId',
              JSON.stringify(response?.data?.payload?.user?.userId),
            );
            AsyncStorage.setItem(
              'accountId',
              JSON.stringify(response?.data?.payload?.user?.accountId),
            );
            AsyncStorage.setItem(
              'displayName',
              response?.data?.payload?.user?.displayName,
            );
            AsyncStorage.setItem('email', response?.data?.payload?.user?.email);
            AsyncStorage.setItem(
              'phoneNo',
              response?.data?.payload?.user?.countryCode +
                '' +
                response?.data?.payload?.user?.phoneNo,
            );

            props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: Routes.HOME_VARIANT1}],
              }),
            );
          } else {
            setLoading(false);
            ToastAndroid.show('Please try again', ToastAndroid.SHORT);
          }
          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: Routes.HOME_VARIANT1}],
            }),
          );
        } else {
          AsyncStorage.removeItem('mobilenoLocal');
          AsyncStorage.removeItem('passwordLocal');
          AsyncStorage.setItem('isRemember', JSON.stringify(rememberMe));
          setLoading(false);
          //AsyncStorage.setItem("rememberMe")
          ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        }
      } catch (error) {
        setLoading(false);
        console.log('BOOODDDYYYY_response', error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'always'} //handled
      showsVerticalScrollIndicator={true}
      style={screenStyles.scrollViewContainer}
      contentContainerStyle={screenStyles.scrollViewContentContainer}
      getTextInputRefs={() => {
        return [inputRef];
      }}>
      <PushController navigation={props.navigation} />

      <ImageBackground source={assets.login_bg} style={screenStyles.container}>
        <FocusAwareStatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <Image
          //source={{uri: `${Globals.imgBaseURL}/${bannerImageUrl}`}}
          source={assets.logo_login}
          resizeMode={'contain'}
          style={[screenStyles.imageContainer]}
        />

        <View style={[screenStyles.bottomContainer]}>
          <View style={screenStyles.accountBottomContainer}>
            <View>
              <Text style={screenStyles.titleText}>{t('Welcome back')}</Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Text style={screenStyles.accountText1}>
                {/* {t("Don't have an account?")} */}
                Register new?
              </Text>

              <Button
                // title={t('Forgot Password')}
                title={'click here'}
                type={'clear'}
                titleStyle={screenStyles.forgotPasswordButton}
                onPress={() =>
                  props.navigation.navigate(Routes.SIGNUP_FORM_SCREEN1, {
                    addressForRegistration: '',
                  })
                }
              />
            </View>
          </View>

          <AppInput
            {...globalStyles.secondaryInputStyle}
            textInputRef={r => (inputRef = r)}
            maxLength={12}
            // leftIcon={IconNames.Phone}
            showLeftIcon={false}
            placeholder={t('Mobile Number')}
            value={mobile}
            keyboardType={'numeric'}
            onChangeText={mobile => {
              setMobile(mobile);
              setCheckMobile(false);
            }}
          />
          {isCheckMobile && (
            <Text
              style={[
                screenStyles.accountErrorText,
                {alignSelf: 'flex-start'},
              ]}>
              {errorMobile}
            </Text>
          )}

          <AppInput
            {...globalStyles.secondaryInputStyle}
            textInputRef={r => (inputRef = r)}
            // maxLength={0}
            isPasswordField
            containerStyle={{marginTop: 8}}
            //leftIcon={IconNames.LockKeyhole}
            showLeftIcon={false}
            placeholder={t('Password')}
            value={password}
            onChangeText={password => {
              var spaceRegex = /\s/;
              if (!spaceRegex.test(password)) {
                // There is a no space character in the string
                setPassword(password);
              }

              setCheckPassword(false);
            }}
          />
          {isCheckPassword && (
            <Text
              style={[
                screenStyles.accountErrorText,
                {alignSelf: 'flex-start'},
              ]}>
              {errorPassword}
            </Text>
          )}

          <View style={screenStyles.viewContainer}>
            <View style={[screenStyles.accountBottomContainer]}>
              <Text style={screenStyles.accountText1}>Forgot password?</Text>

              <Button
                // title={t('Forgot Password')}
                title={'click here'}
                type={'clear'}
                titleStyle={screenStyles.forgotPasswordButton}
                onPress={() =>
                  props.navigation.navigate(Routes.FORGOT_PASSWORD_FORM_SCREEN1)
                }
              />
            </View>

            <View
              style={{
                //flex: 1,
                justifyContent: 'center',
              }}>
              <AppButton
                title={t('Sign in')}
                loader={isLoading}
                buttonStyle={screenStyles.signupButton}
                titleStyle={{fontSize: 13}}
                onPress={() => {
                  try {
                    if (getIsConnected()) {
                      handleLogin();
                    } else {
                      ToastAndroid.show(
                        'Poor internet connection',
                        ToastAndroid.SHORT,
                      );
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              />
            </View>
          </View>
        </View>
        <Text style={{fontSize: 11, marginTop: 50, color: colors.activeColor}}>
          {/* {Globals.version} */}
          Ver {DeviceInfo.getVersion()}
        </Text>
      </ImageBackground>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          width: '100%',

          alignSelf: 'center',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 9, position: 'relative', top: 0, left: 8}}>
          powered by
        </Text>
        <Image
          //source={{uri: `${Globals.imgBaseURL}/${bannerImageUrl}`}}
          source={assets.powered_by}
          resizeMode={'contain'}
          style={{
            height: 18,
            width: 97,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Variant1LoginFormScreen;
