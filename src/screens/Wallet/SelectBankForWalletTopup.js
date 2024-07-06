import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ToastAndroid,
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
import { PaymentService } from '../../apis/services';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import Routes from '../../navigation/Routes';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
// import img from './Assets/Images/c_slider_img_1.png'
//import img from '../../../branding/carter/assets/Assets/Images/c_slider_img_1.png';

const assets = AppConfig.assets.default;
const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
export const SelectBankForWalletTopup = props => {
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);

  const screenStyles = Styles(scheme, colors);
  const { t, i18n } = useTranslation();
  const [topUpInputAmt, setTopUpInputAmt] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isAmtError, setIsAmtError] = useState(false);
  const [checked, setChecked] = useState({
    paymentMethod: '',
    paymentName: '',
    paymentImage: '',
    adminFees: 0,
    customerName: '',
    customerEmail: '',
    customerMobile: '',
    PaymentRefNumber: 0,
    PaymentReference: 0,
  });
  let PaymentInterval = useSelector(state => state.dashboard.PaymentInterval); //deepak add
  let deliveryLatSlice = useSelector(state => state.addressReducer.deliveryLat);
  let deliveryLngSlice = useSelector(state => state.addressReducer.deliveryLng);

  const [reference, setReference] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isTranscationProceed, setIsTrascationProceed] = useState(true);
  const [minutes, setMinutes] = useState(PaymentInterval);
  const [second, SetSecond] = useState(0);
  const [merchantOrderId, setMerchantOrderId] = useState(
    String(Math.floor(100000 + Math.random() * 900000)),
  );

  const [amount, setAmount] = useState(props.route.params.amt || 0);
  const [bankData, setBankData] = useState([]);

  let inputRef = useRef();
  var time, interval;

  useEffect(() => {
    (async () => {
      const userName = await AsyncStorage.getItem('displayName');
      const phone = await AsyncStorage.getItem('phoneNo');
      const UserEmail = await AsyncStorage.getItem('email');

      setChecked(prevData => ({
        ...prevData,
        customerName: userName,
        customerEmail: UserEmail,
        customerMobile: phone,
      }));
    })();
  }, []);
  useEffect(() => {
    getBank();
  }, []);

  useEffect(() => {
    if (!isTranscationProceed) {
      time = setInterval(() => {
        if (second === 0) {
          if (minutes === 0) {
            clearInterval(time); // Countdown finished, clear interval
          } else {
            setMinutes(minutes - 1);
            SetSecond(59);
          }
        } else {
          SetSecond(second - 1);
        }
      }, 1000);

      return () => clearInterval(time);
    }
  }, [minutes, second, isTranscationProceed]); // Include minutes and second in dependency array

  const callApi = () => {
    interval = setInterval(getCheckTransactionStatus, 5000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (
      checked.PaymentRefNumber != 0 &&
      checked.checkTransactionStatus == '00'
    ) {
      AddWallet(checked.PaymentReference);
    }
  }, [
    checked.PaymentRefNumber,
    checked.PaymentReference,
    checked.checkTransactionStatus,
  ]);
  const getCheckTransactionStatus = async () => {
    const getUserId = await AsyncStorage.getItem('userId');
    const uniqueId = await DeviceInfo.getUniqueId();
    var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    console.log(
      'PayemntRefres------------',
      await AsyncStorage.getItem('PaymentRefNumber'),
    );
    const body = {
      userId: getUserId,
      merchantOrderId: merchantOrderId,
      transactionNo: await AsyncStorage.getItem('PaymentReference'),
      latitude: deliveryLatSlice,
      longitude: deliveryLngSlice,
      deviceId: uniqueId,
      paymentDate: date,
      paymentTypeId: 2,
      vaNumber: await AsyncStorage.getItem('PaymentRefNumber'),
    };

    console.log('checkTransStatus----walletTopup====', body);

    const response = await PaymentService.getCheckTransactionStatus(
      body,
      merchantOrderId,
    );
    console.log('checkTransStatusresponse====', response?.data?.payload);

    if (response?.data?.isSuccess) {
      if (response?.data?.payload?.statusCode == '01') {
        //process show loader
        setChecked(prevData => ({
          ...prevData,
          checkTransactionStatus: '01',
        }));
      } else if (response?.data?.payload?.statusCode == '00') {
        //success

        clearInterval(time);
        clearInterval(interval);
        setMinutes(0);
        SetSecond(0);
        setChecked(prevData => ({
          ...prevData,
          checkTransactionStatus: '00',
        }));

        //call Api for update price
      } else if (response?.data?.payload?.statusCode == '02') {
        //failer
        clearInterval(time);
        clearInterval(interval);
        setMinutes(0);
        SetSecond(0);
        setChecked(prevData => ({
          ...prevData,
          checkTransactionStatus: '02',
        }));
      }
    }
  };

  const getBank = async () => {
    try {
      const response = await PaymentService.getBankDetails();

      if (response?.data?.isSuccess) {
        console.log('bannnkkkkkkkresponse', response?.data?.payload);

        const paymentFeeWithId = response?.data?.payload?.map((item, index) => {
          return {
            ...item,
            id: index + 1,
          };
        });

        setBankData(paymentFeeWithId);
      } else {
        setBankData(null);
      }
    } catch (error) {
      console.log('Errorlog', error);
    }
  };

  const getTransactionReqId = async () => {
    let body = {
      paymentAmount: String(amount + checked?.adminFees),
      paymentMethod: checked?.paymentCode,
      merchantOrderId: merchantOrderId,
      productDetails: 'wallet',
      additionalParam: '',
      merchantUserInfo: '',
      customerVaName: checked?.customerName,
      email: checked?.customerEmail,
      phoneNumber: checked?.customerMobile,
      itemDetails: [
        // {
        //   name: packageName,
        //   price: totalKgCost,
        //   quantity: packageQty
        // },
      ],
      customerDetail: {
        firstName: checked?.customerName,
        lastName: '',
        email: checked?.customerEmail,
        phoneNumber: checked?.customerMobile,
        billingAddress: {
          firstName: checked?.customerName,
          lastName: '',
          address: 'Jl. Kembanga',
          city: 'Jakarta',
          postalCode: String(11530),
          phone: checked?.customerMobile,
          countryCode: String(91),
        },
        shippingAddress: {
          firstName: checked?.customerName,
          lastName: '',
          address: 'Jl. Kembangan Raya',
          city: 'Jakarta',
          postalCode: String(11530),
          phone: checked?.customerMobile,
          countryCode: String(91),
        },
      },
      expiryPeriod: PaymentInterval, //deepak add
    };

    console.log('getTranscationIdBody----------------', body);

    const response = await PaymentService.getTranscationId(body);
    if (response?.data?.isSuccess) {
      console.log(
        'getTranscationIdRespondddddd----------------',
        response?.data?.payload?.reference,
      );
      setIsTrascationProceed(false);
      setModalVisible(!modalVisible);

      setChecked(prevData => ({
        ...prevData,
        PaymentRefNumber: response?.data?.payload?.vaNumber,
        PaymentReference: response?.data?.payload?.reference,
      }));

      await AsyncStorage.setItem(
        'PaymentReference',
        response?.data?.payload?.reference,
      );

      await AsyncStorage.setItem(
        'PaymentRefNumber',
        response?.data?.payload?.vaNumber,
      );
      // setChecked(prevData => {
      //   console.log('Response:', response?.data?.payload);
      //   console.log('Previous Data:', prevData);
      //   const updatedData = {
      //     ...prevData,
      //     PaymentRefNumber: response?.data?.payload?.vaNumber,
      //     PaymentReference: response?.data?.payload?.reference,
      //   };
      //   console.log('Updated Data:', updatedData);
      //   return updatedData;
      // });

      //start check transaction status.
    } else {
      console.log(
        'getTranscationIdResonse----------------',
        response?.data.message,
      );
      ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
    }
  };

  const AddWallet = async val => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      userId: getUserId,
      referenceNo: val,
      note: 'Wallet top up',
      amount: amount,
      walletAdminFee: checked.adminFees,
      bankId: checked.bankId,
    };

    const response = await PaymentService.addWallet(body);
    if (response?.data?.isSuccess) {
      Alert.alert('Success', 'Wallet top up successfull.', [
        {
          text: 'Ok',
          onPress: () => {
            props.navigation.navigate(Routes.PROFILE);
            //dispatch(clearProducts());
          },
        },
      ]);
    }
  };
  return (
    <BaseView
      navigation={props.navigation}
      title={!isTranscationProceed ? 'Pay' : 'Payment Method'}
      headerWithBack
      onBackPress={() => {
        props.navigation.navigate(Routes.TOPUP_WALLET)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            <View style={screenStyles.topUpContainer}>
              {/* Topup */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <Text style={screenStyles.headerSubtitleText}>Top Up</Text>
                <Text style={[screenStyles.topUpLabel]}>
                  Rp. {amount}
                </Text>
              </View>

              {/* AdminFees */}
              {!isTranscationProceed && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={screenStyles.headerSubtitleText}>Admin Fee</Text>

                  <Text style={[screenStyles.topUpLabel]}>
                    Rp. {checked?.adminFees}
                  </Text>
                </View>
              )}

              {!isTranscationProceed && (
                <View
                  style={{
                    borderColor: '#e8e8e8',
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                />
              )}

              {/* Total Amount */}

              {!isTranscationProceed && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: Typography.P3,
                      fontFamily: fonts.RUBIK_MEDIUM,
                      color: 'black',
                    }}>
                    Total Amount
                  </Text>
                  <Text style={screenStyles.finalAmtLabel}>
                    Rp. {amount + checked?.adminFees}
                  </Text>
                </View>
              )}
            </View>

            {isTranscationProceed && (
              <View style={{ marginTop: 20 }}>
                <Text style={screenStyles.AddMoneyLabel}>
                  Select payment method
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              {isTranscationProceed && (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={bankData}
                  style={{ marginTop: 0, marginBottom: 20 }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setChecked(data => ({
                            ...data,
                            paymentMethod: item.paymentMethod,
                            paymentName: item.paymentName,
                            paymentImage: item.paymentImage,
                            adminFees: item.adminFees,
                            bankId: item.bankId,
                            paymentCode: item.paymentCode,
                          }));
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#d3d3d3',
                            backgroundColor: 'white',
                            borderRadius: 4,
                            borderWidth: 1,
                            marginBottom: 10,
                            padding: 8,
                          }}>
                          <Image
                            source={{
                              uri: `${Globals.imgBaseURL}${item.paymentImage}`,
                            }}
                            style={{ width: 68, height: 18 }}
                            resizeMode="contain"
                          />
                          <Text style={screenStyles.bankLabel}>
                            {item.paymentName}
                          </Text>
                          {/* <Text
                            style={[screenStyles.bankLabel, { marginLeft: 5 }]}>
                            {item.paymentMethod}
                          </Text> */}

                          <View
                            style={{
                              alignItems: 'flex-end',
                              flex: 1,
                            }}>
                            <RadioButton
                              color={colors.activeColor}
                              uncheckedColor={colors.gray}
                              value={item.paymentName}
                              status={
                                checked.paymentName === item.paymentName
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onPress={() => {
                                setChecked(data => ({
                                  ...data,
                                  paymentMethod: item.paymentMethod,
                                  paymentName: item.paymentName,
                                  paymentImage: item.paymentImage,
                                  adminFees: item.adminFees,
                                }));
                              }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}

              {!isTranscationProceed && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 10,
                      justifyContent: 'flex-end',
                    }}>
                    <Text style={screenStyles.textPay}>Pay Before</Text>
                    <Text style={screenStyles.count}>{`${minutes
                      .toString()
                      .padStart(2, '0')}:${second
                        .toString()
                        .padStart(2, '0')}`}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#d4d4d4',
                      borderRadius: 5,
                      backgroundColor: 'white',
                      padding: 14,
                    }}>
                    <View style={{ flex: 2 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          source={{
                            uri: `${Globals.imgBaseURL}${checked?.paymentImage}`,
                          }}
                          style={{ width: 68, height: 18 }}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            fontFamily: fonts.RUBIK_REGULAR,
                            fontSize: Typography.P3,
                            color: colors.headingColor,
                          }}>
                          {checked?.paymentName}{' '}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontFamily: fonts.RUBIK_MEDIUM,
                          fontSize: Typography.P3,
                          color:
                            minutes > 0 || (minutes === 0 && second > 0)
                              ? colors.headingColor
                              : checked?.checkTransactionStatus == '00'
                                ? colors.activeColor
                                : colors.red,
                        }}>
                        {minutes > 0 || (minutes === 0 && second > 0)
                          ? checked.PaymentRefNumber
                          : checked?.checkTransactionStatus == '00'
                            ? 'Transaction success'
                            : 'Transaction failed, please retry..'}
                      </Text>
                    </View>

                    {checked?.checkTransactionStatus !== '00' && (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            // var content = await Clipboard.getString();
                            if (minutes > 0 || (minutes === 0 && second > 0)) {
                              Clipboard.setString(checked?.PaymentRefNumber);
                              ToastAndroid.show(
                                `Transaction number has been copied ${checked.PaymentRefNumber}`,
                                ToastAndroid.SHORT,
                              );
                            } else {
                              //reset time
                              setMinutes(PaymentInterval);
                              getTransactionReqId();
                            }
                          }}>
                          <View
                            style={{
                              borderColor: colors.activeColor,
                              borderWidth: 1,
                              borderStyle: 'dashed',
                              borderRadius: 6,
                              backgroundColor: colors.bannerBlueSecondary,
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              flexDirection: 'row',
                            }}>
                            <SvgIcon
                              type={
                                minutes > 0 || (minutes === 0 && second > 0)
                                  ? IconNames.Copy
                                  : IconNames.RotateRight
                              }
                              width={16}
                              height={16}
                              color={colors.primaryGreenColor}
                            />
                            <Text
                              style={{
                                fontFamily: fonts.RUBIK_MEDIUM,
                                fontSize: Typography.P3,
                                color: colors.activeColor,
                                marginLeft: 6,
                              }}>
                              {minutes > 0 || (minutes === 0 && second > 0)
                                ? 'Copy'
                                : 'Retry'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {modalVisible && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={screenStyles.centeredView}>
                    <View style={screenStyles.modalView}>
                      <Text style={screenStyles.modalTitleText}>Confirm</Text>
                      <Text style={screenStyles.modalSubTitleText}>
                        Are you sure you want to add{' '}
                        <Text
                          style={{
                            color: 'black',
                            fontFamily: fonts.RUBIK_MEDIUM,
                          }}>
                          Rp. {amount} {''}
                        </Text>
                        +{' '}
                        <Text
                          style={{
                            color: 'black',
                            fontFamily: fonts.RUBIK_MEDIUM,
                          }}>
                          Rp. {checked?.adminFees} (admin fee)
                        </Text>{' '}
                        to your wallet?
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: 0.5,
                            marginRight: 4,
                          }}>
                          <AppButton
                            title={'No'}
                            titleStyle={{
                              color: colors.activeColor,
                              fontSize: 13,
                            }}
                            // loader={isLoading}
                            buttonStyle={{
                              backgroundColor: 'white',
                              borderRadius: 6,
                              borderColor: colors.activeColor,
                              borderWidth: 1,
                            }}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                            }}
                          />
                        </View>
                        <View style={{ flex: 0.5, marginLeft: 4 }}>
                          <AppButton
                            title={'Yes'}
                            titleStyle={{ color: 'white', fontSize: 13 }}
                            // loader={isLoading}
                            buttonStyle={{
                              backgroundColor: colors.activeColor,
                              borderRadius: 6,
                              borderWidth: 1,
                              borderColor: colors.activeColor,
                            }}
                            onPress={() => {
                              //call Api for generate ref and check status

                              getTransactionReqId();
                              callApi();
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}

              {checked.paymentName !== '' && isTranscationProceed && (
                <AppButton
                  title={'Pay'}
                  // loader={isLoading}
                  buttonStyle={{
                    backgroundColor: colors.activeColor,
                    borderRadius: 6,
                  }}
                  onPress={() => {
                    setModalVisible(true);
                    //open bottom sheet for confirmation
                    //openBottomSheet()

                    // Alert.alert(
                    //   'Confirm',
                    //   `Are you sure you want to add Rp. ${amount} + Rp. ${checked?.adminFees} (admin fee) to your wallet?`,
                    //   [
                    //     {
                    //       text: 'No',
                    //       onPress: () => console.log('Cancel Pressed'),
                    //       style: 'cancel',
                    //     },
                    //     {
                    //       text: 'Yes',
                    //       onPress: () => {
                    //         setModalVisible(true);
                    //         // props.navigation.navigate(
                    //         //   Routes.SELECT_BANK_FOR_WALLET_TOPUP,
                    //         //   { amt: Number(topUpInputAmt) + 1000 },
                    //         // );
                    //       },
                    //     },
                    //   ],
                    // );
                  }}
                />
              )}
            </View>
          </View>
        );
      }}
    />
  );
};
