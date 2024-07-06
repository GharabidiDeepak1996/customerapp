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
  Alert
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Styles } from './Style';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { CheckBox } from 'react-native-elements';




export const SortByBottomSheet = props => {
  const [modalVisible, setModalVisible] = useState(true);
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  //Internal States for store shop list
  const [shopList, setShopList] = useState([]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible ? true : false}

      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      {/* {storeList.map((item, key) => {
          return <StoreList key={key} item={item} setModalVisible={setModalVisible} cartCount={cartCount} colors={colors} itemStyles={itemStyles} _cartCountChange={_cartCountChange} handleAddToCart={handleAddToCart} isEnabled={props.isEnabled} CloseStoreBottonSheet={props.CloseStoreBottonSheet} />

        })} */}
      <View
        style={{
          flex: 1,
          // justifyContent: 'center',
          //alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          // paddingTop: heightPercentageToDP(70)
        }}>
        <View style={styles.centeredView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: 200, width: widthPercentageToDP(100) }}>

            <CheckBox
              center
              title='Click Here'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={true}
            />


          </ScrollView>
          <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!props.productList);
                props.CloseStoreBottonSheet();
              }}>
              <Text style={itemStyles.addCartText}>{'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
