import React, { useEffect } from 'react';
import { Alert, View, BackHandler } from 'react-native';

import BaseView from '../BaseView';
import { Text } from 'react-native-elements';
import Routes from '../../navigation/Routes';
import AppButton from '../../components/Application/AppButton/View';
import { useTheme } from '@react-navigation/native';
import { Styles } from './Styles';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import { useTranslation } from 'react-i18next';

export const OrderSuccess = props => {
  const { t, i18n } = useTranslation();

  const { colors } = useTheme();
  const screenStyles = Styles(colors);

  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
      // Alert.alert('Go to home', 'Are you sure you want to go home?', [
      //   {
      //     text: 'Cancel',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   {
      //     text: 'YES',
      //     onPress: () => {
      //       props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
      //       //BackHandler.exitApp()
      //     },
      //   },
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <BaseView
      navigation={props.navigation}
      title={t('Order Success')}
      headerWithBack={false}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            <View style={screenStyles.mainContainer}>
              <SvgIcon
                type={IconNames.BagShopping}
                width={70}
                height={70}
                color={colors.activeColor}
              />

              <Text style={screenStyles.titleText}>
                {/* {t('Your order was successful!')} */}
                Your order has been successfully placed.
              </Text>

              {/* <Text style={screenStyles.subtitleText}>You'll get a response within a few minutes</Text> */}
            </View>

            <View style={screenStyles.bottomContainer}>
              <AppButton
                title={t('Track Your Order')}
                onPress={() => {
                  console.log('r98988687=========', props.route.params);
                  if (props.route.params.routeData.categoryTypeId == 1 || props.route.params.routeData.categoryTypeId == 3 || props.route.params.routeData.categoryTypeId == 2) {
                    props.navigation.navigate(Routes.SINGLE_MAP_TRACK_ORDERS, {
                      categoryTypeId: props.route.params.routeData.categoryTypeId,
                      orderId: [`${props.route.params.routeData?.payload[0]}`],
                      product: props.route.params.routeData.product,
                      totalRp: props.route.params.routeData.totalRp,
                    });
                  } else if (props.route.params.routeData.categoryTypeId == 4) {

                    if (props.route.params.routeData.deliveryOptionId == 1) {
                      props.navigation.navigate(Routes.SINGLE_MAP_TRACK_ORDERS, {
                        categoryTypeId: props.route.params.routeData.categoryTypeId,
                        orderId: [`${props.route.params.routeData?.payload[0]}`],
                        product: props.route.params.routeData.product,
                        totalRp: props.route.params.routeData.totalRp,
                      });
                    } else if (props.route.params.routeData.deliveryOptionId == 2) {
                      props.navigation.navigate(Routes.MAP_TRACK_ORDERS, {
                        categoryTypeId: props.route.params.routeData.categoryTypeId,
                        orderId: [`${props.route.params.routeData?.payload[0]}`],
                        product: props.route.params.routeData.product,
                        totalRp: props.route.params.routeData.totalRp,
                      });
                    }

                  }

                  // props.navigation.navigate(Routes.MY_ORDERS, {
                  //   routeData: props.route.params.routeData,
                  //   hideBack: true,
                  // });
                  // props.navigation.navigate(Routes.MY_ORDERS);
                }}
              />
            </View>
          </View>
        );
      }}
    />
  );
};
