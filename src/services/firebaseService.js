import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, onValue, limitToLast, query } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db, auth, analytics;

const isFirebaseConfigured = firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";

if (isFirebaseConfigured) {
  // ✅ KEY FIX: check if app already exists before initializing
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getDatabase(app);
  auth = getAuth(app);
  analytics = getAnalytics(app);
}

export {
  db, auth, analytics, isFirebaseConfigured,
  ref, push, onValue, limitToLast, query, signInAnonymously
};