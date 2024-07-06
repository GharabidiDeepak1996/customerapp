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
  TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Styles } from './Style';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { RadioButton } from 'react-native-paper';



export const SortByBottomSheet = props => {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  //Internal States for store shop list
  const [checked, setChecked] = useState(props.value);
  const [modalVisible, setModalVisible] = useState(true);

  const MyRadioComponent = () => {
    const handleRadioChange = (value) => {
      // Update the state when a radio button is selected
      setChecked(value);
      props.onSelected(value)
      console.log("sortbybottomsheet------", value)
      const timeoutId = setTimeout(() => {
        // Code to be executed after the delay
        setModalVisible(!props.isVisible);
        props.CloseSortByBottomSheet();
      }, 1000);
      return () => clearTimeout(timeoutId);

    };
    return (
      <View style={{ width: '100%', }}>

        <RadioButton.Group onValueChange={handleRadioChange} value={checked}>
          {/* <RadioButton.Item label="Relevance" value="Relevance" />
          <RadioButton.Item label="New Arrival" value="New Arrival" />
          <RadioButton.Item label="Discount" value="Discount" />
          <RadioButton.Item label="Top Rated" value="Top Rated" />
          <RadioButton.Item label="Delivery Time" value="Delivery Time" /> */}
          <RadioButton.Item label="Price (Low)" value="Price (Low)" />
          <RadioButton.Item label="Price (High)" value="Price (High)" />

        </RadioButton.Group>
      </View>
    );
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible ? true : false}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          //commented
          setModalVisible(!props.isVisible);
          props.CloseSortByBottomSheet();
        }}>
        {/* remaining part blur */}
        <View style={itemStyles.container} />
      </TouchableWithoutFeedback>
      <View
        style={itemStyles.itemsView}>
        <View style={itemStyles.items}>
          <Text style={itemStyles.titleText}>Sort By</Text>
          {/* <Text style={itemStyles.titleText}>X</Text> */}
        </View>
        <MyRadioComponent />

      </View>
    </Modal>
  );
};


