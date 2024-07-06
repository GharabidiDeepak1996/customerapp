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
import { WebView } from 'react-native-webview';
import Globals from '../../../utils/Globals';
import Routes from '../../../navigation/Routes';

export const privacyPolicyWebview = props => {
  return (
    <BaseView
      navigation={props.navigation}
      title={'Privacy Policy'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.TERMS_AND_CONDITION)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <WebView
            source={{
              uri: `${Globals.imgBaseURL}/html/asli_privacy_policy.html`,

            }}
            style={{ flex: 1 }}
          />
        );
      }}
    />
  );
};
