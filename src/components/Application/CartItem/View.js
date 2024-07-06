import React, {useEffect, useState} from 'react';
import {
  Image,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Button, Rating, Text} from 'react-native-elements';
import Routes from '../../../navigation/Routes';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Counter} from '../../Global/Counter/View';
import {Styles} from './Style';
import {useTheme} from '@react-navigation/native';
import {SvgIcon} from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Globals from '../../../utils/Globals';
import {floor} from 'react-native-reanimated';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProductService} from '../../../apis/services/product';
import {addToCart} from '../../../redux/features/Cart/cartSlice';
import {removeProduct} from '../../../redux/features/AddToCart/ProductSlice';
import {formatDecimalNumber} from '../../../utils/FormatDecimalNumber';
import {formatNumberWithCommas} from '../../../utils/FormatNumberWithCommas';

export const CartItem = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const itemStyles = Styles(scheme, colors);

  //local init
  const [subTotal, setSubTotal] = useState(0);

  const updateCart = async () => {
    const getUserId = await AsyncStorage.getItem('userId');

    let body = {
      userId: getUserId,
      productId: props.productId,
      partnerId: props.partnerId,
      userCartItemId: props.userCartItemId,
      userCartId: props.userCartId,
      qty: 0,
      price: 0,
      CategoryTypeId: props.categoryTypeId,
    };

    console.log('body==>', body);

    try {
      const data = await ProductService.alterCartCountByStore(body);

      if (data.data.isSuccess) {
        props.fetchCartedList();
        dispatch(removeProduct(props.cartList));
        //dispatch(clearProducts());
      }
    } catch (error) {
      console.log('error==>', error);
    }
  };

  const renderRightActions = (progress, dragX) => {
    return (
      <TouchableOpacity
        onPress={() => {
          //updateCart();
          ToastAndroid.show('Under progress', ToastAndroid.SHORT);
        }}
        style={itemStyles.rightSwipeContainer}>
        <SvgIcon
          type={IconNames.TrashAlt}
          width={30}
          height={30}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  };

  // Callback function to receive data from Counter component
  const handleCounterData = counterData => {
    // Do something with the data received from Counter
    console.log('Data received from Counter:', counterData);
  };

  // useEffect(() => {

  //   // setSubTotal(cartCount => {
  //   //   return cartCount + props.price;
  //   // });
  //  // setSubTotal(props.price)
  //   console.log("cartcountData12454----->", subTotal)

  // }, [])
  return (
    <Button
      onPress={() => {
        // props.navigation.navigate(Routes.PRODUCT_DETAIL, {
        //   item: props,
        // });
      }}
      ViewComponent={() => {
        return (
          <Swipeable
            friction={2}
            leftThreshold={80}
            rightThreshold={40}
            // renderRightActions={renderRightActions}
            containerStyle={itemStyles.swipeableContainer}>
            <View style={[itemStyles.foodItemContainer, {flex: 1}]}>
              <Image
                source={{uri: `${Globals.imgBaseURL}/${props.image}`}}
                style={[itemStyles.foodItemImage, {flex: 2}]}
                resizeMode={'contain'}
              />
              {/* <Image
                                source={props.image}
                                style={itemStyles.foodItemImage}
                                resizeMode={"contain"}
                            /> */}
              <View style={{flex: 5}}>
                <Text style={itemStyles.priceText}>{props.partnerName}</Text>
                <Text style={itemStyles.itemTitle}>{props.title}</Text>
                {props.productTypeId !== 2 && props.averageRating == 0 && (
                  <View style={itemStyles.ratingContainer}>
                    <Text style={itemStyles.ratingText}>
                      {props.averageRating}{' '}
                    </Text>

                    <Rating
                      imageSize={14}
                      readonly
                      startingValue={props.averageRating}
                      //style={{ styles.rating }}
                    />
                  </View>
                )}

                {props.productTypeId == 2 && (
                  <Text style={itemStyles.dimensionText}>
                    Rp.{' '}
                    {formatNumberWithCommas(
                      props.sellingPrice == 0
                        ? props.regularPrice
                        : props.sellingPrice,
                    )}
                    /{props.packagingName}
                  </Text>
                )}
                {props.productTypeId == 1 && (
                  <Text style={itemStyles.dimensionText}>
                    Rp.{' '}
                    {formatNumberWithCommas(
                      props.sellingPrice == 0
                        ? props.regularPrice
                        : props.sellingPrice,
                    )}
                    /{props.packagingName}/{formatDecimalNumber(props.weight)}
                    {/* {props.attribute.map((item, key) => {
                    if (item.name == 'Weight') {
                      return item.value; 
                    }
                  })}{' '} */}
                    kg/ {props.length * props.width * props.height} cm3
                    {/* {props.attribute.map((item, key) => {
                    if (item.name == 'Dimensions') {
                      return item.value;
                    }
                  })} */}
                  </Text>
                )}
                {/* <View style={{ flexDirection: 'row' }}>
                  <Text style={itemStyles.boxText}> Box</Text>

                </View> */}
                <Text style={itemStyles.priceText1}>
                  Rp. {formatNumberWithCommas(props.cartPrice)}
                </Text>
              </View>

              {props.isVerticalUI && (
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Counter
                    isVertical
                    outerBorder
                    spacing={hp('5')}
                    productStoreId={props.productStoreId}
                    userId={props.userId}
                    productId={props.productId}
                    partnerId={props.partnerId}
                    cartCount={props.cartCount}
                    cartPrice={props.cartPrice}
                    price={props.price}
                    regularPrice={props.regularPrice}
                    sellingPrice={props.sellingPrice}
                    userCartId={props.userCartId}
                    userCartItemId={props.userCartItemId}
                    onCounterDataChange={handleCounterData}
                    fetchCartedList={props.fetchCartedList}
                    categoryTypeId={props.categoryTypeId}
                    cartList={props.cartList}
                    stockQuantity={props.stockQuantity}
                    partnerStoreId={props.partnerStoreId}
                    productTypeId={props.productTypeId}
                  />
                </View>
              )}
            </View>
          </Swipeable>
        );
      }}
    />
  );
};
