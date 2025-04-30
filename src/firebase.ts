import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAumCJ2XAikNH-JC6DojAaMsFheNuVsQZk",
    authDomain: "projectis-73a3b.firebaseapp.com",
    projectId: "projectis-73a3b",
    storageBucket: "projectis-73a3b.firebasestorage.app",
    messagingSenderId: "1020679724579",
    appId: "1:1020679724579:web:47be389409304d0d30db96",
    measurementId: "G-EGYG6J0J4F"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 