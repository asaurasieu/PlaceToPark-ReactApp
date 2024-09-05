import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

const carLogo = require("./assets/Car.png");

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Get the navigation object
    const navigation = useNavigation();

    // Call this function when login is successful
    const handleLogin = () => {
        // Simulate a login success
        Alert.alert("Login Successful!", "", [
            { text: "OK", onPress: () => navigation.navigate('ProfileStack', { screen: 'Profile' }) }
        ]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <Image source={carLogo} style={styles.image} resizeMode='contain' />
            <Text style={styles.welcome}>WELCOME TO THE NEW ERA OF SMART PARKING</Text>
            <TextInput
                style={styles.input}
                placeholder='Username'
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <Text
                style={styles.forgotPassword}
                onPress={() => Alert.alert("Forget Password!")}
            >
                Forgot password?
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    image: {
        height: 300,
        width: 300,
        marginBottom: 30,
    },
    welcome: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        height: 40,
        width: '40%',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 15,
        color: 'white',
        fontSize: 14,
    },
    forgotPassword: {
        color: 'white',
        marginBottom: 30,
        fontSize: 13,
    },
    button: {
        backgroundColor: 'red',
        width: '70%',
        alignItems: 'center',
        padding: 9,
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
