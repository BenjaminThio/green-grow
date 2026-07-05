import { initializeApp, getApps, getApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

/*
 * server-only guarantees this module (and the API key) can never be
 * bundled into client JavaScript. All Firestore access goes through
 * server actions / server components.
 */
import 'server-only';

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'algo-rhythm-app.firebaseapp.com',
    projectId: 'algo-rhythm-app',
    storageBucket: 'algo-rhythm-app.firebasestorage.app',
    messagingSenderId: '170220207170',
    appId: '1:170220207170:web:65359044e063e76bdec1db',
    measurementId: 'G-MG4V5LM4QQ'
};

// getApps() guard prevents "app already initialized" during hot reload.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
