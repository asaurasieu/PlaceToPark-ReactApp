import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, PermissionsAndroid, Image, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useData } from '../common/userContext';
import { db } from '../common/firebase';
import moment from 'moment';

const EditProfile = ({ navigation }) => {
    const { userData, setUserData, email } = useData();
    const [name, setName] = useState(userData?.name || '');
    const [profession, setProfession] = useState(userData?.profession || '');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [location, setLocation] = useState(userData?.location || '');
    const [rutaFoto, setRutaFoto] = useState(null);

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
                Alert.alert('User Updated', 'Successful!');
                setUserData(updatedUser);
                navigation.navigate('BottomNavigation');
            })
            .catch((error) => {
                Alert.alert('Save Error', 'Failed to save profile: ' + error.message);
            });
    };

    const requestCameraPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: 'Camera Permission',
                message: 'We need your permission to use the camera.'
            });
            console.log('Camera permission:', granted);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log(err);
            Alert.alert('ERROR', err.message);
            return false;
        }
    };

    const requestStoragePermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'Storage Permission',
                message: 'We need your permission to write to external storage.'
            });
            console.log('Storage permission:', granted);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log(err);
            Alert.alert('ERROR', err.message);
        }
        return false;
    };

    const captureImage = async () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 150,
            maxHeight: 150,
            quality: 1,
            saveToPhotos: true
        };
        let isCameraPermitted = await requestCameraPermissions();
        let isStoragePermitted = await requestStoragePermissions();

        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options)
                .then((response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image capture.');
                        return;
                    } else if (response.errorCode == 'camera_unavailable') {
                        Alert.alert('ERROR', 'Camera not available.');
                        return;
                    } else if (response.errorCode == 'permission') {
                        Alert.alert('ERROR', 'Permission not granted.');
                        return;
                    } else if (response.errorCode == 'others') {
                        Alert.alert('ERROR', response.errorMessage);
                        return;
                    }
                    console.log('Capture response:', JSON.stringify(response.assets[0]));
                    setRutaFoto({ ...response.assets[0] });
                })
                .catch((error) => {
                    console.log('Capture error:', error);
                });
        } else {
            console.log('PROFILE FORM: Permissions not granted.');
        }
    };

    const pickImageFromLibrary = async () => {
        let options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options)
            .then((response) => {
                if (response.didCancel) {
                    console.log('User cancelled image selection.');
                    return;
                }
                if (response.errorCode) {
                    console.error(`Error: ${response.errorMessage}`);
                    Alert.alert('Error', response.errorMessage);
                    return;
                }
                console.log('Image selected:', response.assets[0]);
                setRutaFoto(response.assets[0]);
            })
            .catch((error) => {
                console.error('Error selecting image:', error);
            });
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.profileSection}>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Profile Picture',
                        'Choose an option',
                        [
                            { text: 'Camera', onPress: () => captureImage() },
                            { text: 'Gallery', onPress: () => pickImageFromLibrary() },
                            { text: 'Cancel', style: 'cancel' }
                        ]
                    );
                }}>
                    <Image
                        source={rutaFoto ? { uri: rutaFoto.uri } : require('../assets/profile.jpg')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>
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
                    androidVariant="nativeAndroid"
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
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#007bff',
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
    saveButtonContainer: {
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default EditProfile;
