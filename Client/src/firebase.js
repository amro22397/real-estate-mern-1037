// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-db416.firebaseapp.com",
  projectId: "mern-estate-db416",
  storageBucket: "mern-estate-db416.appspot.com",
  messagingSenderId: "40789949086",
  appId: "1:40789949086:web:0b7c1374c6bec783f5998f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);