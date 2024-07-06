import React, {useRef, useState} from "react";
import {useColorScheme, View} from "react-native";
import {useTheme} from "@react-navigation/native";
import { commonDarkStyles } from "../../../../branding/carter/styles/dark/Style";
import { commonLightStyles } from "../../../../branding/carter/styles/light/Style";
import {FocusAwareStatusBar} from "../../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar";
import AppHeader from "../../../components/Application/AppHeader/View";

import {Styles} from "./Style";

export const Variant1Category = (props) => {
     //Theme based styling and colors
     const scheme = useColorScheme();
     const {colors} = useTheme();
     const globalStyles = scheme === "dark" ? commonDarkStyles(colors) : commonLightStyles(colors);
     const screenStyles = Styles(globalStyles, colors);


     return (
        <View style={screenStyles.container}>
        <FocusAwareStatusBar translucent backgroundColor="transparent" barStyle="light-content"/>

        

        <AppHeader
            isTranslucent
            navigation={props.navigation}
            transparentHeader
            headerWithBack
            title={"Password Recovery"}
        />

        {/* <View style={[screenStyles.bottomContainer]}>
            <Text style={screenStyles.titleText}>{"Forgot Password!"}</Text>

            <Text
                style={screenStyles.subtitleText}>{"Enter your email and we'll send you instructions on how to reset it."}</Text>

            <AppInput
                {...globalStyles.secondaryInputStyle}
                containerStyle={screenStyles.emailInputContainer}
                textInputRef={r => (inputRef = r)}
                leftIcon={IconNames.Envelope}
                placeholder={"Email Address"}
                value={email}
                onChangeText={(email) => {
                    setEmail(email);
                }}
            />


            <AppButton
                title={"Send Link"}
                onPress={() => {
                    props.navigation.navigate(Routes.VERIFY_NUMBER_SCREEN)
                }}
            />

        </View> */}
    </View>
    );
}