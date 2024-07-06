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

export const faqWebview = props => {
  return (
    <BaseView
      navigation={props.navigation}
      title={'FAQ'}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <WebView
            source={{
              uri: `${Globals.imgBaseURL}/html/asli_customer_faq.html`,

            }}
            style={{ flex: 1 }}
          />
        );
      }}
    />
  );
};
