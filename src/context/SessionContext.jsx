import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { getUserProfile } from '../services/authService';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId, { retries = 3, delayMs = 500 } = {}) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const data = await getUserProfile(userId);
        if (data) {
          setProfile(data);
          setLoading(false);
          return;
        }
        // data is null — profile doesn't exist yet (signup race condition)
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
          continue;
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
          continue;
        }
      }
    }
    // All retries exhausted — profile genuinely doesn't exist
    setProfile(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Allow manual refresh (e.g., after signup inserts profile)
  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchProfile(session.user.id, { retries: 5, delayMs: 300 });
    }
  }, [session, fetchProfile]);

  return (
    <SessionContext.Provider value={{ session, profile, loading, refreshProfile }}>
      {children}
    </SessionContext.Provider>
  );
};

