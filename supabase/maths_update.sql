-- Drop old attempts table
DROP TABLE IF EXISTS attempts;

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

-- Detailed Attempts (Recreated with new columns)
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
