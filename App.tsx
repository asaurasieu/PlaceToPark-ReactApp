import React from 'react';
import { enableScreens } from 'react-native-screens';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './view/LoginPage';
import BottomNavigation  from './view/BottomNavigation';
import EditProfile from './view/EditProfile';
import SearchScreen from './view/SearchScreen';
import SlotsScreen from './view/SlotsScreen';
import LoadingScreen from './view/LoadingScreen';
import RegistrationScreen from './view/RegistrationScreen';

enableScreens();

// Initialize the stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
           <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
           <Stack.Screen name="ProfileStack" component={BottomNavigation} options={{ headerShown: false }} />
           <Stack.Screen name="EditProfile" component={EditProfile} />
           <Stack.Screen name="StackSearch" component={SearchScreen} />
           <Stack.Screen name="SlotsScreen" component={SlotsScreen} />
           <Stack.Screen name="Loading" component={LoadingScreen} />
           <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
          {/* Other screens can be added here */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// Add your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

