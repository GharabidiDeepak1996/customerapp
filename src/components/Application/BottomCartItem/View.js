import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, useColorScheme, View, Text, ToastAndroid } from 'react-native';

import { Styles } from './Style';
import { useTheme } from '@react-navigation/native';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Globals from '../../../utils/Globals';
import { useSelector } from 'react-redux';
import Routes from '../../../navigation/Routes';
import { t } from 'i18next';
import { formatNumberWithCommas } from '../../../utils/FormatNumberWithCommas';

export const BottomCartItem = props => {
    //redux
    const productCount = useSelector(state => state.product.cartCount);
    const itemFoodPrice = useSelector(state => state.product.foodTotalPrice)
    const productGroceryPrice = useSelector(state => state.product.groceryTotalPrice)
    const productFreshGoodPrice = useSelector(state => state.product.freshGoodTotalPrice)

    //Theme based styling and colors
    const scheme = useColorScheme();
    const { colors } = useTheme();
    const itemStyles = Styles(scheme, colors);

    const {
        navigation,
        categoryTypeId,
    } = props;
    return (
        <View style={itemStyles.container}>
            {console.log("categoryTypeIssss----", categoryTypeId)}
            <View>
                <Text style={itemStyles.itemTitle}>{productCount} Item(s)</Text>
                {(categoryTypeId == 1) ? <Text style={itemStyles.itemTitle1}>Rp. {formatNumberWithCommas(productGroceryPrice)}</Text>
                    : (categoryTypeId == 5) ? <Text style={itemStyles.itemTitle1}>Rp. {formatNumberWithCommas(productFreshGoodPrice)}</Text> :
                        (categoryTypeId == 2) && <Text style={itemStyles.itemTitle1}>Rp. {formatNumberWithCommas(itemFoodPrice)}</Text>}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(Routes.CART, {
                            categoryTypeId: categoryTypeId,
                        });

                    }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={itemStyles.checkOutContainer}>{t('View Cart')}</Text>
                        <SvgIcon
                            type={IconNames.ArrowRight}
                            width={15}
                            height={15}
                            color='white'
                            style={{ marginLeft: 8 }}
                        />
                    </View>

                </TouchableOpacity>
            </View>
            {/* <View style={itemStyles.deleteContainer}>

            </View> */}
        </View>
    )

}