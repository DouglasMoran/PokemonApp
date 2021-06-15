import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Styles from './styles/index';
import {Button} from 'react-native-elements';
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
    if (teams === undefined) {
      getDataTeamsGeneral();
    }
  }, []);

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
      let listTmp = dataRes;
      getTeams(listTmp);
    });
  };

  const getTeams = dataList => {
    let listTeamsTmp = [];
    dataList.map(team => {
      let responseDataTeam = Object.values(team);
      responseDataTeam.map(item => {
        listTeamsTmp.push(item);
      });
    });
    setTeams(listTeamsTmp);
  };

  const handlerOnButtonDelete = currentTeam => {
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
          console.log('DELETE SUCCESSFUL!! ');
          refreshTeamList(currentTeamId);
        });
    } catch (error) {
      console.log('ERROR ::: handlerDelete() : ', error);
    }
  };

  const refreshTeamList = currentTeamId => {
    let updateTeamsList = teams.filter(team => team.id !== currentTeamId);
    setTeams(updateTeamsList);
  };

  const handlerNavigateToPokemonsScreenForEdit = currentTeam => {
    navigation.navigate('Pokemons', {screen: 'Dashboard', team: currentTeam});
  };

  const LayoutDefault = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          resizeMode="center"
          style={{width: '100%', height: 300, marginEnd: 24, marginStart: 24}}
          source={require('@assets/images/team_1.png')}
        />
        <Text
          style={{
            fontFamily: 'Montserrat-ExtraBold',
            fontSize: 18,
            marginTop: 32,
          }}>
          Hey, you do not have any teams!!
        </Text>
        <Text
          style={{
            fontFamily: 'CourierPrime-Bold',
            fontSize: 21,
            marginTop: 16,
          }}>
          What do yo await?
        </Text>
        <Button
          title="Get starter"
          titleStyle={{fontFamily: 'Montserrat-ExtraBold'}}
          buttonStyle={{
            width: 150,
            height: 42,
            backgroundColor: Colors.BLUE_A200,
            alignItems: 'center',
            marginTop: 24,
          }}
          onPress={() => navigation.navigate('Locations')}
        />
      </View>
    );
  };

  const renderCardTeam = ({item}) => {
    return (
      <View>
        <Card StyleCustom={CardStylesCustom}>
          <View style={Styles.containerChildCard}>
            <View style={Styles.containerData}>
              <Text style={Styles.textName}>{truncateStr(item.name, 20)}</Text>
              <Text style={Styles.textType}>{truncateStr(item.type, 20)}</Text>
              <Text style={Styles.textDescription}>
                {truncateStr(item.description, 100)}
              </Text>
            </View>
            <View style={Styles.containerButtonsText}>
              <Text style={Styles.textPokemonsL}>
                {item.pokemons.length} pokemons
              </Text>
              <View style={Styles.containerButtonsActions}>
                <TouchableOpacity
                  onPress={() => handlerNavigateToPokemonsScreenForEdit(item)}>
                  <Image
                    source={require('@assets/images/edit.png')}
                    style={{width: 24, height: 24}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handlerOnButtonDelete(item);
                  }}>
                  {isLoading ? (
                    <ActivityIndicator
                      animating={true}
                      style={Styles.activityIndicator}
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
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={Styles.containerMain}>
      {console.log('ESTA :::: ', teams.length === 0)}
      {teams.length === 0 ? (
        <LayoutDefault />
      ) : (
        <FlatList
          style={{flex: 1}}
          data={teams}
          renderItem={renderCardTeam}
          showsVerticalScrollIndicator={false}
          keyExtractor={team => (team ? team.id : null)}
        />
      )}
    </View>
  );
};

const CardStylesCustom = {
  height: 200,
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
  marginTop: 8,
};

export default Dashboard;
