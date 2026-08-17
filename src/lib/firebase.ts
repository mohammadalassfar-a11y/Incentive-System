import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database with custom database ID if specified
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
