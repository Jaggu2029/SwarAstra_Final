# SwarAstra

SwarAstra is an ISL-based Gujarati learning platform tailored for deaf and mute students.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the project with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Supabase Database
1. Go to your Supabase project's SQL Editor.
2. Copy the contents of `supabase/schema.sql` and run it to create tables and RLS policies.
3. Copy the contents of `supabase/seed.sql` and run it to insert mock data for the learning modules.

### 4. Deploy AI Tutor Edge Function
1. Install the Supabase CLI if you haven't already.
2. Link your project: `supabase link --project-ref your_project_ref`
3. Set the Anthropic API key as a secret: `supabase secrets set ANTHROPIC_API_KEY=your-api-key`
4. Deploy the function: `supabase functions deploy ask-tutor`

### 5. Run the Application
```bash
npm run dev
```

## Features
*   **Bilingual Support**: Toggle between English and Gujarati globally.
*   **Sign Language**: Interactive grid to learn ISL with Gujarati translations, plus a drawing pad for practice.
*   **Maths**: Auto-generated/Fetched math problems in Gujarati numerals.
*   **Science**: Multiple choice practice for science topics.
*   **Progress Report**: Visualization of learning accuracy and progress. Access differs by user role (Student vs Teacher/Parent).
*   **AI Tutor**: An Anthropic-powered AI chatbot available across the application.
