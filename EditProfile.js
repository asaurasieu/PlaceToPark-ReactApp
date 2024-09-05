import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';

const EditProfile = () => {
    const [name, setName] = useState('Amanda Richard');
    const [email, setEmail] = useState('ARichardson90@gmail.com');
    const [password, setPassword] = useState('********');
    const [dateOfBirth, setDateOfBirth] = useState('01/01/1990');


    const onProfileImagePress = () => {
        console.log('Profile image pressed!');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onProfileImagePress} style={styles.profileImageContainer}>
                <Image
                    source={require('./assets/profile.jpg')}
                    style={styles.profileImage}
                />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setDateOfBirth}
                    value={dateOfBirth}
                />
            </View>
        </View>
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
    cameraIcon: {
        position: 'absolute',
        right: 10,
        bottom: 10,

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
});

export default EditProfile;
