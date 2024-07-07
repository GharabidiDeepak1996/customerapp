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
import {
  SafeAreaConsumer,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Globals from './src/utils/Globals';
import AppConfig from './branding/App_config';
import {Provider} from 'react-redux';
import {persistor, mystore} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
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
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Config from './branding/carter/configuration/Config';
import Routes from './src/navigation/Routes';
import {SplashScreen} from './src/screens/splash/View';
import Variant1Intro from './src/screens/Variant1/Intro/View';

const lightColors = AppConfig.lightColors.default;
const darkColors = AppConfig.darkColors.default;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
      <SafeAreaProvider>
        <Provider store={mystore}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer
              theme={scheme === 'dark' ? DarkTheme : LightTheme}>
              <RootStack />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </StrictMode>
  );
}

const bottomTabsVariant = () => {
  return (
    <Tab.Navigator tabBar={props => <Variant3BottomTabBar {...props} />}>
      <Tab.Screen
        name={Routes.DASHBOARD_VARIENT_1}
        component={Variant1Dashboard}
      />
      <Tab.Screen
        name={Routes.GROCERY}
        component={Variant1Home}
        initialParams={{categoryTypeId: '1'}}
      />
      <Tab.Screen
        name={Routes.FOOD}
        component={Variant1Home}
        initialParams={{categoryTypeId: '2'}}
      />
      {/* <Tab.Screen
        name={Routes.COURIER_DELIVERY_DETAILS}
        component={DeliveryDetails}
        initialParams={{pickupAddress: ''}}
      /> */}

      <Tab.Screen
        name={Routes.FRESH_GOODS}
        component={Variant1Home}
        initialParams={{categoryTypeId: '5'}}
      />

      <Tab.Screen
        name={Routes.COURIER}
        component={Courier}
        options={{unmountOnBlur: true}}
        initialParams={{
          pickupAddress: undefined,
        }}
      />
      {/* <Tab.Screen name={Routes.COURIER} component={Courier} initialParams={{
        pickupTitle: "",
        pickupAddress: "",
        pickupLat: "",
        pickupLng: "",
        idp: "",
        subDistrictTitle: "",
        subDistrictIdPickUp: "",
      }} /> */}

      <Tab.Screen name={Routes.RIDE} component={Ride} />
      <Tab.Screen name={Routes.PROFILE} component={Variant1Profile} />
    </Tab.Navigator>
  );
};

const Header = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{marginHorizontal: 10}}>
      <SvgIcon
        style={{}}
        color={'#000'}
        width={25}
        height={25}
        type={IconNames.ArrowLeft}
      />
    </TouchableOpacity>
  );
};

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

export function RootStack() {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName={Config.SELECTED_VARIANT}
        headerMode={'none'}
        screenOptions={{
          ...(Platform.OS === 'android' &&
            TransitionPresets.RevealFromBottomAndroid),
        }}>
        {/* <Stack.Screen name={Routes.SPLASH_SCREEN} component={SplashScreen} /> */}
        <Stack.Screen name={Routes.INTRO_SCREEN1} component={Variant1Intro} />
      </Stack.Navigator>
    </View>
  );
}
export default App;
