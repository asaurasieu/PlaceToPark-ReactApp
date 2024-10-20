/*import firebase from 'firebase/compat/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export {auth, db, storage};
*/

// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBuboD_Mv91hBQ1_yDk8ngQ1W6zBcwMuEw',
  authDomain: 'proyecto-parking-aa0e2.firebaseapp.com',
  projectId: 'proyecto-parking-aa0e2',
  storageBucket: 'proyecto-parking-aa0e2.appspot.com',
  messagingSenderId: '442480217286',
  appId: '1:442480217286:web:d85af3f52afb1fd5089bc7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
