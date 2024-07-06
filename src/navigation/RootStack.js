import * as React from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Routes from './Routes';
import {SplashScreen} from '../screens/splash/View';

import {Variant1Intro} from '../screens/Variant1/Intro/View';
import {Variant1LoginScreen} from '../screens/Variant1/Login/View';
import {Variant1LoginFormScreen} from '../screens/Variant1/LoginForm/View';
import {Variant1SignupScreen} from '../screens/Variant1/Signup/View';
import {Variant1ForgotPassword} from '../screens/Variant1/ForgotPassword/View';

import {ProductDetail} from '../screens/ProductDetail/View';
import {ReviewList} from '../screens/ReviewList/View';
import {AddReview} from '../screens/AddReview/View';
import {CartList} from '../screens/CartList/View';
import {CheckoutDelivery} from '../screens/CheckoutDelivery/View';
import {CheckoutAddress} from '../screens/CheckoutAddress/View';
import {CheckoutPayment} from '../screens/CheckoutPayment/View';
import {OrderSuccess} from '../screens/OrderSuccess/View';
import {AboutMe} from '../screens/AboutMe/View';
import {MyOrders} from '../screens/MyOrders/View';
import {Variant1Profile} from '../screens/Variant1/Profile/View';
import {Variant1Home} from '../screens/Variant1/Home/View';
import {PopularDeals} from '../screens/PopularDeals/View';
import {CategoryList} from '../screens/CategoryList/View';
import {Search} from '../screens/Search/View';
import {AddAddress} from '../screens/AddAddress/View';
import {MyAddress} from '../screens/MyAddress/View';
import {MyCreditCards} from '../screens/MyCreditCards/View';
import {AddCreditCard} from '../screens/AddCreditCard/View';
import {Transactions} from '../screens/Transactions/View';
import {Notifications} from '../screens/Notifications/View';
import {ApplyFilters} from '../screens/ApplyFilters/View';
import {TrackOrder} from '../screens/TrackOrder/View';
import {CheckoutSelectCard} from '../screens/CheckoutSelectCard/View';
import {CheckoutSelectAccount} from '../screens/CheckoutSelectAccount/View';
import {SelfPickup} from '../screens/SelfPickup/View';
import {CartSummary} from '../screens/CartSummary/View';
import Config from '../../branding/carter/configuration/Config';
import {Variant3BottomTabBar} from '../components/Application/Variant3BottomTabBar/View';
import {VerifyPhone} from '../screens/VerifyNumber/View';
import {VerifyPhoneOTP} from '../screens/VerifyNumberOTP/View';
import {Variant1Dashboard} from '../screens/Variant1/Dashboard/View';
import {PlacesAutoComplete} from '../screens/Variant1/AddressAutoComplete/PlacesAutoComplete';
import {AddAddressFromMap} from '../screens/Variant1/AddAddress/AddAddressFromMap';
import {AddAddressDetails} from '../screens/Variant1/AddAddress/AddAddressDetails';
import CheckoutSelectedProduct from '../screens/CheckoutSelectedProduct/View';
import {AddressListSheet} from '../screens/Variant1/Dashboard/AddressList/AddressListSheet';
import {OrderDetails} from '../screens/OrderDetails/View';
import {SavedAddressList} from '../screens/Variant1/Dashboard/AddressList/SavedAddress';
import {Store} from '../screens/Store/View';
import {BestSellingStore} from '../screens/BestSellingStore/View';
import {NearByStore} from '../screens/NearByStore/View';
import {GroceryProduct} from '../screens/GroceryProduct/View';
import {FoodProduct} from '../screens/FoodProduct/View';
import {StoreSelling} from '../screens/StoreSelling/View';
import {ServiceLocation} from '../screens/Variant1/ServiceLocation/View';
import {Rating, RatingScreen} from '../screens/Rating/View';
import {StoreFoodSelling} from '../screens/StoreFoodSelling/View';
import {LanguagePop} from '../components/Application/LanguageBottomSheet/languagePop';
import {Language} from '../utils/Language';
// import { InterDeliveryModal } from '../components/Application/InterDeliveryModal/InterDeliveryModal';
import {Courier} from '../screens/Variant1/Courier/View';
import {DeliveryDetails} from '../screens/Variant1/Courier/DeliveryDetailsScreen/DeliveryDetails';
import {InterDeliveryModal} from '../components/Application/InterDeliveryModal/InterDeliveryModal';
import {Ride} from '../screens/Variant1/Courier copy/View';
import {RIDEDETAILS} from '../screens/Variant1/Courier copy/DeliveryDetailsScreen/DeliveryDetails';
import {MyAddressRide} from '../screens/MyAddress copy/View';
import {PlacesAutoCompleteForReg} from '../screens/Variant1/AddressAutoCompleteForRegistration/PlacesAutoCompleteForReg';
import {AddAddressFromMapForReg} from '../screens/Variant1/AddAddressForRegistrationFlow/AddAddressFromMapForReg';
import {AddAddressDetailsForReg} from '../screens/Variant1/AddAddressForRegistrationFlow/AddAddressDetailsForReg';
import {ChangePasswordModal} from '../screens/Variant1/Profile/ChangePasswordModal';
import {NewFavourites} from '../screens/NewFavourites/View';
import {MyAddressForSendAndRide} from '../screens/MyAddressForSendAndRide/View';
import {FilterOrderModal} from '../components/Application/FilterOrderModal/FilterOrderModal';
import {MapTrackOrder} from '../screens/MapTrackOrder/View';
import PushController from '../utils/PushController';
import {termsAndCondition} from '../screens/Variant1/Help/termsAndPrivacy';
import {about, help} from '../screens/Variant1/Help/help';
import {faqWebview} from '../screens/Variant1/Help/faqWebView';
import {termsWebview} from '../screens/Variant1/Help/termsWebView';
import {privacyPolicyWebview} from '../screens/Variant1/Help/privacyPolicyWebView';
import {helpWebview} from '../screens/Variant1/Help/helpWebView';
import {GiftedChatPage} from '../screens/GIftedChat/GIftedChat';
import {GFont} from '../screens/Variant1/Profile/fontFamily';
import {SvgIcon} from '../components/Application/SvgIcon/View';
import IconNames from '../../branding/carter/assets/IconNames';
import {useNavigation} from '@react-navigation/native';
import {TopupWallet} from '../screens/Wallet/TopupWallet';
import {SelectBankForWalletTopup} from '../screens/Wallet/SelectBankForWalletTopup';
import {WalletTransactions} from '../screens/WalletTransactions/View';
import {SingleMapTrackOrder} from '../screens/SingleOrderMapTracking/View';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

function bottomTabsVariant3() {
  //Hide Deepak
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
}

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
        <Stack.Screen name={Routes.SPLASH_SCREEN} component={SplashScreen} />
        <Stack.Screen name={Routes.INTRO_SCREEN1} component={Variant1Intro} />
        <Stack.Screen
          name={Routes.LOGIN_SCREEN1}
          component={Variant1LoginScreen}
        />
        <Stack.Screen
          name={Routes.LOGIN_FORM_SCREEN1}
          component={Variant1LoginFormScreen}
        />
        <Stack.Screen
          name={Routes.SIGNUP_FORM_SCREEN1}
          component={Variant1SignupScreen}
        />
        <Stack.Screen
          name={Routes.FORGOT_PASSWORD_FORM_SCREEN1}
          component={Variant1ForgotPassword}
        />
        <Stack.Screen
          name={Routes.LANGUAGE_POP_UP}
          component={LanguagePop}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            contentStyle: {backgroundColor: '#40404040'},
          }}
        />
        <Stack.Screen
          name={Routes.INTERDELIVERY}
          component={InterDeliveryModal}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            contentStyle: {backgroundColor: '#40404040'},
          }}
        />
        <Stack.Screen
          name={Routes.filterOrder}
          component={FilterOrderModal}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            contentStyle: {backgroundColor: '#40404040'},
          }}
        />
        <Stack.Screen
          name={Routes.CHANGEPASSWORD}
          component={ChangePasswordModal}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            contentStyle: {backgroundColor: '#40404040'},
          }}
        />
        <Stack.Screen
          name={Routes.ChatUs}
          component={GiftedChatPage}
          options={({navigation}) => ({
            title: <Text style={GFont}>{'Chat Us'}</Text>,
            headerLeft: () => <Header />,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#fff', // Set a solid background color
            },
            headerTintColor: '#000',
          })}
        />
        <Stack.Screen
          name={Routes.PLACES_AUTO_COMPLETE}
          component={PlacesAutoComplete}
        />
        <Stack.Screen
          name={Routes.PLACES_AUTO_COMPLETE_FOR_REG}
          component={PlacesAutoCompleteForReg}
        />
        <Stack.Screen
          name={Routes.SERVICE_LOCATION}
          component={ServiceLocation}
        />
        <Stack.Screen
          name={Routes.BOTTOM_ADDRESS_SHEET}
          component={AddressListSheet}
        />
        <Stack.Screen name={Routes.NEARBYSTORE_LIST} component={NearByStore} />
        <Stack.Screen
          name={Routes.BESTSELLINGSTORE_LIST}
          component={BestSellingStore}
        />
        <Stack.Screen
          name={Routes.SAVED_ADDRESS_LIST}
          component={SavedAddressList}
        />
        <Stack.Screen name={Routes.ORDER_DETAILS} component={OrderDetails} />
        <Stack.Screen name={Routes.STORE} component={Store} />
        <Stack.Screen name={Routes.STORE_SELLING} component={StoreSelling} />
        <Stack.Screen
          name={Routes.STORE_FOOD_SELLING}
          component={StoreFoodSelling}
        />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_FROM_MAP}
          component={AddAddressFromMap}
        />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_DETAILS_FOR_REG}
          component={AddAddressDetailsForReg}
        />
        <Stack.Screen name={Routes.NEW_FAVOURITES} component={NewFavourites} />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_FROM_MAP_FOR_REG}
          component={AddAddressFromMapForReg}
        />
        <Stack.Screen
          name={Routes.ADD_ADDRESS_DETAILS}
          component={AddAddressDetails}
        />
        <Stack.Screen
          name={Routes.VERIFY_NUMBER_SCREEN}
          component={VerifyPhone}
        />
        <Stack.Screen
          name={Routes.VERIFY_NUMBER_OTP_SCREEN}
          component={VerifyPhoneOTP}
        />
        <Stack.Screen name={Routes.Rating} component={RatingScreen} />
        <Stack.Screen
          name={Routes.CHECKOUT_SELECTED_PRODUCT}
          component={CheckoutSelectedProduct}
        />
        <Stack.Screen
          name={Routes.HOME_VARIANT1}
          component={bottomTabsVariant3}
        />
        <Stack.Screen name={Routes.CATEGORY_LIST} component={CategoryList} />
        <Stack.Screen
          name={Routes.GROCERY_PRODUCT}
          component={GroceryProduct}
        />
        <Stack.Screen name={Routes.FOOD_PRODUCT} component={FoodProduct} />
        <Stack.Screen name={Routes.POPULAR_DEALS} component={PopularDeals} />
        <Stack.Screen name={Routes.PRODUCT_DETAIL} component={ProductDetail} />
        <Stack.Screen name={Routes.REVIEW_LIST} component={ReviewList} />
        <Stack.Screen name={Routes.ADD_REVIEW} component={AddReview} />
        <Stack.Screen
          name={Routes.CHECKOUT_DELIVERY}
          component={CheckoutDelivery}
        />
        <Stack.Screen
          name={Routes.CHECKOUT_ADDRESS}
          component={CheckoutAddress}
        />
        <Stack.Screen
          name={Routes.CHECKOUT_PAYMENT}
          component={CheckoutPayment}
        />
        <Stack.Screen
          name={Routes.CHECKOUT_SELECT_CARD}
          component={CheckoutSelectCard}
        />
        <Stack.Screen
          name={Routes.CHECKOUT_SELECT_ACCOUNT}
          component={CheckoutSelectAccount}
        />
        <Stack.Screen name={Routes.SELF_PICKUP} component={SelfPickup} />
        <Stack.Screen name={Routes.CART_SUMMARY} component={CartSummary} />
        <Stack.Screen name={Routes.TRACK_ORDERS} component={TrackOrder} />
        <Tab.Screen name={Routes.CART} component={CartList} />
        <Stack.Screen name={Routes.ORDER_SUCCESS} component={OrderSuccess} />
        <Stack.Screen name={Routes.ABOUT_ME} component={AboutMe} />
        <Stack.Screen
          name={Routes.MY_ORDERS}
          component={MyOrders}
          initialParams={{hideback: true}}
        />
        <Stack.Screen name={Routes.My_Address} component={MyAddress} />
        <Stack.Screen
          name={Routes.My_AddressForSendAndRide}
          component={MyAddressForSendAndRide}
        />
        <Stack.Screen
          name={Routes.MAP_TRACK_ORDERS}
          component={MapTrackOrder}
        />
        <Stack.Screen
          name={Routes.SINGLE_MAP_TRACK_ORDERS}
          component={SingleMapTrackOrder}
        />
        <Stack.Screen name={Routes.My_AddressRide} component={MyAddressRide} />
        <Stack.Screen name={Routes.Add_Address} component={AddAddress} />
        <Stack.Screen name={Routes.My_CREDIT_CARDS} component={MyCreditCards} />
        <Stack.Screen name={Routes.ADD_CREDIT_CARD} component={AddCreditCard} />
        <Stack.Screen name={Routes.TRANSACTIONS} component={Transactions} />
        <Stack.Screen name={Routes.TOPUP_WALLET} component={TopupWallet} />
        <Stack.Screen
          name={Routes.WALLET_TRANSACTIONS}
          component={WalletTransactions}
        />
        <Stack.Screen
          name={Routes.SELECT_BANK_FOR_WALLET_TOPUP}
          component={SelectBankForWalletTopup}
        />
        <Stack.Screen name={Routes.NOTIFICATIONS} component={Notifications} />
        <Stack.Screen name={Routes.SEARCH} component={Search} />
        <Stack.Screen name={Routes.APPLY_FILTERS} component={ApplyFilters} />
        <Stack.Screen name={Routes.LANGUAGE_SCREEN} component={Language} />
        {/* <Stack.Screen name={Routes.EDIT_LANGUAGE_SCREEN} component={EditLanguage} />
        <Stack.Screen name={Routes.SAVED_ADDRESS_SHEET} component={SavedAddressSheet} /> */}
        <Stack.Screen name={Routes.LOGOUT} component={Logout} />
      </Stack.Navigator>
    </View>
  );
}
