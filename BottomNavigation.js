import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Updated to Ionicons
import ProfileScreen from './ProfileScreen';
import MapScreen from './MapScreen';
import SettingScreen from './SettingScreen';
import SearchScreen from './SearchScreen';

const Tab = createBottomTabNavigator();

// Define the TabIcon component outside of the navigator
const TabIcon = ({ route, focused, color, size }) => {
    let iconName;

    if (route.name === 'Profile') {
        iconName = focused ? 'person-circle' : 'person-circle-outline';
    } else if (route.name === 'Search') {
        iconName = 'search-outline';
    } else if (route.name === 'Map') {
        iconName = 'map-outline';
    } else if (route.name === 'Settings') {
        iconName = 'cog-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName="Profile"
            screenOptions={({ route }) => ({
                tabBarIcon: (props) => <TabIcon route={route} {...props} />, // Updated to use TabIcon
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Settings" component={SettingScreen} />
        </Tab.Navigator>
    );
};

export default BottomNavigation;
