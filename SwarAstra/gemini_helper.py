"""
Wrapper around the Google Gemini API for SwarAstra AI features:
    - Live "Ask AI Tutor" doubt-solving box
    - Personalized performance feedback summary

Reads GEMINI_API_KEY or VITE_GEMINI_API_KEY from .env or environment variables.
"""

import os
from dotenv import load_dotenv, find_dotenv
from google import genai

# Load .env file automatically
load_dotenv(find_dotenv(usecwd=True))

MODEL_NAMES = ["gemini-flash-lite-latest", "gemini-3.7-flash", "gemini-3.6-flash"]


_client = None


def get_api_key():
    load_dotenv(find_dotenv(usecwd=True), override=True)
    return (
        os.environ.get("GEMINI_API_KEY") or
        os.environ.get("VITE_GEMINI_API_KEY") or
        os.environ.get("GOOGLE_API_KEY")
    )


def get_client():
    global _client
    api_key = get_api_key()
    if not api_key:
        return None
    if _client is None or getattr(_client, '_current_key', None) != api_key:
        _client = genai.Client(api_key=api_key)
        _client._current_key = api_key
    return _client



def ask_gemini(prompt: str) -> str:
    """Sends a prompt to Gemini and returns the dynamic AI response.
    Returns a friendly message if API key is missing or on error."""
    client = get_client()
    if not client:
        return (
            "🔑 AI Tutor requires a Gemini API key. "
            "Please add GEMINI_API_KEY=your_key in your .env file to enable live AI responses!"
        )

    system_instruction = (
        "You are a warm, friendly tutor for deaf and mute students on SwarAstra, "
        "a Gujarati Sign Language (GSL), Maths, and Science learning platform. "
        "Answer questions simply, accurately, encouragingly, and concisely. "
        "IMPORTANT: You MUST provide your answer first in English, followed by the exact translation in Gujarati. "
        "The Gujarati translation MUST be written in the native Gujarati script (ગુજરાતી લિપિ), NEVER in Latin/English letters (Gujlish). "
        "CRITICAL: Do NOT include labels like 'English:' or 'Gujarati:'. Just provide the English text, a blank line, and then the Gujarati text. "
        "Do NOT use markdown bold symbols or double asterisks like **. Use plain, clean text only."
    )
    full_prompt = f"{system_instruction}\n\nStudent Question: {prompt}"

    for model_name in MODEL_NAMES:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=full_prompt,
            )
            if response and hasattr(response, 'text') and response.text:
                clean_text = response.text.replace('**', '').strip()
                return clean_text
        except Exception as e:
            print(f"Gemini API model {model_name} error: {e}")
            continue


    return "AI Tutor is temporarily unable to answer right now. Please check your Gemini API key or try again in a moment."


def generate_feedback(student_name: str, results: list) -> str:
    """results: list of (subject, score, total) tuples."""
    lines = [f"{subject}: {score}/{total}" for subject, score, total in results]
    results_text = "\n".join(lines)
    prompt = (
        f"You are a warm, encouraging tutor for a deaf/mute student named {student_name} "
        f"learning Gujarati Sign Language, Math, and Science.\n"
        f"Here are their test results:\n{results_text}\n\n"
        f"Write a short (3-4 sentences), encouraging, simple-language summary of how they did, "
        f"praise their strengths, and give one gentle tip for what to practice next. "
        f"Keep it warm and age-appropriate."
    )
    return ask_gemini(prompt)

