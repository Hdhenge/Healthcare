import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOnpWuHGRn3bk5qyL4JZwNX8exDxvN7Qs",
  authDomain: "med-cart-eeee4.firebaseapp.com",
  projectId: "med-cart-eeee4",
  storageBucket: "med-cart-eeee4.firebasestorage.app",
  messagingSenderId: "460220795793",
  appId: "1:460220795793:web:c436c30d4a633ab9502830",
  measurementId: "G-0DJ19682MC"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
