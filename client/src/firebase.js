// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVD5sBYxURoK_HNTTo_CESFoJzwsFtZek",
  authDomain: "chat-app-72c62.firebaseapp.com",
  projectId: "chat-app-72c62",
  storageBucket: "chat-app-72c62.firebasestorage.app",
  messagingSenderId: "809915322551",
  appId: "1:809915322551:web:63c4ef769d0c74ae1d7d32",
  measurementId: "G-X0YMK1EW59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();