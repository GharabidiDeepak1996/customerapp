import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import AppConfig from '../../../../branding/App_config';
//import { colors } from 'react-native-elements';
import colors from '../../../../branding/carter/styles/dark/Colors';

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;

let Styles = {
  categoryItemContainer: {
    width: wp('28%'),
    height: hp('17'),
    marginRight: wp('3'),
    marginBottom: wp('2'),
    borderRadius: 4,
    borderWidth: 1,
    borderRadius: 9,
    borderColor: '#D4D4D4',
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    borderRadius: wp('2'),
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  primaryTitle: {
    textTransform: 'uppercase',

    fontFamily: Fonts.RUBIK_MEDIUM,
    fontSize: Typography.P6,
    marginBottom: hp(1),
    alignItems: 'center',
    marginBottom: 70,
  },
  secondaryTitle: {
    textTransform: 'uppercase',
    fontFamily: Fonts.RUBIK_REGULAR,
    fontSize: Typography.P9,
  },
  icon: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Styles;
