import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
  Switch,
} from 'react-native';
import { Styles } from './Styles';
import AppConfig from '../../../../branding/App_config';
import Utilities from '../../../utils/UtilityMethods';
import Globals from '../../../utils/Globals';
import {
  CommonActions,
  useFocusEffect,
  useTheme,
} from '@react-navigation/native';
import {
  setDefaultAddress,
  setDefaultAddressID,
  setDefaultAddressTitle,
  setLat,
  setLng,
  setDefaultAddressDistrict,
} from '../../../redux/features/Address/DefaultAddressSlice';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Routes from '../../../navigation/Routes';
import { FocusAwareStatusBar } from '../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../../../apis/services/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { clearProducts } from '../../../redux/features/AddToCart/ProductSlice';

const assets = AppConfig.assets.default;
import { useTranslation } from 'react-i18next';
import { PaymentService } from '../../../apis/services';
import { formatNumberWithCommas } from '../../../utils/FormatNumberWithCommas';
import DeviceInfo from 'react-native-device-info';

export const Variant1Profile = props => {
  const { t, i18n } = useTranslation();

  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  //var pkg = require('../../../utils/Globals.js');

  //Internal States
  const [profileImage, setProfileImage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState(0);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const getUserName = await AsyncStorage.getItem('displayName');
      const getUserEmail = await AsyncStorage.getItem('email');
      const getUserId = await AsyncStorage.getItem('userId');

      setUserEmail(getUserEmail);
      setUserName(getUserName);
      setUserId(getUserId);
    } catch (e) {
      // error reading value
    }
  };
  const renderProfileListItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          onPressEvent(item.title, item.id, props.navigation);
          //item.onPress()
        }}
        style={screenStyles.profileListingItemContainer}>
        <SvgIcon
          type={item.icon}
          width={20}
          height={20}
          color={colors.activeColor}
          style={screenStyles.profileListingItemLeftImage}
        />

        <Text style={screenStyles.profileListingItemText}>{t(item.title)}</Text>

        <View style={screenStyles.profileListingItemRightContainer}>
          <SvgIcon
            type={IconNames.ChevronRight}
            width={15}
            height={15}
            color={colors.switchBorder}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Sign out', 'Are you sure, you want to sign out?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          logout();
        },
      },
    ]);

  const onPressEvent = (title, id, navigation) => {
    console.log('---------------------', id);
    switch (id) {
      case 1: {
        navigation.navigate(Routes.ABOUT_ME);
        return;
      }
      case 2: {
        navigation.navigate(Routes.MY_ORDERS);
        return;
      }
      case 3: {
        navigation.navigate(Routes.My_Address, { isFromCourier: false });
        return;
      }
      case 4: {
        //Wallets
        //ToastAndroid.show('Work in progress', ToastAndroid.SHORT);
        navigation.navigate(Routes.TRANSACTIONS);
        return;
      }
      // case 5: {
      //   //Discount
      //   ToastAndroid.show('Work in progress', ToastAndroid.SHORT);
      //   // navigation.navigate(Routes.TRANSACTIONS);
      //   return;
      // }
      case 6: {
        //Favourite
        navigation.navigate(Routes.NEW_FAVOURITES, { navigation: navigation });
        return;
      }
      case 7: {
        //Setting
        navigation.navigate(Routes.NOTIFICATIONS);
        return;
      }
      case 8: {
        //Lamguages
        navigation.navigate(Routes.LANGUAGE_SCREEN);
        return;
      }
      case 9: {
        //Sign out
        createTwoButtonAlert();
        return;
      }
      case 10: {
        //Sign out
        navigation.navigate(Routes.ABOUT);
        return;
      }
      case 11: {
        //Sign out
        navigation.navigate(Routes.TERMS_AND_CONDITION);
        return;
      }
      default:
        return null;
    }
  };

  const logout = async () => {
    try {
      let logoutRequest = {
        userId: userId,
      };

      let response = await AuthService.logout(logoutRequest);
      console.log('=======================', response);

      if (response?.data?.isSuccess) {
        //AsyncStorage.clear()
        AsyncStorage.removeItem('userId');
        AsyncStorage.removeItem('accountId');
        AsyncStorage.removeItem('displayName');
        AsyncStorage.removeItem('email');
        AsyncStorage.removeItem('phoneNo');
        AsyncStorage.removeItem('isAlreadyLogin');
        AsyncStorage.setItem('topMargin', 'true');

        dispatch(clearProducts(1));
        dispatch(setDefaultAddress(''));
        dispatch(setDefaultAddressTitle(''));
        dispatch(setLat(0));
        dispatch(setLng(0));
        dispatch(setDefaultAddressID(0));
        dispatch(setDefaultAddressDistrict(''));

        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: Routes.LOGIN_FORM_SCREEN1 }],
          }),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkWalletBal();
    }, []),
  );

  const checkWalletBal = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const response = await PaymentService.checkWalletBalance(getUserId);

      if (response?.data?.isSuccess) {
        setBalance(response?.data?.payload);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };
  return (
    <View style={screenStyles.mainContainer}>
      <FocusAwareStatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={screenStyles.upperContainer}>
        <Text
          style={{
            fontSize: 12,

            color: 'white',
            position: 'absolute',
            right: 16,
            top: 25,
            fontWeight: 'bold',
          }}>
          {Globals.build}
        </Text>
        <Text
          style={{
            fontSize: 12,

            color: 'white',
            position: 'absolute',
            right: 14,
            top: 40,
          }}>
          Version {DeviceInfo.getVersion()}
        </Text>
        <View style={screenStyles.profileImageContainer}>
          <Image
            source={
              profileImage ? { uri: profileImage.uri } : assets.profile_image
            }
            style={screenStyles.profileImage}
          />

          <TouchableOpacity
            onPress={() => {
              Utilities.selectImage(response => {
                setProfileImage(response);
              });
            }}
            activeOpacity={0.8}
            style={[
              globalStyles.buttonShadow,
              screenStyles.profileImageAccessoryViewContainer,
            ]}>
            <SvgIcon
              type={IconNames.Camera}
              width={20}
              height={20}
              color={colors.activeColor}
            />
          </TouchableOpacity>
        </View>

        <View style={screenStyles.infoContainer}>
          <Text style={screenStyles.nameText}>{userName}</Text>
          <Text style={screenStyles.emailText}>{userEmail}</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            marginVertical: 10,
            width: '90%',
            padding: 10,
            borderRadius: 10,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={screenStyles.walletLabel}>Wallet Balance</Text>
              <Text style={screenStyles.balanceStyle}>
                Rp. {formatNumberWithCommas(balance)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.TOPUP_WALLET);
                  //ToastAndroid.show('Work in progress', ToastAndroid.SHORT);
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.activeColor,
                    justifyContent: 'center',

                    padding: 7,
                    marginEnd: 10,
                    borderRadius: 7,
                  }}>
                  <SvgIcon
                    type={IconNames.Plus}
                    width={15}
                    height={15}
                    color={colors.activeColor}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.WALLET_TRANSACTIONS);
                  //ToastAndroid.show('Work in progress', ToastAndroid.SHORT);
                }}>
                <View
                  style={{
                    // backgroundColor: "colors.activeColor",
                    justifyContent: 'center',
                    padding: 7,
                    borderRadius: 7,
                    borderWidth: 1,
                    borderColor: colors.activeColor,
                  }}>
                  <SvgIcon
                    type={IconNames.Exchange}
                    width={15}
                    height={15}
                    color={colors.primaryGreenColor}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={screenStyles.container}>
        <FlatList
          style={screenStyles.listingContainer}
          data={Globals.profileList(props.navigation)}
          renderItem={({ item, index }) => {
            return renderProfileListItem(item, index);
          }}
        />

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{marginTop: 10}}>
            <Text style={screenStyles.profileListingItemText}>English</Text>
          </View>

          <Switch
            trackColor={{false: '#81b0ff', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#4E9F3D' : '#4E9F3D'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{paddingVertical: 8}}
          />

          <View style={{marginTop: 10}}>
            <Text style={screenStyles.profileListingItemText}> Indonesia</Text>
          </View>
        </View> */}

        {/* <TouchableOpacity
          onPress={() => {
            //item.onPress()
          }}
          style={screenStyles.languageItemContainer}>
          <SvgIcon
            type={IconNames.Globe}
            width={20}
            height={20}
            color={colors.activeColor}
            style={screenStyles.profileListingItemLeftImage}
          />

          <Text style={screenStyles.profileListingItemText}>Language</Text>

          <View style={screenStyles.profileListingItemRightContainer}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </TouchableOpacity> */}

        {/* <TouchableOpacity

          onPress={() => { }}
          style={screenStyles.profileListingItemContainer}>
          <SvgIcon
            // type={item.icon}
            width={20}
            height={20}
            color={colors.activeColor}
            style={screenStyles.profileListingItemLeftImage}
          />

          <Text style={screenStyles.profileListingItemText}>sd</Text>

          <View style={screenStyles.profileListingItemRightContainer}>
            <SvgIcon
              type={IconNames.ChevronRight}
              width={15}
              height={15}
              color={colors.switchBorder}
            />
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
