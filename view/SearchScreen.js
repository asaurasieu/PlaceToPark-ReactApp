import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, FlatList} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {REACT_APP_GOOGLE_API_KEY} from '@env'; // Ensure your `.env` is configured properly
import {useData} from '../common/userContext';
import {db} from '../common/firebase';

const SearchScreen = ({navigation}) => {
  const {userData, setUserData, email} = useData();
  const [nearestAreas, setNearestAreas] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchSelection = async (location, description) => {
    console.log(location);

    // Update the user's lastSearch array
    const updatedLastSearch = [
      description,
      ...(userData.lastSearch || []),
    ].slice(0, 4);

    const updatedUserData = {
      ...userData,
      lastSearch: updatedLastSearch,
    };

    // Save the updated search history to the database
    try {
      await db
        .collection('users')
        .doc(email)
        .set(updatedUserData, {merge: true});
      setUserData(updatedUserData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save search: ' + error.message);
    }

    // Fetch parking data and calculate distances
    try {
      const parkingAreas = await fetchParkingAreas();
      const origin = `${location.lat},${location.lng}`;
      const distances = await fetchDistances(origin, parkingAreas);
      console.log(distances);

      const nearest = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      nearest.unshift({area: {barrio: "04-01 RECOLETOS", bateria_linea: "Batería", calle: "CASTELLO, CALLE, DE", "color": "077214010 Verde", "distrito": "04  SALAMANCA", "id": "1001", "latitude": 40.428568305, "longitude": -3.681224762, "num_finca": 63, "num_plazas": 21})
      setNearestAreas(nearest);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate distances: ' + error.message);
    }
  };

  const fetchParkingAreas = async () => {
    try {
      const snapshot = await db.collection('parking_areas').get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch parking areas: ' + error.message);
      return [];
    }
  };

  const fetchDistances = async (origin, destinations) => {
    const destinationString = destinations
      .slice(0, 10)
      .map(loc => `${loc.latitude},${loc.longitude}`)
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinationString}&key=${REACT_APP_GOOGLE_API_KEY}`;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(response);
      if (data.status === 'OK') {
        return data.rows[0].elements.map((el, index) => ({
          distance: el.distance.value, // Distance in meters
          area: destinations[index],
        }));
      } else {
        Alert.alert(
          'Error',
          'Failed to fetch distances: ' + data.error_message,
        );
        return [];
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to connect to Google Distance Matrix: ' + error.message,
      );
      return [];
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          onPress={(data, details = null) => {
            if (details && details.geometry) {
              const location = details.geometry.location;
              handleSearchSelection(location, data.description);
            }
          }}
          query={{
            key: REACT_APP_GOOGLE_API_KEY,
            language: 'en',
          }}
          styles={{
            textInput: isFocused ? styles.textInputFocused : styles.textInput,
            container: {flex: 0},
            listView: styles.listView,
          }}
          textInputProps={{
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
          }}
          fetchDetails={true}
        />
      </View>
      {nearestAreas.length > 0 && (
        <FlatList
          data={nearestAreas}
          keyExtractor={item => item.area.id}
          renderItem={({item}) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>
                {item.area.calle} ({item.area.distrito})
              </Text>
              <Text style={styles.resultText}>
                Distance: {(item.distance / 1000).toFixed(2)} km
              </Text>
              <Text style={styles.resultText}>
                Spaces: {item.area.num_plazas}
              </Text>
            </View>
          )}
        />
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
    shadowOffset: {width: 0, height: 4},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  resultItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchScreen;
