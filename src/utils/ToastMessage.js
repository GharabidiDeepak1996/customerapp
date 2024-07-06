import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { faCheck, faInfo, faTimes, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { widthPercentageToDP } from 'react-native-responsive-screen';


const toastConfig = {
    success: ({ text1, text2 }) => (
        <View style={getToastStyle('#47D767')}>
            <View style={{ backgroundColor: '#47D767', width: widthPercentageToDP(5), borderTopLeftRadius: 8.5, borderBottomLeftRadius: 8.5 }}></View>
            {renderContent(text1, text2, "#47D767", faCheck)}
        </View>
    ),
    error: ({ text1, text2 }) => (
        <View style={getToastStyle('#FE365A')}>
            <View style={{ backgroundColor: '#FE365A', width: widthPercentageToDP(5), borderTopLeftRadius: 8.5, borderBottomLeftRadius: 8.5 }}></View>
            {renderContent(text1, text2, "#FE365A", faXmark)}
        </View>
    ),
    info: ({ text1, text2 }) => (
        <View style={getToastStyle('#2D87E9')}>
            <View style={{ backgroundColor: '#2D87E9', width: widthPercentageToDP(5), borderTopLeftRadius: 8.5, borderBottomLeftRadius: 8.5 }}></View>
            {renderContent(text1, text2, "#2D87E9", faInfo)}
        </View>
    ),
    warning: ({ text1, text2 }) => (
        <View style={getToastStyle('#FBC223')}>
            <View style={{ backgroundColor: '#FBC223', width: widthPercentageToDP(5), borderTopLeftRadius: 8.5, borderBottomLeftRadius: 8.5 }}></View>
            {renderContent(text1, text2, "#FBC223", faInfo)}
        </View>
    ),
};

function getToastStyle(backgroundColor) {
    return {
        // height: 65,
        width: widthPercentageToDP(95),
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: backgroundColor,
        borderWidth: 1,
        flexDirection: "row",
        elevation: 5, // Add elevation for shadow
        shadowColor: '#000', // Shadow color (adjust as needed)
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 4, // Shadow radius
    };
}

function renderContent(text1, text2, color, icon) {
    return (
        <View style={{ width: widthPercentageToDP(90), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }}>
            <View style={{ flexDirection: 'row', width: widthPercentageToDP(66) }}>
                <View style={{ backgroundColor: color, padding: 10, borderRadius: 100, width: 40, height: 40, marginRight: 20 }}>
                    <FontAwesomeIcon icon={icon} size={20} color={'#fff'} />
                </View>
                <View style={{ flexWrap: 'nowrap', width: widthPercentageToDP(63) }}>
                    {text1 && <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>{text1}</Text>}
                    {text2 && <Text>{text2}</Text>}
                </View>
            </View>
            <TouchableOpacity onPress={() => { Toast.hide() }}>
                <FontAwesomeIcon icon={faXmark} size={20} color={'#000'} />
            </TouchableOpacity>
        </View>
    );
}

function showToast(type, text1, text2) {
    Toast.show({
        type: type || "info",
        text1: text1 || '',
        text2: text2 || '',
        position: 'top',
        topOffset: 100,
        autoHide: false,
        swipeable: true,
        onPress: () => {
            // Handle press action if needed
        },
        onHide: () => {
            // Handle hide action if needed
        },
    });
}

export { showToast, toastConfig };













// Toast.show({
//     type: type || 'info', // Default to 'info' if type is not provided
//     text1: text1 || 'Notification',
//     text2: text2 || 'This is some information',
//     position: 'top', // Show Toast from top
//     topOffset: 100, // Adjust the top offset as needed
//     // visibilityTime: 4000,
//     autoHide: false,
//     swipeable: true,
//     onPress: () => {
//         // Handle press action if needed
//     },
//     onHide: () => {
//         // Handle hide action if needed
//     },
// });
// }

// Example Usage:
// showToast('success', 'Success!', 'Operation completed successfully');
// showToast('error', 'Error!', 'Something went wrong');
// showToast('info', 'Info', 'This is an informative message');
// showToast(); // Default info toast