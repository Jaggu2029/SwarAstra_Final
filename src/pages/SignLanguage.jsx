import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useProgress } from '../context/ProgressContext';
import { getSignContent } from '../services/contentService';
import { checkModelHealth, predictSign, getApiBaseUrl } from '../services/signModelService';
import CategoryCard from '../components/CategoryCard';
import { BookOpen, PenTool, TrendingUp, ArrowLeft, Search, Camera, Video, VideoOff, Upload, RefreshCw, Sparkles, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SignMenu = () => {
  const { t } = useLocale();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginTop: 32 }}>
      <CategoryCard to="/sign-language/learning" title={t('learning')} icon={BookOpen} />
      <CategoryCard to="/sign-language/practice" title={t('practice')} icon={PenTool} />
    </div>
  );
};

const SignImageCard = ({ item, locale }) => {
  const [error, setError] = useState(false);

  return (
    <div className="glass-card p-6 flex flex-col items-center gap-6 hover:scale-[1.02] transition-transform">
      <div className="w-full max-w-2xl aspect-video bg-black/50 rounded-lg flex items-center justify-center overflow-hidden relative group shadow-lg">
        {!error ? (
          <img 
            src={`/${item.sign_text_en.toLowerCase()}.jpg`} 
            alt={`${item.sign_text_en} sign`} 
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="text-6xl text-white">{locale === 'en' ? item.sign_text_en : item.sign_text_gu}</div>
        )}
      </div>
      <div className="text-center">
        <p className="font-bold text-3xl text-primary-sign mb-2">{locale === 'en' ? item.sign_text_en : item.sign_text_gu}</p>
        <p className="text-lg text-gray-300">{locale === 'en' ? item.description_en : item.description_gu}</p>
      </div>
    </div>
  );
};

// Inner image renderer for carousel (shows image or large letter fallback)
const SignImageInner = ({ item, locale }) => {
  const [error, setError] = useState(false);
  return !error ? (
    <img
      src={`/${item.sign_text_en?.toLowerCase()}.jpg`}
      alt={`${item.sign_text_en} sign`}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  ) : (
    <div style={{ fontSize: 120, fontWeight: 900, color: '#06b6d4', fontFamily: 'Noto Sans Gujarati, sans-serif', lineHeight: 1 }}>
      {locale === 'en' ? item.sign_text_en : item.sign_text_gu}
    </div>
  );
};



const SignLearning = () => {
  const { locale } = useLocale();
  const [content, setContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getSignContent('alphabet').then(setContent).catch(console.error);
  }, []);

  const filteredContent = content.filter(item => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.sign_text_en && item.sign_text_en.toLowerCase().includes(q)) ||
      (item.sign_text_gu && item.sign_text_gu.includes(searchTerm.trim())) ||
      (item.description_en && item.description_en.toLowerCase().includes(q)) ||
      (item.description_gu && item.description_gu.includes(searchTerm.trim()))
    );
  });

  const activeIndex = Math.min(index, Math.max(0, filteredContent.length - 1));

  if (content.length === 0) {
    return (
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "32px 48px", background: "#141414", border: "1px solid #262626", borderRadius: 20, color: "#666" }}>Loading signs...</div>
      </div>
    );
  }

  const item = filteredContent[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === filteredContent.length - 1;

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Search Input */}
      <div style={{ width: "100%", maxWidth: 680, position: "relative" }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666" }}>
          <Search size={18} />
        </div>
        <input
          type="text"
          lang="gu"
          placeholder="Search signs / સંકેતો શોધો..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIndex(0);
          }}
          className="input-field"
          style={{ paddingLeft: 46, paddingRight: 16, height: 48, borderRadius: 14, fontSize: 15 }}
        />
      </div>

      {filteredContent.length === 0 ? (
        <div style={{ padding: "40px 24px", background: "#141414", border: "1px solid #262626", borderRadius: 20, textAlign: "center", color: "#666", width: "100%", maxWidth: 680 }}>
          No signs found matching "{searchTerm}"
        </div>
      ) : (
        <>
          {/* Counter */}
          <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, margin: 0 }}>
            {activeIndex + 1} / {filteredContent.length}
          </p>

          {/* Main card */}
          <div style={{ width: "100%", maxWidth: 680, background: "#141414", border: "1px solid #262626", borderRadius: 20, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 32, position: "relative", overflow: "hidden" }}>
            {/* Subtle glow */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(106,76,245,0.04), transparent)", pointerEvents: "none" }} />

            {/* Sign image */}
            <div style={{ width: "100%", aspectRatio: "16/9", background: "#0d0d0d", borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #1c1c1c", position: "relative" }}>
              <SignImageInner item={item} locale={locale} />
            </div>
            {/* Label */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 800, fontSize: 56, color: "#6a4cf5", letterSpacing: "-2px", lineHeight: 1, margin: 0 }}>
                {locale === 'en' ? item.sign_text_en : item.sign_text_gu}
              </p>
              <p style={{ fontSize: 16, color: "#999", marginTop: 12, letterSpacing: "-0.1px" }}>
                {locale === 'en' ? item.description_en : item.description_gu}
              </p>
            </div>
          </div>

          {/* Arrow Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 8 }}>
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={isFirst}
              style={{
                width: 60, height: 60, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: isFirst ? "#333" : "#fff",
                border: isFirst ? "2px solid #1c1c1c" : "2px solid rgba(106,76,245,0.5)",
                background: isFirst ? "#0f0f0f" : "rgba(106,76,245,0.12)",
                cursor: isFirst ? "not-allowed" : "pointer",
                transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.background="rgba(106,76,245,0.25)"; e.currentTarget.style.transform="scale(1.1)"; }}}
              onMouseLeave={e => { e.currentTarget.style.background=isFirst?"#0f0f0f":"rgba(106,76,245,0.12)"; e.currentTarget.style.transform="scale(1)"; }}
              aria-label="Previous sign"
            >←</button>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {filteredContent.slice(Math.max(0, activeIndex-4), Math.min(filteredContent.length, activeIndex+5)).map((_, i) => {
                const ri = Math.max(0, activeIndex-4) + i;
                return (
                  <button key={ri} onClick={() => setIndex(ri)} style={{
                    borderRadius: 100, border: "none", cursor: "pointer", transition: "all 0.2s",
                    width: ri === activeIndex ? 24 : 8, height: ri === activeIndex ? 10 : 8,
                    background: ri === activeIndex ? "#6a4cf5" : "rgba(255,255,255,0.15)",
                  }} />
                );
              })}
            </div>

            <button
              onClick={() => setIndex(i => Math.min(filteredContent.length - 1, i + 1))}
              disabled={isLast}
              style={{
                width: 60, height: 60, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: isLast ? "#333" : "#fff",
                border: isLast ? "2px solid #1c1c1c" : "2px solid rgba(106,76,245,0.5)",
                background: isLast ? "#0f0f0f" : "rgba(106,76,245,0.12)",
                cursor: isLast ? "not-allowed" : "pointer",
                transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => { if (!isLast) { e.currentTarget.style.background="rgba(106,76,245,0.25)"; e.currentTarget.style.transform="scale(1.1)"; }}}
              onMouseLeave={e => { e.currentTarget.style.background=isLast?"#0f0f0f":"rgba(106,76,245,0.12)"; e.currentTarget.style.transform="scale(1)"; }}
              aria-label="Next sign"
            >→</button>
          </div>
          <p style={{ fontSize: 12, color: "#444", marginTop: 4, letterSpacing: "-0.1px" }}>
            Use search, arrows or dots to navigate · {filteredContent.length} signs
          </p>
        </>
      )}
    </div>
  );
};


const SAMPLE_CHALLENGES = [
  { label: 'ja', gu: 'જ', name: 'Ja' },
  { label: 'ka', gu: 'ક', name: 'Ka' },
  { label: 'kha', gu: 'ખ', name: 'Kha' },
  { label: 'la', gu: 'લ', name: 'La' },
  { label: 'va', gu: 'વ', name: 'Va' },
  { label: 'jha', gu: 'ઝ', name: 'Zha' },
  { label: 'ha', gu: 'હ', name: 'Ha' },
  { label: 'pha', gu: 'ફ', name: 'Pha' },
  { label: 'tha', gu: 'થ', name: 'Tha' },
  { label: 'tthaaa', gu: 'ઠ', name: 'Tha' },
  
  // Remaining signs
  { label: 'ga', gu: 'ગ', name: 'Ga' },
  { label: 'gha', gu: 'ઘ', name: 'Gha' },
  { label: 'cha', gu: 'ચ', name: 'Cha' },
  { label: 'ta', gu: 'ત', name: 'Ta' },
  { label: 'da', gu: 'દ', name: 'Da' },
  { label: 'na', gu: 'ન', name: 'Na' },
  { label: 'pa', gu: 'પ', name: 'Pa' },
  { label: 'ma', gu: 'મ', name: 'Ma' },
  { label: 'sa', gu: 'સ', name: 'Sa' },
  { label: 'ra', gu: 'ર', name: 'Ra' },
];

const SignPractice = () => {
  const { locale } = useLocale();
  const { logAttempt } = useProgress();

  const [apiStatus, setApiStatus] = useState('checking'); // checking | warming | ok | offline
  const [warmupProgress, setWarmupProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Capture mode states
  const [capturedImageURL, setCapturedImageURL] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);

  // Challenge mode
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeMatched, setChallengeMatched] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const warmupTimerRef = useRef(null);

  const verifyApi = async () => {
    setApiStatus('checking');
    setWarmupProgress(0);

    try {
      const quickRes = await Promise.race([
        checkModelHealth(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('slow')), 2000)),
      ]);
      if (quickRes?.status === 'ok') {
        setApiStatus('ok');
        return;
      }
    } catch {
      // Server is cold — show warm-up UI
    }

    setApiStatus('warming');
    let progress = 5;
    warmupTimerRef.current = setInterval(() => {
      progress = Math.min(progress + 2, 90);
      setWarmupProgress(progress);
    }, 1000);

    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const res = await checkModelHealth();
      if (res?.status === 'ok') {
        clearInterval(warmupTimerRef.current);
        setWarmupProgress(100);
        setTimeout(() => setApiStatus('ok'), 400);
        return;
      }
    }
    clearInterval(warmupTimerRef.current);
    setApiStatus('ok');
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not access webcam. Please check browser camera permissions.');
    }
  };

  useEffect(() => {
    verifyApi().then(() => {
      startCamera();
    });
    return () => {
      stopCamera();
      if (warmupTimerRef.current) clearInterval(warmupTimerRef.current);
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    // Draw mirrored so it matches what the user sees
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImageURL(dataUrl);
    
    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
    }, 'image/jpeg', 0.9);
    
    setCurrentPrediction(null);
    setChallengeMatched(false);
  };

  const handleRetake = () => {
    setCapturedImageURL(null);
    setCapturedBlob(null);
    setCurrentPrediction(null);
    setChallengeMatched(false);
  };

  const handleVerify = async () => {
    if (!capturedBlob) return;
    setIsAnalyzing(true);
    
    try {
      const result = await predictSign(capturedBlob);
      setCurrentPrediction(result);
      
      const target = SAMPLE_CHALLENGES[challengeIndex];
      
      if (
        result.hand_detected &&
        result.label &&
        target &&
        result.label.toLowerCase() === target.label.toLowerCase() &&
        result.confidence >= 0.55
      ) {
        setChallengeMatched(true);
        setScore(s => s + 10);
        if (logAttempt) {
          logAttempt({ module: 'sign_language', level: 1, correct: true, label: target.label });
        }
      } else {
        setFailedAttempts(f => f + 1);
        if (logAttempt) {
          logAttempt({ module: 'sign_language', level: 1, correct: false, label: target.label });
        }
      }
    } catch (err) {
      console.error('Prediction error:', err);
      alert('Error analyzing image. Please ensure the Sign Language AI backend is online.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextChallenge = () => {
    handleRetake();
    setFailedAttempts(0);
    setChallengeIndex(i => (i + 1) % SAMPLE_CHALLENGES.length);
  };

  const targetChallenge = SAMPLE_CHALLENGES[challengeIndex];

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Backend Connection Status Pill Removed as requested */}

      {/* Challenge Mode Prompt Header */}
      {targetChallenge && (
        <div style={{ width: "100%", maxWidth: 680, background: "linear-gradient(135deg, rgba(106,76,245,0.15), rgba(212,77,240,0.15))", border: "1px solid rgba(106,76,245,0.4)", borderRadius: 18, padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Target Sign Challenge</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", margin: "6px 0" }}>
            Show Sign for: <span style={{ color: "#6a4cf5" }}>{targetChallenge.gu}</span> ({targetChallenge.name})
          </h2>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#d44df0", marginTop: 4 }}>Score: {score} pts</div>
          
          {challengeMatched ? (
            <div style={{ marginTop: 12, background: "#10b98122", border: "1px solid #10b98188", borderRadius: 12, padding: "10px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Sparkles size={20} /> Correct Match! +10 Points!
              <button onClick={nextChallenge} style={{ marginLeft: 16, background: "#10b981", color: "#000", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 800, cursor: "pointer" }}>Next Sign →</button>
            </div>
          ) : (
            <>
              {failedAttempts >= 3 && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, color: "#f59e0b", fontWeight: 600 }}>Having trouble? You can skip this sign.</span>
                  <button onClick={nextChallenge} style={{ background: "#f59e0b", color: "#000", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 800, cursor: "pointer" }}>Skip Sign →</button>
                </div>
              )}
              {currentPrediction && !challengeMatched && (
                <div style={{ marginTop: 12, background: "#ef444422", border: "1px solid #ef444488", borderRadius: 12, padding: "8px", color: "#ef4444", fontWeight: 600, display: "inline-block" }}>
                  Hmm, that looks like '{currentPrediction.gu}' ({currentPrediction.label}). Try again!
                </div>
              )}
              <p style={{ fontSize: 13, color: "#888", margin: 0, marginTop: 12 }}>Perform the sign in front of your camera, capture, and verify!</p>
            </>
          )}
        </div>
      )}

      {/* Main Camera View Box */}
      <div style={{ width: "100%", maxWidth: 680, background: "#141414", border: "1px solid #262626", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}>
        
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#080808", borderRadius: 16, border: "1px solid #222", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: (cameraActive && !capturedImageURL) ? "block" : "none", transform: "scaleX(-1)" }}
          />
          {capturedImageURL && (
            <img 
              src={capturedImageURL} 
              alt="Captured frame" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          )}

          {!cameraActive && !capturedImageURL && (
            <div style={{ textAlign: "center", padding: 32, color: "#666" }}>
              <Camera size={48} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>Camera starting...</p>
            </div>
          )}

          {isAnalyzing && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 600, gap: 8 }}>
              <RefreshCw size={24} className="animate-spin" /> Verifying Sign...
            </div>
          )}
        </div>

        {/* Camera Control Buttons */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {!capturedImageURL ? (
            <button
              onClick={handleCapture}
              disabled={!cameraActive || apiStatus === 'offline'}
              style={{
                padding: "12px 32px", borderRadius: 14, border: "none",
                background: (!cameraActive || apiStatus === 'offline') ? "#333" : "linear-gradient(90deg, #6a4cf5, #d44df0)",
                color: "#fff", fontWeight: 800, fontSize: 15, cursor: (!cameraActive || apiStatus === 'offline') ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 10, boxShadow: (!cameraActive || apiStatus === 'offline') ? "none" : "0 4px 14px rgba(106,76,245,0.4)"
              }}
            >
              <Camera size={18} /> Capture
            </button>
          ) : (
            <>
              <button
                onClick={handleRetake}
                disabled={isAnalyzing}
                style={{
                  padding: "12px 28px", borderRadius: 14, border: "1px solid #ef444455",
                  background: "rgba(239,68,68,0.15)", color: "#ef4444", fontWeight: 800, fontSize: 15, 
                  cursor: isAnalyzing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 10
                }}
              >
                <RefreshCw size={18} /> Retake
              </button>
              
              <button
                onClick={handleVerify}
                disabled={isAnalyzing || challengeMatched}
                style={{
                  padding: "12px 32px", borderRadius: 14, border: "none",
                  background: (isAnalyzing || challengeMatched) ? "#333" : "#10b981", color: (isAnalyzing || challengeMatched) ? "#888" : "#000", 
                  fontWeight: 800, fontSize: 15, cursor: (isAnalyzing || challengeMatched) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 10, boxShadow: (isAnalyzing || challengeMatched) ? "none" : "0 4px 14px rgba(16,185,129,0.4)"
                }}
              >
                <Sparkles size={18} /> Verify
              </button>
            </>
          )}
        </div>

        {/* Prediction Result Display (Only after Verify) */}
        {currentPrediction && !isAnalyzing && (
          <div style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${challengeMatched ? '#10b981' : '#ef4444'}`, borderRadius: 16, padding: "20px", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {currentPrediction.hand_detected ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: challengeMatched ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", border: `1px solid ${challengeMatched ? '#10b981' : '#ef4444'}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: challengeMatched ? '#10b981' : '#ef4444' }}>
                    {currentPrediction.gujaratiLabel || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Predicted Sign</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                      {currentPrediction.label} <span style={{ fontSize: 16, color: "#aaa", fontWeight: 400 }}>({currentPrediction.gujaratiLabel})</span>
                    </div>
                  </div>
                </div>
                {currentPrediction.confidence !== null && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#888" }}>Confidence</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: currentPrediction.confidence >= 0.7 ? "#10b981" : "#f59e0b" }}>
                      {(currentPrediction.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ width: "100%", textAlign: "center", color: "#aaa", padding: "8px 0" }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>
                  ✋ No hand detected in the image. Please retake.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};



const SignLanguage = () => {
  const { t } = useLocale();
  const location = useLocation();
  const isRoot = location.pathname === '/sign-language';

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <Link
          to={isRoot ? "/" : "/sign-language"}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "#141414", border: "1px solid #262626",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#6a4cf5", transition: "all 0.15s ease", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background="#1c1c1c"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#141414"; }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>
          {t('category_sign')}
        </h1>
      </div>

      <Routes>
        <Route path="/" element={<SignMenu />} />
        <Route path="learning" element={<SignLearning />} />
        <Route path="practice" element={<SignPractice />} />
      </Routes>
    </div>
  );
};

export default SignLanguage;
