import { supabase } from './supabaseClient';

const MODEL_API = (import.meta.env.VITE_SIGN_MODEL_API || 'http://localhost:5000').replace(/\/$/, '');

export const askAiTutor = async (question) => {
  // First attempt: Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('ask-tutor', {
      body: { question },
    });
    if (!error && data?.answer) {
      return data.answer;
    }
  } catch (err) {
    console.warn("Supabase ask-tutor edge function unavailable, trying local tutor service:", err);
  }

  // Fallback attempt: Local API server /ask-tutor endpoint
  try {
    const res = await fetch(`${MODEL_API}/ask-tutor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer) return data.answer;
    }
  } catch (err) {
    console.error("Local AI Tutor API error:", err);
  }

  return "SwarAstra AI Tutor is here to help! Keep practicing your Gujarati Sign Language, Maths, and Science modules.";
};

