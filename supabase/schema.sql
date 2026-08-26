-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (Extended Auth User Data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('student', 'teacher', 'parent', 'hr')),
  full_name TEXT NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Student-Teacher/Parent linkages
CREATE TABLE student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  linked_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(student_id, linked_user_id)
);

-- Enable RLS on student_links
ALTER TABLE student_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Linked users can view links"
ON student_links FOR SELECT
USING (auth.uid() = student_id OR auth.uid() = linked_user_id);

-- Content: Sign Language
CREATE TABLE content_signs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT, -- 'alphabet', 'number'
  sign_text_en TEXT,
  sign_text_gu TEXT,
  media_url TEXT,
  description_en TEXT,
  description_gu TEXT
);

-- Enable RLS on content_signs
ALTER TABLE content_signs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content_signs"
ON content_signs FOR SELECT
USING (true);

-- Content: Maths
CREATE TABLE content_maths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT, -- 'table', 'addition', 'subtraction', 'division'
  problem_gu TEXT,
  solution_gu TEXT
);

-- Enable RLS on content_maths
ALTER TABLE content_maths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content_maths"
ON content_maths FOR SELECT
USING (true);

-- Content: Science
CREATE TABLE content_science (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_en TEXT,
  question_gu TEXT,
  options_json JSONB,
  correct_answer_index INTEGER
);

-- Enable RLS on content_science
ALTER TABLE content_science ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content_science"
ON content_science FOR SELECT
USING (true);

-- Progress Tracking (Unlocked levels per user)
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module TEXT NOT NULL, -- 'maths', 'sign_language', 'science'
  level INTEGER NOT NULL,
  unlocked BOOLEAN DEFAULT false,
  best_accuracy NUMERIC(5,2) DEFAULT 0,
  last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module, level)
);

-- Enable RLS on progress
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own progress"
ON progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress"
ON progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Linked users can view student progress"
ON progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_links
    WHERE student_links.student_id = progress.user_id
    AND student_links.linked_user_id = auth.uid()
  )
);

-- Detailed Attempts
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module TEXT, -- 'maths', 'sign_language', 'science'
  level INTEGER,
  operation TEXT,
  question_text_gu TEXT,
  options_gu JSONB,
  correct_answer_gu TEXT,
  selected_answer_gu TEXT,
  item_id UUID, -- References the specific content ID for non-dynamic questions
  correct BOOLEAN,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on attempts
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own attempts"
ON attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own attempts"
ON attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Linked users (parents/teachers) can view student attempts"
ON attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_links
    WHERE student_links.student_id = attempts.user_id
    AND student_links.linked_user_id = auth.uid()
  )
);
