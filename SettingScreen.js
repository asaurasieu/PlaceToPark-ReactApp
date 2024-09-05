import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const settingsOptions = [
    { title: 'Account', icon: 'person' },
    { title: 'Notifications', icon: 'notifications' },
    { title: 'Appearance', icon: 'color-palette' },
    { title: 'Privacy & Security', icon: 'lock-closed' },
    { title: 'Help and Support', icon: 'help' },
    { title: 'Subscription', icon: 'card' },
    { title: 'About', icon: 'information-circle' },

];

const SettingsItem = ({ title, icon }) => (
    <TouchableOpacity style={styles.item}>
        <Ionicons name={icon} size={24} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
        <Ionicons name="chevron-forward" size={24} style={styles.icon} />
    </TouchableOpacity>
);

const SettingScreen = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        // Navigate to the logout screen
        navigation.navigate('LoginPage');
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={settingsOptions}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => <SettingsItem title={item.title} icon={item.icon} />}
                ListFooterComponent={
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    text: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    icon: {
        width: 24,
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
    },
    logoutButtonText: {
        fontSize: 16,
        color: 'red',
    },
});

export default SettingScreen;
