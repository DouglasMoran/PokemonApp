import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, LogBox} from 'react-native';
import Orientation from 'react-native-orientation';
import {Button, Image} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Card from '@components/Card';
import Colors from '@common/Colors';
import Styles from './styles/index';

const Profile = ({navigation}) => {
  const [user, setUser] = useState({});
  const [loadingSigOut, setLoadingSignOut] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs();//Ignore all log notifications
    Orientation.lockToPortrait();
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoadingData(true);
      let responseUser = await auth().currentUser;
      setUser(responseUser);
    } catch (error) {
      console.log('ERROR ::: getUser(): ', error);
    } finally {
      setLoadingData(false);
    }
  };

  const signOut = async () => {
    try {
      setLoadingSignOut(true);
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
            PlaceholderContent={
              <ActivityIndicator
                loading={loadingData}
                size={70}
                color={Colors.PINK_500}
              />
            }
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
            titleStyle={Styles.titleButtonSignOut}
            buttonStyle={Styles.buttonSignOut}
            color={Colors.GREEN_A200}
            title="Sign Out"
            iconPosition={'left'}
            loading={loadingSigOut}
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
