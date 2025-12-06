import { FirebaseOptions, FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseApiKey: string = process.env.FIREBASE_API_KEY as string;

const firebaseConfig: FirebaseOptions = {
    apiKey: firebaseApiKey,
    authDomain: "algo-rhythm-app.firebaseapp.com",
    projectId: "algo-rhythm-app",
    storageBucket: "algo-rhythm-app.firebasestorage.app",
    messagingSenderId: "170220207170",
    appId: "1:170220207170:web:65359044e063e76bdec1db",
    measurementId: "G-MG4V5LM4QQ"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;