import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDqoSMSlrsgTvFjKvzvXIeFanKvhG5c4-I",
  authDomain: "lab06-expense-0151.firebaseapp.com",
  projectId: "lab06-expense-0151",
  storageBucket: "lab06-expense-0151.firebasestorage.app",
  messagingSenderId: "987703365037",
  appId: "1:987703365037:web:f1ebcd8b6d4848fc1a6524",
  measurementId: "G-7QK7M3DH53"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
