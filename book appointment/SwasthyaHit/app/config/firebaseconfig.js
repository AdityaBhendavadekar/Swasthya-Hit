
// app/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAM1CobPW71F6G7K4Xw248PSYtF2D3tCPE",
  authDomain: "sih-1620-498a6.firebaseapp.com",
  projectId: "sih-1620-498a6",
  storageBucket: "sih-1620-498a6.appspot.com",
  messagingSenderId: "962642479001",
  appId: "1:962642479001:web:9cba07d24675bbd1947508",
  measurementId: "G-9H6DFRDZQE"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
    
// Initialize Firestore
const db = getFirestore(firebaseApp);

export { db };
