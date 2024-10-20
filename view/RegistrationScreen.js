/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

export default class RegistrationScreen extends React.Component {
  state = { email: '', password: '', errorMessage: null };

  handleSignUp = () => {
    const { email, password } = this.state;

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('User account created & signed in: ', user);
        Alert.alert(
          'Success',
          'Your account has been created successfully!',
        [
           { text: 'OK', onPress: () => this.props.navigation.navigate('LoginPage') },
        ]
      );
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
        this.setState({ errorMessage });
      });
  };

  render() {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Text style={{ color: '#0000FF', fontSize: 30 }}>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" color="#0000FF" onPress={this.handleSignUp} />
        <View>
          <Text>
            Already have an account?{' '}
            <Text
              onPress={() => this.props.navigation.navigate('Login')}
              style={{ color: '#e93766', fontSize: 16 }}
            >
              Login
            </Text>
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 50,
    fontSize: 16,
    width: '90%',
    borderColor: '#9b9b9b',
    borderBottomWidth: 1,
    marginTop: 8,
    marginVertical: 15,
  },
});
