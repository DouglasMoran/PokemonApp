import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import Card from '@components/Card';
import Colors from '@common/Colors';
import axios from 'axios';
import BottomSheet from '@components/BottomSheet';
import Styles from './styles/index';

const Pokemons = ({route, navigation}) => {
  const [pokemons, setPokemons] = useState(
    route.params?.screen === 'Dashboard' ? route.params?.team.pokemons : [],
  );
  const [isBottomSheetShow, setIsBottomSheetShow] = useState(
    route.params?.screen === 'Dashboard' ? true : false,
  );
  const [isCreatingTeam, setIsCreatingTeam] = useState(
    route.params?.screen === 'Dashboard' ? true : false,
  );
  const [pokemonsSelectedList, setPokemonsSelectedList] = useState(
    route.params?.screen === 'Dashboard' ? route.params?.team.pokemons : [],
  );
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typesSelections, setTypesSelections] = useState([
    'Add',
    'Remove',
    'Edit',
    'Cancel',
  ]);
  const [selectedIds, setSelectedIds] = useState(
    route.params?.screen === 'Dashboard'
      ? route.params?.team.pokemons.map(pokemon => pokemon.id)
      : [],
  );

  useEffect(() => {
    if (route.params?.location !== undefined) {
      getPokemons();
    }
  }, [loading]);

  const getPokemons = async () => {
    let urlsPokemons = new Promise(async (resolve, reject) => {
      try {
        let location = route.params?.location;
        let pokemons = await location.pokemon_encounters;
        let pokemonsUrls = await pokemons.map(pokemon => pokemon.pokemon.url);
        resolve(pokemonsUrls);
      } catch (error) {
        reject(error);
        console.log('THIS IS A ERROR ::: ', error);
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

  const handlerSelectPokemon = currentPokemon => {
    setCount(count + 1);
    pokemonsSelectedList.push(currentPokemon);
  };

  const handlerShowBottomSheet = async () => {
    if (!loading) {
      if (isBottomSheetShow) {
        setIsBottomSheetShow(false);

        setIsCreatingTeam(false);
      } else {
        setIsBottomSheetShow(true);
      }
    }
  };

  const handlerCreateAndCancel = () => {
    if (isCreatingTeam) {
      setIsCreatingTeam(false);
      setPokemonsSelectedList([]);
      setSelectedIds([]);
      setCount(0);
    } else {
      setIsCreatingTeam(true);
    }
  };

  const validatePokemonAdd = pokemon => {
    if (count < 5) {
      handlerSelectPokemon(pokemon);
    } else {
      handlerShowBottomSheet();
    }
  };

  const handlerRemovePokemon = currentPokemon => {
    try {
      console.log('POKEMONS ::: ', pokemonsSelectedList.length);
      let pokemonListUpdate = pokemonsSelectedList.filter(
        pokemon => pokemon.id !== currentPokemon.id,
      );
      console.log('POKEMONS UPDATE ::: ', pokemonListUpdate.length);
      setPokemonsSelectedList(pokemonListUpdate);
      if(route.params?.screen === 'Dashboard') {
        setPokemons(pokemonListUpdate);
      }
    } catch (error) {
      console.log('THIS IS THE ERROR :::  ', error);
    }
  };

  const eventOnSelectedItemPokemonButton = currentPokemon => {
    try {
      validatePokemonAdd(currentPokemon);
      var selectIds = [...selectedIds];
      if (selectedIds.includes(currentPokemon.id)) {
        // selectedIds = selectedIds.filter(_id => _id !== currentPokemonId);
      } else {
        selectIds.push(currentPokemon.id);
      }
      setSelectedIds(selectIds);
    } catch (error) {
      console.log('THIS IS THE ERROR :::  ', error);
    }
  };

  const renderCardPokemon = ({item}) => {
    return (
      <View style={Styles.containerMainCard}>
        <TouchableOpacity rippleColor={Colors.BLUE_A200}>
          <Card StyleCustom={CardStylesCustom}>
            <View style={Styles.containerChildCard}>
              <Image
                style={Styles.imagePokemon}
                source={{uri: item.sprites.back_default}}
              />
              <View style={Styles.containerDataCard}>
                <Text style={Styles.textName}>{item.name}</Text>
                <Text style={Styles.textSpeciesName}>{item.species.name}</Text>
                {isCreatingTeam ? (
                  <Button
                    onPress={() => {
                      selectedIds.includes(item.id)
                        ? handlerRemovePokemon(item)
                        : eventOnSelectedItemPokemonButton(item);
                    }}
                    buttonStyle={
                      selectedIds.includes(item.id)
                        ? {
                            marginTop: 48,
                            width: 100,
                            backgroundColor: Colors.PINK_500,
                          }
                        : {marginTop: 48, width: 100}
                    }
                    title={selectedIds.includes(item.id) ? 'Remove' : 'Add'}
                  />
                ) : (
                  <></>
                )}
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
        extraData={selectedIds}
        renderItem={renderCardPokemon}
        showsVerticalScrollIndicator={false}
        keyExtractor={pokemon => pokemon.id}
      />

      {isBottomSheetShow ? (
        <BottomSheet
          screen={route.params?.screen}
          teamToUpdate={route.params?.team}
          loading={loading}
          navigation={navigation}
          pokemonsSelectedList={route.params?.screen === 'Dashboard' ? pokemons : pokemonsSelectedList}
          setSelectedIds={setSelectedIds}
          setPokemonsSelectedList={setPokemonsSelectedList}
          handlerShowBottomSheet={handlerShowBottomSheet}
          pokemonsSelectedList={pokemonsSelectedList}
          setPokemonsSelectedList={setPokemonsSelectedList}
        />
      ) : (
        <View>
          <Button
            onPress={() => {
              if (route.params?.screen === 'Dashboard') {
                handlerShowBottomSheet();
              } else {
                handlerCreateAndCancel();
              }
            }}
            titleStyle={{fontSize: 21}}
            buttonStyle={{
              borderTopEndRadius: 0,
              borderTopStartRadius: 0,
              borderBottomStartRadius: 16,
              borderBottomEndRadius: 16,
              height: 70,
              marginEnd: 8,
              marginStart: 8,
              backgroundColor: isCreatingTeam
                ? Colors.PINK_900
                : Colors.BLUE_A200,
            }}
            title={
              isCreatingTeam
                ? `${
                    route.params?.screen === 'Dashboard'
                      ? 'Next'
                      : `Cancel (${count}/6)`
                  } `
                : `${
                    route.params?.screen === 'Dashboard'
                      ? 'Edit Team'
                      : 'Create Team'
                  }`
            }
          />
        </View>
      )}
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
