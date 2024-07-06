import React, { useEffect, useRef, useState } from 'react';
import {
  useColorScheme,
  View,
  TouchableOpacity,
  Switch,
  ToastAndroid,
} from 'react-native';
import { Text } from 'react-native-elements';
import BaseView from '../screens/BaseView';
import { SvgIcon } from '../components/Application/SvgIcon/View';
import IconNames from '../../branding/carter/assets/IconNames';
import colors from '../../branding/carter/styles/light/Colors';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import AppConfig from '../../branding/App_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Routes from '../navigation/Routes';
const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Language = props => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const [isEnglishEnabled, setIsEnglishEnabled] = useState(false);
  const [isIndonesiaEnabled, setIsIndonesiaEnabled] = useState(false);

  const englishToggleSwitch = value => {
    setIsEnglishEnabled(value);
    setIsIndonesiaEnabled(!value);
    if (value) {
      i18n.changeLanguage('en');
      AsyncStorage.setItem('localLanguage', "'" + 'en' + "'");
    } else {
      i18n.changeLanguage('id');
      AsyncStorage.setItem('localLanguage', "'" + 'id' + "'");
    }
  };

  const indonesiaToggleSwitch = value => {
    setIsEnglishEnabled(!value);
    setIsIndonesiaEnabled(value);
    console.log('dkjfodjod', value);
    if (value) {
      i18n.changeLanguage('id');
      AsyncStorage.setItem('localLanguage', "'" + 'id' + "'");
    } else {
      i18n.changeLanguage('en');
      AsyncStorage.setItem('localLanguage', "'" + 'en' + "'");
    }
  };

  useEffect(() => {
    if (i18n && i18n?.language == 'en') {
      setIsEnglishEnabled(true);
      setIsIndonesiaEnabled(false);
    } else {
      setIsIndonesiaEnabled(true);
      setIsEnglishEnabled(false);
    }

    // (async () => {
    //   try {
    //     const storedLanguage = await AsyncStorage.getItem('localLanguage');
    //     const formattedLanguage = storedLanguage
    //       ? storedLanguage.replace(/['"]+/g, '')
    //       : null;

    //     console.log(
    //       '=====0=0000000000000000',
    //       i18n?.language,
    //       formattedLanguage,
    //     );
    //     if (i18n && i18n?.language == storedLanguage) {
    //       setIsEnglishEnabled(true);
    //       setIsIndonesiaEnabled(false);
    //       await AsyncStorage.setItem('localLanguage', "'" + 'en' + "'");
    //     } else {
    //       setIsIndonesiaEnabled(true);
    //       setIsEnglishEnabled(false);
    //       await AsyncStorage.setItem('localLanguage', "'" + 'id' + "'");
    //     }
    //   } catch (error) {
    //     // Cast 'error' to 'any' to handle the TypeScript error
    //     console.log('Error in language:', error);
    //   }
    // })();
  }, []);

  return (
    <BaseView
      navigation={props.navigation}
      title={'Select Language'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View>
            <TouchableOpacity
              onPress={() => {
                //item.onPress()
                console.log(i18n?.language == 'id');
              }}
              style={{ flexDirection: 'row' }}>
              {/* <SvgIcon
                type={IconNames.Globe}
                width={20}
                height={20}
                color={colors.activeColor}
              /> */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.RUBIK_MEDIUM,
                      fontSize: Typography.P2,
                      color: 'black',
                      marginVertical: 16,
                    }}>
                    English
                  </Text>
                </View>

                <View>
                  <Switch
                    trackColor={{ false: '#767577', true: colors.activeColor }}
                    thumbColor={
                      isEnglishEnabled
                        ? colors.primaryDarkGreenColor
                        : '#f4f3f4'
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={value => englishToggleSwitch(value)}
                    value={isEnglishEnabled}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                //item.onPress()
              }}
              style={{ flexDirection: 'row' }}>
              {/* <SvgIcon
                type={IconNames.Globe}
                width={20}
                height={20}
                color={colors.activeColor}
              /> */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.RUBIK_MEDIUM,
                      fontSize: Typography.P2,
                      color: 'black',
                    }}>
                    Indonesia
                  </Text>
                </View>

                <View>
                  <Switch
                    trackColor={{ false: '#767577', true: colors.activeColor }}
                    thumbColor={
                      isIndonesiaEnabled
                        ? colors.primaryDarkGreenColor
                        : '#f4f3f4'
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={indonesiaToggleSwitch}
                    value={isIndonesiaEnabled}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};
