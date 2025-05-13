import React, {useState} from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {GestureHandlerRootView, RectButton} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {db} from '../common/firebase';
import {useData} from '../common/userContext';

const carLogo = require('../assets/ptpLogo.png');

export default function LoginPage({navigation}) {
  const [password, setPassword] = useState('smile123');
  const {setUserData, email, setEmail} = useData();

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
          console.log(userDoc.data());
          navigation.navigate('BottomNavigation');
        } else {
          console.log('No user found, redirecting to EditProfile');
          navigation.navigate('EditProfile');
        }
      })
      .catch(error => {
        console.log(1);
        let errorMessage;
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'That email address is invalid!';
            console.log('Current email:', email);
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
        console.log(2);
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
          {text: 'OK', onPress: () => navigation.navigate('LoginPage')},
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
      <Text style={styles.slogan}>The New Era of Smart Parking</Text>
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
      <RectButton style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </RectButton>
      <Text
        style={styles.forgotPassword}
        onPress={() => {
          console.log('Forgot Password pressed');
          handleForgotPassword();
        }}>
        Forgot password?
      </Text>
      <Text
        style={styles.signUpLink}
        onPress={() => navigation.navigate('RegistrationScreen')}>
        Don't have an account? Sign Up
      </Text>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A2B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  image: {
    height: 300,
    width: 300,
    marginLeft: 40,
    marginTop: -30,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 20,
    fontFamily: 'Roboto',
    color: '#D0D6E0',
    textAlign: 'center',
    marginTop: -45,
    marginBottom: 60,
  },
  input: {
    height: 40,
    width: '70%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1.5,
    marginBottom: 25,
    color: '#D0D6E0',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  forgotPassword: {
    color: '#D0D6E0',
    marginBottom: 80,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  button: {
    backgroundColor: '#D0D6E0',
    width: '50%',
    alignItems: 'center',
    padding: 9,
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: '#0F1A2B',
    fontSize: 17,
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  signUpLink: {
    color: '#D0D6E0',
    marginTop: 1,
    fontSize: 16,
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
  },
});
