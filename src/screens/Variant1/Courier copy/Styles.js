import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

    parentWrapper: {
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
      height: hp('28%'),
      borderRadius: hp(0.75),
      marginBottom: hp(1),
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
      marginBottom: 4
    },
    Box: {
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 6,

      backgroundColor: 'white',
      marginBottom: 12,
      padding: 12
    },
    innerBox: {
      padding: 10,
      borderRadius: 4,

      borderColor: '#d4d4d4',
      borderWidth: 1,
      flexDirection: 'row',
    },
    innerBox1: {
      padding: 10,
      borderRadius: 4,

      borderColor: '#d4d4d4',
      borderWidth: 1,
    },
    textLoc: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 4
    },
    textDis: {
      fontFamily: fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.headingColor,
    },
    mapContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderBottomColor: '#d4d4d4',
      borderEndColor: '#d4d4d4',
      borderStartColor: '#d4d4d4',
      borderTopColor: 'white',
      paddingHorizontal: 12,
      justifyContent: 'space-between',
    },
    inputText: {
      borderColor: '#d4d4d4',
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: 'white',

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
      color: colors.subHeadingSecondaryColor,
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
      marginBottom: 6
    },
    totalValueText: {
      fontFamily: fonts.RUBIK_MEDIUM,
      fontSize: Typography.P2,
      flex: 0.5,
      textAlign: 'right',
      color: colors.headingColor,
      marginBottom: 6
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
    divider: {
      width: '100%',
      borderColor: '#d4d4d4',
      borderTopWidth: 1,
      marginBottom: 8
    },
  };
};
