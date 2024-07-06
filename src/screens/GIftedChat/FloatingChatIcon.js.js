// FloatingChatIcon.js

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Routes from '../../navigation/Routes';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const FloatingChatIcon = ({ navigation }) => {
    // const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate(Routes.ChatUs);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={{ position: 'absolute', bottom: heightPercentageToDP(60), right: 16 }}>
            <View style={{ backgroundColor: 'white', padding: 10, justifyContent: 'center', flex: 1, alignItems: 'center', borderRadius: 50, opacity: 0.5 }}>
                <FontAwesomeIcon icon={faWhatsapp} color="#green" size={50} />
            </View>
            <View style={{ padding: 10, justifyContent: 'center', flex: 1, alignItems: 'center', marginTop: -70, borderRadius: 50, borderWidth: 3, borderColor: "green", }}>
                <FontAwesomeIcon icon={faWhatsapp} color="green" size={50} style={{}} />
            </View>
        </TouchableOpacity>
    );
};

export default FloatingChatIcon;
