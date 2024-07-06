import React, { useRef, useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { CategoryItem } from '../../components/Application/CategoryItem/View';
import BaseView from '../BaseView';
import Globals from '../../utils/Globals';
import style from './Style';
import axios from 'axios';
import { CommomService } from '../../apis/services';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

export const CategoryList = props => {
  const { t, i18n } = useTranslation();

  const { categoryTypeId } = props.route.params;
  const [categorieList, setCategorieList] = useState();
  const [isLoader, setLoader] = useState(true);

  useEffect(() => {
    CategoriesList();
  }, []);

  const CategoriesList = async () => {
    try {
      const responseCategori = await CommomService.getCategoriesList(
        categoryTypeId,
      );

      if (responseCategori?.data.isSuccess) {
        responseCategori.data.payload !== null &&
          setCategorieList(responseCategori.data.payload);

        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log('errorgetCategoriesList==>', error);
    }
  };
  return (
    <BaseView
      navigation={props.navigation}
      title={t('Categories')}
      headerWithBack
      applyBottomSafeArea
      childView={() => {
        return (
          <View style={style.mainContainer}>
            {isLoader ? (
              <ActivityIndicator
                color="#4E9F3D"
                size="large"
              //style={{ flex: 1 }}
              />
            ) : (
              <FlatList
                //data={Globals.categoryItems}
                data={categorieList}
                numColumns={3}
                keyExtractor={(item, index) => {
                  return item.id;
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <CategoryItem
                    navigation={props.navigation}
                    secondaryTitle={item.secondaryTitle}
                    secondaryColor={item.secondaryColor}
                    primaryTitle={item.name}
                    primaryColor={item.primaryColor}
                    iconBgColor={item.iconBgColor}
                    iconURI={item.iconURI}
                    bgURI={item.bgURI}
                    imgURL={item.imageUrl}
                    categoryTypeId={categoryTypeId}
                    categoryId={item.id}
                  />
                )}
              />
            )}
          </View>
        );
      }}
    />
  );
};
