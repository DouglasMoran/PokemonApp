import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavHost from '@components/BottomNavHost';
import LoginScreen from '@pages/Login';
import DetailsScreen from '@pages/Details';
import LocationList from '@components/List';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Pokemons" component={DetailsScreen} />
          <Stack.Screen name="Locations" component={LocationList} />
          <Stack.Screen
            name="BottomNavigationHost"
            component={BottomNavHost}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default App;
