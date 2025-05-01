import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GestureHandlerRootView, RectButton} from 'react-native-gesture-handler';

const NavigationScreen = () => {
  const [mapError, setMapError] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        onError={error => {
          console.error('Map error:', error);
          setMapError(error);
          Alert.alert(
            'Map Error',
            'Failed to load Google Maps: ' + error.nativeEvent.error,
          );
        }}
      />
      {mapError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading map: {mapError.nativeEvent?.error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default NavigationScreen;
