import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppConfig from '../../../../branding/App_config';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (scheme, colors) {
  return {
    swipeableContainer: {
      //marginVertical: hp('0.5'),
    },
    foodItemContainer: {
      //height: hp('16'),

      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
      flexDirection: 'row',
      alignItems: 'center',
      // borderRadius: hp(0.75),
      paddingLeft: wp('5'),
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 6

    },
    foodItemImage: {
      width: hp('10'),
      height: hp('10'),
      marginRight: wp('2'),
    },
    priceText: {
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.subHeadingSecondaryColor,
    },
    priceText1: {
      fontSize: Typography.P3,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.subHeadingSecondaryColor,
    },
    dimensionText: {
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: "#808080",
    },
    boxText: {
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: '#808080',
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(0.5)
    },
    ratingText: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.headingColor,
      marginRight: wp(1)
    },
    ratingActiveColor: "#FF9C00",
    ratingInActiveColor: "#D8E9A8",
    itemTitle: {
      fontSize: Typography.P3,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.headingColor,
      marginVertical: hp(0.5),
    },
    weightText: {
      color: colors.subHeadingColor,
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
    },
    rightSwipeContainer: {
      width: wp('20'),
      height: '100%',
      marginLeft: hp('1'),
      backgroundColor: colors.rightSwipeBackground,
      borderRadius: hp(0.75),
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
};
