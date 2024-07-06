import React from 'react';
import { Animated, Modal, TouchableOpacity, View } from 'react-native';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import TrackDetailItems from './trackdetailitems';

const MapTrackDetails = (props) => {
    return (<Modal animationType="fade" visible={props.isModalVisible} transparent={true} onRequestClose={props.handleDismiss}>
        <View style={props.screenStyles.modalContainer}>
            <Animated.View {...props.panHandlers}
                style={[props.screenStyles.modalAnimationView, // { transform: [{ translateY: panY, }] },
                { top: props.top }]}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <View style={{ flex: 1 }}><View style={props.screenStyles.lineView} /></View>

                    <View style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => { props.setModalVisible(false); }}>
                            <SvgIcon type={IconNames.Close} width={15} height={15} color={props.activeColor} />
                        </TouchableOpacity>
                    </View>
                </View>


                {props.mapTrackData?.segments?.map((item, key) => {
                    // <TrackDetailItems
                    //     item={item}
                    //     key={key}
                    //     itemLength={props.mapTrackData?.segments?.length}
                    //     screenStyles={props.screenStyles}
                    // />
                    return props.renderOrderHeader(item, key, props.mapTrackData?.segments?.length,);
                })}


            </Animated.View>
        </View>
    </Modal>);
}

export default MapTrackDetails;
