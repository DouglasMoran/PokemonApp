import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import Card from '@components/Card';
import Colors from '@common/Colors';
import axios from 'axios';

const Pokemons = ({route, navigation}) => {
  const [location, setLocation] = useState({});
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    setLocation(route.params?.location);
    getPokemons();
  }, []);

  const getPokemons = async () => {
    let urlsPokemons = new Promise(async (resolve, reject) => {
      try {
        let pokemons = await location.pokemon_encounters;
        let pokemonsUrls = pokemons.map(pokemon => pokemon.pokemon.url);
        resolve(pokemonsUrls);
      } catch (error) {
        reject(error);
      }
    });

    urlsPokemons.then(async urls => {
      let responsePokemons = await getPokemonData(urls);
      var listPokemonsTmp = [];
      responsePokemons.dataResponse.map(pokemon => {
        listPokemonsTmp.push(pokemon.data);
      });
      setPokemons(listPokemonsTmp);
    });
  };

  const getPokemonData = async urls => {
    try {
      let listPokemons = await getPokemonsData(urls);
      return listPokemons;
    } catch (error) {
      console.log('ERROR: getPokemon(): ', error);
    }
  };

  const getPokemonsData = async urls => {
    return new Promise((resolve, reject) => {
      try {
        var pokemons = [];
        urls.map(async (pokemon, index) => {
          let responsePokemon = await axios.get(pokemon);
          pokemons.push(responsePokemon);
          if (urls.length - 1 === index) {
            resolve({dataResponse: pokemons});
          }
        });
      } catch (error) {
        console.log('ERROR ::: getPokemonsData() : ', error);
        reject(error);
      }
    });
  };

  const renderCardPokemon = ({item}) => {
    return (
      <View style={{flex: 1, margin: 8}}>
        <TouchableOpacity rippleColor={Colors.BLUE_A200}>
          <Card StyleCustom={CardStylesCustom}>
            <View style={{flex: 1, flexDirection: 'row', margin: 12}}>
              <Image
                style={{flex: 1}}
                source={{uri: item.sprites.back_default}}
              />
              <View
                style={{
                  width: 175,
                  height: 175,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>
                  {item.name}
                </Text>
                <Text style={{fontSize: 16}}>{item.species.name}</Text>
                <Button
                  buttonStyle={{marginTop: 48, width: 100}}
                  title="Agregar"
                />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, margin: 8}}>
      <FlatList
        style={{flex: 1}}
        data={pokemons}
        renderItem={renderCardPokemon}
        showsVerticalScrollIndicator={false}
        keyExtractor={pokemon => pokemon.id}
      />
      <View>
        <Button
          titleStyle={{fontSize: 21}}
          buttonStyle={{
            borderTopEndRadius: 0,
            borderTopStartRadius: 0,
            borderBottomStartRadius: 16,
            borderBottomEndRadius: 16,
            height: 70,
            marginEnd: 8,
            marginStart: 8,
          }}
          title="Create team"
        />
      </View>
    </View>
  );
};

const CardStylesCustom = {
  height: 200,
  backgroundColor: Colors.GREY_300,
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
};

export default Pokemons;
