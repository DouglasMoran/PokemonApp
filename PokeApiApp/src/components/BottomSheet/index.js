import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Colors from '@common/Colors';
import {Button, Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {teamsReference} from '@config/firebase_config';
import Styles from './styles/index';

const BottomSheetComponent = ({
  screen,
  teamToUpdate,
  pokemonsSelectedList,
  setPokemonsSelectedList,
  handlerShowBottomSheet,
  setSelectedIds,
  navigation,
}) => {
  const [nameTeam, setNameTeam] = useState(screen === 'Dashboard' ? teamToUpdate.name : '');
  const [typeTeam, setTypeTeam] = useState(screen === 'Dashboard' ? teamToUpdate.type : '');
  const [descriptionTeam, setDescriptionTeam] = useState(screen === 'Dashboard' ? teamToUpdate.description : '');
  const [_loading, _setLoading] = useState(false);

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['100%', '100%'], []);

  useEffect(() => {
    pokemonsSelectedList.map((pokemon) => {
      // console.log('POKEMON OF LIST ::: ', pokemon.name)
      // console.log('TEAM IN BOTTOM SHEET TO UPDATE ::: ', teamToUpdate);
      // console.log('LEGHT OF THE LIST ::: IN BOTTOM SHEE FOR UPDATE DATA', pokemonsSelectedList.length)
    })

  },[])


  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
    if (index === 0) {
    }
  }, []);

  const handlerUpdateTeam = teamToUpdate => {
    if(teamToUpdate) {
      try {
        _setLoading(true);
  
        console.log('DATA META ::: ', nameTeam)
        let newDataTeam = {
          id: teamToUpdate.id,
          name: nameTeam,
          lastUpdate: Date.now(),
          type: typeTeam,
          description: descriptionTeam,
          pokemons: pokemonsSelectedList,
          dataUser: {
            name: teamToUpdate.dataUser.name,
            email: teamToUpdate.dataUser.email,
          },
        }
  
        teamsReference
          .child(auth().currentUser.uid)
          .child('teams')
          .child(teamToUpdate.id)
          .update(newDataTeam)
          .then(() => {
            console.log('TEAM UPDATE SUCCESSFUL!!');
            _setLoading(false);
            navigation.goBack();
          });
      } catch (error) {
        console.log('ERROR ::: handlerDelete() : ', error);
      }
    } else {
      console.log('ESTA EN MODO CREATE')
    }
    
  };

  const handleUploadTeam = async () => {
    try {
      _setLoading(true);
      let user = await auth().currentUser;

      let team = {
        id: Date.now(),
        name: nameTeam,
        lastUpdate: Date.now(),
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
          _setLoading(false);
          setPokemonsSelectedList([]);
          setSelectedIds([]);
          handlerShowBottomSheet();
          console.log('TEAM CREATE SUCCESSFUL!!')
        });
    } catch (error) {
      console.log('ERROR EXECUTING ::: dataToUpload(): ', error);
    }
  };

  // renders
  return (
    <View style={Styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View style={Styles.contentContainer}>
          <Text>
            {screen === 'Dashboard' ? 'Edit your team' : 'Create a team'}
          </Text>
          <View style={Styles.containerInputs}>
            <Input
              placeholder="Name"
              value={nameTeam}
              onChangeText={value => setNameTeam(value)}
            />
            <Input
              placeholder="Type"
              value={typeTeam}
              onChangeText={value => setTypeTeam(value)}
            />
            <Input
              placeholder="Description"
              value={descriptionTeam}
              onChangeText={value => setDescriptionTeam(value)}
            />
          </View>
          <Button
            loading={_loading}
            loadingStyle={{color: Colors.BLUE_A700}}
            disabled={_loading}
            onPress={() => {
              if (screen === 'Dashboard') {
                // Here call to make update team
                handlerUpdateTeam(teamToUpdate);
              } else {
                handleUploadTeam();
              }
            }}
            title={screen === 'Dashboard' ? 'Update' : 'Create'}
            buttonStyle={Styles.button}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default BottomSheetComponent;
