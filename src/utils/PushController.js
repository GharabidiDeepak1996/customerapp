import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';
// var PushNotification = require("react-native-push-notification");
import {
  notificationChatSessionId,
  notificationStore,
} from '../redux/features/Notification/notificationSlice';
// const dispatch = useDispatch();
import {connect} from 'react-redux';
import Routes from '../navigation/Routes';

class PushController extends Component {
  componentDidMount() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('PUSH CONTROLLER TOKEN:', token?.token);
        (async () => {
          await AsyncStorage.setItem(
            'firebaseToken',
            JSON.stringify(token?.token),
          );
          //await LocalStorageSet("firebaseToken", token?.token)
        })();
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: notification => {
        // Assuming you have access to dispatch as a prop through connect
        const {dispatch} = this.props;

        console.log('NOTIFICATION 1=================>:', notification);
        if (notification?.data?.screen === 'Chat') {
          console.log('notification 2==================>', notification);
          console.log('screen==================>', notification?.data?.screen);
          console.log(
            'notificationChatSessionId==================>',
            notification?.data?.chatSessionId,
          );
          this.props.navigation.navigate(Routes?.ChatUs, {
            chatSessionId: notification?.data?.chatSessionId,
            notification: true,
            chatServiceId: notification?.data?.chatTopicId,
          });
        }

        try {
          console.log('notification===>', notification);
          console.log('notification?.title===>', notification?.title);
          console.log(
            'notification?.data.message===>',
            notification?.data?.message,
          );
          PushNotification.localNotification({
            channelId: 'your_channel_1',
            title: notification?.title || 'Delivery App',
            message: notification?.data?.message || 'Message',
            // add any other properties you want to customize
          });
        } catch (error) {
          console.error(error);
        }
      },
      // Android only
      senderID: '119095786908',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }
  render() {
    return null;
  }
}
export default connect()(PushController);
