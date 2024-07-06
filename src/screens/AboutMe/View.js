import React, { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import BaseView from '../BaseView';
import { Text } from 'react-native-elements';
import { Styles } from './Styles';
import AppInput from '../../components/Application/AppInput/View';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AppButton from '../../components/Application/AppButton/View';
import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import IconNames from '../../../branding/carter/assets/IconNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Routes from '../../navigation/Routes';
import { CommomService } from '../../apis/services';
import Toast from 'react-native-toast-message';

export const AboutMe = props => {
  //Input reference for KeyboardAwareScrollView
  let inputRef = useRef();

  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(colors);

  //Internal input field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const [editState, setEditState] = useState(false);

  const [btnBgColor, setbtnBgColor] = useState({ label: '#e6e6e6' });

  const [buttonName, setButtonName] = useState({ label: 'Edit' });
  const updateButtonName = data =>
    setButtonName(state => ({ ...state, ...data }));

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const getUserName = await AsyncStorage.getItem('displayName');
      const getUserEmail = await AsyncStorage.getItem('email');
      const getUserId = await AsyncStorage.getItem('userId');
      const getUserPhone = await AsyncStorage.getItem('phoneNo');

      setUserEmail(getUserEmail);
      setUserName(getUserName);
      setUserId(getUserId);
      setPhone(getUserPhone);
    } catch (e) {
      // error reading value
    }
  };

  const updateProfile = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');
      let body = {
        fullName: userName,
        email: userEmail,
        mobileNo: '',
      };

      setIsLoading(true);
      let response = await CommomService.getProfileUpdate(getUserId, body);

      if (response?.data?.isSuccess) {
        //also update sharedPre value and close loader
        setEditState(false);
        setIsLoading(false);

        updateButtonName({ label: 'Edit' });
        setbtnBgColor('#e6e6e6');

        ToastAndroid.show(response?.data?.message, ToastAndroid.LONG);
      } else {
        setIsLoading(false);

        ToastAndroid.show(response?.data?.message, ToastAndroid.LONG);
      }
    } catch (e) {
      setIsLoading(false);

      // error reading value
    }
  };

  return (
    <BaseView
      navigation={props.navigation}
      title={'My Profile'}
      headerWithBack
      applyBottomSafeArea
      onBackPress={() => {
        props.navigation.navigate(Routes.PROFILE)
      }}
      childView={() => {
        return (
          <View style={screenStyles.mainContainer}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'never'}
              style={screenStyles.upperContainer}
              getTextInputRefs={() => {
                return [inputRef];
              }}
              showsVerticalScrollIndicator={false}>
              <View style={[screenStyles.upperContainer, { marginTop: 10 }]}>
                {/* <Text style={screenStyles.typeHeader}>{"Personal Details"}</Text> */}

                <Text
                  style={[screenStyles.inputLabel, { alignSelf: 'flex-start' }]}>
                  Name
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.CircleUser}
                  placeholder={'Name'}
                  value={userName}
                  editable={editState}
                  disabled={!editState}
                  backgroundColor={btnBgColor}
                  onChangeText={name => {
                    setUserName(name);
                  }}
                />

                <Text
                  style={[
                    screenStyles.inputLabel,
                    { alignSelf: 'flex-start', marginTop: 8 },
                  ]}>
                  Email
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.Envelope}
                  placeholder={'Email Address'}
                  value={userEmail}
                  editable={editState}
                  disabled={!editState}
                  backgroundColor={btnBgColor}
                  onChangeText={email => {
                    setUserEmail(email);
                  }}
                  keyboardType={'email-address'}
                />

                <Text
                  style={[
                    screenStyles.inputLabel,
                    { alignSelf: 'flex-start', marginTop: 8 },
                  ]}>
                  Mobile Number
                </Text>
                <AppInput
                  {...globalStyles.secondaryInputStyle}
                  textInputRef={r => (inputRef = r)}
                  leftIcon={IconNames.PhoneFlip}
                  placeholder={'Phone'}
                  value={phone}
                  editable={false}
                  disabled={true}
                  onChangeText={phone => {
                    setPhone(phone);
                  }}
                  keyboardType={'phone-pad'}
                />
              </View>
            </KeyboardAwareScrollView>

            {isLoading && ( // Show loader when loading
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}>
                <ActivityIndicator size="large" color={colors.activeColor} />
              </View>
            )}
            <View style={screenStyles.bottomButton}>
              {/* Edit button */}
              <AppButton
                title={buttonName.label}
                onPress={() => {
                  if (buttonName.label === 'Edit') {
                    setEditState(true);
                    updateButtonName({ label: 'Update' });
                    setbtnBgColor('white');
                  } else {
                    //update profile
                    updateProfile();
                    setEditState(false);
                    updateButtonName({ label: 'Edit' });
                    setbtnBgColor('#e6e6e6');
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(Routes.CHANGEPASSWORD);
                }}>
                <Text
                  style={[
                    screenStyles.typeHeader,
                    {
                      alignSelf: 'center',
                      marginBottom: 20,
                      color: colors.activeColor,
                      fontSize: 16,
                    },
                  ]}>
                  {'Change Password'}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => {
                                props.navigation.navigate(Routes.LANGUAGE_POP_UP)
                            }}>
                                <Text style={[screenStyles.typeHeader, { alignSelf: 'center', marginBottom: 20, color: 'green', fontSize: 16 }]}>{"Change Language"}</Text>
                            </TouchableOpacity> */}
            </View>
          </View>
        );
      }}
    />
  );
};

// import React, {useRef, useState} from "react";
// import {useColorScheme, View} from "react-native";

// import BaseView from "../BaseView";
// import {Text} from "react-native-elements";
// import {Styles} from "./Styles";
// import AppInput from "../../components/Application/AppInput/View";
// import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";
// import AppButton from "../../components/Application/AppButton/View";
// import {useTheme} from "@react-navigation/native";
// import {commonDarkStyles} from "../../../branding/carter/styles/dark/Style";
// import {commonLightStyles} from "../../../branding/carter/styles/light/Style";
// import IconNames from "../../../branding/carter/assets/IconNames";

// export const AboutMe = (props) => {

//     //Input reference for KeyboardAwareScrollView
//     let inputRef = useRef();

//     //Theme based styling and colors
//     const scheme = useColorScheme();
//     const {colors} = useTheme();
//     const globalStyles = scheme === "dark" ? commonDarkStyles(colors) : commonLightStyles(colors);
//     const screenStyles = Styles(colors);

//     //Internal input field states
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [currentPassword, setCurrentPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     return (

//         <BaseView
//             navigation={props.navigation}
//             title={"About Me"}
//             headerWithBack
//             applyBottomSafeArea
//             childView={() => {
//                 return (

//                     <View style={screenStyles.mainContainer}>

//                         <KeyboardAwareScrollView
//                             keyboardShouldPersistTaps={"never"}
//                             style={screenStyles.upperContainer}
//                             getTextInputRefs={() => {
//                                 return [inputRef];
//                             }}
//                             showsVerticalScrollIndicator={false}>

//                             <View style={screenStyles.upperContainer}>

//                                 <Text style={screenStyles.typeHeader}>{"Personal Details"}</Text>

//                                 <AppInput
//                                     {...globalStyles.secondaryInputStyle}
//                                     textInputRef={r => (inputRef = r)}
//                                     leftIcon={IconNames.CircleUser}
//                                     placeholder={"Name"}
//                                     value={name}
//                                     onChangeText={(name) => {
//                                         setName(name);
//                                     }}
//                                 />

//                                 <AppInput
//                                     {...globalStyles.secondaryInputStyle}
//                                     textInputRef={r => (inputRef = r)}
//                                     leftIcon={IconNames.Envelope}
//                                     placeholder={"Email Address"}
//                                     value={email}
//                                     onChangeText={(email) => {
//                                         setEmail(email);
//                                     }}
//                                     keyboardType={"email-address"}
//                                 />

//                                 <AppInput
//                                     {...globalStyles.secondaryInputStyle}
//                                     textInputRef={r => (inputRef = r)}
//                                     leftIcon={IconNames.PhoneFlip}
//                                     placeholder={"Phone"}
//                                     value={phone}
//                                     onChangeText={(phone) => {
//                                         setPhone(phone);
//                                     }}
//                                     keyboardType={"phone-pad"}
//                                 />

//                                 <Text style={screenStyles.typeHeader}>{"Change Password"}</Text>

//                                 <AppInput
//                                     {...globalStyles.secondaryInputStyle}
//                                     textInputRef={r => (inputRef = r)}
//                                     leftIcon={IconNames.LockKeyhole}
//                                     placeholder={"Current Password"}
//                                     isPasswordField
//                                     value={currentPassword}
//                                     onChangeText={(currentPassword) => {
//                                         setCurrentPassword(currentPassword);
//                                     }}
//                                 />

//                                 <AppInput
//                                     {...globalStyles.secondaryInputStyle}
//                                     textInputRef={r => (inputRef = r)}
//                                     leftIcon={IconNames.LockKeyhole}
//                                     placeholder={"Password"}
//                                     isPasswordField
//                                     value={newPassword}
//                                     onChangeText={(newPassword) => {
//                                         setNewPassword(newPassword);
//                                     }}
//                                 />

//                                 <AppInput
//                                     {...globalStyles.secondaryInputStyle}
//                                     textInputRef={r => (inputRef = r)}
//                                     leftIcon={IconNames.LockKeyhole}
//                                     placeholder={"Confirm Password"}
//                                     isPasswordField
//                                     value={confirmPassword}
//                                     onChangeText={(confirmPassword) => {
//                                         setConfirmPassword(confirmPassword);
//                                     }}
//                                 />

//                             </View>

//                         </KeyboardAwareScrollView>

//                         <View style={screenStyles.bottomButton}>

//                             <AppButton
//                                 title={"Save Changes"}
//                                 onPress={() => {

//                                 }}
//                             />

//                         </View>

//                     </View>

//                 );
//             }}
//         />

//     );

// };
