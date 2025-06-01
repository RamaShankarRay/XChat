import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: "xchat-ad785.firebaseapp.com",
  databaseURL: "https://xchat-ad785-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xchat-ad785",
  storageBucket: "xchat-ad785.firebasestorage.app",
  messagingSenderId: "962415851291",
  appId: "1:962415851291:web:371092c56a492fec5285be",
  measurementId: "G-RC3H6PVKH0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;
