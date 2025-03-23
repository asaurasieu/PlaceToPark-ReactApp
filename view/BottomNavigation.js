import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-eva-icons';
import ProfileScreen from './ProfileScreen';
import SettingScreen from './SettingScreen';
import SearchScreen from './SearchScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({route, focused, color, size}) => {
  let iconName;

  if (route.name === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  } else if (route.name === 'Search') {
    iconName = focused ? 'search' : 'search-outline';
  } else if (route.name === 'Map') {
    iconName = focused ? 'map' : 'map-outline';
  } else if (route.name === 'Settings') {
    iconName = focused ? 'settings' : 'settings-outline';
  }

  return <Icon name={iconName} width={size} height={size} fill={color} />;
};

const BottomNavigation = ({route}) => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({route: tabRoute}) => ({
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: props => <TabIcon route={tabRoute} {...props} />,
        tabBarActiveTintColor: '#87CEEB',
        tabBarInactiveTintColor: '#D0D6E0',
        tabBarStyle: {
          backgroundColor: '#0F1A2B',
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
