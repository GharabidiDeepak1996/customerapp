import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import AppConfig from '../../../branding/App_config';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (styles, colors) {
  return {
    mainContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      marginHorizontal: -16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    // mainContainer: {
    //   flex: 1,
    //   //backgroundColor: colors.headerBackground,
    //   backgroundColor: 'red'
    // },

    flatListContainer: {
      flex: 0.78,
    },

    flatListFirstItemContainer: {
      marginTop: hp(2),
    },
    Box1: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },

    flatListLastItemContainer: {
      marginBottom: hp(2),
    },
    scrollViewContainer: {
      flex: 1,
      //backgroundColor: 'red'
      backgroundColor: colors.secondaryBackground,
    },

    scrollViewContentContainer: {
      flexGrow: 1,
      backgroundColor: colors.secondaryBackground,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      // backgroundColor: 'white',
      // backgroundColor: colors.secondaryBackground,
    },

    bottomContainerParent: {
      flex: 0.6,
      backgroundColor: colors.primaryBackground,
      // backgroundColor: "yellow",

      justifyContent: 'center',

      shadowColor: colors.borderColorLight,
      shadowOffset: {
        width: 0,
        height: -11,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.22,

      elevation: 8,
      borderRadius: 4,
    },

    bottomContainerParentVariant1: {
      paddingBottom: hp(1.8),
    },

    bottomContainer: {
      alignSelf: 'center',
      backgroundColor: colors.primaryBackground,
      //backgroundColor: "green",
      paddingTop: hp('2'),
      width: styles.gridWidth,
    },
    totalContainer: {
      flexDirection: 'row',
    },
    subtotalLabelText: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.subHeadingColor,
    },
    priceText: {
      fontSize: Typography.P4,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.subHeadingSecondaryColor,
    },
    accountErrorText: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: 'red',
      alignSelf: 'center',
      marginLeft: hp(1),
    },
    subtotalValueText: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,

      textAlign: 'right',
      color: colors.subHeadingColor,
    },
    subtotalValueText1: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      flex: 1,
      textAlign: 'right',
      color: 'red',
    },
    totalLabelText: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      flex: 0.5,
      color: colors.headingColor,
    },
    totalValueText: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      flex: 0.5,
      textAlign: 'right',
      color: colors.headingColor,
    },
    horizontalDivider: {
      width: styles.gridWidth,
      height: 1,
      alignSelf: 'center',
      marginBottom: hp('1'),
      backgroundColor: colors.borderColorLight,
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
      paddingHorizontal: hp(2),
      paddingVertical: hp(1),
    },
    modalTitleText: {
      marginBottom: hp(1),
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
      color: 'black',
    },
    modalSubTitleText: {
      marginBottom: hp(1),
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
    },
    modalText: {
      color: colors.activeColor,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    productDetailsContainer: {
      width: '100%',
      borderRadius: 6,
      marginBottom: 3,
      //padding: 8
    },
    productDetailsTitle: {
      // fontFamily: Fonts.RUBIK_MEDIUM,
      // fontSize: Typography.P2,
      // color: colors.subHeadingColor,
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      color: 'black',
    },
    disableInputStyle: {
      backgroundColor: '#f2f2f2',
      padding: 10,
      borderRadius: 8,
      color: '#9F9F9F',
      marginTop: 5,
      borderColor: '#e9e9e9',
      borderWidth: 1,
    },
    productDetailsContainerItems: {
      backgroundColor: 'white',
      width: '100%',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 6,
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 10,
    },
    textPayment: {
      fontFamily: Fonts.RUBIK_REGULAR,
      color: 'black',
    },
    textPaymentHighlight: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.subHeadingSecondaryColor,
    },
    carbonClickSliderStyle: {
      width: '100%',
      height: hp('28%'),
      borderRadius: hp(0.75),
      marginTop: -3,
      marginBottom: -10,
    },

    promotionSliderActiveDot: {
      width: hp(2),
      height: hp(0.8),
      marginRight: -hp(1),
    },

    promotionSliderContainer: {
      width: '100%',
      height: hp('28%'),
      borderRadius: hp(0.75),
      marginTop: -3,
      marginBottom: -10,
    },
  };
};

export default Styles;
