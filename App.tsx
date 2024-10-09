import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {db} from './common/firebase';
import {collection, doc, getDocs, setDoc} from 'firebase/firestore/lite';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './view/LoginPage';

// Initialize the stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        {/* ... other routes ... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



