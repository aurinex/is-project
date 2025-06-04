import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

/**
 * Обновляет прогресс пользователя по конкретному модулю
 * @param moduleId Идентификатор модуля
 * @param progress Процент прогресса (0-100)
 * @param isCompleted Флаг завершения модуля
 */
export const updateModuleProgress = async (
  moduleId: string, 
  progress: number, 
  isCompleted: boolean = false
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    const userEmail = currentUser.email || '';
    const displayName = currentUser.displayName || userEmail || 'Пользователь';
    const photoURL = currentUser.photoURL || '';
    
    // Сохраняем прогресс в localStorage для офлайн-режима
    try {
      const localData = localStorage.getItem(`userProgress_${userId}`);
      let progressData = {};
      
      if (localData) {
        progressData = JSON.parse(localData);
      }
      
      progressData = {
        ...progressData,
        [moduleId]: progress
      };
      
      localStorage.setItem(`userProgress_${userId}`, JSON.stringify(progressData));
    } catch (e) {
      console.error('Ошибка при сохранении локальных данных:', e);
    }
    
    // Если нет подключения к интернету, не обновляем Firestore
    if (!navigator.onLine) return;
    
    // Проверяем существует ли документ
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);
    
    const now = new Date().toISOString();
    let moduleCompletionTimes = {};
    
    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data();
      moduleCompletionTimes = data.moduleCompletionTimes || {};
      
      // Если модуль завершен, сохраняем время завершения
      if (isCompleted && progress === 100) {
        moduleCompletionTimes = {
          ...moduleCompletionTimes,
          [moduleId]: now
        };
      }
      
      // Обновляем существующий документ
      await updateDoc(userProgressRef, {
        [moduleId]: progress,
        userId,
        email: userEmail,
        displayName,
        photoURL,
        lastUpdated: now,
        moduleCompletionTimes
      });
    } else {
      // Если модуль завершен, сохраняем время завершения
      if (isCompleted && progress === 100) {
        moduleCompletionTimes = {
          [moduleId]: now
        };
      }
      
      // Создаем новый документ
      await setDoc(userProgressRef, {
        [moduleId]: progress,
        userId,
        email: userEmail,
        displayName,
        photoURL,
        lastUpdated: now,
        moduleCompletionTimes
      });
    }
    
    console.log(`Прогресс модуля ${moduleId} обновлен: ${progress}%`);
  } catch (error) {
    console.error('Ошибка при обновлении прогресса:', error);
  }
}; 