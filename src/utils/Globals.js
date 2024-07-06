import Routes from '../navigation/Routes';
import { Animated, Platform } from 'react-native';
import AppConfig from '../../branding/App_config';
import assets from '../../branding/carter/assets/Assets';
import { CommonActions } from '@react-navigation/native';
//import Config from '../../branding/carter/configuration/Config';
import IconNames from '../../branding/carter/assets/IconNames';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = AppConfig.lightColors.default;

/**
 * App Constants
 */
class Globals {
  static SAFE_AREA_INSET = {};

  // static baseUrl = Platform.select({
  //   local: process.env.BASE_URL,
  //   development: process.env.BASE_URL,
  //   production: process.env.BASE_URL,
  // });

  // static imgBaseURL = Platform.select({
  //   local: process.env.IMAGE_BASE_URL,
  //   development: process.env.IMAGE_BASE_URL,
  //   production: process.env.IMAGE_BASE_URL,
  // });

  // static baseUrlForPayment = Platform.select({
  //   local: process.env.BASE_URL_PAYMENT,
  //   development: process.env.BASE_URL_PAYMENT,
  //   production: process.env.BASE_URL_PAYMENT,
  // });

  // local
  static baseUrl = 'http://172.16.0.2:1175/customer';
  static imgBaseURL = 'http://172.16.0.2:1167/';
  static baseUrlForPayment = 'http://172.16.0.2:1175/Payment';
  static googleApiKey = 'AIzaSyDlC_5Z9PeozxF4Vf6LnRfJU9q9mOfG2wM'; //AIzaSyDlC_5Z9PeozxF4Vf6LnRfJU9q9mOfG2wM
  static build = 'Local Build';

  //local67
  // static baseUrl = 'http://103.209.36.67:1175/customer';
  // static imgBaseURL = 'http://103.209.36.67:1167/'; //local api
  // static baseUrlForPayment = 'http://103.209.36.67:1175/Payment';
  // static googleApiKey = 'AIzaSyDlC_5Z9PeozxF4Vf6LnRfJU9q9mOfG2wM';  //AIzaSyDlC_5Z9PeozxF4Vf6LnRfJU9q9mOfG2wM
  // static build = 'public Build';
  //

  // staging
  // static baseUrl = 'https://apitest.asli-satu.id/customer';
  // static baseUrlForPayment = 'https://apitest.asli-satu.id/payment';
  // static imgBaseURL = 'https://cdn.asli-satu.id/';
  // static build = 'Staging Build';
  // static googleApiKey = 'AIzaSyDlC_5Z9PeozxF4Vf6LnRfJU9q9mOfG2wM';

  // production
  // static baseUrl = 'https://api.asli-satu.id/customer';
  // static baseUrlForPayment = 'https://api.asli-satu.id/payment';
  // static imgBaseURL = 'https://cdn.asli-satu.id/';
  // static googleApiKey = 'AIzaSyDlC_5Z9PeozxF4Vf6LnRfJU9q9mOfG2wM';
  // static build = '';
  //


  //Profile List
  static profileList = navigation => {
    return [
      {
        id: 1,
        icon: IconNames.UserAlt,
        //title: t('Profile'),
        title: 'Profile',
        onPress: () => navigation.navigate(Routes.ABOUT_ME),
      },
      {
        id: 2,
        icon: IconNames.Box,
        title: 'My Orders',
        onPress: () => navigation.navigate(Routes.MY_ORDERS),
      },
      {
        id: 3,
        icon: IconNames.MapMarkerAlt,
        title: 'My Address Book',
        onPress: () => navigation.navigate(Routes.My_Address, { isNew: true }),
      },
      {
        id: 4,
        icon: IconNames.Exchange,
        title: 'Transaction',
        onPress: () => navigation.navigate(Routes.My_CREDIT_CARDS),
      },
      // {
      //   id: 5,
      //   icon: IconNames.MoneyBillWave,
      //   title: 'Discount/Offers',
      //   onPress: () => navigation.navigate(Routes.TRANSACTIONS),
      // },
      {
        id: 6,
        icon: IconNames.Heart,
        title: 'Favourites',
        onPress: () => navigation.navigate(Routes.NEW_FAVOURITES),
      },
      {
        id: 7,
        icon: IconNames.LockKeyhole,
        title: 'Settings',
        onPress: () => navigation.navigate(Routes.CATEGORY_LIST),
      },
      {
        id: 8,
        icon: IconNames.Globe,
        title: 'Language',
        onPress: () => navigation.navigate(Routes.LANGUAGE_POP_UP),
      },
      {
        id: 10,
        icon: IconNames.Tag,
        title: 'About',
        onPress: () => navigation.navigate(Routes.HELP),
      },
      {
        id: 11,
        icon: IconNames.ClipboardCheck,
        title: 'Terms and Condition',
        onPress: () => navigation.navigate(Routes.TERMS_AND_CONDITION),
      },
      {
        id: 9,
        icon: IconNames.PowerOff,
        title: 'Sign out',
        onPress: () => {
          console.log('==============', 'singout');

          // AsyncStorage.clear();
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 1,
          //     routes: [{name: Routes.LOGIN_FORM_SCREEN1}],
          //   }),
          // );
          //         routes: [{ name: Routes.VERIFY_NUMBER_OTP_SCREEN }],

          //  Routes.LOGIN_FORM_SCREEN1;

          AsyncStorage.clear();
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: Routes.LOGIN_FORM_SCREEN1 }],
            }),
          );
        },
      },
    ];
  };
}

export default Globals;
