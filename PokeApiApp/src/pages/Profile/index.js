import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button, Image} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Card from '@components/Card';
import Colors from '@common/Colors';
import Styles from './styles/index';

const Profile = ({navigation}) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    let responseUser = await auth().currentUser;
    setUser(responseUser);
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => {
          setUser([]);
          navigation.navigate('Login');
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={Styles.containerMain}>
      <Card StyleCustom={CardStyleCustom}>
        <View style={Styles.containerChild}>
          <Image
            style={Styles.imagePhoto}
            source={
              user.photoURL
                ? {uri: user?.photoURL}
                : require('@assets/images/user-blanckstate.png')
            }
          />
          <Text style={Styles.textName}>{user.displayName}</Text>
          <Text style={Styles.textEmail}>{user.email}</Text>
          <Button
            type="clear"
            onPress={() => signOut()}
            buttonStyle={Styles.buttonSignOut}
            color={Colors.GREEN_A200}
            title="Sign Out"
            iconPosition={'left'}
            loading={loading}
          />
        </View>
      </Card>
    </View>
  );
};

const CardStyleCustom = {
  width: '90%',
  height: '70%',
  backgroundColor: Colors.GREY_300,
  borderTopEndRadius: 16,
  borderTopStartRadius: 16,
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
  marginEnd: 24,
  marginStart: 24,
  justifyContent: 'center',
  alignItems: 'center',
};

export default Profile;
