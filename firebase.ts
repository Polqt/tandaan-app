import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1R03kL9z_9xEDDNglP883_c4H6fXUPzY",
  authDomain: "tandaan-app.firebaseapp.com",
  projectId: "tandaan-app",
  storageBucket: "tandaan-app.firebasestorage.app",
  messagingSenderId: "820248185686",
  appId: "1:820248185686:web:6058da7ad954af2fafa4f7",
  measurementId: "G-BHBEWD25KF"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };