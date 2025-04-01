import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  RectButton,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {REACT_APP_GOOGLE_API_KEY} from '@env';
import {useData} from '../common/userContext';
import {db} from '../common/firebase';
import {fonts} from '../common/styles';

const SearchScreen = ({navigation}) => {
  const {userData, setUserData, email, setSelectedParking} = useData();
  const [nearestAreas, setNearestAreas] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

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
    try {
      const parkingAreas = await fetchParkingAreas();
      const origin = `${location.lat},${location.lng}`;
      const distances = await fetchDistances(origin, parkingAreas);

      const nearest = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      nearest.unshift({
        distance: 1,
        area: {
          barrio: '05-06 CASTILLA',
          bateria_linea: 'Batería',
          calle: 'CASTELLANA, PASEO, DE LA',
          color: '043000255 Azul',
          distrito: '05 CHAMARTÍN',
          id: '3',
          lat: 40.4705966308,
          lng: -3.6877971995,
          num_plazas: 26,
        },
      });
      setNearestAreas(nearest);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate distances: ' + error.message);
    }
  };

  const fetchDistances = async (origin, destinations) => {
    const destinationString = destinations
      .slice(0, 10)
      .map(loc => `${loc.lat},${loc.lng}`)
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinationString}&key=${REACT_APP_GOOGLE_API_KEY}`;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.rows[0].elements.map((el, index) => ({
          distance: el.distance.value,
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
      {nearestAreas.length > 0 && (
        <FlatList
          data={nearestAreas}
          keyExtractor={(item, index) => `${item.area.id || index}`}
          renderItem={({item}) => (
            <View style={styles.resultItem}>
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <Text style={styles.resultText}>
                  {item.area.calle} {item.area.num_finca}
                </Text>
                <Text style={styles.resultText}>
                  Distance: {formatDistance(item.distance)}
                </Text>
                <Text style={styles.resultText}>Color: {item.area.color}</Text>
                <Text style={styles.resultText}>
                  Type: {item.area.bateria_linea}
                </Text>
                <Text style={styles.resultText}>
                  Spaces: {item.area.num_plazas}
                </Text>
                <Text style={styles.resultText}>
                  District = {item.area.distrito}
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
    fontSize: fonts.size.medium,
    fontFamily: fonts.regular,
    color: '#52677D',
    borderWidth: 1,
    borderColor: '#D7D3CC',
  },
  textInputFocused: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingLeft: 20,
    fontSize: fonts.size.medium,
    fontFamily: fonts.regular,
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
    fontSize: fonts.size.medium,
    fontFamily: fonts.regular,
    color: '#333',
  },
});

export default SearchScreen;
