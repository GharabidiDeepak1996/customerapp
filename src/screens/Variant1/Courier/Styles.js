import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import AppConfig from '../../../../branding/App_config';

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (styles, scheme, colors) {
  return {
    mainContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      marginHorizontal: -16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    mainWrapper: {
      flex: 1,
      alignItems: 'center',
      //backgroundColor: scheme === "dark" ? colors.secondaryBackground : colors.secondaryBackground,
      backgroundColor: '#f4f5f9',
    },
    linearGradient: {
      padding: 0,
      width: '100%',
    },
    containerTrackPackage: {
      borderColor: '#d4d4d4',
      borderRadius: 5,
      borderWidth: 1,
      width: '100%',
      padding: 10,
      backgroundColor: colors.primaryGreenColor,
      flex: 1,
      flexDirection: 'row',
      marginBottom: 16,
    },
    linearGradientView: {
      paddingBottom: hp(0.85),
      paddingHorizontal: 10,
      marginHorizontal: 10,
      marginBottom: 10,
    },
    containerEnterTrack: {
      backgroundColor: '#d2d2d2',
      textAlign: 'center',
      textAlignVertical: 'center',
      marginBottom: 4,
      paddingHorizontal: 8,
      fontWeight: '700',
      color: 'black',
      // borderTopLeftRadius: 7,
      // borderBottomLeftRadius: 7,
    },
    itemDetailsContainer: {
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 5,
      backgroundColor: 'white',
      paddingHorizontal: 14,
      paddingTop: 15,
      paddingBottom: 15,
    },

    parentWrapper: {
      // width: styles.gridWidth,
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
      fontSize: Typography.P3,
      color: colors.headingColor,
    },

    sectionHeadingIcon: {
      alignSelf: 'center',
    },

    promotionSliderContainer: {
      width: '100%',
      height: hp('28%'),
      borderRadius: hp(0.75),
      marginTop: -3,
      marginBottom: -10,
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
    },
    item: {
      padding: 0,
      borderRadius: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      elevation: 5,
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
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
      color: 'black',
    },
    modalSubTitleText: {
      marginBottom: hp(1),
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P3,
    },
    modalText: {
      color: colors.activeColor,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },

    headerText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      color: colors.headingColor,
      marginBottom: 4,
    },
    Box: {
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 6,
      backgroundColor: 'white',
      marginBottom: 12,
    },

    BoxContent: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: colors.primaryGreenColor,
    },
    divider: {
      width: '100%',
      borderColor: '#d4d4d4',
      borderTopWidth: 1,
      marginBottom: 8,
    },
    textDis: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P3,
      color: colors.headingColor,
    },
    inputText: {
      borderColor: '#d4d4d4',
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: 'white',
      marginBottom: 8,
    },
    errorInputText: {
      color: 'red',
      marginBottom: 8,
      marginTop: -6,
    },
    textPayment: {
      fontFamily: fonts.RUBIK_REGULAR,
      color: 'black',
    },
    textPaymentHighlight: {
      fontFamily: fonts.RUBIK_MEDIUM,
      color: colors.activeColor,
    },
    subtotalLabelText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.subHeadingColor,
    },
    subtotalValueText: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      flex: 1,
      textAlign: 'right',
      color: colors.subHeadingColor,
    },
    Box1: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },

    totalLabelText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      flex: 0.5,
      color: colors.headingColor,
      marginBottom: 6,
    },
    totalValueText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      flex: 0.5,
      textAlign: 'right',
      color: colors.headingColor,
      marginBottom: 6,
    },
  };
};
