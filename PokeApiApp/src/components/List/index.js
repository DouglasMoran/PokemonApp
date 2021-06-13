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
    // getLocationsAreas();
    // getLocations();
    getDataOfLists();
  }, []);

  const getDataOfLists = async () => {
    let locationsAreas = new Promise(async (resolve, reject) => {
      try {
        let firstResponse = await getLocationsAreas();
        resolve({dataLocationsAreas: firstResponse});
      } catch (error) {
        console.log('ERROR ::: getDataOfList() : ', error);
        reject(error);
      }
    });
    locationsAreas.then(res => {

      let locations = new Promise(async (resolve, reject) => {
        try {
          let secondLoc = await getLocations();
          resolve(secondLoc);
        } catch (error) {
          reject(error);
        }
      });
      locations.then(response => {
        var listTmp = [];
        res.dataLocationsAreas.data.map((locationArea) => {
          response.dataResponse.dataLocations.map((location) => {
            if (locationArea.data.location.name === location.data.name) {
              if (location.data.region.name === route.params?.regionName) {
                listTmp.push(locationArea.data);
              }
            }
          });
        });
        let filteredArray = [...new Set(listTmp)];
        setLocationsAreas(filteredArray);
      });
    });
  };

  const getLocationsAreas = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let pokemonLocationsResult = await getPokemonLocationsArea();
        let res = await getAreasRegion(pokemonLocationsResult.locationsUrls);
        resolve({data: res});
      } catch (error) {
        console.log('ERROR ::: getLocations() : ', error);
        reject(error);
      }
    });
  };

  const getAreasRegion = async urls => {
    return new Promise(async (resolve, reject) => {
      try {
        let responseLocationsAreas = await getAreasOfLocationsAreas(urls);
        let listLocationsTmp = responseLocationsAreas.dataResponse;
        // setLocationsAreas(listLocationsTmp);
        // console.log('FIRST EXECUTED');
        resolve(listLocationsTmp);
      } catch (error) {
        console.log('ERROR ::: getAreasRegion() : ', error);
      }
    });
  };

  const getAreasOfLocationsAreas = async urls => {
    return new Promise(async (resolve, reject) => {
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

  const getLocations = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let dataUrlsResponse = await getPokemonLocations();
        let listLocationsDataTmp = dataUrlsResponse.dataResponse.data.results;
        let urlsLocations = listLocationsDataTmp.map(location => location.url);
        let res = await getRegionsLocations(urlsLocations);
        resolve({dataResponse: res});
      } catch (error) {
        console.log('ERROR: getLocations(): ', error);
        reject(error);
      }
    });
  };

  const getRegionsLocations = async urls => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await getRegionsOfLocations(urls);
        let listLocations = response.dataResponse;
        resolve({dataLocations: listLocations});
      } catch (error) {
        console.log('ERROR: getRegionsLocations() : ', error);
        reject(error);
      }
    });
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

  const navigateToSerchPokemons = (currentLocationArea) => {
    navigation.navigate('Pokemons', {location: currentLocationArea});
  }

  const renderItemLocation = ({item}) => {
    return (
      <View style={Style.container}>
        <TouchableRipple onPress={() => {
          navigateToSerchPokemons(item);
        }} rippleColor={Colors.BLUE_A200}>
          <View>
            <Card StyleCustom={CardStylesCustom}>
              <Text style={Style.regionName}>{item.location.name}</Text>
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
        keyExtractor={item => item.id}
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
