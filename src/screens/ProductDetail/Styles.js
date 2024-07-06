import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import AppConfig from "../../../branding/App_config";
import Globals from "../../utils/Globals";

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;

export const StylesNew = function (scheme, colors) {

    return {
        container: {
            flex: 1,
            backgroundColor: colors.secondaryBackground,
            paddingBottom: Globals.SAFE_AREA_INSET.bottom,
            height: '100%'

        },

        imageContainer: {

            height: hp("40%"),
            backgroundColor: colors.primaryBackground,
            paddingTop: Globals.SAFE_AREA_INSET.top
        },

        mainImage: {
            width: "100%",
            height: "100%",
            alignSelf: "center",
            resizeMode: "cover"
        },

        bottomContainerMain: {
            // flex: 1,
            // alignSelf: "center",
            // marginHorizontal: wp(5),
            // paddingTop: hp("2"),
            // backgroundColor: 'yellow',
            paddingTop: hp('2.5')

        },

        bottomContainerUpper: {
            flex: 1
        },

        bottomContainerLower: {
            flex: 0.35
        },

        infoContainer: {
            alignItems: "center",
            flexDirection: 'row', marginBottom: hp("0.5"),
        },

        favouriteContainer: {
            width: "50%",
            height: hp(2),
            justifyContent: "center",
            alignItems: "flex-end"
        },

        // priceText: {
        //     color: colors.subHeadingSecondaryColor,
        //     fontSize: Typography.H8,
        //     fontFamily: Fonts.RUBIK_MEDIUM,
        //     width: "50%"
        // },

        priceText: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P3,

            textDecorationLine: 'line-through',
            marginLeft: hp("0.6")
        },

        discountPrice: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: colors.subHeadingSecondaryColor,
            fontSize: Typography.P1,
        },

        nameText: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            fontSize: Typography.P1,
            color: colors.headingColor,

        },

        addToCartButton: {
            // color: colors.subHeadingColor,
            // fontFamily: Fonts.RUBIK_REGULAR,
            // fontSize: Typography.P4,
            // lineHeight: hp('2.8'),
            //backgroundColor: colors.subHeadingSecondaryColor,
            borderColor: colors.subHeadingSecondaryColor,
            borderWidth: 1,
            height: hp('4.5'),
            justifyContent: 'center',
            paddingHorizontal: 6,
            borderRadius: 8,
            width: hp('18'),
            marginTop: 8,
        },
        disableAddToCartButton: {
            // color: colors.subHeadingColor,
            // fontFamily: Fonts.RUBIK_REGULAR,
            // fontSize: Typography.P4,
            // lineHeight: hp('2.8'),
            backgroundColor: '#eeeeee',
            borderColor: '#eeeeee',
            borderWidth: 1,
            height: hp('4.5'),
            justifyContent: 'center',
            paddingHorizontal: 6,
            borderRadius: 8,
            width: hp('18'),
            marginTop: 8,
        },

        addToCartContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
        },

        addCartText: {
            color: colors.subHeadingSecondaryColor,
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P4,
            lineHeight: hp('2.8'),
        },
        addCartDisableText: {
            color: '#C6C6C6',
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P4,
            lineHeight: hp('2.8'),
        },

        addCartIcon: {
            marginRight: wp(2),
        },

        weightText: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P3,
            color: colors.subHeadingColor,
        },
        attributesText: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P3,
            color: colors.subHeadingColor,
            marginBottom: hp(0.2)
        },
        subTitle: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: 'black',
            marginBottom: hp(0.4),
            fontSize: Typography.H9,
        },
        ratingContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: hp("2")
        },

        ratingText: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P4,
            color: colors.headingColor,
            marginRight: 4
        },

        reviewText: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P4,
            color: colors.subHeadingColor
        },

        detailText: {
            fontFamily: Fonts.RUBIK_LIGHT,
            fontSize: Typography.P2,
            lineHeight: hp("3%"),
            color: colors.subHeadingColor,
        },

        seeMoreStyle: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            fontSize: Typography.P2,
            color: colors.headingColor,
        },

        cartCounterContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.primaryBackground,
            marginVertical: hp("1")
        },

        cartCounterText: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: colors.subHeadingColor,

        },

        containerNew: {
            padding: 8,
            backgroundColor: scheme === "dark" ? colors.secondaryBackground : colors.primaryBackground,
            borderRadius: hp(0.75),
            flexDirection: "column",
            marginRight: hp("2"),
            marginBottom: hp("1"),
            marginTop: hp("2"),
            borderColor: colors.secondaryBackground,
            borderWidth: 1,
            flex: 1
        },

        upperContainerNew: {

            // flexDirection: "row"
        },

        discountContainerNew: {
            width: "50%"
        },

        discountBannerNew: {
            backgroundColor: colors.quaternaryBackground,
            width: "60%",
            height: hp(3),
            justifyContent: "center",
            alignItems: "center",
            borderTopRightRadius: hp(0.75),
            borderBottomRightRadius: hp(0.75),
            borderTopLeftRadius: hp(0.75)
        },

        discountTextNew: {
            color: colors.headingSecondaryColor,
            fontFamily: Fonts.RUBIK_MEDIUM,
            fontSize: Typography.P7
        },

        favouriteContainerNew: {
            width: "50%",
            paddingTop: wp(2),
            paddingEnd: wp(2),
            justifyContent: "center",
            alignItems: "flex-end"
        },

        mainContainerNew: {
            flex: 1,
            alignItems: "center",
        },

        foodItemImageNew: {
            width: hp("13"),
            height: hp("13"),
            resizeMode: "contain"
        },

        infoContainerNew: {
            marginVertical: hp("2"),

        },

        priceTextNew: {
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P7,
            marginTop: 4,
            textDecorationLine: 'line-through'
        },

        discountPriceNew: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: colors.subHeadingSecondaryColor,
            fontSize: Typography.P3,
            marginEnd: 10
        },

        titleTextNew: {
            fontSize: Typography.P3,
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: colors.headingColor,
            marginVertical: hp("0.5"),

        },

        weightTextNew: {
            fontSize: Typography.P6,
            color: colors.subHeadingColor,
            fontFamily: Fonts.RUBIK_REGULAR
        },

        specificationNew: {
            fontSize: Typography.P6,
            color: colors.subHeadingColor,
            fontFamily: Fonts.RUBIK_REGULAR
        },

        ratingNew: {
            fontSize: Typography.P6,
            color: colors.subHeadingColor,
            fontFamily: Fonts.RUBIK_REGULAR,

        },

        quantityNew: {
            fontSize: Typography.P4,
            color: colors.subHeadingColor,
            fontFamily: Fonts.RUBIK_REGULAR,


        },

        bottomContainerNew: {
            borderTopColor: colors.borderColorLight,

            height: hp("5.5"),
            justifyContent: "center",
            borderTopWidth: 1,
        },

        addToCartContainerNew: {
            flexDirection: "row",
            justifyContent: "center"
        },

        addCartTextNew: {
            color: colors.subHeadingColor,
            fontFamily: Fonts.RUBIK_REGULAR,
            fontSize: Typography.P4,
            lineHeight: hp('2.8'),
        },

        addCartIconNew: {
            marginRight: wp(2),
        },

        cartUpdateContainerNew: {
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },

        cartUpdateActionContainerNew: {
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            borderColor: colors.borderColorLight,
            height: "100%"
        },

        cartNumberTextNew: {
            fontFamily: Fonts.RUBIK_MEDIUM,
            color: colors.headingColor
        }
    }

}




