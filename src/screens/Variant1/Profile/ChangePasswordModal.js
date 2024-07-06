import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  PanResponder,
  Animated,
  useColorScheme,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { GFont, GFontM } from './fontFamily';
import CryptoJS from 'crypto-js';
import { AuthService } from '../../../apis/services';
import { LocalStorageGet } from '../../../localStorage';
import AppInput from '../../../components/Application/AppInput/View';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import IconNames from '../../../../branding/carter/assets/IconNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../../../../branding/App_config';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import { styll } from './Style';
const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export function ChangePasswordModal() {
  const navigation = useNavigation();
  const [openClose, setOpenClose] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { t, i18n } = useTranslation();
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);

  useFocusEffect(
    React.useCallback(() => {
      // Your code to re-render or fetch data goes here
      console.log('Screen is focused');
    }, []),
  );

  const getData = async () => {
    try {
      const getUserName = await AsyncStorage.getItem('displayName');
      const getUserEmail = await AsyncStorage.getItem('email');
      const getUserId = await AsyncStorage.getItem('userId');
      const getMobileNo = await AsyncStorage.getItem('phoneNo');

      setUserEmail(getUserEmail);
      setUserName(getUserName);
      setUserId(getUserId);
      setMobileNo(getMobileNo);
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const createButtonAlert = message =>
    Alert.alert('Change Password', message, [
      {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);

  const setPasswordchange = async () => {
    // Validate password and confirm password
    if (!password) {
      ToastAndroid.show('Please enter new password.', ToastAndroid.LONG);
      return;
    }
    if (!cpassword) {
      ToastAndroid.show('Please enter confirm password.', ToastAndroid.LONG);
      return;
    }
    // Validate if new password and confirm password match
    if (password !== cpassword) {
      ToastAndroid.show(
        'New password and confirm password do not match.',
        ToastAndroid.LONG,
      );
      return;
    }
    const hashedPassword = CryptoJS.SHA256(password).toString();
    console.log('hashPassword', hashedPassword);
    let body = {
      email: userEmail,
      mobileNo: mobileNo,
      newPassword: password,
    };
    try {
      let response = await AuthService.setChangePassword(body, userId);
      if (!response?.data?.isSuccess) {
        ToastAndroid.show(
          response?.data.message ||
          'An error occurred during set change password.',
          ToastAndroid.LONG,
        );
        return;
      } else {
        createButtonAlert(response?.data.message);
        //ToastAndroid.show(response?.data.message, ToastAndroid.LONG);
      }
    } catch (error) {
      // Cast 'error' to 'any' to handle the TypeScript error
      console.log('Error in set change password:', error);
      ToastAndroid.show(
        'An error occurred while set change password: ' + error.message,
        ToastAndroid.LONG,
      );
    }
  };

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(
            _, // Update pan.y with the gesture
            gestureState,
          );
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          navigation.goBack();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const backgroundColor = pan.y.interpolate({
    inputRange: [0, 3], // Adjust the range based on your needs
    outputRange: ['rgba(64, 64, 64, 0.7)', 'rgba(64, 64, 64, 0)'],
    extrapolate: 'clamp',
  });

  let inputRef = useRef();

  return (
    <Animated.View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor,
        transform: pan.getTranslateTransform(),
      }}
      {...panResponder.panHandlers}>
      <View
        style={{
          height: '30%',
          width: '100%',
          justifyContent: 'center',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <View style={styll.modalContainer}>
          <View style={styll.modalContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  width: 50,
                  height: 5,
                  borderRadius: 10,
                  backgroundColor: '#eee',
                }}
              />
            </TouchableOpacity>

            <View style={styll.inputContainer}>
              {/* <Text style={[styll.label, GFont, { fontWeight: 'bold', marginVertical: 20, marginBottom: 10 }]}>{t("Change Password")}</Text> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  marginBottom: 5,
                }}>
                <Text
                  style={[
                    {
                      fontFamily: fonts.RUBIK_MEDIUM,
                      fontSize: Typography.P2,
                      color: 'black',
                    },
                  ]}>
                  Change Password
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <SvgIcon
                    type={IconNames.Close}
                    width={20}
                    height={20}
                    color={colors.activeColor}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styll.inputLabel,
                  { alignSelf: 'flex-start', marginTop: 8 },
                ]}>
                New Password
              </Text>
              <AppInput
                {...globalStyles.secondaryInputStyle}
                textInputRef={r => (inputRef = r)}
                isPasswordField
                leftIcon={IconNames.LockKeyhole}
                placeholder={t('Enter new password')}
                value={password}
                onChangeText={password => {
                  setPassword(password);
                }}
                labell={t('New Password')}
              />

              <Text
                style={[
                  styll.inputLabel,
                  { alignSelf: 'flex-start', marginTop: 8 },
                ]}>
                Re-type Password
              </Text>
              <AppInput
                {...globalStyles.secondaryInputStyle}
                textInputRef={r => (inputRef = r)}
                isPasswordField
                leftIcon={IconNames.LockKeyhole}
                placeholder={t('Re-type password')}
                value={cpassword}
                onChangeText={cpassword => {
                  setCPassword(cpassword);
                }}
                labell={t('Re-type Password')}
              />
            </View>

            <TouchableOpacity
              style={styll.button}
              onPress={() => {
                setPasswordchange();
                //ToastAndroid.show('Work In-Progess.', ToastAndroid.LONG)
              }}>
              <Text style={[GFontM, styll.buttonText]}>{t('Update')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
