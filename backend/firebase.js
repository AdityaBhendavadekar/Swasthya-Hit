// backend/firebase.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('./serviceAccountKey.json');

dotenv.config();

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sih-1620-498a6.firebaseio.com", // Replace with your project ID
  });

  const db = admin.firestore();
  console.log("Firebase connected successfully!"); // Log success message when Firebase is initialized

  module.exports = { db };
} catch (error) {
  console.error("Error connecting to Firebase:", error); // Log any initialization error
  process.exit(1); // Exit if Firebase initialization fails
}
