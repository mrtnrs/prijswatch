'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import {auth, onAuthStateChanged, signInUserWithEmailAndPassword, signOutUser } from './../../firebase/auth'; // Update the import path according to your project structure
import { setPersistence, inMemoryPersistence, browserLocalPersistence } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmailAndPassword = async (email, password, rememberMe) => {
    try {
          const persistence = rememberMe ? browserLocalPersistence : inMemoryPersistence;
    await setPersistence(auth, persistence);
      const user = await signInUserWithEmailAndPassword(email, password, rememberMe);
      if (!user.emailVerified) {
        // Handle the case when the email is not verified
        throw new Error('Email not verified. Please verify your email before logging in.');
      }
    } catch (error) {
      throw error;
    }
  };

    const signOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const value = {
    currentUser,
    signInWithEmailAndPassword,
    signOut
  };

  return (
    <AuthContext.Provider value={{ currentUser, signInWithEmailAndPassword, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
