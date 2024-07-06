import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  useColorScheme,
  Rating,
  AirbnbRating,
  ToastAndroid,
  Image,
} from 'react-native';
import BaseView from '../BaseView';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { Style } from './Style';
import { useTheme } from '@react-navigation/native';
import AppConfig from '../../../branding/App_config';
import { SvgIcon } from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import { commonDarkStyles } from '../../../branding/carter/styles/dark/Style';
import { commonLightStyles } from '../../../branding/carter/styles/light/Style';
import AppInput from '../../components/Application/AppInput/View';
import AppButton from '../../components/Application/AppButton/View';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-ionicons';
import { CommomService } from '../../apis/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { number } from 'prop-types';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Utilities from '../../utils/UtilityMethods';

function onProductStarRatingPress(productId, rating) {
  console.log('Alasdsadsadsaed:', productId, rating);

  const isProductRatingExists = productRatingsArray.some(
    item => item.productId === productId,
  );

  if (isProductRatingExists) {
    console.log('Already included:', productRatingsArray);

    // If item is already selected, find its index and remove it using filter
    // const updatedArray = productRatingsArray.filter(
    //   (item) => !(item.productId === productId && item.rating === rating)
    // );

    setProductRatingsArray(prevArray =>
      prevArray.map(item =>
        item.productId === productId ? { ...item, rating: rating } : item,
      ),
    );

    //console.log('Updated productRatingsArray:', updatedArray);

    //setProductRatingsArray(updatedArray);
  } else {
    // If item is not selected, add it to the productRatingsArray
    setProductRatingsArray(prevArray => [...prevArray, { productId, rating }]);
  }
}

function RatingItems(props) {
  const [rateItem, setRateItem] = useState(0);

  return (
    <View style={{ marginTop: 10 }}>
      <Text>{props.item.productName}</Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <View style={{ marginEnd: 15 }}>
          <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            maxStars={5}
            starSize={24}
            starStyle={{ padding: 4 }}
            rating={rateItem}
            selectedStar={rating => {
              setRateItem(rating);
              //props.setProductRatingsArray(props.item.productId, rating)

              const isProductRatingExists = props.productRatingsArray.some(
                item => item.productId === props.item.productId,
              );

              if (isProductRatingExists) {
                console.log('Already included:', props.productRatingsArray);

                // If item is already selected, find its index and remove it using filter
                // const updatedArray = productRatingsArray.filter(
                //   (item) => !(item.productId === productId && item.rating === rating)
                // );

                props.setProductRatingsArray(prevArray =>
                  prevArray.map(item =>
                    item.productId === props.item.productId
                      ? { ...item, rating: rating }
                      : item,
                  ),
                );

                //console.log('Updated productRatingsArray:', updatedArray);

                //setProductRatingsArray(updatedArray);
              } else {
                // If item is not selected, add it to the productRatingsArray
                //console.log("props.productId",props.productId);
                //issue
                const productId = props.item.productId;

                props.setProductRatingsArray(prevArray => [
                  ...prevArray,
                  { productId, rating },
                ]);
              }
            }}
            fullStarColor={'gold'}
          />
        </View>
      </View>
    </View>
  );
}

export const RatingScreen = props => {
  let inputRef = useRef();
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const [orderDetails, setOrderDetails] = useState(props.route.params.newtext);
  const screenStyles = Style(globalStyles, scheme, colors);
  const [comment, setComment] = useState('');

  const [ratingQuestionOptions, setRatingQuestionOptions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState([]);
  const [ratingQuestion, setRatingQuestion] = useState('What impressed you?');

  const [productRating, setProductRating] = useState(0); // Initial rating state
  const [storeRating, setStoreRating] = useState(0); // Initial rating state

  //const [productRatingsArray, setProductRatingsArray] =  useState<{productId: number, ratingStarId: number}>({ productId: 0,ratingStarId: 0});

  const [productRatingsArray, setProductRatingsArray] = useState([
    { productId: 0, ratingTypeId: 0 },
  ]);

  const [selectedImage, setSelectedImage] = useState('');
  const [imgBase64, setImageBase64] = useState('');

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        console.log('Image picker uri: ', response);
        let imageUri = response.uri || response.assets?.[0]?.uri;
        let base64 = response.uri || response.assets?.[0]?.base64;
        console.log('Image picker uri: ', imageUri);
        setSelectedImage(imageUri);
        setImageBase64(base64);
      }
    });
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
      noData: true,
    };

    launchCamera(options, response => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        // Process the captured image
        let imageUri = response.uri || response.assets?.[0]?.uri;
        let base64 = response.uri || response.assets?.[0]?.base64;
        setSelectedImage(response.assets[0]);
        setImageBase64(base64);
        console.log('imageUri--------------', imageUri);
        console.log('base64--------------', base64);
      }
    });
  };

  // const onSingleProductRating = (productId,rating) => {

  //     const isProductRatingExists = itemRating.some(
  //       (item) =>
  //         item.productId === productId
  //     );

  //     if (isProductRatingExists) {
  //       console.log('Already included:', itemRating);

  //       setItemRating((prevArray) =>
  //             prevArray.map((item) =>
  //               item.productId === productId
  //                 ? { ...item, rating: rating }
  //                 : item
  //             )
  //           );

  //     } else {

  //       setItemRating((prevArray) => [
  //         ...prevArray,
  //         { productId, rating },
  //       ]);
  //     }

  // };

  // const onProductStarRatingPress = (productId,rating) => {

  //   // setProductRatingsArray({productId,rating})

  //     setProductRating(rating);

  //     const isProductRatingExists = productRatingsArray.some(
  //       (item) =>
  //         item.productId === productId
  //     );

  //     if (isProductRatingExists) {
  //       console.log('Already included:', productRatingsArray);

  //       // If item is already selected, find its index and remove it using filter
  //       // const updatedArray = productRatingsArray.filter(
  //       //   (item) => !(item.productId === productId && item.rating === rating)
  //       // );

  //       setProductRatingsArray((prevArray) =>
  //             prevArray.map((item) =>
  //               item.productId === productId
  //                 ? { ...item, rating: rating }
  //                 : item
  //             )
  //           );

  //       //console.log('Updated productRatingsArray:', updatedArray);

  //       //setProductRatingsArray(updatedArray);
  //     } else {
  //       // If item is not selected, add it to the productRatingsArray
  //       setProductRatingsArray((prevArray) => [
  //         ...prevArray,
  //         { productId, rating },
  //       ]);
  //     }

  // };

  const onStoreStarRatingPress = async rating => {
    if (rating < 3) {
      setRatingQuestion('What should we improve?');
    } else {
      setRatingQuestion('What impressed you?');
    }

    getRatingQuestion(rating);
  };

  const getRatingQuestion = async rating => {
    try {
      console.log('onStoreStarRatingPress', rating);
      let response = await CommomService.getRatingQuestion();
      if (response.data.isSuccess) {
        setStoreRating(rating);
        console.log(
          'onStoreStarRatingResponse',
          response.data.payload['rating' + rating],
        );
        setRatingQuestionOptions(response.data.payload['rating' + rating]);
      } else {
        console.log('dattaaaaaa', response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log('orderdetailssss', orderDetails);
    console.log('orderdetailssss', orderDetails);
    getRatingQuestion(storeRating);
  }, [storeRating]);

  const [selectedItems, setSelectedItems] = useState([]);

  const renderItem = ({ item }) => (
    <View style={{ flex: 1, marginTop: 10, marginHorizontal: 5 }}>
      <TouchableOpacity
        style={{
          borderColor: '#A2A2A2',
          borderWidth: 0.5,
          borderRadius: 25,
          backgroundColor: selectedItems.includes(item.ratingTypeId)
            ? 'green'
            : 'transparent',
        }}
        onPress={() => {
          if (selectedChoice.includes(item.ratingTypeId)) {
            console.log('already include', item.ratingTypeId);

            // If item is already selected, find its index and remove it using slice
            const indexOfItemToRemove = selectedChoice.indexOf(
              item.ratingTypeId,
            );
            const updatedArray = selectedChoice
              .slice(0, indexOfItemToRemove)
              .concat(selectedChoice.slice(indexOfItemToRemove + 1));
            console.log('console.log(updatedArray)', updatedArray);

            setSelectedChoice(updatedArray);
          } else {
            // If item is not selected, add it to the selectedItems
            setSelectedChoice([...selectedChoice, item.ratingTypeId]);
          }
          handleItemPress(item.ratingTypeId);
        }}>
        <Text
          style={{
            color: selectedItems.includes(item.ratingTypeId)
              ? 'white'
              : 'black',
            textAlign: 'center',
            padding: 10,
            fontSize: 12,
          }}>
          {item.ratingTypeName}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const handleItemPress = itemId => {
    if (selectedItems.includes(itemId)) {
      // If item is already selected, remove it from the selectedItems
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      // If item is not selected, add it to the selectedItems
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const submitRating = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      console.log('userId', userId);
      console.log('orderId', orderDetails[0].orderId);
      console.log('partnerId', orderDetails[0].partnerId);
      console.log('storeRating', storeRating);
      console.log('selectedChoice', selectedChoice);
      console.log('productRatingsArray', productRatingsArray);
      console.log('comment', comment);
      console.log('photo', imgBase64);

      const requestData = {
        userId: userId,
        orderId: orderDetails[0].orderId,
        partnerId: orderDetails[0].partnerId,
        ratingStarId: storeRating,
        ratingTypeId: selectedChoice,
        ratingItemList: productRatingsArray,
        comments: comment,
        photo: 'imgBase64',
        ratingDateTime: '2023-12-18T08:41:28.101Z',
      };

      let response = await CommomService.submitRating(requestData);

      if (response.data.isSuccess) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        console.log('onSubmitRatingResponse', response.data.message);
        props.navigation.pop();
      } else {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BaseView
      title={orderDetails[0].partnerName}
      navigation={props.navigation}
      showAppHeader={true}
      headerWithBack={!props.hideBack}
      applyBottomSafeArea
      childView={() => {
        return (
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginTop: 10, flex: 1 }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 8,
                    borderRadius: 14,
                  }}>
                  <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={screenStyles.questionStyles}>
                          What will you rate {orderDetails[0].partnerName}{' '}
                          store?
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            paddingVertical: 8,
                            justifyContent: 'space-between',
                            marginTop: 0,
                          }}>
                          <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <StarRating
                              disabled={false}
                              emptyStar={'ios-star-outline'}
                              fullStar={'ios-star'}
                              halfStar={'ios-star-half'}
                              iconSet={'Ionicons'}
                              maxStars={5}
                              starSize={24}
                              starStyle={{ padding: 4 }}
                              rating={storeRating}
                              selectedStar={rating =>
                                onStoreStarRatingPress(rating)
                              }
                              fullStarColor={'gold'}
                            />
                          </View>

                          {/* <View style={{marginEnd:10}}>
                                            <SvgIcon
                                            type={IconNames.HeartFilled}
                                            width={25}
                                            height={25}
                                            color="red"
                                            />
                                            </View> */}
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        borderTopColor: '#c9c9c9',
                        borderTopWidth: 0.5,
                        marginVertical: 20,
                      }}
                    />

                    <View style={{ marginTop: 0 }}>
                      <Text style={screenStyles.questionStyles}>
                        {ratingQuestion}
                      </Text>

                      <View style={{ marginTop: 10 }}>
                        {/* <View style={{flexDirection:'row'}}>
                        <View style={{flex:1,marginTop:10,marginHorizontal:5}}>
                                    <TouchableOpacity style={{
                                        borderColor:'#A2A2A2',
                                        borderWidth:0.5,
                                        borderRadius:25,
                                        backgroundColor: selectedFirstOption ? 'green' : 'white'
                                    }}
                                    onPress={()=>{setSelectedFirstOption(!selectedFirstOption);}}>
                                    <Text style={{color:'black',textAlign:'center',padding:10,fontSize:12}}>{ratingQuestionOptions[0].ratingTypeName}</Text>
                                    </TouchableOpacity>
                        </View>
                        <View style={{flex:1,marginTop:10,marginHorizontal:5}}>
                                    <TouchableOpacity style={{
                                        borderColor:'#A2A2A2',
                                        borderWidth:0.5,
                                        borderRadius:25,
                                        backgroundColor: selectedSecondOption ? 'green' : 'white'
                                    }}
                                    onPress={()=>{setSelectedSecondOption(!selectedSecondOption);}}>
                                    <Text style={{color:'black',textAlign:'center',padding:10,fontSize:12}}>{ratingQuestionOptions[1].ratingTypeName}</Text>
                                    </TouchableOpacity>
                        </View>
                        </View>

                        <View style={{flexDirection:'row'}}>
                        <View style={{flex:1,marginTop:10,marginHorizontal:5}}>
                                    <TouchableOpacity style={{
                                        borderColor:'#A2A2A2',
                                        borderWidth:0.5,
                                        borderRadius:25,
                                        backgroundColor: selectedThirdOption ? 'green' : 'white'
                                    }}
                                    onPress={()=>{setSelectedThirdOption(!selectedThirdOption);}}>
                                    <Text style={{color:'black',textAlign:'center',padding:10,fontSize:12}}>{ratingQuestionOptions[2].ratingTypeName}</Text>
                                    </TouchableOpacity>
                        </View>
                        <View style={{flex:1,marginTop:10,marginHorizontal:5}}>
                                    <TouchableOpacity style={{
                                        borderColor:'#A2A2A2',
                                        borderWidth:0.5,
                                        borderRadius:25,
                                        backgroundColor: selectedFourthOption ? 'green' : 'white'
                                    }}
                                    onPress={()=>{setSelectedFourthOption(!selectedFourthOption);}}>
                                    <Text style={{color:'black',textAlign:'center',padding:10,fontSize:12}}>{ratingQuestionOptions[3].ratingTypeName}</Text>
                                    </TouchableOpacity>
                        </View>
                        </View> */}

                        <FlatList
                          data={ratingQuestionOptions}
                          keyExtractor={item => item.ratingTypeId}
                          numColumns={2}
                          renderItem={renderItem}
                        />

                        {/* <FlatList
                            showsVerticalScrollIndicator={false}
                            data={ratingQuestionOptions}
                            style={{ marginTop: 0, marginBottom: 16 }}
                            keyExtractor={(item, index) => {
                             item.ratingTypeId;
                             console.log("asdsadsa",item.ratingTypeId);
                            }}
                            numColumns={2}
                            renderItem={({ item, index1 }) => {
                                
                                // if(item.ratingStarId === 4){
                                    return(
                                        
                                <View style={{flex:1,marginTop:10,marginHorizontal:5}}>
                                    <TouchableOpacity style={{
                                        borderColor:'#A2A2A2',
                                        borderWidth:0.5,
                                        borderRadius:25,
                                        backgroundColor: selectedOption ? 'green' : 'white'
                                    }}
                                    onPress={()=>{setSelectedOption(!selectedOption);}}>
                                    <Text style={{color:'black',textAlign:'center',padding:10,fontSize:12}}>{item.ratingTypeName}</Text>
                                    </TouchableOpacity>
                                </View>
                                       
                                        
                                        
                                    );
                                //}
                        
                            }}
                        /> */}
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 8,
                    borderRadius: 14,
                    marginTop: 10,
                  }}>
                  <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={screenStyles.questionStyles}>
                          Rate items
                        </Text>

                        <View style={{ paddingVertical: 8, marginTop: 0 }}>
                          {orderDetails?.map((item, key) => {
                            return (
                              <RatingItems
                                key={key}
                                item={item}
                                setProductRatingsArray={setProductRatingsArray}
                                productRatingsArray={productRatingsArray}
                              />
                            );
                          })}
                        </View>
                      </View>
                    </View>

                    {/* <View style={{borderTopColor:'black',borderTopWidth:0.5,marginVertical:10}}/> */}
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 8,
                    borderRadius: 14,
                    marginTop: 10,
                  }}>
                  <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={screenStyles.questionStyles}>
                          Add detailed review
                        </Text>

                        <View style={{ paddingVertical: 8, marginTop: 0 }}>
                          <View style={{ marginTop: 0 }}>
                            <AppInput
                              {...globalStyles.checkoutInputStyle}
                              textInputRef={r => (inputRef = r)}
                              showLeftIcon={false}
                              placeholder={'Share your thoughts'}
                              value={comment}
                              keyboardType={'default'}
                              onChangeText={comment => {
                                setComment(comment);
                              }}
                            />
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              handleCameraLaunch();
                              // Utilities.selectImage(response => {
                              //   setSelectedImage(response);
                              //   setImageBase64(response.uri);
                              // });
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View style={{ marginEnd: 10 }}>
                                <SvgIcon
                                  type={IconNames.Camera}
                                  width={18}
                                  height={18}
                                  color="green"
                                />
                              </View>

                              <Text style={screenStyles.addPhotoText}>
                                Add photo
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              marginTop: 10,
                            }}>
                            <Image
                              source={{ uri: selectedImage && selectedImage.uri }}
                              style={{ flex: 1, height: 40, width: 40 }}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* <View style={{borderTopColor:'black',borderTopWidth:0.5,marginVertical:10}}/> */}
                  </View>
                </View>
                <View style={{ marginBottom: 40, paddingBottom: 10 }}>
                  <AppButton
                    title={'Submit'}
                    onPress={() => {
                      //console.log("productRatingsArray-------",productRatingsArray)
                      submitRating();
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        );
      }}
    />
  );
};
