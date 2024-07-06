import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  useColorScheme,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Styles} from './Style';
import {ScrollView, TouchableWithoutFeedback} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {CheckBox} from 'react-native-elements';
import axios from 'axios';
import IconNames from '../../../../../branding/carter/assets/IconNames';
import {SvgIcon} from '../../../../components/Application/SvgIcon/View';
import AppConfig from '../../../../../branding/App_config';
const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
import {useDispatch, useSelector} from 'react-redux';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  setDefaultAddress,
  setDefaultAddressTitle,
  setLat,
  setLng,
  setDefaultAddressID,
  setDefaultSubDistrictId,
  setDeliveryLng,
  setDeliveryLat,
} from '../../../../redux/features/Address/DefaultAddressSlice';
import AppButton from '../../../../components/Application/AppButton/View';
import Routes from '../../../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from '../../../../utils/Globals';
import {t} from 'i18next';
import assets from '../../../../../branding/carter/assets/Assets';

const baseUrl = Globals.baseUrl; // Replace with your actual base URL

export const AddressListSheet = props => {
  const [modalVisible, setModalVisible] = useState(true);
  const {colors} = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();
  const navigation = props.navigation;

  const Item = ({addressTitle, subAddress, onPress}) => (
    <View>
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View
          style={{
            borderRadius: 7,
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: 12,
            marginLeft: 8,
            marginRight: 8,
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <SvgIcon
                type={IconNames.MapMarkerAlt}
                width={14}
                height={14}
                color={colors.primaryGreenColor}
              />

              <Text
                style={{
                  fontFamily: fonts.RUBIK_MEDIUM,
                  fontSize: Typography.P2,
                  marginStart: 3,
                  color: colors.headingColor,
                }}>
                {addressTitle}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fonts.RUBIK_REGULAR,
                fontSize: Typography.P3,
                color: colors.headingColor,
              }}>
              {subAddress}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const getAddress = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    const userId = JSON.parse(getUserId);

    const apiUrl = `${baseUrl}/Address/${userId}`;
    console.log('=================', apiUrl);
    axios
      .get(apiUrl)
      .then(response => {
        console.log('=================', response.data);

        if (response.data.isSuccess) {
          console.log('payloaddd:', response.data.payload);
          setData(response.data.payload);
        } else {
          // ToastAndroid.show('Please add new Address', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible ? true : false}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
      }}>
      {/* {storeList.map((item, key) => {
          return <StoreList key={key} item={item} setModalVisible={setModalVisible} cartCount={cartCount} colors={colors} itemStyles={itemStyles} _cartCountChange={_cartCountChange} handleAddToCart={handleAddToCart} isEnabled={props.isEnabled} CloseStoreBottonSheet={props.CloseStoreBottonSheet} />

        })} */}
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(false);
          navigation.pop();
          //commented
          // setModalVisible(!props.productList);
          // props.CloseStoreBottonSheet();
        }}>
        <View
          style={{
            flex: 1,
            // justifyContent: 'center',
            //alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            // paddingTop: heightPercentageToDP(70)
          }}>
          <View style={styles.centeredView}>
            <View style={{
              flexDirection: 'row',
              width: '100%', flex: 1
            }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: fonts.RUBIK_MEDIUM,
                    fontSize: Typography.P2,
                    marginBottom: 10,
                    color: colors.headingColor,
                  }}>
                  {t('Choose Delivery Address')}
                </Text>
              </View>


              <SvgIcon
                type={IconNames.Close}
                width={20}
                height={20}
                color={colors.activeColor}
              />

            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{height: 400, width: widthPercentageToDP(100)}}>
              <View>
                {data.length == 0 ? (
                  <View style={{marginTop: hp('6')}}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 6,
                      }}>
                      <Image
                        source={assets.no_address}
                        style={{
                          width: 150,
                          height: 150,
                        }}
                      />

                      <Text
                        style={{
                          fontFamily: fonts.RUBIK_MEDIUM,
                          fontSize: Typography.H8,
                          marginTop: hp('0.5'),
                          marginBottom: hp('0.5'),
                          color: colors.headingColor,
                        }}>
                        No Address
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.RUBIK_REGULAR,
                          fontSize: Typography.P2,
                          marginTop: hp('0.5'),
                          marginBottom: hp('0.5'),
                          color: colors.headingColor,
                          textAlign: 'center',
                        }}>
                        Oops, it looks like you haven't entered your address
                        yet. Please add your delivery address to proceed.
                      </Text>
                    </View>
                    {/* <Text style={{ textAlign: 'center' }}>No Address</Text>
                    <Text style={{ textAlign: 'center' }}>
                      Oops, it looks like you haven't entered your address yet.
                      Please add your delivery address to proceed.
                    </Text> */}
                  </View>
                ) : (
                  <View>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={data}
                      ItemSeparatorComponent={() => (
                        <View style={{backgroundColor: 'white', height: 2}} />
                      )}
                      style={{marginTop: 0, marginBottom: 0}}
                      keyExtractor={(item, index) => {
                        return item.addressId;
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <View>
                            {item.savedAddress && (
                              <Item
                                addressTitle={item.title}
                                subAddress={
                                  item.address1 +
                                  ', ' +
                                  item.address2 +
                                  ', ' +
                                  item.mapAddress
                                }
                                // description={item.description}
                                // icons={item.icons}
                                //imgURL = {item.imageUrl}
                                onPress={() => {
                                  setModalVisible(false);
                                  console.log(
                                    'ADDADDRESSLISTSHEETT+=================',
                                  );
                                  navigation.pop();
                                  //props.CloseStoreBottonSheet();
                                  setAddress(
                                    item.address1 +
                                      ', ' +
                                      item.address2 +
                                      ', ' +
                                      item.mapAddress,
                                  );

                                  try {
                                    dispatch(
                                      setDefaultAddress(
                                        item.address1 +
                                          ' ' +
                                          item.address2 +
                                          ' ' +
                                          item.mapAddress +
                                          ' ' +
                                          item.landmark +
                                          ' ' +
                                          item.postalCode,
                                      ),
                                    ); //call api
                                    dispatch(
                                      setDefaultAddressTitle(item.title),
                                    );
                                    dispatch(setLat(item.latitude));
                                    dispatch(
                                      setDefaultAddressID(item.addressId),
                                    );
                                    dispatch(setLng(item.longitude));
                                    dispatch(
                                      setDefaultSubDistrictId(
                                        item.subDistrictId,
                                      ),
                                    );

                                    dispatch(setDeliveryLng(item.longitude));
                                    dispatch(setDeliveryLat(item.latitude));
                                    console.log(
                                      'addressdetailsss--------reduxset-------',
                                      item.subDistrictId,
                                      item.longitude,
                                      item.latitude,
                                      item.addressId,
                                    );
                                  } catch (error) {
                                    console.log(
                                      'Error in handleRegister:',
                                      error,
                                    );
                                  }
                                }}
                              />
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={{width: '100%'}}>
              <AppButton
                title={t('Add Address')}
                onPress={() => {
                  setModalVisible(false);
                  navigation.pop();
                  //  props.CloseStoreBottonSheet();
                  // navigation.navigate(Routes.DASHBOARD_VARIENT_1);
                  navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
                    isNew: true,
                    isDefault: false,
                    isFromServiceLocation: false,
                    isFromSend: false,
                  });
                }}
              />
            </View>
            {/* <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!props.productList);
                props.CloseStoreBottonSheet();
              }}>
              <Text style={itemStyles.addCartText}>{'Close'}</Text>
            </TouchableOpacity>
          </View> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 12,
    //flex: 1
    // height: heightPercentageToDP(40),
  },
});
