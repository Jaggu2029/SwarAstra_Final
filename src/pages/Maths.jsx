import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useProgress } from '../context/ProgressContext';
import CategoryCard from '../components/CategoryCard';
import { BookOpen, PenTool, ArrowLeft, Lock, CheckCircle2, PlayCircle, TrendingUp } from 'lucide-react';
import { generateMathProblem } from '../utils/mathGenerator';
import { fetchMaterials } from '../services/materialService';

const MathsMenu = () => {
  const { t } = useLocale();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
      <CategoryCard to="/maths/learning" title={t('learning') || 'શીખવું'} icon={BookOpen} colorClass="text-primary-maths" />
      <CategoryCard to="/maths/practice" title={t('practice') || 'પ્રેક્ટિસ'} icon={PenTool} colorClass="text-primary-maths" />
    </div>
  );
};

const MathsLearning = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMaterials('maths');
      setMaterials(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary-maths text-center">Learning Materials / શીખવાની સામગ્રી</h2>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-primary-maths/30 border-t-primary-maths rounded-full animate-spin"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary-maths" />
          <p className="text-xl">No learning materials available yet.</p>
          <p className="text-sm mt-2">Ask your teacher to upload videos or images!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((m) => (
            <div key={m.id} className="glass-card overflow-hidden rounded-2xl group border border-white/5 hover:border-primary-maths/30 transition-all shadow-lg hover:shadow-primary-maths/10 flex flex-col">
              <div className="aspect-video bg-black/60 relative flex items-center justify-center overflow-hidden">
                {m.file_type === 'video' ? (
                  <video src={m.file_url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={m.file_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-lg text-white mb-3 leading-tight">{m.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-auto">
                  <span className="uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded-md border border-white/10">
                    {m.file_type}
                  </span>
                  <span>•</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MathsPractice = () => {
  const { t, locale } = useLocale();
  const { logAttempt, fetchUserProgress, saveUserProgress } = useProgress();
  const [levels, setLevels] = useState([
    { level: 1, title: 'Level 1 (Addition)', unlocked: true, best_accuracy: 0 },
    { level: 2, title: 'Level 2 (Large Addition)', unlocked: true, best_accuracy: 0 },
    { level: 3, title: 'Level 3 (Subtraction)', unlocked: true, best_accuracy: 0 },
    { level: 4, title: 'Level 4 (Multiplication)', unlocked: true, best_accuracy: 0 },
  ]);
  
  const [activeLevel, setActiveLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const QUESTIONS_PER_LEVEL = 10;

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await fetchUserProgress('maths');
    if (progress && progress.length > 0) {
      setLevels(prev => prev.map(l => {
        const p = progress.find(pr => pr.level === l.level);
        if (p) {
          return { ...l, unlocked: true, best_accuracy: p.best_accuracy };
        }
        return l;
      }));
    }
  };

  const startLevel = (levelInfo) => {
    if (!levelInfo.unlocked) return;
    
    // Generate 10 questions for the level
    const newQuestions = Array.from({ length: QUESTIONS_PER_LEVEL }, () => generateMathProblem(levelInfo.level));
    
    setQuestions(newQuestions);
    setActiveLevel(levelInfo.level);
    setCurrentIndex(0);
    setScore(0);
    setIsLevelComplete(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const quitLevel = () => {
    setActiveLevel(null);
    setIsLevelComplete(false);
    loadProgress();
  };

  const handleOptionClick = async (option) => {
    if (selectedAnswer !== null) return;

    const currentQ = questions[currentIndex];
    const correct = option === currentQ.correct_answer_gu;
    const newScore = correct ? score + 1 : score;
    
    setSelectedAnswer(option);
    setIsCorrect(correct);
    if (correct) setScore(newScore);

    await logAttempt({
      module: 'maths',
      level: currentQ.level,
      operation: currentQ.operation,
      question_text_gu: currentQ.question_text_gu,
      options_gu: currentQ.options_gu,
      correct_answer_gu: currentQ.correct_answer_gu,
      selected_answer_gu: option,
      correct: correct
    });

    setTimeout(() => {
      if (currentIndex + 1 < QUESTIONS_PER_LEVEL) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        finishLevel(newScore);
      }
    }, 1500);
  };

  const finishLevel = async (finalScore) => {
    const accuracy = (finalScore / QUESTIONS_PER_LEVEL) * 100;
    await saveUserProgress('maths', activeLevel, accuracy);
    setIsLevelComplete(true);
  };

  // Level Select Screen
  if (!activeLevel) {
    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary-maths mb-8 text-center">
          {locale === 'en' ? 'Select a Level' : 'લેવલ પસંદ કરો'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {levels.map((l) => (
            <button
              key={l.level}
              onClick={() => startLevel(l)}
              className={`p-6 rounded-2xl flex flex-col gap-4 text-left transition-all ${
                l.unlocked 
                  ? 'glass-card hover:scale-[1.02] hover:bg-white/10 cursor-pointer' 
                  : 'bg-black/20 border-2 border-white/5 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{l.title}</span>
                {l.unlocked ? (
                  l.best_accuracy >= 70 ? <CheckCircle2 className="text-green-500" size={28} /> : <PlayCircle className="text-primary-maths" size={28} />
                ) : (
                  <Lock className="text-gray-500" size={28} />
                )}
              </div>
              {l.unlocked && (
                <div className="text-sm text-gray-400">
                  {locale === 'en' ? 'Best Accuracy: ' : 'શ્રેષ્ઠ ચોકસાઈ: '} 
                  <span className={l.best_accuracy >= 70 ? 'text-green-400' : 'text-primary-maths'}>
                    {l.best_accuracy}%
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Level Complete Screen
  if (isLevelComplete) {
    const accuracy = (score / QUESTIONS_PER_LEVEL) * 100;
    const passed = accuracy >= 70;
    
    return (
      <div className="mt-8 max-w-xl mx-auto text-center animate-fade-in">
        <div className="glass-card p-8 sm:p-10 flex flex-col items-center gap-6 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className={`absolute top-0 w-full h-2 ${passed ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          <div className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${passed ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          
          <div className={`w-28 h-28 rounded-full flex items-center justify-center bg-black/40 border-4 shadow-2xl z-10 ${passed ? 'border-green-500/50 shadow-green-500/20' : 'border-orange-500/50 shadow-orange-500/20'}`}>
            {passed ? <CheckCircle2 className="text-green-400 w-16 h-16" /> : <TrendingUp className="text-orange-400 w-16 h-16" />}
          </div>
          
          <div className="z-10 text-center">
            <h2 className={`text-4xl font-extrabold mb-2 ${passed ? 'text-green-400' : 'text-orange-400'}`}>
              {passed 
                ? (locale === 'en' ? 'Level Passed!' : 'લેવલ પાર કર્યું!') 
                : (locale === 'en' ? 'Keep Practicing!' : 'પ્રેક્ટિસ ચાલુ રાખો!')}
            </h2>
            <p className="text-gray-300">
              {passed 
                ? (locale === 'en' ? 'Great job! You have unlocked the next level.' : 'ખૂબ સરસ! તમે આગલું લેવલ અનલૉક કર્યું છે.')
                : (locale === 'en' ? 'You need 70% to pass. Try again!' : 'તમારે 70% ની જરૂર છે. ફરી પ્રયાસ કરો!')}
            </p>
          </div>

          <div className="bg-black/30 rounded-2xl p-6 w-full max-w-sm border border-white/5 z-10 my-4 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-medium uppercase tracking-wider text-sm">Accuracy</span>
              <span className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-orange-400'}`}>{Math.round(accuracy)}%</span>
            </div>
            
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${passed ? 'bg-green-500' : 'bg-orange-500'}`} 
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="text-gray-400">Score</span>
              <span className="text-white font-bold">{score} / {QUESTIONS_PER_LEVEL}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-2 z-10">
            <button 
              onClick={quitLevel}
              className="flex-1 px-6 py-4 bg-primary-maths text-white rounded-xl font-bold text-lg hover:bg-primary-maths/80 transition-transform hover:-translate-y-1 shadow-lg"
            >
              {locale === 'en' ? 'Continue' : 'આગળ વધો'}
            </button>
            <Link 
              to="/progress-report"
              className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-transform hover:-translate-y-1 border border-white/10 flex items-center justify-center gap-2"
            >
              {locale === 'en' ? 'View Progress Card' : 'પ્રગતિ રિપોર્ટ જુઓ'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MCQ Practice Screen
  const currentQ = questions[currentIndex];
  
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-400 font-medium">
          {locale === 'en' ? 'Question' : 'પ્રશ્ન'} {currentIndex + 1} / {QUESTIONS_PER_LEVEL}
        </span>
        <button onClick={quitLevel} className="text-gray-400 hover:text-white transition-colors">
          {locale === 'en' ? 'Quit Practice' : 'પ્રેક્ટિસ છોડો'}
        </button>
      </div>

      <div className="glass-card p-8 sm:p-12 flex flex-col items-center gap-10">
        <h2 className="text-5xl sm:text-7xl font-bold text-primary-maths tracking-widest text-center">
          {currentQ.question_text_gu}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentQ.options_gu.map((option, idx) => {
            let btnClass = "bg-[#1e293b]/60 border-2 border-cardBorder hover:bg-white/10 hover:border-primary-maths/50 text-white";
            
            if (selectedAnswer) {
              if (option === currentQ.correct_answer_gu) {
                btnClass = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
              } else if (option === selectedAnswer) {
                btnClass = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
              } else {
                btnClass = "bg-black/20 border-white/5 text-gray-500 opacity-50";
              }
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={selectedAnswer !== null}
                className={`py-8 rounded-2xl font-bold text-4xl transition-all duration-300 ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className={`text-2xl font-bold animate-pulse ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect 
              ? (locale === 'en' ? 'Correct!' : 'સાચો જવાબ!') 
              : (locale === 'en' ? 'Incorrect!' : 'ખોટો જવાબ!')}
          </div>
        )}
      </div>
    </div>
  );
};

const Maths = () => {
  const { t } = useLocale();
  const location = useLocation();
  const isRoot = location.pathname === '/maths';

  return (
    <div>
      <div className="flex items-center gap-4 mt-4">
        <Link 
          to={isRoot ? "/" : "/maths"} 
          className="p-2 glass-card hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={24} className="text-primary-maths" />
        </Link>
        <h1 className="text-3xl font-bold text-primary-maths">
          {t('category_maths')}
        </h1>
      </div>

      <Routes>
        <Route path="/" element={<MathsMenu />} />
        <Route path="learning" element={<MathsLearning />} />
        <Route path="practice" element={<MathsPractice />} />
      </Routes>
    </div>
  );
};

export default Maths;
