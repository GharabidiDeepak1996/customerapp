import React from 'react';
import { TouchableOpacity, useColorScheme, View, Text, ToastAndroid } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Styles } from './Style';
import Globals from '../../../utils/Globals';
import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';

export function Variant3BottomTabBar({ state, descriptors, navigation }) {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(globalStyles, scheme, colors);

  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={screenStyles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            console.log("444444444444444444444", route.name)
            switch (route.name) {
              case "Grocery":
                ToastAndroid.show('Coming Soon', ToastAndroid.TOP);
                break;

              case "Food":
                ToastAndroid.show('Coming Soon', ToastAndroid.TOP);
                break;

              case "Fresh Goods":
                ToastAndroid.show('Coming Soon', ToastAndroid.CENTER);
                break;
              case "variant_1_dashboard":
                navigation.navigate(route.name)
                break;
              case "Courier"://send
                navigation.navigate(route.name)
                break;
              case "Ride"://Ride
                //navigation.navigate(route.name)
                ToastAndroid.show('Coming Soon', ToastAndroid.TOP);
                break;
              case "Profile":
                navigation.navigate(route.name)
                break;

            }
            //Hide Deepak
            // if (!isFocused && !event.defaultPrevented) {
            //   navigation.navigate(route.name);
            // }
          };

          let icon = IconNames.HomeAlt;
          let icon_lable = 'Home';

          switch (index) {
            case 0:
              icon = IconNames.HomeAlt;
              icon_lable = 'Home';
              break;

            case 1:
              icon = IconNames.Grocery;
              icon_lable = 'Mart';
              break;

            case 2:
              icon = IconNames.Food;
              icon_lable = 'Food';
              break;

            case 3:
              icon = IconNames.Fish;
              icon_lable = 'Fresh';
              break;

            case 4:
              icon = IconNames.Courier;
              icon_lable = 'Send';
              break;

            case 5:
              icon = IconNames.taxibike;
              icon_lable = 'Ride';
              break;

            case 6:
              icon = IconNames.CircleUser;
              icon_lable = 'Account';
              break;
          }

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={onPress}
              style={[
                screenStyles.bottomTabContainer,
                {
                  marginBottom: Globals.SAFE_AREA_INSET.bottom / 2,
                  shadowColor: 'black',
                  shadowRadius: 15,
                  borderTopColor: '#dfdfdf',
                  borderTopWidth: 1,
                  shadowOpacity: 1,
                  elevation: 10,
                },
              ]}>
              {/*isFocused is selected*/}

              <View
                style={[
                  {
                    width: isFocused ? 0 : 0,
                  },
                  screenStyles.bottomTabItemContainer,
                ]}>
                {/* <SvgIcon type={icon} width={25} height={40}
                                     color={isFocused ? colors.primaryBackground : colors.activeColor}/> */}

                <SvgIcon
                  type={icon}
                  width={20}
                  height={25}
                  color={isFocused ? colors.primaryGreenColor : '#8b8b8b'}
                />
              </View>

              <Text
                style={{
                  fontSize: 11,

                  fontWeight: isFocused ? '500' : '400',
                  color: isFocused ? colors.primaryGreenColor : '#8b8b8b',
                }}>
                {icon_lable}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
