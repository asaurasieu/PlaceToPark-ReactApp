import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import RNFS from 'react-native-fs';

// Madrid coordinates
const INITIAL_REGION = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const [parkingZones, setParkingZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParkingData = async () => {
      try {
        const fileContent = await RNFS.readFileAssets('output.geojson', 'utf8');
        const data = JSON.parse(fileContent);

        // Group nearby spots into zones
        const zones = data.features.reduce((acc, spot, index) => {
          // Calculate zone center (group spots within ~500m)
          const lat = Math.floor(spot.geometry.coordinates[1] / 0.005) * 0.005;
          const lng = Math.floor(spot.geometry.coordinates[0] / 0.005) * 0.005;
          const key = `${lat},${lng}`;

          if (!acc[key]) {
            acc[key] = {
              id: key,
              name: `${spot.properties.neighborhood}, ${spot.properties.street} ${spot.properties.property_number}`,
              center: {
                latitude: lat + 0.0025,
                longitude: lng + 0.0025,
              },
              count: 0,
            };
          }
          acc[key].count++;
          return acc;
        }, {});

        setParkingZones(Object.values(zones));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParkingData();
  }, []);

  const handleMarkerPress = zone => {
    Alert.alert(
      'Zone Information',
      `${zone.name}\nAvailable spots: ${zone.count}`,
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}>
        {parkingZones.map(zone => (
          <Marker
            key={zone.id}
            coordinate={zone.center}
            onPress={() => handleMarkerPress(zone)}>
            <View
              style={[
                styles.marker,
                {backgroundColor: zone.count > 50 ? '#4169E1' : '#fff'},
              ]}>
              <Text
                style={[
                  styles.markerText,
                  zone.count > 50 ? {color: '#fff'} : {color: '#4169E1'},
                ]}>
                {zone.count}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {isLoading && (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      <View style={styles.legend}>
        <Text style={styles.legendText}>Numbers show available spots</Text>
        <Text style={styles.legendText}>Blue markers = 50+ spots</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4169E1',
    minWidth: 40,
    alignItems: 'center',
  },
  markerText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  loading: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
  },
  legend: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MapScreen;
