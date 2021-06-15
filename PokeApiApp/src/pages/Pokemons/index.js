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

  const handlerShowViewsCreatingOrEditing = () => {
    if (isCreatingTeam) {
      setIsCreatingTeam(false);
      setPokemonsSelectedList([]);
      setSelectedIds([]);
      setCount(0);
    } else {
      setIsCreatingTeam(true);
    }
  };

  const handlerNextButton = () => {
    handlerValidateSelctionOfTeamPokemons();
  };

  const handlerSelectPokemon = currentPokemon => {
    try {
      var selectIds = [...selectedIds];
      if (selectIds.includes(currentPokemon.id)) {
        selectIds = selectIds.filter(_id => _id !== currentPokemon.id);
      } else {
        selectIds.push(currentPokemon.id);
      }
      setSelectedIds(selectIds);
    } catch (error) {
      console.log('ERROR IN : handlerSelctPokemon() : ', error);
    }
  };

  const handlerRemovePokemonEditin = currentPokemonId => {
    if (pokemonsSelectedList.length < 4) {
      console.log('NO PUEDE QUEDAR MENOR A 3 EL TEAM');
    } else {
      let teamPokemonsUpdated = pokemonsSelectedList.filter(
        pokemon => pokemon.id !== currentPokemonId,
      );
      setPokemonsSelectedList(teamPokemonsUpdated);
    }
  };

  const handlerValidateSelctionOfTeamPokemons = () => {
    if (selectedIds.length < 3) {
      console.log('FALTA');
    } else if (selectedIds.length > 6) {
      console.log('Mucho');
    } else {
      let pokemonsSelctedsTmp = [];
      pokemons.map(pokemon => {
        selectedIds.map(idPokemonSelctedTmp => {
          if (pokemon.id === idPokemonSelctedTmp) {
            pokemonsSelctedsTmp.push(pokemon);
          }
        });
      });
      setPokemonsSelectedList(pokemonsSelctedsTmp);
      handlerShowBottomSheet();
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
                      handlerSelectPokemon(item);
                      if (route.params?.screen === 'Dashboard') {
                        handlerRemovePokemonEditin(item.id);
                      }
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
        data={route.params?.screen ? pokemonsSelectedList : pokemons}
        extraData={selectedIds}
        renderItem={renderCardPokemon}
        showsVerticalScrollIndicator={false}
        keyExtractor={pokemon => pokemon.id}
      />

      {!isCreatingTeam ? (
        <Button
          title="Create team"
          titleStyle={{fontFamily: 'CourierPrime-Bold', fontSize: 21}}
          buttonStyle={{
            borderRadius: 8,
            height: 50,
            backgroundColor: Colors.BLUE_A200,
          }}
          onPress={() => handlerShowViewsCreatingOrEditing()}
        />
      ) : (
        <></>
      )}

      {isCreatingTeam && !isBottomSheetShow ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 16,
            paddingBottom: 16,
          }}>
          <Button
            onPress={() => handlerShowViewsCreatingOrEditing()}
            type="outline"
            titleStyle={{fontFamily: 'CourierPrime-Bold', fontSize: 21}}
            buttonStyle={{
              borderRadius: 8,
              height: 50,
            }}
            title={`Cancel (${selectedIds.length}/6)`}
          />
          {/* Cancel operation */}
          <Button
            titleStyle={{fontFamily: 'CourierPrime-Bold', fontSize: 21}}
            buttonStyle={{
              borderRadius: 8,
              height: 50,
              width: 120,
              backgroundColor: Colors.PINK_500,
            }}
            title="Next"
            onPress={() => handlerNextButton()}
          />
        </View>
      ) : (
        <></>
      )}

      {isBottomSheetShow ? (
        <BottomSheet
          screen={route.params?.screen}
          teamToUpdate={route.params?.team}
          loading={loading}
          navigation={navigation}
          pokemonsSelectedList={
            route.params?.screen === 'Dashboard'
              ? pokemons
              : pokemonsSelectedList
          }
          setSelectedIds={setSelectedIds}
          setPokemonsSelectedList={setPokemonsSelectedList}
          handlerShowBottomSheet={handlerShowBottomSheet}
          pokemonsSelectedList={pokemonsSelectedList}
          setPokemonsSelectedList={setPokemonsSelectedList}
        />
      ) : (
        <></>
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
