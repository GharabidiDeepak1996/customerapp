import React from 'react';
import { View } from 'react-native';

const TrackDetailItems = props => {

  return (
    <View style={[props.screenStyles.contentContainer, {}]}>
      <View style={props.screenStyles.orderStatusItemContainer}>
        <View style={[props.screenStyles.orderStatusLeftContainer, { flex: 1 }]}>
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
              props.screenStyles.orderStatusLeftIconContainer,
              {
                //FF5B61
                backgroundColor:
                  props.key == 2
                    ? 'gray'
                    : props.key == 1
                      ? colors.activeColor
                      : '#555555',
                width: hp('4'),
                height: hp('4'),
              },
            ]}>
            {props.item.operatorId == 2 && (
              <SvgIcon
                type={IconNames.TrackBike}
                width={18}
                height={18}
                color={'white'}
              />
            )}

            {props.item.operatorId == 1 && (
              <SvgIcon
                type={IconNames.TrackShip}
                width={18}
                height={18}
                color={'white'}
              />
            )}
            {props.item.operatorId == 3 && (
              <SvgIcon
                type={IconNames.TrackTrain}
                width={20}
                height={20}
                color={'white'}
              />
            )}
          </View>

          <View>
            <Text
              style={[
                props.screenStyles.subtitleText,
                {
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: 'gray',
                  paddingHorizontal: 4,
                  paddingTop: 3,
                  textTransform: 'uppercase',
                  backgroundColor: 'white',
                  marginTop: 0,
                },
              ]}>
              {props.item.operator}
            </Text>
          </View>

          {props.item.operatorId == 3 && (
            <View
              style={[
                props.screenStyles.orderStatusLeftIconContainer,
                {
                  backgroundColor: '#fbd7cf',
                  width: hp('4'),
                  height: hp('4'),
                },
              ]}>
              <View
                style={[
                  props.screenStyles.orderStatusLeftIconContainer,
                  {
                    backgroundColor: '#ec796d',
                    width: hp('3.4'),
                    height: hp('3.4'),
                  },
                ]}>
                <View
                  style={[
                    props.screenStyles.orderStatusLeftIconContainer,
                    {
                      backgroundColor: '#b72a1e',
                      width: hp('2.6'),
                      height: hp('2.6'),
                    },
                  ]}>
                  <SvgIcon
                    type={IconNames.Box}
                    width={9}
                    height={9}
                    color={'white'}
                  />
                </View>
              </View>
            </View>
          )}
          {/* {(key != itemLength - 1) && <View style={props.screenStyles.orderStatusLine} />} */}
        </View>

        <View
          style={[
            props.screenStyles.orderTitleContainer,
            { flex: 6, paddingTop: 6, paddingVertical: 6, },
          ]}>
          <View style={{ flex: 3 }}>
            <Text style={[props.screenStyles.subtitleValueText, {}]}>
              {props.item.stopName}
            </Text>
            <Text style={props.screenStyles.subtitleText}>
              {' '}
              • {moment(props.item.jobStatusDatetime).format('hh:mm')} -{' '}
              {props.item.jobStatusName}
            </Text>
            <Text style={props.screenStyles.subtitleText}>
              {' '}
              • {moment(props.item.jobStatusDatetime).format('hh:mm')} -{' '}
              {props.item.jobStatusName}
            </Text>
            <Text style={props.screenStyles.subtitleText}>
              {' '}
              • {moment(props.item.jobStatusDatetime).format('hh:mm')} -{' '}
              {props.item.jobStatusName}
            </Text>
            <Text style={screenStyles.subtitleText}>
              {' '}
              • {moment(props.item.jobStatusDatetime).format('hh:mm')} -{' '}
              {props.item.jobStatusName}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                screenStyles.subtitleText,
                {
                  flex: 1,
                  textAlign: 'right',
                },
              ]}>
              {' '}
              {moment(props.item.jobStatusDatetime).format('MMM DD,YYYY')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrackDetailItems;
