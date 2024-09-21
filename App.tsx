import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {db} from './common/firebase';
import {collection, doc, getDocs, setDoc} from 'firebase/firestore/lite';

function App(): React.JSX.Element {
  const [cities, setCities] = useState('');

  // Get a list of cities from your database
  const getCities = async () => {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    citySnapshot.docs
      .map(doc => doc.data())
      .forEach(city => {
        setCities(city.name);
      });
  };

  //Set cities to state
  const addCity = (city: string) => {
    const citiesCol = collection(db, 'cities');
    const docRef = doc(citiesCol);
    setDoc(docRef, {name: city});
  };

  useEffect(() => {
    addCity('New York');
    getCities();
  }, []);

  return (
    <View>
      <Text>{cities}</Text>
    </View>
  );
}

export default App;
