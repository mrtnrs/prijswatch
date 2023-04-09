// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIBA_ID,
  authDomain: process.env.NEXT_PUBLIC_FIBA_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIBA_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIBA_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIBA_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIBA_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIBA_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);








