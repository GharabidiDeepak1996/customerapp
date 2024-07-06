import React from 'react';
import {Animated, TouchableOpacity, useColorScheme, View} from 'react-native';

import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import AppConfig from '../../../../branding/App_config';
import {Styles} from './Style';
import Easing from 'react-native/Libraries/Animated/Easing';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useTheme} from '@react-navigation/native';
import {SvgIcon} from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';

export const CustomDropDown = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const itemStyles = Styles(scheme, colors);

  return (
    <View>
      <Text>hh</Text>
    </View>
  );
};
