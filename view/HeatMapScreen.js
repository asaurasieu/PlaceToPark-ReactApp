import React from 'react';
import {StyleSheet, View} from 'react-native';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'sk.eyJ1IjoiYXNhdXJhcyIsImEiOiJjbTY5bnJrYXowYWU0Mm1zaXYwc3IzbGtmIn0.zw0bfnu0VjjEsU-OebpKQw',
);

const App = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          zoomLevel={12} // Nivel de zoom (ajústalo según tus necesidades)
          Coordinate={[-3.7038, 40.4168]} // Coordenadas de Madrid
          //styleURL="mapbox://styles/asauras/cm62iwhny007s01sg4x3q54ak"
          style={styles.map}
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});
