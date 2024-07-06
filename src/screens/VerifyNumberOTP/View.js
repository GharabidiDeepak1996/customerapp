import React, { useEffect, useState } from "react";
import { Alert, Keyboard, ToastAndroid, useColorScheme, View } from "react-native";
import { Text } from "react-native-elements";
import { Styles } from "./Style";
import AppHeader from "../../components/Application/AppHeader/View";
import { CommonActions, StackActions, useTheme } from "@react-navigation/native";
import { commonDarkStyles } from "../../../branding/carter/styles/dark/Style";
import { commonLightStyles } from "../../../branding/carter/styles/light/Style";
import OtpInputs from "react-native-otp-inputs";
import { FocusAwareStatusBar } from "../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar";
import Routes from "../../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';
import { CommomService } from "../../apis/services";

export const VerifyPhoneOTP = (props) => {

    const { t, i18n } = useTranslation();

    const [keyboardHeight, setKeyboardHeight] = useState(0);


    //Theme based styling and colors
    const scheme = useColorScheme();
    const { colors } = useTheme();
    const globalStyles = scheme === "dark" ? commonDarkStyles(colors) : commonLightStyles(colors);
    const screenStyles = Styles(globalStyles, colors);

    useEffect(() => {

        console.log("varifynumber otp", props?.route?.params?.otp)
        console.log("varifynumber whatsAppAuthentication", props?.route?.params?.whatsAppAuthentication)

        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            (event) => {
                setKeyboardHeight(event.endCoordinates.height);
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardHeight(0);
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    const callValidateOTP = async (otp, userId) => {
        try {

            let body = {
                userId: userId,
                otpCode: otp,
            };
            const response = await CommomService.validateOtp(body);
            console.log("response validateOtp", response?.data)


            if (response?.data?.statusCode == 200) {
                Alert.alert('Registered successfully', 'Please continue to login', [
                    {
                        text: 'Login',
                        onPress: () => {
                            // props.navigation.dispatch(
                            //     CommonActions.reset({
                            //         index: 1,
                            //         routes: [{ name: Routes.HOME_VARIANT1 }],
                            //     }),
                            // );

                            props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [{ name: Routes.LOGIN_FORM_SCREEN1 }],
                                }),
                            );
                        },
                    },
                ]);

            } else {
                ToastAndroid.show(response?.data?.message,
                    ToastAndroid.LONG,
                );
                return;
            }

        } catch (ex) {
            console.log("ValidateOtp error", ex)
        }
    }
    return (
        <View style={screenStyles.container}>
            <FocusAwareStatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <AppHeader
                navigation={props.navigation}
                transparentHeader
                isTranslucent
                darkIcons
                title={t("Verify Number")}
                onBackPress={() => {
                    props.navigation.navigate(Routes.SIGNUP_FORM_SCREEN1)
                }}
                headerWithBack={true}
            //  headerWithBackground

            // onRightIconPress={() => {
            //     props.navigation.navigate(Routes.LOGIN_FORM_SCREEN1);
            // }}
            />

            <View style={screenStyles.mainContainer}>
                <Text style={screenStyles.titleText}>{t("Verify your number")}</Text>

                <Text style={screenStyles.subtitleText}>{t("Enter your OTP code below")}</Text>

                <View style={screenStyles.otpInputMainContainer}>
                    <OtpInputs
                        autoFocus
                        clearTextOnFocus
                        blurOnSubmit={false}
                        defaultValue={props?.route?.params?.whatsAppAuthentication ? "" : props?.route?.params?.otp}
                        handleChange={(code) => {
                            if (code.length === 6) {


                                //add validate otp
                                callValidateOTP(code.toString(), props?.route?.params?.userId)

                                // props.navigation.dispatch(
                                //     CommonActions.reset({
                                //         index: 1,
                                //         routes: [{ name: Routes.HOME_VARIANT1 }],
                                //     }),
                                // );


                                // props.navigation.navigate(Routes.HOME_VARIANT1)
                                // props.navigation.dispatch(
                                //     StackActions.pop(2),
                                // );
                            }
                        }}
                        numberOfInputs={6}
                        inputStyles={screenStyles.otpInput}
                    />
                </View>

                {/*<ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: "flex-end", bottom: keyboardHeight}}>*/}
                <View style={screenStyles.didntReceivedContainer}>
                    <Text style={screenStyles.didntReceivedText}>{t("Didn't receive the code?")}</Text>
                    <Text style={screenStyles.resendText}>{t("Resend a new code")}</Text>
                </View>
                {/*</ScrollView>*/}

            </View>
        </View>

    );

};
