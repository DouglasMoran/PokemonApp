import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {teamsReference} from '@config/firebase_config';
import auth from '@react-native-firebase/auth';
import Card from '@components/Card';
import Colors from '@common/Colors';
import {Button} from 'react-native-elements';

const Dashboard = () => {
  const [teams, setTeams] = useState([]);
  const [listGenral, setListGeneral] = useState([]);

  useEffect(() => {
    getDataTeamsGeneral();
    setTeamsOfCurrentUser();
  }, []);

  const setTeamsOfCurrentUser = () => {
    if (listGenral) {
      let listTeamsTmp = [];
      listGenral.map(teams => {
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
        .set({
          name: 'THIS IS REF OS OBJECT',
          type: 'FIRE',
          description: 'Watherver',
        })
        .then(() => {
          console.log('UPDATE SUCCESSFUL!!');
        });
    } catch (error) {
      console.log('ERROR ::: handlerDelete() : ', error);
    }
  };

  const renderCardTeam = ({item}) => {
    return (
      <View>
        <Card StyleCustom={CardStylesCustom}>
          <View style={{flex: 1}}>
            <Text>{item.name}</Text>
            <Text>{item.type}</Text>
            <Text>{item.description}</Text>
            <Button
              title="show team"
              onPress={() => handlerOnButtonDelete(item.id)}
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
        data={teams}
        renderItem={renderCardTeam}
        showsVerticalScrollIndicator={false}
        keyExtractor={team => team.name}
      />
    </View>
  );
};

const CardStylesCustom = {
  height: 150,
  backgroundColor: Colors.GREY_300,
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
  marginTop: 8,
};

export default Dashboard;
