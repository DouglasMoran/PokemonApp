import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {getPokemonLocationsArea} from '@services/pokemonsService';
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

  useEffect(() => {
    getLocationsAreas();
    console.log('LOCATIONS AREAS ::: ', locationsAreas.length);
  }, []);

  const getLocationsAreas = async () => {
    try {
      let pokemonLocationsResult = await getPokemonLocationsArea();
      // console.log('************************************************');
      setUrlsLocations(pokemonLocationsResult.locationsUrls);
      getAreasRegion(pokemonLocationsResult.locationsUrls);
    } catch (error) {
      console.log('ERROR ::: getLocations() : ', error);
    }
  };

  const getAreasRegion = async (urls) => {
    try {
      let responseLocationsAreas = await getAreasLocations(urls);
      console.log('RESPONSE SUCCESSFULL THANKS, ', responseLocationsAreas)
      console.log('LOCATION NAME: ', responseLocationsAreas.areasResponse.location.name)
      console.log('LOCATION AREA NAME: ', responseLocationsAreas.areasResponse.name);
      console.log('LOCATION POKEMONS ENCOUNTER: ', responseLocationsAreas.areasResponse.pokemon_encounters);
    } catch (error) {
      console.log('ERROR ::: getAreasRegion() : ', error);
    }
  }

  const getAreasLocations = async urls => {
    return new Promise((resolve, reject) => {
      try {
        urls.map(async location => {
          let response = await axios.get(location);
          resolve({areasResponse: response.data});
        });
      } catch (error) {
        console.log('ERROR ::: getAreasLocations() : ', error);
        reject(error);
      }
    });
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
      <Text>{locationsAreas.length}</Text>
      <FlatList
        style={Style.regionList}
        data={pokemonLocations}
        renderItem={renderItemLocation}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => getId(item.url)}
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
