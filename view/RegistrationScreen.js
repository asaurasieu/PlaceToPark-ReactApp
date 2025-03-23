import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const RegistrationScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('User account created & signed in:', user);
        Alert.alert('Success', 'Your account has been created successfully!', [
          {text: 'OK', onPress: () => navigation.navigate('LoginPage')},
        ]);
      })
      .catch(error => {
        let errorMessage;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'This email is invalid.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak.';
            break;
          default:
            errorMessage = error.message;
        }
        setErrorMessage(errorMessage);
      });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        style={styles.textInput}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        autoCapitalize="none"
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Sign Up" color="#0F1A2B" onPress={handleSignUp} />

      <View style={styles.loginContainer}>
        <Text>
          Already have an account?{' '}
          <Text
            onPress={() => navigation.navigate('LoginPage')}
            style={styles.loginText}>
            Login
          </Text>
        </Text>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8DEE8',
  },
  title: {
    color: '#0F1A2B',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    fontSize: 16,
    width: '90%',
    borderColor: '#0F1A2B',
    borderBottomWidth: 1,
    marginVertical: 15,
    paddingHorizontal: 8,
  },
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    color: '#0F1A2B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
