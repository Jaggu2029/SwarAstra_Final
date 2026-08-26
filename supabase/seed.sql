-- Seed data for SwarAstra

-- Content: Sign Language (Alphabets and Numbers)
INSERT INTO content_signs (category, sign_text_en, sign_text_gu, media_url, description_en, description_gu) VALUES
('alphabet', 'ka', 'ક', 'https://placeholder.com/ka.png', 'Consonant Ka', 'વ્યંજન ક'),
('alphabet', 'kha', 'ખ', 'https://placeholder.com/kha.png', 'Consonant Kha', 'વ્યંજન ખ'),
('alphabet', 'ga', 'ગ', 'https://placeholder.com/ga.png', 'Consonant Ga', 'વ્યંજન ગ'),
('alphabet', 'gha', 'ઘ', 'https://placeholder.com/gha.png', 'Consonant Gha', 'વ્યંજન ઘ'),
('alphabet', 'cha', 'ચ', 'https://placeholder.com/cha.png', 'Consonant Cha', 'વ્યંજન ચ'),
('number', '1', '૧', 'https://placeholder.com/1.png', 'Number 1', 'અંક ૧'),
('number', '2', '૨', 'https://placeholder.com/2.png', 'Number 2', 'અંક ૨');

-- Content: Maths
INSERT INTO content_maths (type, problem_gu, solution_gu) VALUES
('addition', '૨ + ૩ = ?', '૫'),
('addition', '૪ + ૪ = ?', '૮'),
('subtraction', '૫ - ૨ = ?', '૩'),
('table', '૨ x ૧ = ?', '૨');

-- Content: Science
INSERT INTO content_science (question_en, question_gu, options_json, correct_answer_index) VALUES
(
  'What is the color of the sky?', 
  'આકાશનો રંગ કયો છે?', 
  '["Red/લાલ", "Blue/વાદળી", "Green/લીલો"]', 
  1
),
(
  'Which organ pumps blood?', 
  'કયું અંગ લોહી પમ્પ કરે છે?', 
  '["Brain/મગજ", "Heart/હૃદય", "Lungs/ફેફસાં"]', 
  1
);
