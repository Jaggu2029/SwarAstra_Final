import { supabase } from './supabaseClient';

const getLocalAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem('swarastra_attempts') || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalAttempt = (attempt) => {
  try {
    const attempts = getLocalAttempts();
    attempts.push({
      ...attempt,
      id: attempt.id || `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: attempt.timestamp || new Date().toISOString(),
    });
    localStorage.setItem('swarastra_attempts', JSON.stringify(attempts));
  } catch (e) {
    console.error('Failed to save local attempt:', e);
  }
};

const getLocalProgress = () => {
  try {
    return JSON.parse(localStorage.getItem('swarastra_progress') || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalProgress = (userId, module, level, accuracy) => {
  try {
    const list = getLocalProgress();
    const existingIndex = list.findIndex(p => p.user_id === userId && p.module === module && p.level === level);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      list[existingIndex].best_accuracy = Math.max(list[existingIndex].best_accuracy || 0, accuracy);
      list[existingIndex].last_attempted_at = now;
      list[existingIndex].unlocked = true;
    } else {
      list.push({
        id: `local-p-${Date.now()}`,
        user_id: userId,
        module,
        level,
        unlocked: true,
        best_accuracy: accuracy,
        last_attempted_at: now
      });
    }

    if (accuracy >= 70) {
      const nextLevel = level + 1;
      const nextExisting = list.find(p => p.user_id === userId && p.module === module && p.level === nextLevel);
      if (!nextExisting) {
        list.push({
          id: `local-p-${Date.now()}-next`,
          user_id: userId,
          module,
          level: nextLevel,
          unlocked: true,
          best_accuracy: 0
        });
      }
    }
    localStorage.setItem('swarastra_progress', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save local progress:', e);
  }
};

export const logAttempt = async (attemptData) => {
  // Always save locally
  saveLocalAttempt(attemptData);

  try {
    const { data, error } = await supabase
      .from('attempts')
      .insert([attemptData]);
    if (!error) return data;
  } catch (err) {
    console.warn('[logAttempt] Supabase insert failed, using local storage fallback:', err.message);
  }
  return attemptData;
};

export const getUserAttempts = async (userId, module) => {
  let dbAttempts = [];
  try {
    let query = supabase.from('attempts').select('*').eq('user_id', userId);
    if (module) {
      query = query.eq('module', module);
    }
    const { data, error } = await query;
    if (!error && data) {
      dbAttempts = data;
    }
  } catch (err) {
    console.warn('[getUserAttempts] Supabase fetch failed, relying on local storage:', err.message);
  }

  const localAttempts = getLocalAttempts().filter(a => {
    const matchUser = !userId || a.user_id === userId || userId === 'guest_user';
    const matchMod = !module || a.module === module;
    return matchUser && matchMod;
  });

  // Combine DB and Local, avoiding duplicate IDs
  const combinedMap = new Map();
  [...dbAttempts, ...localAttempts].forEach(item => {
    const key = item.id || `${item.timestamp}-${item.module}-${item.level}`;
    combinedMap.set(key, item);
  });

  return Array.from(combinedMap.values());
};

export const getUserProgress = async (userId, module) => {
  let dbProgress = [];
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module', module);
    if (!error && data) {
      dbProgress = data;
    }
  } catch (err) {
    console.warn('[getUserProgress] Supabase fetch failed, relying on local storage:', err.message);
  }

  const localProgress = getLocalProgress().filter(p => {
    const matchUser = !userId || p.user_id === userId || userId === 'guest_user';
    const matchMod = !module || p.module === module;
    return matchUser && matchMod;
  });

  const combinedMap = new Map();
  [...dbProgress, ...localProgress].forEach(item => {
    const key = `${item.module}-${item.level}`;
    if (!combinedMap.has(key) || (item.best_accuracy > combinedMap.get(key).best_accuracy)) {
      combinedMap.set(key, item);
    }
  });

  return Array.from(combinedMap.values());
};

export const updateUserProgress = async (userId, module, level, accuracy) => {
  saveLocalProgress(userId, module, level, accuracy);

  try {
    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module', module)
      .eq('level', level)
      .single();

    if (existing) {
      const newBest = Math.max(existing.best_accuracy || 0, accuracy);
      await supabase
        .from('progress')
        .update({ 
          unlocked: true, 
          best_accuracy: newBest,
          last_attempted_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('progress')
        .insert([{
          user_id: userId,
          module,
          level,
          unlocked: true,
          best_accuracy: accuracy,
          last_attempted_at: new Date().toISOString()
        }]);
    }

    if (accuracy >= 70) {
      const nextLevel = level + 1;
      const { data: nextExisting } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module', module)
        .eq('level', nextLevel)
        .single();
        
      if (!nextExisting) {
        await supabase
          .from('progress')
          .insert([{
            user_id: userId,
            module,
            level: nextLevel,
            unlocked: true,
            best_accuracy: 0
          }]);
      }
    }
  } catch (err) {
    console.warn('[updateUserProgress] Supabase update failed, saved locally:', err.message);
  }

  return getLocalProgress();
};

export const getLinkedStudents = async (linkedUserId) => {
  try {
    const { data, error } = await supabase
      .from('student_links')
      .select('student_id, profiles!student_links_student_id_fkey(full_name)')
      .eq('linked_user_id', linkedUserId);
    if (!error && data) {
      return data.map(link => ({ id: link.student_id, name: link.profiles?.full_name || 'Student' }));
    }
  } catch (err) {
    console.warn('[getLinkedStudents] Supabase error:', err.message);
  }
  return [];
};

export const searchStudents = async (searchQuery) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .ilike('full_name', `%${searchQuery}%`)
      .limit(20);
    
    if (error) {
      console.error('[searchStudents] API Error:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('[searchStudents] Exception:', err.message);
    throw err;
  }
};

export const addStudentLink = async (teacherId, studentId) => {
  try {
    const { data, error } = await supabase
      .from('student_links')
      .insert([{ linked_user_id: teacherId, student_id: studentId }]);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('[addStudentLink] Supabase error:', err.message);
    return false;
  }
};
