import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  GestureHandlerRootView,
  RectButton,
  ScrollView,
} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {useData} from '../common/userContext';
import {db} from '../common/firebase';
import moment from 'moment';
import {Icon} from 'react-native-eva-icons';

const EditProfile = ({navigation}) => {
  const {userData, setUserData, email} = useData();
  const [name, setName] = useState(userData?.name || '');
  const [profession, setProfession] = useState(userData?.profession || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    userData?.dateOfBirth ? new Date(userData.dateOfBirth) : new Date(),
  );
  const [location, setLocation] = useState(userData?.location || '');
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || null,
  );
  const [coverImage, setCoverImage] = useState(userData?.coverImage || null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState(email || '');

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
      email: emailAddress,
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
    return <Text>Loading...</Text>;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" fill="#fff" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileRow}>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image
                  source={{uri: profileImage}}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>Select Image</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={() => selectImage(setProfileImage)}>
                <Icon name="edit-outline" fill="#fff" width={20} height={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backgroundProfileButton}
              onPress={() => selectImage(setCoverImage)}>
              <Text style={styles.backgroundProfileText}>
                Background Profile
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of birth</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setDatePickerOpen(true)}>
                <Text style={styles.dateText}>
                  {moment(dateOfBirth).format('DD/MM/YYYY')}
                </Text>
                <Icon
                  name="calendar-outline"
                  fill="#666"
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
              <DatePicker
                modal
                open={datePickerOpen}
                date={dateOfBirth}
                mode="date"
                onConfirm={date => {
                  setDatePickerOpen(false);
                  setDateOfBirth(date);
                }}
                onCancel={() => {
                  setDatePickerOpen(false);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  onChangeText={setEmailAddress}
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  editable={true}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profession</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProfession}
                value={profession}
                placeholder="Enter your profession"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                onChangeText={setLocation}
                value={location}
                placeholder="Enter your location"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <RectButton style={styles.saveButton} onPress={save}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </RectButton>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A2B',
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginLeft: 30,
    marginBottom: 24,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0F1A2B',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D0D6E0',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 109,
    height: 110,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#D0D6E0',
  },
  backgroundProfileButton: {
    marginTop: 10,
    backgroundColor: '#1C2E4A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backgroundProfileText: {
    color: '#D0D6E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D0D6E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#D0D6E0',
    fontSize: 14,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#D0D6E0',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formContainer: {
    backgroundColor: '#D0D6E0',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#0F1A2B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F1A2B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#F5F5F5',
  },
  dateInput: {
    backgroundColor: '#0F1A2B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#F5F5F5',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1A2B',
    borderRadius: 10,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
  },
  saveButton: {
    backgroundColor: '#D0D6E0',
    width: '70%',
    paddingVertical: 16,
    borderRadius: 10,
    marginLeft: '16%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#0F1A2B',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default EditProfile;
