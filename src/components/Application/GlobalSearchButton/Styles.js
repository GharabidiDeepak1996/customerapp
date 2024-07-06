import AppConfig from '../../../../branding/App_config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Styles = function (styles, scheme, colors) {
  return {
    buttonContainer: {
      elevation: 0,
      width: '100%',
      height: hp(4.5),
      backgroundColor:
        scheme === 'dark'
          ? colors.secondaryBackground
          : colors.primaryBackground,
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: hp('1.5'),
      borderRadius: 7,
      borderWidth: 0.5,
      borderColor: '#444',
    },

    leftIcon: {
      marginLeft: wp(3),
    },

    Text: {
      width: '70%',
      marginLeft: hp('1'),
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P4,
      color: colors.subHeadingColor,
    },
    rightIcon: {
      position: 'absolute',
      right: wp(5),
    },
    walletIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
    }
  };
};
