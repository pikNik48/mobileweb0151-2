// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqoSMSlrsgTvFjKvzvXIeFanKvhG5c4-I",
  authDomain: "lab06-expense-0151.firebaseapp.com",
  projectId: "lab06-expense-0151",
  storageBucket: "lab06-expense-0151.firebasestorage.app",
  messagingSenderId: "987703365037",
  appId: "1:987703365037:web:c7160d40b4a132171a6524",
  measurementId: "G-E27RX3RY8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);