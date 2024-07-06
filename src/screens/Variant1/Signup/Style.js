import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppConfig from '../../../../branding/App_config';

const fonts = AppConfig.fonts.default;
const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (styles, colors) {
  return {
    mainContainer: {
      flex: 1,
      //backgroundColor: 'yellow'
    },
    parentContainer: {
      flex: 0.9,
      marginTop: hp(3),
    },

    bottomButton: {
      flex: 0.1,
      justifyContent: 'center',
    },

    defaultText: {
      marginLeft: hp(1),
      alignSelf: 'center',
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.headingColor,
    },

    switchContainer: {
      flexDirection: 'row',
      marginTop: hp(1),
    },

    scrollViewContainer: {
      flex: 1,
      //backgroundColor: colors.secondaryBackground,
    },

    scrollViewContentContainer: {
      flexGrow: 1,
      //backgroundColor: colors.secondaryBackground,
    },

    container: {
      flex: 1,
      alignItems: 'center',
      // backgroundColor: colors.secondaryBackground,
    },

    headerContainer: {
      flex: 1,
      top: -1,
    },

    headerImage: {
      flex: 1,
      width: wp(100),
      height: '100%',
      resizeMode: 'cover',
    },

    bottomContainer: {
      width: styles.gridWidth3,
      paddingVertical: hp('3'),
      justifyContent: 'flex-end',
    },

    titleText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.H8,
      marginBottom: hp('0.5'),
      color: colors.headingColor,
    },

    subtitleText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      marginBottom: hp('3'),
      color: colors.subHeadingColor,
    },

    accountBottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    accountText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: colors.subHeadingColor,
    },
    inputLabel: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: colors.subHeadingColor,
      alignSelf: 'center',
      marginBottom: hp(0.5),
    },

    callingCode: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
      color: colors.headingColor,
      marginRight: wp(2),
    },

    leftContainer: {
      //width: "25%",
      //borderRightColor: colors.borderColorLight,
      // borderRightWidth: 1,
      //  borderTopLeftRadius: hp(0.75),
      //  borderBottomLeftRadius: hp(0.75),
      height: 44,
      borderRadius: hp(0.75),
      borderWidth: 1,
      borderColor: '#d4d4d4',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 6,
    },

    accountErrorText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: 'red',
      alignSelf: 'center',
      marginBottom: 6,
      //marginLeft: hp(1),
    },

    passwordInputContainer: {
      marginBottom: hp(1),
    },

    loginButton: {
      color: colors.activeColor,
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P4,
    },
  };
};
