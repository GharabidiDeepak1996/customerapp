import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { FoodItem } from '../../components/Application/FoodItem/View';
import BaseView from '../BaseView';
import Globals from '../../utils/Globals';
import style from './Style';
import axios from 'axios';
import IconNames from '../../../branding/carter/assets/IconNames';
import Routes from '../../navigation/Routes';
import { StoreBottomSheet } from '../../components/Application/StoreBottomSheet/View';
import { SortByBottomSheet } from './SortByBottomSheet/SortByBottomSheet';
import { CommonActions, StackActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/Cart/cartSlice';
import { ProductService } from '../../apis/services/product';
import { useFocusEffect } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native';

const baseUrl = Globals.baseUrl;
const api = 'customer';
const categoryID = 1;

export const CategoryItems = props => {
  //redux tool kit
  const dispatch = useDispatch();
  const deliveryIn = useSelector(state => state.addressReducer.deliveryId);


  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [id, setId] = useState(props.id);
  const [showStoreBottomSheetComponent, setStoreBottomSheetComponent] =
    useState(false);

  const categoryID = props.route.params.categoryId;
  //const apiUrl = `${baseUrl}/${api}/ShopOwner/${categoryID}/products`;

  console.log('newid-------------------------', categoryID);

  const apiUrl = `${baseUrl}/ShopOwner/${props.route.params.categoryId}/products`;

  const fetchPrice = async () => {
    try {
      const data = await ProductService.getcartCountByStore(
        props.route.params.categoryTypeId, deliveryIn
      );

      console.log('==========-=--=-', props.route.params.categoryTypeId);
      if (data.data.payload == null) {
        let count = 0;
        dispatch(addToCart({ count }));
      } else {
        let count = data.data.payload.length;
        dispatch(addToCart({ count }));
      }
    } catch (error) {
      console.log('Category item-----------------------', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Your code to re-render or fetch data goes here
      console.log('Screen is focused');
      fetchPrice();
      // ...
    }, []),
  );
  useEffect(() => {
    fetchPrice();
    axios
      .get(apiUrl)
      .then(response => {
        if (response.data.isSuccess) {
          setData(response.data.payload);
          setLoading(false);
        } else {
          ToastAndroid.show(response.data.message, ToastAndroid.LONG);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('CategoryItems-----', props);

        setLoading(false);
        ToastAndroid.show(error, ToastAndroid.LONG);
        console.error('Error:', error);
      });
  }, []);

  const _storeBottomSheetComponent = () => {
    console.log('Mineral water-----', props);

    setStoreBottomSheetComponent(props);
  };

  return (
    <View style={{ flex: 1 }}>
      <BaseView
        navigation={props.navigation}
        title={props.route.params.category}
        rightIcon={IconNames.BagShopping}
        onRightIconPress={() => {
          //bottomTabsVariant3
          props.navigation.navigate(Routes.COURIER, {
            categoryTypeId: props.route.params.categoryTypeId,
          });
          // props.navigation.dispatch(
          //   CommonActions.reset({
          //     index: 1,
          //     routes: [{name: Routes.COURIER}],
          //   }),
          // );
          //props.navigation.dispatch(StackActions.pop(Routes.COURIER));
        }}
        headerWithBack
        applyBottomSafeArea
        childView={() => {
          return (
            <View style={{ flex: 1 }}>
              {isLoading ? (<ActivityIndicator
                color="#4E9F3D"
                size="large"
                style={{ flex: 1 }}
              />) : (<FlatList
                showsVerticalScrollIndicator={false}
                //data={Globals.foodItems}
                data={data}
                // numColumns={2}
                keyExtractor={(item, index) => {
                  return item.productStoreId;
                }}
                renderItem={({ item, index }) => {
                  return (
                    <View style={style.foodFirstItem}>

                      <FoodItem
                        productStoreId={item.productStoreId}
                        title={item.productName}
                        userId={item.userId}
                        productId={item.productId}
                        partnerId={item.partnerId}
                        stockQuantity={item.stockQuantity}
                        price={item.price}
                        sellingPrice={item.sellingPrice}
                        regularPrice={item.regularPrice}
                        attributes={item.attribute}
                        imgURL={item.imageUrl}
                        rating={item.averageRating}
                        specification={item.specification}
                        packagingType={item.packagingTypeName}
                        stock={item.stockQuantity}
                        categoryTypeId={props.route.params.categoryTypeId}
                        productDescription={item.productDescription}
                        productAttributes={item.attribute}
                        // image={item.imageUrl}
                        //bigImage={item.bigImage}
                        //price={item.price}
                        //weight={item.specification}
                        //discount={item.discountPrice}
                        //cartCount={item.cartCount}
                        //isFavourite={item.isFavourite}
                        //detail={item.detail}
                        //ratingValue={item.ratingValue}
                        cartCountChange={count => { }}
                        favouriteChange={favourite => { }}
                        navigation={props.navigation}
                        setSelectedProduct={setSelectedProduct}
                      />
                    </View>
                  );

                  // if (index === 0 || index === 1) {
                  //     return <View style={style.foodFirstItem}>

                  //         <FoodItem
                  //             //title={item.title}
                  //             title={item.productName}
                  //             image={item.imageUrl}
                  //             //bigImage={item.bigImage}
                  //             price={item.price}
                  //             weight={item.specification}
                  //             discount={item.discountPrice}
                  //             //cartCount={item.cartCount}
                  //             isFavourite={item.isFavourite}
                  //             //detail={item.detail}
                  //             ratingValue={item.ratingValue}
                  //             cartCountChange={(count) => {
                  //             }}
                  //             favouriteChange={(favourite) => {
                  //             }}
                  //             navigation={props.navigation}
                  //         />

                  //     </View>
                  // } else if (index === Globals.foodItems.length - 1) {
                  //     return <View style={style.foodLastItem}>

                  //         <FoodItem
                  //             title={item.title}
                  //             image={item.image}
                  //             bigImage={item.bigImage}
                  //             price={item.price}
                  //             weight={item.weight}
                  //             discount={item.discount}
                  //             cartCount={item.cartCount}
                  //             isFavourite={item.isFavourite}
                  //             detail={item.detail}
                  //             ratingValue={item.ratingValue}
                  //             cartCountChange={(count) => {
                  //             }}
                  //             favouriteChange={(favourite) => {
                  //             }}
                  //             navigation={props.navigation}
                  //         />

                  //     </View>
                  // } else {
                  //     return <FoodItem
                  //         id={item.id}
                  //         title={item.title}
                  //         image={item.image}
                  //         bigImage={item.bigImage}
                  //         price={item.price}
                  //         weight={item.weight}
                  //         discount={item.discount}
                  //         cartCount={item.cartCount}
                  //         isFavourite={item.isFavourite}
                  //         detail={item.detail}
                  //         ratingValue={item.ratingValue}
                  //         cartCountChange={(count) => {
                  //         }}
                  //         favouriteChange={(favourite) => {
                  //         }}
                  //         navigation={props.navigation}
                  //     />
                  // }
                }}
              />
              )}
            </View>
          );
        }}
      />
      <View
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
            <Text style={{ color: 'white' }}>SORT BY</Text>
          </TouchableOpacity>
        </View>

        <View style={{ borderWidth: 1, height: 50, borderLeftColor: 'gray' }} />

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: 'white' }}>FILTER</Text>
          </TouchableOpacity>
        </View>

        {showStoreBottomSheetComponent && (
          <SortByBottomSheet
            productList={showStoreBottomSheetComponent}
            CloseStoreBottonSheet={() => {
              setStoreBottomSheetComponent(!showStoreBottomSheetComponent);
            }}
          />
        )}
      </View>
    </View>
  );
};
