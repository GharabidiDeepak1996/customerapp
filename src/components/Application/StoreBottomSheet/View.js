import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  useColorScheme,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SvgIcon } from '../SvgIcon/View';
import IconNames from '../../../../branding/carter/assets/IconNames';
import { Styles } from './Style';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { addToCart } from '../../../redux/features/Cart/cartSlice';
import { doAddToCart } from '../../../redux/features/Cart/service';
import { AuthService } from '../../../apis/services/Auth';
import { ProductService } from '../../../apis/services/product';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../../../../branding/App_config';
import moment from 'moment';
import Routes from '../../../navigation/Routes';

function getCartQtyByPartner(cartData, partnerId, productId) {
  let totalQty = 0;
  for (const item of cartData) {
    if (item.partnerId == partnerId && item.productId == productId) {
      totalQty += item.cartQty || 0;
    }
  }
  console.log('----------------787878', totalQty);
  return totalQty;
}

function getUserCartItemId(cartData, partnerId, productId) {
  let userCartItemId = 0;
  try {
    for (const item of cartData) {
      if (item.partnerId == partnerId && item.productId == productId) {
        userCartItemId += item.userCartItemId || 0;
      }
    }
  } catch (error) {
    console.log('userCartItemIdError', userCartItemId);
  }
  return userCartItemId;
}
function getUserCartId(cartData, partnerId, productId) {
  let userCartId = 0;
  try {
    for (const item of cartData) {
      if (item.partnerId == partnerId && item.productId == productId) {
        userCartId += item.userCartId || 0;
      }
    }
  } catch (error) {
    console.log('getUserCartIdError', userCartItemId);
  }
  return userCartId;
}
function getPriceByPartner(cartData, partnerId, productId) {
  let updatedPrice = 0;
  for (const item of cartData) {
    if (item.partnerId == partnerId && item.productId == productId) {
      updatedPrice = item.cartPrice || 0;
    }
  }
  return updatedPrice;
}

function isStoreOpen(partner) {
  try {
    //var currentDate = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
    var currentDate = moment(new Date()).format('hh:mm A');
    //const formattedOpeningHours = moment(openingHours, 'hh:mm A').format('hh:mm A');

    let openStore = '';

    if (currentDate >= partner.openingHrs || currentDate < partner.closingHrs) {
      console.log('Store is open.');
      return (openStore = 'Open');
    } else {
      console.log('Store is close.');
      return (openStore = 'Close');
    }
  } catch (err) {
    console.log('product-------121', err);
  }
}

const Typography = AppConfig.typography.default;
const Fonts = AppConfig.fonts.default;
function StoreList(props) {
  //
  const [cartCount, setCartCount] = useState(0); //useState(props.cartCount);
  const [cartPrice, setCartPrice] = useState(0); //useState(props.cartCount);
  const [stocked, setStocked] = useState(props.item.stockQuantity - 1);
  const [isLoading, setLoading] = useState(false);

  const [cartData, setCartData] = useState([]); //useState(props.cartCount);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const getUserId = await AsyncStorage.getItem('userId');

        const data = await ProductService.getcartCountByStore(
          props.categoryTypeId, 1, getUserId
        );
        if (data?.data?.isSuccess) {
          if (data.data.payload == null) {
            setCartPrice(0);
            setCartCount(0);
          } else {
            setCartData(data.data.payload);
            props.setCartDataa(data.data.payload); //pass cart quantity to parent

            for (const item of data.data.payload) {
              if (
                item.partnerId == props.item.partnerId &&
                props.productId == item.productId
              ) {
                console.log(
                  '---------4333333333-----------------3-----------3-',
                  item.cartPrice,
                );
                cartCount != item.cartQty && setCartCount(item.cartQty);
                cartPrice != item.cartPrice && setCartPrice(item.cartPrice);
              }
            }
          }
        } else {
          console.log(
            '---------4333333333-----------------3-----------3-',
            'else me gaya',
          );
          setCartPrice(0);
          setCartCount(0);
        }
      } catch (error) {
        console.log('useEffectStoreBottom', error);
      }
    })();
  }, []);

  const fetchPrice = async () => {
    try {
      const getUserId = await AsyncStorage.getItem('userId');
      const data = await ProductService.getcartCountByStore(
        props.categoryTypeId, 1, getUserId
      );
      if (data.data.payload == null) {
        let count = 0;
        dispatch(addToCart({ count }));
      } else {
        let count = data.data.payload.length;
        dispatch(addToCart({ count }));
      }
      if (data?.data?.isSuccess) {
        console.log('==-=-==============12121212', data.data.payload);

        if (data.data.payload == null) {
          setCartPrice(0);
          setCartCount(0);
          console.log('==-=-==============12121212', 'null me gaya');
        } else {
          setCartData(data.data.payload);
          props.setCartDataa(data.data.payload); //pass cart quantity to parent
          console.log('==-=-==============12121212', data.data.payload);

          for (const item of data.data.payload) {
            if (
              item.partnerId == props.item.partnerId &&
              props.productId == item.productId
            ) {
              console.log('==-=-==============12121212', item.cartPrice);
              cartCount != item.cartQty && setCartCount(item.cartQty);
              cartPrice != item.cartPrice && setCartPrice(item.cartPrice);
            }
          }
        }
      } else {
        console.log('==-=-==============12121212', 'else me gaya');

        setCartPrice(0);
        setCartCount(0);
      }
    } catch (error) {
      console.log('Store bottom shite-----------------', error);
    }
  };

  const stockIncrease = () => {
    setStocked(val => val - 1);
  };
  // console.log("sjdfjs======", isLoading)
  return (
    <>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 12,
          margin: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
          <Text
            style={{
              backgroundColor: '#1b8346',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 3,
              color: 'white',
            }}>
            {isStoreOpen(props.item)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* <FontAwesomeIcon
               icon={faHome}
               style={{color: 'black', marginRight: 2}}
              /> */}
            <TouchableOpacity
              onPress={() => {
                props.CloseStoreBottonSheet();
                props.setModalVisible(!props.productList);
                props.navigation.navigate(Routes.STORE, {
                  navigation: props.navigation,
                });
              }}>
              <Text
                style={{
                  fontWeight: '700',
                  marginLeft: 2,
                  marginEnd: 8,
                }}>
                Visit Shop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          {props.item.partnerName}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              marginVertical: 5,
            }}>
            <Text
              style={{
                color: '#666666',
                marginVertical: 5,
              }}>
              Stock:{props.item.stockQuantity}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.RUBIK_MEDIUM,
                color: '#1b8346',
                fontSize: Typography.P3,
              }}>
              {/* Rp:{props.item.price} */}
              Rp:
              {props.item.sellingPrice == 0
                ? props.item.regularPrice
                : props.item.sellingPrice}
            </Text>
          </View>

          {/* Add to cart */}

          {isLoading ? (
            <ActivityIndicator
              color={props.colors.activeColor}
              size="large"
              style={styles.activityIndicator}
            />
          ) : (
            //|| isStoreOpen(props.item) === "Close"
            <View
              style={
                props.item.stockQuantity === 0 || props.item.stockQuantity < 0
                  ? styles.buttonDeActiveContainer
                  : props.itemStyles.buttonActiveContainer
              }>
              {/* cartPrice{cartCount === 0 ? cartCount ( */}
              {console.log('=-------------------------------->', cartCount)}
              {cartCount == 0 ? (
                <TouchableOpacity
                  disabled={
                    props.item.stockQuantity === 0 ||
                      props.item.stockQuantity < 0
                      ? true
                      : false
                  }
                  onPress={async () => {
                    setStocked(val => {
                      return (val -= 1);
                    });
                    try {
                      console.log('he buttonclickedclicked------', props.item);
                      await props.handleAddToCart(
                        props.productList,
                        props.categoryTypeId,
                        props.item,
                        'add',
                        setCartCount,
                        cartCount,
                        cartPrice,
                        setCartData,
                        setCartPrice,
                        setLoading,
                      );
                      // props.item.stockQuantity,
                      // This function will be executed after handleAddToCart completes
                      fetchPrice();
                    } catch (error) {
                      console.log('he buttonclicked error------');
                      console.log('----------+++Add', error);
                    }
                  }}
                  style={props.itemStyles.addToCartContainer}>
                  {/* <SvgIcon
                    type={IconNames.BagShopping}
                    width={20}
                    height={20}
                    color={props.colors.activeColor}
                    //color={ props.colors.activeColor}
                    style={props.itemStyles.addCartIcon}
                  /> */}
                  <SvgIcon
                    type={IconNames.BagShopping}
                    width={20}
                    height={20}
                    color={
                      props.item.stockQuantity === 0 ||
                        props.item.stockQuantity < 0
                        ? '#C6C6C6'
                        : props.colors.activeColor
                    }
                    style={props.itemStyles.addCartIcon}
                  />
                  {/* //props.itemStyles.addCartText */}
                  <Text
                    style={
                      props.item.stockQuantity === 0 ||
                        props.item.stockQuantity < 0
                        ? styles.addCartDisableText
                        : props.itemStyles.addCartText
                    }>
                    {props.item.stockQuantity === 0 ||
                      props.item.stockQuantity < 0
                      ? 'Out of stock '
                      : 'Add To Cart'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={props.itemStyles.cartUpdateContainer}>
                  <TouchableOpacity
                    style={[
                      props.itemStyles.cartUpdateActionContainer,
                      {
                        borderRightWidth: 1,
                      },
                    ]}
                    //props.item.stockQuantity
                    onPress={async () => {
                      const qt = props.item.stockQuantity - 1;

                      setStocked(val => {
                        return (val += 1);
                      });

                      try {
                        await props.handleAddToCart(
                          props.productList,
                          props.categoryTypeId,
                          props.item,
                          'subtract',
                          setCartCount,
                          cartCount,
                          cartPrice,
                          setCartData,
                          setCartPrice,
                          setLoading,
                        );
                      } catch (error) {
                        console.log('----------+++subtract', error);
                      }
                      // props.item.stockQuantity
                      // This function will be executed after handleAddToCart completes
                      fetchPrice();
                    }}>
                    <SvgIcon
                      type={IconNames.Minus}
                      width={15}
                      height={15}
                      color={props.colors.activeColor}
                    />
                  </TouchableOpacity>

                  <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    {getCartQtyByPartner(
                      cartData,
                      props.item.partnerId,
                      props.productList.productId,
                    )}
                  </Text>

                  <TouchableOpacity
                    style={[
                      props.itemStyles.cartUpdateActionContainer,
                      {
                        borderLeftWidth: 1,
                      },
                    ]}
                    onPress={async () => {
                      const qt = props.item.stockQuantity - 1;
                      setStocked(val => {
                        return (val -= 1);
                      });

                      console.log('----------+++AddValue', stocked, qt);
                      if (qt >= stocked && stocked >= 0) {
                        try {
                          await props.handleAddToCart(
                            props.productList,
                            props.categoryTypeId,
                            props.item,
                            'add',
                            setCartCount,
                            cartCount,
                            cartPrice,
                            setCartData,
                            setCartPrice,
                            setLoading,
                          );
                        } catch (error) {
                          console.log('----------+++add', error);
                        }
                      } else {
                        console.log("Sorry, there's not enough stock available", error);

                      }

                      return;
                      try {
                        await props.handleAddToCart(
                          props.productList,
                          props.categoryTypeId,
                          props.item,
                          'add',
                          setCartCount,
                          cartCount,
                          cartPrice,
                          setCartData,
                          setCartPrice,
                          setLoading,
                        );
                      } catch (error) {
                        console.log('----------+++add', error);
                      }
                      //                      props.item.stockQuantity,

                      // This function will be executed after handleAddToCart completes
                      fetchPrice();
                    }}>
                    <SvgIcon
                      type={IconNames.Plus}
                      width={15}
                      height={15}
                      color={props.colors.activeColor}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
}

export const StoreBottomSheet = props => {
  const [modalVisible, setModalVisible] = useState(props.productList);
  const cartItemAdded = useSelector(state => state.cart.cartItems);
  const cartCount12 = useSelector(state => state.cart.cartCount);
  const [isLoaderParent, setLoaderParent] = useState(true);
  const [showError, setShowError] = useState();

  const { colors } = useTheme();
  const scheme = useColorScheme();
  const itemStyles = Styles(scheme, colors);
  const [cartDataa, setCartDataa] = useState([]); //useState(props.cartCount);
  //Internal States for store shop list
  const [shopList, setShopList] = useState([]);
  const [productCount, setProductCount] = useState([]);
  const uniqueId = DeviceInfo.getUniqueId();
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
  const [childData, setChildData] = useState('');

  const handleChildData = dataFromChild => {
    // Handle data received from the child component
    console.log('Data from child:', dataFromChild);

    // You can also update the state or perform other actions based on the data
    setChildData(dataFromChild);
  };
  const dispatch = useDispatch();
  let varRem;
  const handleAddToCart = async (
    product,
    categoryTypeId,
    store,
    behavior,
    setCartCount,
    cartCount,
    cartPrice,
    setCartData,
    setCartPrice,
    setLoading,
  ) => {
    // const productObj = {
    //   id: product.productId,
    //   title: product.title,
    //   price: product.price,
    //   weight: product.stockQuantity,
    //   discount: product.stockQuantity,
    // };
    const getUserId = await AsyncStorage.getItem('userId');

    if (behavior == 'add') {
      setCartCount(prevData => {
        return (prevData += 1);
      });

      setLoading(val => {
        return true;
      });
      // if (stock > 0) {
      //   // setStocked(stock => {
      //   //   return (val -= 1);
      //   // })

      //   console.log("stocked==================", varRem -= 1)
      // } else {
      //   console.log("stocked==================", "out of stocked")
      // }

      console.log('ButtonSteps==================1', cartCount);
      _handleProductCount(
        product,
        categoryTypeId,
        store,
        behavior,
        setCartCount,
        cartCount,
        cartPrice,
        setCartData,
        setCartPrice,
        uniqueId._z,
        getUserId,
        setLoading,
      );
    } else {
      console.log('ButtonSteps==================2', cartCount);

      cartCount > 0 &&
        setCartCount(prevData => {
          return (prevData -= 1);
        });
      _handleProductCount(
        product,
        categoryTypeId,
        store,
        behavior,
        setCartCount,
        cartCount,
        cartPrice,
        setCartData,
        setCartPrice,
        uniqueId._z,
        getUserId,
        setLoading,
      );
    }
  };

  const _handleProductCount = async (
    product,
    categoryTypeId,
    store,
    behavior,
    setCartCount,
    cartCount,
    cartPrice,
    setCartData,
    setCartPrice,
    deviceId,
    getUserId,
    setLoading,
  ) => {
    // const productCount = {
    //   productId: store.productId,
    //   partnerId: store.partnerId,
    //   count: 1,
    // };

    let prevCount = getCartQtyByPartner(
      cartDataa,
      store.partnerId,
      product.productId,
    );
    let userCartItemId = getUserCartItemId(
      cartDataa,
      store.partnerId,
      product.productId,
    );
    let userCartId = getUserCartId(
      cartDataa,
      store.partnerId,
      product.productId,
    );

    console.log(
      '========-------=-=-=-=-=---',
      cartCount,
      '===',
      product.stockQuantity,
    );
    if (behavior === 'add') {
      console.log('ButtonSteps==================3', cartCount);

      if (cartCount === 0) {
        let body = {
          userId: getUserId, //,30032,
          partnerId: store.partnerId,
          productId: product.productId,
          qty: 1,
          price:
            store.sellingPrice == 0 ? store.regularPrice : store.sellingPrice,
          deviceId: deviceId, //"6ed0ee10b72e038b",
          attributes: product.attributes.map(att => ({
            productId: att.productId,
            name: att.name,
            value: att.value,
          })),
        };

        try {
          const data = await ProductService.addCartCountByStore(body);
          console.log('ButtonSteps==================5', cartCount);

          if (data.data.isSuccess) {
            try {
              console.log(
                'ButtonSteps==================6',
                cartCount,
                categoryTypeId,
              );

              const data = await ProductService.getcartCountByStore(
                categoryTypeId, 1, getUserId
              );
              if (data?.data?.isSuccess) {
                console.log(
                  'ButtonSteps==================7',
                  cartCount,
                  data.data.payload,
                );
                if (cartCount == 0 && cartCount12 == 0) {
                  setCartCount(1);
                  setCartPrice(
                    store.sellingPrice == 0
                      ? store.regularPrice
                      : store.sellingPrice,
                  ); /////Add new
                  let count = 1;
                  dispatch(addToCart({ count }));
                }
                setCartData(data.data.payload); //child class
                setCartDataa(data.data.payload); //initial
                setLoading(val => {
                  return false;
                });
              }
            } catch (error) {
              console.log('ButtonSteps==================8', error);

              console.log('addStoreBottom', error);
            }
          }
        } catch (error) {
          console.log('ButtonSteps==================9', error);

          console.log('addStoreBottom==>', error);
        }
      } else {
        // callApi();
        //Updated Add To Cart
        const getUserCartId = userCartId;
        const getUserCartItemId = userCartItemId;

        const finalPrice =
          store.sellingPrice == 0 ? store.regularPrice : store.sellingPrice;


        let count = cartCount;
        count += 1;

        let body = {
          userId: getUserId,
          productId: product.productId,
          partnerId: store.partnerId,
          userCartItemId: getUserCartItemId,
          userCartId: getUserCartId,
          qty: count,
          price: cartPrice + finalPrice,
        };

        //update price
        setCartPrice(cartPrice + finalPrice);

        try {
          const data = await ProductService.alterCartCountByStore(body);
          if (data.data.isSuccess) {
            try {
              const data = await ProductService.getcartCountByStore(
                categoryTypeId, 1, getUserId
              );
              if (data?.data?.isSuccess) {
                setCartData(data.data.payload);
                setLoading(val => {
                  return false;
                });
              }
            } catch (error) {
              console.log('.alterCartCountByStoreErrror', error);
            }
          }
        } catch (error) {
          console.log('.alterCartCountByStoreerror==>', error);
        }
      }
    } else {
      const getUserCartId = userCartId;
      const getUserCartItemId = userCartItemId;
      let count = cartCount;

      if (count === 0) {
        console.log('user massege for substraction', count);
        setCartCount(0);
        return;
      } else {
        if (count > 0) {
          const finalPrice =
            store.sellingPrice == 0 ? store.regularPrice : store.sellingPrice;
          console.log(
            'hfhfhhf====+++------------------------------------------',
            cartPrice,
            finalPrice,
          );

          count -= 1;
          if (getUserCartId > 0 && getUserCartItemId > 0) {
            let body = {
              userId: getUserId,
              productId: product.productId,
              partnerId: store.partnerId,
              userCartItemId: getUserCartItemId,
              userCartId: getUserCartId,
              qty: count,
              price: cartPrice - finalPrice,
            };

            setCartPrice(cartPrice - finalPrice);
            try {
              const data = await ProductService.alterCartCountByStore(body);
              if (data.data.isSuccess) {
                try {
                  const data = await ProductService.getcartCountByStore(
                    categoryTypeId, 1, getUserId
                  );
                  if (data?.data?.isSuccess) {
                    setCartData(data.data.payload);
                    setLoading(val => {
                      return false;
                    });
                  }
                } catch (error) {
                  console.log('error', error);
                }
              }
            } catch (error) {
              console.log('error==>', error);
            }
          }
        } else {
          return console.log("user massege for substraction")
        }
      }
    }
  };

  useEffect(() => {
    getShopList(modalVisible.productId);
    setLoaderParent(true);
  }, [modalVisible.productId]);

  const getShopList = async productId => {
    try {
      let response = await AuthService.getStoreDetails(productId);

      if (response?.data?.isSuccess) {
        let newArray = response?.data?.payload;
        setShopList(newArray); // Move this line inside the 'if' block
        setLoaderParent(false);
        setShowError(false);
      } else {
        setLoaderParent(false);
        setShowError(true);
        //setErrorMessage
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible ? true : false}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        {/* {storeList.map((item, key) => {
          return <StoreList key={key} item={item} setModalVisible={setModalVisible} cartCount={cartCount} colors={colors} itemStyles={itemStyles} _cartCountChange={_cartCountChange} handleAddToCart={handleAddToCart} isEnabled={props.isEnabled} CloseStoreBottonSheet={props.CloseStoreBottonSheet} />

        })} */}

        <TouchableWithoutFeedback
          onPress={() => {
            //commented
            setModalVisible(!props.productList);
            props.CloseStoreBottonSheet();
          }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
        </TouchableWithoutFeedback>
        <View
          style={{
            flex: 1,
            // justifyContent: 'center',
            //alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            // paddingTop: heightPercentageToDP(70)
          }}>
          <View style={styles.centeredView}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: 'black',
              }}>
              {modalVisible.title}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width: widthPercentageToDP(100) }}>
              {/* api stor list */}
              {console.log('------------poo', shopList.length)}
              {isLoaderParent ? (
                <ActivityIndicator
                  color={props.colors.activeColor}
                  size="large"
                //style={{ flex: 1 }}
                />
              ) : showError ? (
                // Render error content here
                <View style={{ justifyContent: 'center', flex: 1, height: 160 }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: '600',
                      fontSize: 16,
                    }}>
                    Oops. The Store is temporarily unavailable
                  </Text>
                </View>
              ) : (
                // Render nothing when there is no error and loader is not active
                shopList.map((item, key) => {
                  return (
                    <StoreList
                      key={key}
                      item={item}
                      setModalVisible={setModalVisible}
                      colors={colors}
                      itemStyles={itemStyles}
                      handleAddToCart={handleAddToCart}
                      productList={props.productList}
                      CloseStoreBottonSheet={props.CloseStoreBottonSheet}
                      setCartDataa={setCartDataa}
                      productId={modalVisible.productId}
                      categoryTypeId={modalVisible.categoryTypeId}
                      onDataReceived={handleChildData}
                      navigation={props.navigation}
                    />
                  );
                })
              )}
            </ScrollView>
            <View style={itemStyles.addToCartButton}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setModalVisible(!props.productList);
                  props.CloseStoreBottonSheet();
                }}>
                <Text style={props.itemStyles.addCartText}>{'Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 12,
    //flex: 1
    // height: heightPercentageToDP(40),
  },
  addCartDisableText: {
    color: '#C6C6C6',
  },
  // addCartText: {
  //   color: '#4E9F3D',
  // },
  // buttonActiveContainer: {
  //   borderColor: '#4E9F3D',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   flexDirection: 'row',
  //   height: '65%',
  //   width: '40%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   alignContent: 'center',
  //   alignSelf: 'center',
  //   marginTop: 18,
  //   marginEnd: 10,
  // },
  buttonDeActiveContainer: {
    backgroundColor: '#eeeeee',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    height: '65%',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 18,
    marginEnd: 10,
  },
});
