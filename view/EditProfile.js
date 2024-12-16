import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  GestureHandlerRootView,
  RectButton,
  ScrollView,
} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker'; // Import image picker
import {useData} from '../common/userContext';
import {db} from '../common/firebase';
import moment from 'moment';

const EditProfile = ({navigation}) => {
  const {userData, setUserData, email} = useData();
  const [name, setName] = useState(userData?.name || '');
  const [profession, setProfession] = useState(userData?.profession || '');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [location, setLocation] = useState(userData?.location || '');
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || null,
  );
  const [coverImage, setCoverImage] = useState(userData?.coverImage || null);

  const verificationAge = date => {
    const today = moment();
    const momentDate = moment(date);
    const age = today.diff(momentDate, 'years');
    return age >= 18;
  };

  const selectImage = async setter => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
    });
    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setter(imageUri);
    }
  };

  const save = () => {
    if (name === '' || profession === '' || location === '') {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }
    if (!verificationAge(dateOfBirth)) {
      Alert.alert(
        'Error',
        'You must be 18 years old or older to use this app.',
      );
      return;
    }

    const updatedUser = {
      name,
      profession,
      dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
      location,
      profileImage,
      coverImage,
      lastSearch: userData?.lastSearch || [],
      created: userData?.created || new Date(),
    };

    console.log('User data to save:', updatedUser);

    db.collection('users')
      .doc(email)
      .set(updatedUser, {merge: true})
      .then(() => {
        Alert.alert('User Updated', 'Sucessfull!');
        setUserData(updatedUser);
        navigation.navigate('BottomNavigation');
      })
      .catch(error => {
        Alert.alert('Save Error', 'Failed to save profile: ' + error.message);
      });
  };

  if (!userData) {
    return <Text>Loading...</Text>; // Display loading state if userData is null
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={() => selectImage(setCoverImage)}>
          {coverImage ? (
            <Image source={{uri: coverImage}} style={styles.coverImage} />
          ) : (
            <View style={styles.placeholderCoverImage}>
              <Text style={styles.placeholderText}>Select Cover Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={selectImage}>
            {profileImage ? (
              <Image source={{uri: profileImage}} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Select Image</Text>
              </View>
            )}
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
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20, // Ensures bottom spacing for visibility
  },
  placeholderCoverImage: {
    height: 200,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
  },
  inputContainer: {
    marginHorizontal: 20,
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
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Add subtle shadow effect
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfile;
