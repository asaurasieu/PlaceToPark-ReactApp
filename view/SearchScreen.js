import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  RectButton,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {REACT_APP_GOOGLE_API_KEY} from '@env';
import {useData} from '../common/userContext';
import {db} from '../common/firebase';

const SearchScreen = ({navigation}) => {
  const {userData, setUserData, email, setSelectedParking} = useData();
  const [nearestAreas, setNearestAreas] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParkingAreas = async () => {
    try {
      const snapshot = await db.collection('parking_areas').get();
      return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch parking areas: ' + error.message);
      return [];
    }
  };

  const handleSearchSelection = async (location, description) => {
    console.log(location);

    const duplicated =
      userData.lastSearch && userData.lastSearch.includes(description);
    if (!duplicated) {
      const updatedLastSearch = [
        description,
        ...(userData.lastSearch || []),
      ].slice(0, 4);

      const updatedUserData = {
        ...userData,
        lastSearch: updatedLastSearch,
      };
      try {
        await db
          .collection('users')
          .doc(email)
          .set(updatedUserData, {merge: true});
        setUserData(updatedUserData);
      } catch (error) {
        Alert.alert('Error', 'Failed to save search: ' + error.message);
      }
    }

    setIsLoading(true);
    try {
      const parkingAreas = await fetchParkingAreas();
      const origin = `${location.lat},${location.lng}`;

      // Add the hardcoded first location
      const hardcodedLocation = {
        distance: 1,
        area: {
          id: '3',
          area: 'PALACIO',
          color: 'Verde',
          street: 'AGUAS, CALLE, DE LAS',
          number: 2,
          spots_number: 7,
          lat: 40.4105234455,
          lng: -3.7119558166,
        },
      };

      // Process remaining parking areas in batches of 10
      const batchSize = 10;
      let allDistances = [hardcodedLocation];

      for (let i = 0; i < parkingAreas.length; i += batchSize) {
        const batch = parkingAreas.slice(i, i + batchSize);
        const batchDistances = await fetchDistances(origin, batch);
        allDistances = [...allDistances, ...batchDistances];

        // Update UI with current results
        const currentNearest = allDistances
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);
        setNearestAreas(currentNearest);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate distances: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistances = async (origin, destinations) => {
    const destinationString = destinations
      .map(loc => `${loc.lat},${loc.lng}`)
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinationString}&key=${REACT_APP_GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.rows[0].elements.map((el, index) => ({
          distance: el.distance.value,
          area: destinations[index],
        }));
      } else {
        console.warn('Failed to fetch distances:', data.error_message);
        return [];
      }
    } catch (error) {
      console.warn(
        'Failed to connect to Google Distance Matrix:',
        error.message,
      );
      return [];
    }
  };

  const formatDistance = distance => {
    return distance < 1000
      ? `${distance} m`
      : `${(distance / 1000).toFixed(2)} km`;
  };

  const handleItemPress = item => {
    setSelectedParking(item);
    navigation.navigate('SlotsScreen');
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#52677D" />
          <Text style={styles.loadingText}>
            Finding nearest parking spots...
          </Text>
        </View>
      )}
      {nearestAreas.length > 0 && (
        <FlatList
          data={nearestAreas}
          keyExtractor={(item, index) => `${item.area.id || index}`}
          renderItem={({item}) => (
            <View style={styles.resultItem}>
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <Text style={styles.resultText}>
                  {item.area.street} {item.area.number}
                </Text>
                <Text style={styles.resultText}>
                  Distance: {formatDistance(item.distance)}
                </Text>
                <Text style={styles.resultText}>Color: {item.area.color}</Text>
                <Text style={styles.resultText}>Area: {item.area.area}</Text>
                <Text style={styles.resultText}>
                  Spots: {item.area.spots_number}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#D0D6E0',
    paddingTop: 60,
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    borderRadius: 25,
    backgroundColor: '#52677D',
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
    backgroundColor: '#F5F5F5',
    paddingLeft: 20,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#52677D',
    borderWidth: 1,
    borderColor: '#D7D3CC',
  },
  textInputFocused: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingLeft: 20,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#000',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  listView: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#F5F5F5',
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
    fontFamily: 'Roboto',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#52677D',
    fontFamily: 'Roboto',
  },
});

export default SearchScreen;
