import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import AppConfig from '../../../branding/App_config';

const Typography = AppConfig.typography.default;
const fonts = AppConfig.fonts.default;

export const Styles = function (scheme, colors) {
  return {
    container: {
      flex: 1,
      margin: 0,
    },



    scrollViewContainer: {
      flex: 0.9,
    },

    containerSpacing: {
      marginBottom: hp('1'),
    },

    contentContainer: {
      paddingHorizontal: wp('3'),
      paddingVertical: hp('2'),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
    },

    defaultContainer: {
      flexDirection: 'row',
      marginTop: hp(1),
    },

    defaultText: {
      marginLeft: hp(1),
      alignSelf: 'center',
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.headingColor,
    },

    horizontalInputsContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },

    horizontalInput: {
      flex: 0.48,
    },

    addressFirstItem: {
      marginTop: hp(3),
    },

    addressLastItem: {
      marginBottom: hp(1),
    },

    bottomContainer: {
      flex: 0.1,
      justifyContent: 'center',
    },
    headerImage: {

      width: 150,
      height: 150,
      //resizeMode: "cover",
    },
    title: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.H8,
      marginTop: hp("0.5"),
      marginBottom: hp("0.5"),
      color: colors.headingColor
    },
    subTitle: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P2,
      marginTop: hp("0.5"),
      marginBottom: hp("0.5"),
      color: colors.headingColor,
      textAlign: 'center'
    },
    boxContainer: {
      marginTop: hp("2"),
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'gray',
      backgroundColor: 'white',
      padding: hp(1.5)
    },
    searchContainer: {
      height: hp('6'),
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: hp('2'),

      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'gray',
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
    },
  };
};
