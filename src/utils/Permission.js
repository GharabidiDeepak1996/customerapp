import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message:
          'To continue, turn on device location which uses Google’s location services.',
        // buttonNeutral: 'Ask Me Later',
        // buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted. You can now use Geolocation.');
      //getLocation();
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log(
        'Location permission denied, and user selected "Never Ask Again".',
      );
      // Show an alert explaining the necessity of location permission and guide the user to settings
      Alert.alert(
        'Location Permission Required',
        'To use this app, please enable location services in your device settings.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Redirect the user to app settings
              if (Platform.OS === 'android') {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return false;
    } else {
      console.log('Location permission denied.');
      // Show an alert informing the user about the necessity of location permission
      Alert.alert(
        'Location Permission Required',
        'To use this app, please grant location access.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Close the app
              if (Platform.OS === 'android') {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return false;
    }
  } catch (err) {
    console.error('Error requesting location permission:', err);
    return false;
  }
};

export const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'To continue, turn on device storage to save photos.',
        buttonPositive: 'OK',
      },
    );

    // Handle the result of the permission request accordingly
    // ...
  } catch (error) {
    console.log('Error requesting storage Permission:', error);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message:
          'To continue, turn on device notification which uses Google’s notification services.',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('notification permission granted.');
      //getLocation();
      return true;
    }
  } catch (error) {
    console.log('Error requesting notification permission:', error);
  }
};
