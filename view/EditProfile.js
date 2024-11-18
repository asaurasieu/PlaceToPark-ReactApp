import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
//import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useData } from '../common/userContext';
import { db } from '../common/firebase';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const EditProfile = ({ navigation }) => {
    const { userData, setUserData, email } = useData();
    const [name, setName] = useState(userData?.name || '');
    const [profession, setProfession] = useState(userData?.profession || '');
    const [dateOfBirth, setDateOfBirth] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [location, setLocation] = useState(userData?.location || '');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

    const verificationAge = (date) => {
        const today = moment();
        const momentDate = moment(date, 'YYYY-MM-DD');
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
            dateOfBirth,
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
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Year</Text>
                    <Picker
                        selectedValue={selectedYear}
                        onValueChange={(itemValue) => {
                            setSelectedYear(itemValue);
                            const firstDayOfYear = `${itemValue}-01-01`;
                            setDateOfBirth(firstDayOfYear); // Set default date as Jan 1 of the selected year
                        }}
                        style={styles.picker}
                    >
                        {years.map((year) => (
                            <Picker.Item key={year} label={year.toString()} value={year} />
                        ))}
                    </Picker>
                </View>
                <Calendar
                    current={`${selectedYear}-01-01`}
                    onDayPress={(day) => setDateOfBirth(day.dateString)}
                    markedDates={{
                        [dateOfBirth]: { selected: true, selectedColor: '#007bff' },
                    }}
                    style={styles.calendar}
                    theme={{
                        textDayFontSize: 12,
                        textMonthFontSize: 14,
                        textDayHeaderFontSize: 12,
                    }}
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
    pickerContainer: {
        marginVertical: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    calendar: {
        borderRadius: 10,
        marginTop: 10,
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
