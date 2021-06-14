import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {teamsReference} from '@config/firebase_config';
import auth from '@react-native-firebase/auth';
import Card from '@components/Card';
import Colors from '@common/Colors';
import {InteractionManager} from 'react-native';
import {truncateStr} from '@utils/truncsStrings';

const Dashboard = ({route, navigation}) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getDataTeamsGeneral();
      });
      return () => task.cancel();
    }, []),
  );

  useEffect(() => {
    if(teams === undefined) {
      getDataTeamsGeneral();
    }
    console.log('TEAMS :: ', teams)
  }, []);

  const setTeamsOfCurrentUser = list => {
    return new Promise(async (resolve, reject) => {
      try {
        let listTeamsTmp = [];
        list.map(teams => {
          let responseDataTeam = Object.values(teams);
          responseDataTeam.map(item => {
            listTeamsTmp.push(item.team);
          });
        });
        resolve(listTeamsTmp);
      } catch (error) {
        reject(error);
      }
    });
  };

  const getDataTeamsGeneral = async () => {
    let dataResponse = new Promise(async (resolve, reject) => {
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
        resolve(listTmp);
      } catch (error) {
        console.log('ERROR ::: getTeams(): ', error);
        reject(error);
      }
    });

    dataResponse.then(async dataRes => {
      let teams = await setTeamsOfCurrentUser(dataRes);
      setTeams(teams);
    });
  };

  const handlerOnButtonDelete = currentTeam => {
    console.log('CURRENT TEAM ::: ', currentTeam.name)
    teams.map(team => {
      if (team.id === currentTeam.id) {
        handlerDelete(currentTeam.id);
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
          console.log('DELETE SUCCESSFUL!!');
          setLoading(false);
        });
    } catch (error) {
      console.log('ERROR ::: handlerDelete() : ', error);
    }
  };

  const handlerNavigateToPokemonsScreenForEdit = currentTeam => {
    navigation.navigate('Pokemons', {screen: 'Dashboard', team: currentTeam});
  };

  const renderCardTeam = ({item}) => {
    console.log('TEAM :::  CURRENT ::::::: ', item)
    return (
      <View>
        <Card StyleCustom={CardStylesCustom}>
          <View style={{flex: 1, flexDirection: 'row', padding: 8}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 18}}>{truncateStr(item.name, 20)}</Text>
              <Text style={{fontSize: 16}}>{truncateStr(item.type, 20)}</Text>
              <Text>
                {truncateStr(item.description, 42)}
              </Text>
            </View>
            <View
              style={{
                width: 100,
                justifyContent: 'space-around',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => handlerNavigateToPokemonsScreenForEdit(item)}>
                <Image
                  source={require('@assets/images/edit.png')}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // setLoading(false);
                  handlerOnButtonDelete(item);
                }}>
                {isLoading ? (
                  <ActivityIndicator
                    animating={true}
                    onPress={() => handlerOn}
                    style={{width: 32, height: 32}}
                    color={Colors.PINK_500}
                  />
                ) : (
                  <Image
                    source={require('@assets/images/trasher.png')}
                    style={{width: 24, height: 24}}
                  />
                )}
              </TouchableOpacity>
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
        keyExtractor={team => team ? team.id : null}
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
