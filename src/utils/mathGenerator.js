const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

export const toGujaratiNumeral = (num) => {
  return String(num).split('').map(digit => {
    return /[0-9]/.test(digit) ? gujaratiDigits[parseInt(digit, 10)] : digit;
  }).join('');
};

export const fromGujaratiNumeral = (str) => {
  return String(str).split('').map(char => {
    const idx = gujaratiDigits.indexOf(char);
    return idx !== -1 ? String(idx) : char;
  }).join('');
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Generate 3 plausible distractors for a correct integer answer
const generateDistractors = (correctAnswer) => {
  const distractors = new Set();
  
  // Try to generate 3 unique distractors
  while (distractors.size < 3) {
    const rand = Math.random();
    let distractor;
    
    if (rand < 0.33) {
      // Off by one (up or down)
      distractor = correctAnswer + (Math.random() < 0.5 ? 1 : -1);
    } else if (rand < 0.66 && correctAnswer > 10) {
      // Transposed digits if > 10 (e.g. 42 -> 24)
      const str = String(correctAnswer);
      if (str.length === 2 && str[0] !== str[1]) {
        distractor = parseInt(str[1] + str[0], 10);
      } else {
        // Fallback: off by 10
        distractor = correctAnswer + (Math.random() < 0.5 ? 10 : -10);
      }
    } else {
      // Off by 2 or random nearby
      const diff = Math.floor(Math.random() * 5) + 2;
      distractor = correctAnswer + (Math.random() < 0.5 ? diff : -diff);
    }
    
    // Ensure distractor is positive and not equal to correct answer
    if (distractor > 0 && distractor !== correctAnswer) {
      distractors.add(distractor);
    }
  }
  
  return Array.from(distractors);
};

export const generateMathProblem = (level) => {
  let a, b, answer, operation, operatorSymbol;
  
  switch(level) {
    case 1:
      // Level 1: 1-digit addition
      a = Math.floor(Math.random() * 9) + 1; // 1-9
      b = Math.floor(Math.random() * 9) + 1;
      answer = a + b;
      operation = 'addition';
      operatorSymbol = '+';
      break;
    case 2:
      // Level 2: 2-digit addition
      a = Math.floor(Math.random() * 41) + 10; // 10-50
      b = Math.floor(Math.random() * 41) + 10;
      answer = a + b;
      operation = 'addition';
      operatorSymbol = '+';
      break;
    case 3:
      // Level 3: 1-digit subtraction
      a = Math.floor(Math.random() * 5) + 5; // 5-9
      b = Math.floor(Math.random() * a) + 1; // 1 to a
      answer = a - b;
      operation = 'subtraction';
      operatorSymbol = '-';
      break;
    case 4:
    default:
      // Level 4: Basic multiplication
      a = Math.floor(Math.random() * 9) + 2; // 2-10
      b = Math.floor(Math.random() * 5) + 1; // 1-5
      answer = a * b;
      operation = 'multiplication';
      operatorSymbol = 'x';
      break;
  }

  const problemText = `${toGujaratiNumeral(a)} ${operatorSymbol} ${toGujaratiNumeral(b)} = ?`;
  const correctAnswerGu = toGujaratiNumeral(answer);
  
  const distractors = generateDistractors(answer);
  const options = [answer, ...distractors].map(toGujaratiNumeral);
  const shuffledOptionsGu = shuffleArray(options);

  return {
    level,
    operation,
    question_text_gu: problemText,
    correct_answer_gu: correctAnswerGu,
    options_gu: shuffledOptionsGu
  };
};
