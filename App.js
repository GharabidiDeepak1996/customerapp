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
import Variant1LoginFormScreen from './src/screens/Variant1/LoginForm/View';
import {Variant1ForgotPassword} from './src/screens/Variant1/ForgotPassword/View';
import Variant1SignupScreen from './src/screens/Variant1/Signup/View';
import PlacesAutoCompleteForReg from './src/screens/Variant1/AddressAutoCompleteForRegistration/PlacesAutoCompleteForReg';
import AddAddressFromMapForReg from './src/screens/Variant1/AddAddressForRegistrationFlow/AddAddressFromMapForReg';
import AddAddressFromMap from './src/screens/Variant1/AddAddress/AddAddressFromMap';
import AddAddressDetailsForReg from './src/screens/Variant1/AddAddressForRegistrationFlow/AddAddressDetailsForReg';
import {Variant1Dashboard} from './src/screens/Variant1/Dashboard/View';
import {Variant1Home} from './src/screens/Variant1/Home/View';
import {Courier} from './src/screens/Variant1/Courier/View';
import {Ride} from './src/screens/Variant1/Courier copy/View';
import {Variant1Profile} from './src/screens/Variant1/Profile/View';
import Variant3BottomTabBar from './src/components/Application/Variant3BottomTabBar/View';
import MyAddress from './src/screens/MyAddress/View';
import DeliveryDetails from './src/screens/Variant1/Courier/DeliveryDetailsScreen/DeliveryDetails';

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

function BottomTabsVariant() {
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

      <Tab.Screen
        name={Routes.COURIER_DELIVERY_DETAILS}
        component={DeliveryDetails}
        initialParams={{pickupAddress: ''}}
      />

      <Tab.Screen name={Routes.RIDE} component={Ride} />
      <Tab.Screen name={Routes.PROFILE} component={Variant1Profile} />
    </Tab.Navigator>
  );
}

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
        <Stack.Screen
          name={Routes.LOGIN_FORM_SCREEN1}
          component={Variant1LoginFormScreen}
        />
        <Stack.Screen
          name={Routes.FORGOT_PASSWORD_FORM_SCREEN1}
          component={Variant1ForgotPassword}
        />
        <Stack.Screen
          name={Routes.SIGNUP_FORM_SCREEN1}
          component={Variant1SignupScreen}
        />
        <Stack.Screen
          name={Routes.PLACES_AUTO_COMPLETE_FOR_REG}
          component={PlacesAutoCompleteForReg}
        />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_FROM_MAP_FOR_REG}
          component={AddAddressFromMapForReg}
        />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_FROM_MAP}
          component={AddAddressFromMap}
        />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_DETAILS_FOR_REG}
          component={AddAddressDetailsForReg}
        />
        <Stack.Screen
          name={Routes.HOME_VARIANT1}
          component={BottomTabsVariant}
        />
        <Stack.Screen name={Routes.My_Address} component={MyAddress} />
      </Stack.Navigator>
    </View>
  );
}
export default App;
