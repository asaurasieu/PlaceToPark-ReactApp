import React, { useState } from 'react';
import { View, TextInput, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';

const localImage = require('../assets/ciervos.jpg');

const SearchScreen = () => {
    const navigation = useNavigation();
    const [locationName, setLocationName] = useState('');
    const [showImage, setShowImage] = useState(false);

    const locationData = {
        name: "Plaza de la Moraleja",
        address: "C. de la Estafeta, 2, 28109 Alcobendas, Madrid",
        imageUri: localImage, // Now using local image
    };

    const onImagePress = () => {
        navigation.navigate('SlotsScreen');
    };

    const onSearch = () => {
        console.log('Searching for:', locationName);
        setShowImage(true);
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.searchSection}>
                <Icon style={styles.searchIcon} name="search" size={20} color="#000" onPress={onSearch} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter location name"
                    onChangeText={setLocationName}
                    value={locationName}
                />
            </View>
            {showImage && (
                <RectButton onPress={onImagePress} style={styles.imageContainer}>
                    <Image
                        source={locationData.imageUri}
                        style={styles.image}
                        onError={(e) => console.log('Error loading image:', e)}
                    />
                    <Text style={styles.text}>{locationData.name}</Text>
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
    },
    header: {
        paddingTop: '10%', // Adjust for status bar height
        paddingBottom: 10,
        backgroundColor: '#f0f0f0', // Adjust the color to match your prototype
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20, // Adjust as needed
        fontWeight: 'bold',
        color: '#000', // Adjust as per your header text color
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0e0e0', // Adjust the color to match your prototype
        borderRadius: 20, // Adjust to match the prototype's search bar border radius
        marginHorizontal: 20, // Adjust as per your prototype's horizontal margin
        marginTop: 20, // Adjust as per your prototype's top margin
        paddingHorizontal: 15, // Adjust for inner spacing
        height: 40,
    },
    searchIcon: {
        padding: 5,
        color: '#000',
    },
    input: {
        flex: 1,
        padding: 0,
        color: '#424242',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
        width: '90%', // Adjust as per your prototype's image width
        alignSelf: 'center',
    },
    image: {
        borderRadius: 10,
        width: '100%',
        height: 200, // Adjust as per your prototype's image height
    },
    text: {
        textAlign: 'center',
        marginTop: 5,
        color: '#000',
    },
    bottomNavigation: {
        // Additional styles if needed
    },
});

export default SearchScreen;
