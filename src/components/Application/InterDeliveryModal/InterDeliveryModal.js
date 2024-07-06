import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, ToastAndroid, TouchableOpacity, View, PanResponder, Animated, useColorScheme } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styll from '../../../screens/Variant1/Profile/Styles';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { AuthService } from '../../../apis/services';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SvgIcon } from '../SvgIcon/View';
import { Picker } from '@react-native-picker/picker';
import AppButton from '../AppButton/View';
import { LocalStorageGet, LocalStorageSet } from '../../../localStorage';

export function InterDeliveryModal() {
    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { t, i18n } = useTranslation();
    const [province, setProvince] = useState([])
    const [province1, setProvince1] = useState([])
    const { colors } = useTheme();
    const scheme = useColorScheme();
    const [data, setData] = useState({})

    const globalStyles = scheme === "dark" ? commonDarkStyles(colors) : commonLightStyles(colors);

    useEffect(() => {
        (async () => {
            try {
                let response = await AuthService.getProvincee();
                if (!response?.data?.isSuccess) {
                    return;
                }
                console.log("response Province=>", response?.data)
                if (response?.data?.isSuccess) {
                    console.log("response Province=>", response?.data)
                    setProvince(response?.data?.payload); // Move this line inside the 'if' block
                }
            } catch (error) {
                // Cast 'error' to 'any' to handle the TypeScript error
                console.log('Error in handleRegister:', error);
            }
        })();
    }, []);

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

    useFocusEffect(
        React.useCallback(() => {
            // Check if pickUp data exists in LocalStorage
            (async () => {

                const pickUpData = await LocalStorageGet("pickUp");
                if (pickUpData) {
                    setData((prevData) => ({ ...prevData, provinceId: pickUpData?.id }));
                }

                // Check if dropDown data exists in LocalStorage
                const dropDownData = await LocalStorageGet("dropDown");
                if (dropDownData) {
                    setData((prevData) => ({ ...prevData, provinceId1: dropDownData?.id }));

                }
            })()

            // ... (other logic)
        }, [])
    );
    const handleRoute = async () => {
        const pickUpData = data?.provinceId;
        const dropDownData = data?.provinceId1;

        if (pickUpData) {
            const pickUpLocation = getProvinceById(pickUpData);
            if (pickUpLocation) {
                await LocalStorageSet("pickUp", pickUpLocation);
            } else {
                console.log("Invalid pick up location")
            }
        } else {
            console.log("Please select pick up location")
        }

        if (dropDownData) {
            const dropDownLocation = getProvinceById(dropDownData);
            if (dropDownLocation) {
                await LocalStorageSet("dropDown", dropDownLocation);
            } else {
                console.log("Invalid drop off location")
            }
        } else {
            console.log("Please select drop off location")
        }

        navigation.goBack()
    };

    const getProvinceById = (id) => {
        return province.find(item => item.id === id);
    };


    return (
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
            <View style={{ height: "40%", width: '100%', backgroundColor: "#fff", justifyContent: "center", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <View >
                    <View >
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 5, borderRadius: 10, backgroundColor: '#eee' }} />
                        </TouchableOpacity>

                        <View style={{ padding: 20, paddingTop: 0 }}>
                            <Text style={[{ color: '#000', marginVertical: 20, marginBottom: 10, fontSize: heightPercentageToDP(2), fontWeight: 'bold' }]}>Select Route</Text>

                            {/* Province */}
                            <Text>{t("Pick up Location")}</Text>
                            <View style={{
                                backgroundColor: '#FFF',
                                borderColor: 'gray',
                                borderRadius: 10, // Set the desired borderRadius here
                                marginBottom: 10,
                                width: "100%",
                                marginVertical: 7,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingLeft: '7%',
                                borderWidth: 1,
                                borderColor: "#444",
                                height: heightPercentageToDP(5.7)

                            }}>
                                <SvgIcon type={IconNames.MapMarkedAlt} width={20} height={20} color={globalStyles.primaryInputStyle.iconColor} />
                                <Picker
                                    selectedValue={data?.provinceId}
                                    onValueChange={(provinceId) => {
                                        setData((prevData) => ({ ...prevData, provinceId }));
                                        if (provinceId != "") {
                                        }
                                    }}
                                    style={{ width: '93%' }}
                                >
                                    <Picker.Item label={t("Select location")} value="" color={globalStyles.primaryInputStyle.placeholderTextColor} />
                                    {province && province?.map((item) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} color="#3B3B43" />
                                    ))}
                                </Picker>
                            </View>

                            {/* Province */}
                            <Text>{t("Drop off Location")}</Text>
                            <View style={{
                                backgroundColor: '#FFF',
                                borderColor: 'gray',
                                borderRadius: 10, // Set the desired borderRadius here
                                marginBottom: 20,
                                width: "100%",
                                marginVertical: 7,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingLeft: '7%',
                                borderWidth: 1,
                                borderColor: "#444",
                                height: heightPercentageToDP(5.7)

                            }}>
                                <SvgIcon type={IconNames.MapMarkedAlt} width={20} height={20} color={globalStyles.primaryInputStyle.iconColor} />
                                <Picker
                                    selectedValue={data?.provinceId1}
                                    onValueChange={(provinceId1) => {
                                        setData((prevData) => ({ ...prevData, provinceId1 }));
                                        if (provinceId1 != "") {
                                        }
                                    }}
                                    style={{ width: '93%' }}
                                >
                                    <Picker.Item label={t("Select location")} value="" color={globalStyles.primaryInputStyle.placeholderTextColor} />
                                    {province && province?.map((item) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} color="#3B3B43" />
                                    ))}
                                </Picker>
                            </View>

                            <AppButton
                                title={t("Set Route")}
                                buttonStyle={{ width: widthPercentageToDP(90), height: heightPercentageToDP(6), backgroundColor: '#1b8346' }}
                                onPress={() => { handleRoute() }}
                            // loading={loading}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};