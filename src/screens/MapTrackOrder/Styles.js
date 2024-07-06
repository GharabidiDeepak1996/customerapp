import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import AppConfig from "../../../branding/App_config";

const fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;


export const Styles = function (scheme, colors) {

    return {

        container: {
            flex: 1,
            marginHorizontal: -16,
            marginBottom: -16
            //marginTop: hp(3),

        },

        upperContainer: {
            flex: 0.9
        },

        headerContainer: {
            height: hp("13"),
            backgroundColor: scheme === "dark" ? colors.secondaryBackground : colors.primaryBackground,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: wp("5"),
            // borderRadius: hp(0.75),
            // borderWidth: 1,
            // borderColor: '#d4d4d4',
        },


        headerLeftIconContainer: {
            width: hp("6"),
            height: hp("6"),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.tertiaryBackground,
            borderRadius: hp("3"),
            marginRight: wp(3)
        },

        headerTitleText: {
            fontSize: Typography.P2,
            fontFamily: fonts.RUBIK_MEDIUM,
            color: colors.headingColor
        },

        subtitleText: {
            fontSize: Typography.P6,
            fontFamily: fonts.RUBIK_REGULAR,
            marginVertical: hp("0.5"),
            color: '#555555'
        },
        subtitleValueText2: {
            fontSize: Typography.P4,
            fontFamily: fonts.RUBIK_MEDIUM,
            color: '#555555',
            //  marginRight: wp(2),

        },

        subtitleValueText: {
            fontSize: Typography.P4,
            fontFamily: fonts.RUBIK_MEDIUM,
            color: '#555555',
            marginRight: wp(2),

        },

        itemsHorizontalContainer: {
            flexDirection: "row",
            alignItems: "center"
        },

        contentContainer: {
            // alignItems: "center",
            // paddingHorizontal: wp('3'),
            // paddingVertical: hp("1"),
            //   /  marginTop: hp("1"),
            marginHorizontal: hp('2'),
            // borderRadius: hp(0.75),
            //   backgroundColor: scheme === "dark" ? colors.secondaryBackground : colors.primaryBackground,
            // borderWidth: 1,
            //borderColor: '#d4d4d4',

        },

        orderStatusItemContainer: {
            width: "100%",
            flexDirection: "row"
        },

        orderStatusLeftContainer: {
            alignItems: "center",
            // marginRight: wp("3")
        },

        orderStatusLeftIconContainer: {
            // width: hp("4"),
            // height: hp("4"),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: hp("3"),
            //backgroundColor: colors.tertiaryBackground

        },

        orderStatusLine: {
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: 'black',
            flex: 1,

        },

        orderTitleContainer: {
            // flex: 1,
            flexDirection: 'row'
            // marginTop: hp(1),
        },

        centerSeparatorLine: {
            width: "100%",
            height: 1,
            backgroundColor: colors.borderColorLight,
            marginTop: hp(2.5)
        },

        orderStatusTitle: {
            fontFamily: fonts.RUBIK_MEDIUM,
            fontSize: Typography.P3,
            color: colors.headingColor
        },
        orderStatusTitle1: {
            fontFamily: fonts.RUBIK_LIGHT,
            fontSize: Typography.P3,
            color: colors.headingColor
        },

        orderStatusSubtitle: {
            fontFamily: fonts.RUBIK_LIGHT,
            fontSize: Typography.P5,
            color: colors.subHeadingColor
        },

        bottomContainer: {
            flex: 0.1,
            justifyContent: "center"
        },
        mapBottomContainer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
            paddingHorizontal: hp('2'),
            paddingBottom: hp('2'),
            paddingTop: hp('1'),
            flexDirection: 'row'
        },
        ringContainer1: {
            width: hp("7"),
            height: hp("7"),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: hp("10"),
            backgroundColor: '#ffdbd6',

        },
        ringContainer2: {
            width: hp("5.5"),
            height: hp("5.5"),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: hp("10"),
            backgroundColor: '#ea786b'
        },
        ringContainer3: {
            width: hp("4"),
            height: hp("4"),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: hp("3"),
            backgroundColor: '#b52c1c'
        },
        currentTitle: {
            fontSize: Typography.P3,
            fontFamily: fonts.RUBIK_MEDIUM,
            color: '#555555',

        },
        currentSubTitle: {
            fontSize: Typography.P5,
            fontFamily: fonts.RUBIK_MEDIUM,
            color: '#555555',

        },
        currentOperatorTitle: {
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'gray',
            textTransform: 'uppercase',
            backgroundColor: 'white',
            fontSize: Typography.P6,
            fontFamily: fonts.RUBIK_REGULAR,
            color: '#555555',
            paddingHorizontal: 4,
            paddingTop: 2,

            alignSelf: 'center',

        },
        modalContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            justifyContent: 'flex-end'
        },
        modalAnimationView: {
            backgroundColor: 'white',
            paddingTop: 12,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12
        },
        lineView: {
            width: 75,
            height: 4,
            backgroundColor: 'grey',
            alignSelf: 'center',
            marginVertical: 8,
            borderRadius: 2
        },
        wave1: {
            position: 'absolute',
            borderRadius: 30,
            backgroundColor: '#ffdbd6',
            width: 20,
            height: 20
        },
        wave2: {
            position: 'absolute',
            borderRadius: 30,
            backgroundColor: '#ea786b',
            width: 20,
            height: 20
        },
        wave3: {
            position: 'absolute',
            borderRadius: 30,
            backgroundColor: '#b52c1c',
            width: 20,
            height: 20
        }
    }

}
