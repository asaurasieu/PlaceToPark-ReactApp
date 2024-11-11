import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { db } from '../common/firebase';
import { useData } from '../common/userContext';

const carLogo = require('../assets/Car.png');

export default function LoginPage({ navigation }) {
    const [password, setPassword] = useState('smile123');
    const { setUserData, email, setEmail } = useData();

    // Call this function when login is successful
    const handleLogin = () => {
        if (email === '' || password === '') {
            Alert.alert('Error, please enter your email and password.');
            return;
        }

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(async userCredential => {
                console.log('User logged in: ', userCredential.user);
                console.log('Email logged in: ', email);
                const userDocRef = db.collection('users').doc(email);
                const userDoc = await userDocRef.get();
                if (userDoc.exists) {
                    setUserData(userDoc.data());
                    navigation.navigate('BottomNavigation');
                } else {
                    console.log('No user found, redirecting to EditProfile');
                    navigation.navigate('EditProfile');
                }
            })
            .catch(error => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'That email address is invalid!';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'There is no user corresponding to this email.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'The password is incorrect.';
                        break;
                    default:
                        errorMessage = error.message;
                }
                Alert.alert('Login Failed', errorMessage);
            });
    };

    const handleForgotPassword = () => {
        if (email === '') {
            Alert.alert('Please enter your email address to reset your password.');
            return;
        }

        auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert('Password reset email sent!', 'Please check your email.', [
                    { text: 'OK', onPress: () => navigation.navigate('LoginPage') },
                ]);
            })
            .catch(error => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'That email address is invalid!';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'There is no user corresponding to this email.';
                        break;
                    default:
                        errorMessage = error.message;
                }
                Alert.alert('Password Reset Failed', errorMessage);
            });
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />
            <Image source={carLogo} style={styles.image} resizeMode="contain" />
            <Text style={styles.welcome}>WELCOME TO THE NEW ERA OF SMART PARKING</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <RectButton
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>LOGIN</Text>
            </RectButton>
            <Text
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
            >
                Forgot password?
            </Text>
            <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('RegistrationScreen')}
            >
                Don't have an account? Sign Up
            </Text>
        </GestureHandlerRootView>
    );
}

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
    signUpLink: {
        color: 'white',
        marginTop: 15,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
