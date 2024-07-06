import React from 'react';
import { Button } from 'react-native-elements';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { commonDarkStyles } from '../../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../../branding/carter/styles/light/Style';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PropTypes = require('prop-types');

const AppButton = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);

  //Props
  const buttonStyle = props.buttonStyle || globalStyles.primaryButtonStyle;
  const primaryShadowStart =
    props.primaryShadowStart || colors.primaryShadowStart;
  const primaryShadowFinal =
    props.primaryShadowFinal || colors.primaryShadowFinal;
  const titleStyle = props.titleStyle || globalStyles.primaryButtonTextStyle;
  const title = props.title || 'Text';
  const onPress = props.onPress || (() => { });
  const isLoading = props.loader;
  const disabled = props.disabled;

  return (
    <Shadow
      viewStyle={{ alignSelf: 'stretch' }}
      startColor={disabled ? primaryShadowFinal : primaryShadowStart}
      finalColor={primaryShadowFinal}
      radius={hp(0.75)}
      distance={0}
    //offset={[0, 3]}
    >
      {!isLoading && (
        <Button
          buttonStyle={buttonStyle}
          title={title}
          titleStyle={titleStyle}
          disabled={disabled}
          onPress={() => {
            onPress();
          }}
        />
      )}

      {/* //loading Ui visible or hide  */}
      {isLoading && (
        <View>
          <ActivityIndicator size="large" color={colors.activeColor} />
        </View>
      )}
    </Shadow>
  );
};

AppButton.propTypes = {
  title: PropTypes.string,

  onPress: PropTypes.func.isRequired,

  buttonStyle: PropTypes.any,

  titleStyle: PropTypes.any,
};

export default AppButton;
