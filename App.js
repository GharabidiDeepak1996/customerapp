import React, {StrictMode, useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {RootStack} from './src/navigation/RootStack';
import {
  SafeAreaConsumer,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Globals from './src/utils/Globals';
import AppConfig from './branding/App_config';
import {Provider} from 'react-redux';
import {persistor, mystore} from './src/redux/store';
import {ProductService} from './src/apis/services/product';
import PushController from './src/utils/PushController';
import {
  getIsConnected,
  startNetworkMonitoring,
  stopNetworkMonitoring,
} from './src/utils/NetworkCheck';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {toastConfig} from './src/utils/ToastMessage';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const lightColors = AppConfig.lightColors.default;
const darkColors = AppConfig.darkColors.default;

const DarkTheme = {
  dark: true,
  colors: darkColors,
};

const LightTheme = {
  dark: false,
  colors: lightColors,
};

function App() {
  const scheme = useColorScheme();

  useEffect(() => {
    startNetworkMonitoring();
    return () => {
      stopNetworkMonitoring();
    };
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <StrictMode>
      <Provider store={mystore}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer
              theme={scheme === 'dark' ? DarkTheme : LightTheme}>
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
