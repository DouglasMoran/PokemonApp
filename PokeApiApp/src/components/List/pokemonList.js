import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

const BottomSheet = props => {
  const [pokemons, setPokemons] = useState([]);
  const [isPokemonSelected, setIsPokemonSelected] = useState(false);

  const eventOnSelectedItemPokemonButton = currentPokemon => {
    pokemons.map(pokemon => {
      if (pokemon.name === currentPokemon.name) {
        validatePokemonAdd(pokemon);
      }
    });
  };

  const validatePokemonAdd = pokemon => {
    if (count < 5) {
      handlerSelectPokemon(pokemon);
    } else {
      handlerShowBottomSheet();
    }
  };

  const handlerSelectPokemon = currentPokemon => {
    setCount(count + 1);
    setIsPokemonSelected(true);
    pokemonsSelectedList.push(currentPokemon);
  };

  const handlerShowBottomSheet = async () => {
    //HERE EXECUTE UPLOAD DATA TO FIREBASE AND FIRESTORE
    if (!loading) {
      if (isBottomSheetShow) {
        props.setIsBottomSheetShow(false);

        props.setIsCreatingTeam(false);
      } else {
        props.setIsBottomSheetShow(true);
      }
    }
  };

  return (
    <View style={{flex: 1, margin: 8}}>
      <TouchableOpacity rippleColor={Colors.BLUE_A200}>
        <Card StyleCustom={CardStylesCustom}>
          <View style={{flex: 1, flexDirection: 'row', margin: 12}}>
            <Image
              style={{flex: 1}}
              source={{uri: props.item.sprites.back_default}}
            />
            <View
              style={{
                width: 175,
                height: 175,
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Text style={{fontSize: 28, fontWeight: 'bold'}}>
                {props.item.name}
              </Text>
              <Text style={{fontSize: 16}}>{props.item.species.name}</Text>
              {props.isCreatingTeam ? (
                <Button
                  onPress={() => {
                    eventOnSelectedItemPokemonButton(props.item);
                  }}
                  buttonStyle={{marginTop: 48, width: 100}}
                  title={isPokemonSelected ? 'Added' : 'Add'}
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
