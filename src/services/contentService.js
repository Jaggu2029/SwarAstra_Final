import { supabase } from './supabaseClient';

export const getSignContent = async (category) => {
  const { data, error } = await supabase
    .from('content_signs')
    .select('*')
    .eq('category', category)
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const getMathsContent = async (type) => {
  const { data, error } = await supabase
    .from('content_maths')
    .select('*')
    .eq('type', type);
  if (error) throw error;
  return data;
};

export const getScienceContent = async () => {
  const { data, error } = await supabase
    .from('content_science')
    .select('*');
  if (error) throw error;
  return data;
};
