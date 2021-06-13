import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {teamsReference} from '@config/firebase_config';
import auth from '@react-native-firebase/auth';
import Card from '@components/Card';
import Colors from '@common/Colors';

const BottomSheet = () => {
  const [nameTeam, setNameTeam] = useState('');
  const [typeTeam, setTypeTeam] = useState('');
  const [descriptionTeam, setDescriptionTeam] = useState('');

  const handlerShowBottomSheet = async () => {
    //HERE EXECUTE UPLOAD DATA TO FIREBASE AND FIRESTORE
    if (!loading) {
      if (isBottomSheetShow) {
        setIsBottomSheetShow(false);

        setIsCreatingTeam(false);
      } else {
        setIsBottomSheetShow(true);
      }
    }
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
