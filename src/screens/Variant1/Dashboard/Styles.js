import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import AppConfig from '../../../../branding/App_config';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (styles, scheme, colors) {
  return {
    mainWrapper: {
      // flex: 1,
      // alignItems: 'center',
      paddingHorizontal: hp(2),

      backgroundColor: 'white',
      // backgroundColor:
      //   scheme === 'dark'
      //     ? colors.secondaryBackground
      //     : colors.secondaryBackground,

      //backgroundColor: '#f4f5f9',
      //backgroundColor:"#faf1f0"
    },

    deliverInStyle: {
      // backgroundColor: colors.primaryGreenColor,
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 20,
    },

    deliveryText: {
      fontSize: Typography.P3,
      fontFamily: fonts.RUBIK_MEDIUM,
      color: 'white',
      marginStart: 5,
      marginBottom: hp(0.75),
    },

    parentWrapper: {
      flex: 1,
      width: styles.gridWidth,
      alignSelf: 'center',
    },

    sectionContainer: {
      width: styles.gridWidth,
      alignItems: 'center',
      marginBottom: hp(1),
    },

    sectionHeading: {
      width: styles.gridWidth,
      flexDirection: 'row',
      alignItem: 'center',
      justifyContent: 'space-between',
      paddingVertical: hp('1'),
      marginVertical: hp('1'),
    },

    sectionHeadingText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      color: colors.headingColor,
    },

    sectionHeadingIcon: {
      alignSelf: 'center',
    },

    promotionSliderContainer: {
      width: '100%',
      height: hp('25%'),
      borderRadius: hp(0.75),
      marginBottom: hp(1),
    },

    newServicesLabels: {
      textAlign: 'center',
      fontSize: 11,
      marginTop: 3,
      color: 'black',
    },

    newServicesBorder: {
      borderColor: '#444',
      borderWidth: 0.5,
      padding: 12,
      borderRadius: 5,
    },

    promotionSliderActiveDot: {
      width: hp(2),
      height: hp(0.8),
      marginRight: -hp(1),
    },

    promotionSliderInActiveDot: {
      width: hp(0.8),
      height: hp(0.8),
    },

    promotionPaginationContainer: {
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
    },

    foodLastItems: {
      marginBottom: hp(2),
      marginStart: 0,
    },
    item: {
      borderRadius: 15,
    },
    buttonStyle: {
      backgroundColor: '#1b8346',
      color: 'white',
      alignItems: 'center',
      borderRadius: 25,
      marginVertical: 10,
      width: '45%',
      paddingVertical: 0,
    },
    buttonTextStyle: {
      color: 'white',
      paddingVertical: 7,
      fontSize: 13,
      fontWeight: 'bold',
    },
    deliverInBtnStyle: {
      backgroundColor: 'white',
      borderColor: 'white',
      borderRadius: 25,
      borderWidth: 1,
    },
  };
};
