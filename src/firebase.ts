import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAumCJ2XAikNH-JC6DojAaMsFheNuVsQZk",
    authDomain: "projectis-73a3b.firebaseapp.com",
    projectId: "projectis-73a3b",
    storageBucket: "projectis-73a3b.appspot.com",
    messagingSenderId: "1020679724579",
    appId: "1:1020679724579:web:47be389409304d0d30db96",
    measurementId: "G-EGYG6J0J4F"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Включаем локальное кэширование для работы офлайн
// Это также может помочь при проблемах с подключением
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Несколько вкладок открыто, persistence может быть включен только в одной
      console.error('Persistence не может быть включен, так как открыто несколько вкладок');
    } else if (err.code === 'unimplemented') {
      // Текущий браузер не поддерживает все функции, необходимые для persistence
      console.error('Текущий браузер не поддерживает все функции для persistence');
    } else {
      console.error('Ошибка при включении persistence:', err);
    }
  }); 