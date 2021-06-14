import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import {Button, Input} from 'react-native-elements';
import Card from '@components/Card';
import Colors from '@common/Colors';
import axios from 'axios';
import {teamsReference} from '@config/firebase_config';
import auth from '@react-native-firebase/auth';

const Pokemons = ({route, navigation}) => {
  const [pokemons, setPokemons] = useState([]);
  const [isBottomSheetShow, setIsBottomSheetShow] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [pokemonsSelectedList, setPokemonsSelectedList] = useState([]);
  const [count, setCount] = useState(0);
  const [nameTeam, setNameTeam] = useState('');
  const [typeTeam, setTypeTeam] = useState('');
  const [descriptionTeam, setDescriptionTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [typesSelections, setTypesSelections] = useState([
    'Add',
    'Added',
    'Remove',
    'Edit',
  ]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    getPokemons();
  }, [count, loading]);

  const getPokemons = async () => {
    let urlsPokemons = new Promise(async (resolve, reject) => {
      try {
        let location = route.params?.location;
        let pokemons = await location.pokemon_encounters;
        let pokemonsUrls = await pokemons.map(pokemon => pokemon.pokemon.url);
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

  const uploadTeam = async () => {
    try {
      setLoading(true);
      let user = await auth().currentUser;

      let team = {
        id: Date.now(),
        name: nameTeam,
        type: typeTeam,
        description: descriptionTeam,
        pokemons: pokemonsSelectedList,
        dataUser: {
          name: user.displayName,
          email: user.email,
        },
      };

      teamsReference
        .child(user.uid)
        .child('teams')
        .child(team.id)
        .set({team})
        .then(res => {
          console.log('Data uploaded SUCCESSFUL!!');
          setLoading(false);
        });
    } catch (error) {
      console.log('ERROR EXECUTING ::: dataToUpload(): ', error);
    }
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
      setCount(0);
    } else {
      setIsCreatingTeam(true);
    }
  };

  const validatePokemonAdd = pokemon => {
    if (count <= 5) {
      handlerSelectPokemon(pokemon);
    } else {
      handlerShowBottomSheet();
    }
  };

  const eventOnSelectedItemPokemonButton = currentPokemon => {
    try {
      validatePokemonAdd(currentPokemon);
      var selectIds = [...selectedIds]; // clone state
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
                {isCreatingTeam ? (
                  <Button
                    onPress={() => {
                      eventOnSelectedItemPokemonButton(item);
                    }}
                    buttonStyle={
                      selectedIds.includes(item.id)
                        ? {
                            marginTop: 48,
                            width: 100,
                            backgroundColor: Colors.GREEN_A200,
                          }
                        : {marginTop: 48, width: 100}
                    }
                    title={selectedIds.includes(item.id) ? 'Added' : 'Add'}
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

  const BottomSheet = () => {
    return (
      <View style={{flex: 1}}>
        <Card StyleCustom={StylesBottomsheet}>
          <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 21,
                fontWeight: 'bold',
                color: Colors.WHITE_P,
                marginTop: 8,
              }}>
              Create a team
            </Text>

            <View style={{width: '80%', justifyContent: 'space-around'}}>
              <Input
                placeholder="Name"
                value={nameTeam}
                containerStyle={{marginBottom: 8, borderTopEndRadius: 8}}
                onChangeText={value => {
                  setNameTeam(value);
                }}
              />

              <Input
                placeholder="Type"
                value={typeTeam}
                containerStyle={{marginBottom: 8}}
                onChangeText={value => {
                  setTypeTeam(value);
                }}
              />

              <Input
                placeholder="Description"
                value={descriptionTeam}
                containerStyle={{marginBottom: 8}}
                onChangeText={value => {
                  setDescriptionTeam(value);
                }}
              />
            </View>

            <Button
              loading={loading}
              onPress={() => {
                uploadTeam();
                handlerShowBottomSheet();
              }}
              title="Create"
              buttonStyle={{width: 200}}
            />
          </View>
        </Card>
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
        <BottomSheet />
      ) : (
        <View>
          <Button
            onPress={() => {
              handlerCreateAndCancel();
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
            title={isCreatingTeam ? `Cancel (${count}/6)` : 'Create team'}
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

const StylesBottomsheet = {
  height: '100%',
  backgroundColor: Colors.PINK_500,
  borderTopEndRadius: 16,
  borderTopStartRadius: 16,
  marginStart: 16,
  marginEnd: 16,
};

export default Pokemons;
