import firebase from 'firebase/app';
import 'firebase/auth'; // If you need it
import 'firebase/firestore'; // If you need it
import 'firebase/database'; // If you need it
import 'firebase/storage'; // If you need it
import 'firebase/analytics'; // If you need it

const clientCredentials = {
    apiKey: "AIzaSyCwZTKrTd8qwwItOQyQk2YWTe1lAtVEoaQ",
    authDomain: "biche-designs.firebaseapp.com",
    databaseURL: "https://biche-designs.firebaseio.com",
    projectId: "biche-designs",
    storageBucket: "biche-designs.appspot.com",
    messagingSenderId: "158232010492",
    appId: "1:158232010492:web:5603c7f904bbe84e754179",
    measurementId: "G-DGXGZ4HTXP"
};

// Check that `window` is in scope for the analytics module!
if (!firebase.apps.length) {
    console.log('Initialize firebase');
    firebase.initializeApp(clientCredentials);
    // To enable analytics. https://firebase.google.com/docs/analytics/get-started
    if (typeof window !== 'undefined' &&  'measurementId' in clientCredentials) firebase.analytics();
}

export const fireAuth = firebase.auth();

export default firebase;
