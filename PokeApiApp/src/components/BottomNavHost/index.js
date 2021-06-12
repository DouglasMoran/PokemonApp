import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import DashboardScreen from '@pages/Dashboard';
import ProfileScreen from '@pages/Profile';
import HomeScreen from '@pages/Home';

const TabsBottomNavigation = () => {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      barStyle={{borderTopEndRadius: 24, borderTopStartRadius: 24}}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const BottomNavHost = () => {
  return <TabsBottomNavigation />;
};

export default BottomNavHost;
