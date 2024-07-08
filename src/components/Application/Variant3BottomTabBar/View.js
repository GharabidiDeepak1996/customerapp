import React from 'react';
import {
  TouchableOpacity,
  useColorScheme,
  View,
  Text,
  ToastAndroid,
} from 'react-native';
import {Styles} from './Style';
import Globals from '../../../utils/Globals';
import {useTheme} from '@react-navigation/native';
import {commonDarkStyles} from '../../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../../branding/carter/styles/light/Style';
import {SvgIcon} from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';

const Variant3BottomTabBar = ({state, descriptors, navigation}) => {
  // Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  const iconMap = [
    {icon: IconNames.HomeAlt, label: 'Home'},
    {icon: IconNames.Grocery, label: 'Mart'},
    {icon: IconNames.Food, label: 'Food'},
    {icon: IconNames.Fish, label: 'Fresh'},
    {icon: IconNames.Courier, label: 'Send'},
    {icon: IconNames.taxibike, label: 'Ride'},
    {icon: IconNames.CircleUser, label: 'Account'},
  ];

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={screenStyles.container}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              switch (route.name) {
                case 'Grocery':
                case 'Food':
                case 'Ride':
                  ToastAndroid.show('Coming Soon', ToastAndroid.SHORT);
                  break;
                case 'Fresh Goods':
                  ToastAndroid.show('Coming Soon', ToastAndroid.SHORT);
                  break;
                default:
                  navigation.navigate(route.name);
              }
            }
          };

          const {icon, label} = iconMap[index] || {};

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.8}
              onPress={onPress}
              style={[
                screenStyles.bottomTabContainer,
                {
                  shadowColor: 'black',
                  shadowRadius: 15,
                  borderTopColor: '#dfdfdf',
                  borderTopWidth: 1,
                  shadowOpacity: 1,
                  elevation: 10,
                },
              ]}>
              <View style={screenStyles.bottomTabItemContainer}>
                <SvgIcon
                  type={icon}
                  width={20}
                  height={25}
                  color={isFocused ? colors.primaryGreenColor : '#8b8b8b'}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: isFocused ? '500' : '400',
                  color: isFocused ? colors.primaryGreenColor : '#8b8b8b',
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Variant3BottomTabBar;
