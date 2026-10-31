import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClB0BFQx48AF8s6zYLLSovwZV0TH7ybEE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "habitpulse-tracker.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "habitpulse-tracker",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "habitpulse-tracker.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1061911193835",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1061911193835:web:12f011ce0896b1173336ae",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GMN301D8HY"
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (err) {
  console.warn('Firebase initialization error:', err);
}

export { 
  app, 
  auth, 
  db, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
};

