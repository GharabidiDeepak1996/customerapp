import React from 'react';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import IconNames from '../../../../branding/carter/assets/IconNames';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import { Image } from 'react-native';

const Markers = props => {

    return (<Marker.Animated ref={props.markerRef} coordinate={props.coordinate} title={props.title} pinColor="green">
        <Image
            source={require(`../../../../branding/carter/assets/images/${'marker_home'}.png`)}
            style={{
                width: 30,
                height: 30
            }} />
    </Marker.Animated>);
}
export default Markers;
{/* <SvgIcon
            type={IconNames.HomeAlt}
            width={15}
            height={15}
        //color={props.colors.activeColor}
        /> */}