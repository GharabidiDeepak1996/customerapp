import React, { useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SvgIcon } from '../SvgIcon/View';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SelectList } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import { View, Text } from 'react-native';
import IconNames from '../../../../branding/carter/assets/IconNames';

const PropTypes = require('prop-types');

const DropDownItem = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);

  //Props
  const [isDropdownShown, setIsDropdownShown] = useState(false); // Set to false to disable the dropdown initially

  const setSelected = props.setSelected || (() => { });
  const save = props.save || 'value';
  const data = props.data;
  const defaultOption = props.defaultOption;
  const backgroundColor =
    props.backgroundColor || globalStyles.primaryInputStyle.backgroundColor;
  const defaultContainerStyle =
    props.defaultContainerStyle ||
    globalStyles.primaryInputStyle.defaultContainerStyle;

  const dropdownStyle = {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'red',
    padding: 8,
  };

  return (
    <SelectList
      {...props}
      setSelected={val => {
        setSelected(val);
      }}
      dropdownShown={false}
      search={false}
      data={data}
      save={save} //"value"
      defaultOption={defaultOption}
      disabledItemStyles={{ color: 'gray', fontStyle: 'italic' }}
      disabledTextStyles={{ color: 'gray', fontStyle: 'italic' }}
      // arrowicon={<SvgIcon
      //   type={IconNames.MapMarkerAlt}
      //   width={20}
      //   height={20}
      //   color={colors.primaryGreenColor}
      // />}

      boxStyles={[
        {
          backgroundColor: backgroundColor,
          width: widthPercentageToDP(90),
          borderColor: '#d4d4d4',
          borderWidth: 1,
          borderRadius: 3,
          padding: 8,
        },
        defaultContainerStyle,

      ]}

      // dropdownStyles={{ height: hp(data?.length * 5), position: 'absolute', zIndex: 1, backgroundColor: 'white', top: 42, width: '100%' }}
      dropdownStyles={{
        height: 180, borderColor: '#d4d4d4',
        borderWidth: 1,
        borderRadius: 5,
        osition: 'relative',
        top: -12
      }}

    />
  );
};

DropDownItem.propTypes = {
  save: PropTypes.string,
  backgroundColor: PropTypes.string,
  data: PropTypes.any,
};

export default DropDownItem;
