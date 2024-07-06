import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

//import AppConfig from '../../../../branding/App_config';
import AppConfig from '../../../branding/App_config';

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;

export const Styles = function (scheme, colors) {
  return {
    foodFirstItem: {
      marginTop: hp(1),
    },

    foodLastItem: {
      marginBottom: hp(1),
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      marginHorizontal: -16, paddingHorizontal: 16
    },
    text: {
      //color: colors.headingSecondaryColor,
      color: 'white',
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P7,
    },
    subText: {
      //color: colors.headingSecondaryColor,
      color: '#808080',
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.P8,
    },
    headerImage: {

      width: 150,
      height: 150,
      //resizeMode: "cover",
    },
    title: {
      fontFamily: Fonts.RUBIK_MEDIUM,
      fontSize: Typography.H8,
      marginTop: hp("0.5"),
      marginBottom: hp("0.5"),
      color: colors.headingColor
    },
    subTitle: {
      fontFamily: Fonts.RUBIK_REGULAR,
      fontSize: Typography.P2,
      marginTop: hp("0.5"),
      marginBottom: hp("0.5"),
      color: colors.headingColor,
      textAlign: 'center'
    }
  };
};
