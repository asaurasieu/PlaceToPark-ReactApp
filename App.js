import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginPage from './LoginPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigation from './BottomNavigation';
import EditProfile from './EditProfile';
import SearchScreen from './SearchScreen';
import SlotsScreen from './SlotsScreen';



// Initialize the stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileStack" component={BottomNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="StackSearch" component={SearchScreen} />
        <Stack.Screen name="SlotsScreen" component={SlotsScreen} />

        {/* ... other routes ... */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
