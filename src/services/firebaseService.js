import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  limitToLast,
  query,
} from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase project configuration.
 * All values are injected at build time via VITE_ environment variables —
 * never hard-coded in source.
 * @type {import('firebase/app').FirebaseOptions}
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** @type {import('firebase/database').Database|undefined} */
let db;

/** @type {import('firebase/auth').Auth|undefined} */
let auth;

/** @type {import('firebase/analytics').Analytics|undefined} */
let analytics;

/**
 * True when Firebase is properly configured with real credentials.
 * Components should check this before calling any Firebase service.
 * @type {boolean}
 */
const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY';

if (isFirebaseConfigured) {
  // Reuse existing app instance — prevents "duplicate-app" crash
  // when this module is imported in multiple places.
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  db = getDatabase(app);
  auth = getAuth(app);

  // Analytics is not supported in all environments (e.g. SSR, some browsers).
  // Initialise asynchronously to avoid blocking the app.
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      if (import.meta.env.DEV) {
        console.warn('Firebase Analytics not supported:', err);
      }
    });
}

export {
  db,
  auth,
  analytics,
  isFirebaseConfigured,
  ref,
  push,
  onValue,
  limitToLast,
  query,
  signInAnonymously,
};
