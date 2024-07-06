import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {StatusBar} from 'react-native';
import AppConfig from '../../../../branding/App_config';
import {color} from 'react-native-reanimated';
import colors from '../../../../branding/carter/styles/dark/Colors';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (scheme, colors) {
  return {
    headerContainer: {
      height: hp('13'),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: wp('5'),
      borderRadius: hp(0.75),
    },

    ordersListFirstItem: {
      marginTop: hp(3),
    },

    headerContainerActive: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColorLight,
    },

    headerLeftIconContainer: {
      width: hp('7'),
      height: hp('7'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: hp('3.5'),
      backgroundColor: colors.bannerLightBlue,
      marginRight: wp(3),
    },

    itemsHorizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    headerTitleText: {
      fontSize: Typography.P3,
      fontFamily: Fonts.RUBIK_MEDIUM,
      color: colors.headingColor,
    },

    headerSubtitleText: {
      fontSize: Typography.P5,
      fontFamily: Fonts.RUBIK_REGULAR,
      marginVertical: hp('0.5'),
      color: colors.subHeadingColor,
    },

    headerSubtitleValueText: {
      fontSize: Typography.P4,
      fontFamily: Fonts.RUBIK_MEDIUM,
    },

    headerRightIconContainer: {
      flex: 1,
      alignItems: 'flex-end',
      paddingRight: wp('5'),
    },

    headerRightIcon: {
      width: hp(2.5),
      height: hp(2.5),
      tintColor: colors.bannerBluePrimary,
    },

    headerOrderDeliverContainer: {
      flexDirection: 'row',
      height: hp(5),
      paddingLeft: wp('5'),
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: colors.borderColorLight,
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
    },

    headerOrderDeliverCircle: {
      backgroundColor: colors.bannerGreenPrimary,
      width: hp('1.2'),
      height: hp('1.2'),
      borderRadius: hp('0.6'),
      marginRight: wp('2'),
    },

    headerOrderDeliverDateText: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P5,
      color: colors.subHeadingColor,
      flex: 1,
      textAlign: 'right',
      paddingRight: wp('5'),
    },

    contentContainerStyle: {
      paddingBottom: hp('2.5'),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
      flex: 1,
      alignItems: 'center',
    },

    contentStatusContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: hp('2.5'),
      paddingHorizontal: wp('5'),
    },

    contentItemContainer: {
      flexDirection: 'row',
    },

    contentItemLeftContainer: {
      alignItems: 'center',
      marginRight: wp('2'),
    },

    contentItemCircle: {
      width: hp('1.5'),
      height: hp('1.5'),
      borderRadius: hp('0.75'),
    },

    contentItemLine: {
      width: 2,
      height: hp('3'),
    },

    contentItemLeftText: {
      flex: 0.5,
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P5,
      marginTop: -hp(0.3),
      color: colors.headingColor,
    },

    contentItemRightText: {
      flex: 0.5,
      textAlign: 'right',
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P6,
      color: colors.subHeadingColor,
    },

    containerSpacing: {
      marginBottom: hp('1'),
    },
  };
};

export const styll = {
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: 'grey',
  },
  registerButton: {
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 1,
    color: 'black',
  },
  inputContainer: {
    marginBottom: 15,
  },
  picker: {
    // height: 40,
    // borderWidth: 1,
    marginTop: -10,
  },
  containerBottom: {
    backgroundColor: '#e5dada',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  textBottom: {
    textAlign: 'center',
    paddingVertical: 20,
    color: 'black',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    alignItems: 'flex-end',
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.activeColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    // fontWeight: 'bold',
  },
  // inputLabel: {
  //     fontFamily: Fonts.RUBIK_REGULAR,
  //     fontSize: Typography.P5,
  //     color: colors.subHeadingColor,
  //     alignSelf: 'center',
  //     marginBottom: hp(0.5),
  // },
};
