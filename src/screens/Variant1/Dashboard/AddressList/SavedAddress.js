import React, { useEffect, useState } from 'react';
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
import { useTheme } from '@react-navigation/native';
import { Styles } from './Style';
import { ScrollView, TouchableWithoutFeedback } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import IconNames from '../../../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../../../components/Application/SvgIcon/View';
import AppConfig from '../../../../../branding/App_config';
const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
import { useDispatch, useSelector } from 'react-redux';
import {
  setDefaultAddress,
  setDefaultAddressTitle,
  setDefaultSubDistrictId,
  setDeliveryAddress,
  setDeliveryAddressId,
  setDeliveryLat,
  setDeliveryLng,
  setLat,
  setLng,
} from '../../../../redux/features/Address/DefaultAddressSlice';
import AppButton from '../../../../components/Application/AppButton/View';
import Routes from '../../../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from '../../../../utils/Globals';
import { t } from 'i18next';

const baseUrl = Globals.baseUrl; // Replace with your actual base URL
const api = 'customer'; // Replace with your actual API endpoint

// Construct the full URL
const apiUrl = `${baseUrl}/${api}/Address/30032`;

export const SavedAddressList = props => {
  const [modalVisible, setModalVisible] = useState(true);
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();
  const navigation = props.navigation;

  const Item = ({ addressTitle, subAddress, onPress }) => (
    <View>
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View
          style={{
            width: '100%',
            borderRadius: 7,
            backgroundColor: 'white',
            justifyContent: 'center',
          }}>
          <View style={{ flex: 1, margin: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <SvgIcon
                type={IconNames.MapMarkerAlt}
                width={22}
                height={22}
                color={colors.primaryGreenColor}
              />

              <Text
                style={{
                  fontFamily: fonts.RUBIK_MEDIUM,
                  fontSize: Typography.P2,
                  marginStart: 5,
                  color: colors.headingColor,
                }}>
                {addressTitle}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fonts.RUBIK_REGULAR,
                fontSize: Typography.P3,
                marginStart: 5,
                marginTop: 10,
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
          //pop
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    console.log('GetAddress-From-SavedAddressList');
    getAddress();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible ? true : false}
      onRequestClose={() => {
        //  Alert.alert('Modal has been closed.');
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
            <Text
              style={{
                fontFamily: fonts.RUBIK_MEDIUM,
                fontSize: Typography.P2,
                marginBottom: 10,
                color: colors.headingColor,
              }}>
              {t('Choose Delivery Address')}
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ height: 400, width: widthPercentageToDP(100) }}>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data}
                  ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor: 'white', height: 2 }} />
                  )}
                  style={{ marginTop: 0, marginBottom: 0 }}
                  keyExtractor={(item, index) => {
                    return item.addressId;
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        {item.savedAddress && (
                          <Item
                            addressTitle={item.title}
                            subAddress={item.mapAddress}
                            // description={item.description}
                            // icons={item.icons}
                            //imgURL = {item.imageUrl}
                            onPress={() => {
                              setModalVisible(false);

                              navigation.pop();
                              //props.CloseStoreBottonSheet();
                              //setAddress(item.address2);

                              try {
                                // dispatch(setDeliveryAddress(item.mapAddress));

                                dispatch(setDeliveryAddress(item.mapAddress + item.landmark + item.postalCode,),);
                                dispatch(setDeliveryAddressId(item.addressId));
                                dispatch(setDeliveryLat(item.latitude));
                                dispatch(setDeliveryLng(item.longitude));
                                dispatch(setDefaultSubDistrictId(item.subDistrictId),);

                                console.log("savesAddressssssssssss", item.latitude + "--------" + item.longitude)

                                // dispatch(
                                //   setDefaultAddress(
                                //     item.address1 + ', ' + item.address2,
                                //   ),
                                // ); //call api
                                // dispatch(setDefaultAddressTitle(item.title));
                                // dispatch(setLat(item.latitude));
                                // dispatch(setLng(item.longitude));
                              } catch (error) {
                                console.log('Error in handleRegister:', error);
                              }
                            }}
                          />
                        )}
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>

            <View style={{ width: '100%' }}>
              <AppButton
                title={'Add new address'}
                onPress={() => {
                  setModalVisible(false);
                  navigation.pop();
                  //  props.CloseStoreBottonSheet();
                  // navigation.navigate(Routes.DASHBOARD_VARIENT_1);
                  navigation.navigate(Routes.PLACES_AUTO_COMPLETE, {
                    isNew: false,
                    isFromPlaceOrder: true,
                    isdefault: false,
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
