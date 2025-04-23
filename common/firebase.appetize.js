import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBuboD_Mv91hBQ1_yDk8ngQ1W6zBcwMuEw',
  authDomain: 'proyecto-parking-aa0e2.firebaseapp.com',
  projectId: 'proyecto-parking-aa0e2',
  storageBucket: 'proyecto-parking-aa0e2.appspot.com',
  messagingSenderId: '442480217286',
  appId: '1:442480217286:web:d85af3f52afb1fd5089bc7',
};

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

const db = firestore();
const authInstance = auth();
const storageInstance = storage();

db.settings({
  persistence: false,
});

console.log('Firebase services initialized');

export {db, authInstance as auth, storageInstance as storage};
