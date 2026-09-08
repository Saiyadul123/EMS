import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import configData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  projectId: configData.projectId,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
  appId: configData.appId,
  measurementId: configData.measurementId,
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom firestoreDatabaseId
export const db = configData.firestoreDatabaseId
  ? getFirestore(app, configData.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
