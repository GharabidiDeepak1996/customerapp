// NetworkCheck.js

import NetInfo from '@react-native-community/netinfo';
import { ToastAndroid } from 'react-native';
import { showToast } from './ToastMessage';
let isConnected = true;

const handleConnectivityChange = connectionInfo => {
  isConnected = connectionInfo.isConnected;
  if (!isConnected) {
    console.log(
      'No internet connection===================================================================================================>',
    );
    // showToast("error", "poor internet connection detected", "")

    ToastAndroid.show(' internet connection lost', ToastAndroid.SHORT);
  } else {
    console.log(
      'internet connection===================================================================================================>',
    );
  }
  //    else {
  //     ToastAndroid.show('poor internet connection detected', ToastAndroid.SHORT);
  //   }
};

const startNetworkMonitoring = () => {
  console.log(
    'startNetworkMonitoring===================================================================================================>',
  );
  NetInfo.addEventListener(handleConnectivityChange);
};

const stopNetworkMonitoring = () => {
  console.log(
    'stopNetworkMonitoring===================================================================================================>',
  );
  NetInfo.removeEventListener(handleConnectivityChange);
};

const getIsConnected = () => {
  return isConnected;
};

export { startNetworkMonitoring, stopNetworkMonitoring, getIsConnected };
