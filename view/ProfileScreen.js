import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigation = useNavigation();

    // Sample data for recently visited locations
    const recentlyVisited = [
        "Gran Via, 71",
        "Calle de Alcalá, 28",
        "Paseo de la Castellana, 91",
        "Calle de la Princesa, 40",
        "Calle de Serrano, 38"
    ];

    return (
        <GestureHandlerRootView style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Image
                    source={require('../assets/photo5.jpg')}
                    style={styles.coverImage}
                />
                <View style={styles.profileSection}>
                    <Image
                        source={require('../assets/profile.jpg')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>Amanda Richard</Text>
                    <Text style={styles.profession}>Interior designer</Text>
                    <Text style={styles.location}>Madrid, Spain</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>30</Text>
                            <Text style={styles.statLabel}>Active days</Text>
                        </View>
                        <View style={[styles.statItem, { marginLeft: -30 }]}>
                            <Text style={styles.statNumber}>20</Text>
                            <Text style={styles.statLabel}>Friends</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <RectButton style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </RectButton>
                        <RectButton style={[styles.button, styles.buttonOutline]}>
                            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Add Friend</Text>
                        </RectButton>
                    </View>

                    {/* Recently Visited Section */}
                    <View style={styles.recentlyVisitedSection}>
                        <Text style={styles.recentlyVisitedTitle}>Recently Visited</Text>
                        {recentlyVisited.map((location, index) => (
                            <Text key={index} style={styles.recentlyVisitedText}>
                                {location}
                            </Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: { 
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    coverImage: {
        width: '100%',
        height: 200,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: -50,
        width: '100%',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profession: {
        fontSize: 16,
        color: 'gray',
    },
    location: {
        fontSize: 16,
        color: 'gray',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
    },
    statItem: {
        alignItems: 'center',
        marginHorizontal: 120,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 21,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    buttonOutlineText: {
        color: '#007bff',
    },
    recentlyVisitedSection: {
        width: '100%',
        marginTop: 30,
    },
    recentlyVisitedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        marginLeft: 10,
    },
    recentlyVisitedText: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 10,
        marginBottom: 5,
    },
});

export default ProfileScreen;
