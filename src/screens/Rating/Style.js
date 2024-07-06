import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import AppConfig from '../../../branding/App_config';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const Style = function (styles, scheme, colors) {

    return {
        questionStyles:{
            fontSize: Typography.P2,
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: 'black',
        },

        productNameStyle:{
            fontSize: Typography.P3,
            fontFamily: Fonts.RUBIK_LIGHT,
            color: 'black',
        },

        addPhotoText:{
            fontSize: Typography.P3,
            fontFamily: Fonts.RUBIK_LIGHT,
            color: 'green',
        }
        
    }
}