import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { REACT_APP_GOOGLE_API_KEY } from '@env'; // Ensure your `.env` is configured properly

import { useData } from '../common/userContext';
import { db } from '../common/firebase';

const localImage = require('../assets/ciervos.jpg');

const SearchScreen = ({ navigation }) => {
    const { userData, setUserData, email } = useData();
    const [locationSearch, setLocationSearch] = useState('');
    const [showImage, setShowImage] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const locationData = {
        address: locationSearch,
        imageUri: localImage,
    };

    const handleSearchSelection = (location) => {
        setLocationSearch(location);

        // Update the user's lastSearch array
        const updatedLastSearch = [location, ...(userData.lastSearch || [])].slice(0, 4);

        const updatedUserData = {
            ...userData,
            lastSearch: updatedLastSearch,
        };

        // Save the updated search history to the database
        db.collection('users')
            .doc(email)
            .set(updatedUserData, { merge: true })
            .then(() => {
                setUserData(updatedUserData);
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to save search: ' + error.message);
            });
    };

    const onImagePress = () => {
        if (!locationSearch) {
            Alert.alert('Error', 'Please select a location first.');
            return;
        }

        navigation.navigate('SlotsScreen');
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.inputContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Search for a location"
                    onPress={(data, details = null) => {
                        handleSearchSelection(data.description);
                        setShowImage(true);
                    }}
                    query={{
                        key: REACT_APP_GOOGLE_API_KEY,
                        language: 'en',
                    }}
                    styles={{
                        textInput: isFocused ? styles.textInputFocused : styles.textInput,
                        container: { flex: 0 },
                        listView: styles.listView,
                    }}
                    textInputProps={{
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                    }}
                />
            </View>
            {showImage && (
                <RectButton onPress={onImagePress} style={styles.imageContainer}>
                    <Image
                        source={locationData.imageUri}
                        style={styles.image}
                        onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                    />
                    <Text style={styles.text}>{locationData.address}</Text>
                </RectButton>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
        alignItems: 'center',
    },
    inputContainer: {
        width: '90%',
        borderRadius: 25,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        paddingLeft: 20,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textInputFocused: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        paddingLeft: 20,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#007BFF',
    },
    listView: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '90%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
});

export default SearchScreen;
