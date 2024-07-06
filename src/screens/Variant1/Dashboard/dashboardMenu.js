import React, { useEffect, useState } from 'react';
import {
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from 'react-native';

import { Text } from 'react-native-elements';
import Routes from '../../../navigation/Routes';
import { Styles } from './Styles';
import { useTheme } from '@react-navigation/native';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { StoreBottomSheet } from '../../../components/Application/StoreBottomSheet/View';
import { SvgIcon } from '../../../components/Application/SvgIcon/View';

export const DashBoardMenu = props => {
    //storebottom sheet
    const isStoreBottomSheetOpen = true;
    const [showStoreBottomSheetComponent, setStoreBottomSheetComponent] =
        useState(false);

    //Theme based styling and colors
    const { colors } = useTheme();
    const scheme = useColorScheme();
    const itemStyles = Styles(scheme, colors);

    //Internal states
    const [cartCount, setCartCount] = useState(props.cartCount);
    const [favourite, setFavourite] = useState(
        props.isFavourite ? props.isFavourite : false,
    );

    useEffect(() => {
        props.favouriteChange(favourite);
    }, [favourite]);

    useEffect(() => {
        props.cartCountChange(cartCount);
    }, [cartCount]);

    const _favouriteChange = () => {
        setFavourite(favourite => {
            return !favourite;
        });
    };

    const _cartCountChange = behavior => {
        if (behavior === 'add') {
            setCartCount(cartCount => {
                return cartCount + 1;
            });
        } else if (behavior === 'subtract' && !(cartCount === 0)) {
            setCartCount(cartCount => {
                return cartCount - 1;
            });
        }
    };

    const { id, title, image, price, weight, discount, navigation, setSelectedProduct } = props;

    const _storeBottomSheetComponent = () => {
        setStoreBottomSheetComponent(props);
    };
    return (
        <View>
            <View style={itemStyles.container}>
                <View style={itemStyles.upperContainer}>
                    <View style={itemStyles.discountContainer}>
                        {discount && (
                            <View style={itemStyles.discountBanner}>
                                <Text style={itemStyles.discountText}>- {discount}</Text>
                            </View>
                        )}
                    </View>
                    <View style={itemStyles.favouriteContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                _favouriteChange();
                            }}>
                            <View>
                                <SvgIcon
                                    type={favourite ? IconNames.HeartFilled : IconNames.Heart}
                                    width={20}
                                    height={20}
                                    color={favourite ? colors.heartFilled : colors.heartEmpty}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableWithoutFeedback
                    onPress={() => {
                        // navigation.navigate(Routes.PRODUCT_DETAIL, {
                        //     item: props,
                        // });
                    }}>
                    <View style={[itemStyles.mainContainer]}>
                        <Image source={image} style={itemStyles.foodItemImage} />
                        <View style={itemStyles.infoContainer}>
                            <Text style={itemStyles.priceText}>{price}</Text>
                            <Text style={itemStyles.titleText}>{title}</Text>
                            <Text style={itemStyles.weightText}>{weight}</Text>
                        </View>

                        {/* Add to cart */}

                        <View style={itemStyles.bottomContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log("FoodItemConsole", props.setSelectedProduct)
                                    props.setSelectedProduct !== undefined && (setSelectedProduct(props), _storeBottomSheetComponent(props))

                                }}
                                // onPress={() => {
                                //   childToParent();
                                //   // <StoreBottomSheet isEnabled={isStoreBottomSheetOpen} />;
                                // }}
                                // onPress={() => _cartCountChange('add')}
                                style={itemStyles.addToCartContainer}>
                                <SvgIcon
                                    type={IconNames.BagShopping}
                                    width={20}
                                    height={20}
                                    color={colors.activeColor}
                                    style={itemStyles.addCartIcon}
                                />

                                <Text style={itemStyles.addCartText}>{'Add to cart'}</Text>
                            </TouchableOpacity>
                        </View>
                        {showStoreBottomSheetComponent && (
                            <StoreBottomSheet
                                productList={showStoreBottomSheetComponent}
                                CloseStoreBottonSheet={() => {
                                    console.log(!showStoreBottomSheetComponent);
                                    setStoreBottomSheetComponent(!showStoreBottomSheetComponent);
                                }}

                            />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};
