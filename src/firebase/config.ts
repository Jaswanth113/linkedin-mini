// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcuzwFxeRqnTP6a78EPR6epeMfSDirtxc",
  authDomain: "linkedin-mini-a9c5f.firebaseapp.com",
  projectId: "linkedin-mini-a9c5f",
  storageBucket: "linkedin-mini-a9c5f.firebasestorage.app",
  messagingSenderId: "143014316474",
  appId: "1:143014316474:web:e73abe1ec4287940267583",
  measurementId: "G-JK2WFJBBKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage }; 