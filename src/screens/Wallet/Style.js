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
      backgroundColor: '#f5f5f5',
      marginHorizontal: -16,
      paddingHorizontal: 16,
    },

    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: hp('12'),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
      paddingHorizontal: wp('5'),
      marginBottom: hp('1'),
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
      fontSize: Typography.P3,
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
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_MEDIUM,

      color: colors.headingColor,
    },

    priceText: {
      flex: 1,
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      textAlign: 'right',
      alignSelf: 'center',
      color: colors.subHeadingSecondaryColor,
    },

    paymentStatusSuccess: {
      flex: 1,
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      textAlign: 'right',

      color: colors.subHeadingSecondaryColor,
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

    balanceViewDown: {
      //   borderBottomLeftRadius: 4,
      //   borderBottomRightRadius: 4,
      borderRadius: 4,
      padding: 10,
      borderColor: 'gray',
      borderWidth: 1,
      backgroundColor: 'white',
    },

    balanceViewUpper: {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      padding: 10,
      borderColor: colors.activeColor,

      backgroundColor: 'white',
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

    AddMoneyLabel: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
      color: 'black',
      marginBottom: 10,
    },

    yourBalanceLabel: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
      color: 'black',
      marginBottom: 10,
    },

    balanceContainer: {
      backgroundColor: 'white',
      borderRadius: 4,
      marginTop: 20,
    },

    topUpContainer: {
      backgroundColor: 'white',
      padding: 10,
      marginTop: 20,
      borderColor: '#d4d4d4',
      borderWidth: 1,
      borderRadius: 4,

    },

    topUpLabel: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P3,
      color: colors.activeColor,
    },

    bankLabel: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,

      color: 'black',
    },

    adminFeeIncludedLabel: {///////////
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P4,
      color: 'black',
    },
    headerSubtitleText: {
      fontSize: Typography.P3,
      fontFamily: Fonts.RUBIK_REGULAR,
      color: 'black'
    },
    finalAmtLabel: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
      textAlign: 'center',
      color: colors.activeColor,
    },
    centeredView: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      width: '100%',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      position: 'absolute',
      bottom: 0,
      padding: hp(3),
      // paddingVertical: hp(1),
    },
    modalTitleText: {
      marginBottom: hp(1),
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P1,
      color: 'black',
    },
    modalSubTitleText: {
      marginBottom: hp(2),
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P2,

    },
    modalText: {
      color: colors.activeColor,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    textPay: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P3,
      color: colors.headingColor,
    },
    count: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P3,
      color: colors.white,
      backgroundColor: 'red',
      marginLeft: 6,
      paddingHorizontal: 6,
      borderRadius: 8,
      alignSelf: 'center',
    }
  };
};
