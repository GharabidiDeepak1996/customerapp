import React, {useEffect, useRef, useState} from 'react';
import {Alert, ToastAndroid, useColorScheme, View} from 'react-native';
import {Image, Text} from 'react-native-elements';
import AppConfig from '../../../../branding/App_config';
import AppInput from '../../../components/Application/AppInput/View';
import {Styles} from './Style';
import AppHeader from '../../../components/Application/AppHeader/View';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AppButton from '../../../components/Application/AppButton/View';
import {CommonActions, useTheme} from '@react-navigation/native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import Routes from '../../../navigation/Routes';
import IconNames from '../../../../branding/carter/assets/IconNames';
import {FocusAwareStatusBar} from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import {useTranslation} from 'react-i18next';
import {AuthService} from '../../../apis/services/Auth';
import {Banner} from '../../../utils/Banner';
import Globals from '../../../utils/Globals';

const assets = AppConfig.assets.default;

export const Variant1ForgotPassword = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, colors);

  //translation
  const {t, i18n} = useTranslation();

  //Internal States
  const [emailLoc, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [isCheckEmail, setCheckEmail] = useState(false);
  const [isLoadingNew, setLoadingNew] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);

  //References
  let inputRef = useRef();

  const handleRegister = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailLoc.length === 0) {
      setErrorEmail('Please enter email address');
      setCheckEmail(true);
      return;
    }
    if (!emailRegex.test(emailLoc)) {
      setErrorEmail('Please enter valid email address');
      setCheckEmail(true);
      return;
    }

    try {
      setLoadingNew(true);
      let forgotRequest = {
        email: emailLoc,
      };

      const response = await AuthService.ForgotPassword(forgotRequest);

      console.log('Forgotpasswooooooooooooo----', response);

      if (response?.data?.isSuccess) {
        setLoadingNew(false);
        //Navigation screen
        Alert.alert('ForgotPassword', response?.data?.message, [
          {
            text: 'Ok',
            onPress: () => {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{name: Routes.LOGIN_FORM_SCREEN1}],
                }),
              );
            },
          },
        ]);
      } else {
        ToastAndroid.show(response?.data?.message, ToastAndroid.BOTTOM);
      }

      //       else {
      //   setLoadingNew(false);
      // }
    } catch (error) {
      setLoadingNew(false);
      // Cast 'error' to 'any' to handle the TypeScript error
      console.log('Error in handleRegister:', error);
    }
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const imageUrl = await Banner('Forgot Password');
        setBannerImageUrl(imageUrl);
      } catch (error) {
        console.error('Error in YourComponent:', error);
      }
    };

    fetchBanner();
  });

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'never'}
      style={screenStyles.scrollViewContainer}
      contentContainerStyle={screenStyles.scrollViewContentContainer}
      getTextInputRefs={() => {
        return [inputRef];
      }}
      showsVerticalScrollIndicator={false}>
      <View style={screenStyles.container}>
        <FocusAwareStatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <View style={screenStyles.headerContainer}>
          <Image
            source={{uri: `${Globals.imgBaseURL}/${bannerImageUrl}`}}
            style={screenStyles.headerImage}
          />
        </View>

        <AppHeader
          isTranslucent
          navigation={props.navigation}
          transparentHeader
          headerWithBack
          title={t('Forgot Password')}
        />

        <View style={[screenStyles.bottomContainer]}>
          {/* <Text style={screenStyles.titleText}>{'Forgot Password!'}</Text> */}

          <Text style={screenStyles.subtitleText}>
            {t(
              "Enter your email and we'll send you instructions on how to reset it.",
            )}
          </Text>

          <Text
            style={[
              screenStyles.inputLabel,
              {alignSelf: 'flex-start', marginTop: 8},
            ]}>
            Email Address
          </Text>
          <AppInput
            {...globalStyles.secondaryInputStyle}
            containerStyle={screenStyles.emailInputContainer}
            textInputRef={r => (inputRef = r)}
            // leftIcon={IconNames.Envelope}
            placeholder={t('Enter email address')}
            value={emailLoc}
            onChangeText={em => {
              setEmail(em);
              setCheckEmail(false);
            }}
          />

          {isCheckEmail && (
            <Text
              style={[
                screenStyles.accountErrorText,
                {
                  alignSelf: 'flex-start',
                  color: 'red',
                  marginTop: -6,
                  marginBottom: 12,
                },
              ]}>
              {errorEmail}
            </Text>
          )}

          <AppButton
            title={'Send Link'}
            loader={isLoadingNew}
            onPress={() => {
              handleRegister();
              // ToastAndroid.show(
              //   'under maintenance forgot password',
              //   ToastAndroid.LONG,
              // );
              //  props.navigation.navigate(Routes.VERIFY_NUMBER_SCREEN)
            }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
