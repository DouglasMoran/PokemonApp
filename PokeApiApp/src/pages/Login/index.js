import React, {useEffect, useState} from 'react';
import {View, Image, Text, ActivityIndicator} from 'react-native';
import Orientation from 'react-native-orientation';
import Card from '@components/Card';
import Colors from '@common/Colors';
import Styles from './styles/index';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    Orientation.lockToPortrait();
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '193762090348-263hu4fhdu76561sutjk5db8pamqmcon.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const getCredentialsCurrentUser = async tokenId => {
    try {
      const googleCredential = auth.GoogleAuthProvider.credential(tokenId);
      auth().signInWithCredential(googleCredential);
      auth().onAuthStateChanged(user => {
        if (user) {
          navigateToHome();
        }
      });
    } catch (error) {
      console.log('ERROR ::: getCredentialsCurrentUser() : ', error);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      getCredentialsCurrentUser(idToken);
    } catch (error) {
      // Here below add alert with some error obtained
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('THISIS THE OTHER ERROR ::: signIn :', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToHome = () => {
    // Is Sign In successful? navigate to Home
    navigation.navigate('BottomNavigationHost');
  };

  return (
    <View style={Styles.container}>
      <Image
        style={Styles.logo}
        resizeMode="contain"
        source={require('@assets/images/poke_logo.png')}
      />

      <Card StyleCustom={CardStyleCustom}>
        <View style={Styles.childrenCard}>
          <Text style={Styles.textWelcome}>Welcome</Text>
          {loading ? (
            <ActivityIndicator
              loading={loading}
              size={70}
              color={Colors.GREY_50}
            />
          ) : (
            <GoogleSigninButton
              style={Styles.buttonGoogle}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
            />
          )}
        </View>
      </Card>
    </View>
  );
};

const CardStyleCustom = {
  height: '50%',
  backgroundColor: Colors.PINK_500,
  borderTopEndRadius: 16,
  borderTopStartRadius: 16,
};

export default Login;
