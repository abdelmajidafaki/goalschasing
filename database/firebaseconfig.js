// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
   signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  Timestamp,
  getDocs,
  getDoc,
  onSnapshot,
  orderBy
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAZ7tgzyeZ8bxKbanvtolECEFRWT0oj5E",
  authDomain: "pfa-557ee.firebaseapp.com",
  projectId: "pfa-557ee",
  storageBucket: "pfa-557ee.appspot.com",
  messagingSenderId: "834682588219",
  appId: "1:834682588219:web:47ef9327f53ac7fbb7a01e",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore after initializing Firebase
const firestoreDB = getFirestore(firebaseApp);
firebase.initializeApp(firebaseConfig);

// Export Firebase Auth and Firestore instances
export const firebaseAuth = getAuth(firebaseApp);
export {
  firestoreDB,
  doc,
  collection,
  setDoc,
  query,
  where,
  updateDoc,
  Timestamp,
  getDocs,
  getDoc,
  onSnapshot,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  orderBy,
   signOut
};
export { firebase };
