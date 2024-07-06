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
import WebView from 'react-native-webview';
import Globals from '../../../utils/Globals';
import Routes from '../../../navigation/Routes';
//import { WebView } from 'react-native-webview';

export const termsWebview = props => {
  return (
    <BaseView
      navigation={props.navigation}
      title={'Terms'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.TERMS_AND_CONDITION)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <WebView
            source={{
              uri: `${Globals.imgBaseURL}/html/asli_terms.html`,
              //uri: 'http://172.16.0.2:1167/html/asli_terms.html',
            }}
            style={{ flex: 1 }}
          />
        );
      }}
    />
  );
};
