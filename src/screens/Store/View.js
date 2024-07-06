import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  useColorScheme,
  ImageBackground,
  ToastAndroid,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BaseView from '../BaseView';
import IconNames from '../../../branding/carter/assets/IconNames';
import { Image } from 'react-native';
import { Rating } from 'react-native-elements';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import { SearchButton } from '../../components/Application/SearchButton/View';
import colors from '../../../branding/carter/styles/light/Colors';
import { useTheme } from '@react-navigation/native';
import { Styles } from './Styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ShopService } from '../../apis/services/Shop';
import DeviceInfo from 'react-native-device-info';
import { GroceryItem } from '../../components/Application/GroceryItem/View';
import { FoodStoreItem } from '../../components/Application/FoodStoreItem/View';
import Routes from '../../navigation/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { BottomCartItem } from '../../components/Application/BottomCartItem/View';
import uuid from 'react-native-uuid';
import assets from '../../../branding/carter/assets/Assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductService } from '../../apis/services';

export const Store = props => {
  //redux
  const productCount = useSelector(state => state.product.cartCount);
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const [showButton, setShowButton] = useState(true);

  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  const [heartFillIcon, setHeartFilledIcon] = useState(IconNames.HeartFilled);
  const [heartFillIconColor, setHeartFilledIconColor] = useState(
    colors.heartFilled,
  );
  const [emptyHeartFillIcon, setEmptyHeartFilledIcon] = useState(
    IconNames.Heart,
  );
  const [emptyHeartFillIconColor, setEmptyHeartFilledIconColor] = useState(
    colors.heartEmpty,
  );

  const [storeList, setStoreList] = useState([]);
  const [isLoader, setIsLoader] = useState(true);

  const [filteredStoreList, setFilteredStoreList] = useState([]);

  const defaultAddress = useSelector(
    state => state.addressReducer.defaultAddress,
  );

  const {
    restaurantId,
    partnerName,
    openingHrs,
    closingHrs,
    categoryTypeId,
    navigation,
    avarageRating,
    ratingCount,
    directSearch,
    userFavorite,
    isStoreOpen,
  } = props.route.params;
  const [searchQuery, setSearchQuery] = useState(directSearch);

  const [isFav, setIsFav] = useState(userFavorite);

  useEffect(() => {
    (async () => {
      try {
        const uniqueId = await DeviceInfo.getUniqueId();

        let response = await ShopService.getStoreWiseProduct(
          restaurantId,
          uniqueId,
          categoryTypeId,
        );
        console.log('Store----Response--->', response.data.payload);
        if (response.data.isSuccess) {
          setIsLoader(false);
          setStoreList(response.data.payload);
        } else {
          setStoreList([]);
          setIsLoader(false);
        }
      } catch (error) {
        setIsLoader(false);
        console.log('Error in storscreen', error);
      }
    })();
  }, [restaurantId]);

  const addToFav = async () => {
    try {
      const UserId = await AsyncStorage.getItem('userId');

      let body = {
        UserId: UserId, //,30032,
        partnerId: restaurantId,
      };

      const data = await ProductService.addToFavourite(body);
      //console.log('addToFav-------------------', data);
      if (data.data.payload === null) {
        console.log('nnnuuullllll', data.data);
      } else {
        setIsFav(true);
        console.log('not nnnuuullllll', data.data);
      }
    } catch (error) {
      console.log('Food Product----------------', error);
    }
  };

  const removeFromFav = async () => {
    try {
      const UserId = await AsyncStorage.getItem('userId');
      console.log('removeFromFav UserId', UserId);
      console.log('removeFromFav partnerId', restaurantId);

      const data = await ProductService.removeFromFavourite(
        UserId,
        restaurantId,
      );

      //console.log('removeFromFav--------------', data);
      if (data.data.payload == null) {
        console.log('removeFromFav nnnuuullllll', data.data);
      } else {
        setIsFav(false);
        console.log('removeFromFav not nnnuuullllll', data.data);
      }
    } catch (error) {
      console.log('Food Product----------------', error);
    }
  };

  // // Filter storeList based on searchQuery
  // useEffect(() => {
  //   const filteredList = storeList.filter(item =>
  //     item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  //   );
  //   setFilteredStoreList(filteredList);
  // }, [searchQuery, storeList]);

  const handleSearch = query => {
    // Update the searchQuery state with the received query

    console.log('=================================', directSearch);
    setSearchQuery(query);

    const filteredList = storeList.filter(item =>
      item.productName.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredStoreList(filteredList);
    // Perform any additional actions related to search (if needed)
    // ... your search logic ...
  };

  let titleName = '';
  if (categoryTypeId == 1) {
    titleName = 'Store';
  } else if (categoryTypeId == 2) {
    titleName = 'Restaurant';
  } else if (categoryTypeId == 5) {
    titleName = 'Shop';
  }
  //https://stackoverflow.com/questions/41056761/detect-scrollview-has-reached-the-end
  const scrollToTop = (layoutMeasurement, contentOffset, contentSize) => {
    //console.log("00000000000000000000000000000000000000", contentOffset.y > 0 && layoutMeasurement.height + contentOffset.y < contentSize.height - 20)
    // console.log("00000000000000000000000000000000000000", layoutMeasurement.height + contentOffset.y, "===========", contentSize.height)

    if (layoutMeasurement.height + contentOffset.y <= contentSize.height - 20) {
      return setShowButton(true);
    } else {
      return setShowButton(false);
    }
  };
  const scrollToBottom = (layoutMeasurement, contentOffset, contentSize) => {
    return (
      (contentOffset.y == 0 || contentOffset.y > 100) && setShowButton(false)
    );
  };

  const onScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    scrollToTop(
      event.nativeEvent.layoutMeasurement,
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
    );
    // scrollToBottom(event.nativeEvent.layoutMeasurement, event.nativeEvent.contentOffset, event.nativeEvent.contentSize)
    //scrollY > 100

    // console.log("00000000000000000000000000000000000000", event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y, "==================", event.nativeEvent.contentSize.height)

    // if (event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y <= event.nativeEvent.contentSize.height - 20) {
    //   setShowButton(true);
    // } else {
    //   setShowButton(false);
    // }
  };
  return (
    <BaseView
      navigation={props.navigation}
      title={titleName}
      rightIcon={productCount !== 0 && IconNames.BagShopping}
      onRightIconPress={() => {
        navigation.navigate(Routes.CART, {
          categoryTypeId: categoryTypeId,
        });
      }}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View
            style={{
              backgroundColor: '#f5f5f5',
              marginHorizontal: -16,
              paddingHorizontal: 16,
              flex: 1,
            }}>
            <ImageBackground
              source={require('../../../branding/carter/assets/images/bestseller2.jpg')}
              blurRadius={80}
              style={{ marginHorizontal: -18 }}>
              <View
                style={{
                  backgroundColor: 'white',
                  marginHorizontal: 16,
                  marginVertical: 24,
                  borderRadius: 10,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={itemStyles.titleText}>{partnerName}</Text>

                  {categoryTypeId == 2 && (
                    <View style={itemStyles.favouriteContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          if (isFav) {
                            setIsFav(false);
                            removeFromFav();
                          } else {
                            setIsFav(true);
                            addToFav();
                          }
                        }}>
                        <View>
                          {isFav ? (
                            <SvgIcon
                              type={heartFillIcon}
                              width={20}
                              height={20}
                              color={heartFillIconColor}
                            />
                          ) : (
                            <SvgIcon
                              type={emptyHeartFillIcon}
                              width={20}
                              height={20}
                              color={emptyHeartFillIconColor}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                  }}>
                  {avarageRating != 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 8,
                      }}>
                      <SvgIcon
                        type={IconNames.Star}
                        width={18}
                        height={18}
                        color="gray"
                      />
                      <Text style={itemStyles.subText}>{avarageRating}</Text>
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <SvgIcon
                      type={IconNames.Clock}
                      width={14}
                      height={14}
                      color="gray"
                    />
                    <Text style={itemStyles.subText} numberOfLines={1}>
                      {openingHrs} - {closingHrs}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  {/* <View
                    style={{
                      alignItems: 'center',

                      alignSelf: 'flex-start',
                      flex: 0.08,
                    }}>
                    <View
                      style={{
                        height: 8,
                        width: 8,
                        backgroundColor: '#909090',
                        borderRadius: 5,
                      }}></View>

                    <View
                      style={{
                        height: 20,
                        width: 1,
                        backgroundColor: '#909090',
                      }}></View>

                    <View
                      style={{
                        height: 8,
                        width: 8,
                        backgroundColor: '#909090',
                        borderRadius: 5,
                      }}></View>
                  </View> */}

                  <View style={{ flex: 1 }}>
                    <Text style={itemStyles.subText1}>
                      {categoryTypeId == 1 ? (
                        <Text style={{ color: 'black' }}>Store -</Text>
                      ) : (
                        <Text style={{ color: 'black' }}>Restaurant -</Text>
                      )}{' '}
                      {storeList[0]?.address.address1 +
                        ', ' +
                        storeList[0]?.address.address2 +
                        ', ' +
                        storeList[0]?.address.mapAddress}
                    </Text>

                    <Text style={itemStyles.subText2}>
                      <Text style={{ color: 'black' }}>Delivery to -</Text>{' '}
                      {defaultAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View style={{ marginTop: 5 }}>
              <SearchButton
                onPress={() => { }}
                onChangeText={text => setSearchQuery(text)}
                onSearch={handleSearch} // Pass the handleSearch function to the SearchButton
                value={'abc'}
                placeholder={'Search product by name'}
              />
            </View>

            {isLoader ? (
              <ActivityIndicator color={colors.activeColor} size="large" />
            ) : storeList.length !== 0 ? (
              <FlatList
                onScroll={onScroll} // Use onEndReached for handling the end of the list
                //onScrollEndDrag={onScroll}
                onEndReachedThreshold={0.07} // Adjust threshold as needed
                showsVerticalScrollIndicator={true}
                data={
                  filteredStoreList.length > 0 ? filteredStoreList : storeList
                }
                style={{ height: hp(52) }}
                keyExtractor={(item, index) => {
                  return uuid.v4();
                  //return item.id;
                }}
                renderItem={({ item, index }) => {
                  return (
                    //style={itemStyles.foodFirstItem}
                    <View style={itemStyles.foodFirstItem}>
                      {(categoryTypeId == 1 || categoryTypeId == 5) && (
                        <GroceryItem
                          navigation={props.navigation}
                          openingHrs={item.openingHrs}
                          closingHrs={item.closingHrs}
                          categoryId={item.categoryId}
                          categoryName={item.categoryName}
                          categoryDescription={item.categoryDescription}
                          packagingId={item.packagingId}
                          packagingName={item.packagingName}
                          weight={item.weight}
                          length={item.length}
                          width={item.width}
                          height={item.height}
                          sellingPrice={item.sellingPrice}
                          stockQuantity={item.stockQuantity}
                          ratingCount={item.ratingCount}
                          averageRating={item.averageRating}
                          productTypeId={item.productTypeId}
                          productName={item.productName}
                          productStoreDescription={item.productStoreDescription}
                          bestSeller={item.bestSeller}
                          returnable={item.returnable}
                          cancellable={item.cancellable}
                          partnerStoreId={item.partnerStoreId}
                          userId={item.userId}
                          productId={item.productId}
                          partnerId={item.partnerId}
                          sku={item.sku}
                          specification={item.specification}
                          regularPrice={item.regularPrice}
                          partnerName={item.partnerName}
                          productImageUrl={item.productImageUrl}
                          ownerName={item.ownerName}
                          productPackagingId={item.productPackagingId}
                          groceryList={item}
                          categoryTypeId={categoryTypeId}
                          isStore={true}
                          autoOpen={item.autoOpen}
                        //  setSelectedProduct={setSelectedProduct}
                        // {...item} // Pass the item data to GroceryItem component
                        />
                      )}

                      {categoryTypeId == 2 && (
                        <FoodStoreItem
                          navigation={props.navigation}
                          categoryId={item.categoryId}
                          categoryName={item.categoryName}
                          categoryDescription={item.categoryDescription}
                          packagingId={item.packagingId}
                          packagingName={item.packagingName}
                          weight={item.weight}
                          length={item.length}
                          width={item.width}
                          height={item.height}
                          sellingPrice={item.sellingPrice}
                          stockQuantity={item.stockQuantity}
                          ratingCount={item.ratingCount}
                          averageRating={item.averageRating}
                          productTypeId={item.productTypeId}
                          productName={item.productName}
                          productStoreDescription={item.productStoreDescription}
                          bestSeller={item.bestSeller}
                          returnable={item.returnable}
                          cancellable={item.cancellable}
                          partnerStoreId={item.partnerStoreId}
                          userId={item.userId}
                          productId={item.productId}
                          partnerId={item.partnerId}
                          sku={item.sku}
                          specification={item.specification}
                          regularPrice={item.regularPrice}
                          partnerName={item.partnerName}
                          productImageUrl={item.productImageUrl}
                          ownerName={item.ownerName}
                          productPackagingId={item.productPackagingId}
                          groceryList={item}
                          categoryTypeId={categoryTypeId}
                          isStore={true}
                          isStoreOpen={isStoreOpen}
                        //  setSelectedProduct={setSelectedProduct}
                        // {...item} // Pass the item data to GroceryItem component
                        />
                      )}
                    </View>
                  );
                }}
              />
            ) : categoryTypeId == 1 || categoryTypeId == 5 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginTop: 102,
                }}>
                <Image
                  source={assets.no_product}
                  style={itemStyles.headerImage}
                />

                <Text style={[itemStyles.title]}>No result found</Text>
                <Text style={[itemStyles.subTitle]}>
                  We're experiencing a temporary shortage of products. If you
                  can please browse other categories or try again later.
                </Text>
              </View>
            ) : (
              categoryTypeId == 2 && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    marginTop: 102,
                  }}>
                  <Image
                    source={assets.no_restaurant}
                    style={itemStyles.headerImage}
                  />

                  <Text style={[itemStyles.title]}>No Restaurants</Text>
                  <Text style={[itemStyles.subTitle]}>
                    We're sorry, but there are currently no serviceable
                    restaurant in your area. Please change your delivery
                    address.
                  </Text>
                </View>
              )
            )}

            {productCount !== 0 && showButton && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 18,
                  width: '100%',
                }}>
                <BottomCartItem
                  categoryTypeId={categoryTypeId}
                  navigation={props.navigation}
                />
              </View>
            )}
          </View>
        );
      }}
    />
  );
};
