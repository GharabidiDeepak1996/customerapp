import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import React, { useState, useEffect } from 'react';

import {
  Animated,
  ScrollView,
  useColorScheme,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ToastAndroid,
  BackHandler,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Accordion from 'react-native-collapsible/Accordion';
import BaseView from '../BaseView';
import { Divider, Text } from 'react-native-elements';
import { Styles } from './Styles';
import Easing from 'react-native/Libraries/Animated/Easing';
import Globals from '../../utils/Globals';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import AppConfig from '../../../branding/App_config';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import Routes from '../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
import { useTranslation } from 'react-i18next';
import { color, log } from 'react-native-reanimated';
import { SearchButton } from '../../components/Application/SearchButton/View';
import { LocalStorageGet, LocalStorageSet } from '../../localStorage';
import { formatNumberWithCommas } from '../../utils/FormatNumberWithCommas';
import { Image } from 'react-native';
import assets from '../../../branding/carter/assets/Assets';

let dataLength = 1;
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function displayDecimalIfNeeded(originalNumber) {
  const flooredNumber = Math.floor(originalNumber);

  if (originalNumber !== flooredNumber) {
    // If the original number has a decimal part, display it with one decimal place
    return originalNumber.toFixed(1);
  } else {
    // If the original number is an integer, display it as is
    return flooredNumber.toString();
  }
}
export const MyOrders = props => {
  const { t, i18n } = useTranslation();

  const layout = useWindowDimensions();
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);
  const [index, setIndex] = React.useState(0);
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [isLoading, setLoading] = useState(true);
  //const [ dataLength, setDataLength] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = Globals.baseUrl;
  const api = 'customer';

  useFocusEffect(
    React.useCallback(() => {
      console.log('status running ...');
      (async () => {
        let filt = await LocalStorageGet('filterText');
        console.log('filt===>', filt);
        if (filt) {
          setFilter(filt);
        } else {
          setFilter('');
        }
        getAllOrder(filt);
      })();
    }, [setFilter, getAllOrder]),
  );

  const [routes] = React.useState([
    { key: 'first', title: t('Grocery') },
    { key: 'second', title: t('Food') },
    { key: 'third', title: t('Send') },
    { key: 'forth', title: t('Ride') },
  ]);

  const Item = ({
    orderNumber,
    orderDate,
    orderQuantity,
    orderTotalPrice,
    orderStatus,
    orderStatusId,
    rating,
    totalQty,
    Icon,
    onPress,
    onPressRating,
    orderTypeId,
    orderType,
    packageName,
    totalDistance,
    dimension,
    packagingName,
    trackingNo,
    deliveryMethod,
    deliveryOptionId,
  }) => (
    <View
      style={{
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 6,
        marginBottom: 10,
        paddingVertical: 15,
        marginHorizontal: 12,
      }}>
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1.5,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                padding: 15,
                backgroundColor: colors.inactiveColor,
                marginHorizontal: 0,
                marginBottom: 5,
                marginTop: 10,
                borderRadius: 999,
              }}>
              <SvgIcon
                type={Icon}
                width={25}
                height={25}
                color={colors.primaryGreenColor}
              />
            </View>
            <Text style={{ color: colors.activeColor }}>{orderType}</Text>
          </View>

          <View
            style={{
              flex: 4.5,
            }}>
            <View style={{ flexWrap: 'wrap' }}>
              <Text
                style={[
                  screenStyles.orderStatusSty,
                  {
                    color: colors.primaryGreenColor,
                    backgroundColor: colors.inactiveColor,
                  },
                ]}>
                {orderStatus}
              </Text>
            </View>
            <Text
              style={{
                fontSize: Typography.P3,
                fontFamily: Fonts.RUBIK_MEDIUM,
                color: 'black',
                marginVertical: hp('0.3'),
              }}>
              Order #{orderNumber}
            </Text>
            <Text style={screenStyles.headerSubtitleText}>
              {(orderTypeId === 1 || orderTypeId === 2 || orderTypeId === 4) &&
                `Placed on ${orderDate}`}

              {orderTypeId === 3 && `Booked on ${orderDate}`}
            </Text>

            {orderTypeId !== 3 && (
              <Text style={screenStyles.headerSubtitleText}>
                Package:
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                  {' '}
                  {packagingName}
                  {packageName}{' '}
                  {/* {deliveryOptionId == 2 &&
                    (deliveryMethod == 1 ? '(Cheapest)' : '(Fastest)')} */}
                </Text>{' '}
              </Text>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={screenStyles.headerSubtitleText}>
                {orderTypeId === 1 && 'Product(s): '}
                {orderTypeId === 2 && 'Items: '}
                {/* {((orderTypeId === 3) && "Package: ")} */}
                {/* {(orderTypeId === 4 || orderTypeId === 3) && 'Distance: '} */}
                {/* <Text style={{ color: 'black', fontWeight: 'bold' }}>
                  {(orderTypeId === 1 || orderTypeId === 2) && totalQty}
                  {(orderTypeId === 3 || orderTypeId === 4) &&
                    addCommasToNumber(totalDistance.toLocaleString()) + ' ' + 'km'

                  }
                </Text> */}
              </Text>
              {/* <Text style={screenStyles.headerSubtitleText}> | </Text> */}
              <Text style={screenStyles.headerSubtitleText}>
                Total:{' '}
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                  Rp.{formatNumberWithCommas(orderTotalPrice)}
                </Text>
              </Text>
            </View>
            {/* {(orderTypeId == 1 || orderTypeId == 2) &&
              orderStatusId == 6 && (
                <>
                  <Text style={screenStyles.headerSubtitleText}>
                    Rate for Order:
                    <Text style={{ fontSize: 18, color: 'orange' }}>★</Text> 5 |
                    Rate for Delivery
                    <Text style={{ fontSize: 18, color: 'orange' }}>★</Text> 5
                  </Text>
                </>
              )} */}
            {orderTypeId == 1 &&
              (orderStatusId !== 6 ? (
                <TouchableOpacity
                  style={{
                    borderColor: colors.activeColor,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    marginTop: 3,
                    padding: 7,
                  }}
                  onPress={() => {
                    props.navigation.navigate(Routes.SINGLE_MAP_TRACK_ORDERS, {
                      categoryTypeId: 1,
                      orderId: orderNumber,
                      product: totalQty,
                      totalRp: formatNumberWithCommas(orderTotalPrice),
                    });
                  }}>
                  <Text style={{ color: colors.activeColor, fontWeight: 'bold' }}>
                    Track Order
                  </Text>
                  {/* <Text style={{ color: 'gray', fontWeight: 'bold' }}>
                    Tracking Number : <Text>{trackingNo}</Text>
                  </Text> */}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    borderColor: colors.activeColor,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    marginTop: 3,
                    padding: 7,
                  }}
                  onPress={onPressRating}>
                  <Text style={{ color: colors.activeColor, fontWeight: 'bold' }}>
                    Rate Order
                  </Text>
                </TouchableOpacity>
              ))}
            {orderTypeId == 2 &&
              (orderStatusId !== 6 ? (
                <TouchableOpacity
                  style={{
                    borderColor: colors.activeColor,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    marginTop: 3,
                    padding: 7,
                  }}
                  onPress={() => {
                    props.navigation.navigate(Routes.SINGLE_MAP_TRACK_ORDERS, {
                      categoryTypeId: 2,
                      orderId: orderNumber,
                      product: totalQty,
                      totalRp: formatNumberWithCommas(orderTotalPrice),
                    });
                  }}>
                  <Text style={{ color: colors.activeColor, fontWeight: 'bold' }}>
                    Track Order
                  </Text>
                  {/* <Text style={{ color: 'gray', fontWeight: 'bold' }}>
                    Tracking Number : <Text>{trackingNo}</Text>
                  </Text> */}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    borderColor: colors.activeColor,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    marginTop: 3,
                    padding: 7,
                  }}
                  onPress={onPressRating}>
                  <Text style={{ color: colors.activeColor, fontWeight: 'bold' }}>
                    Rate Order
                  </Text>
                </TouchableOpacity>
              ))}

            {orderTypeId == 3 && orderStatusId !== 6 && (
              <TouchableOpacity
                style={{
                  borderColor: colors.activeColor,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  marginTop: 3,
                  padding: 7,
                }}
                onPress={() => {
                  console.log(
                    '---------------->4333---------------',
                    orderNumber,
                  );
                  props.navigation.navigate(Routes.SINGLE_MAP_TRACK_ORDERS, {
                    categoryTypeId: 3,
                    orderId: orderNumber,
                    product: totalQty,
                    totalRp: formatNumberWithCommas(orderTotalPrice),
                  });
                }}>
                <Text style={{ color: colors.activeColor, fontWeight: 'bold' }}>
                  Track Vehicle
                </Text>
                {/* <Text style={{ color: 'gray', fontWeight: 'bold' }}>
                  Tracking Number : <Text>{trackingNo}</Text>
                </Text> */}
              </TouchableOpacity>
            )}

            {orderTypeId == 4 && (
              <TouchableOpacity
                style={{
                  borderColor: colors.activeColor,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  marginTop: 3,
                  padding: 7,
                }}
                onPress={() => {
                  if (deliveryOptionId == 1) {
                    props.navigation.navigate(Routes.SINGLE_MAP_TRACK_ORDERS, {
                      categoryTypeId: 4,
                      orderId: orderNumber,
                      product: totalQty,
                      totalRp: formatNumberWithCommas(orderTotalPrice),
                    });
                  }

                  if (deliveryOptionId == 2) {
                    props.navigation.navigate(Routes.MAP_TRACK_ORDERS, {
                      categoryTypeId: 4,
                      orderId: orderNumber,
                      product: totalQty,
                      totalRp: formatNumberWithCommas(orderTotalPrice),
                    });
                  }
                }}>
                <Text style={{ color: colors.activeColor, fontWeight: 'bold' }}>
                  Track Package
                </Text>
                {/* <Text style={{ color: 'gray', fontWeight: 'bold' }}>
                  Tracking Number : <Text>{trackingNo}</Text>
                </Text> */}
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                padding: 5,
                backgroundColor: colors.inactiveColor,
                marginHorizontal: 10,
                marginVertical: 10,
                borderRadius: 999,
              }}>
              <SvgIcon
                type={IconNames.ChevronRight}
                width={16}
                height={15}
                color={colors.activeColor}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Text Re-order btn/ Rate */}
      {rating > 0 && orderTypeId != 4 && orderTypeId != 3 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={screenStyles.headerSubtitleText1}>
              Rate for Order{'  '}
              <SvgIcon type={IconNames.Star} width={16} height={16} />
              <Text style={{ color: 'black', fontWeight: 'bold' }}>
                {rating}
              </Text>{' '}
            </Text>
            {/* <Text style={screenStyles.headerSubtitleText1}> | </Text> */}

            {/* <Text style={screenStyles.headerSubtitleText1}>
              Rate for Delivery{'  '}
              <SvgIcon type={IconNames.Star} width={14} height={14} />
              <Text style={{ color: 'black', fontWeight: 'bold' }}>

                {rating}
              </Text>{' '}
            </Text> */}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              flex: 0.5,
              borderColor: colors.primaryGreenColor,
              borderRadius: 5,
              borderWidth: 0.5,
              marginTop: 6,
            }}
            onPress={onPressRating}>
            <View style={{ paddingVertical: 7, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: Typography.P4,
                  fontFamily: Fonts.RUBIK_MEDIUM,
                  color: colors.primaryGreenColor,
                }}>
                Reorder
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Re-order/ Rate order */}
      {rating == 0 && orderTypeId != 4 && orderTypeId != 3 && (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginTop: 6,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              flex: 0.5,
              borderColor: colors.primaryGreenColor,
              borderRadius: 5,
              borderWidth: 0.5,
              marginEnd: 5,
            }}
            onPress={onPressRating}>
            <View style={{ paddingVertical: 7, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: Typography.P4,
                  fontFamily: Fonts.RUBIK_MEDIUM,
                  color: colors.primaryGreenColor,
                }}>
                Reorder
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              flex: 0.5,
              borderColor: colors.primaryGreenColor,
              borderRadius: 5,
              borderWidth: 0.5,
              marginStart: 5,
            }}
            onPress={onPressRating}>
            <View style={{ paddingVertical: 7, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: Typography.P4,
                  fontFamily: Fonts.RUBIK_MEDIUM,
                  color: colors.primaryGreenColor,
                }}>
                Rate Order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getAllOrder = async filt => {
    const getUserId = await AsyncStorage.getItem('userId');
    const apiUrl = `${baseUrl}/Order/get-all-orders/${getUserId}`;
    console.log('MYORDER ALLLLLLLLLLLLLLLLLLLLL', apiUrl);
    setLoading(true);
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.statusCode == 200) {
          // console.log("response.data.payload===>", response.data.payload)
          if (filt) {
            console.log('set data if');
            console.log('filt==>', filt);
            const filteredOrders = response.data.payload.filter(order => {
              // const orderDate = new Date(order.orderDate);
              // console.log("orderDate===================", orderDate)
              // const startDate = new Date('2024-01-10T00:00:00.000Z');
              // const endDate = new Date('2024-01-15T23:59:59.999Z');
              return order.orderType === filt;
            });
            // const filteredOrders = response.data.payload.filter(order => order.orderType === filter);
            console.log('filteredOrders===>', filteredOrders);
            const sortedOrders = filteredOrders.sort((a, b) => {
              // Convert the orderDate strings to Date objects for comparison
              const dateA = new Date(a.orderDate);
              const dateB = new Date(b.orderDate);

              // Compare the dates (latest first)
              return dateB - dateA;
            });
            setData(sortedOrders);
          } else {
            console.log('set data else');
            setData(response.data.payload);
          }
          setIsDataLoaded(true);
          setLoading(false);
        } else if (response.data.statusCode == 404) {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const handleSearch = text => {
    console.log('search text==>', text);
    setSearchQuery(text);
    filterOrders(text);
  };
  const filterOrders = query => {
    const filteredOrders = data.filter(order => order.orderNo.includes(query));
    console.log('filteredOrders==>', filteredOrders);
    if (filteredOrders.length == 0) {
      setDataFilter([]);
    } else {
      setDataFilter(filteredOrders);
    }
  };

  dataLength = 1;
  return (
    <BaseView
      title={t('My Orders')}
      subTitle={'MyOrders'}
      navigation={props.navigation}
      showAppHeader={true}
      headerWithBack={true}
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={{ flex: 1, paddingVertical: hp(2) }}>
            {isLoading ? (
              <ActivityIndicator
                color="#2d2e7d"
                size="large"
                style={{ flex: 1 }}
              />
            ) : (
              <>
                {filter ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>
                      Filter:-{' '}
                      <Text style={{ color: '#000', fontWeight: 'bold' }}>
                        {filter}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        setFilter('');
                        getAllOrder('');
                        await LocalStorageSet('filterText', '');
                      }}>
                      <Text
                        style={{
                          color: '#1faaff',
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}>
                        Clear
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* <SearchButton
                onPress={() => { }}
                onChangeText={text => setSearchQuery(text)}
                onSearch={handleSearch} // Pass the handleSearch function to the SearchButton
                value={searchQuery}
                placeholder={'Search Order ...'}
                showFilter={true}
              /> */}
                {data.length !== 0 && (
                  <SearchButton
                    onChangeText={text => handleSearch(text)}
                    onSearch={text => handleSearch(text)}
                    value={searchQuery}
                    placeholder={'Search Order ...'}
                    showFilter={true}
                  />
                )}
                {data.length !== 0 && (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={dataFilter.length > 0 ? dataFilter : data}
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      marginHorizontal: wp(-5),
                    }}
                    keyExtractor={(item, index) => {
                      return item.id;
                    }}
                    //  renderItem={({ item, index1 }) => {
                    renderItem={({ item, index1 }) => {
                      dataLength += 1;
                      if (item.orderTypeId === 1) {
                        return (
                          <View style={screenStyles.foodLastItems}>
                            <Item
                              orderTypeId={item.orderTypeId}
                              orderType={item.orderType}
                              orderNumber={item.orderNo}
                              orderDate={item.orderDate}
                              orderQuantity={item.totalItemQty}
                              orderTotalPrice={item.totalAmount}
                              orderStatus={item.orderStatus}
                              orderStatusId={item.orderStatusId}
                              totalQty={item.totalQty}
                              rating={item.rating}
                              trackingNo={item.trackingNo}
                              packagingName={
                                item?.orderSellerDetails[0]?.packagingName
                              }
                              Icon={IconNames.Grocery}
                              onPress={() => {
                                props.navigation.navigate(
                                  Routes.ORDER_DETAILS,
                                  {
                                    text: item,
                                    newtext: item.orderSellerDetails,
                                  },
                                );
                              }}
                              onPressRating={() => {
                                props.navigation.navigate(Routes.Rating, {
                                  text: item,
                                  newtext: item.orderSellerDetails,
                                });
                              }}
                            />
                          </View>
                        );
                      } else if (item.orderTypeId === 2) {
                        return (
                          <View style={screenStyles.foodLastItems}>
                            <Item
                              orderTypeId={item.orderTypeId}
                              orderType={item.orderType}
                              orderNumber={item.orderNo}
                              orderDate={item.orderDate}
                              orderQuantity={item.totalItemQty}
                              orderTotalPrice={item.totalAmount}
                              orderStatus={item.orderStatus}
                              orderStatusId={item.orderStatusId}
                              totalQty={item.totalQty}
                              trackingNo={item.trackingNo}
                              rating={item.rating}
                              packagingName={
                                item?.orderSellerDetails[0]?.packagingName
                              }
                              Icon={IconNames.Food}
                              onPress={() => {
                                props.navigation.navigate(
                                  Routes.ORDER_DETAILS,
                                  {
                                    text: item,
                                    newtext: item.orderSellerDetails,
                                  },
                                );
                              }}
                              onPressRating={() => {
                                props.navigation.navigate(Routes.Rating, {
                                  text: item,
                                  newtext: item.orderSellerDetails,
                                });
                              }}
                            />
                          </View>
                        );
                      } else if (item.orderTypeId === 4) {
                        return (
                          <View style={screenStyles.foodLastItems}>
                            <Item
                              orderTypeId={item.orderTypeId}
                              orderType={item.orderType}
                              orderNumber={item.orderNo}
                              orderDate={item.orderDate}
                              orderQuantity={item.totalItemQty}
                              orderTotalPrice={item.totalAmount}
                              orderStatus={item.orderStatus}
                              orderStatusId={item.orderStatusId}
                              totalQty={item.totalQty}
                              rating={item.rating}
                              trackingNo={item.trackingNo}
                              deliveryMethod={item.routeoptionId}
                              deliveryOptionId={item.deliveryOptionId}
                              packageName={item.packageName}
                              totalDistance={item.totalDistance}
                              dimension={item.dimension}
                              packagingName={
                                item?.orderSellerDetails[0]?.packagingName
                              }
                              Icon={IconNames.Courier}
                              onPress={() => {
                                props.navigation.navigate(
                                  Routes.ORDER_DETAILS,
                                  {
                                    text: item,
                                    newtext: item.orderSellerDetails,
                                  },
                                );
                              }}
                              onPressRating={() => {
                                props.navigation.navigate(Routes.Rating, {
                                  text: item,
                                  newtext: item.orderSellerDetails,
                                });
                              }}
                            />
                          </View>
                        );
                      } else if (item.orderTypeId === 3) {
                        return (
                          <View style={screenStyles.foodLastItems}>
                            <Item
                              orderTypeId={item.orderTypeId}
                              orderType={item.orderType}
                              orderNumber={item.orderNo}
                              orderDate={item.orderDate}
                              orderQuantity={item.totalItemQty}
                              orderTotalPrice={item.totalAmount}
                              orderStatus={item.orderStatus}
                              orderStatusId={item.orderStatusId}
                              totalQty={item.totalQty}
                              rating={item.rating}
                              totalDistance={item.totalDistance}
                              dimension={item.dimension}
                              trackingNo={item.trackingNo}
                              packagingName={
                                item?.orderSellerDetails[0]?.packagingName
                              }
                              Icon={IconNames.taxibike}
                              onPress={() => {
                                console.log('item route==>', item);
                                props.navigation.navigate(
                                  Routes.ORDER_DETAILS,
                                  {
                                    text: item,
                                    newtext: item.orderSellerDetails,
                                  },
                                );
                              }}
                              onPressRating={() => {
                                console.log('item route==>', item);
                                props.navigation.navigate(Routes.Rating, {
                                  text: item,
                                  newtext: item.orderSellerDetails,
                                });
                              }}
                            />
                          </View>
                        );
                      }
                    }}
                  />
                )}

                {data.length == 0 && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Image
                      source={assets.no_address}
                      style={screenStyles.headerImage}
                    />

                    <Text style={screenStyles.title}>No Orders</Text>
                    <Text style={screenStyles.subTitle}>
                      Your order list is currently empty. Start exploring and
                      make your first purchase today!
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        );
      }}
    />
  );
};

// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import React, {useState, useEffect} from 'react';

// import {
//   Animated,
//   ScrollView,
//   useColorScheme,
//   View,
//   FlatList,
//   TouchableOpacity,
//   useWindowDimensions,
//   ToastAndroid,
//   BackHandler,
//   Alert,
// } from 'react-native';
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import Accordion from 'react-native-collapsible/Accordion';
// import BaseView from '../BaseView';
// import {Divider, Text} from 'react-native-elements';
// import {Styles} from './Styles';
// import Easing from 'react-native/Libraries/Animated/Easing';
// import Globals from '../../utils/Globals';
// import {useFocusEffect, useTheme} from '@react-navigation/native';
// import AppConfig from '../../../branding/App_config';
// import {SvgIcon} from '../../components/Application/SvgIcon/View';
// import IconNames from '../../../branding/carter/assets/IconNames';
// import axios from 'axios';
// import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
// import {commonDarkStyles} from '../../../branding/carter/styles/dark/Style';
// import {commonLightStyles} from '../../../branding/carter/styles/light/Style';
// import Routes from '../../navigation/Routes';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ActivityIndicator} from 'react-native';

// const Fonts = AppConfig.fonts.default;
// const Typography = AppConfig.typography.default;
// import {useTranslation} from 'react-i18next';
// import {color} from 'react-native-reanimated';

// let dataLength = 1;

// export const MyOrders = props => {
//   const {t, i18n} = useTranslation();

//   const layout = useWindowDimensions();
//   const scheme = useColorScheme();
//   const {colors} = useTheme();
//   const globalStyles =
//     scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
//   const screenStyles = Styles(globalStyles, scheme, colors);

//   const [index, setIndex] = React.useState(0);
//   const [data, setData] = useState([]);
//   const [isLoading, setLoading] = useState(true);
//   //const [ dataLength, setDataLength] = useState([]);

//   const [isDataLoaded, setIsDataLoaded] = useState(false);

//   const baseUrl = Globals.baseUrl;
//   const api = 'customer';

//   const [routes] = React.useState([
//     {key: 'first', title: t('Grocery')},
//     {key: 'second', title: t('Food')},
//     {key: 'third', title: t('Send')},
//     {key: 'forth', title: t('Ride')},
//   ]);

//   const Item = ({
//     orderNumber,
//     orderDate,
//     orderQuantity,
//     orderTotalPrice,
//     orderStatus,
//     orderStatusId,
//     rating,
//     totalQty,
//     Icon,
//     onPress,
//     onPressRating,
//     orderTypeId,
//     orderType,
//     packageName,
//     totalDistance,
//     dimension,
//     packagingName,
//   }) => (
//     <View
//       style={{
//         backgroundColor: 'white',
//         borderRadius: 10,
//         borderColor: '#808080',
//         borderWidth: 0.5,
//         marginBottom: 10,
//         padding: 16,
//       }}>
//       <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
//         <View
//           style={{
//             //  backgroundColor: 'green',
//             flexDirection: 'row',
//             // flex: 7,
//           }}>
//           {/* <View
//               style={{
//                 flex: 2,
//                 backgroundColor: 'white',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <View
//                 style={{
//                   padding: 15,
//                   backgroundColor: '#f1fce6',
//                   marginHorizontal: 10,
//                   marginVertical: 10,
//                   borderRadius: 999,
//                 }}>
//                 <SvgIcon
//                   type={Icon}
//                   width={25}
//                   height={25}
//                   color={colors.primaryGreenColor}
//                 />
//               </View>
//             </View> */}

//           <View
//             style={{
//               flex: 4,
//             }}>
//             <View style={{width: '30%'}}>
//               <Text
//                 style={[
//                   orderStatusId == 1 && screenStyles.orderStatusSty,
//                   orderStatusId == 2 && screenStyles.orderStatusSty,
//                   orderStatusId == 3 && screenStyles.orderStatusSty,
//                   orderStatusId == 4 && screenStyles.orderStatusSty,
//                   orderStatusId == 5 && screenStyles.orderStatusSty,
//                   orderStatusId == 6 && screenStyles.orderStatusSty,
//                   orderStatusId == 7 && screenStyles.orderStatusSty,
//                 ]}>
//                 {orderStatus}
//               </Text>
//             </View>
//             <Text
//               style={{
//                 fontSize: Typography.P2,
//                 fontFamily: Fonts.RUBIK_MEDIUM,
//                 color: 'black',
//                 marginVertical: hp('0.3'),
//               }}>
//               Order #{orderNumber}
//             </Text>
//             <Text style={screenStyles.headerSubtitleText}>
//               {(orderTypeId === 1 || orderTypeId === 2 || orderTypeId === 4) &&
//                 `Placed on ${orderDate}`}

//               {orderTypeId === 3 && `Booked on ${orderDate}`}
//             </Text>
//             {orderTypeId === 4 && (
//               <Text style={screenStyles.headerSubtitleText}>
//                 Package:
//                 <Text style={{color: 'black', fontWeight: 'bold'}}>
//                   {dimension}
//                 </Text>{' '}
//               </Text>
//             )}
//             <View style={{flexDirection: 'row'}}>
//               <Text style={screenStyles.headerSubtitleText}>
//                 {orderTypeId === 1 && 'Products: '}
//                 {orderTypeId === 2 && 'Items: '}
//                 {/* {((orderTypeId === 3) && "Package: ")} */}
//                 {(orderTypeId === 4 || orderTypeId === 3) && 'Distance: '}
//                 <Text style={{color: 'black', fontWeight: 'bold'}}>
//                   {(orderTypeId === 1 || orderTypeId === 2) && totalQty}
//                   {(orderTypeId === 3 || orderTypeId === 4) &&
//                     totalDistance + ' ' + 'km'}
//                 </Text>{' '}
//               </Text>
//               {/* <Text style={screenStyles.headerSubtitleText}> | </Text> */}
//               <Text style={screenStyles.headerSubtitleText}>
//                 Total:{' '}
//                 <Text style={{color: 'black', fontWeight: 'bold'}}>
//                   Rp.{orderTotalPrice}
//                 </Text>
//               </Text>
//             </View>
//           </View>

//           <View
//             style={{
//               flex: 1,
//               backgroundColor: 'white',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <View
//               style={{
//                 padding: 5,
//                 backgroundColor: '#E5F2EB',
//                 marginHorizontal: 10,
//                 marginVertical: 10,
//                 borderRadius: 999,
//               }}>
//               <SvgIcon
//                 type={IconNames.ChevronRight}
//                 width={16}
//                 height={15}
//                 color={colors.primaryGreenColor}
//               />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>

//       {/* Text Re-order btn/ Rate */}
//       {rating > 0 && orderTypeId != 4 && orderTypeId != 3 && (
//         <View>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//             }}>
//             <Text style={screenStyles.headerSubtitleText1}>
//               Rate for Order{'  '}
//               <SvgIcon type={IconNames.Star} width={16} height={16} />
//               <Text style={{color: 'black', fontWeight: 'bold'}}>
//                 {rating}
//               </Text>{' '}
//             </Text>
//             {/* <Text style={screenStyles.headerSubtitleText1}> | </Text> */}

//             {/* <Text style={screenStyles.headerSubtitleText1}>
//               Rate for Delivery{'  '}
//               <SvgIcon type={IconNames.Star} width={14} height={14} />
//               <Text style={{ color: 'black', fontWeight: 'bold' }}>

//                 {rating}
//               </Text>{' '}
//             </Text> */}
//           </View>

//           <TouchableOpacity
//             style={{
//               backgroundColor: 'white',
//               flex: 0.5,
//               borderColor: colors.primaryGreenColor,
//               borderRadius: 5,
//               borderWidth: 0.5,
//               marginTop: 6,
//             }}
//             onPress={onPressRating}>
//             <View style={{paddingVertical: 7, alignItems: 'center'}}>
//               <Text
//                 style={{
//                   fontSize: Typography.P4,
//                   fontFamily: Fonts.RUBIK_MEDIUM,
//                   color: colors.primaryGreenColor,
//                 }}>
//                 Reorder
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Re-order/ Rate order */}
//       {rating == 0 && orderTypeId != 4 && orderTypeId != 3 && (
//         <View
//           style={{
//             flexDirection: 'row',
//             flex: 1,
//             marginTop: 6,
//           }}>
//           <TouchableOpacity
//             style={{
//               backgroundColor: 'white',
//               flex: 0.5,
//               borderColor: colors.primaryGreenColor,
//               borderRadius: 5,
//               borderWidth: 0.5,
//               marginEnd: 5,
//             }}
//             onPress={onPressRating}>
//             <View style={{paddingVertical: 7, alignItems: 'center'}}>
//               <Text
//                 style={{
//                   fontSize: Typography.P4,
//                   fontFamily: Fonts.RUBIK_MEDIUM,
//                   color: colors.primaryGreenColor,
//                 }}>
//                 Reorder
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{
//               backgroundColor: 'white',
//               flex: 0.5,
//               borderColor: colors.primaryGreenColor,
//               borderRadius: 5,
//               borderWidth: 0.5,
//               marginStart: 5,
//             }}
//             onPress={onPressRating}>
//             <View style={{paddingVertical: 7, alignItems: 'center'}}>
//               <Text
//                 style={{
//                   fontSize: Typography.P4,
//                   fontFamily: Fonts.RUBIK_MEDIUM,
//                   color: colors.primaryGreenColor,
//                 }}>
//                 Rate Order
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   const getOrderDetailsForGroceryAndFood = async () => {
//     const getUserId = await AsyncStorage.getItem('userId');
//     const apiUrl = `${baseUrl}/Order/${getUserId}`;
//     axios
//       .get(apiUrl)
//       .then(response => {
//         if (response.data.statusCode == 200) {
//           setData(response.data.payload);
//           setIsDataLoaded(true);
//           setLoading(false);
//         } else if (response.data.statusCode == 404) {
//           ToastAndroid.show(
//             'No orders found in Grocery and Food',
//             ToastAndroid.SHORT,
//           );
//           setLoading(false);
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         setLoading(false);
//       });
//   };
//   const getOrderDetailsForRide = async () => {
//     const getUserId = await AsyncStorage.getItem('userId');

//     const apiUrl = `${baseUrl}/Order/ride-orders/${getUserId}/${3}`;
//     console.log('=======================Order', apiUrl);

//     axios
//       .get(apiUrl)
//       .then(response => {
//         if (response.data.statusCode == 200) {
//           setData(response.data.payload);
//           setIsDataLoaded(true);
//           setLoading(false);
//         } else if (response.data.statusCode == 404) {
//           setLoading(false);
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         setLoading(false);
//       });
//   };

//   const getOrderDetailsForSend = async () => {
//     const getUserId = await AsyncStorage.getItem('userId');
//     const apiUrl = `${baseUrl}/Order/send-orders/${getUserId}/${4}`;

//     console.log('=======================Order', apiUrl);
//     axios
//       .get(apiUrl)
//       .then(response => {
//         if (response.data.statusCode == 200) {
//           setData(response.data.payload);
//           setIsDataLoaded(true);
//           setLoading(false);
//         } else if (response.data.statusCode == 404) {
//           setLoading(false);
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         setLoading(false);
//       });
//   };

//   // useEffect(() => {
//   //   if (index == 0) {
//   //     getOrderDetailsForGroceryAndFood();
//   //   } else if (index == 1) {
//   //     getOrderDetailsForGroceryAndFood();
//   //   } else if (index == 2) {
//   //     getOrderDetailsForSend()
//   //   } else if (index == 3) {
//   //     getOrderDetailsForRide()
//   //   }
//   // }, [index]);

//   useFocusEffect(
//     React.useCallback(() => {
//       if (index == 0) {
//         getOrderDetailsForGroceryAndFood();
//       } else if (index == 1) {
//         getOrderDetailsForGroceryAndFood();
//       } else if (index == 2) {
//         getOrderDetailsForSend();
//       } else if (index == 3) {
//         getOrderDetailsForRide();
//       }
//     }, [index]),
//   );

//   const FirstRoute = () => (
//     <View style={{flex: 1}}>
//       {isLoading ? (
//         <ActivityIndicator color="#4E9F3D" size="large" style={{flex: 1}} />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           data={data}
//           style={{marginTop: 0, marginBottom: 16}}
//           keyExtractor={(item, index) => {
//             return item.id;
//           }}
//           renderItem={({item, index1}) => {
//             dataLength += 1;
//             if (item.orderType === 'Grocery') {
//               return (
//                 <View style={screenStyles.foodLastItems}>
//                   <Item
//                     orderTypeId={item.orderTypeId}
//                     orderType={item.orderType}
//                     orderNumber={item.orderNo}
//                     orderDate={item.orderDate}
//                     orderQuantity={item.totalItemQty}
//                     orderTotalPrice={item.totalAmount}
//                     orderStatus={item.orderStatus}
//                     orderStatusId={item.orderStatusId}
//                     totalQty={item.totalQty}
//                     rating={item.rating}
//                     packagingName={item.packagingName}
//                     Icon={IconNames.Grocery}
//                     onPress={() => {
//                       props.navigation.navigate(Routes.ORDER_DETAILS, {
//                         text: item,
//                         newtext: item.orderDetails,
//                       });
//                     }}
//                     onPressRating={() => {
//                       props.navigation.navigate(Routes.Rating, {
//                         text: item,
//                         newtext: item.orderDetails,
//                       });
//                     }}
//                   />
//                 </View>
//               );
//             }

//             // else if (index == 0 && data.length === dataLength) {
//             //   //console.log("dataLength",data.length === dataLength, data.length, dataLength);
//             //   // ToastAndroid.show(
//             //   //     'No orders in Grocery',
//             //   //     ToastAndroid.SHORT,
//             //   //   );
//             // }
//           }}
//         />
//       )}
//     </View>
//   );

//   const SecondRoute = () => (
//     <View>
//       {isLoading ? (
//         <ActivityIndicator color="#4E9F3D" size="large" style={{flex: 1}} />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           data={data}
//           style={{marginTop: 0, marginBottom: 16}}
//           keyExtractor={(item, index) => {
//             return item.id;
//           }}
//           renderItem={({item, index1}) => {
//             if (item.orderType === 'Food' && index === 1) {
//               return (
//                 <View style={screenStyles.foodLastItems}>
//                   <Item
//                     orderTypeId={item.orderTypeId}
//                     orderType={item.orderType}
//                     orderNumber={item.orderNo}
//                     orderDate={item.orderDate}
//                     orderQuantity={item.totalItemQty}
//                     orderTotalPrice={item.totalAmount}
//                     orderStatus={item.orderStatus}
//                     orderStatusId={item.orderStatusId}
//                     totalQty={item.totalQty}
//                     rating={item.rating}
//                     packagingName={item.packagingName}
//                     Icon={IconNames.Food}
//                     onPress={() => {
//                       props.navigation.navigate(Routes.ORDER_DETAILS, {
//                         text: item,
//                         newtext: item.orderDetails,
//                       });
//                     }}
//                     onPressRating={() => {
//                       props.navigation.navigate(Routes.Rating, {
//                         text: item,
//                         newtext: item.orderDetails,
//                       });
//                     }}
//                   />
//                 </View>
//               );
//             }
//             // else if (index == 1 && data.length === dataLength) {
//             //   ToastAndroid.show('No orders in Food', ToastAndroid.SHORT);
//             // }
//           }}
//         />
//       )}
//     </View>
//   );
//   const ThirdRoute = () => (
//     <View>
//       {isLoading ? (
//         <ActivityIndicator color="#4E9F3D" size="large" style={{flex: 1}} />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           data={data}
//           style={{marginTop: 0, marginBottom: 16}}
//           keyExtractor={(item, index) => {
//             return item.id;
//           }}
//           renderItem={({item, index1}) => {
//             if (item.orderType === 'Send') {
//               //4
//               return (
//                 <View style={screenStyles.foodLastItems}>
//                   <Item
//                     orderTypeId={item.orderTypeId}
//                     orderType={item.orderType}
//                     orderNumber={item.orderNo}
//                     orderDate={item.orderDate}
//                     orderQuantity={item.totalItemQty}
//                     orderTotalPrice={item.totalAmount}
//                     orderStatus={item.orderStatus}
//                     orderStatusId={item.orderStatusId}
//                     totalQty={item.totalQty}
//                     rating={item.rating}
//                     packageName={item.packageName}
//                     totalDistance={item.totalDistance}
//                     dimension={item.dimension}
//                     Icon={IconNames.Food}
//                     onPress={() => {
//                       props.navigation.navigate(Routes.ORDER_DETAILS, {
//                         text: item,
//                         // newtext: item.orderDetails,
//                       });
//                     }}
//                     onPressRating={() => {
//                       props.navigation.navigate(Routes.Rating, {
//                         text: item,
//                         newtext: item.orderDetails,
//                       });
//                     }}
//                   />
//                 </View>
//               );
//             }
//             // else if (index == 1 && data.length === dataLength) {
//             //   ToastAndroid.show('No orders in Send', ToastAndroid.SHORT);
//             // }
//           }}
//         />
//       )}
//     </View>
//   );
//   const ForthRoute = () => (
//     <View>
//       {isLoading ? (
//         <ActivityIndicator color="#4E9F3D" size="large" style={{flex: 1}} />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           data={data}
//           style={{marginTop: 0, marginBottom: 16}}
//           keyExtractor={(item, index) => {
//             return item.id;
//           }}
//           renderItem={({item, index1}) => {
//             if (item.orderType === 'Ride') {
//               //3
//               return (
//                 <View style={screenStyles.foodLastItems}>
//                   <Item
//                     orderTypeId={item.orderTypeId}
//                     orderType={item.orderType}
//                     orderNumber={item.orderNo}
//                     orderDate={item.orderDate}
//                     orderQuantity={item.totalItemQty}
//                     orderTotalPrice={item.totalAmount}
//                     orderStatus={item.orderStatus}
//                     orderStatusId={item.orderStatusId}
//                     totalQty={item.totalQty}
//                     rating={item.rating}
//                     totalDistance={item.totalDistance}
//                     dimension={item.dimension}
//                     Icon={IconNames.Food}
//                     onPress={() => {
//                       props.navigation.navigate(Routes.ORDER_DETAILS, {
//                         text: item,
//                         //newtext: item.orderDetails,
//                       });
//                     }}
//                     onPressRating={() => {
//                       props.navigation.navigate(Routes.Rating, {
//                         text: item,
//                         newtext: item.orderDetails,
//                       });
//                     }}
//                   />
//                 </View>
//               );
//             }
//             // else if (index == 1 && data.length === dataLength) {
//             //   ToastAndroid.show('No orders in Ride', ToastAndroid.SHORT);
//             // }
//           }}
//         />
//       )}
//     </View>
//   );

//   const renderScene = SceneMap({
//     first: FirstRoute,
//     second: SecondRoute,
//     third: ThirdRoute,
//     forth: ForthRoute,
//   });

//   dataLength = 1;
//   return (
//     <BaseView
//       title={t('My Orders')}
//       navigation={props.navigation}
//       showAppHeader={true}
//       headerWithBack={!props.route.params.hideBack}
//       applyBottomSafeArea
//       childView={() => {
//         return (
//           <TabView
//             navigationState={{index, routes}}
//             renderScene={renderScene}
//             onIndexChange={setIndex}
//             initialLayout={{width: layout.width}}
//             renderTabBar={props => (
//               <TabBar
//                 {...props}
//                 indicatorStyle={{backgroundColor: 'white'}}
//                 labelStyle={{fontSize: 11}}
//                 style={{
//                   backgroundColor: colors.activeColor,
//                   marginVertical: 16,
//                   width: '100%',
//                   borderRadius: 8,
//                 }}
//               />
//             )}
//           />
//         );
//       }}
//     />
//   );
// };
