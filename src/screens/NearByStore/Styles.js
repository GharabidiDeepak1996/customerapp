

//import AppConfig from '../../../../branding/App_config';
import AppConfig from '../../../branding/App_config';

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const Styles = function (styles, colors) {
    return {
        container: {
            flex: 1,
            backgroundColor: "gray",
        },

        foodFirstItem: {
            marginTop: hp(2)
        },

        foodLastItem: {
            marginBottom: hp(1)
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

    }
};

