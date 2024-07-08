import React, {useEffect, useRef, useState} from 'react';
import {ToastAndroid, useColorScheme, View, Alert} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';
import AppConfig from '../../../../branding/App_config';
import {Styles} from './Style';
import AppInput from '../../../components/Application/AppInput/View';
import Routes from '../../../navigation/Routes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AppButton from '../../../components/Application/AppButton/View';
import {CommonActions, useTheme} from '@react-navigation/native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import IconNames from '../../../../branding/carter/assets/IconNames';
import {FocusAwareStatusBar} from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import {CountryPickerInput} from '../../../components/Application/CountryPickerInput/View';
import BaseView from '../../BaseView';
import DropDownItem from '../../../components/Application/DropDownItem/View';
import {AuthService} from '../../../apis/services/Auth';
import {useSafeArea} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {doRegister} from './Service';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';
import {SvgIcon} from '../../../components/Application/SvgIcon/View';

const fonts = AppConfig.fonts.default;
const assets = AppConfig.assets.default;

const Variant1SignupScreen = props => {
  const {t, i18n} = useTranslation();

  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);

  //Internal States
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  // const [province, setProvince] = useState("")
  // const [city, setCity] = useState("")
  const [subDistrict, setSubdistrict] = useState('');
  const [province, setProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(0);
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(0);
  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(0);

  //internal error state
  const [errorUserName, setErrorUserName] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorCnfPassword, setErrorCnfPassword] = useState('');
  const [errorProvince, setErrorProvince] = useState('');
  const [errorCity, setErrorCity] = useState('');
  const [errorSubDist, setErrorSubDist] = useState('');
  const [errorAddressSelected, setErrorAddressSelected] = useState('');

  //internal states for error visible or not.
  const [isCheckPhone, setCheckPhone] = useState(false);
  const [isCheckPassword, setCheckPassword] = useState(false);
  const [isCheckCnfPassword, setCheckCnfPassword] = useState(false);
  const [isCheckEmail, setCheckEmail] = useState(false);
  const [isCheckUserName, setCheckUserName] = useState(false);
  const [isCheckProvince, setCheckProvince] = useState(false);
  const [isCheckCity, setCheckCity] = useState(false);
  const [isCheckSubDist, setCheckSubDist] = useState(false);
  const [isAddressSelected, setAddressSelected] = useState(false);

  //References
  let inputRef = useRef();
  const scrollViewRef = useRef(null);
  const errorTextRef = useRef(null);
  const dispatch = useDispatch();
  const {data, isLoading, isError} = useSelector(state => state.loginReducer);

  const [addressForRegistration, setaddressForRegistration] = useState('');
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [address1, setaddress1] = useState('');
  const [address2, setaddress2] = useState('');
  const [subDistrictName, setsubDistrictName] = useState('');
  const [subDistrictId, setsubDistrictId] = useState('');
  const [districtName, setdistrictName] = useState('');
  const [provinceName, setprovinceName] = useState('');
  const [landmark, setlandmark] = useState('');
  const [title, settitle] = useState('');
  const [postalCode, setpostalCode] = useState('');
  const [scrollPosition, setScrollPosition] = useState(10);

  const [isLoadingNew, setLoadingNew] = useState(false);

  const [countryCode, setCountryCode] = useState('US');
  const [withFilter, setWithFilter] = useState(true);
  const [withFlagButton, setWithFlagButton] = useState(false);
  const [visible, setVisible] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: '62',
    name: 'Indonesia',
  });
  const onSelect = country => {
    setSelectedCountry(country);
    setVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      let addressForRegistration2 =
        props.route.params.addressForRegistration || '';
      console.log('addressForRegistration==>', addressForRegistration2);
      setaddressForRegistration(addressForRegistration2);

      setlatitude(props.route.params.latitude);
      setlongitude(props.route.params.longitude);
      setaddress1(props.route.params.address1);
      setaddress2(props.route.params.address2);
      setsubDistrictName(props.route.params.subDistrictName);
      setsubDistrictId(props.route.params.subDistrictId);
      setdistrictName(props.route.params.districtName);
      setprovinceName(props.route.params.provinceName);
      setlandmark(props.route.params.landmark);
      settitle(props.route.params.title);
      setpostalCode(props.route.params.postalCode);
    }, [props.route.params.addressForRegistration]),
  );

  const handleRegister = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log('handleRegister--clicked----------=>');
    if (userName.length === 0) {
      setErrorUserName(t('Please enter full name.'));
      handleScrollToInput(0);
      setCheckUserName(true);
      return;
    }

    if (phone.length === 0) {
      setErrorPhone(t('Please enter mobile number'));
      handleScrollToInput(6);
      setCheckPhone(true);
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      setErrorPhone(t('Mobile number should be between 10 to 15'));
      handleScrollToInput(12);
      setCheckPhone(true);
      return;
    }

    if (email.length === 0) {
      setErrorEmail(t('Please enter email address'));
      handleScrollToInput(18);
      setCheckEmail(true);
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorEmail(t('Please enter valid email address'));
      handleScrollToInput(18);
      setCheckEmail(true);
      return;
    }
    if (password.length === 0) {
      setErrorPassword(t('Please enter password'));
      handleScrollToInput(90);
      setCheckPassword(true);
      return;
    }
    if (password.length < 6) {
      setErrorPassword(t('Password should be more than 6'));
      handleScrollToInput(90);
      setCheckPassword(true);
      return;
    }

    if (cnfPassword.length === 0) {
      setErrorCnfPassword(t('Please enter confirm password'));
      handleScrollToInput(180);
      setCheckCnfPassword(true);
      return;
    }
    if (cnfPassword.length < 6) {
      setErrorCnfPassword(t('Password should be more than 6'));
      handleScrollToInput(180);
      setCheckCnfPassword(true);
      return;
    }

    if (password !== cnfPassword) {
      setErrorCnfPassword(t('Both password should be same'));
      handleScrollToInput(180);
      setCheckCnfPassword(true);
      return;
    }

    if (
      addressForRegistration === null ||
      addressForRegistration === undefined ||
      addressForRegistration === ''
    ) {
      console.log('adddreessssss', addressForRegistration);
      setErrorAddressSelected(t('Please add address'));
      handleScrollToInput(320);
      setAddressSelected(true);
      return;
    }

    const uniqueId = await DeviceInfo.getUniqueId();
    var date = new Date().toLocaleString();
    const hashedPassword = CryptoJS.SHA256(cnfPassword).toString();

    let body = {
      defaultAddress: true,
      savedAddress: true,
      mapAddress: addressForRegistration,
      address1: address1,
      address2: address2,
      subDistrictName: subDistrictName,
      subDistrictId: subDistrictId || 0,
      districtName: districtName,
      provinceName: provinceName,
      postalCode: postalCode,
      landmark: landmark,
      title: title,
      latitude: latitude,
      longitude: longitude,
      fullName: userName,
      mobileNo: phone,
      countryCode: '+' + selectedCountry.callingCode,
      email: email,
      password: hashedPassword, // Use the hashed password
      deviceId: uniqueId,
      dateTime: date,
    };

    console.log('BOOODDYYYY=====>', body);

    try {
      setLoadingNew(true);
      let response = await AuthService.registerUser(body);

      console.log('handleRegister--response----------=>', response.data);

      if (response?.data?.isSuccess) {
        setLoadingNew(false);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: Routes.VERIFY_NUMBER_OTP_SCREEN,
                params: {
                  otp: response?.data?.otp,
                  whatsAppAuthentication:
                    response?.data?.whatsAppAuthentication,
                  userId: response?.data?.userId,
                },
              },
            ],
          }),
        );
      } else {
        setLoadingNew(false);
        ToastAndroid.show(
          'Something went wrong, please try again.',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      setLoadingNew(false);
      // Cast 'error' to 'any' to handle the TypeScript error
      console.log('Error in handleRegister:', error);
    }
  };

  const handleScrollToInput = position => {
    // // Get the position of the TextInput
    scrollViewRef.current?.scrollTo({y: position, animated: true});
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={t('Sign up')}
      //headerWithBack --comment
      onBackPress={() => {
        props.navigation.navigate(Routes.LOGIN_FORM_SCREEN1);
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={[screenStyles.mainContainer]}>
            <KeyboardAwareScrollView
              ref={scrollViewRef}
              keyboardShouldPersistTaps={'handled'} //handled
              getTextInputRefs={() => {
                return [inputRef];
              }}
              style={screenStyles.scrollViewContainer}
              contentContainerStyle={screenStyles.scrollViewContentContainer}
              showsVerticalScrollIndicator={false}>
              <View style={screenStyles.container}>
                <Text
                  style={[
                    screenStyles.inputLabel,
                    {alignSelf: 'flex-start', marginTop: 16},
                  ]}>
                  {t('Full Name')}
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.CircleUser}
                  placeholder={t('Enter full name')}
                  value={userName}
                  keyboardType={'default'}
                  onChangeText={userName => {
                    setUserName(userName);
                    setCheckUserName(false);
                  }}
                />
                {isCheckUserName && (
                  <Text
                    ref={errorTextRef}
                    style={[
                      screenStyles.accountErrorText,
                      {alignSelf: 'flex-start'},
                    ]}>
                    {errorUserName}
                  </Text>
                )}

                <Text
                  style={[
                    screenStyles.inputLabel,
                    {alignSelf: 'flex-start', marginTop: 8},
                  ]}>
                  {t('Mobile Number')}
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.3}}>
                    <TouchableOpacity
                      onPress={() => {
                        setVisible(true);
                      }}
                      style={screenStyles.leftContainer}>
                      <CountryPicker
                        {...{
                          countryCode,
                          withFilter,
                          withFlagButton,
                          onSelect,
                        }}
                        visible={visible}
                      />

                      <Text style={screenStyles.callingCode}>
                        {'+' + selectedCountry.callingCode}
                      </Text>

                      {/* comment */}
                      <SvgIcon
                        type={IconNames.ChevronDown}
                        width={15}
                        height={15}
                        color={colors.inputColor}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{flex: 1}}>
                    <AppInput
                      {...globalStyles.secondaryInputStyle}
                      textInputRef={r => (inputRef = r)}
                      leftIcon={IconNames.PhoneFlip}
                      placeholder={t('Enter mobile number')}
                      value={phone}
                      maxLength={15}
                      keyboardType={'number-pad'}
                      onChangeText={phone => {
                        if (String(phone).match(/[\s,.-]/g, '')) {
                        } else {
                          setPhone(phone);
                          setCheckPhone(false);
                        }
                      }}
                    />
                  </View>
                </View>

                {isCheckPhone && (
                  <Text
                    style={[
                      screenStyles.accountErrorText,
                      {alignSelf: 'flex-start'},
                    ]}>
                    {errorPhone}
                  </Text>
                )}
                <Text
                  style={[
                    screenStyles.inputLabel,
                    {alignSelf: 'flex-start', marginTop: 8},
                  ]}>
                  {t('Email Address')}
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.Envelope}
                  placeholder={t('Enter email address')}
                  value={email}
                  keyboardType={'email-address'}
                  onChangeText={email => {
                    setEmail(email);
                    setCheckEmail(false);
                  }}
                />
                {isCheckEmail && (
                  <Text
                    style={[
                      screenStyles.accountErrorText,
                      {alignSelf: 'flex-start'},
                    ]}>
                    {errorEmail}
                  </Text>
                )}

                <Text
                  style={[
                    screenStyles.inputLabel,
                    {alignSelf: 'flex-start', marginTop: 8},
                  ]}>
                  {t('Password')}
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  containerStyle={screenStyles.passwordInputContainer}
                  textInputRef={r => (inputRef = r)}
                  isPasswordField
                  leftIcon={IconNames.LockKeyhole}
                  placeholder={t('Enter password')}
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

                <Text
                  style={[
                    screenStyles.inputLabel,
                    {alignSelf: 'flex-start', marginTop: 8},
                  ]}>
                  {t('Confirm Password')}
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  containerStyle={screenStyles.passwordInputContainer}
                  textInputRef={r => (inputRef = r)}
                  isPasswordField
                  leftIcon={IconNames.LockKeyhole}
                  placeholder={t('Retype Password')}
                  value={cnfPassword}
                  onChangeText={cnfPassword => {
                    var spaceRegex = /\s/;
                    if (!spaceRegex.test(cnfPassword)) {
                      // There is a no space character in the string
                      setCnfPassword(cnfPassword);
                    }
                    setCheckCnfPassword(false);
                  }}
                />
                {isCheckCnfPassword && (
                  <Text
                    style={[
                      screenStyles.accountErrorText,
                      {alignSelf: 'flex-start'},
                    ]}>
                    {errorCnfPassword}
                  </Text>
                )}

                {/* add address */}

                <View style={{width: '100%', marginTop: 6}}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={screenStyles.inputLabel}>{t('Address')}</Text>

                    <TouchableOpacity
                      onPress={() => {
                        setAddressSelected(false);
                        props.navigation.navigate(
                          Routes.PLACES_AUTO_COMPLETE_FOR_REG,
                        );
                      }}>
                      <Text
                        style={[
                          screenStyles.inputLabel,
                          {
                            color: colors.activeColor,
                            fontFamily: fonts.RUBIK_MEDIUM,
                          },
                        ]}>
                        {t('Add')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      padding: 6,
                      width: '100%',
                      backgroundColor: '#f5f5f5',
                      height: 70,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#d4d4d4',
                    }}>
                    {addressForRegistration}
                  </Text>
                </View>

                {isAddressSelected && (
                  <Text
                    style={[
                      screenStyles.accountErrorText,
                      {alignSelf: 'flex-start', marginTop: 6},
                    ]}>
                    {errorAddressSelected}
                  </Text>
                )}
              </View>
            </KeyboardAwareScrollView>

            <View style={screenStyles.bottomButton}>
              <AppButton
                title={t('Submit')}
                loader={isLoadingNew}
                onPress={() => {
                  handleRegister();
                  // props.navigation.navigate(Routes.VERIFY_NUMBER_OTP_SCREEN);
                  // props.navigation.goBack();
                }}
              />
            </View>

            <View style={[screenStyles.accountBottomContainer]}>
              <Text style={screenStyles.accountText}>
                {t('Already have an account?')}
              </Text>
              <Button
                title={t('Sign in')}
                type={'clear'}
                titleStyle={screenStyles.loginButton}
                onPress={() =>
                  props.navigation.navigate(Routes.LOGIN_FORM_SCREEN1)
                }
              />
            </View>
          </View>
        );
      }}
    />
  );
};

export default Variant1SignupScreen;
