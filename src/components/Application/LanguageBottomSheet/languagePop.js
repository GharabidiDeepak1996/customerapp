import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, ToastAndroid, TouchableOpacity, View, PanResponder, Animated, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styll from '../../../screens/Variant1/Profile/Styles';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import colors from '../../../../branding/carter/styles/light/Colors';
import AppConfig from "../../../../branding/App_config";
const Typography = AppConfig.typography.default;

const fonts = AppConfig.fonts.default;
export function LanguagePop() {
    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { t, i18n } = useTranslation();


    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(
                        _, // Update pan.y with the gesture
                        gestureState
                    );
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    navigation.goBack();
                } else {
                    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
                }
            },
        })
    ).current;

    const backgroundColor = pan.y.interpolate({
        inputRange: [0, 3], // Adjust the range based on your needs
        outputRange: ['rgba(64, 64, 64, 0.7)', 'rgba(64, 64, 64, 0)'],
        extrapolate: 'clamp',
    });


    return (
        <TouchableWithoutFeedback
            onPress={() => {
                //commented
                navigation.goBack();
            }}>
            <Animated.View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    backgroundColor,
                    transform: pan.getTranslateTransform(),
                }}
                {...panResponder.panHandlers}
            >
                <View style={{ height: "18%", width: '100%', backgroundColor: 'white', justifyContent: "center", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <View >
                        <View style={{ margin: heightPercentageToDP(3) }} >
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: 50, height: 5, borderRadius: 10, backgroundColor: '#eee' }} />
                            </TouchableOpacity>

                            <View >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={[{ fontFamily: fonts.RUBIK_MEDIUM, fontSize: Typography.P2, color: 'black', }]}>Set Language</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.goBack();
                                        }}>
                                        <SvgIcon
                                            type={IconNames.Close}
                                            width={20}
                                            height={20}
                                            color={colors.activeColor}

                                        />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                                    {i18n && i18n?.language == "en" ? <TouchableOpacity
                                        style={{
                                            backgroundColor: '#1b8346', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, borderColor: "#1b8346",
                                            borderWidth: 1, width: "47%", justifyContent: 'center', alignItems: 'center'
                                        }} onPress={() => {
                                            i18n.changeLanguage('en')
                                            navigation.goBack()
                                        }}>
                                        <Text style={[{ color: 'white' }]}>English {"(EN)"}</Text>
                                    </TouchableOpacity> : <TouchableOpacity style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 10, borderRadius: 5, borderColor: "#1b8346", borderWidth: 1,
                                        width: "47%", justifyContent: 'center', alignItems: 'center'
                                    }} onPress={() => {
                                        i18n.changeLanguage('en')
                                        navigation.goBack()
                                    }}>
                                        <Text style={[{ color: '#1b8346' }]}>English {"(EN)"}</Text>
                                    </TouchableOpacity>}


                                    {i18n && i18n?.language == "id" ?
                                        <TouchableOpacity style={{
                                            backgroundColor: '#1b8346', paddingHorizontal: 20,
                                            paddingVertical: 10, borderRadius: 5, borderColor: "#1b8346", borderWidth: 1,
                                            width: "47%", justifyContent: 'center', alignItems: 'center'
                                        }} onPress={() => {
                                            i18n.changeLanguage('id')
                                            navigation.goBack()
                                        }}>
                                            <Text style={[{ color: 'white' }]}>Indonesia {"(ID)"}</Text>
                                        </TouchableOpacity> : <TouchableOpacity style={{
                                            paddingHorizontal: 20, paddingVertical: 10,
                                            borderRadius: 5, borderColor: "#1b8346", borderWidth: 1, width: "47%", justifyContent: 'center',
                                            alignItems: 'center'
                                        }} onPress={() => {
                                            i18n.changeLanguage('id')
                                            navigation.goBack()
                                        }}>
                                            <Text style={[{ color: '#1b8346' }]}>Indonesia {"(ID)"}</Text>
                                        </TouchableOpacity>}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>

    );
};