import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import db from '@react-native-firebase/firestore';


const EditProfile = ({ navigation, route }) => {
    const [name, setName] = useState('Amanda Richard');
    const [dateOfBirth, setDateOfBirth] = useState('01/01/1990');
    const onProfileImagePress = () => {
        console.log('Profile image pressed!');
    };

    const save = () => {
        let user = {
            name: name,
            // foto: rutaFoto.uri !== '' ? email + '_image' : '',
        };
        db()
            .collection('users').doc(route.params.email).set(user).then(() => {
                Alert.alert('User Updated', 'Sucessfull!');
            }).catch((error) => {
                Alert.alert('Registration', 'Error: ' + error);
            });
    };
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <RectButton onPress={onProfileImagePress} style={styles.profileImageContainer}>
                    <Image
                        source={require('../assets/profile.jpg')}
                        style={styles.profileImage}
                    />
                </RectButton>

            </View>
            <View style={styles.container}>
                <RectButton onPress={save} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </RectButton>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setDateOfBirth}
                    value={dateOfBirth}
                />
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    inputContainer: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        fontSize: 16,
        padding: 10,
    },
});

export default EditProfile;
