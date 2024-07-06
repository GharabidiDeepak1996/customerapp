import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import Modal from 'react-native-modal';

const FlexibleBottomSheetModal = ({isVisible, closeModal}) => {
  const [modalHeight, setModalHeight] = useState(500); // Initial height, adjust as needed

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      swipeDirection={['down']}
      style={{margin: 0}}>
      <View style={{flex: 1, justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: modalHeight,
          }}>
          <Text>Your Modal Content Goes Here</Text>
          <TouchableOpacity
          //onPress={() => setModalHeight(modalHeight === 300 ? 500 : 500)}
          >
            <Text>Toggle Height</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FlexibleBottomSheetModal;
