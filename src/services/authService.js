import { supabase } from './supabaseClient';

export const signUpUser = async (email, password, fullName, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        { id: data.user.id, full_name: fullName, role }
      ], { onConflict: 'id' });
      
    if (profileError) throw profileError;
  }
  
  return data;
};

export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) throw error;
  return data; // returns null if no profile exists (instead of throwing 406)
};

