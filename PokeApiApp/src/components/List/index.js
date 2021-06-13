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
  const [regionsMatchsRegionsLocations, setRegionsMatchsRegionsLocations] =
    useState([]);

  useEffect(() => {
    getLocationsAreas();
    getLocations();

    // if (locationsAreas) {
    //   console.log('IN - LOCATIONS ::: ', locations.length);
    //   console.log('IN - LOCATIONS-AREAS ::: ', locationsAreas.length);
    //   // let locsAreas = locationsAreas.filter((locationArea) => locationArea.name === locations.data.name);
    //   // console.log('LOCS AREAS ::: ', locations);
    //   let listLocsTmp = [];
    //   locationsAreas.map(locationArea => {
    //     locations.map(location => {
    //       if (locationArea.name === location.name) {
    //         listLocsTmp.push(locationArea);
    //       }
    //     });
    //   });
    //   console.log('LOCATIONS-AREAS LIST ::: ', locationsAreas.length);
    //   console.log('LOCATIONS LIST ::: ', locations.length);
    //   console.log('MATCH LIST ::: ', listLocsTmp.length);
    // }
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
      
      let locations = listLocationsTmp.map(location => {
        location.data.location
        console.log('LIST AREAS ::: ', location.data)
      });
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
    let locationsTmp = listLocations.map(locationData => {
      return {id: locationData.data.id, name: locationData.data.name};
    });
    // setLocations(locationsTmp);

    // let locationsMatch = listLocations.filter(
    //   locationData =>
    //     locationData.data.region.name === route.params?.regionName,
    // );
    // console.log('LOCATION NAME ::: ', locationData.data.name);
    //     console.log('REGION NAME ::: ', locationData.data.region.name);
    //     console.log('LOCATIONS-AREAS NAME ::: ', locationsAreas.name);
    //     console.log('REGION PASS NAME ::: ', route.params?.regionName);
    setLocations(locationsTmp);
    // console.log('LOCATIONS FILTERED ::: ', locationsMatch.length);
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
              <Text style={Style.regionName}>{item}</Text>
              {/* <Text>{item.url}</Text> */}
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
