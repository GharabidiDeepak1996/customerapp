import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import BaseView from '../BaseView';
import { Text } from 'react-native-elements';
import { Styles } from './Styles';
import Globals from '../../utils/Globals';
import { useTheme } from '@react-navigation/native';
import AppConfig from '../../../branding/App_config';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import IconNames from '../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import { CommomService, PaymentService } from '../../apis/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Routes from '../../navigation/Routes';

const assets = AppConfig.assets.default;

export const WalletTransactions = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = Styles(scheme, colors);
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const [balance, setBalance] = useState(0);

  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    getAllTransactions();
    checkWalletBal();
  }, []);

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
  const getAllTransactions = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const response = await CommomService.getWalletHistory(getUserId);

      if (response?.data?.isSuccess) {
        console.log('getWalletHistory-----response', response?.data);

        if (response?.data?.payload.length === 0) {
          ToastAndroid.show('No transaction found..', ToastAndroid.SHORT);
          setTransactionData(null);
        } else {
          const getAllTransactionsWithId = response?.data?.payload?.map(
            (item, index) => {
              return {
                ...item,
                id: index + 1,
              };
            },
          );

          console.log('==================', getAllTransactionsWithId);
          setTransactionData(getAllTransactionsWithId);
        }
      } else {
        ToastAndroid.show(
          'Something went worng..' + data?.data?.message,
          ToastAndroid.SHORT,
        );
        //setBankData(null);
        setTransactionData(null);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const [routes] = React.useState([
    { key: 'first', title: t('All') },
    { key: 'second', title: t('Credit') },
    { key: 'third', title: t('Debit') },
  ]);

  const renderTransactionItem = (item, index) => {
    let icon = IconNames.Box;

    if (item.paymentTypeName === 'Wallet TopUp') {
      icon = IconNames.Wallet;
    } else if (item.paymentTypeName === 'Order Payment') {
      icon = IconNames.BagShopping;
    }

    return (
      <View style={[screenStyles.itemContainer, { marginVertical: 10 }]}>
        <View
          style={{
            padding: 10,
            backgroundColor: colors.bannerBlueSecondary,
            marginHorizontal: 0,
            marginRight: 0,

            borderRadius: 999,
          }}>
          <SvgIcon
            type={icon}
            width={20}
            height={20}
            color={colors.primaryGreenColor}
          />
        </View>

        <View
          style={[
            screenStyles.textContainer,
            { justifyContent: 'space-between' },
          ]}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={screenStyles.paymentTypeName}>
                {item.paymentTypeName}
              </Text>
            </View>

            {/* <View>
              <Text style={screenStyles.titleText}>
                Transaction# {item.referenceNo}
              </Text>
            </View> */}

            <View style={{ width: '70%' }}>
              <Text style={[screenStyles.titleText, { fontSize: 14 }]}>
                Transaction #
              </Text>
              <Text style={screenStyles.titleText}>
                {item.paymentTypeName == 'Order Payment'
                  ? item.orderNo
                  : item.referenceNo}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={screenStyles.PaymentText}>
                {item.paymentMethodName}
              </Text>
              <Text style={screenStyles.PaymentText}> • </Text>
              <Text style={screenStyles.PaymentText}>{item.paymentDate}</Text>
            </View>

            {/* <Text style={screenStyles.titleText}> </Text>
            <Text style={screenStyles.orderTextStyle}>{item.orederNo}</Text> */}
          </View>

          <View style={{ marginTop: 5 }}>
            {item.transactionTypeName === 'Debit' ? (
              <Text style={screenStyles.debitPriceText}>
                - Rp. {item.totalAmount}
              </Text>
            ) : (
              <Text style={screenStyles.creditPriceText}>
                + Rp. {item.totalAmount}
              </Text>
            )}

            {item.paymentStatusName === 'Success' ? (
              <Text style={screenStyles.paymentStatusSuccess}>
                {item.paymentStatusName}
              </Text>
            ) : (
              <Text style={screenStyles.paymentStatusFailed}>
                {item.paymentStatusName}
              </Text>
            )}

            <View
              style={{
                alignSelf: 'flex-end',
              }}>
              <Image
                source={{
                  uri: `${Globals.imgBaseURL}${item.bankImageUrl}`,
                }}
                style={{ width: 70, height: 30 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const FirstRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={transactionData}
      ItemSeparatorComponent={() => (
        <View style={{ backgroundColor: '#d3d3d3', height: 1 }} />
      )}
      renderItem={({ item, index }) => {
        return renderTransactionItem(item, index);
      }}
    />
  );

  const SecondRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View style={{ backgroundColor: '#d3d3d3', height: 1 }} />
      )}
      data={transactionData}
      renderItem={({ item, index }) => {
        return (
          <View>
            {item.transactionTypeName === 'Credit' && (
              <View style={[screenStyles.itemContainer, { marginVertical: 10 }]}>
                <View
                  style={{
                    padding: 10,
                    backgroundColor: colors.bannerBlueSecondary,
                    marginHorizontal: 0,
                    marginRight: 0,
                    borderRadius: 999,
                  }}>
                  <SvgIcon
                    type={
                      item.paymentTypeName === 'Wallet TopUp'
                        ? IconNames.Wallet
                        : IconNames.BagShopping
                    }
                    width={20}
                    height={20}
                    color={colors.primaryGreenColor}
                  />
                </View>

                <View
                  style={[
                    screenStyles.textContainer,
                    { justifyContent: 'space-between' },
                  ]}>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={screenStyles.paymentTypeName}>
                        {item.paymentTypeName}
                      </Text>
                    </View>

                    <View style={{ width: '70%' }}>
                      <Text style={[screenStyles.titleText, { fontSize: 14 }]}>
                        Transaction #
                      </Text>
                      <Text style={[screenStyles.titleText]}>
                        {item.paymentTypeName == 'Order Payment'
                          ? item.orderNo
                          : item.referenceNo}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={screenStyles.PaymentText}>
                        {item.paymentMethodName}
                      </Text>
                      <Text style={screenStyles.PaymentText}> • </Text>
                      <Text style={screenStyles.PaymentText}>
                        {item.paymentDate}
                      </Text>
                    </View>

                    {/* <Text style={screenStyles.titleText}> </Text>
            <Text style={screenStyles.orderTextStyle}>{item.orederNo}</Text> */}
                  </View>

                  <View>
                    {item.transactionTypeName === 'Debit' ? (
                      <Text
                        style={[
                          screenStyles.debitPriceText,
                          { paddingRight: 3, marginTop: 5 },
                        ]}>
                        - Rp. {item.totalAmount}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          screenStyles.creditPriceText,
                          { paddingRight: 3, marginTop: 5 },
                        ]}>
                        + Rp. {item.totalAmount}
                      </Text>
                    )}

                    {item.paymentStatusName === 'Success' ? (
                      <Text
                        style={[
                          screenStyles.paymentStatusSuccess,
                          { paddingRight: 3 },
                        ]}>
                        {item.paymentStatusName}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          screenStyles.paymentStatusFailed,
                          { paddingRight: 3 },
                        ]}>
                        {item.paymentStatusName}
                      </Text>
                    )}

                    <View
                      style={{
                        alignSelf: 'flex-end',
                      }}>
                      <Image
                        source={{
                          uri: `${Globals.imgBaseURL}${item.bankImageUrl}`,
                        }}
                        style={{ width: 70, height: 30 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      }}
    />
  );
  const ThirdRoute = () => (
    <FlatList
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View style={{ backgroundColor: '#d3d3d3', height: 1 }} />
      )}
      data={transactionData}
      renderItem={({ item, index }) => {
        return (
          <View>
            {item.transactionTypeName === 'Debit' && (
              <View style={[screenStyles.itemContainer, { marginVertical: 10 }]}>
                <View
                  style={{
                    padding: 10,
                    backgroundColor: colors.bannerBlueSecondary,
                    marginHorizontal: 0,
                    marginRight: 0,
                    borderRadius: 999,
                  }}>
                  <SvgIcon
                    type={
                      item.paymentTypeName === 'Wallet TopUp'
                        ? IconNames.Wallet
                        : IconNames.BagShopping
                    }
                    width={20}
                    height={20}
                    color={colors.primaryGreenColor}
                  />
                </View>

                <View
                  style={[
                    screenStyles.textContainer,
                    { justifyContent: 'space-between' },
                  ]}>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={screenStyles.paymentTypeName}>
                        {item.paymentTypeName}
                      </Text>
                    </View>

                    <View>
                      <Text style={[screenStyles.titleText, { fontSize: 14 }]}>
                        Transaction #
                      </Text>
                      <Text style={screenStyles.titleText}>
                        {item.paymentTypeName == 'Order Payment'
                          ? item.orderNo
                          : item.referenceNo}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={screenStyles.PaymentText}>
                        {item.paymentMethodName}
                      </Text>
                      <Text style={screenStyles.PaymentText}> • </Text>
                      <Text style={screenStyles.PaymentText}>
                        {item.paymentDate}
                      </Text>
                    </View>

                    {/* <Text style={screenStyles.titleText}> </Text>
            <Text style={screenStyles.orderTextStyle}>{item.orederNo}</Text> */}
                  </View>

                  <View>
                    {item.transactionTypeName === 'Debit' ? (
                      <Text style={screenStyles.debitPriceText}>
                        - Rp. {item.totalAmount}
                      </Text>
                    ) : (
                      <Text style={screenStyles.creditPriceText}>
                        + Rp. {item.totalAmount}
                      </Text>
                    )}

                    {item.paymentStatusName === 'Success' ? (
                      <Text style={screenStyles.paymentStatusSuccess}>
                        {item.paymentStatusName}
                      </Text>
                    ) : (
                      <Text style={screenStyles.paymentStatusFailed}>
                        {item.paymentStatusName}
                      </Text>
                    )}

                    <View
                      style={{
                        alignSelf: 'flex-end',
                      }}>
                      <Image
                        source={{
                          uri: `${Globals.imgBaseURL}${item.bankImageUrl}`,
                        }}
                        style={{ width: 70, height: 30 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      }}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    <BaseView
      navigation={props.navigation}
      title={'Wallet Transactions'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            {transactionData.length == 0 && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  source={assets.no_wallet_transaction}
                  style={screenStyles.headerImage}
                />

                <Text style={screenStyles.title}>No Transaction</Text>
                <Text style={screenStyles.subTitle}>
                  Your transaction list is currently empty. Top up amount and
                  make your first transaction today!
                </Text>
              </View>
            )}
            {transactionData.length !== 0 && (
              <View
                style={{
                  backgroundColor: 'white',
                  marginVertical: 10,
                  borderColor: '#d4d4d4',
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 6,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={screenStyles.walletLabel}>Wallet Balance</Text>
                    <Text style={screenStyles.balanceAmtStyle}>
                      Rp. {balance}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate(Routes.TOPUP_WALLET);
                      }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={[
                            screenStyles.walletLabel,
                            { marginRight: 5, color: colors.primaryGreenColor },
                          ]}>
                          Topup
                        </Text>

                        <SvgIcon
                          type={IconNames.PlusCircle}
                          width={20}
                          height={20}
                          color={colors.primaryGreenColor}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {transactionData.length !== 0 && (
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                  <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    labelStyle={{ fontSize: 11 }}
                    style={{
                      backgroundColor: colors.activeColor,
                      marginVertical: 16,
                      width: '100%',
                      borderRadius: 6,
                    }}
                  />
                )}
              />
            )}
          </View>
        );
      }}
    />
  );
};
