import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import AppConfig from '../../../branding/App_config';

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;

export const Styles = function (scheme, colors) {
  return {
    container: {
      flex: 1,
    },

    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: hp('12'),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,

      borderRadius: hp(0.75),
    },

    leftIconContainerStyle: {
      width: hp('6'),
      height: hp('6'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: hp('3'),
      backgroundColor: colors.inputSecondaryBackground,
    },

    leftIcon: {
      width: hp(3),
      height: hp(3),
      resizeMode: 'contain',
    },

    textContainer: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: wp('3'),
    },

    titleText: {
      fontSize: Typography.P6,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.headingColor,
    },

    orderTextStyle: {
      fontSize: Typography.P4,
      fontFamily: Fonts.RUBIK_REGULAR,
      color: colors.headingColor,
    },

    subtitleText: {
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      marginVertical: hp('0.5'),
      color: colors.subHeadingColor,
    },

    PaymentText: {
      marginTop: 3,
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_MEDIUM,
      alignSelf: 'center',
      color: 'gray',
    },

    priceText: {
      fontSize: Typography.P4,
      fontFamily: Fonts.RUBIK_MEDIUM,
      textAlign: 'right',
      alignSelf: 'center',
      color: 'black',
    },

    paymentTypeName: {
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      color: colors.activeColor,
    },

    paymentStatusSuccess: {
      flex: 1,
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      textAlign: 'right',
      color: colors.activeColor,
    },

    paymentStatusFailed: {
      flex: 1,
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      textAlign: 'right',

      color: 'red',
    },

    transactionFirstItem: {
      marginTop: hp(3),
    },

    transactionLastItem: {
      marginBottom: hp(1),
    },

    balanceAmtStyle: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      padding: 0,
      marginTop: 4,
      color: colors.activeColor,
    },
    walletLabel: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: 'gray',
    },
    headerImage: {
      width: 150,
      height: 150,
      //resizeMode: "cover",
    },
    title: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.H8,
      marginTop: hp('0.5'),
      marginBottom: hp('0.5'),
      color: colors.headingColor,
    },
    subTitle: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P2,
      marginTop: hp('0.5'),
      marginBottom: hp('0.5'),
      color: colors.headingColor,
      textAlign: 'center',
    },
  };
};
