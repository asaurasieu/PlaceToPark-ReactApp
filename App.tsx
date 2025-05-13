import React from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from './view/LoginPage';
import BottomNavigation from './view/BottomNavigation';
import EditProfile from './view/EditProfile';
import SearchScreen from './view/SearchScreen';
import SlotsScreen from './view/SlotsScreen';
import RegistrationScreen from './view/RegistrationScreen';
import MapScreen from './view/MapScreen';
import {DataProvider} from './common/userContext';
import 'react-native-get-random-values';

enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <DataProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginPage">
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BottomNavigation"
              component={BottomNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="StackSearch"
              component={SearchScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SlotsScreen"
              component={SlotsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MapScreen"
              component={MapScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="RegistrationScreen"
              component={RegistrationScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0D6E0',
  },
});
