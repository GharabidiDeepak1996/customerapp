import React from "react";
import { View, Text } from "react-native";
import BaseView from "../BaseView";
import IconNames from "../../../branding/carter/assets/IconNames";
import { useTranslation } from 'react-i18next';

export const BestSellingStore = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <View style={{ flex: 1, }}>
            <BaseView
                navigation={props.navigation}
                title={t('Best Selling Store')}
                rightIcon={IconNames.BagShopping}
                onRightIconPress={() => { }}
                headerWithBack={true}
                applyBottomSafeArea
                childView={() => {
                    return (
                        <View style={{ justifyContent: 'center' }}>
                            <Text>Under Process</Text>
                        </View>
                    );
                }}
            />
        </View >
    )
}






