import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  useColorScheme,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const App = () => {
  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '193762090348-263hu4fhdu76561sutjk5db8pamqmcon.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, [loggedIn]);

  const getCredentialsCurrentUser = async (tokenId) => {
    const googleCredential = auth.GoogleAuthProvider.credential(tokenId);
    console.log('THIS THE CREDENTIALS ::: ', googleCredential);

    const user = auth().currentUser;
    console.log('DATA CURRENT USER ::: ', user);
    auth().signInWithCredential(googleCredential);
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      // setTokenId(idToken);
      // setloggedIn(true);
      getCredentialsCurrentUser(idToken)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('THISIS THE OTHER ERROR ::: ', error);
      }
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          color: '#212121',
          fontSize: 32,
          fontFamily: 'Montserrat-ExtraBold',
        }}>
        {loggedIn ? 'Logged' : 'No Logged'}
      </Text>
      {!loggedIn ? (
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      ) : (
        <></>
      )}

      <View style={{width: 300, height: 50, marginTop: 100}}>
        {!loggedIn && <Text>You are currently logged out</Text>}
        {loggedIn && (
          <Button onPress={signOut} title="LogOut" color="red"></Button>
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
