// SlotsScreen.js
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {Icon} from 'react-native-eva-icons';
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
      const ws = new WebSocket('ws://10.0.2.2:3000');
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back-outline" width={24} height={24} fill="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={2} ellipsizeMode="tail">
          {selectedParking.area.calle}
          {selectedParking.area.num_finca
            ? `, ${selectedParking.area.num_finca}`
            : ''}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Icon
            name="pin-outline"
            width={24}
            height={24}
            fill="#666"
            style={styles.infoIcon}
          />
          <Text style={styles.infoLabel}>Total Spots</Text>
          <Text style={styles.infoValue}>{parkingData.total}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon
            name="checkmark-circle-2-outline"
            width={24}
            height={24}
            fill="#0EA5E9"
            style={styles.infoIcon}
          />
          <Text style={styles.infoLabel}>Available</Text>
          <Text style={styles.infoValue}>{parkingData.available}</Text>
        </View>
      </View>

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
            <Text
              style={[
                styles.spotText,
                spot.isAvailable
                  ? styles.availableText
                  : styles.unavailableText,
              ]}>
              {spot.id}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navigateButtonContainer}>
        <RectButton
          onPress={() => navigation.navigate('NavigationScreen')}
          style={styles.navigateButton}>
          <Icon
            name="navigation-2-outline"
            width={20}
            height={20}
            fill="#fff"
            style={styles.buttonIcon}
          />
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
    backgroundColor: '#D0D6E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
    flex: 1,
    paddingRight: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoBox: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#333',
  },
  spotsContainer: {
    flex: 1,
    backgroundColor: '#D0D6E0',
    marginHorizontal: 16,
  },
  spotsContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  spot: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 6,
  },
  available: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BDC4D4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unavailable: {
    backgroundColor: '#1C2E4A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  spotText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  availableText: {
    color: '#0F1A2B',
  },
  unavailableText: {
    color: '#fff',
  },
  navigateButtonContainer: {
    padding: 16,
    backgroundColor: '#D0D6E0',
    paddingVertical: 12,
  },
  navigateButton: {
    backgroundColor: '#1C2E4A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 180,
    alignSelf: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  infoIcon: {
    marginBottom: 6,
  },
  buttonIcon: {
    marginRight: 6,
  },
});
