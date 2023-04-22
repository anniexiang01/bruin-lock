
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB2ZuJc9EMZJw7tZsAl83pLeOifhd9WDKI",
  authDomain: "bruinlocks.firebaseapp.com",
  databaseURL: "https://bruinlocks-default-rtdb.firebaseio.com",
  projectId: "bruinlocks",
  storageBucket: "bruinlocks.appspot.com",
  messagingSenderId: "681344432351",
  appId: "1:681344432351:web:4464dc2c277b0ec809116a",
  measurementId: "G-S2FQ85HNXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
