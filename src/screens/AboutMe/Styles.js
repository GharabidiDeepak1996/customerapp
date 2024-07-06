import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import AppConfig from "../../../branding/App_config";

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;


export const Styles = function (colors) {

    return {
        mainContainer: {
            flex: 1,
        },

        upperContainer: {
            flex: 0.9,
        },

        bottomButton: {

            justifyContent: "center",
        },

        typeHeader: {
            color: colors.buttonBackground,
            fontFamily: Fonts.RUBIK_MEDIUM,
            fontSize: Typography.P1,
            color: colors.headingColor,
            marginTop: hp("3"),
            marginBottom: hp("2")
        },
        inputLabel: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P5,
            color: colors.subHeadingColor,
            alignSelf: 'center',
            marginBottom: hp(0.5),
        },
    }


}
