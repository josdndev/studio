'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
// Import other Firebase services as needed, e.g., getFirestore, getAuth
// import { getFirestore, Firestore } from 'firebase/firestore';
// import { getAuth, Auth } from 'firebase/auth';

// **IMPORTANT:** Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

interface FirebaseContextProps {
  app: FirebaseApp | null;
  // Add other services if needed:
  // firestore: Firestore | null;
  // auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  // const [firestore, setFirestore] = useState<Firestore | null>(null);
  // const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    let app: FirebaseApp;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    setFirebaseApp(app);
    // Initialize other services here
    // const db = getFirestore(app);
    // const authInstance = getAuth(app);
    // setFirestore(db);
    // setAuth(authInstance);

  }, []); // Run only once on mount

  return (
    <FirebaseContext.Provider value={{ app: firebaseApp /*, firestore, auth */ }}>
      {children}
    </FirebaseContext.Provider>
  );
};
