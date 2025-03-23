import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import RNFS from 'react-native-fs';

const INITIAL_REGION = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const mapStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#e9e9e9'}, {lightness: 17}],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{color: '#f5f5f5'}, {lightness: 20}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{color: '#ffffff'}, {lightness: 17}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#ffffff'}, {lightness: 29}, {weight: 0.2}],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{color: '#ffffff'}, {lightness: 18}],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{color: '#ffffff'}, {lightness: 16}],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{color: '#f5f5f5'}, {lightness: 21}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#dedede'}, {lightness: 21}],
  },
];

const MapScreen = () => {
  const [parkingZones, setParkingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const zoomIn = () => {
    if (mapRef.current) {
      const camera = {
        center: {
          latitude: INITIAL_REGION.latitude,
          longitude: INITIAL_REGION.longitude,
        },
        pitch: 0,
        heading: 0,
        zoom: 15,
      };
      mapRef.current.animateCamera(camera, {duration: 1000});
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const camera = {
        center: {
          latitude: INITIAL_REGION.latitude,
          longitude: INITIAL_REGION.longitude,
        },
        pitch: 0,
        heading: 0,
        zoom: 12,
      };
      mapRef.current.animateCamera(camera, {duration: 1000});
    }
  };

  // Function to create zones from parking spots
  const createParkingZones = spots => {
    const zoneSize = 0.005; // Roughly 500m
    const zones = new Map();

    spots.forEach(spot => {
      const lat = Math.floor(spot.coordinate.latitude / zoneSize) * zoneSize;
      const lng = Math.floor(spot.coordinate.longitude / zoneSize) * zoneSize;
      const zoneKey = `${lat},${lng}`;

      if (!zones.has(zoneKey)) {
        zones.set(zoneKey, {
          id: zoneKey,
          center: {
            latitude: lat + zoneSize / 2,
            longitude: lng + zoneSize / 2,
          },
          bounds: {
            north: lat + zoneSize,
            south: lat,
            east: lng + zoneSize,
            west: lng,
          },
          spots: [],
        });
      }
      zones.get(zoneKey).spots.push(spot);
    });

    return Array.from(zones.values());
  };

  useEffect(() => {
    const loadParkingData = async () => {
      try {
        setIsLoading(true);
        let fileContent;
        if (Platform.OS === 'android') {
          fileContent = await RNFS.readFileAssets('output.geojson', 'utf8');
        } else {
          const filePath = RNFS.MainBundlePath + '/output.geojson';
          fileContent = await RNFS.readFile(filePath, 'utf8');
        }

        const geojsonData = JSON.parse(fileContent);

        if (geojsonData && geojsonData.features) {
          const parkingSpots = geojsonData.features.map((feature, index) => ({
            coordinate: {
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
            },
            id: index.toString(),
          }));

          const zones = createParkingZones(parkingSpots);
          setParkingZones(zones);
        }
      } catch (error) {
        console.error('Error loading parking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParkingData();
  }, []);

  const onZonePress = zone => {
    setSelectedZone(zone);
    mapRef.current?.animateToRegion({
      latitude: zone.center.latitude,
      longitude: zone.center.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          minZoomLevel={10}
          maxZoomLevel={18}
          customMapStyle={mapStyle}
          mapType="standard">
          {parkingZones.map(zone => (
            <React.Fragment key={zone.id}>
              <Polygon
                coordinates={[
                  {latitude: zone.bounds.north, longitude: zone.bounds.west},
                  {latitude: zone.bounds.north, longitude: zone.bounds.east},
                  {latitude: zone.bounds.south, longitude: zone.bounds.east},
                  {latitude: zone.bounds.south, longitude: zone.bounds.west},
                ]}
                fillColor={`rgba(65, 105, 225, ${
                  zone.spots.length > 50 ? 0.15 : 0.08
                })`}
                strokeColor="rgba(65, 105, 225, 0.3)"
                strokeWidth={1}
              />
              <Marker coordinate={zone.center}>
                <View style={styles.zoneMarker}>
                  <Text style={styles.zoneMarkerText}>{zone.spots.length}</Text>
                </View>
              </Marker>
            </React.Fragment>
          ))}
        </MapView>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={styles.legendMarker}>
              <Text style={styles.legendMarkerText}>123</Text>
            </View>
            <Text style={styles.legendText}>
              Number indicates available parking spots in the area
            </Text>
          </View>
          <View style={styles.legendColorItem}>
            <View style={styles.legendColorBox}>
              <View style={[styles.legendColor, {opacity: 0.15}]} />
              <Text style={styles.legendColorText}>
                High availability (50+ spots)
              </Text>
            </View>
            <View style={styles.legendColorBox}>
              <View style={[styles.legendColor, {opacity: 0.08}]} />
              <Text style={styles.legendColorText}>
                Lower availability (&lt;50 spots)
              </Text>
            </View>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading parking zones...</Text>
          </View>
        )}

        <View style={styles.zoomButtonsContainer}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={zoomIn}
            activeOpacity={0.7}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={zoomOut}
            activeOpacity={0.7}>
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapScreen;

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
  zoneMarker: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: '#4169E1',
  },
  zoneMarkerText: {
    color: '#4169E1',
    fontWeight: 'bold',
    fontSize: 11,
  },
  legendContainer: {
    position: 'absolute',
    left: 16,
    bottom: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5.84,
    maxWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(65, 105, 225, 0.2)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendMarker: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2.5,
    borderColor: '#4169E1',
    marginRight: 10,
  },
  legendMarkerText: {
    color: '#4169E1',
    fontWeight: 'bold',
    fontSize: 11,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  legendColorItem: {
    marginTop: 8,
  },
  legendColorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  legendColor: {
    width: 20,
    height: 20,
    backgroundColor: '#4169E1',
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(65, 105, 225, 0.3)',
  },
  legendColorText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  loadingContainer: {
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
  zoomButtonsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 36,
    backgroundColor: 'transparent',
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
