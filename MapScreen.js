import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const MapScreen = () => {
    // Define your parking spot coordinate here
    const parkingSpot = {
        latitude: 40.51551,
        longitude: -3.65141,
        title: 'Parking Spot',
        description: 'Convenient parking spot in Madrid',
        distance: '600m',
        spaces: 80,
        goodToKnow: [
            'Outdoor Parking',
            'Parking Restrictions',
            'Contactless Payments',
        ],
    };

    const handlePressNavigate = () => {
        console.log('Navigation button pressed!');
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: parkingSpot.latitude,
                    longitude: parkingSpot.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                <Marker coordinate={{ latitude: parkingSpot.latitude, longitude: parkingSpot.longitude }}>
                    <Callout style={styles.callout}>
                        <View>
                            <Text style={styles.title}>Saba Parking Garage</Text>
                            {/* Displaying the parking information */}
                            <Text>Open 24h</Text>
                            <Text>Distance: {parkingSpot.distance}</Text>
                            <Text>Spaces: {parkingSpot.spaces}</Text>
                            <View style={styles.separator} />
                            <Text>Good to Know:</Text>
                            {parkingSpot.goodToKnow.map((item, index) => (
                                <Text key={index} style={styles.goodToKnowItem}>{item}</Text>
                            ))}
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.navigateButton} onPress={handlePressNavigate}>
                                <Text style={styles.navigateButtonText}>Navigate ({parkingSpot.distance})</Text>
                            </TouchableOpacity>
                        </View>
                    </Callout>
                </Marker>
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    callout: {
        width: 200,
        padding: 10,
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    navigateButton: {
        marginTop: 10,
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    navigateButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});
export default MapScreen;