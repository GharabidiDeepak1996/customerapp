import React, {useRef, useState, useEffect} from 'react';
import {FlatList, Image, Text, View, useColorScheme} from 'react-native';
import BaseView from '../BaseView';
import Globals from '../../utils/Globals';
import {Styles} from './Style';
import axios from 'axios';
import IconNames from '../../../branding/carter/assets/IconNames';
import Routes from '../../navigation/Routes';
import {SortByBottomSheet} from './SortByBottomSheet/SortByBottomSheet';
import {CommonActions, StackActions} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {ProductService} from '../../apis/services/product';
import {useFocusEffect} from '@react-navigation/native';
import {ToastAndroid} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {GroceryItem} from '../../components/Application/GroceryItem/View';
import {
  cartCount,
  clearProducts,
} from '../../redux/features/AddToCart/ProductSlice';
import {useTheme} from '@react-navigation/native';
import {BottomCartItem} from '../../components/Application/BottomCartItem/View';
import {useTranslation} from 'react-i18next';
import {SearchButton} from '../../components/Application/SearchButton/View';
import uuid from 'react-native-uuid';
import {SvgIcon} from '../../components/Application/SvgIcon/View';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalSearchButton} from '../../components/Application/GlobalSearchButton/View';
import AppConfig from '../../../branding/App_config';
const assets = AppConfig.assets.default;

export const GroceryProduct = props => {
  const {t, i18n} = useTranslation();

  //redux
  const productCount = useSelector(state => state.product.cartCount);
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const {colors} = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  const dispatch = useDispatch();
  const [groceryProducts, setGroceryProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const [isProductFound, setIsProductFound] = useState(true);
  const [checked, setChecked] = useState('Price (Low)');

  const [id, setId] = useState(props.id);
  const [showSortByBottomSheet, setShowSortByBottomSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [filteredStoreList, setFilteredStoreList] = useState([]);
  const [filteredStoreList22, setFilteredStoreList22] = useState([]);
  //const { categoryId, categoryTypeId } = props.route.params;
  const [showButton, setShowButton] = useState(true);

  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);

  const defaultAddressID = useSelector(
    state => state.addressReducer.defaultAddressID,
  );
  const {category, categoryTypeId, categoryId} = props.route.params;

  const fetchPrice = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');

      const data = await ProductService.getcartCountByStore(
        categoryTypeId,
        deliveryIn,
        getUserId,
      );

      if (data.data.payload == null) {
        let count = 0; //cartCount
        dispatch(cartCount({count}));
        dispatch(clearProducts(categoryTypeId));
      } else {
        let count = data.data.payload.length;
        dispatch(cartCount({count}));
      }
    } catch (error) {
      console.log('Grocery product------------', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Your code to re-render or fetch data goes here

      fetchPrice();
      getGroceryCategory(categoryId, categoryTypeId);
    }, []),
  );

  const getGroceryCategory = async (category, categoryTypeId) => {
    let responseGroceryProducts = null;
    const getUserId = await AsyncStorage.getItem('userId');
    try {
      let body = {
        latitude: latSlice,
        longitude: lngSlice,
        userId: getUserId,
        categoryId: category,
        Locationid: defaultAddressID,
      };

      console.log('7777777777777777777777777777777Fresh Food', body);

      if (categoryTypeId == 1) {
        responseGroceryProducts = await ProductService.getGroceryProduct(
          category,
          getUserId,
          body,
        );
      } else if (categoryTypeId == 5) {
        responseGroceryProducts = await ProductService.getFreshProduct(
          category,
          getUserId,
          body,
        );
      }

      if (responseGroceryProducts?.data?.isSuccess) {
        setIsProductFound(true);
        setGroceryProducts(responseGroceryProducts?.data?.payload);
        setFilteredStoreList(responseGroceryProducts?.data?.payload);
        setLoading(false);
      } else {
        setIsProductFound(false);
        //ToastAndroid.show(responseGroceryProducts?.data?.message, ToastAndroid.LONG);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setIsProductFound(false);
      ToastAndroid.show(error, ToastAndroid.LONG);
      console.log('Grocery product---------------', error);
    }
  };

  const _showSortByBottomSheetComponent = val => {
    setShowSortByBottomSheet(val);
  };

  const handleSearch = query => {
    // Update the searchQuery state with the received query

    setSearchQuery(query);

    const filteredList = groceryProducts.filter(item =>
      item.productName.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredStoreList(filteredList);

    if (filteredList.length == 0) {
      setIsProductFound(false);
    } else {
      setIsProductFound(true);
    }

    // Perform any additional actions related to search (if needed)
    // ... your search logic ...
  };

  const sortProductsByPriceHigh = () => {
    const filteredPrice = groceryProducts.sort((a, b) => {
      // Convert prices to numbers for proper sorting
      let price1 = a.sellingPrice == 0 ? a.regularPrice : a.sellingPrice;
      let price2 = b.sellingPrice == 0 ? b.regularPrice : b.sellingPrice;
      const priceA = parseFloat(price1);
      const priceB = parseFloat(price2);

      return priceB - priceA;
    });
    setFilteredStoreList(filteredPrice);
  };
  const sortProductsByPriceLow = () => {
    const filteredPrice = groceryProducts.sort((a, b) => {
      // Convert prices to numbers for proper sorting
      let price1 = a.sellingPrice == 0 ? a.regularPrice : a.sellingPrice;
      let price2 = b.sellingPrice == 0 ? b.regularPrice : b.sellingPrice;
      const priceA = parseFloat(price1);
      const priceB = parseFloat(price2);

      return priceA - priceB;
    });
    setFilteredStoreList(filteredPrice);
  };

  useEffect(() => {
    if (checked === 'Price (High)') {
      sortProductsByPriceHigh();
    } else if (checked === 'Price (Low)') {
      sortProductsByPriceLow();
    }
  }, [checked]);

  //just now
  // useEffect(() => {
  //   setShowLoader(false);
  // }, [productCount])

  // Callback function to receive data from the child
  const handleChildMessage = boolean => {
    setShowLoader(boolean);
  };

  const scrollToTop = (layoutMeasurement, contentOffset, contentSize) => {
    console.log(
      '00000000000000000000000000000000000000',
      layoutMeasurement.height + contentOffset.y,
      '===========',
      contentSize.height,
    );

    if (layoutMeasurement.height + contentOffset.y <= contentSize.height - 20) {
      return setShowButton(true);
    } else {
      return setShowButton(false);
    }
  };

  const onScroll = event => {
    scrollToTop(
      event.nativeEvent.layoutMeasurement,
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
    );
  };
  return (
    <View style={{flex: 1}}>
      <BaseView
        navigation={props.navigation}
        title={t(props.route.params.category)}
        rightIcon={productCount != 0 && IconNames.BagShopping}
        showsVerticalScrollIndicator={true}
        onRightIconPress={() => {
          //bottomTabsVariant3
          // props.navigation.navigate(Routes.COURIER, {
          props.navigation.navigate(Routes.CART, {
            categoryTypeId: props.route.params.categoryTypeId,
          });
        }}
        headerWithBack
        applyBottomSafeArea
        childView={() => {
          return (
            <View style={itemStyles.container}>
              {isLoading ? (
                <ActivityIndicator color={colors.activeColor} size="large" />
              ) : (
                <View style={{flex: 1}}>
                  {groceryProducts.length > 0 && (
                    <SearchButton
                      onPress={() => {}}
                      onChangeText={text => setSearchQuery(text)}
                      onSearch={handleSearch} // Pass the handleSearch function to the SearchButton
                      value={'abc'}
                      placeholder={t('Search Product')}
                    />
                  )}

                  {isProductFound && (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {
                          _showSortByBottomSheetComponent(true);
                        }}>
                        <View style={itemStyles.tabCardView}>
                          <SvgIcon
                            type={IconNames.Exchange}
                            width={18}
                            height={18}
                            style={{
                              transform: [{rotate: '90deg'}],
                            }}
                          />
                          <View style={{marginLeft: 6}}>
                            <Text style={itemStyles.ratingText}>
                              {t('Sort by')}
                            </Text>
                            <Text style={itemStyles.subText}>{checked}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {/* <View style={itemStyles.tabCardView}>
                      <SvgIcon type={IconNames.StarGreen} width={18} height={18} />
                      <Text style={itemStyles.ratingText}>Offer Zone</Text>
                    </View> */}
                    </View>
                  )}

                  {groceryProducts.length > 0 ? (
                    isProductFound > 0 ? (
                      <FlatList
                        onScroll={onScroll}
                        showsVerticalScrollIndicator={false}
                        data={filteredStoreList}
                        // data={
                        //   filteredStoreList.length > 0
                        //     ? filteredStoreList
                        //     : groceryProducts
                        // }
                        //isProductFound
                        keyExtractor={(item, index) => {
                          return uuid.v4();
                        }}
                        renderItem={({item, index}) => {
                          return (
                            <View style={itemStyles.foodFirstItem}>
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
                                productStoreDescription={
                                  item.productStoreDescription
                                }
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
                                categoryTypeId={
                                  props.route.params.categoryTypeId
                                }
                                autoOpen={item.autoOpen}
                                onMessage={handleChildMessage}
                              />
                            </View>
                          );
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={assets.no_search}
                            style={itemStyles.headerImage}
                          />

                          <Text style={itemStyles.title}>No result found</Text>
                          <Text style={itemStyles.subTitle}>
                            We didn't find any results for{' '}
                            <Text style={itemStyles.titleHighliter}>
                              {' '}
                              {searchQuery}
                            </Text>
                            . Perhaps you could try refining your search by
                            using different keywords or checking the spelling
                          </Text>
                        </View>
                      </View>
                    )
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={assets.no_product}
                          style={itemStyles.headerImage}
                        />

                        <Text style={itemStyles.title}>No Products</Text>
                        <Text style={itemStyles.subTitle}>
                          We're experiencing a temporary shortage of products.
                          If you can please browse other categories or try again
                          later.
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />

      {showLoader && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000,
          }}>
          <ActivityIndicator color={colors.activeColor} size="large" />
        </View>
      )}
      {/* Add flot cart */}
      {productCount > 0 && showButton && (
        // <BottomCartItem
        //   categoryTypeId={categoryTypeId}
        //   navigation={props.navigation}
        // />

        <View
          style={{
            height: 50,
            width: '100%',
            position: 'absolute',
            bottom: -0.1,
            marginBottom: 18,
          }}>
          <View style={{width: '90%', marginHorizontal: 16}}>
            <BottomCartItem
              categoryTypeId={categoryTypeId}
              navigation={props.navigation}
            />
          </View>
        </View>
      )}

      {showSortByBottomSheet && (
        <SortByBottomSheet
          isVisible={showSortByBottomSheet}
          onSelected={setChecked}
          value={checked}
          CloseSortByBottomSheet={() => {
            setShowSortByBottomSheet(!showSortByBottomSheet);
          }}
        />
      )}
    </View>
  );
};

//  {/* filter */}
// {productCount <= 0 && (
//   <View
//     style={{
//       flexDirection: 'row',
//       backgroundColor: 'black',
//       height: 50,
//       alignItems: 'center',
//     }}>
//     <View
//       style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
//       <TouchableOpacity
//         onPress={() => {
//           _showSortByBottomSheetComponent(true);
//         }}>
//         <Text style={itemStyles.text}>{t('Sort by')}</Text>
//         <Text style={itemStyles.subText}>{checked}</Text>
//       </TouchableOpacity>
//     </View>

//     <View style={{ borderWidth: 1, height: 50, borderLeftColor: 'gray' }} />

//     <View
//       style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
//       <TouchableOpacity>
//         <Text style={itemStyles.text}>{t('Filters')}</Text>
//       </TouchableOpacity>
//     </View>

//     {/* {showSortByBottomSheet && (
//       <SortByBottomSheet
//         productList={showSortByBottomSheet}
//         CloseSortByBottomSheet={() => {
//           setShowSortByBottomSheet(!showSortByBottomSheet);
//         }}
//       />
//     )} */}
//   </View>
// )}
