import React from 'react';
import {
  ImageBackground,
  TouchableOpacityBase,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';

import { Text } from 'react-native-elements';
import Styles from './Styles';
import Routes from '../../../navigation/Routes';
import { SvgIcon } from '../SvgIcon/View';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Globals from '../../../utils/Globals';

export const CategoryItem = props => {
  //Props
  const {
    primaryTitle,
    primaryColor,
    secondaryTitle,
    secondaryColor,
    iconBgColor,
    iconURI,
    bgURI,
    imgURL,
    categoryId,
    categoryTypeId,
  } = props;

  return (
    <TouchableOpacity
      onPress={() => {
        //Add condition for grocery and food. 1 for grocery and 2 for food

        if (categoryTypeId == 1 || categoryTypeId == 5) {
          props.navigation.navigate(Routes.GROCERY_PRODUCT, {
            category: primaryTitle,
            categoryTypeId: categoryTypeId,
            categoryId: categoryId, //particular item id
          });
        } else if (categoryTypeId == 2) {
          props.navigation.navigate(Routes.FOOD_PRODUCT, {
            category: primaryTitle,
            categoryTypeId: categoryTypeId,
            categoryId: categoryId, //particular item id
          });
        }
      }}>
      <View style={Styles.categoryItemContainer}>
        <ImageBackground
          source={{
            uri: `${Globals.imgBaseURL}/${imgURL}`,
          }}
          style={Styles.backgroundContainer}
          imageStyle={Styles.backgroundImageStyle}
          resizeMode={'cover'}></ImageBackground>
      </View>
    </TouchableOpacity>
  );
};
