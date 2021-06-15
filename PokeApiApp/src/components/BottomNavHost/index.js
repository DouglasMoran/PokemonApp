import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Image} from 'react-native';
import Colors from '@common/Colors';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from '@pages/Dashboard';
import ProfileScreen from '@pages/Profile';
import HomeScreen from '@pages/Home';

const TabsBottomNavigation = () => {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      inactiveColor="#000"
      activeColor="#f0edf6"
      barStyle={{
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
        backgroundColor: Colors.PINK_500,
        fontFamily: 'CourierPrime-Regular'
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="cards" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BottomNavHost = () => {
  return <TabsBottomNavigation />;
};

export default BottomNavHost;
