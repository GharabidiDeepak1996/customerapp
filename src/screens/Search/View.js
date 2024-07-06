import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {Styles} from './Styles';
import Globals from '../../utils/Globals';
import {TextInput} from '../../components/Global/TextInput/View';
import Routes from '../../navigation/Routes';
import {useTheme} from '@react-navigation/native';
import {commonDarkStyles} from '../../../branding/carter/styles/dark/Style';
import {commonLightStyles} from '../../../branding/carter/styles/light/Style';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {SvgIcon} from '../../components/Application/SvgIcon/View';
import IconNames from '../../../branding/carter/assets/IconNames';
import {FocusAwareStatusBar} from '../../components/Application/FocusAwareStatusBar/FocusAwareStatusBar';
import {CommomService} from '../../apis/services';
import uuid from 'react-native-uuid';

export const Search = props => {
  //Theme based styling and colors
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const globalStyles =
    scheme === 'dark' ? commonDarkStyles(colors) : commonLightStyles(colors);
  const screenStyles = Styles(scheme, globalStyles, colors);

  //Local states
  const [filters, setFilters] = useState([
    {
      productlist: [],
      restaurantlist: [],
      shoplist: [],
      categoryList: [],
    },
  ]);
  const [searchText, setSearchText] = useState('');
  // const productlist = filters[0]?.productlist || [];
  // const restaurantlist = filters[0]?.restaurantlist || [];
  // const shoplist = filters[0]?.shoplist || [];
  // const categoryList = filters[0]?.categoryList || [];
  //   const combinedList = [
  //     ...filters[0]?.productlist,
  //     filters[0]?.restaurantlist,
  //     filters[0]?.shoplist,
  //     filters[0]?.categoryList,
  //   ];
  const productlist = (filters[0]?.productlist || []).map(item => ({
    ...item,
    listType: 'productList',
  }));
  const restaurantlist = (filters[0]?.restaurantlist || []).map(item => ({
    ...item,
    listType: 'restaurantlist',
  }));
  const shoplist = (filters[0]?.shoplist || []).map(item => ({
    ...item,
    listType: 'shoplist',
  }));
  const categoryList = (filters[0]?.categoryList || []).map(item => ({
    ...item,
    listType: 'categoryList',
  }));
  console.log('products list=====>', [
    ...productlist,
    ...restaurantlist,
    ...shoplist,
    ...categoryList,
  ]);
  //References
  let inputRef = useRef();

  const getItemFilered = async item => {
    let categoryTypeId = props.route.params?.categoryTypeId || 0;

    console.log('===============================45353=', categoryTypeId);

    try {
      let response = await CommomService.golbalFilter(item, categoryTypeId);
      if (response?.data?.isSuccess) {
        if (
          response.data.payload[0]?.productlist?.length > 0 ||
          response.data.payload[0]?.restaurantlist?.length > 0 ||
          response.data.payload[0]?.shoplist?.length > 0 ||
          response.data.payload[0]?.categoryList?.length > 0
        ) {
          setFilters(response.data.payload);
          console.log(
            '==========Global Filter========',
            filters[0]?.productlist.length,
          );
        } else {
          setFilters(response.data.payload);
          console.log(
            '==========Global Filter========',
            'No item found',
            filters[0]?.productlist.length,
          );
        }
      } else {
        setFilters([
          {
            productlist: [],
            restaurantlist: [],
            shoplist: [],
            categoryList: [],
          },
        ]);
        console.log(
          '==========Global Filter========',
          'No item found12',
          filters[0]?.productlist.length,
        );
      }
    } catch (error) {
      console.log('error in filter search', error);
    }
  };

  const renderFlatList = () => {
    //const renderFilterItems = () => {
    return (
      <View>
        {searchText != '' ? (
          <FlatList
            data={[
              ...productlist,
              ...restaurantlist,
              ...shoplist,
              ...categoryList,
            ]}
            keyExtractor={(item, index) => {
              return uuid.v4();
            }}
            renderItem={renderFilterItems}
          />
        ) : (
          <Text
            style={{
              marginTop: 60,
            }}>
            {'Search for products...'}
          </Text>
        )}
      </View>

      //   <FlatList
      //     data={combinedList}
      //     keyExtractor={(item, index) => {
      //       return uuid.v4();
      //     }}
      //     renderItem={renderFilterItems}
      //   />
    );
  };

  const renderFilterItems = ({item}) => {
    // Render product item
    console.log('renderFilterItems ... =>', item);
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('renderFilterItems122111221=>', item.productTypeId);
          props.navigation.navigate(Routes.STORE, {
            restaurantId: item.partnerId,
            partnerName: item.partnerName,
            openingHrs: item.openingHrs,
            closingHrs: item.closingHrs,
            categoryTypeId: item.productTypeId,
            navigation: props.navigation,
            directSearch: item.productName,
          });
        }}
        style={{width: widthPercentageToDP(100)}}>
        <View
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            flexDirection: 'row',
            width: widthPercentageToDP(100),
          }}>
          <Image
            source={{uri: `${Globals.imgBaseURL}/${item.productImageUrl}`}}
            style={{width: 60, height: 60}}
          />
          <View style={{paddingLeft: 12, paddingRight: 36}}>
            {/* <Text style={screenStyles.titleText}>{item.productName}</Text> */}
            <BoldText text={item.productName} />
            <Text style={screenStyles.price}>
              Rp. {item.sellingPrice} • {item.categoryName}
            </Text>
            <BoldTextName text={item.partnerName} listType={item?.listType} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const BoldText = ({text}) => {
    // Split the text into parts based on the search term
    const parts = text?.split(new RegExp(`(${searchText.value})`, 'gi'));
    console.log('searchText====>', searchText.value);
    console.log('partsText====>', parts);
    return (
      <Text
        style={[
          screenStyles.price,
          {fontSize: 16, color: '#262323', marginVertical: 0},
        ]}>
        {parts?.map((part, index) =>
          // Apply bold style to the matching part
          part.toLowerCase() === searchText?.value.toLowerCase() ? (
            <Text
              key={index}
              style={{fontWeight: 'bold', color: '#000', fontSize: 17}}>
              {part}
            </Text>
          ) : (
            // Display non-matching parts without bold style
            <Text key={index}>{part}</Text>
          ),
        )}
      </Text>
    );
  };
  const BoldTextName = ({text, listType}) => {
    // Split the text into parts based on the search term
    const parts = text?.split(new RegExp(`(${searchText.value})`, 'gi'));
    console.log('searchText====>', searchText.value);
    console.log('partsText====>', parts);
    return (
      <Text style={screenStyles.price}>
        {listType == 'productList'
          ? 'Store'
          : listType == 'restaurantlist'
          ? 'Restaurant'
          : listType == 'shoplist'
          ? 'Shop'
          : 'Shop'}{' '}
        :{' '}
        {parts?.map((part, index) =>
          // Apply bold style to the matching part
          part.toLowerCase() === searchText.value.toLowerCase() ? (
            <Text
              key={index}
              style={{fontWeight: 'bold', color: '#000', fontSize: 12}}>
              {part}
            </Text>
          ) : (
            // Display non-matching parts without bold style
            <Text key={index}>{part}</Text>
          ),
        )}
      </Text>
    );
  };

  return (
    <View style={[screenStyles.container]}>
      <View style={[screenStyles.mainContainer]}>
        <View style={[screenStyles.searchContainer]}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.goBack();
            }}>
            <View style={screenStyles.searchLeftIconContainer}>
              <SvgIcon
                type={IconNames.ArrowLeft}
                width={25}
                height={25}
                color={colors.white}
              />
            </View>
          </TouchableWithoutFeedback>

          <TextInput
            textInputRef={r => (inputRef = r)}
            placeholder={'Search'}
            placeholderTextColor={colors.headingColor}
            // rightIconSource={
            //     IconNames.SlidersH
            // }
            // rightIconPress={() => {
            //     props.navigation.navigate(Routes.APPLY_FILTERS)
            // }}
            rightIconTintColor={colors.inputColor}
            leftIcon={
              <SvgIcon
                width={20}
                height={20}
                type={IconNames.Search}
                color={colors.inputColor}
              />
            }
            containerStyle={screenStyles.searchInputContainer}
            leftIconContainerStyle={screenStyles.searchInputLeftIconContainer}
            onChangeText={value => {
              getItemFilered(value);
              if (value == '') {
                setSearchText('');
              } else {
                setSearchText(prevData => ({...prevData, value}));
              }
            }}
          />
        </View>

        {/* <View style={screenStyles.contentContainerStyle}>
                    {
                        renderCategoryTitle("Search History", "Clear")
                    }

                    {renderHistoryItems()}

                    {
                        renderCategoryTitle("Discover More", "Refresh")
                    }

                    {renderHistoryItems()}

                </View> */}
        <View style={screenStyles.contentContainerStyle}>
          {filters[0]?.productlist?.length > 0 ||
          filters[0]?.categoryList?.length > 0 ||
          filters[0]?.restaurantlist?.length > 0 ||
          filters[0]?.shoplist?.length > 0 ? (
            renderFlatList()
          ) : (
            <View>
              {searchText == '' ? (
                <Text
                  style={{
                    marginTop: 60,
                  }}>
                  {'Search for products...'}
                </Text>
              ) : (
                <Text
                  style={{
                    marginTop: 60,
                  }}>
                  {`Sorry, we couldn't find the product you're looking for.`}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* <View style={screenStyles.bottomButtonsContainer}>

                <TouchableOpacity style={screenStyles.imageSearchButton} onPress={() => {

                }}>

                    <View style={screenStyles.buttonContainer}>

                        <SvgIcon type={IconNames.Camera} width={18} height={18} color={colors.inputColor}
                            style={screenStyles.buttonIcon} />

                        <Text style={screenStyles.buttonText}>{"Image Search"}</Text>


                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={screenStyles.voiceSearchButton} onPress={() => {
                }}>

                    <View style={screenStyles.buttonContainer}>

                        <SvgIcon type={IconNames.Microphone} width={18} height={18} color={colors.inputColor}
                            style={screenStyles.buttonIcon} />

                        <Text style={screenStyles.buttonText}>{"Voice Search"}</Text>

                    </View>
                </TouchableOpacity>

            </View> */}
    </View>
  );
};
