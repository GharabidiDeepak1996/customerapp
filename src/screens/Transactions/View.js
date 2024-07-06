import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ToastAndroid,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { CommomService } from '../../apis/services';
import Routes from '../../navigation/Routes';

const assets = AppConfig.assets.default;

export const Transactions = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = Styles(scheme, colors);
  const { t, i18n } = useTranslation();
  const [index, setIndex] = React.useState(0);
  const [transactionData, setTransactionData] = useState([]);
  const layout = useWindowDimensions();

  useEffect(() => {
    getAllTransactions();
  }, []);

  const getAllTransactions = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const response = await CommomService.getAllTransactions(getUserId);

      if (response?.data?.isSuccess) {
        if (response?.data?.payload.length === 0) {
          setTransactionData([]);
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

  const renderTransactionItem = (item, index) => {
    let icon = IconNames.Box;

    if (item.paymentTypeName === 'Wallet TopUp') {
      icon = IconNames.Wallet;
    } else if (item.paymentTypeName === 'Order Payment') {
      icon = IconNames.BagShopping;
    }

    return (
      <View style={[screenStyles.itemContainer]}>
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
            {
              justifyContent: 'space-between',
            },
          ]}>
          <View style={{ width: '70%' }}>
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
              <Text style={screenStyles.PaymentText}>{item.paymentDate}</Text>
            </View>

            {/* <Text style={screenStyles.titleText}> </Text>
            <Text style={screenStyles.orderTextStyle}>{item.orederNo}</Text> */}
          </View>

          <View>
            <Text style={screenStyles.priceText}>Rp. {item.totalAmount}</Text>

            {item.paymentStatusName === 'Success' ? (
              <Text style={screenStyles.paymentStatusSuccess}>
                {item.paymentStatusName}
              </Text>
            ) : (
              <Text style={screenStyles.paymentStatusFailed}>
                {item.paymentStatusName}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={'Transactions'}
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            {transactionData?.length == 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  source={assets.no_transaction}
                  style={screenStyles.headerImage}
                />

                <Text style={screenStyles.title}>No Transaction</Text>
                <Text style={screenStyles.subTitle}>
                  We couldn't find any payment transactions for your account at
                  this time.
                </Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{ backgroundColor: '#d3d3d3', height: 1 }} />
                )}
                data={transactionData}
                renderItem={({ item, index }) => {
                  return renderTransactionItem(item, index);
                }}
              />
            )}
          </View>
        );
      }}
    />
  );
};
