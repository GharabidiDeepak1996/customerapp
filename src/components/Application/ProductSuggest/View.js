import React, { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  StyleSheet,
} from 'react-native';
import { Text, Rating, AirbnbRating } from 'react-native-elements';
import Routes from '../../../navigation/Routes';
import { Styles } from './Styles';
import { useTheme } from '@react-navigation/native';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { StoreBottomSheet } from '../StoreBottomSheet/View';
import Globals from '../../../utils/Globals';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatNumberWithCommas } from '../../../utils/FormatNumberWithCommas';

export const ProductSuggest = props => {
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

  const {
    id,
    title,
    image,
    price,
    discountPrice,
    weight,
    discount,
    navigation,
    setSelectedProduct,
    imgURL,
    rating,
    specification,
    packagingType,
    stock,
    productStoreId,
    sellingPrice,
    regularPrice,
    attributes,
    productDescription
  } = props;

  // console.log("productStoreId---", productStoreId)
  // console.log('imgurllll', `${Globals.imgBaseURL}/${imgURL}`)

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
          {/* <View style={itemStyles.favouriteContainer}>
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
          </View> */}
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (stock !== 0) {
              // navigation.navigate(Routes.PRODUCT_DETAIL, {
              //   item: props
              // });
            }
          }}>
          <View style={[itemStyles.mainContainer]}>
            {/* <Image source={image} style={itemStyles.foodItemImage} /> */}

            <View style={{ flexDirection: 'row', flex: 3 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image
                  source={{ uri: `${Globals.imgBaseURL}/${imgURL}` }}
                  style={itemStyles.foodItemImage}
                />
              </View>

              <View style={{ flex: 2, }}>
                <View style={itemStyles.infoContainer}>
                  <Text style={itemStyles.titleText} numberOfLines={2}>
                    {title}
                  </Text>
                  <View style={{ marginBottom: 5 }}>
                    {rating !== 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        {/* <CustomRatingBar /> */}
                        <Rating
                          imageSize={14}
                          readonly
                          startingValue={rating}
                        //style={{ styles.rating }} 
                        />

                        <Text style={itemStyles.ratingText}>{rating}</Text>
                        {/* <Text style={itemStyles.ratingText}>(72 reviews)</Text> */}
                      </View>
                    )}

                    <View style={{ flexDirection: 'row', }}>
                      <Text style={itemStyles.quantity}>{packagingType}</Text>
                      <Text style={{ marginHorizontal: 3, textAlignVertical: 'center' }}>•</Text>


                      <Text style={itemStyles.quantity} numberOfLines={1}>
                        Dimensions{' '}
                        {attributes.map((item, key) => {
                          if (item.name == 'Dimensions') {
                            return item.value;
                          }
                        })}{' '}
                        cm3
                      </Text>
                    </View>

                    <Text style={itemStyles.quantity}>Stock {stock}</Text>
                  </View>

                  <View style={{ flexDirection: 'column' }}>
                    {stock !== 0 && (
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={itemStyles.discountPrice}>
                          Rp. {formatNumberWithCommas(sellingPrice !== 0 ? sellingPrice : regularPrice)}
                        </Text>
                        {sellingPrice !== 0 && (
                          <Text style={itemStyles.priceText}>
                            Rp. {formatNumberWithCommas(regularPrice)}
                          </Text>
                        )}
                      </View>
                    )}
                    <View
                      style={
                        stock === 0 || stock < 0
                          ? itemStyles.disableAddToCartButton
                          : itemStyles.addToCartButton
                      }>
                      <TouchableOpacity
                        disabled={stock === 0 || stock < 0 ? true : false}
                        onPress={() => {
                          props.setSelectedProduct !== undefined &&
                            (setSelectedProduct(props),
                              _storeBottomSheetComponent(props));
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
                          color={stock === 0 || stock < 0 ? colors.inactiveColor : colors.activeColor}
                          style={itemStyles.addCartIcon}
                        />

                        <Text
                          style={
                            stock === 0 || stock < 0
                              ? itemStyles.addCartDisableText
                              : itemStyles.addCartText
                          }>
                          {stock === 0 || stock < 0
                            ? 'Out of stock '
                            : 'Add to cart'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {showStoreBottomSheetComponent && (
                <StoreBottomSheet
                  productList={showStoreBottomSheetComponent}
                  CloseStoreBottonSheet={() => {
                    setStoreBottomSheetComponent(
                      !showStoreBottomSheetComponent,
                    );
                  }}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

// return (
//   <View>
//     <View style={itemStyles.container}>
//       <View style={itemStyles.upperContainer}>
//         <View style={itemStyles.discountContainer}>
//           {discount && (
//             <View style={itemStyles.discountBanner}>
//               <Text style={itemStyles.discountText}>- {discount}</Text>
//             </View>
//           )}
//         </View>
//         <View style={itemStyles.favouriteContainer}>
//           <TouchableOpacity
//             onPress={() => {
//               _favouriteChange();
//             }}>
//             <View>
//               <SvgIcon
//                 type={favourite ? IconNames.HeartFilled : IconNames.Heart}
//                 width={20}
//                 height={20}
//                 color={favourite ? colors.heartFilled : colors.heartEmpty}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <TouchableWithoutFeedback
//         onPress={() => {
//           navigation.navigate(Routes.PRODUCT_DETAIL, {
//             item: props,
//           });
//         }}>
//         <View style={[itemStyles.mainContainer]}>
//           {/* <Image source={image} style={itemStyles.foodItemImage} /> */}

//           <Image source={{uri: `${Globals.imgBaseURL}/${imgURL}`}} style={itemStyles.foodItemImage}/>

//           <View style={itemStyles.infoContainer}>
//             <Text style={itemStyles.titleText} numberOfLines={2}>{title}</Text>
//             <View style={{marginBottom:10}}>

//             <CustomRatingBar rating={rating}/>
//             <Text style={itemStyles.quantity} >{packagingType}</Text>
//             <Text style={itemStyles.quantity} numberOfLines={1}>{specification}</Text>
//             <Text style={itemStyles.quantity}>Stock {stock}</Text>
//             </View>

//             <Text style={itemStyles.priceText}>Rp. {price}</Text>
//           </View>

//           {/* Add to cart */}

//           <View style={itemStyles.bottomContainer}>
//             <TouchableOpacity
//               onPress={() => {
//                 console.log('material', props);
//                 props.setSelectedProduct !== undefined &&
//                   (setSelectedProduct(props),
//                   _storeBottomSheetComponent(props));
//               }}
//               // onPress={() => {
//               //   childToParent();
//               //   // <StoreBottomSheet isEnabled={isStoreBottomSheetOpen} />;
//               // }}
//               // onPress={() => _cartCountChange('add')}
//               style={itemStyles.addToCartContainer}>
//               <SvgIcon
//                 type={IconNames.BagShopping}
//                 width={20}
//                 height={20}
//                 color={colors.activeColor}
//                 style={itemStyles.addCartIcon}
//               />

//               <Text style={itemStyles.addCartText}>{'Add to cart'}</Text>
//             </TouchableOpacity>
//           </View>
//           {showStoreBottomSheetComponent && (
//             <StoreBottomSheet
//               productList={showStoreBottomSheetComponent}
//               CloseStoreBottonSheet={() => {
//                 console.log(!showStoreBottomSheetComponent);
//                 setStoreBottomSheetComponent(!showStoreBottomSheetComponent);
//               }}
//             />
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     </View>
//   </View>
// );
const styles = StyleSheet.create({
  myStarStyle: {
    color: 'yellow',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
});
