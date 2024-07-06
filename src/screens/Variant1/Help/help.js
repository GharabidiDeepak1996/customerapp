import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  ToastAndroid,
  useColorScheme,
  View,
  Alert,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';
import BaseView from '../../BaseView';
import colors from '../../../../branding/carter/styles/light/Colors';
import Routes from '../../../navigation/Routes';
import DeviceInfo from 'react-native-device-info';

export const about = props => {
  return (
    <BaseView
      navigation={props.navigation}
      title={'About'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={{ marginBottom: 40 }}>
            <View
              style={{
                padding: 16,
                borderRadius: 4,

                marginBottom: 5,
                marginTop: 10,
                borderColor: colors.primaryGreenColor,
                borderWidth: 1,
              }}>
              {/* <Text
                style={{
                  marginStart: 10,
                  color: colors.primaryGreenColor,
                }}>
                Asli Customer App
              </Text> */}
              <Text
                style={{
                  marginStart: 10,
                  color: colors.primaryGreenColor,
                }}>
                App Version : {DeviceInfo.getVersion()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(Routes.FAQ_WEBVIEW);
              }}>
              <View
                style={{
                  padding: 16,
                  borderRadius: 4,

                  marginBottom: 5,
                  marginTop: 10,
                  borderColor: colors.primaryGreenColor,
                  borderWidth: 1,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginStart: 10,
                    color: colors.primaryGreenColor,
                  }}>
                  FAQ
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(Routes.HELP_WEBVIEW);
              }}>
              <View
                style={{
                  padding: 16,
                  borderRadius: 4,

                  marginBottom: 5,
                  marginTop: 10,
                  borderColor: colors.primaryGreenColor,
                  borderWidth: 1,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginStart: 10,
                    color: colors.primaryGreenColor,
                  }}>
                  Help
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};
