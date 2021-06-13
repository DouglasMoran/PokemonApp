import firebase from 'firebase';
import '@react-native-firebase/database';

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyC_MLrR6SI38Z9Yn7B-esA8X8E-gq5qUsU",
    authDomain: "pokemon-app-4d6ff.firebaseapp.com",
    databaseURL: "https://pokemon-app-4d6ff-default-rtdb.firebaseio.com",
    projectId: "pokemon-app-4d6ff",
    storageBucket: "pokemon-app-4d6ff.appspot.com",
    messagingSenderId: "193762090348",
    appId: "1:193762090348:web:f0d3c539caef6ab4262749",
    measurementId: "G-C1K2EF18FZ"
  };
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const database = firebase.database(app);

export const teamsReference = database.ref('users-registered');