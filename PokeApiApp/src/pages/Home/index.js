import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Card from '@components/Card';
import {getPokemonsRegions} from '@services/pokemonsService';
import Colors from '@common/Colors';
import {getId} from '@utils/truncsStrings';
import Style from './styles/index';

const Home = ({navigation}) => {
  const [pokemonsRegions, setPokemonsRegions] = useState([]);

  useEffect(() => {
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
        <TouchableRipple
          onPress={() => {
            navigation.navigate('Locations', {regionName: item.name});
          }}
          rippleColor={Colors.BLUE_A200}>
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
