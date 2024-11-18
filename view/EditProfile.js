import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';

//import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useData } from '../common/userContext';
import { db } from '../common/firebase';
import moment from 'moment';

const EditProfile = ({ navigation }) => {
    const { userData, setUserData, email } = useData();
    const [name, setName] = useState(userData?.name || '');
    const [profession, setProfession] = useState(userData?.profession || '');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [location, setLocation] = useState(userData?.location || '');

    const verificationAge = (date) => {
        const today = moment();
        const momentDate = moment(date);
        const age = today.diff(momentDate, 'years');
        return age >= 18;
    };


    const save = () => {
        if (name === '' || profession === '' || location === '') {
            Alert.alert('Error', 'Please enter all fields.');
            return;
        }
        if (!verificationAge(dateOfBirth)) {
            Alert.alert('Error', 'You must be 18 years old or older to use this app.');
            return;
        }

        const updatedUser = {
            name,
            profession,
            dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
            location,
            lastSearch: userData?.lastSearch || [],
            created: userData?.created || new Date(),
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
                <DatePicker
                    date={dateOfBirth}
                    mode="date"
                    onDateChange={setDateOfBirth}
                    textColor="black"
                    androidVariant="nativeAndroid" // Optimized for native Android look
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
