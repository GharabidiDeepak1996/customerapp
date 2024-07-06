import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import BaseView from '../BaseView';
import { Text } from 'react-native-elements';
import { Styles } from './Style';
import Globals from '../../utils/Globals';
import { useTheme } from '@react-navigation/native';
import AppConfig from '../../../branding/App_config';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import IconNames from '../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import AppInput from '../../components/Application/AppInput/View';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import AppButton from '../../components/Application/AppButton/View';
import Routes from '../../navigation/Routes';
import { useFocusEffect } from '@react-navigation/native';
import { PaymentService } from '../../apis/services/Payment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const assets = AppConfig.assets.default;

export const TopupWallet = props => {
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);

  const screenStyles = Styles(scheme, colors);
  const { t, i18n } = useTranslation();
  const [topUpInputAmt, setTopUpInputAmt] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isAmtError, setIsAmtError] = useState(false);
  const [amtErrorText, setErrorText] = useState("")
  const [balance, setBalance] = useState(0);
  const CustomerMinWallterAmount = useSelector(state => state.dashboard.CustomerMinWallterAmount);

  let inputRef = useRef();

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
        console.log('bannnkkkkkkkresponse', response?.data?.payload);
        setBalance(response?.data?.payload);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={'Top up Wallet'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            {/* <View style={screenStyles.balanceContainer}>
              <View style={screenStyles.balanceViewUpper}>
                <Text style={screenStyles.yourBalanceLabel}>
                  Your Wallet Balance
                </Text>
              </View>
              <View style={screenStyles.balanceViewDown}>
                <Text style={screenStyles.balanceAmtStyle}>Rp. 68,920</Text>
              </View>
            </View> */}

            <View
              style={{
                backgroundColor: 'white',
                marginVertical: 10,
                borderColor: '#d4d4d4',
                borderWidth: 1,
                padding: 10,
                borderRadius: 4,
              }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={screenStyles.walletLabel}>Wallet Balance</Text>
                  <Text style={screenStyles.balanceAmtStyle}>Rp. {balance}</Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={[screenStyles.AddMoneyLabel, { marginTop: 10 }]}>
                Add Amount
              </Text>
              <View
              >
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.MoneyBillWave}

                  keyboardType={'number-pad'}
                  leftIconContainerStyle={{ paddingRight: 10, marginLeft: 0 }}
                  placeholder={t(`Minimum Rp. ${CustomerMinWallterAmount}`)}
                  value={topUpInputAmt}
                  onChangeText={amt => {
                    if (String(amt).match(/[\s,.-]/g, '')) {
                    } else {
                      setTopUpInputAmt(amt);
                      setIsAmtError(false);

                    }
                  }}
                  labell={'Amount'}
                />



                <Text style={{ fontSize: 11, fontStyle: 'italic' }}>
                  Admin fee will be auto included.
                </Text>

                {isAmtError && (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    {amtErrorText}
                  </Text>
                )}
                <AppButton
                  title={'Continue'}
                  loader={isLoading}
                  buttonStyle={{
                    marginTop: 15,
                    backgroundColor: colors.activeColor,
                    borderRadius: 6,
                  }}
                  onPress={() => {
                    try {
                      if (topUpInputAmt !== '') {
                        if (Number(topUpInputAmt) >= CustomerMinWallterAmount) {
                          props.navigation.navigate(
                            Routes.SELECT_BANK_FOR_WALLET_TOPUP,
                            { amt: Number(topUpInputAmt) },
                          );
                        } else {
                          setErrorText(`Minimum amount of Rp. ${CustomerMinWallterAmount} is required.`)
                          setIsAmtError(true)
                        }
                      } else {
                        setErrorText("Please enter amount")
                        setIsAmtError(true)
                      }
                      // if (
                      //   topUpInputAmt !== '' &&
                      //   Number(topUpInputAmt) >= 10000
                      // ) {
                      //   setIsAmtError(false);
                      //   props.navigation.navigate(
                      //     Routes.SELECT_BANK_FOR_WALLET_TOPUP,
                      //     { amt: Number(topUpInputAmt) },
                      //   );
                      // } else {
                      //  // setIsAmtError(true);
                      // }

                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};
