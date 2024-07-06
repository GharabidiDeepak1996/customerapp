import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppConfig from '../../../../branding/App_config';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (styles, colors) {
  return {
    scrollViewContainer: {
      flex: 1,
      backgroundColor: colors.secondaryBackground,
    },

    scrollViewContentContainer: {
      flexGrow: 1,
      backgroundColor: colors.secondaryBackground,
    },

    headerContainer: {
      flex: 1,
      top: -1,
    },

    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      justifyContent: 'center',
    },

    headerImage: {
      flex: 1,
      width: wp(100),
      height: '100%',
      resizeMode: 'cover',
    },

    bottomContainer: {
      width: styles.gridWidth3,
      paddingVertical: hp('2'),
      justifyContent: 'flex-end',
      //borderWidth: 0.5,
      borderRadius: 7,
      //borderColor: 'black',
      backgroundColor: 'white',
      elevation: 8,
      paddingHorizontal: hp(2),
      marginTop: hp(2),
    },

    titleText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.H9,

      color: colors.headingColor,
    },

    subtitleText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      lineHeight: Typography.H8,
      marginBottom: hp('3'),
      color: colors.subHeadingColor,
    },

    forgotPasswordContainer: {
      flexDirection: 'row',
      marginBottom: hp(1),
    },

    accountBottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,

      justifyContent: 'space-between',
      marginBottom: 10,
    },

    accountText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: colors.subHeadingColor,
      alignSelf: 'center',
      marginBottom: hp(0.5),
    },
    inputLabel: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: colors.subHeadingColor,
      alignSelf: 'center',
      marginBottom: hp(0.5),
    },
    accountText1: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P7,
      color: colors.subHeadingColor,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },

    accountErrorText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: 'red',
      alignSelf: 'center',
      marginBottom: 6,
      // top: -8
      //marginLeft: hp(0.5),
    },

    signupButton: {
      backgroundColor: colors.buttonBackground,
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P6,
      //fontSize: 13,
      paddingHorizontal: wp(8),
      borderRadius: 7,

      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },

    switchContainer: {
      justifyContent: 'center',
      marginRight: 6,
    },

    forgotPasswordButtonContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },

    forgotPasswordButton: {
      //color: colors.subHeadingQuaternaryColor,
      color: colors.buttonBackground,
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P7,
    },

    imageContainer: {
      //flex: 1,
      width: wp(80),
      height: hp(15),
      resizeMode: 'contain',
    },

    poweredbyContainer: {
      // width: 250,
      // height: 130,
      // resizeMode: 'cover',

      //flex: 1,
      width: 20,
      height: 10,
      // resizeMode: 'cover',
    },

    viewContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(1),
    },
    googleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.5,
      borderRadius: 7,
      borderColor: 'black',
      marginTop: hp(6),
      paddingVertical: hp(1),
      paddingHorizontal: wp(6),
    },
  };
};
