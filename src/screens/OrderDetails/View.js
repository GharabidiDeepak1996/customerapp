import React, { useState, useEffect } from 'react';
import {
  Animated,
  ScrollView,
  useColorScheme,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Accordion from 'react-native-collapsible/Accordion';
import BaseView from '../BaseView';
import { Divider, Text } from 'react-native-elements';
import { Styles } from './Styles';
import Easing from 'react-native/Libraries/Animated/Easing';
import Globals from '../../utils/Globals';
import { useTheme } from '@react-navigation/native';
import AppConfig from '../../../branding/App_config';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import moment from 'moment';
import Routes from '../../navigation/Routes';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas } from '../../utils/FormatNumberWithCommas';

export const OrderDetails = props => {
  const { t, i18n } = useTranslation();

  const { text, newtext } = props.route.params;
  const scheme = useColorScheme();
  const { colors } = useTheme();

  const [data, setData] = useState(text);
  console.log('DDDDAAAATTTTTTAAAAAA---------------', data);
  const [orderDetails, setOrderDetails] = useState(newtext);

  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const timeFormate = () => {
    try {
      // Assuming you have the date and time as a string
      const dateTimeString = data?.orderDate;

      // Create a JavaScript Date object from the string
      const dateTime = new Date(dateTimeString);

      //var currentDate = moment(new Date()).format('hh:mm A');
      return moment(dateTime, 'hh:mm A').format('hh:mm A');
    } catch (err) {
      console.log('error order details', err);
    }
  };
  console.log('orderDetails====>', orderDetails);
  console.log('data====>', data);

  let finalTotal = 0;
  return (
    <BaseView
      title={'Order# ' + data?.orderNo}
      subTitle={'OrderDetails'}
      navigation={props.navigation}
      onBackPress={() => {
        props.navigation.navigate(Routes.LOGIN_FORM_SCREEN1)
      }}

      showAppHeader={true}
      headerWithBack={!props.hideBack}
      applyBottomSafeArea
      childView={() => {
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View>
              {/* Delivery on */}
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  marginTop: 16,
                  borderWidth: 1,
                  borderColor: '#d4d4d4',
                  borderRadius: 6,
                }}>
                <Text style={screenStyles.headerSubtitleText}>
                  {data?.orderTypeId === 1 &&
                    (data?.orderStatusId !== 5 || data?.orderStatusId !== 6
                      ? data?.orderStatusId == 7
                        ? 'Rejected on '
                        : 'Placed on '
                      : 'Delivered on ') +
                    timeFormate() +
                    ' • ' +
                    data?.totalQty +
                    ' Products. Rp. ' +
                    formatNumberWithCommas(data?.totalAmount)}

                  {data?.orderTypeId === 2 &&
                    (data?.orderStatusId !== 5 || data?.orderStatusId !== 6
                      ? data?.orderStatusId == 7
                        ? 'Rejected on '
                        : 'Placed on '
                      : 'Delivered on ') +
                    timeFormate() +
                    ' • ' +
                    data?.totalQty +
                    ' Items. Rp. ' +
                    formatNumberWithCommas(data?.totalAmount)}

                  {data?.orderTypeId === 3 &&
                    (data?.orderStatusId !== 5 || data?.orderStatusId !== 6
                      ? data?.orderStatusId == 7
                        ? 'Rejected on '
                        : 'Booked on '
                      : 'Delivered on ') +
                    timeFormate() +
                    ' • ' +
                    data?.totalDistance +
                    ' Km' +
                    ' . ' +
                    'Rp. ' +
                    formatNumberWithCommas(data?.totalAmount)}

                  {data?.orderTypeId === 4 &&
                    (data?.orderStatusId !== 5 || data?.orderStatusId !== 6
                      ? data?.orderStatusId == 7
                        ? 'Rejected on '
                        : 'Ordered on '
                      : 'Delivered on ') +
                    timeFormate() +
                    ' • ' +
                    data?.packageName +
                    ' Rp. ' +
                    formatNumberWithCommas(data?.totalAmount)}
                </Text>
              </View>

              <View style={{ marginTop: 10, marginBottom: 3 }}>
                <Text
                  style={{
                    fontFamily: Fonts.RUBIK_MEDIUM,
                    fontSize: Typography.P2,
                    color: 'black',
                  }}>
                  {(data?.orderTypeId === 1 ||
                    data?.orderTypeId === 2 ||
                    data?.orderTypeId === 4) &&
                    t('Delivery Details')}
                  {data?.orderTypeId === 3 && t('Location Details')}
                </Text>
              </View>
              {/*-------------------------------Name and Address Start------------------------------------ */}
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: '#d4d4d4',
                  borderRadius: 6,
                }}>
                <View style={{ flex: 1 }}>
                  {/* Second Row */}
                  <View>
                    {/* <View
                      style={{
                        flex: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          padding: 15,
                          backgroundColor: '#f1fce6',
                          marginHorizontal: 10,
                          marginVertical: 10,
                          borderRadius: 999,
                        }}>
                        {(data?.orderTypeId === 2 ||
                          data?.orderTypeId === 1) && (
                            <SvgIcon
                              type={IconNames.Grocery}
                              width={25}
                              height={25}
                              color={colors.primaryGreenColor}
                            />
                          )}
                        {(data?.orderTypeId === 3 ||
                          data?.orderTypeId === 4) && (
                            <SvgIcon
                              type={IconNames.Location}
                              width={25}
                              height={25}
                              color={colors.primaryGreenColor}
                            />
                          )}
                      </View>
                    </View> */}

                    <View
                      style={{
                        flex: 5,
                        justifyContent: 'center',
                      }}>
                      {(data?.orderTypeId === 3 || data?.orderTypeId === 4) && (
                        <Text
                          style={{
                            fontSize: Typography.P3,
                            fontFamily: Fonts.RUBIK_MEDIUM,
                            color: colors.primaryGreenColor,
                          }}>
                          Pick up from
                        </Text>
                      )}

                      <Text
                        style={{
                          fontSize: Typography.P3,
                          fontFamily: Fonts.RUBIK_MEDIUM,
                          color: 'black',
                        }}>
                        {data?.orderTypeId != 4 &&
                          data?.orderTypeId != 3 &&
                          orderDetails?.length > 0 &&
                          orderDetails[0]?.partnerName}

                        {data?.orderTypeId === 3 && (
                          <>
                            {data?.passengerName} {' • '}
                            {data?.passengerPhoneNo}
                          </>
                        )}
                        {data?.orderTypeId === 4 && (
                          <>
                            {data?.senderName}
                            {' • '}
                            {data?.senderPhoneNo}
                          </>
                        )}
                        {/* {(data?.orderTypeId === 3 || data?.orderTypeId === 4) &&
                          data?.senderName} */}
                      </Text>

                      <Text style={screenStyles.headerSubtitleText}>
                        {data?.orderTypeId != 4 &&
                          data?.orderTypeId != 3 &&
                          orderDetails?.length > 0 &&
                          orderDetails[0]?.address1 +
                          ' ' +
                          orderDetails[0]?.address2 +
                          ' ' +
                          orderDetails[0]?.mapAddress +
                          ' ' +
                          orderDetails[0]?.province +
                          ' ' +
                          orderDetails[0]?.postalCode +
                          ' ' +
                          orderDetails[0]?.landmark}

                        {/* {data?.orderTypeId === 4 && data?.senderPhoneNo + '\n'} */}
                        {(data?.orderTypeId === 3 || data?.orderTypeId === 4) &&
                          data?.pickUpAddress?.address1 +
                          ' ' +
                          data?.pickUpAddress?.address2 +
                          ' ' +
                          data?.pickUpAddress?.mapAddress +
                          '\n' +
                          data?.pickUpAddress?.province +
                          ' ' +
                          data?.pickUpAddress?.postalCode +
                          ' ' +
                          data?.pickUpAddress?.landmark}
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  {/* Third Row */}
                  <View>
                    {/* <View
                      style={{
                        flex: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          padding: 15,
                          backgroundColor: '#f1fce6',
                          marginHorizontal: 10,
                          marginVertical: 10,
                          borderRadius: 999,
                        }}>
                        {(data?.orderTypeId === 2 ||
                          data?.orderTypeId === 1) && (
                            <SvgIcon
                              type={IconNames.CircleUser}
                              width={25}
                              height={25}
                              color={colors.primaryGreenColor}
                            />
                          )}
                        {(data?.orderTypeId === 3 ||
                          data?.orderTypeId === 4) && (
                            <SvgIcon
                              type={IconNames.Location}
                              width={25}
                              height={25}
                              color={colors.primaryGreenColor}
                            />
                          )}
                      </View>
                    </View> */}
                    {/*========================================== DropoffAddress ===============================*/}
                    <View
                      style={{
                        flex: 5,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: Typography.P3,
                          fontFamily: Fonts.RUBIK_MEDIUM,
                          color: colors.primaryGreenColor,
                          marginTop: 12,
                        }}>
                        {data?.orderTypeId === 3
                          ? 'Drop off'
                          : data?.orderTypeId === 4
                            ? 'Deliver to'
                            : ''}
                      </Text>

                      <Text
                        style={{
                          fontSize: Typography.P3,
                          fontFamily: Fonts.RUBIK_MEDIUM,
                          color: 'black',
                        }}>
                        {(data?.orderTypeId === 1 || data?.orderTypeId === 2) &&
                          data?.customerName + ' • ' + data?.customerPhoneNo}
                        {data?.orderTypeId === 4 && (
                          <>
                            {data?.receipientName}
                            {' • '}
                            {data?.receipientPhoneNo}
                          </>
                        )}
                        {data?.orderTypeId === 3 &&
                          data?.passengerName + ' • ' + data?.passengerPhoneNo}
                      </Text>

                      <Text style={screenStyles.headerSubtitleText}>
                        {(data?.orderTypeId === 1 || data?.orderTypeId === 2) &&
                          data?.customerAddress?.mapAddress}
                        {/* {data?.orderTypeId === 4 && data?.receipientPhoneNo} */}
                        {(data?.orderTypeId === 3 || data?.orderTypeId === 4) &&
                          data?.dropOffAddress?.address1 +
                          ' ' +
                          data?.dropOffAddress?.address2 +
                          '' +
                          data?.dropOffAddress?.mapAddress +
                          '\n' +
                          data?.dropOffAddress?.province +
                          ' ' +
                          data?.dropOffAddress?.postalCode +
                          ' ' +
                          data?.dropOffAddress?.landmark}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Dashed Line */}
                {/* <View
                  style={{
                    borderColor: '#e8e8e8',
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    marginTop: 10,
                  }}
                />
                <View style={{ flex: 1 }}>
                 
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: 'row',
                      flex: 7,
                      backgroundColor: 'black',
                    }}>
                    <View
                      style={{
                        flex: 2,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          padding: 15,
                          backgroundColor: '#f1fce6',
                          marginHorizontal: 10,
                          marginVertical: 10,
                          borderRadius: 999,
                        }}>
                        <SvgIcon
                          type={IconNames.CircleUser}
                          width={25}
                          height={25}
                          color={colors.primaryGreenColor}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: 'white',
                        flex: 5,
                        justifyContent: 'center',
                      }}>
                      <Text style={screenStyles.headerSubtitleText}>
                        {' '}
                        Delivered on Oct 31, 2023 11:14 AM by
                      </Text>
                      <Text
                        style={{
                          fontSize: Typography.P3,
                          fontFamily: Fonts.RUBIK_MEDIUM,
                          color: 'black',
                        }}>
                        Artanto Mandala
                      </Text>
                    </View>
                  </View>
                </View> */}
              </View>
              {/*-------------------------------Name and Address End------------------------------------ */}
              {/* Product Details */}
              <View style={{ marginTop: 16, marginBottom: 3 }}>
                <Text
                  style={{
                    fontFamily: Fonts.RUBIK_MEDIUM,
                    fontSize: Typography.P2,
                    color: 'black',
                  }}>
                  {data?.orderTypeId === 1 && 'Product Details'}
                  {data?.orderTypeId === 2 && 'Item Details'}
                  {data?.orderTypeId === 4 && 'Package Details'}
                </Text>
              </View>

              {(data?.orderTypeId === 1 || data?.orderTypeId === 2) && (
                <View
                  style={{
                    padding: 16,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#d4d4d4',
                    borderRadius: 6,
                  }}>
                  <View style={{ flex: 1 }}>
                    {/* First Row */}
                    {data?.orderTypeId != 4 &&
                      data?.orderTypeId != 3 &&
                      orderDetails?.length > 0 &&
                      orderDetails?.map((item, key) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <View
                              style={{
                                flex: 5,
                              }}>
                              {/* <Text
                              style={{
                                fontSize: Typography.P3,
                                fontFamily: Fonts.RUBIK_MEDIUM,
                                color: colors.subHeadingSecondaryColor,
                              }}>
                              {item.partnerName}
                            </Text> */}
                              <Text
                                style={{
                                  fontSize: Typography.P3,
                                  fontFamily: Fonts.RUBIK_MEDIUM,
                                  color: 'black',
                                }}>
                                {item?.qty} × {item?.productName}
                              </Text>

                              <Text
                                style={[
                                  screenStyles.headerSubtitleText,
                                  { paddingBottom: 6 },
                                ]}>
                                Rp.
                                {formatNumberWithCommas(
                                  item?.sellingPrice == 0
                                    ? item?.regularPrice
                                    : item?.sellingPrice,
                                )}
                                /{item?.packagingName}
                              </Text>
                            </View>

                            <View
                              style={{
                                flex: 2,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                              }}>
                              <Text style={screenStyles.headerSubtitleText}>
                                Rp. {formatNumberWithCommas(item?.price)}
                              </Text>
                            </View>
                            {/* Dashed Line */}
                          </View>
                        );
                      })}
                  </View>

                  <View
                    style={{
                      borderColor: '#e8e8e8',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      marginBottom: 8,
                    }}
                  />
                  {/* Total */}
                  <View
                    style={{
                      flexDirection: 'row',

                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        fontSize: Typography.P3,
                        color: colors.headingColor,
                      }}>
                      {t('Total')}
                    </Text>

                    {data?.orderSellerDetails?.map(val => {
                      finalTotal += val.price;
                    })}

                    <Text
                      style={{
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        fontSize: Typography.P3,

                        textAlign: 'right',
                        color: colors.activeColor,
                      }}>
                      Rp.{formatNumberWithCommas(finalTotal)}
                    </Text>
                  </View>
                </View>
              )}

              {data?.orderTypeId === 4 && (
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingVertical: 8,
                    paddingHorizontal: 12,

                    borderWidth: 1,
                    borderColor: '#d4d4d4',
                    borderRadius: 6,
                  }}>
                  {/* <Text
                    style={{
                      fontSize: Typography.P3,
                      fontFamily: Fonts.RUBIK_MEDIUM,
                      color: 'black',
                    }}>
                    {data?.packageName}
                  </Text> */}
                  <Text style={screenStyles.headerSubtitleText}>
                    Package Name:{' '}
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>
                      {data?.packageName}
                    </Text>
                  </Text>

                  {data?.interIslandRateName != null && data?.interIslandRateName.length > 0 && (
                    <Text style={screenStyles.headerSubtitleText}>
                      Item Type:{' '}
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>
                        {data?.interIslandRateName}
                      </Text>
                    </Text>
                  )}

                  {data?.deliveryOptionId == 2 && (
                    <Text style={screenStyles.headerSubtitleText}>
                      Type of Goods:{' '}
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>
                        {data?.perishable ? "Wet" : "Dry"}
                      </Text>
                    </Text>
                  )}

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text style={screenStyles.headerSubtitleText}>
                      Weight:{' '}
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>
                        {data?.packageWeight} {'kg'}
                      </Text>
                    </Text>
                    <Text style={screenStyles.headerSubtitleText}>{' • '}</Text>
                    <Text style={screenStyles.headerSubtitleText}>
                      Quantity:{' '}
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>
                        {data?.packageQty}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}

              {/* Fare Details */}
              <View style={{ marginTop: 16, marginBottom: 6 }}>
                <Text
                  style={{
                    fontFamily: Fonts.RUBIK_MEDIUM,
                    fontSize: Typography.P2,
                    color: 'black',
                  }}>
                  Fare Details
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: 'white',
                  marginBottom: 18,
                  padding: 16,

                  borderWidth: 1,
                  borderColor: '#d4d4d4',
                  borderRadius: 6,
                }}>
                <View style={{ flex: 1 }}>
                  {/* Total Product */}
                  {data?.orderTypeId !== 3 && data?.orderTypeId !== 4 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 7,
                      }}>
                      <View
                        style={{
                          flex: 5,
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Total Products
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          {data?.orderTypeId != 4 &&
                            data?.orderTypeId != 3 &&
                            orderDetails?.length > 0 &&
                            orderDetails?.length}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Order Price */}
                  {data?.orderTypeId != 1 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Order Price
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            {/* Rp. {data?.totalAmount} */}
                            Rp. {formatNumberWithCommas(finalTotal)}
                          </Text>
                        </View>
                      </View>
                    )}

                  {/*Discount */}
                  {/* {data?.orderTypeId != 1 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Discount
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            - Rp. {data?.totalDiscount}
                          </Text>
                        </View>
                      </View>
                    )} */}

                  {/*Total Weight*/}
                  {data?.orderTypeId != 2 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Total Weight
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            {Math.round(
                              data?.orderSellerDetails?.reduce(
                                (totalWeight, item) =>
                                  totalWeight + item.weight,
                                0,
                              ),
                            ) + ' kg'}
                          </Text>
                        </View>
                      </View>
                    )}

                  {/*Total Dimension*/}
                  {data?.orderTypeId != 2 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Total Dimension
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            {data?.orderSellerDetails?.reduce(
                              (totalDimension, item) =>
                                totalDimension + parseFloat(item.dimension),
                              0,
                            ) + ' cm3'}
                          </Text>
                        </View>
                      </View>
                    )}

                  {/*Total Shopping*/}
                  {data?.orderTypeId != 2 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Total Shopping
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Rp. {formatNumberWithCommas(finalTotal)}
                          </Text>
                        </View>
                      </View>
                    )}

                  {/*Product Discount*/}
                  {/* {data?.orderTypeId != 2 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Product Discount
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Rp. {data?.totalDiscount}
                          </Text>
                        </View>
                      </View>
                    )} */}

                  {/*Wasli Delivery Fee*/}
                  {deliveryIn != 1 &&
                    data?.orderTypeId != 2 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Wasli Delivery Fee
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Rp. {formatNumberWithCommas(data?.wasliDeliveryFee)}
                          </Text>
                        </View>
                      </View>
                    )}

                  {/*Shipping Costs*/}
                  {data?.orderTypeId !== 3 && data?.orderTypeId !== 4 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 7,
                      }}>
                      <View
                        style={{
                          flex: 5,
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Shipping Costs
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Rp. {formatNumberWithCommas(data?.shippingFee)}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/*Service Fees*/}
                  {data?.orderTypeId !== 3 && data?.orderTypeId !== 4 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 7,
                      }}>
                      <View
                        style={{
                          flex: 5,
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Service Fees
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Rp. {formatNumberWithCommas(data?.serviceFee)}
                        </Text>
                      </View>
                    </View>
                  )}
                  {/*Application Fee*/}
                  {deliveryIn != 1 &&
                    data?.orderTypeId != 2 &&
                    data?.orderTypeId !== 3 &&
                    data?.orderTypeId !== 4 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 7,
                        }}>
                        <View
                          style={{
                            flex: 5,
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Application Fee
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 2,
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                          }}>
                          <Text style={screenStyles.headerSubtitleText}>
                            Rp. {formatNumberWithCommas(data?.applicationFee)}
                          </Text>
                        </View>
                      </View>
                    )}

                  {/*Distance*/}
                  {/* {data?.orderTypeId != 2 && data?.orderTypeId !== 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 7,
                      }}>
                      <View
                        style={{
                          flex: 5,
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Distance
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          {data?.totalDistance} Km
                        </Text>
                      </View>
                    </View>
                  )} */}

                  {/*Fare*/}
                  {data?.orderTypeId != 2 && data?.orderTypeId !== 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 7,
                      }}>
                      <View
                        style={{
                          flex: 5,
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Fare
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text style={screenStyles.headerSubtitleText}>
                          Rp. {formatNumberWithCommas(data?.totalAmount)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Dashed Line */}
                <View
                  style={{
                    borderColor: '#e8e8e8',
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                />

                {/* First Row */}

                <View
                  style={{
                    flexDirection: 'row',
                    flex: 7,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flex: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: Typography.P3,
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        color: 'black',
                      }}>
                      Total Amount
                    </Text>

                    <Text style={screenStyles.headerSubtitleText}>
                      Payment via{' '}
                      <Text style={screenStyles.headerSubtitleTexttt}>
                        {data?.paymentMethod}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 2,
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontSize: Typography.P3,
                        fontFamily: Fonts.RUBIK_MEDIUM,
                        color: colors.activeColor,
                      }}>
                      Rp. {formatNumberWithCommas(data?.totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* End */}
              {/* Button View*/}
              {data?.orderTypeId === 1 &&
                data?.orderTypeId === 2 &&
                data?.orderTypeId === 4 && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                      }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'white',
                          flex: 0.5,
                          borderColor: colors.primaryGreenColor,
                          borderRadius: 2,
                          borderWidth: 1.2,
                          marginEnd: 5,
                        }}
                        onPress={() => { }}>
                        <View
                          style={{ paddingVertical: 7, alignItems: 'center' }}>
                          <Text style={{ color: colors.primaryGreenColor }}>
                            Reorder
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor: 'white',
                          flex: 0.5,
                          borderColor: colors.primaryGreenColor,
                          borderRadius: 2,
                          borderWidth: 1.2,
                          marginStart: 5,
                          backgroundColor: colors.primaryGreenColor,
                        }}
                        onPress={() => { }}>
                        <View
                          style={{ paddingVertical: 7, alignItems: 'center' }}>
                          <Text style={{ color: 'white' }}>Rate Order</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        color: colors.primaryGreenColor,
                        paddingVertical: 6,
                        fontSize: Typography.P3,
                        fontFamily: Fonts.RUBIK_MEDIUM,
                      }}>
                      Do you want to return thid product?
                    </Text>
                  </View>
                )}

              {/* {data?.orderTypeId === 3 && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    marginBottom: 12,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      width: '100%',
                      borderColor: colors.primaryGreenColor,
                      borderRadius: 2,
                      borderWidth: 1.2,
                      marginStart: 5,
                      backgroundColor: colors.primaryGreenColor,
                    }}
                    onPress={() => {
                      props.navigation.navigate(Routes.TRACK_ORDERS, {
                        categoryTypeId: 1,
                        body: [`${data?.orderNo}`],
                      });
                    }}>
                    <View style={{ paddingVertical: 7, alignItems: 'center' }}>
                      <Text style={{ color: 'white' }}>Track Order</Text>
                    </View>
                  </TouchableOpacity>
               
                </View>
              )} */}
            </View>
          </ScrollView>
        );
      }}
    />
  );
};
