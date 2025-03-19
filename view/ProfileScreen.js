import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView, RectButton} from 'react-native-gesture-handler';
import {useData} from '../common/userContext';
import {Icon} from 'react-native-eva-icons';

const ProfileScreen = ({navigation}) => {
  const {userData} = useData();
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {userData?.coverImage ? (
          <Image
            source={{uri: userData.coverImage}}
            style={styles.coverImage}
          />
        ) : (
          <Image
            source={require('../assets/photo5.jpg')}
            style={styles.coverImage}
          />
        )}

        <View style={styles.profileSection}>
          {userData?.profileImage ? (
            <Image
              source={{uri: userData.profileImage}}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require('../assets/profile.jpg')}
              style={styles.profileImage}
            />
          )}

          <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
            <Icon
              name={isFollowing ? 'person-done-outline' : 'person-add-outline'}
              fill="#fff"
              width={24}
              height={24}
            />
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>

          <View style={styles.rowContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30</Text>
              <Text style={styles.statLabel}>Active days</Text>
            </View>

            <View style={styles.profileTextContainer}>
              <Text style={styles.name}>
                {userData.name || 'No Name Available'}
              </Text>
              <Text style={styles.profession}>
                {userData.profession || 'Profession not set'}
              </Text>
              <Text style={styles.location}>
                {userData.location || 'Location not set'}
              </Text>
              <Text style={styles.location}>
                {userData.dateOfBirth || 'Date of birth not set'}
              </Text>
            </View>

            <RectButton
              style={styles.button}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </RectButton>
          </View>

          <View style={styles.divider} />

          <View style={styles.recentlyVisitedSection}>
            <Text style={styles.recentlyVisitedTitle}>Recently Visited</Text>
            {userData?.lastSearch && userData.lastSearch.length > 0 ? (
              userData.lastSearch.map((location, index) => (
                <Text key={index} style={styles.recentlyVisitedText}>
                  {location}
                </Text>
              ))
            ) : (
              <Text style={styles.recentlyVisitedText}>
                No recent locations
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0D6E0',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
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
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2E4A',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginTop: 15,
  },
  followButtonText: {
    color: '#BDC4D4',
    fontSize: 13,
    marginLeft: 5,
  },
  profileImage: {
    width: 109,
    height: 110,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#1C2E4A',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#1C2E4A',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#BDC4D4',
    fontSize: 13,
  },
  profileTextContainer: {
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F1A2B',
  },
  profession: {
    fontSize: 16,
    color: '#1C2E4A',
  },
  location: {
    fontSize: 16,
    color: '#1C2E4A',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F1A2B',
  },
  statLabel: {
    fontSize: 14,
    color: '#1C2E4A',
  },
  divider: {
    width: '90%',
    height: 2,
    backgroundColor: '#52677D',
    marginVertical: 9,
  },
  recentlyVisitedSection: {
    width: '100%',
    marginTop: '9%',
  },
  recentlyVisitedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 16,
    marginLeft: 10,
  },
  recentlyVisitedText: {
    fontSize: 16,
    color: '#1C2E4A',
    marginLeft: 10,
    marginBottom: 20,
  },
});

export default ProfileScreen;
