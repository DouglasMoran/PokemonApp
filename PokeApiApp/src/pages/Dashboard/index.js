import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import {teamsReference} from '@config/firebase_config';
import auth from '@react-native-firebase/auth';
import Card from '@components/Card';
import Colors from '@common/Colors';
import {Button} from 'react-native-elements';

const Dashboard = ({route, navigation}) => {
  const [teams, setTeams] = useState([]);
  const [listGenral, setListGeneral] = useState([]);

  useEffect(() => {
    getDataTeamsGeneral();
  }, []);

  const setTeamsOfCurrentUser = (list) => {
    if (list) {
      let listTeamsTmp = [];
      list.map(teams => {
        let responseDataTeam = Object.values(teams);
        responseDataTeam.map(item => {
          listTeamsTmp.push(item.team);
        });
      });
      setTeams(listTeamsTmp);
    }
  };

  const getDataTeamsGeneral = async () => {
    try {
      var listTmp = [];
      await teamsReference.on('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          var childKey = childSnapshot.key;
          if (childKey === auth().currentUser.uid) {
            listTmp.push(childSnapshot.child('teams').val());
          }
        });
      });

      setTeamsOfCurrentUser(listTmp);
      setListGeneral(listTmp);
    } catch (error) {
      console.log('ERROR ::: getTeams(): ', error);
    }
  };

  const handlerOnButtonDelete = currentTeamId => {
    teams.map(team => {
      if (team.id === currentTeamId) {
        handlerDelete(currentTeamId);
      }
    });
  };

  const handlerDelete = currentTeamId => {
    try {
      teamsReference
        .child(auth().currentUser.uid)
        .child('teams')
        .child(currentTeamId)
        .set(null)
        .then(() => {
          console.log('UPDATE SUCCESSFUL!!');
        });
    } catch (error) {
      console.log('ERROR ::: handlerDelete() : ', error);
    }
  };

  const handlerNavigateToPokemonsScreenForEdit = (currentTeam) => {
    navigation.navigate('Pokemons', {screen: 'Dashboard', team: currentTeam});
  }

  const renderCardTeam = ({item}) => {
    return (
      <View>
        <Card StyleCustom={CardStylesCustom}>
          <View style={{flex: 1, flexDirection: 'row', padding: 8}}>
            <View style={{flex: 1,}}>
            <Text style={{fontSize: 18}}>Mis Pokemons favoritos</Text>
            <Text style={{fontSize: 16}}>Fuego</Text>
            <Text>Estos pokemons son geniales en las batallas improvistas</Text>
            </View>
            <View style={{width: 120, justifyContent: 'space-between'}}>
            <Button title='Edit' onPress={() => handlerNavigateToPokemonsScreenForEdit(item)} />
            <Button
              title="Remove"
              onPress={() => handlerOnButtonDelete(item.id)}
            />
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={{flex: 1, margin: 8}}>
      <FlatList
        style={{flex: 1}}
        data={teams}
        renderItem={renderCardTeam}
        showsVerticalScrollIndicator={false}
        keyExtractor={team => team.name}
      />
    </View>
  );
};

const CardStylesCustom = {
  height: 100,
  backgroundColor: Colors.GREY_300,
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
  marginTop: 8,
};

export default Dashboard;
