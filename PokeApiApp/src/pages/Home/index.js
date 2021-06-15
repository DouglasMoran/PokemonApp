import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, LogBox} from 'react-native';
import Orientation from 'react-native-orientation';
import Card from '@components/Card';
import {getPokemonsRegions} from '@services/pokemonsService';
import Colors from '@common/Colors';
import {getId} from '@utils/truncsStrings';
import Style from './styles/index';

const Home = ({navigation}) => {
  const [pokemonsRegions, setPokemonsRegions] = useState([]);

  useEffect(() => {
    LogBox.ignoreAllLogs();
    Orientation.lockToPortrait();
    getRegions();
  }, []);

  const getRegions = async () => {
    try {
      let pokemonLocationsResult = await getPokemonsRegions();
      let regions = pokemonLocationsResult.regions.data.results;
      setPokemonsRegions(regions);
    } catch (error) {
      console.log('ERROR ::: getRegions() : ', error);
    }
  };

  const renderItemRegion = ({item}) => {
    return (
      <View style={Style.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Locations', {regionName: item.name});
          }}
          rippleColor={Colors.BLUE_A200}>
          <View>
            <Card StyleCustom={CardStylesCustom}>
              <Text style={Style.regionName}>{item.name}</Text>
            </Card>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={Style.container}>
      <Text style={Style.headerLabel}>Regions</Text>
      <FlatList
        style={Style.regionList}
        data={pokemonsRegions}
        renderItem={renderItemRegion}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => getId(item.url)}
      />
    </View>
  );
};

const CardStylesCustom = {
  height: 70,
  backgroundColor: Colors.GREY_50,
  marginBottom: 16,
};

export default Home;
