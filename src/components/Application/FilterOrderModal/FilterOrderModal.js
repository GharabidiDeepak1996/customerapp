import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  PanResponder,
  Animated,
  useColorScheme,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import styll from '../../../screens/Variant1/Profile/Styles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {AuthService} from '../../../apis/services';
import IconNames from '../../../../branding/carter/assets/IconNames';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import {SvgIcon} from '../SvgIcon/View';
import {Picker} from '@react-native-picker/picker';
import AppButton from '../AppButton/View';
import {LocalStorageGet, LocalStorageSet} from '../../../localStorage';
import Routes from '../../../navigation/Routes';
export function FilterOrderModal() {
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {t, i18n} = useTranslation();
  const [province, setProvince] = useState([]);
  const [province1, setProvince1] = useState([]);
  const {colors} = useTheme();
  const scheme = useColorScheme();
  const [data, setData] = useState({});

  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const [selectedOption, setSelectedOption] = useState('');

  const options = ['Mart', 'Food', 'Send', 'Ride'];

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, {dy: pan.y}], {useNativeDriver: false})(
            _, // Update pan.y with the gesture
            gestureState,
          );
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          navigation.goBack();
        } else {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const backgroundColor = pan.y.interpolate({
    inputRange: [0, 3], // Adjust the range based on your needs
    outputRange: ['rgba(64, 64, 64, 0.7)', 'rgba(64, 64, 64, 0)'],
    extrapolate: 'clamp',
  });

  useFocusEffect(
    React.useCallback(() => {
      // Check if pickUp data exists in LocalStorage
      (async () => {
        let filter = await LocalStorageGet('filterText');
        if (filter) {
          setSelectedOption(filter);
        }
      })();
    }, []),
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor,
        transform: pan.getTranslateTransform(),
      }}
      {...panResponder.panHandlers}>
      <View
        style={{
          height: '39%',
          width: '100%',
          backgroundColor: '#fff',
          justifyContent: 'center',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  width: 50,
                  height: 5,
                  borderRadius: 10,
                  backgroundColor: '#eee',
                }}
              />
            </TouchableOpacity>
            <View style={{padding: 20}}>
              {options.map((option, index) => (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedOption(prevOption =>
                      prevOption === option ? '' : option,
                    )
                  }
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <Text style={{fontSize: 18}}>{option}</Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 1,
                      marginLeft: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {selectedOption === option && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: colors.activeColor,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <View
                style={{
                  height: heightPercentageToDP(3),
                  marginTop: 20,
                }}>
                <AppButton
                  title={'Apply Filters'}
                  buttonStyle={{
                    height: heightPercentageToDP(6),
                    backgroundColor: colors.activeColor,
                  }}
                  onPress={async () => {
                    console.log('selectedOption==>', selectedOption);
                    await LocalStorageSet('filterText', selectedOption);
                    navigation.navigate(Routes.MY_ORDERS);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
