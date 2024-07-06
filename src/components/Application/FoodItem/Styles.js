import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import AppConfig from '../../../../branding/App_config';

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;

export const Styles = function (scheme, colors) {
  return {
    container: {
      // height: hp('15'),
      // backgroundColor:
      //   scheme === 'dark'
      //     ? colors.secondaryBackground
      //     : colors.primaryBackground,
      // flexDirection: 'row',
      // alignItems: 'center',
      // borderRadius: hp(0.75),
      // paddingLeft: wp('5'),
      width: '100%',
      height: hp('18'),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
      borderRadius: hp(0.75),
      marginRight: hp('1'),
      flexDirection: 'row',
      padding: 12,
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 6,
    },

    upperContainer: {
      flexDirection: 'row',
    },

    discountContainer: {
      width: '50%',
    },

    ratingContainerStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputSecondaryBackground,
      height: hp(5.9),
      borderRadius: hp(0.75),
      paddingHorizontal: wp(5),
    },
    discountBanner: {
      backgroundColor: colors.quaternaryBackground,
      height: hp(3),
      borderRadius: hp(0.75),
      width: hp(12),
      alignItems: 'center',
      justifyContent: 'center',
    },

    discountText: {
      color: colors.headingSecondaryColor,
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P7,
    },

    favouriteContainer: {
      width: '50%',
      paddingTop: wp(2),
      paddingEnd: wp(2),
      justifyContent: 'center',
      alignItems: 'flex-end',
    },

    mainContainer: {
      flex: 1,
      alignItems: 'center',
    },

    foodItemImage: {
      // width: '100%',

      // height: hp('13'),

      resizeMode: 'contain',
      width: hp('12'),
      height: hp('12'),
      //marginRight: wp('8'), //===========================
    },

    infoContainer: {
      marginVertical: hp('2'),
    },

    priceText: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P7,
      marginTop: 4,
      textDecorationLine: 'line-through',
    },

    discountPrice: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.subHeadingSecondaryColor,
      fontSize: Typography.P3,
      marginEnd: 10,
    },

    titleText: {
      fontSize: Typography.P3,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.headingColor,
      marginVertical: hp('0.5'),
    },

    weightText: {
      fontSize: Typography.P6,
      color: colors.subHeadingColor,
      fontFamily: Fonts.RUBIK_REGULAR,
    },

    specification: {
      fontSize: Typography.P6,
      color: colors.subHeadingColor,
      fontFamily: Fonts.RUBIK_REGULAR,
    },

    rating: {
      fontSize: Typography.P6,
      color: colors.subHeadingColor,
      fontFamily: Fonts.RUBIK_REGULAR,
      textAlign: 'center',
    },

    quantity: {
      fontSize: Typography.P7,
      color: colors.subHeadingColor,
      fontFamily: Fonts.RUBIK_REGULAR,
      marginTop: 5,
    },

    dots: {
      fontSize: Typography.P7,
      color: 'red',
      fontFamily: Fonts.RUBIK_REGULAR,
      marginTop: 5,
    },
    ratingText: {
      fontSize: Typography.P5,
      color: colors.headingColor,
      fontFamily: Fonts.RUBIK_MEDIUM,
      marginStart: 2,
    },

    bottomContainer: {
      backgroundColor: colors.subHeadingSecondaryColor,
      height: hp('5.5'),
      justifyContent: 'center',
    },

    addToCartButton: {
      //backgroundColor: colors.subHeadingSecondaryColor,
      borderColor: colors.subHeadingSecondaryColor,
      borderWidth: 1,
      height: hp('4.5'),
      justifyContent: 'center',
      paddingHorizontal: 6,
      borderRadius: 8,
      width: hp('18'),
      marginTop: 8,
    },

    addToCartButton: {
      // color: colors.subHeadingColor,
      // fontFamily: Fonts.RUBIK_REGULAR,
      // fontSize: Typography.P4,
      // lineHeight: hp('2.8'),
      //backgroundColor: colors.subHeadingSecondaryColor,
      borderColor: colors.subHeadingSecondaryColor,
      borderWidth: 1,
      height: hp('4.5'),
      justifyContent: 'center',
      paddingHorizontal: 6,
      borderRadius: 8,
      width: hp('18'),
      marginTop: 8,
    },
    disableAddToCartButton: {
      // color: colors.subHeadingColor,
      // fontFamily: Fonts.RUBIK_REGULAR,
      // fontSize: Typography.P4,
      // lineHeight: hp('2.8'),
      backgroundColor: '#eeeeee',
      borderColor: '#eeeeee',
      borderWidth: 1,
      height: hp('4.5'),
      justifyContent: 'center',
      paddingHorizontal: 6,
      borderRadius: 8,
      width: hp('18'),
      marginTop: 8,
    },
    bottomDisableContainer: {
      borderTopColor: colors.borderColorLight,
      width: '100%',
      height: hp('5.5'),
      justifyContent: 'center',
      borderTopWidth: 1,
    },
    subText: {
      fontSize: Typography.P4,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.subHeadingColor,
      marginVertical: hp('0.2'),
      marginLeft: 6,
    },
    addToCartContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },

    addCartText: {
      color: colors.subHeadingSecondaryColor,
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      lineHeight: hp('2.8'),
    },
    addCartDisableText: {
      color: '#C6C6C6',
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      lineHeight: hp('2.8'),
    },

    addCartIcon: {
      marginRight: wp(2),
    },

    cartUpdateContainer: {
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    cartUpdateActionContainer: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.borderColorLight,
      height: '100%',
    },

    cartNumberText: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.headingColor,
    },
  };
};
