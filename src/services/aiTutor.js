import { supabase } from './supabaseClient';

const MODEL_API = (import.meta.env.VITE_SIGN_MODEL_API || 'http://localhost:5000').replace(/\/$/, '');

export const askAiTutor = async (question) => {
  // Using the Python backend API for AI Tutor chat
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
    } else {
      console.error("AI Tutor API returned an error:", res.status);
    }
  } catch (err) {
    console.error("AI Tutor network error:", err);
  }

  return "SwarAstra AI Tutor is here to help! Keep practicing your Gujarati Sign Language, Maths, and Science modules.";
};

