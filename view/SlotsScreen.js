// SlotsScreen.js
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {useData} from '../common/userContext';

export default function SlotsScreen() {
  const {selectedParking} = useData();
  const navigation = useNavigation();

  const [parkingData, setParkingData] = useState({
    available: 0,
    total: 0,
    spots: [],
  });

  useEffect(() => {
    const callServer = () => {
      const ws = new WebSocket('ws://localhost:3000');
      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = event => {
        console.log('Received data:', event.data);
        const data = JSON.parse(event.data);
        if (
          data &&
          typeof data === 'object' &&
          data.hasOwnProperty('available') &&
          data.hasOwnProperty('total') &&
          data.hasOwnProperty('spots')
        ) {
          setParkingData({
            available: data.available,
            total: data.total,
            spots: data.spots,
          });
        } else {
          console.error('Received data is not in the expected format:', data);
        }
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = e => {
        console.log('WebSocket is closed now: ${e.code} ${e.reason}');
      };

      return () => {
        ws.close();
      };
    };

    const mock = () => {
      const probability = Math.random();
      const slots = Array.from(
        {length: selectedParking.area.num_plazas},
        (_, i) => ({
          id: i + 1,
          isAvailable: Math.random() > probability,
        }),
      );
      setParkingData({
        available: slots.filter(spot => spot.isAvailable).length,
        total: selectedParking.area.num_plazas,
        spots: slots,
      });
    };

    console.log(selectedParking);
    if (selectedParking.area.id === '3') {
      callServer();
    } else {
      mock();
    }
  }, [selectedParking]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Plaza de la Moraleja</Text>
      <Text style={styles.spotInfo}>Total Spots: {parkingData.total}</Text>
      <Text style={styles.spotInfo}>
        Available Spots: {parkingData.available}
      </Text>
      <ScrollView
        style={styles.spotsContainer}
        contentContainerStyle={styles.spotsContentContainer}>
        {parkingData.spots.map(spot => (
          <View
            key={spot.id}
            style={[
              styles.spot,
              spot.isAvailable ? styles.available : styles.unavailable,
            ]}>
            <Text style={styles.spotText}>Spot {spot.id}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.navigateButtonContainer}>
        <RectButton
          onPress={() => navigation.navigate('NavigationScreen')}
          style={styles.navigateButton}>
          <Text style={styles.navigateButtonText}>Navigate To</Text>
        </RectButton>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spotInfo: {
    fontSize: 16,
    margin: 5,
  },
  spotsContainer: {
    width: '100%',
  },
  spotsContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  spot: {
    width: 100,
    height: 100,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  available: {
    backgroundColor: 'green',
  },
  unavailable: {
    backgroundColor: 'red',
  },
  spotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navigateButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  navigateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
