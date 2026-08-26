import React, { createContext, useContext, useCallback } from 'react';
import { logAttempt as serviceLogAttempt, getUserAttempts, getLinkedStudents, getUserProgress, updateUserProgress } from '../services/progressService';
import { useSession } from './SessionContext';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { session } = useSession();

  const logAttempt = useCallback(async (attemptData) => {
    const userId = session?.user?.id || 'guest_user';
    try {
      console.log('[logAttempt] Saving attempt for userId:', userId, '| module:', attemptData.module, '| correct:', attemptData.correct);
      await serviceLogAttempt({ ...attemptData, user_id: userId });
      console.log('[logAttempt] ✅ Attempt saved successfully');
    } catch (error) {
      console.error('[logAttempt] ❌ Failed to log attempt:', error.message, error);
    }
  }, [session]);

  const fetchAttempts = useCallback(async (userIdArg, module) => {
    const userId = userIdArg || session?.user?.id || 'guest_user';
    try {
      return await getUserAttempts(userId, module);
    } catch (error) {
      console.error("Failed to fetch attempts", error);
      return [];
    }
  }, [session]);

  const fetchUserProgress = useCallback(async (userIdOrModule, moduleArg) => {
    const userId = moduleArg ? userIdOrModule : (session?.user?.id || 'guest_user');
    const module = moduleArg ? moduleArg : userIdOrModule;
    try {
      return await getUserProgress(userId, module);
    } catch (error) {
      console.error("Failed to fetch user progress", error);
      return [];
    }
  }, [session]);

  const saveUserProgress = useCallback(async (module, level, accuracy) => {
    const userId = session?.user?.id || 'guest_user';
    try {
      console.log('[saveUserProgress] Saving progress:', { module, level, accuracy, userId });
      const result = await updateUserProgress(userId, module, level, accuracy);
      console.log('[saveUserProgress] ✅ Progress saved');
      return result;
    } catch (error) {
      console.error('[saveUserProgress] ❌ Failed:', error.message, error);
      return null;
    }
  }, [session]);


  const fetchLinkedStudents = useCallback(async () => {
    if (!session?.user?.id) return [];
    try {
      return await getLinkedStudents(session.user.id);
    } catch (error) {
      console.error("Failed to fetch linked students", error);
      return [];
    }
  }, [session]);

  return (
    <ProgressContext.Provider value={{ logAttempt, fetchAttempts, fetchLinkedStudents, fetchUserProgress, saveUserProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
