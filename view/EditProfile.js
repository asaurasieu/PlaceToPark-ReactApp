import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
//import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { db } from '../common/firebase.js';


const EditProfile = ({ navigation, route }) => {
    const { email } = route.params;
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await db.collection('users').doc(email).get();
                if (userDoc.exists) {
                    const data = userDoc.data();
                    setName(data.name || '');
                    setProfession(data.profession || '');
                    setDateOfBirth(data.dateOfBirth || '');
                    setLocation(data.location || '');
                } else {
                    console.warn('No such user found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [email]);

    const save = () => {
        const user = {
            name: name || 'Unknown',
            profession: profession || 'Not specified',
            dateOfBirth: dateOfBirth || 'Not provided',
            location: location || 'Unknown',
            // foto: rutaFoto.uri !== '' ? email + '_image' : '',
        };

        console.log('User data to save:', user);

        db.collection('users')
            .doc(email)
            .set(user, { merge: true })
            .then(() => {
                Alert.alert('User Updated', 'Sucessfull!');
                navigation.navigate('ProfileStack', { email: email });
            })
            .catch((error) => {
                Alert.alert('Save Error', 'Failed to save profile: ' + error.message);
            });
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Enter your name"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Profession</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setProfession}
                    value={profession}
                    placeholder="Enter your profession"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setDateOfBirth}
                    value={dateOfBirth}
                    placeholder="Enter your birth date"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setLocation}
                    value={location}
                    placeholder="Enter your location"
                />
            </View>
            <View style={styles.saveButtonContainer}>
                <RectButton onPress={save} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </RectButton>
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
    saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default EditProfile;
