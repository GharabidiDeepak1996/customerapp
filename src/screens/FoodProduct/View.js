import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Text, useColorScheme, View } from 'react-native';
import BaseView from '../BaseView';
import Globals from '../../utils/Globals';
import { Styles } from './Style';
import axios from 'axios';
import IconNames from '../../../branding/carter/assets/IconNames';
import Routes from '../../navigation/Routes';
import { CommonActions, StackActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/Cart/cartSlice';
import { ProductService } from '../../apis/services/product';
import { useFocusEffect } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native';
import colors from '../../../branding/carter/styles/dark/Colors';
import { FoodItem } from '../../components/Application/FoodItem/View';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchButton } from '../../components/Application/SearchButton/View';
import uuid from 'react-native-uuid';
import AppConfig from '../../../branding/App_config';
const assets = AppConfig.assets.default;

export const FoodProduct = props => {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);

  //rdux tool kit
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);

  const [foodRest, setFoodRest] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isProductFound, setIsProductFound] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [id, setId] = useState(props.id);
  const [showStoreBottomSheetComponent, setStoreBottomSheetComponent] =
    useState(false);

  const { categoryId, categoryTypeId } = props.route.params;
  const [searchQuery, setSearchQuery] = useState();
  const [filteredStoreList, setFilteredStoreList] = useState([]);
  const latSlice = useSelector(state => state.addressReducer.lat);
  const lngSlice = useSelector(state => state.addressReducer.lng);
  const defaultAddressID = useSelector(
    state => state.addressReducer.defaultAddressID,
  );
  const productCount = useSelector(state => state.product.cartCount);

  const fetchPrice = async () => {
    try {
      const UserId = await AsyncStorage.getItem('userId');

      const data = await ProductService.getcartCountByStore(
        categoryTypeId,
        1,
        UserId,
      );

      if (data?.data?.payload == null) {
        let count = 0;
        dispatch(addToCart({ count }));
      } else {
        let count = data.data.payload.length;
        dispatch(addToCart({ count }));
      }
    } catch (error) {
      console.log('Food Product----------------', error);
    }
  };

  const getFoodCategory = async category => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');
      let body = {
        latitude: latSlice,
        longitude: lngSlice,
        userId: getUserId,
        categoryId: category,
        Locationid: defaultAddressID,
      };
      const responseGroceryProducts = await ProductService.getFoodProduct(
        category,
        getUserId,
        body,
      );
      if (responseGroceryProducts?.data?.isSuccess) {
        setIsProductFound(true);

        setFoodRest(responseGroceryProducts?.data?.payload);
        setFilteredStoreList(responseGroceryProducts?.data?.payload);
        setLoading(false);
      } else {
        setIsProductFound(false);
        // ToastAndroid.show(
        //   responseGroceryProducts?.data.message,
        //   ToastAndroid.LONG,
        // );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setIsProductFound(false);
      ToastAndroid.show(error, ToastAndroid.LONG);
      console.log('Food Product----------------', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log('Food Product----------------');
      // Your code to re-render or fetch data goes here
      fetchPrice();
      getFoodCategory(categoryId);
      // ...
    }, []),
  );

  // useEffect(() => {
  //   console.log('Food Product----------------');
  //   fetchPrice();
  //   getFoodCategory(categoryId);
  // }, [categoryId]);

  const handleSearch = query => {
    // Update the searchQuery state with the received query

    setSearchQuery(query);

    const filteredList = foodRest.filter(item =>
      item.partnerName.toLowerCase().includes(query.toLowerCase()),
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
  return (
    <View style={{ flex: 1 }}>
      <BaseView
        navigation={props.navigation}
        title={props.route.params.category}
        rightIcon={productCount != 0 && IconNames.BagShopping}
        onRightIconPress={() => {
          props.navigation.navigate(Routes.CART, {
            categoryTypeId: props.route.params.categoryTypeId,
          });
          //bottomTabsVariant3
          // props.navigation.navigate(Routes.COURIER, {
          //   categoryTypeId: props.route.params.categoryTypeId,
          // });
        }}
        headerWithBack
        applyBottomSafeArea
        childView={() => {
          return (
            <View style={itemStyles.container}>
              {isLoading ? (
                <ActivityIndicator color={colors.activeColor} size="large" />
              ) : (
                <View style={{ flex: 1 }}>
                  {isProductFound && (
                    <SearchButton
                      onPress={() => { }}
                      onChangeText={text => setSearchQuery(text)}
                      onSearch={handleSearch} // Pass the handleSearch function to the SearchButton
                      value={'abc'}
                      placeholder={'Search restaurant'}
                    />
                  )}
                  {isProductFound ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={filteredStoreList}
                      keyExtractor={(item, index) => {
                        return uuid.v4();
                        // return item.productStoreId;
                      }}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={itemStyles.foodFirstItem}>
                            <FoodItem
                              storeImage={item.storeImage}
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
                              partnerStoreDescription={item.partnerStoreDescription}
                              productName={item.productName}
                              productDescription={item.productDescription}
                              bestSeller={item.bestSeller}
                              returnable={item.returnable}
                              cancellable={item.cancellable}
                              partnerStoreId={item.partnerStoreId}
                              userId={item.userId}
                              productId={item.productId}
                              partnerId={item.partnerId}
                              specification={item.specification}
                              sku={item.sku}
                              regularPrice={item.regularPrice}
                              partnerName={item.partnerName}
                              productPackagingId={item.productPackagingId}
                              productImageUrl={item.productImageUrl}
                              ownerName={item.ownerName}
                              navigation={props.navigation}
                              categoryTypeId={props.route.params.categoryTypeId}
                              favourite={item.isfavorite}
                              userFavorite={item.userFavorite}
                              autoOpen={item.autoOpen}
                            // setSelectedProduct={setSelectedProduct}
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
                          source={assets.no_restaurant}
                          style={itemStyles.headerImage}
                        />

                        <Text style={itemStyles.title}>No Restaurants</Text>
                        <Text style={itemStyles.subTitle}>
                          We're sorry, but there are currently no serviceable
                          restaurant in your area. Please change your delivery
                          address.
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
      {/* <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'black',
          height: 50,
          alignItems: 'center',
        }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedProduct(props), _storeBottomSheetComponent(props);
            }}>
            <Text style={itemStyles.text}>SORT BY</Text>
            <Text style={itemStyles.subText}>Relevance</Text>
          </TouchableOpacity>
        </View>

        <View style={{ borderWidth: 1, height: 50, borderLeftColor: 'gray' }} />

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity>
            <Text style={itemStyles.text}>FILTER</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};
