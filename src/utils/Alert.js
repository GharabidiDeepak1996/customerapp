import { Alert } from "react-native";

export const CommonAlert = async (title, message, onPressCallback) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Ok',
                onPress: () => {
                    if (onPressCallback) {
                        onPressCallback();
                    }
                },
                style: 'cancel',
            },
        ],)

}