import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from 'react-native';
import { Divider, Text } from 'react-native-elements';
import {
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
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getCurrentLocation, locationPermission } from './helper/helperFunction';
import AppConfig from '../../../branding/App_config';
import { Linking } from 'react-native';
import { formatNumberWithCommas } from '../../utils/FormatNumberWithCommas';
import Globals from '../../utils/Globals';
import { BackHandler } from 'react-native';
import { LocalStorageGet } from '../../localStorage';
import mapStyle from './mapStyle.json';

const Fonts = AppConfig.fonts.default;
const Typography = AppConfig.typography.default;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
let LATITUDE_DELTA = 0.04;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const SingleMapTrackOrder = props => {

    //Theme based styling and colors
    const scheme = useColorScheme();
    const { colors } = useTheme();
    const screenStyles = Styles(scheme, colors);

    //reference
    const mapRef = useRef();
    const markerRef = useRef();

    //local states
    const autoRefreshTrackingInterval = useSelector(state => state.dashboard.AutoRefreshTrackingInterval);

    const [chatService, setChatService] = useState([]);
    const [trackData, setTackData] = useState([]);
    const [mapTrackData, setMapTackData] = useState();
    const [eta, setEta] = useState(0);
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
        ShopCords: {
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
        isLoading: false,
        response: {},
        time: 0,
        distance: 0,
        heading: 0,
    });

    //props
    const { categoryTypeId, orderId, product, totalRp } = props.route.params;
    const notificationSlice = useSelector(
        state => state.notification.notificationMessage,
    );

    const { startCords, dropCords, ShopCords, coordinate } = stateCoordinates;
    const updateCoordinates = (data) => setStateCoordinates((state) => ({ ...state, ...data }));

    const [currentNewPosition, setNewPosition] = useState({ lat: 0.0, long: 0.0 });
    let [previousPosition, setPreviousPosition] = useState({ lat: 0.0, long: 0.0 });
    const updateCurrentPosition = (data) => setNewPosition((state) => ({ ...state, ...data }));

    const toDegrees = (radians) => radians * (180 / Math.PI);
    const toRad = (value) => (value * Math.PI) / 180;
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        (async () => {
            const chatService = await LocalStorageGet('chatService');
            setChatService(chatService);
        })();

        getMapTrackOrder();
    }, []);

    useEffect(() => {
        let timeInterval = (autoRefreshTrackingInterval * 1000)

        const interval = setInterval(() => {
            // Your refresh logic here, e.g., fetching new data
            getMapTrackOrder();

        }, timeInterval);
        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, []);

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



    const getMapTrackOrder = async () => {
        try {
            let response = await TrackService.getSingleMapTrackOrders(orderId);

            if (response?.data?.isSuccess) {
                setIsLoading(false);
                const data = await response.data.payload;
                if (data?.driverLatitude !== 0 && data?.driverLongitude !== 0) {
                    animate(data?.driverLatitude, data?.driverLongitude);
                }
                updateCoordinates({
                    startCords: {
                        latitude: data?.driverLatitude,
                        longitude: data?.driverLongitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    dropCords: {
                        latitude: data?.dropOffLatitude,
                        longitude: data?.dropOffLongitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    ShopCords: {
                        latitude: data?.pickUpLatitude,
                        longitude: data?.pickUpLongitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    coordinate: new AnimatedRegion({
                        latitude: data?.driverLatitude,
                        longitude: data?.driverLongitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }),
                    response: data,
                    heading: data?.heading
                });
            } else {
                ToastAndroid.show(
                    response?.data.message || 'An error occurred during get Track Order.',
                    ToastAndroid.LONG,
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



    useEffect(() => {
        // Save the current position as the previous position
        updateCurrentPosition({
            lat: stateCoordinates?.response?.driverLatitude == 0 ? stateCoordinates?.response?.pickUpLatitude : stateCoordinates?.response?.driverLatitude
            , long: stateCoordinates?.response?.driverLongitude == 0 ? stateCoordinates?.response?.pickUpLongitude : stateCoordinates?.response?.driverLongitude
        }) // Update the current position
        setPreviousPosition(currentNewPosition);
        calculateBearing(previousPosition?.lat, previousPosition?.long, currentNewPosition?.lat, currentNewPosition?.long)

    }, [stateCoordinates?.response?.driverLatitude])

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
    }

    const haversine = (lat1, lon1, lat2, lon2) => {
        const r = 6371; // Earth's radius in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = r * c; // Distance in kilometers
        return d;
    };

    const calculateBearing = (lat1, lon1, lat2, lon2) => {
        // const distance = haversine(lat1, lon1, lat2, lon2);
        //const timeDiff = (location.timestamp - prevTime) / 1000; // Time difference in seconds
        //const newSpeed = distance / timeDiff; // Speed in km/s


        const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
        const x =
            Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
        const newDirection = toDegrees(Math.atan2(y, x));
        //console.log("MapDirection------", newDirection)
        setDirection(newDirection);
    }

    return (
        <BaseView
            navigation={props.navigation}
            title={'Order# ' + orderId}
            subTitle={'MapTrack'}
            headerWithBack={true}
            applyBottomSafeArea
            childView={() => {
                return (
                    <View style={screenStyles.container}>
                        {stateCoordinates?.response?.pickUpLatitude && (
                            <MapView
                                ref={mapRef}
                                paddingAdjustmentBehavior="automatic"
                                //customMapStyle={mapStyle}
                                onRegionChangeComplete={async (region) => {
                                    // const coords = await mapRef?.current?.getCamera();
                                    LATITUDE_DELTA = region?.latitudeDelta
                                    LONGITUDE_DELTA = region?.longitudeDelta
                                    //console.log('coords', region);
                                }}
                                style={StyleSheet.absoluteFill}
                                initialRegion={{
                                    latitude: stateCoordinates?.response?.pickUpLatitude,
                                    longitude: stateCoordinates?.response?.pickUpLongitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA
                                }}
                                // anchor={{ x: 0.5, y: 0.5 }}
                                zoomEnabled={true}
                                showsTraffic={false}
                                showsMyLocationButton={true}
                            >

                                {/* live  */}
                                <Marker.Animated
                                    ref={markerRef}
                                    //  coordinate={stateCoordinates?.coordinate}
                                    coordinate={{
                                        latitude: previousPosition.lat || 0.0,
                                        longitude: previousPosition.long || 0.0
                                    }}
                                    title="Bike"
                                    anchor={{ x: 0.5, y: 0.5 }}
                                    flat={true}
                                    icon={{
                                        uri: `${Globals.imgBaseURL}/Map/map-wali.png`,
                                        // scale: 1.0
                                    }}
                                    // image={ require('../../../branding/carter/assets/images/map-bikeV1.png')}
                                    style={{
                                        transform: [{ rotate: `${stateCoordinates?.response?.heading}deg` }]
                                        // transform: [{ rotate: direction === undefined ? '0deg' : `${direction}deg` }]
                                    }} />


                                {/* Source */}
                                <Marker.Animated
                                    coordinate={ShopCords}
                                    title="Pick-up"
                                    pinColor="blue"
                                    icon={{ uri: `${Globals.imgBaseURL}/Map/marker-sender.png`, }} />


                                {/* destination */}
                                <Marker.Animated
                                    coordinate={dropCords}
                                    title="Drop-off"
                                    pinColor="tomato"
                                    icon={{ uri: `${Globals.imgBaseURL}/Map/marker-receiver.png`, }} />



                                <MapViewDirections
                                    origin={{
                                        latitude: stateCoordinates?.response?.driverLatitude == 0 ? stateCoordinates?.response?.pickUpLatitude : stateCoordinates?.response?.driverLatitude,
                                        longitude: stateCoordinates?.response?.driverLongitude == 0 ? stateCoordinates?.response?.pickUpLongitude : stateCoordinates?.response?.driverLongitude,
                                        //latitude: previousPosition?.lat || 0.0,
                                        //longitude: previousPosition?.lat || 0.0,
                                    }}
                                    destination={{
                                        latitude: stateCoordinates?.response?.dropOffLatitude,
                                        longitude: stateCoordinates?.response?.dropOffLongitude,
                                        // latitudeDelta: LATITUDE_DELTA,
                                        //longitudeDelta: LONGITUDE_DELTA
                                    }}
                                    // waypoints={[ShopCords]}
                                    apikey={Globals.googleApiKey}
                                    strokeWidth={3.5}
                                    strokeColor="#0f53ff"
                                    optimizeWaypoints={true}
                                    mode='DRIVING'
                                    precision='low'

                                    onStart={(params) => {
                                        console.log(`Started routing between "${params}" and "${params}"`);
                                    }}
                                    onReady={result => {
                                        mapRef.current.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                // right: 25,
                                                // bottom: 100,
                                                // left: 25,
                                                // top: 100,
                                            },
                                        });
                                    }}
                                />
                            </MapView>
                        )}

                        {stateCoordinates?.response?.orderTypeId !== 3 &&
                            stateCoordinates?.response?.orderTypeId !== 4 && (
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,

                                        //alignItems: 'center',
                                        borderBottomRightRadius: 6,
                                        width: '100%',
                                    }}>


                                    <Text
                                        style={{
                                            fontSize: Typography.P4,
                                            fontFamily: Fonts.RUBIK_MEDIUM,
                                            //marginVertical: hp("0.5"),
                                            color: colors.subHeadingColor,
                                            marginBottom: hp('0.3'),
                                        }}>
                                        {stateCoordinates?.response?.orderTypeId == 1 &&
                                            `${product} Product(s), Rp. ${totalRp}`}
                                        {stateCoordinates?.response?.orderTypeId == 2 &&
                                            `${product} Items, Rp. ${totalRp}`}
                                    </Text>
                                </View>
                            )}

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
                                    getMapTrackOrder()
                                }}>
                                <SvgIcon
                                    type={IconNames.RotateRight}
                                    width={18}
                                    height={18}
                                    color={'red'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,

                                width: '100%',
                            }}>
                            {stateCoordinates?.response?.orderStatusId == 5 && (
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: 6,
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        width: '20%',
                                        alignSelf: 'flex-end',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                    }}>
                                    <Text>ETA</Text>
                                    <Text>{eta}</Text>
                                </View>
                            )}

                            <View
                                style={{
                                    backgroundColor: 'white',
                                    paddingTop: 16,
                                    paddingHorizontal: 12,
                                    borderRadius: 6,
                                    width: '100%',
                                    paddingBottom: 22,
                                }}>
                                {/* <Text
                  style={{
                    fontSize: Typography.P4,
                    fontFamily: Fonts.RUBIK_MEDIUM,
                    color: 'black',
                    marginVertical: hp('0.3'),
                  }}>
                  Arriving in 21 mins
                </Text> */}
                                {/* ///////////////////////////////////////seller////////////////////////////////////////////////////// */}
                                {stateCoordinates?.response?.orderStatusId !== 5 &&
                                    stateCoordinates?.response?.orderStatusId !== 6 &&
                                    stateCoordinates?.response?.sellerStatusDescription !== null && (
                                        <View
                                            style={{
                                                // paddingVertical: 6,
                                                // paddingHorizontal: 12,
                                                // marginVertical: 6,
                                                // borderWidth: 1,
                                                // borderColor: '#d4d4d4',
                                                // borderRadius: 6,
                                                flexDirection: 'row',
                                                alignItems: 'center',

                                                paddingHorizontal: 5,
                                                flex: 1,
                                            }}>
                                            <View
                                                style={{
                                                    //backgroundColor: "#1b8346",

                                                    // height: hp('6.5'),
                                                    // width: hp('6.9'),
                                                    // padding: 18,
                                                    // flex: 0.1,
                                                    alignItems: 'center',
                                                    resizeMode: 'cover',
                                                }}>
                                                <Image
                                                    source={{
                                                        uri: `${Globals.imgBaseURL}/${stateCoordinates?.response?.sellerImage}`,
                                                    }}
                                                    style={{
                                                        resizeMode: 'cover',
                                                        height: hp('6.5'),
                                                        width: hp('6.9'),
                                                        alignItems: 'center',
                                                        // backgroundColor: "#1b8346",
                                                        flex: 0.1,
                                                        // padding: 18,
                                                        borderRadius: 999,
                                                    }}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: Typography.P5,
                                                        fontFamily: Fonts.RUBIK_REGULAR,
                                                        //marginVertical: hp("0.5"),
                                                        color: colors.subHeadingColor,
                                                        marginBottom: hp('0.3'),
                                                        paddingHorizontal: 16,
                                                    }}>
                                                    {stateCoordinates?.response?.sellerStatusDescription}
                                                </Text>
                                                {/* <Text style={{
                      fontSize: Typography.P4,
                      fontFamily: Fonts.RUBIK_REGULAR,
                      //marginVertical: hp("0.5"),
                      color: colors.subHeadingColor,
                      marginBottom: hp('0.3')
                    }}>{stateCoordinates?.response?.phoneNo}</Text> */}
                                            </View>

                                            {stateCoordinates?.response?.sellerId !== 0 &&
                                                stateCoordinates?.response?.orderStatusId !== 1 &&
                                                stateCoordinates?.response?.orderStatusId !== 2 && (
                                                    <View
                                                        style={{
                                                            alignItems: 'flex-end',
                                                            backgroundColor: '#D3D3D3',
                                                            padding: 10,
                                                            borderRadius: 999,
                                                            alignItems: 'center',

                                                            marginRight: 12,
                                                        }}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                props.navigation.navigate(Routes.ChatUs, {
                                                                    item: stateCoordinates?.response?.sellerId,
                                                                    chatServiceId: chatService
                                                                        ? chatService[2]?.id
                                                                        : 0,
                                                                });
                                                            }}>
                                                            <SvgIcon
                                                                type={IconNames.Message}
                                                                width={18}
                                                                height={18}
                                                                color={'black'}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                            {stateCoordinates?.response?.orderStatusId !== 1 &&
                                                stateCoordinates?.response?.orderStatusId !== 2 && (
                                                    <View
                                                        style={{
                                                            alignItems: 'flex-end',
                                                            backgroundColor: '#1b8346',
                                                            padding: 10,
                                                            borderRadius: 999,
                                                            alignItems: 'center',
                                                        }}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                // console.log("fdjj")
                                                                Linking.openURL(`tel:${stateCoordinates?.response?.phoneNo}`);
                                                            }}>
                                                            <SvgIcon
                                                                type={IconNames.PhoneFlip}
                                                                width={18}
                                                                height={18}
                                                                color={'white'}
                                                                style={{ transform: [{ rotate: '90deg' }] }}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                        </View>
                                    )}
                                {/* //////////////////////////////////////Line/////////////////////////////////////////////////////////////////////////////////////////// */}

                                {stateCoordinates?.response?.orderStatusId !== 5 &&
                                    stateCoordinates?.response?.orderStatusId !== 6 &&
                                    stateCoordinates?.response?.sellerStatusDescription !== null && (
                                        <Divider
                                            style={{
                                                width: '90%',

                                                alignSelf: 'center',
                                                marginVertical: 18,
                                                borderStyle: 'dashed',
                                                borderTopWidth: 1,
                                                borderTopColor: 'gray',
                                                backgroundColor: 'white',
                                            }}
                                        />
                                    )}
                                {/* //////////////////////////////////////driver/////////////////////////////////////////////////////////////////////////////////////////// */}

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 5,
                                        flex: 1,
                                    }}>
                                    <View
                                        style={{
                                            // backgroundColor: "#1b8346",
                                            //  padding: 18, borderRadius: 66, alignItems: 'center',
                                            // height: hp('6.5'),
                                            // width: hp('6.9'),
                                            // flex: 0.1
                                            alignItems: 'center',
                                            resizeMode: 'cover',
                                        }}>
                                        <Image
                                            source={{
                                                uri: `${Globals.imgBaseURL}/${stateCoordinates?.response?.driverImage}`,
                                            }}
                                            style={{
                                                resizeMode: 'cover',
                                                height: hp('6.5'),
                                                width: hp('6.9'),
                                                alignItems: 'center',
                                                // backgroundColor: "#1b8346",
                                                flex: 0.1,
                                                // padding: 18,
                                                borderRadius: 66,
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: Typography.P5,
                                                fontFamily: Fonts.RUBIK_REGULAR,
                                                //marginVertical: hp("0.5"),
                                                color: colors.subHeadingColor,

                                                paddingHorizontal: 16,
                                            }}>
                                            {stateCoordinates?.response?.deliveryPartnerStatusDescription}
                                        </Text>
                                        {/* <Text style={{
                      fontSize: Typography.P4,
                      fontFamily: Fonts.RUBIK_REGULAR,
                      //marginVertical: hp("0.5"),
                      color: colors.subHeadingColor,
                      marginBottom: hp('0.3')
                    }}>{stateCoordinates?.response?.phoneNo}</Text> */}
                                    </View>
                                    {stateCoordinates?.response?.driverId !== 0 &&
                                        (stateCoordinates?.response?.orderStatusId == 4 ||
                                            stateCoordinates?.response?.orderStatusId == 5) && (
                                            <View
                                                style={{
                                                    alignItems: 'flex-end',
                                                    backgroundColor: '#D3D3D3',
                                                    padding: 10,
                                                    borderRadius: 999,
                                                    alignItems: 'center',

                                                    marginRight: 6,
                                                }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        console.log(
                                                            'chatServicechatServicechatService====>',
                                                            chatService,
                                                        ),
                                                            props.navigation.navigate(Routes.ChatUs, {
                                                                item: stateCoordinates?.response?.driverId,
                                                                chatServiceId: chatService
                                                                    ? chatService[0]?.id
                                                                    : 0,
                                                            });
                                                    }}>
                                                    <SvgIcon
                                                        type={IconNames.Message}
                                                        width={18}
                                                        height={18}
                                                        color={'black'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                    {(stateCoordinates?.response?.orderStatusId == 4 ||
                                        stateCoordinates?.response?.orderStatusId == 5) && (
                                            <View
                                                style={{
                                                    alignItems: 'flex-end',
                                                    backgroundColor: '#1b8346',
                                                    padding: 10,
                                                    borderRadius: 999,
                                                    alignItems: 'center',
                                                }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // console.log("fdjj")
                                                        Linking.openURL(`tel:${stateCoordinates?.response?.phoneNo}`);
                                                    }}>
                                                    <SvgIcon
                                                        type={IconNames.PhoneFlip}
                                                        width={18}
                                                        height={18}
                                                        color={'white'}
                                                        style={{ transform: [{ rotate: '90deg' }] }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                </View>


                            </View>
                        </View>
                    </View>
                );
            }}
        />
    );
};
// ShopCords
{/* <Marker.Animated
                  coordinate={ShopCords}
                  tracksViewChanges={false}
                  title={
                    stateCoordinates?.response?.orderTypeId == 1
                      ? 'Grocery'
                      : stateCoordinates?.response?.orderTypeId == 2
                        ? 'Restaurant'
                        : stateCoordinates?.response?.orderTypeId == 4
                          ? 'Pick-up'
                          : ''
                  }
                  pinColor="blue">
                  {stateCoordinates?.response?.orderTypeId == 1 && (
                    <Image
                      source={require('../../../branding/carter/assets/images/marker_shop.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  )}
                  {stateCoordinates?.response?.orderTypeId == 2 && (
                    <Image
                      source={require('../../../branding/carter/assets/images/marker_restaurant.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  )}
                  {(stateCoordinates?.response?.orderTypeId == 4 ||
                    stateCoordinates?.response?.orderTypeId == 3) && (
                      // <SvgIcon
                      //   type={IconNames.Location}
                      //   width={15}
                      //   height={15}
                      //   color={'red'}
                      // />
                      <Image
                        source={require('../../../branding/carter/assets/images/marker_home.png')}
                        style={{ width: 30, height: 30 }}
                      />
                    )}
                </Marker.Animated> */}


//dropCords
{/* <Marker.Animated
                  coordinate={dropCords}
                  tracksViewChanges={false}
                  title="Drop-off"
                  pinColor="tomato">

                  <Image
                    source={require('../../../branding/carter/assets/images/marker_home.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </Marker.Animated> */}


{/* <Text
                style={{
                  fontSize: Typography.P4,
                  fontFamily: Fonts.RUBIK_MEDIUM,
                  color: 'black',
                  marginVertical: hp('0.3'),
                }}>
                Order #{trackData[0]?.orderNo}
              </Text> */}
{/* <Text style={{
                fontSize: Typography.P4,
                fontFamily: Fonts.RUBIK_REGULAR,
                //marginVertical: hp("0.5"),
                color: colors.subHeadingColor,
                marginBottom: hp('0.3')
              }}>
                {
                  `${trackData[0]?.orderDate}`}


              </Text> */}


