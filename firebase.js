// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your Firebase configuration (from Firebase console)
const firebaseConfig = {
  apiKey: 'AIzaSyDtXDr3Z0a9V9tr0MjLEmE5S8yTi4E3h08',
  authDomain: 'wastedetector-cc609.firebaseapp.com',
  projectId: 'wastedetector-cc609',
  storageBucket: 'wastedetector-cc609.firebasestorage.app',
  messagingSenderId: '908799127318',
  appId: '1:908799127318:web:eb95b337d1688ba449aa37',
  measurementId: 'G-CB4HVW3PZL'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
