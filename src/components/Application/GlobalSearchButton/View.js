import React, { useState } from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
} from 'react-native';

import { Styles } from './Styles';
import { useTheme, useNavigation } from '@react-navigation/native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { useTranslation } from 'react-i18next';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { PaymentService } from '../../../apis/services';
import { useFocusEffect } from '@react-navigation/native';
import Routes from '../../../navigation/Routes';
import { formatNumberWithCommas } from '../../../utils/FormatNumberWithCommas';
import assets from '../../../../branding/carter/assets/Assets';

export const GlobalSearchButton = props => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);
  const [balance, setBalance] = useState(0);

  // State to manage the search input
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      checkWalletBal();
    }, []),
  );
  const checkWalletBal = async () => {
    setLoading(true);
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const response = await PaymentService.checkWalletBalance(getUserId);
      setLoading(false);

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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 1,
        alignItems: 'center',
        paddingVertical: 20,
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          screenStyles.buttonContainer,
          { flex: 0.5, marginStart: 10, marginEnd: 5 },
        ]}>
        <SvgIcon
          type={IconNames.Search}
          width={20}
          height={20}
          color={colors.inputColor}
          style={screenStyles.leftIcon}
        />

        <Text style={screenStyles.Text} numberOfLines={1}>
          {props.name}
        </Text>
        {/* <Text style={screenStyles.Text} numberOfLines={1}>
        {t('Dishes')}, {t('Restaurants')}, {t('Groceries')} & {t('More')}
      </Text> */}

        {/* <SvgIcon
        type={IconNames.SlidersH}
        width={20}
        height={20}
        color={colors.inputColor}
        style={screenStyles.rightIcon}
      /> */}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(Routes.WALLET_TRANSACTIONS);
        }}
        style={[
          {
            flex: 0.5,
            height: heightPercentageToDP(4.5),
            marginStart: 5,
            marginEnd: 10,
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 3,
            borderRadius: 7,
            elevation: 0,
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderColor: '#444',
            minHeight: heightPercentageToDP(4.5),
            alignItems: 'center',
            paddingLeft: widthPercentageToDP(2),
          },
        ]}>
        <Image
          source={assets.wallet_ic}
          resizeMode={'contain'}
          style={screenStyles.walletIcon}
        />

        {/* <SvgIcon
          type={IconNames.Wallet}
          width={20}
          height={20}
          color={colors.primaryGreenColor}
          style={{
            marginRight: 8,
            marginLeft: 5,
          }}
        /> */}
        {loading ? (
          <ActivityIndicator size="small" color={colors.activeColor} />
        ) : (
          <View>
            <Text
              style={{
                color: colors.primaryGreenColor,
                fontWeight: 'bold',
                fontSize: 14,
              }}>
              Rp. {formatNumberWithCommas(balance)}
            </Text>
            <Text
              style={{
                color: 'black',

                fontSize: 10,
              }}>
              {/* Top up ASLIPay */}
              KadexKoins
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// t(Dishes), t(Restaurants), t(Groceries) & t(More)
{
  /* //////////////////////////////End////////////////////////////// */
}

{
  /* <Text style={screenStyles.Text}>Dishes,restaurants,groceries & more</Text> */
}

{
  /* <SvgIcon
        type={IconNames.SlidersH}
        width={20}
        height={20}
        color={colors.inputColor}
        style={screenStyles.rightIcon}
      /> */
}

{
  /* Trigger search action when the user presses the button */
}
{
  /* <TouchableOpacity onPress={handleSearch}>
        <SvgIcon
          type={IconNames.SlidersH}
          width={20}
          height={20}
          color={colors.inputColor}
          style={screenStyles.rightIcon}
        />
      </TouchableOpacity> */
}
