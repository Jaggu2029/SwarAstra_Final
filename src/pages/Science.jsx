import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useProgress } from '../context/ProgressContext';
import CategoryCard from '../components/CategoryCard';
import { BookOpen, PenTool, ArrowLeft, Lock, CheckCircle2, PlayCircle, HelpCircle, Target } from 'lucide-react';
import { scienceLevels, generateScienceQuiz } from '../config/scienceLevels.config';
import { fetchMaterials } from '../services/materialService';

const ScienceMenu = () => {
  const { t } = useLocale();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
      <CategoryCard to="/science/learning" title={t('learning') || 'શીખવું'} icon={BookOpen} colorClass="text-primary-science" />
      <CategoryCard to="/science/practice" title={t('practice') || 'પ્રેક્ટિસ'} icon={PenTool} colorClass="text-primary-science" />
    </div>
  );
};

const ScienceLearning = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMaterials('science');
      setMaterials(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary-science text-center">Learning Materials / શીખવાની સામગ્રી</h2>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-primary-science/30 border-t-primary-science rounded-full animate-spin"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary-science" />
          <p className="text-xl">No learning materials available yet.</p>
          <p className="text-sm mt-2">Ask your teacher to upload videos or images!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((m) => (
            <div key={m.id} className="glass-card overflow-hidden rounded-2xl group border border-white/5 hover:border-primary-science/30 transition-all shadow-lg hover:shadow-primary-science/10 flex flex-col">
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



const SciencePractice = () => {
  const { t, locale } = useLocale();
  const { logAttempt, fetchUserProgress, saveUserProgress } = useProgress();
  const timerRef = React.useRef(null);
  
  const [levels, setLevels] = useState(
    scienceLevels.map(l => ({
      level: l.levelNumber,
      title: locale === 'en' ? l.levelName_en : l.levelName_en,
      unlocked: true,
      best_accuracy: 0
    }))
  );
  
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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [locale]);

  const loadProgress = async () => {
    const progress = await fetchUserProgress('science');
    setLevels(scienceLevels.map(l => {
      const p = progress?.find(pr => pr.level === l.levelNumber);
      return {
        level: l.levelNumber,
        title: locale === 'en' ? l.levelName_en : l.levelName_en,
        unlocked: true,
        best_accuracy: p ? p.best_accuracy : 0
      };
    }));
  };

  const startLevel = (levelInfo) => {
    if (!levelInfo.unlocked) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const newQuestions = generateScienceQuiz(levelInfo.level);
    
    setQuestions(newQuestions);
    setActiveLevel(levelInfo.level);
    setCurrentIndex(0);
    setScore(0);
    setIsLevelComplete(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const quitLevel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveLevel(null);
    setIsLevelComplete(false);
    loadProgress();
  };

  const finishLevel = async (finalScore) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const accuracy = (finalScore / QUESTIONS_PER_LEVEL) * 100;
    await saveUserProgress('science', activeLevel, accuracy);
    setIsLevelComplete(true);
  };

  const handleOptionClick = async (option) => {
    if (selectedAnswer !== null) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const correct = option === currentQ.correct_answer_gu;
    const newScore = correct ? score + 1 : score;
    
    setSelectedAnswer(option);
    setIsCorrect(correct);
    if (correct) setScore(newScore);

    await logAttempt({
      module: 'science',
      level: activeLevel,
      operation: currentQ.type,
      question_text_gu: currentQ.question_gu,
      options_gu: currentQ.options_gu,
      correct_answer_gu: currentQ.correct_answer_gu,
      selected_answer_gu: option,
      correct: correct
    });

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (currentIndex + 1 < QUESTIONS_PER_LEVEL && currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        finishLevel(newScore);
      }
    }, 2000);
  };

  const handleNextClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex + 1 < QUESTIONS_PER_LEVEL && currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      finishLevel(score);
    }
  };

  // ---------------- UI Renders ----------------

  if (!activeLevel) {
    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary-science mb-8 text-center">
          {locale === 'en' ? 'Select a Level' : 'લેવલ પસંદ કરો'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {levels.map((l) => (
            <button
              key={l.level}
              onClick={() => startLevel(l)}
              className={`p-6 rounded-2xl flex flex-col gap-4 text-left transition-all ${
                l.unlocked 
                  ? 'glass-card hover:scale-[1.02] hover:bg-white/10 cursor-pointer border-t-4 border-t-primary-science' 
                  : 'bg-black/20 border-2 border-white/5 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl sm:text-2xl font-bold text-white leading-tight">{l.title}</span>
                {l.unlocked ? (
                  l.best_accuracy >= 70 ? <CheckCircle2 className="text-green-500 shrink-0 ml-2" size={28} /> : <PlayCircle className="text-primary-science shrink-0 ml-2" size={28} />
                ) : (
                  <Lock className="text-gray-500 shrink-0 ml-2" size={28} />
                )}
              </div>
              {l.unlocked && (
                <div className="text-sm text-gray-400">
                  {locale === 'en' ? 'Best Accuracy: ' : 'શ્રેષ્ઠ ચોકસાઈ: '} 
                  <span className={l.best_accuracy >= 70 ? 'text-green-400' : 'text-primary-science'}>
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
            {passed ? <CheckCircle2 className="text-green-400 w-16 h-16" /> : <Target className="text-orange-400 w-16 h-16" />}
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
              className="flex-1 px-6 py-4 bg-primary-science text-white rounded-xl font-bold text-lg hover:bg-primary-science/80 transition-transform hover:-translate-y-1 shadow-lg"
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

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;
  
  // Question Type Label
  let typeLabel = '';
  if (currentQ.type === 'mcq') typeLabel = 'MCQ';
  else if (currentQ.type === 'true_false') typeLabel = 'સાચું કે ખોટું (True / False)';
  else if (currentQ.type === 'odd_one_out') typeLabel = 'અલગ શોધો (Odd-One-Out)';

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-400 font-medium text-sm sm:text-base">
          {locale === 'en' ? 'Level' : 'લેવલ'} {activeLevel} &middot; {locale === 'en' ? 'Question' : 'પ્રશ્ન'} {currentIndex + 1} / {QUESTIONS_PER_LEVEL}
        </span>
        <button onClick={quitLevel} className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
          {locale === 'en' ? 'Quit Practice' : 'પ્રેક્ટિસ છોડો'}
        </button>
      </div>

      <div className="glass-card p-6 sm:p-10 flex flex-col items-center gap-8 relative overflow-hidden">
        {/* Progress Bar background */}
        <div 
          className="absolute top-0 left-0 h-1 bg-primary-science/50 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / QUESTIONS_PER_LEVEL) * 100}%` }}
        />

        <div className="inline-flex items-center gap-2 bg-primary-science/20 text-primary-science px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
          <HelpCircle size={16} />
          {typeLabel}
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-white text-center leading-snug">
          {currentQ.question_gu}
        </h2>
        
        <div className={`grid gap-4 w-full ${currentQ.type === 'true_false' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {currentQ.options_gu.map((option, idx) => {
            let btnClass = "bg-[#1e293b]/60 border-2 border-cardBorder hover:bg-white/10 hover:border-primary-science/50 text-white";
            
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
                className={`p-6 rounded-2xl font-semibold text-xl sm:text-2xl transition-all duration-300 flex items-center justify-center text-center ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation */}
        {selectedAnswer && (
          <div className="w-full mt-4 flex flex-col gap-4 animate-fade-in">
            <div className={`text-xl sm:text-2xl font-bold text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect 
                ? (locale === 'en' ? 'Correct!' : 'સાચો જવાબ!') 
                : (locale === 'en' ? 'Incorrect!' : 'ખોટો જવાબ!')}
            </div>
            
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-gray-300 text-lg">
                <span className="text-primary-science font-bold mr-2">
                  {locale === 'en' ? 'Explanation:' : 'સમજૂતી:'}
                </span>
                {currentQ.explanation_gu}
              </p>
            </div>

            <button 
              onClick={handleNextClick}
              className="mx-auto mt-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
            >
              {locale === 'en' ? 'Next Question' : 'આગળનો પ્રશ્ન'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Science = () => {
  const { t } = useLocale();
  const location = useLocation();
  const isRoot = location.pathname === '/science';

  return (
    <div>
      <div className="flex items-center gap-4 mt-4">
        <Link 
          to={isRoot ? "/" : "/science"} 
          className="p-2 glass-card hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={24} className="text-primary-science" />
        </Link>
        <h1 className="text-3xl font-bold text-primary-science">
          {t('category_science')}
        </h1>
      </div>

      <Routes>
        <Route path="/" element={<ScienceMenu />} />
        <Route path="learning" element={<ScienceLearning />} />
        <Route path="practice" element={<SciencePractice />} />
      </Routes>
    </div>
  );
};

export default Science;
