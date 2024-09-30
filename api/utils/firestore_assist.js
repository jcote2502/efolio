// firestore_assist.js
const admin = require('firebase-admin');
require('dotenv').config();

let firestore;

// Initialize Firestore
async function connectFirestore() {
  try {
    // Initialize the Firebase app with your service account
    const FireBaseCredentials = {
      "type": process.env.TYPE,
      "project_id": process.env.PROJECT_ID,
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.CLIENT_EMAIL,
      "client_id": process.env.CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.CERT_URL,
      "universe_domain": "googleapis.com"
    }
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(FireBaseCredentials), // Update the path to your service account key
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Use your Firebase Storage bucket
      });
    }

    firestore = admin.firestore();
    console.log('Connected to Firestore');
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
    return null;
  }
}

// Get Firestore instance
function getFirestore() {
  if (!firestore) {
    throw new Error('Firestore not initialized. Please call connectFirestore() first.');
  }
  return firestore;
}

// Get Storage bucket
function getStorageBucket() {
  const bucket = admin.storage().bucket(); // Get the default bucket
  return bucket;
}

module.exports = {
  connectFirestore,
  getFirestore,
  getStorageBucket,
};
