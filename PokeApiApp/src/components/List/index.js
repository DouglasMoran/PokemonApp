import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {
  getPokemonLocationsArea,
  getPokemonLocations,
} from '@services/pokemonsService';
import Card from '@components/Card';
import Colors from '@common/Colors';
import {getId} from '@utils/truncsStrings';
import {TouchableRipple} from 'react-native-paper';
import Style from '../../pages/Home/styles/index';
import axios from 'axios';

const Locations = ({route, navigation}) => {
  const [pokemonLocations, setPokemonLocations] = useState([]);
  const [urlsLocations, setUrlsLocations] = useState([]);
  const [locationsAreas, setLocationsAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState([]);
  const [regionsMatchsRegionsLocations, setRegionsMatchsRegionsLocations] = useState([]);

  useEffect(() => {
    getLocationsAreas();
    getLocations();
  }, []);

  const getLocationsAreas = async () => {
    try {
      let pokemonLocationsResult = await getPokemonLocationsArea();
      getAreasRegion(pokemonLocationsResult.locationsUrls);
    } catch (error) {
      console.log('ERROR ::: getLocations() : ', error);
    }
  };

  const getAreasRegion = async urls => {
    try {
      let responseLocationsAreas = await getAreasOfLocationsAreas(urls);
      let listLocationsTmp = responseLocationsAreas.dataResponse;

      let locations = listLocationsTmp.map(location => location.data.location);
      setLocationsAreas(locations);
    } catch (error) {
      console.log('ERROR ::: getAreasRegion() : ', error);
    }
  };

  const getAreasOfLocationsAreas = async urls => {
    return new Promise((resolve, reject) => {
      try {
        var listLocationsAreasTmp = [];
        urls.map(async (location, index) => {
          let response = await axios.get(location);
          listLocationsAreasTmp.push(response);
          if (urls.length - 1 === index) {
            resolve({dataResponse: listLocationsAreasTmp});
          }
        });
      } catch (error) {
        console.log('ERROR ::: getAreasLocations() : ', error);
        reject(error);
      }
    });
  };

  const getRegionsLocations = async urls => {
    let dataRegionsLocationsResponse = await getRegionsOfLocations(urls);

    // console.log(
    //   'DATA OF LOCATION GET REGION DATA ::: ',
    //   dataRegionsLocationsResponse.dataResponse,
    // );
    let listLocations = dataRegionsLocationsResponse.dataResponse;
    let locations = listLocations.map(locationData => {
      return {id: locationData.data.id, name: locationData.data.name};
    });
    setLocations(locations);
    console.log('LOCATIONS ::: ', locations);
    console.log('LOCATIONS-AREAS ::: ', locationsAreas);

    let regionsInLocations = listLocations.map(locationData => {
      return {
        id: locationData.data.region.name,
        name: locationData.data.region.url,
      };
    });
    console.log('THESE ARE REGIONS IN LOCATIONS ::: ', regionsInLocations);
    setRegions(regionsInLocations);
  };

  const getRegionsOfLocations = async urls => {
    return new Promise((resolve, reject) => {
      try {
        var listLocationsTmp = [];
        urls.map(async (location, index) => {
          let response = await axios.get(location);
          listLocationsTmp.push(response);
          if (urls.length - 1 === index) {
            resolve({dataResponse: listLocationsTmp});
          }
        });
      } catch (error) {
        console.log('ERROR ::: getRegionsOfLocations() : ', error);
        reject(error);
      }
    });
  };

  const getLocations = async () => {
    let dataUrlsResponse = await getPokemonLocations();
    let listLocationsDataTmp = dataUrlsResponse.dataResponse.data.results;
    let urlsLocations = listLocationsDataTmp.map(location => location.url);
    getRegionsLocations(urlsLocations);
  };

  const renderItemLocation = ({item}) => {
    return (
      <View style={Style.container}>
        <TouchableRipple rippleColor={Colors.BLUE_A200}>
          <View>
            <Card StyleCustom={CardStylesCustom}>
              <Text style={Style.regionName}>{item.name}</Text>
              <Text>{item.url}</Text>
            </Card>
          </View>
        </TouchableRipple>
      </View>
    );
  };

  return (
    <View style={Style.container}>
      <FlatList
        style={Style.regionList}
        data={locationsAreas}
        renderItem={renderItemLocation}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.url}
      />
    </View>
  );
};

const CardStylesCustom = {
  height: 70,
  backgroundColor: Colors.BLUE_A200,
  marginBottom: 16,
};

export default Locations;
