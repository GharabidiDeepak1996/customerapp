import React, {useRef, useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Text, Rating} from 'react-native-elements';
import Routes from '../../navigation/Routes';
import {StylesNew} from './Styles';
import AppHeader from '../../components/Application/AppHeader/View';
import {Counter} from '../../components/Global/Counter/View';
import StarRating from 'react-native-star-rating';
import {FavouritesBottomSheet} from '../../components/Application/FavouritesBottomSheet/View';
import RBSheet from 'react-native-raw-bottom-sheet';
import ReadMore from '@fawazahmed/react-native-read-more';
import AppButton from '../../components/Application/AppButton/View';
import {useTheme} from '@react-navigation/native';
import IconNames from '../../../branding/carter/assets/IconNames';
import {SvgIcon} from '../../components/Application/SvgIcon/View';
import {FocusAwareStatusBar} from '../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import Globals from '../../utils/Globals';
import axios from 'axios';
import {ProductSuggest} from '../../components/Application/ProductSuggest/View';
import AppConfig from '../../../branding/App_config';
const Fonts = AppConfig.fonts.default;
const baseUrl = Globals.baseUrl;

import {Styles} from '../../../src/components/Application/FoodItem/Styles';
import BaseView from '../BaseView';
import {t} from 'i18next';
import {formatNumberWithCommas} from '../../utils/FormatNumberWithCommas';

export const ProductDetail = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const screenStyles = StylesNew(scheme, colors);
  //Props
  const {productDetails} = props.route.params;

  const renderItem = ({item}) => (
    <View style={screenStyles.containerNew}>
      <TouchableWithoutFeedback
        onPress={() => {
          // navigation.navigate(Routes.PRODUCT_DETAIL, {
          //   item: props,
          // });
        }}>
        <View style={[screenStyles.mainContainerNew]}>
          {/* <Image source={image} style={itemStyles.foodItemImage} /> */}
          {/* <Image source={item.image} style={screenStyles.foodItemImageNew}/> */}

          <Image
            source={{uri: `${Globals.imgBaseURL}/${item.productImageUrl}`}}
            style={screenStyles.foodItemImageNew}
          />

          <View style={screenStyles.infoContainerNew}>
            <Text style={screenStyles.titleTextNew} numberOfLines={2}>
              {item.productName}
            </Text>

            {item.stock !== 0 && (
              <View style={{flexDirection: 'row'}}>
                <Text style={screenStyles.discountPrice}>
                  Rp.{' '}
                  {formatNumberWithCommas(
                    item.sellingPrice !== 0
                      ? item.sellingPrice
                      : item.regularPrice,
                  )}
                </Text>
                {item.sellingPrice !== 0 && (
                  <Text style={screenStyles.priceText}>
                    Rp. {formatNumberWithCommas(item.regularPrice)}
                  </Text>
                )}
              </View>
            )}

            {/* <Text style={screenStyles.priceTextNew}>Rp. {item.regularPrice}</Text> */}
          </View>

          {/* Add to cart */}

          <View style={screenStyles.bottomContainerNew}>
            <TouchableOpacity
              onPress={() => {}}
              // onPress={() => {
              //   childToParent();
              //   // <StoreBottomSheet isEnabled={isStoreBottomSheetOpen} />;
              // }}
              // onPress={() => _cartCountChange('add')}
              style={screenStyles.addToCartContainerNew}>
              <SvgIcon
                type={IconNames.BagShopping}
                width={20}
                height={20}
                color={colors.activeColor}
                style={screenStyles.addCartIconNew}
              />

              <Text style={screenStyles.addCartTextNew}>{'Add to cart'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  useEffect(() => {
    console.log('-----------------', props.route.params.categoryTypeId);
  }, []);
  return (
    <BaseView
      navigation={props.navigation}
      title={props.route.params.categoryTypeId == 1 ? t('Grocery') : t('Food')}
      rightIcon={IconNames.BagShopping}
      // onRightIconPress={() => {
      //   //bottomTabsVariant3
      //   // props.navigation.navigate(Routes.COURIER, {
      //   props.navigation.navigate(Routes.CART, {
      //     categoryTypeId: props.route.params.categoryTypeId,
      //   });
      // }}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View>
            <View style={[screenStyles.imageContainer]}>
              <Image
                source={{
                  uri: `${Globals.imgBaseURL}/${productDetails.productImageUrl}`,
                }}
                //resizeMode={'stretch'}
                style={[screenStyles.mainImage]}
              />
            </View>
            <View style={screenStyles.bottomContainerMain}>
              <View style={screenStyles.infoContainer}>
                <Text style={[screenStyles.discountPrice]}>
                  Rp.{' '}
                  {formatNumberWithCommas(
                    productDetails.sellingPrice == 0
                      ? productDetails.regularPrice
                      : productDetails.sellingPrice,
                  )}
                </Text>

                {productDetails.sellingPrice == 0 && (
                  <Text style={screenStyles.priceText}>
                    Rp. {formatNumberWithCommas(productDetails.regularPrice)}
                  </Text>
                )}
              </View>
              <View style={screenStyles.infoContainer}>
                <Text style={[screenStyles.nameText]}>
                  {productDetails.productName}
                </Text>
              </View>
              <View style={screenStyles.infoContainer}>
                <Text style={screenStyles.quantityNew}>
                  {productDetails.packagingName}
                </Text>
                <Text
                  style={{
                    marginHorizontal: 3,
                    textAlignVertical: 'center',
                  }}>
                  •
                </Text>

                <Text style={screenStyles.quantityNew} numberOfLines={2}>
                  Dimensions{' '}
                  {productDetails.length *
                    productDetails.width *
                    productDetails.height}{' '}
                  cm³
                </Text>
              </View>
              {/* <View style={screenStyles.infoContainer}>
                <SvgIcon
                  type={IconNames.Star}
                  width={14}
                  height={14}
                  color="gray"
                  style={{ marginRight: 4 }}
                />
                <Text style={screenStyles.ratingText}>{productDetails.ratingCount}</Text>
                <Text style={screenStyles.ratingText}> (72 reviews)</Text>
              </View> */}

              <View style={{marginTop: 8}}>
                <Text style={screenStyles.subTitle}>{t('Description')}</Text>
                <Text style={[screenStyles.weightText]}>
                  {productDetails.partnerStoreDescription}
                </Text>
              </View>
              <View style={{marginTop: 8}}>
                <Text style={screenStyles.subTitle}>
                  {t('Product Information')}
                </Text>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={screenStyles.attributesText}>Weight</Text>
                    <Text style={screenStyles.attributesText}>
                      {parseFloat(Number(productDetails.weight)).toFixed(2)} kg
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={screenStyles.attributesText}>Dimensions</Text>
                    <Text style={screenStyles.attributesText}>
                      {productDetails.length *
                        productDetails.width *
                        productDetails.height}{' '}
                      cm³
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={screenStyles.attributesText}>Long</Text>
                    <Text style={screenStyles.attributesText}>
                      {productDetails.length} cm
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={screenStyles.attributesText}>Wide</Text>
                    <Text style={screenStyles.attributesText}>
                      {productDetails.width} cm
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={screenStyles.attributesText}>Height</Text>
                    <Text style={screenStyles.attributesText}>
                      {productDetails.height} cm
                    </Text>
                  </View>
                  {/* {item.attributes.map((i, key) => {
                return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[screenStyles.weightText, { marginTop: 8 }]}>{i.name}</Text>
                  <Text style={[screenStyles.weightText, { marginTop: 8 }]}>{i.value}</Text>
                </View>
              })} */}
                </View>
              </View>
              {/* Discount */}
              {/* <View
            style={{
              borderColor: '#ee3b28',
              borderWidth: 1,
              padding: 8,
              borderStyle: 'dashed',
              borderRadius: 6,
              backgroundColor: '#ffeaea',
              marginTop: 5,
            }}>
            <Text style={{ color: '#ee3b28' }}>
              Get 15% discount Use MEGASALE{'\n'}
              <Text style={{ textDecorationLine: 'underline' }}>T&C</Text>
              <Text> • </Text>
              <Text style={{ textDecorationLine: 'underline' }}>Details</Text>
            </Text>
          </View> */}
            </View>
          </View>
        );
      }}
    />
  );
};
