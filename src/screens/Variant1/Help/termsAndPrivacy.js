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

export const termsAndCondition = props => {
  return (
    <BaseView
      navigation={props.navigation}
      title={'Terms and Condition'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={{ marginBottom: 40 }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(Routes.TERMS_WEBVIEW);
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
                  Terms
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(Routes.PRIVACY_POLICY_WEBVIEW);
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
                  Privacy Policy
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};
