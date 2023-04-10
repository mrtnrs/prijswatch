import { app } from "./init.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { Toast } from '@/core/CustomHotToast';

export const auth = getAuth(app);

export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const getCurrentUser = async () => {
  const promisifiedOnAuthStateChanged = (auth) => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null);
        }
      });
    });
  };

  const uid = await promisifiedOnAuthStateChanged(auth);
  return uid;
};

export const signUpUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    console.log(auth);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const signInUserWithEmailAndPassword = async (email, password, rememberMe) => {
  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await auth.setPersistence(persistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    Toast.success('Je bent ingelogd');
    return userCredential.user;
  } catch (error) {
    console.log('Error in signInUserWithEmailAndPassword:', error);
    Toast.error('Inloggen mislukt');
    throw new Error('Error during sign-in: ' + error.message);
  }
};

export const setPersistence = async (persistence) => {
  try {
    await firebaseSetPersistence(auth, persistence);
  } catch (error) {
    throw error;
  }
};


export const signOutUser = async () => {
  try {
    await signOut(auth);
    Toast.success('Je bent uitgelogd');
  } catch (error) {
    console.log(error);
  }
};







      
   

