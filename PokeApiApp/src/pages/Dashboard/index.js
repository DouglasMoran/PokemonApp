import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {teamsReference} from '@config/firebase_config';
import auth from '@react-native-firebase/auth';
import Card from '@components/Card';
import Colors from '@common/Colors';

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
          // console.log('TEAM ::: ', item.team.name)
        });
      });
      // console.log('TEAMS ::: ', listTeamsTmp)
      setTeams(listTeamsTmp);
    }
  }

  const getDataTeamsGeneral = async () => {
    let userId = auth().currentUser.uid;
    try {
      var listTmp = [];
      await teamsReference.on('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          var childKey = childSnapshot.key;
          if (childKey === userId) {
            listTmp.push(childSnapshot.child('teams').val());
          }
        });
      });

      setListGeneral(listTmp);
    } catch (error) {
      console.log('ERROR ::: getTeams(): ', error);
    }
  };

  const renderCardTeam = ({item}) => {
    console.log('****************************')
    console.log('TEAM ::: ', item.name)
    return (
      <View>
        <Card StyleCustom={CardStylesCustom}>
          <View>
            <Text>{item.name}</Text>
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
        keyExtractor={team => team.id}
      />
    </View>
  );
};

const CardStylesCustom = {
  height: 200,
  backgroundColor: Colors.GREY_300,
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
};

export default Dashboard;
