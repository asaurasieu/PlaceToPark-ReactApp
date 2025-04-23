// Import the functions you need from the SDKs you need
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBuboD_Mv91hBQ1_yDk8ngQ1W6zBcwMuEw',
  authDomain: 'proyecto-parking-aa0e2.firebaseapp.com',
  projectId: 'proyecto-parking-aa0e2',
  storageBucket: 'proyecto-parking-aa0e2.appspot.com',
  messagingSenderId: '442480217286',
  appId: '1:442480217286:web:d85af3f52afb1fd5089bc7',
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore
const db = firestore();

export {db};
