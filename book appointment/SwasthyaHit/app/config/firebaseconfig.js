
// app/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "authdomain_of_your_database",
  projectId: "id_of_your_project",
  storageBucket: "storagebucket_of_your_project",
  messagingSenderId: "messaging_sender_id",
  appId: "appId_to_your_project",
  measurementId: "measurmentId_for_your_project"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
    
// Initialize Firestore
const db = getFirestore(firebaseApp);

export { db };
