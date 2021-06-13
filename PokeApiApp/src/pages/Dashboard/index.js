import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {teamsReference} from '@config/firebase_config';
import Card from '@components/Card';
import Colors from '@common/Colors';

const Dashboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // getTeams();
  }, []);

  const getTeams = async () => {
    try {
      await teamsReference.on('value', snapshot => {
        const dataResponseTeams = snapshot.val();
        console.log('ID TEAM ::: ', dataResponseTeams.child('id').val());
        setTeams(dataResponseTeams);
        console.log('I WAIT THE TEAMS LIST ::: ', dataResponseTeams);
      });
    } catch (error) {
      console.log('ERROR ::: getTeams(): ', error);
    }
  };

  const renderCardTeam = () => {
    return (
      <View>
        <Card StyleCustom={CardStylesCustom}>
          <View>
            <Text>Team 1</Text>
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
