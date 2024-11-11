import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
//import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useData } from '../common/userContext';
import { db } from '../common/firebase';

const EditProfile = ({ navigation }) => {
    const { userData, setUserData, email } = useData();
    const [name, setName] = useState(userData?.name || '');
    const [profession, setProfession] = useState(userData?.profession || '');
    const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth || '');
    const [location, setLocation] = useState(userData?.location || '');

    const save = () => {
        if (!userData) {
            console.error('No userData available');
            return;
        }

        const updatedUser = {
            name,
            profession,
            dateOfBirth,
            location,
            lastSearch: [],
        };

        console.log('User data to save:', updatedUser);

        db.collection('users')
            .doc(email)
            .set(updatedUser, { merge: true })
            .then(() => {
                Alert.alert('User Updated', 'Sucessfull!');
                setUserData(updatedUser);
                navigation.navigate('BottomNavigation');
            })
            .catch((error) => {
                Alert.alert('Save Error', 'Failed to save profile: ' + error.message);
            });
    };

    if (!userData) {
        return <Text>Loading...</Text>; // Display loading state if userData is null
    }

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
