import {View, Text, SafeAreaView} from 'react-native';
import React, {useRef, useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import BaseView from '../../BaseView';
import IconNames from '../../../../branding/carter/assets/IconNames';
import Routes from '../../../navigation/Routes';
import {t} from 'i18next';
import Globals from '../../../utils/Globals';

const PlacesAutoCompleteForReg = props => {
  const [road, setRoad] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [town, setTown] = useState('');
  const [ward, setWard] = useState('');

  const handlePlaceSelected = async (
    place_id,
    details,
    lat,
    lng,
    subAddress,
    addressTitle,
  ) => {
    try {
      console.log('place_id', place_id);
      // if (!(place_id === '')) {
      //   throw new Error('Invalid place details');
      // }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${Globals.googleApiKey}`,
      );

      // if (!response.ok) {
      //   throw new Error('Error fetching address details');
      // }

      console.log('places_api_response', response);
      const result = await response.json();

      if (
        result.status === 'OK' &&
        result.results &&
        result.results.length > 0
      ) {
        // Extract address components
        const {address_components} = result.results[0];
        let road = '';
        let district = '';
        let state = '';
        let postal_code = '';
        let town = '';
        let ward = '';

        // Extract road, district, and state from address components
        address_components.forEach(component => {
          if (component.types.includes('route')) {
            road = component.long_name;
          } else if (
            component.types.includes('administrative_area_level_3') ||
            component.types.includes('sublocality')
          ) {
            district = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (component.types.includes('postal_code')) {
            postal_code = component.long_name;
          } else if (
            component.types.includes('locality') ||
            component.types.includes('sublocality')
          ) {
            town = component.long_name;
          } else if (
            component.types.includes('sublocality_level_2') ||
            component.types.includes('sublocality_level_1')
          ) {
            ward = component.long_name;
          }
        });

        // Use the extracted information as needed
        console.log('Road:', road);
        console.log('District:', district);
        console.log('State:', state);
        console.log('postalcode:', postal_code);
        console.log('town:', town);
        console.log('ward:', ward);

        setRoad(road);
        setDistrict(district);
        setState(state);
        setPostal_code(postal_code);
        setTown(town);
        setWard(ward);

        props.navigation.navigate(Routes.ADD_ADDRESS_FROM_MAP_FOR_REG, {
          latitude: lat,
          longitude: lng,
          addressDescription: subAddress,
          addressTitle: addressTitle,
          road: road,
          postalCode: postal_code,
          district: district,
          state: state,
          town: town,
          ward: ward,
        });
      } else {
        throw new Error('Invalid response from Geocoding API');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <BaseView
        navigation={props.navigation}
        title={t('Search Location')}
        //headerWithBack --comment
        applyBottomSafeArea
        childView={() => {
          return (
            <View style={{marginTop: 10, flex: 1}}>
              <GooglePlacesAutocomplete
                placeholder={t('Search your location')}
                styles={{
                  description: {
                    color: 'black',
                  },
                  textInputContainer: {
                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    borderRadius: 6,
                  },
                  listView: {
                    // Use custom styles for the list view here
                    borderColor: '#d4d4d4',
                    borderWidth: 1,
                    borderRadius: 6,
                  },

                  row: {
                    backgroundColor: 'transparent', // Background color for each item
                    padding: 10, // Padding for each item
                    borderBottomColor: '#d4d4d4', // Border color between items
                    borderBottomWidth: 1, // Border width between items
                  },
                  // container: {
                  //   borderWidth: 1,
                  //   borderColor: 'red',
                  // },
                }}
                numberOfLines={2}
                GooglePlacesDetailsQuery={{fields: 'geometry'}}
                fetchDetails={true} // you need this to fetch the details object onPress
                // onPress={(data, details = null) => {
                //   console.log("address_details",data,details);
                // }}

                // onPress={(data, details = null) => {
                //   console.log("address_details",data,details);
                //   if(isFromServiceLocation){
                //     console.log("isFromServiceLocation---", details.geometry.location.lat,details.geometry.location.lng);

                //     props.navigation.navigate(Routes.SERVICE_LOCATION,{
                //       latitude:details.geometry.location.lat,
                //       longitude:details.geometry.location.lng
                //     });
                //   }else{
                //     console.log("details---", details.geometry.location);
                //     console.log("details---", data);
                //     props.navigation.navigate(Routes.ADD_ADDRESS_FROM_MAP,{
                //     latitude:details.geometry.location.lat,
                //     longitude:details.geometry.location.lng,
                //     addressDescription: data.description,
                //     addressTitle: data.structured_formatting.main_text,
                //     isNew:isNew,
                //     addressId:addressId,
                //     landmark: landmark,
                //     postalCode:postalCode,
                //     district:district,
                //     subdistrict:subdistrict,
                //     isDefault:isDefault
                //   });
                //   }

                // }}

                onPress={(data, details = null) => {
                  console.log('address_details', data, '---------------');
                  //     latitude:details.geometry.location.lat,
                  //     longitude:details.geometry.location.lng,
                  //     addressDescription: data.description,
                  //     addressTitle: data.structured_formatting.main_text,
                  handlePlaceSelected(
                    data.place_id,
                    details,
                    details.geometry.location.lat,
                    details.geometry.location.lng,
                    data.description,
                    data.structured_formatting.main_text,
                  );
                }}
                query={{
                  key: Globals.googleApiKey,
                  language: 'en',
                }}
                currentLocation={true}
                currentLocationLabel="Current location"
                onFail={error => console.error(error)}

                // renderDescription={(description) => {
                //   const addressLines = description.split(',').map((line, index) => (
                //     <Text key={index} style={{ lineHeight: 20 }}>
                //       {line.trim()}
                //     </Text>
                //   ));

                //   return <View>{addressLines}</View>;
                // }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};
export default PlacesAutoCompleteForReg;
