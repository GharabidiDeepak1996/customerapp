import React, { useEffect, useState } from 'react';
import {
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import { Divider, Text } from 'react-native-elements';

import BaseView from '../BaseView';
import { Styles } from './Styles';
import AppButton from '../../components/Application/AppButton/View';
import Routes from '../../navigation/Routes';
import { StackActions, useTheme } from '@react-navigation/native';
import Config from '../../../branding/carter/configuration/Config';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import { useFocusEffect } from '@react-navigation/native';
import { AuthService, TrackService } from '../../apis/services';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/FormatNumberWithCommas';

export const TrackOrder = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = Styles(scheme, colors);
  const [data, setData] = useState([]);
  const notificationSlice = useSelector(state => state.notification.notificationMessage);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Your code to re-render or fetch data goes here

  //     getTrackOrder();
  //   }, [notificationSlice]),
  // );

  useEffect(() => {
    console.log('Screen is focused');
    getTrackOrder();
  }, [notificationSlice])
  console.log("jjksl", notificationSlice)

  const getTrackOrder = async () => {
    console.log("props.route.params.routeData==>", props.route.params.routeData)
    try {
      let response = await TrackService.getTrackOrders(
        props.route.params.categoryTypeId, props.route.params.body
      );
      if (!response?.data?.isSuccess) {
        ToastAndroid.show(
          response?.data.message || 'An error occurred during get Track Order.',
          ToastAndroid.LONG,
        );
        return;
      } else {
        console.log('data--====>', response.data.payload);
        setData(response.data.payload);
      }
    } catch (error) {
      // Cast 'error' to 'any' to handle the TypeScript error
      console.log('Error in get Track Order:', error);
      ToastAndroid.show(
        'An error occurred while get Track Order: ' + error.message,
        ToastAndroid.LONG,
      );
    }
  };

  const renderOrderHeader = item => {
    return (
      <View style={[screenStyles.headerContainer, {


      }]}>
        <View style={screenStyles.headerLeftIconContainer}>
          <SvgIcon
            type={IconNames.Box}
            width={20}
            height={20}
            color={colors.activeColor}
          />
        </View>

        <View>
          {/* [{"customerStatus": "Processing", "distance": 0, "itemQty": 1,
                 "orderDate": "01/03/2024 16:01:27", "orderStatus": "Confirmed",
                  "orderStatusId": 2, "packaging": null, "totalAmount": 0}] */}
          <Text
            style={
              screenStyles.headerTitleText
            }>{`Order # ${item?.orderNo}`}</Text>
          <Text
            style={
              screenStyles.subtitleText
            }>{`Placed on `}<Text style={[screenStyles.subtitleValueText]}>{item.orderDate}</Text></Text>

          <View style={screenStyles.itemsHorizontalContainer}>
            <Text style={screenStyles.subtitleText}>{'Items: '}</Text>
            <Text style={[screenStyles.subtitleValueText]}>{item.itemQty}</Text>
            <Text style={screenStyles.subtitleText}>{'Total: '}</Text>
            <Text
              style={
                screenStyles.subtitleValueText
              }>{`Rp. ${formatNumberWithCommas(item.totalAmount)}`}</Text>
          </View>
        </View>
      </View >
    );
  };



  const renderOrderContent = (item, detailItem) => {
    return (
      <View style={[screenStyles.contentContainer,]}>
        <View style={screenStyles.orderStatusItemContainer}>
          <View style={screenStyles.orderStatusLeftContainer}>
            <View
              style={[
                screenStyles.orderStatusLeftIconContainer,
                { backgroundColor: colors.tertiaryBackground },
              ]}>
              <SvgIcon
                type={IconNames.BoxOpen}
                width={20}
                height={20}
                color={
                  colors.activeColor
                  // data[0]?.orderStatus == 'Confirmed'
                  //   ? colors.activeColor
                  //   : colors.switchBorder
                }
              />
            </View>

            <Divider
              style={[
                screenStyles.orderStatusLine,
                {
                  backgroundColor: colors.activeColor
                  // data[0]?.orderStatus == 'Confirmed'
                  //   ? colors.activeColor
                  //   : colors.switchBorder,
                },
              ]}
            />
          </View>
          <View style={screenStyles.orderTitleContainer}>
            <Text style={screenStyles.orderStatusTitle}>{'Orders Placed'}</Text>
            <Text style={screenStyles.orderStatusSubtitle}>
              {data[0]?.orderDate}
            </Text>

            <View style={screenStyles.centerSeparatorLine} />
          </View>
        </View>



        <View style={screenStyles.orderStatusItemContainer}>
          <View style={screenStyles.orderStatusLeftContainer}>
            <View
              style={[
                screenStyles.orderStatusLeftIconContainer,
                item[3]?.datetime !== null ? { backgroundColor: colors.tertiaryBackground } : { backgroundColor: colors.inputSecondaryBackground },
                //{ backgroundColor: colors.tertiaryBackground },
              ]}>
              <SvgIcon
                type={IconNames.MapMarkedAlt}
                width={20}
                height={20}
                color={
                  item[3]?.datetime !== null    //"orderStatusId": 4,'Shipped'
                    ? colors.activeColor
                    : colors.switchBorder
                }
              />
            </View>

            <Divider
              style={[
                screenStyles.orderStatusLine,
                {
                  backgroundColor:
                    item[3]?.datetime !== null
                      ? colors.activeColor
                      : colors.switchBorder,
                },
              ]}
            />
          </View>
          <View style={screenStyles.orderTitleContainer}>
            <Text style={item[3]?.datetime !== null ? screenStyles.orderStatusTitle : screenStyles.orderStatusTitle1}>{'Order Packed'}</Text>
            <Text style={screenStyles.orderStatusSubtitle}>
              {item[3]?.datetime !== null ? item[3]?.datetime : 'Pending'}
            </Text>

            <View style={screenStyles.centerSeparatorLine} />
          </View>
        </View>

        <View style={screenStyles.orderStatusItemContainer}>
          <View style={screenStyles.orderStatusLeftContainer}>
            <View
              style={[
                screenStyles.orderStatusLeftIconContainer,
                item[4]?.datetime !== null ? { backgroundColor: colors.tertiaryBackground } : { backgroundColor: colors.inputSecondaryBackground },

              ]}>
              <SvgIcon
                type={IconNames.ShippingFast}   //"orderStatusId": 5,'Out of delivery'
                width={20}
                height={20}
                color={
                  item[4]?.datetime !== null
                    ? colors.activeColor
                    : colors.switchBorder
                }
              />
            </View>
            <Divider
              style={[
                screenStyles.orderStatusLine,
                {
                  //backgroundColor: colors.borderColorLight 
                  backgroundColor: item[4]?.datetime !== null
                    ? colors.activeColor
                    : colors.switchBorder,
                },
              ]}
            />
          </View>
          <View style={screenStyles.orderTitleContainer}>
            {/* <Text style={screenStyles.orderStatusTitle}>
              {'Out of Delivery'}
            </Text> */}
            <Text style={item[4]?.datetime !== null ? screenStyles.orderStatusTitle : screenStyles.orderStatusTitle1}> {'Out of Delivery'}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={screenStyles.orderStatusSubtitle}>{item[4]?.datetime !== null ? item[4]?.datetime : 'Pending'}</Text>

              {item[4]?.datetime !== null && <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.MAP_TRACK_ORDERS, {
                    categoryTypeId: 1,
                    body: [`${detailItem?.orderNo}`],
                  });
                }}>
                {item[5]?.datetime == null && <Text>Track order</Text>}
              </TouchableOpacity>}
            </View>
            <View style={screenStyles.centerSeparatorLine} />
          </View>
        </View>

        <View style={screenStyles.orderStatusItemContainer}>
          <View style={screenStyles.orderStatusLeftContainer}>
            <View
              style={[
                screenStyles.orderStatusLeftIconContainer,
                item[5]?.datetime !== null ? { backgroundColor: colors.tertiaryBackground } : { backgroundColor: colors.inputSecondaryBackground },
              ]}>
              <SvgIcon                                           //"orderStatusId": 5,'Delivered'
                type={IconNames.Dolly}
                width={20}
                height={20}
                color={
                  item[5]?.datetime !== null
                    ? colors.activeColor
                    : colors.switchBorder
                }
              />
            </View>
          </View>
          <View style={screenStyles.orderTitleContainer}>
            {/* <Text style={screenStyles.orderStatusTitle}>
              {'Order Delivered'}
            </Text> */}
            <Text style={item[5]?.datetime !== null ? screenStyles.orderStatusTitle : screenStyles.orderStatusTitle1}>{'Order Delivered'}</Text>

            <Text style={screenStyles.orderStatusSubtitle}>{item[5]?.datetime !== null ? item[5]?.datetime : 'Pending'}</Text>
          </View>
        </View>
      </View>
    );
  };


  return (
    <BaseView
      navigation={props.navigation}
      title={'Track Order'}
      headerWithBack={true}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>

            <View style={screenStyles.upperContainer}>
              {data?.map(item => {
                return renderOrderHeader(item);

              })}
              {data?.map(item => {
                return renderOrderContent(item.orderStatusDetails, item)

              })
              }

            </View>

            <View style={screenStyles.bottomContainer}>

              <AppButton
                title={'Go Back'}
                onPress={() => {
                  props.navigation.dispatch(
                    StackActions.replace(Config.SELECTED_VARIANT === Routes.INTRO_SCREEN1 ?
                      Routes.HOME_VARIANT1 : Config.SELECTED_VARIANT === Routes.INTRO_SCREEN2 ?
                        Routes.HOME_VARIANT2 :
                        Routes.HOME_VARIANT3)
                  );
                }}
              />

            </View>
          </View>
        );
      }}
    />
  );
};
