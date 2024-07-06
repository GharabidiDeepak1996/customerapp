import React, { useState } from 'react';

import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { Styles } from './Styles';
import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../navigation/Routes';

export const SearchButton = props => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const showFilter = props?.showFilter || false
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  // State to manage the search input
  const [searchQuery, setSearchQuery] = useState('');

  //   // Function to handle the search action (you can customize this)
  //   const handleSearch = () => {
  //     props.onSearch(searchQuery);

  //     // Example: Navigate to a search results screen with the search query
  //     // props.navigation.navigate('SearchResults', {query: searchQuery});
  //   };

  return (
    //////////////////////////////start////////////////////////////////
    <View style={screenStyles.buttonContainer}>
      <SvgIcon
        type={IconNames.Search}
        width={20}
        height={20}
        color={colors.inputColor}
        style={screenStyles.leftIcon}
      />
      <TextInput

        numberOfLines={1}
        style={screenStyles.Text}
        // placeholder={`${t('Dishes')}, ${t('Restaurants')}, ${t(
        //   'Groceries',
        // )} & ${t('More')}`}
        placeholder={t(props.placeholder)}
        value={searchQuery}
        onChangeText={text => {
          setSearchQuery(text);
          props.onSearch(text);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(Routes.filterOrder)
        }}
        style={{ width: 50, height: 18 }}
      >
        {showFilter &&
          <SvgIcon
            type={IconNames.SlidersH}
            width={20}
            height={20}
            color={colors.inputColor}
            style={screenStyles.rightIcon}

          />
        }
      </TouchableOpacity>

    </View>
  );
};

{
  /* //////////////////////////////End////////////////////////////// */
}

{
  /* <Text style={screenStyles.Text}>Dishes,restaurants,groceries & more</Text> */
}

{
  /* <SvgIcon
        type={IconNames.SlidersH}
        width={20}
        height={20}
        color={colors.inputColor}
        style={screenStyles.rightIcon}
      /> */
}

{
  /* Trigger search action when the user presses the button */
}
{
  /* <TouchableOpacity onPress={handleSearch}>
        <SvgIcon
          type={IconNames.SlidersH}
          width={20}
          height={20}
          color={colors.inputColor}
          style={screenStyles.rightIcon}
        />
      </TouchableOpacity> */
}
