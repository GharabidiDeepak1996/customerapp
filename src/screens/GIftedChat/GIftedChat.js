import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Linking,
    ActivityIndicator,
    ToastAndroid,
    Alert,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faLocation,
    faLocationArrow,
    faLocationDot,
    faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LocalStorageClear, LocalStorageGet, LocalStorageSet } from '../../localStorage';
import { useDispatch, useSelector } from 'react-redux';
// import { setFloatIcon } from '../../redux/languageSlice';
// import { notificationChatSessionId } from '../../redux/notificationSlice';
import { ChatService } from '../../apis/services';
import moment from 'moment';
var entryPoint = false
var GUIDStatic = {}
export function GiftedChatPage(props) {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([])
    // const [entryPoint, setEntryPoint] = useState(false)
    const [GUIDd, setGUIDd] = useState({ chatSessionId: 8, guiId: "sdfsd" })
    const [fetchingLocation, setFetchingLocation] = useState(false);
    // const dispatch = useDispatch();
    const [timer1, setTimer1] = useState(null);
    const [timer2, setTimer2] = useState(null);
    const [timer3, setTimer3] = useState(null);
    const [timer4, setTimer4] = useState(null);
    const toUserID = props.route?.params?.item || '';
    const chatServiceId = props.route?.params?.chatServiceId;
    const chatSessionIdNotify = props.route?.params?.chatSessionId;
    const notification = props.route?.params?.notification || false;
    console.log("toUserID======>", toUserID)
    console.log("chatSessionIdNotify======>", chatSessionIdNotify)

    useFocusEffect(
        React.useCallback(async () => {
            // Your async function logic here
            try {
                const result = await removeTimer();
            } catch (error) {
                console.error('Error in async function:', error);
            }

            // Cleanup function (optional)
            return () => {
                // Cleanup logic here
                console.log('Screen is unfocused. Cleanup logic here.');
            };
        }, [])
    );
    const removeTimer = async () => {
        let stopTimer = null;
        switch (Number(props.route?.params?.chatServiceId)) {
            case 1:
                stopTimer = await LocalStorageGet("timer1")
                console.log("case 1", stopTimer)
                if (stopTimer) {
                    clearTimeout(stopTimer);
                }
                break;
            case 2:
                stopTimer = await LocalStorageGet("timer2")
                console.log("case 2", stopTimer)
                if (stopTimer) {
                    clearTimeout(stopTimer);
                }
                break;
            case 3:
                stopTimer = await LocalStorageGet("timer3")
                console.log("case 3", stopTimer)
                if (stopTimer) {
                    clearTimeout(stopTimer);
                }
                break;
            case 4:
                stopTimer = await LocalStorageGet("timer4")
                console.log("case 4", stopTimer)
                if (stopTimer) {
                    clearTimeout(stopTimer);
                }
                break;
            default:
                console.log("case 5")
                break;
        }
    }
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('beforeRemove', () => {
            // Your function to run when navigating away from this screen
            sessionEnd();
        });

        return unsubscribe;
    }, [props.navigation]);

    const sessionEnd = async () => {
        console.log("sessionEnd===============> hit");
        console.log("chatServiceId && GUIDStatic?.chatSessionId===============> hit", chatServiceId, GUIDStatic?.chatSessionId);
        var dataSessionEnd = null
        if (chatServiceId && GUIDStatic?.chatSessionId) {
            dataSessionEnd = {
                chatSessionId: GUIDStatic.chatSessionId,
                toUserID: toUserID,
                chatServiceId: chatServiceId,
                name: chatServiceId == 1 ? "Delivery" : chatServiceId == 2 ? "Support" : chatServiceId == 3 ? "Seller" : "Customer",
                guiId: GUIDStatic.guId || 'GUID'
            };
            console.log("dataSessionEnd===>", dataSessionEnd, chatServiceId)
            console.log("switch case 1 ===>", chatServiceId)

            switch (Number(chatServiceId)) {
                case 1:
                    console.log("case 1")
                    await LocalStorageSet("DeliveryChatSessionId", dataSessionEnd);
                    console.log("DeliveryChatSessionId set")
                    break;
                case 2:
                    console.log("case 2")

                    await LocalStorageSet("SupportChatSessionId", dataSessionEnd);
                    console.log("SupportChatSessionId set")
                    break;
                case 3:
                    console.log("case 3")

                    await LocalStorageSet("SellerChatSessionId", dataSessionEnd);
                    console.log("SellerChatSessionId set")
                    break;
                case 4:
                    console.log("case 4")

                    await LocalStorageSet("CustomerChatSessionId", dataSessionEnd);
                    console.log("CustomerChatSessionId set")
                    break;
                default:
                    console.log("case 5")

                    break;
            }

        }
        // Show an alert asking the user if they want to end the chat
        const showAlert = (dataSessionEnd) => {
            console.log("show alert =========================")
            Alert.alert(
                "End Chat",
                `Do you want to end this ${dataSessionEnd?.name} chat?`,
                [
                    {
                        text: "Cancel",
                        onPress: () => {
                            // If the user presses "Cancel", restart the timer and show the alert again
                            console.log("switch case 2 ===>", Number(dataSessionEnd?.chatServiceId))
                            let startTimer = null;
                            switch (Number(dataSessionEnd?.chatServiceId)) {
                                case 1:
                                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                                    setTimer1(startTimer);
                                    LocalStorageSet("timer1", startTimer)
                                    break;
                                case 2:
                                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                                    setTimer2(startTimer);
                                    LocalStorageSet("timer2", startTimer)
                                    break;
                                case 3:
                                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                                    setTimer3(startTimer);
                                    LocalStorageSet("timer3", startTimer)
                                    break;
                                case 4:
                                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                                    setTimer4(startTimer);
                                    LocalStorageSet("timer4", startTimer)
                                    break;
                                default:
                                    break;
                            }
                        },
                        style: "cancel"
                    },
                    {
                        text: "End Chat",
                        onPress: () => {
                            endChat(dataSessionEnd)
                        }
                    }
                ]
            );
        };
        console.log("chatServiceId && GUIDStatic?.chatSessionId====>", chatServiceId, GUIDStatic?.chatSessionId, dataSessionEnd)
        // Start the initial timer
        if (chatServiceId && GUIDStatic?.chatSessionId) {
            console.log(" setTimer(setTimeout(()=>showAlert(dataSessionEnd)===>", dataSessionEnd)
            console.log("switch case 4 ===>", Number(chatServiceId))
            switch (Number(chatServiceId)) {
                case 1:
                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                    setTimer1(startTimer);
                    LocalStorageSet("timer1", startTimer)
                    break;
                case 2:
                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                    setTimer2(startTimer);
                    LocalStorageSet("timer2", startTimer)
                    break;
                case 3:
                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                    setTimer3(startTimer);
                    LocalStorageSet("timer3", startTimer)
                    break;
                case 4:
                    startTimer = setTimeout(() => showAlert(dataSessionEnd), 5000)
                    setTimer4(startTimer);
                    LocalStorageSet("timer4", startTimer)
                    break;
                default:
                    break;
            }


        }

    };

    const endChat = async (dataSessionEnd) => {
        // If the user presses "End Chat", clear the timer
        console.log("switch case 4 ====>", Number(dataSessionEnd?.chatServiceId))
        switch (Number(dataSessionEnd?.chatServiceId)) {
            case 1:
                clearTimeout(timer1);
                break;
            case 2:
                clearTimeout(timer2);
                break;
            case 3:
                clearTimeout(timer3);
                break;
            case 4:
                clearTimeout(timer4);
                break;
            default:
                break;
        }
        const user = await LocalStorageGet("userId")
        // console.log("userData=========>", user)
        setUser(user)
        const chatTime = new Date();
        const chatTimeString = chatTime.toISOString();
        let body =
        {
            "guId": dataSessionEnd?.guId,
            "fromUserId": user,
            "toUserId": dataSessionEnd?.toUserID,
            "chatTopicId": dataSessionEnd?.chatServiceId,
            "chatStart": false,
            "chatTime": chatTimeString
        }
        console.log("session end body===>", body)
        console.log("session end dataSessionEnd===>", dataSessionEnd)
        try {
            switch (Number(dataSessionEnd?.chatServiceId)) {
                case 1:
                    // Handle case for Delivery
                    await LocalStorageClear("DeliveryChatSessionId");

                    break;
                case 2:
                    // Handle case for Support
                    await LocalStorageClear("SupportChatSessionId");
                    break;
                case 3:
                    // Handle case for Seller
                    await LocalStorageClear("SellerChatSessionId");
                    break;
                case 4:
                    // Handle case for Customer
                    await LocalStorageClear("CustomerChatSessionId");
                    break;
                default:
                    // Handle default case (if chatServiceId is not matched with any case)
                    break;
            }
            let response = await ChatService.startSessionChat(body)
        } catch (error) {
            // Cast 'error' to 'any' to handle the TypeScript error
            console.log('Error in session end:', error);
            // ToastAndroid.show('An error occurred while set operation hour: ' + (error).message, ToastAndroid.LONG);
        }
        console.log("Chat ended");
    }
    const intervalFunction = () => {
        // Your code to be executed every 2 seconds
        // console.log("GUID?.chatSessionId effect====>", GUIDStatic?.chatSessionId);
        if (GUIDStatic?.chatSessionId) {
            console.log("GUID?.chatSessionId effect hit====>", GUIDStatic?.chatSessionId);

            let id = GUIDStatic?.chatSessionId;
            getChat(id);
        }
    };
    useEffect(() => {
        const intervalId = setInterval(intervalFunction, 2000);

        return () => {
            // Clear the interval when the component unmounts or loses focus
            clearInterval(intervalId);
        };
    }, [GUIDStatic?.chatSessionId]);



    const getChat = async (id) => {
        console.log("get chat session id===>", id)
        try {
            if (id == undefined) {
                return;
            }
            // console.log("GUID?.ChatSessionId====>", id);
            const response = await ChatService.getChatArray(id);
            if (!response?.data?.isSuccess) {
                const errorMessage = response?.data.message || 'An error occurred during get chat.';
                ToastAndroid.show(errorMessage, ToastAndroid.LONG);
                return;
            }
            // Check if the newMessages array is different from the current messages
            // if (JSON.stringify(messages) !== JSON.stringify(newMessages)) {
            setMessages(response?.data?.payload || []);
            // }
        } catch (error) {
            console.log('Error in get chat:', error);
            // ToastAndroid.show('An error occurred while set operation hour: ' + error.message, ToastAndroid.LONG);
        }
    };



    useEffect(() => {
        (async () => {
            const user = await LocalStorageGet("userId")
            console.log("userData=========>", user)
            setUser(user)
            if (chatServiceId && !notification) {
                let DSSC = null;
                switch (Number(chatServiceId)) {
                    case 1:
                        // Handle case for Delivery
                        DSSC = await LocalStorageGet("DeliveryChatSessionId");
                        if (DSSC) {
                            GUIDStatic = { chatSessionId: DSSC?.chatSessionId, guiId: DSSC?.guId }
                            clearTimeout(timer1);
                            console.log("in switch case==>", DSSC)
                            return;
                        }
                        break;
                    case 2:
                        // Handle case for Support
                        DSSC = await LocalStorageGet("SupportChatSessionId");
                        if (DSSC) {
                            GUIDStatic = { chatSessionId: DSSC?.chatSessionId, guiId: DSSC?.guId }
                            clearTimeout(timer2);
                            console.log("in switch case==>", DSSC)
                            return;
                        }
                        break;
                    case 3:
                        // Handle case for Seller
                        DSSC = await LocalStorageGet("SellerChatSessionId");
                        if (DSSC) {
                            GUIDStatic = { chatSessionId: DSSC?.chatSessionId, guiId: DSSC?.guId }
                            clearTimeout(timer3);
                            console.log("in switch case==>", DSSC)
                            return;
                        }
                        break;
                    case 4:
                        // Handle case for Customer
                        DSSC = await LocalStorageGet("CustomerChatSessionId");
                        if (DSSC) {
                            GUIDStatic = { chatSessionId: DSSC?.chatSessionId, guiId: DSSC?.guId }
                            clearTimeout(timer4);
                            console.log("in switch case==>", DSSC)
                            return;
                        }
                        break;
                    default:
                        // Handle default case (if chatServiceId is not matched with any case)
                        break;
                }
            } else {
                switch (Number(chatServiceId && notification)) {
                    case 1:
                        // Handle case for Delivery
                        await LocalStorageClear("DeliveryChatSessionId");
                        break;
                    case 2:
                        // Handle case for Support
                        await LocalStorageClear("SupportChatSessionId");
                        break;
                    case 3:
                        // Handle case for Seller
                        await LocalStorageClear("SellerChatSessionId");
                        break;
                    case 4:
                        // Handle case for Customer
                        await LocalStorageClear("CustomerChatSessionId");
                        break;
                    default:
                        // Handle default case (if chatServiceId is not matched with any case)
                        break;
                }
            }
            // dispatch(setFloatIcon(false))
            console.log("out of switch case")
            GUIDStatic = { chatSessionId: props.route?.params?.chatSessionId, guiId: "GUID" }
        })();
        return () => {
            // This function will be called when the component is unmounted
            console.log("Component is unmounted. Do your cleanup here!");
            // setEntryPoint(false)
            // dispatch(setFloatIcon(true))
            // setGUIDd({})
            GUIDStatic = {}
            entryPoint = false
        };
    }, []);
    const sendChat = async (newMessages, GUID) => {
        const user = await LocalStorageGet("userId")
        // console.log("userData=========>", user)
        console.log("GUID send=========>", GUID)
        setUser(user)
        // console.log("newMessages===>", newMessages)
        // console.log("user===>", user)

        let body = {
            "guId": GUID?.guid,
            "msgText": newMessages[0]?.text,
            "senderId": user,
            // "chatTime": newMessages[0]?.createdAt.toISOString(),
            "chatTime": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            "chatSessionId": GUID?.chatSessionId,
            // "chatTopicId": chatServiceId,
        }

        try {
            let response = await ChatService.sendChat(body)
            if (!response?.data?.isSuccess) {
                // ToastAndroid.show(response?.data.message || 'An error occurred during send data.', ToastAndroid.LONG);
                return;
            } else {
                console.log("response send data ==>", response?.data?.payload)
                // if (messages?.length < response?.data?.payload?.length) {
                //     setMessages(response?.data?.payload);
                // }
            };

        } catch (error) {
            // Cast 'error' to 'any' to handle the TypeScript error
            console.log('Error in get chat:', error);
            // ToastAndroid.show('An error occurred while set operation hour: ' + (error).message, ToastAndroid.LONG);
        }
    }

    const sentStartSession = async (newMessages, chatStart) => {

        const user = await LocalStorageGet("userId")
        // console.log("userData=========>", user)
        setUser(user)
        const chatTime = new Date();
        const chatTimeString = chatTime.toISOString();
        let body =
        {
            "guId": "",
            "fromUserId": user,
            "toUserId": toUserID || 0,
            "chatTopicId": chatServiceId || 0,
            "chatStart": chatStart,
            "chatTime": chatTimeString
        }

        try {
            let response = await ChatService.startSessionChat(body)
            // console.error("response session data ==>", response?.data)

            // if (!response?.data?.isSuccess) {
            //     ToastAndroid.show(response?.data.message || 'An error occurred during get session.', ToastAndroid.LONG);
            //     return;
            // }
            console.log("response session data ==>", response?.data?.payload)
            // setEntryPoint(true)
            if (response?.data?.payload) {
                entryPoint = true;
                setGUIDd(response?.data?.payload)
                GUIDStatic = response?.data?.payload
                sendChat(newMessages, response?.data.payload)
                // Alert.alert(
                //     "Session Started",
                //     `session id: ${response?.data.payload.chatSessionId}`
                // );
                console.error(response?.data.payload.chatSessionId)
            }



        } catch (error) {
            // Cast 'error' to 'any' to handle the TypeScript error
            console.log('Error in get chat:', error);
            // ToastAndroid.show('An error occurred while set operation hour: ' + (error).message, ToastAndroid.LONG);
        }
    }

    const onSend = useCallback((newMessages = []) => {
        console.log("entryPoint====>", entryPoint)
        console.log("notification====>", notification)
        if (!entryPoint && !notification) {
            if (GUIDStatic?.chatSessionId) {
                return entryPoint = true
            }
            console.log("enter in start session")
            sentStartSession(newMessages, true)
        } else {
            let guidd = GUIDStatic
            console.log("GUIDStatic------- send>", GUIDStatic)
            sendChat(newMessages, guidd)
        }
    }, []);


    const renderSend = (props) => {
        // Check if there is text in the input box
        const isTextEmpty = !props.text || !props.text.trim();

        // Render the send button only if there is text in the input box
        if (!isTextEmpty) {
            return (
                <TouchableOpacity
                    onPress={() => props.onSend({ text: props.text.trim() }, true)}
                    accessibilityLabel="Send"
                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}
                >
                    {/* Your custom send icon */}
                    <FontAwesomeIcon icon={faLocationArrow} size={27} color="#f88e11" />
                </TouchableOpacity>
            );
        }

        // If there is no text in the input box, return null to hide the send button
        return null;
    };
    // console.log("GUID===>", GUIDd)
    // console.log("messages=======================================================================================================================================================================>", messages)
    return (
        <View style={{ backgroundColor: 'white', flex: 1, height: heightPercentageToDP(100) }}>
            <GiftedChat
                messages={messages}
                onSend={newMessages => onSend(newMessages)}
                user={{
                    _id: user,
                    // _id: 301,
                }}
                // renderMessage={renderMessage}
                renderSend={renderSend}
                renderAvatar={() => null}
                showAvatarForEveryMessage={true}
            // renderActions={() => (
            //     <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center', height: 45, paddingHorizontal: 10 }}>
            //         <TouchableOpacity onPress={handleAttachPress} style={{ marginRight: 10 }}>
            //             <FontAwesomeIcon icon={faPaperclip} size={20} color="#000" />
            //         </TouchableOpacity>
            //         <TouchableOpacity onPress={handleLocationPress}>
            //             {/* <FontAwesomeIcon icon={faLocationDot} size={20} color="#000" /> */}
            //             {fetchingLocation ? (
            //                 <ActivityIndicator size="small" color="#f88e11" />
            //             ) : (
            //                 <FontAwesomeIcon icon={faLocationDot} size={20} color="#000" />
            //             )}
            //         </TouchableOpacity>
            //     </View>
            // )}
            />
        </View>
    );
}

