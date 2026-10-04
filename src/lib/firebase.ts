import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';

// Web config is public by design (it ships to the browser); set these in .env.local (see .env.example)
// NOTE: each var must be referenced literally so Next.js can inline it at build time
const firebaseConfig: FirebaseOptions = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.measurementId);

// Reuse the existing app across hot reloads
export const getFirebaseApp = () => (getApps().length ?(getApp()) :(initializeApp(firebaseConfig)));
