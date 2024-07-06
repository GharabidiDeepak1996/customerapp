import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { Divider, Text } from 'react-native-elements';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BaseView from '../BaseView';
import { Styles } from './Styles';
import AppButton from '../../components/Application/AppButton/View';
import Routes from '../../navigation/Routes';
import { StackActions, useTheme } from '@react-navigation/native';
import Config from '../../../branding/carter/configuration/Config';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import { useFocusEffect } from '@react-navigation/native';
import { AuthService, TrackService } from '../../apis/services';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, AnimatedRegion, Polygon } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getCurrentLocation, locationPermission } from './helper/helperFunction';
import AppConfig from '../../../branding/App_config';
import { Linking } from 'react-native';
import { formatNumberWithCommas } from '../../utils/FormatNumberWithCommas';
import Globals from '../../utils/Globals';
import { BackHandler } from 'react-native';
import { LocalStorageGet } from '../../localStorage';
import Markers from './component/markers';
import moment from 'moment';
import FlexibleBottomSheetModal from './component/legsBottomSheet';
import MapTrackDetails from './component/maptrackdetails';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
let LATITUDE_DELTA = 0.04;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const toRadians = (degrees) => degrees * (Math.PI / 180);
// const toDegrees = (radians) => radians * (180 / Math.PI);
//https://medium.com/@ndyhrdy/making-the-bottom-sheet-modal-using-react-native-e226a30bed13

export const MapTrackOrder = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const screenStyles = Styles(scheme, colors);

  //reference
  const mapRef = useRef();
  const markerRef = useRef();
  //local states
  const [chatService, setChatService] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [stateCoordinates, setStateCoordinates] = useState({
    startCords: {
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    dropCords: {
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    trainCords: {
      //Kai
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    shipCords: {
      //ASDP (Markap)
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    bikeCords: {
      //wasli or JNE
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    liveCords: {
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: new AnimatedRegion({
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    response: {},
    time: 0,
    distance: 0,
    heading: 0,
    isLoading: false,
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // const [panY] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(Dimensions.get('screen').height));
  const waveRadius1 = useRef(new Animated.Value(50)).current;
  const waveRadius2 = useRef(new Animated.Value(50)).current;
  const waveRadius3 = useRef(new Animated.Value(50)).current;
  const animatedValue1 = useRef(new Animated.Value(50)).current;
  const animatedValue2 = useRef(new Animated.Value(50)).current;
  const animatedValue3 = useRef(new Animated.Value(50)).current;

  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 500,
  });

  //props
  const { categoryTypeId, orderId, product, totalRp } = props.route.params;
  const notificationSlice = useSelector(
    state => state.notification.notificationMessage,
  );

  const {
    startCords,
    dropCords,
    trainCords,
    shipCords,
    bikeCords,
    liveCords,
    coordinate,
  } = stateCoordinates;
  const updateCoordinates = data =>
    setStateCoordinates(state => ({ ...state, ...data }));

  const [speed, setSpeed] = useState(0);
  const [direction, setDirection] = useState(0);
  const toDegrees = radians => radians * (180 / Math.PI);
  const toRad = value => (value * Math.PI) / 180;
  const [currentPosition, setNewPosition] = useState({ lat: 0.0, long: 0.0 });
  let [previousPosition, setPreviousPosition] = useState({ lat: 0.0, long: 0.0 });

  const updateCurrentPosition = data =>
    setNewPosition(state => ({ ...state, ...data }));
  const autoRefreshTrackingInterval = useSelector(
    state => state.dashboard.AutoRefreshTrackingInterval,
  );
  let ShowHeading = useSelector(state => state.dashboard.ShowHeading); //deepak add

  // useEffect(() => {
  //   const animateWave = () => {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(waveRadius1, {
  //           toValue: 60,
  //           duration: 1000,
  //           easing: Easing.linear,
  //           useNativeDriver: false,
  //         }),
  //         Animated.timing(waveRadius1, {
  //           toValue: 20,
  //           duration: 1000,
  //           easing: Easing.linear,
  //           useNativeDriver: false,
  //         }),
  //       ]),
  //       { iterations: -1 },
  //     ).start();

  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(waveRadius2, {
  //           toValue: 40,
  //           duration: 1000,
  //           easing: Easing.linear,
  //           useNativeDriver: false,
  //         }),
  //         Animated.timing(waveRadius2, {
  //           toValue: 20,
  //           duration: 1000,
  //           easing: Easing.linear,
  //           useNativeDriver: false,
  //         }),
  //       ]),
  //       { iterations: -1 },
  //     ).start();
  //   };

  //   animateWave();

  //   return () => {
  //     waveRadius1.stopAnimation();
  //     waveRadius2.stopAnimation();
  //     waveRadius3.stopAnimation();
  //   };
  // }, [waveRadius1, waveRadius2, waveRadius3]);

  useEffect(() => {
    (async () => {
      const chatService = await LocalStorageGet('chatService');
      setChatService(chatService);
    })();
    getMapTrackOrder();
  }, []);

  useEffect(() => {
    let timeInterval = autoRefreshTrackingInterval * 1000;
    const interval = setInterval(() => {
      // Your refresh logic here, e.g., fetching new data
      console.log('TimeInterval-------', timeInterval);

      getMapTrackOrder();
    }, timeInterval);
    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  //backpress
  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate(Routes.DASHBOARD_VARIENT_1);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //
  useEffect(() => {
    setPreviousPosition(currentPosition); // Save the current position as the previous position
    updateCurrentPosition({
      lat: liveCords.latitude,
      long: liveCords?.longitude,
    }); // Update the current position
    calculateBearing(
      previousPosition?.lat,
      previousPosition?.long,
      currentPosition?.lat,
      currentPosition?.long,
    );
  }, [liveCords.latitude]);

  const getMapTrackOrder = async () => {
    try {
      let response = await TrackService.getMapTrackOrders(orderId);
      if (response?.data?.isSuccess) {
        setIsLoading(false);

        const data = await response.data.payload;

        updateCoordinates({
          startCords: {
            latitude: data?.originLatitiude,
            longitude: data?.originLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          dropCords: {
            latitude: data?.destinationLatitude,
            longitude: data?.destinationLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coordinate: new AnimatedRegion({
            latitude: data?.liveLatitude,
            longitude: data?.liveLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
          liveCords: {
            latitude:
              data?.liveLatitude == 0
                ? data?.segments?.find(
                  segment => segment?.sequenceId === data.sequenceId,
                )?.pickUpLatitude
                : data?.liveLatitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,

            longitude:
              data?.liveLongitude == 0
                ? data?.segments?.find(
                  segment => segment?.sequenceId === data.sequenceId,
                )?.pickUpLongitude
                : data?.liveLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          response: data,
          heading: data?.heading,
        });

        if (data?.liveLatitude !== 0 && data?.liveLongitude !== 0) {
          animate(data?.liveLatitude, data?.liveLongitude);
        }
      } else {
        ToastAndroid.show(
          'Something went wrong, please try again later..',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.log('Error in get Track Order:', error);
      ToastAndroid.show(
        'An error occurred while get Track Order: ' + error.message,
        ToastAndroid.LONG,
      );
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }]),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 0 && gs.vy > 2) {
          return closeAnim.start(() => setModalVisible(false));
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;

  const handleDismiss = () => {
    closeAnim.start(() => {
      setModalVisible(false);
      //props.onDismiss();
    });
  };

  const renderOrderHeader = (item, key, itemLength, sequenceId) => {
    return (
      <View style={[screenStyles.contentContainer]}>
        <View style={screenStyles.orderStatusItemContainer}>
          <View style={[screenStyles.orderStatusLeftContainer, { flex: 1 }]}>
            {
              <View
                style={{
                  //key != itemLength - 1 &&
                  borderStyle: 'dashed',
                  borderColor: '#555555',
                  borderLeftWidth: 1,
                  position: 'absolute',
                  height: '100%',
                }}
              />
            }

            <View
              style={[
                screenStyles.orderStatusLeftIconContainer,
                {
                  //FF5B61
                  backgroundColor:
                    item.sequenceId > sequenceId
                      ? 'gray'
                      : item.sequenceId == sequenceId
                        ? colors.activeColor
                        : item.sequenceId < sequenceId
                          ? '#555555'
                          : '',
                  width: hp('4'),
                  height: hp('4'),
                },
              ]}>
              {item?.operatorId == 2 && (
                <SvgIcon
                  type={IconNames.TrackBike}
                  width={18}
                  height={18}
                  color={'white'}
                />
              )}
              {item?.operatorId == 1 && (
                <SvgIcon
                  type={IconNames.TrackShip}
                  width={18}
                  height={18}
                  color={'white'}
                />
              )}
              {item?.operatorId == 3 && (
                <SvgIcon
                  type={IconNames.TrackTrain}
                  width={20}
                  height={20}
                  color={'white'}
                />
              )}

              {item?.operatorId == 4 && (
                <SvgIcon
                  type={IconNames.TrackBike}
                  width={18}
                  height={18}
                  color={'white'}
                />
              )}
              {item?.operatorId == 5 && (
                <SvgIcon
                  type={IconNames.TrackDamri}
                  width={18}
                  height={18}
                  color={'white'}
                />
              )}
            </View>

            <View>
              <Text
                style={[
                  screenStyles.subtitleText,
                  {
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: 'gray',
                    paddingHorizontal: 5,
                    paddingTop: 3,
                    textTransform: 'uppercase',
                    backgroundColor: 'white',
                    marginTop: 0,
                    marginBottom: 18,
                    fontSize: 10,
                    textAlign: 'center',
                    flexWrap: 'wrap',
                  },
                ]}>
                {item?.operator}
              </Text>
            </View>
          </View>

          <View
            style={[
              screenStyles.orderTitleContainer,
              { flex: 6, paddingTop: 0, marginLeft: 4, marginBottom: 10 },
            ]}>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 28,
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    screenStyles.subtitleValueText,
                    { fontSize: 12, flex: 1 },
                  ]}>
                  {item?.stopName}
                </Text>
                {/* <Text style={[screenStyles.subtitleText, {textAlign: 'right'}]}>
                  {' '}
                  {moment(item.jobStatusDatetime).format('MMM DD,YYYY')}
                </Text> */}
              </View>
              <View style={{ marginTop: 3 }}>
                {item?.jobStatus?.length != 0 ? (
                  item?.jobStatus?.map((stops, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: 2,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            screenStyles.subtitleText,
                            { fontSize: 18, marginVertical: 0, marginRight: 6 },
                          ]}>
                          •
                        </Text>
                        <Text
                          style={[
                            screenStyles.subtitleText,
                            { fontSize: 10, marginVertical: 0, paddingRight: 20 },
                          ]}>
                          {moment(stops.jobStatusDatetime).format(
                            'MMM DD,YYYY hh:mm A',
                          )}{' '}
                          {stops.jobStatusName != ''
                            ? '- ' + stops.jobStatusName
                            : ''}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <View>
                    <Text
                      style={[
                        screenStyles.subtitleText,
                        { fontSize: 10, marginVertical: 0 },
                      ]}>
                      {' '}
                      {/* • In Transit */}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getMarkerImage = (operatorId, type) => {
    let imageSource;
    switch (operatorId) {
      case 1: // ASDP (Markap)
        imageSource =
          type === 'pickup'
            ? require('../../../branding/carter/assets/images/map_port.png')
            : null;
        break;
      case 2: // Wasli
        imageSource =
          type === 'pickup'
            ? require('../../../branding/carter/assets/images/marker_home.png')
            : null;
        break;
      case 4: // JNE
        imageSource =
          type === 'pickup'
            ? require('../../../branding/carter/assets/images/map_hub.png')
            : null;
        break;
      case 3: // Kai
        imageSource =
          type === 'pickup'
            ? require('../../../branding/carter/assets/images/map_train.png')
            : require('../../../branding/carter/assets/images/map_train.png');
        break;
      default:
        imageSource = null;
    }
    return (
      imageSource && (
        <Image source={imageSource} style={{ width: 30, height: 30 }} />
      )
    );
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        const region = {
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          latitudeDelta: LATITUDE_DELTA, // Smaller delta values will zoom in more
          longitudeDelta: LONGITUDE_DELTA, // Smaller delta values will zoom in more
        };
        //mapRef.current.animateToRegion(region, 5000);
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 10000);

        // markerRef.current.animateToRegion(newCoordinate, 7000);
        mapRef.current.animateToRegion(region);
      }
    } else {
      //coordinate.timing().start();
      liveCords.timing(newCoordinate).start();
    }
  };

  // useEffect(() => {
  //   calculateBearing()
  // }, [])
  const haversine = (lat1, lon1, lat2, lon2) => {
    const r = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = r * c; // Distance in kilometers
    return d;
  };

  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    //const distance = haversine(lat1, lon1, lat2, lon2);

    // const timeDiff = (location.timestamp - prevTime) / 1000; // Time difference in seconds
    // const newSpeed = distance / timeDiff; // Speed in km/s
    // setSpeed(newSpeed);

    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.cos(toRad(lon2 - lon1));
    const newDirection = toDegrees(Math.atan2(y, x));
    setDirection(newDirection);
  };

  const getOpacity = response => {
    //const operatorIds = [1, 2, 3, 4, 5];
    const operatorId = response?.operatorId;
    if (operatorId === 3) {
      return response?.segments?.some(
        segment => segment?.operatorId === 3 && segment?.tracking,
      )
        ? 1
        : 0;
    } else if (operatorId === 1) {
      return response?.segments?.some(
        segment => segment?.operatorId === 1 && segment?.tracking,
      )
        ? 1
        : 0;
    } else if (operatorId === 2 || operatorId === 4) {
      return response?.segments?.some(
        segment =>
          (segment?.operatorId === 2 || segment?.operatorId === 4) &&
          segment?.tracking,
      )
        ? 1
        : 0;
    } else if (operatorId === 5) {
      return response?.segments?.some(
        segment => segment?.operatorId === 5 && segment?.tracking,
      )
        ? 1
        : 0;
    }
    return 0;
    // return segments?.some(segment => operatorIds.includes(segment?.operatorId) && segment?.tracking) ? 1 : 0;
  };
  return (
    <BaseView
      navigation={props.navigation}
      title={'Order# ' + orderId}
      subTitle={'MapTrack'}
      headerWithBack={true}
      onBackPress={() => {
        props.navigation.navigate(Routes.MY_ORDERS)
      }}
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={screenStyles.container}>
            {stateCoordinates?.response?.segments?.length == 0 ? (
              <View style={{ height: '100%', justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center' }}>No data found!!</Text>
              </View>
            ) : (
              <View style={{ height: '100%', width: '100%' }}>
                {stateCoordinates?.response?.originLatitiude && (
                  <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                      latitude: stateCoordinates?.response?.segments?.find(
                        segment =>
                          segment?.sequenceId ==
                          stateCoordinates?.response?.sequenceId,
                      )?.pickUpLatitude,
                      longitude: stateCoordinates?.response?.segments?.find(
                        segment =>
                          segment?.sequenceId ==
                          stateCoordinates?.response?.sequenceId,
                      )?.pickUpLongitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
                    onRegionChangeComplete={async region => {
                      // const coords = await mapRef?.current?.getCamera();
                      LATITUDE_DELTA = region?.latitudeDelta;
                      LONGITUDE_DELTA = region?.longitudeDelta;
                      console.log('coords', region);
                    }}
                  // initialCamera={{
                  //   center: {
                  //     latitude: stateCoordinates?.response?.segments?.find(segment => segment?.sequenceId == stateCoordinates?.response?.sequenceId)?.pickUpLatitude,
                  //     longitude: stateCoordinates?.response?.segments?.find(segment => segment?.sequenceId == stateCoordinates?.response?.sequenceId)?.pickUpLongitude
                  //   },

                  //   pitch: 90, // Change this value to set the desired pitch
                  //   heading: 0, // Direction faced by the camera, in degrees clockwise from North.
                  //   zoom: 13,
                  // }}
                  >
                    {/*Live markar */}
                    {stateCoordinates?.response?.orderStatusId != 6 && (
                      <Marker.Animated
                        pinColor={'green'}
                        visible={false}
                        // tracksViewChanges={false}
                        ref={markerRef}
                        coordinate={liveCords}
                        icon={{
                          uri:
                            stateCoordinates?.response?.operatorId === 3
                              ? `${Globals.imgBaseURL}/Map/map-kai.png`
                              : stateCoordinates?.response?.operatorId === 1
                                ? `${Globals.imgBaseURL}/Map/map-asdp.png`
                                : stateCoordinates?.response?.operatorId === 2 ||
                                  stateCoordinates?.response?.operatorId === 4
                                  ? `${Globals.imgBaseURL}/Map/map-wasli.png`
                                  : stateCoordinates?.response?.operatorId === 5
                                    ? `${Globals.imgBaseURL}/Map/map-damri.png`
                                    : null, // Provide a default value or handle the case where none of the conditions are met
                        }}
                        // image={stateCoordinates?.response?.operatorId == 3 ? require('../../../branding/carter/assets/images/map_train_live.png')
                        //   : stateCoordinates?.response?.operatorId == 1 ? require('../../../branding/carter/assets/images/map_ship_live.png')
                        //     : (stateCoordinates?.response?.operatorId == 2 || stateCoordinates?.response?.operatorId == 4) ? require('../../../branding/carter/assets/images/map-bikeV1.png')
                        //       : ""}
                        title={
                          stateCoordinates?.response?.operatorId == 3
                            ? 'KALOG'
                            : stateCoordinates?.response?.operatorId == 1
                              ? 'ASDP (Markap)'
                              : stateCoordinates?.response?.operatorId == 2 ||
                                stateCoordinates?.response?.operatorId == 4
                                ? stateCoordinates?.response?.driverName
                                : stateCoordinates?.response?.operatorId == 5
                                  ? 'DAMRI'
                                  : ''
                        }
                        //rotation={45}
                        flat={true}
                        style={{
                          transform: [
                            {
                              rotate: (() => {
                                if (ShowHeading === 1) {
                                  const operatorId =
                                    stateCoordinates?.response?.operatorId;
                                  if (operatorId === 2 || operatorId === 4) {
                                    return `${stateCoordinates.response.heading}deg`;
                                  }
                                  return `${direction}deg`;
                                }
                                return '0deg';
                              })(),
                            },
                          ],
                          opacity: getOpacity(stateCoordinates?.response),
                        }}

                      //anchor={{ x: 1, y: .5 }}
                      // style={{
                      //   transform: [{
                      //     rotate: `${(stateCoordinates?.response?.operatorId == 2 || stateCoordinates?.response?.operatorId == 4) ?
                      //       stateCoordinates?.response?.heading : direction}deg`
                      //   }]
                      //   //transform: [{ rotate: direction === undefined ? '0deg' : `${direction}deg` }]
                      // }}
                      />
                    )}

                    {/* segment */}
                    {stateCoordinates?.response?.segments?.map(
                      (segment, index) => {
                        const pickupLocation = { latitude: 0, longitude: 0 };
                        const dropOffLocation = { latitude: 0, longitude: 0 };
                        if (segment?.operatorId == 1) {
                          pickupLocation.latitude = segment?.pickUpLatitude;
                          pickupLocation.longitude = segment?.pickUpLongitude;
                          dropOffLocation.latitude = segment?.dropOffLatitude;
                          dropOffLocation.longitude = segment?.dropOffLongitude;
                        }
                        // Check if this is the last segment
                        const isLastSegment =
                          index ===
                          stateCoordinates?.response?.segments?.length - 1;
                        return (
                          <React.Fragment key={index}>
                            {/* Marker */}
                            <Marker.Animated
                              coordinate={{
                                latitude: segment?.pickUpLatitude,
                                longitude: segment?.pickUpLongitude,
                              }}
                              title={segment?.operator}
                              icon={{
                                uri:
                                  segment?.operatorId == 3
                                    ? `${Globals.imgBaseURL}/Map/marker-station.png`
                                    : segment?.operatorId == 1
                                      ? `${Globals.imgBaseURL}/Map/marker-ship.png`
                                      : segment?.operatorId == 2
                                        ? `${Globals.imgBaseURL}/Map/marker-sender.png`
                                        : segment?.operatorId == 4
                                          ? `${Globals.imgBaseURL}/Map/marker-hub.png`
                                          : segment?.operatorId == 5
                                            ? `${Globals.imgBaseURL}/Map/marker-busstop.png`
                                            : undefined,
                              }}
                            />

                            {/* Marker for drop-off location of the last segment */}
                            {isLastSegment && (
                              <Marker.Animated
                                coordinate={{
                                  latitude: segment?.dropOffLatitude,
                                  longitude: segment?.dropOffLongitude,
                                }}
                                title="Drop"
                                icon={{
                                  uri: `${Globals.imgBaseURL}/Map/marker-sender.png`,
                                }}
                              />
                            )}

                            {/* {getMarkerImage(segment?.operatorId, 'pickup')}
                      </Marker.Animated> */}
                            {stateCoordinates?.response?.operatorId !== 1 && (
                              <MapViewDirections
                                origin={{
                                  latitude:
                                    liveCords.latitude == 0
                                      ? segment?.sequenceId ==
                                      stateCoordinates?.response
                                        ?.sequenceId &&
                                      segment?.pickUpLatitude
                                      : liveCords.latitude,
                                  longitude:
                                    liveCords.longitude == 0
                                      ? segment?.sequenceId ==
                                      stateCoordinates?.response
                                        ?.sequenceId &&
                                      segment?.pickUpLongitude
                                      : liveCords.longitude,
                                  // latitude: liveCords.latitude == 0 ? segment?.sequenceId == stateCoordinates?.response?.sequenceId && segment?.pickUpLatitude : liveCords.latitude,
                                  // longitude: liveCords.longitude == 0 ? segment?.sequenceId == stateCoordinates?.response?.sequenceId && segment?.pickUpLongitude : liveCords.longitude,
                                }}
                                destination={{
                                  // latitude: segment?.dropOffLatitude,
                                  // longitude: segment?.dropOffLongitude,
                                  latitude:
                                    segment?.sequenceId ==
                                    stateCoordinates?.response?.sequenceId &&
                                    segment?.dropOffLatitude,
                                  longitude:
                                    segment?.sequenceId ==
                                    stateCoordinates?.response?.sequenceId &&
                                    segment?.dropOffLongitude,
                                }}
                                apikey={Globals.googleApiKey}
                                mode={
                                  stateCoordinates?.response?.operatorId == 2 ||
                                    stateCoordinates?.response?.operatorId == 4 ||
                                    stateCoordinates?.response?.operatorId == 5
                                    ? 'DRIVING'
                                    : stateCoordinates?.response?.operatorId ==
                                      3
                                      ? 'TRANSIT'
                                      : ''
                                }
                                strokeWidth={3.5}
                                strokeColor="#0f53ff"
                                optimizeWaypoints={true}
                                onStart={params => {
                                  console.log(
                                    `Started routing between "${params}" and "${params}"`,
                                  );
                                }}
                                onReady={result => {
                                  console.log(
                                    `Distance: ${result?.distance} km`,
                                  );
                                  console.log(
                                    `Duration: ${result?.duration} min.`,
                                  );
                                  //fetchTime(result.distance, result.duration),
                                  mapRef.current.fitToCoordinates(
                                    result?.coordinates,
                                    {
                                      edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                      },
                                    },
                                  );
                                }}
                                onError={errorMessage => {
                                  // console.log('GOT AN ERROR');
                                }}
                              />
                            )}

                            {stateCoordinates?.response?.operatorId == 1 && (
                              <Polygon
                                strokeWidth={3.5}
                                strokeColor="#0f53ff"
                                coordinates={[pickupLocation, dropOffLocation]}
                              />
                            )}
                          </React.Fragment>
                        );
                      },
                    )}

                    {/* drop marker */}
                  </MapView>
                )}
                {isLoading && ( // Show loader when loading
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    }}>
                    <ActivityIndicator
                      size="large"
                      color={colors.activeColor}
                    />
                  </View>
                )}
                {stateCoordinates?.response?.orderStatusId == 6 && (
                  <View
                    style={{
                      //  marginRight: wp(2),
                      width: '100%',
                      height: 40,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={screenStyles.subtitleValueText2}>
                      Order Completed
                    </Text>
                  </View>
                )}
                {/* bottom refresh */}
                <View
                  style={{
                    backgroundColor: 'white',
                    width: 40,
                    height: 40,
                    borderRadius: 32,
                    alignSelf: 'flex-end',
                    marginTop: 6,
                    marginRight: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('is--------------------------refresh');
                      setIsLoading(true); // Show loader
                      getMapTrackOrder();
                    }}>
                    <SvgIcon
                      type={IconNames.RotateRight}
                      width={18}
                      height={18}
                      color={'red'}
                    />
                  </TouchableOpacity>
                </View>
                {/* bottom container */}
                <View style={screenStyles.mapBottomContainer}>
                  <View style={{ flex: 0.25, alignItems: 'center' }}>
                    {/* <View style={[screenStyles.ringContainer1]}>
                  <Animated.View
                    style={[
                      screenStyles.wave1,
                      { width: waveRadius1, height: waveRadius1 },
                    ]}
                  /> */}

                    <View style={[screenStyles.ringContainer2]}>
                      <Animated.View
                        style={[
                          screenStyles.wave2,
                          { width: waveRadius2, height: waveRadius2 },
                        ]}
                      />

                      <View style={[screenStyles.ringContainer3]}>
                        {/* <Animated.View style={[screenStyles.wave3, { width: waveRadius3, height: waveRadius3 }]} /> */}

                        <SvgIcon
                          type={IconNames.Box}
                          width={12}
                          height={12}
                          color={'white'}
                        />
                      </View>
                    </View>
                    {/* </View> */}
                    <View style={{ marginTop: 2 }}>
                      <Text style={screenStyles.currentOperatorTitle}>
                        {stateCoordinates?.response?.operator}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, marginLeft: 6, marginTop: 10 }}>
                    <Text style={screenStyles.subtitleValueText}>
                      {/* {moment(stateCoordinates?.response?.segments[0]?.jobStatusDatetime).format(
                    'hh:mm',
                  )}{' '}
                  -  */}
                      {stateCoordinates?.response?.stopName != null
                        ? stateCoordinates?.response?.stopName
                        : 'No Data found'}
                    </Text>

                    <Text
                      style={[
                        screenStyles.subtitleText,
                        {
                          fontSize: 13,
                          textDecorationLine: 'underline',
                          color: colors.activeColor,
                        },
                      ]}
                      onPress={toggleModal}>
                      More tracking details
                    </Text>
                  </View>
                  <View style={{ flex: 0.35, marginTop: 10 }}>
                    <Text style={[screenStyles.subtitleText]}>
                      {' '}
                      {moment(
                        stateCoordinates?.response?.jobStatusDatetime,
                      ).format('MMM DD,YYYY')}
                    </Text>
                  </View>
                </View>
                {/* Model */}
                <MapTrackDetails
                  activeColor={colors.activeColor}
                  mapTrackData={stateCoordinates?.response}
                  isModalVisible={isModalVisible}
                  setModalVisible={setModalVisible}
                  top={top}
                  panHandlers={panResponder.panHandlers}
                  handleDismiss={handleDismiss}
                  renderOrderHeader={renderOrderHeader}
                  screenStyles={screenStyles}
                />
              </View>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
