import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useProgress } from '../context/ProgressContext';
import { useLocale } from '../context/LocaleContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { ArrowLeft, CheckCircle, CheckCircle2, Lock, AlertTriangle, TrendingUp, Clock, Target, Info, Calendar, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  groupAttemptsBySession,
  calculateRollingAverage,
  calculateConsistency,
  calculateWeightedMastery,
  calculateTopicBreakdown,
  detectMathsErrorPatterns,
  calculateResponseTimeInsight,
  evaluateReadiness,
  generateLevelProgression
} from '../utils/statistics';

const ProgressReport = () => {
  const { session, profile } = useSession();
  const { fetchAttempts, fetchLinkedStudents, fetchUserProgress } = useProgress();
  const { t } = useLocale();
  
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [masteryScore, setMasteryScore] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [mathsTopics, setMathsTopics] = useState([]);
  const [scienceTopics, setScienceTopics] = useState([]);
  const [consistency, setConsistency] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [timeInsight, setTimeInsight] = useState(null);
  const [mathsErrorPattern, setMathsErrorPattern] = useState(null);
  const [levelProgression, setLevelProgression] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const studentId = selectedStudent || session?.user?.id || 'guest_user';
    if (selectedStudent !== studentId) {
      setSelectedStudent(studentId);
    }
    loadData(studentId);
  }, [session, selectedStudent]);

  const handleSeedSampleData = async () => {
    const targetId = selectedStudent || session?.user?.id || 'guest_user';
    const now = Date.now();
    const sampleAttempts = [
      { user_id: targetId, module: 'maths', level: 1, topic: 'addition', correct: true, response_time_ms: 3200, timestamp: new Date(now - 86400000 * 4).toISOString() },
      { user_id: targetId, module: 'maths', level: 1, topic: 'addition', correct: true, response_time_ms: 2800, timestamp: new Date(now - 86400000 * 3).toISOString() },
      { user_id: targetId, module: 'maths', level: 2, topic: 'large_addition', correct: true, response_time_ms: 4500, timestamp: new Date(now - 86400000 * 2).toISOString() },
      { user_id: targetId, module: 'maths', level: 2, topic: 'subtraction', correct: false, response_time_ms: 5100, timestamp: new Date(now - 86400000 * 1).toISOString() },
      { user_id: targetId, module: 'maths', level: 3, topic: 'multiplication', correct: true, response_time_ms: 3900, timestamp: new Date().toISOString() },
      { user_id: targetId, module: 'science', level: 1, topic: 'living_things', correct: true, response_time_ms: 2500, timestamp: new Date(now - 86400000 * 3).toISOString() },
      { user_id: targetId, module: 'science', level: 1, topic: 'our_body', correct: true, response_time_ms: 2100, timestamp: new Date(now - 86400000 * 2).toISOString() },
      { user_id: targetId, module: 'science', level: 2, topic: 'plants', correct: true, response_time_ms: 3100, timestamp: new Date().toISOString() },
    ];

    try {
      for (const a of sampleAttempts) {
        await logAttempt(a);
      }
      await saveUserProgress('maths', 1, 90);
      await saveUserProgress('maths', 2, 80);
      await saveUserProgress('science', 1, 95);
      await saveUserProgress('science', 2, 85);
      loadData(targetId);
    } catch (e) {
      console.error('Failed to seed sample progress:', e);
    }
  };


  const loadData = (studentId) => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    console.log('[ProgressReport] Loading data for userId:', studentId);

    Promise.all([
      fetchAttempts(studentId, 'maths'),
      fetchAttempts(studentId, 'science'),
      fetchUserProgress(studentId, 'maths'),
      fetchUserProgress(studentId, 'science')
    ]).then(([mathsAttempts, scienceAttempts, mathsProg, scienceProg]) => {
      const mA = mathsAttempts || [];
      const sA = scienceAttempts || [];
      const mP = mathsProg || [];
      const sP = scienceProg || [];

      console.log('[ProgressReport] maths attempts:', mA.length, '| science attempts:', sA.length);
      console.log('[ProgressReport] maths progress rows:', mP.length, '| science progress rows:', sP.length);

      setTotalAttempts(mA.length + sA.length);

      const mathsSessions = groupAttemptsBySession(mA);
      const mathsRolling = calculateRollingAverage(mathsSessions);
      const scienceSessions = groupAttemptsBySession(sA);
      const scienceRolling = calculateRollingAverage(scienceSessions);

      const allDates = [...new Set([...mathsRolling.map(s=>s.date), ...scienceRolling.map(s=>s.date)])].sort();
      setTrendData(allDates.map(date => {
        const m = mathsRolling.find(s => s.date === date);
        const sc = scienceRolling.find(s => s.date === date);
        return { date, mathsAccuracy: m ? Math.round(m.rollingAccuracy) : null, scienceAccuracy: sc ? Math.round(sc.rollingAccuracy) : null };
      }));

      // Calculate monthly activity chart (Tests per day)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dailyCounts = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        tests: 0
      }));
      [...mA, ...sA].forEach(a => {
        const d = new Date(a.timestamp);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          dailyCounts[d.getDate() - 1].tests++;
        }
      });
      setActivityData(dailyCounts);

      const mMastery = calculateWeightedMastery(mathsSessions);
      const sMastery = calculateWeightedMastery(scienceSessions);
      let tot = 0;
      if (mMastery > 0 && sMastery > 0) tot = (mMastery + sMastery) / 2;
      else tot = mMastery || sMastery;
      setMasteryScore(Math.round(tot));

      setMathsTopics(calculateTopicBreakdown(mA, 'maths'));
      setScienceTopics(calculateTopicBreakdown(sA, 'science'));

      const allSessions = groupAttemptsBySession([...mA, ...sA]);
      setConsistency(calculateConsistency(allSessions));
      setReadiness(evaluateReadiness(mathsRolling.length > 0 ? mathsRolling : scienceRolling));
      setTimeInsight(calculateResponseTimeInsight([...mA, ...sA]));

      let progression = generateLevelProgression([...mA, ...sA], [...mP, ...sP]);
      if (progression.length === 0 && (mA.length > 0 || sA.length > 0)) {
        const map = {};
        [...mA, ...sA].forEach(a => {
          const key = `${a.module}-${a.level}`;
          if (!map[key]) map[key] = { module: a.module, level: a.level, total: 0, correct: 0, last: a.timestamp };
          map[key].total++;
          if (a.correct) map[key].correct++;
          if (new Date(a.timestamp) > new Date(map[key].last)) map[key].last = a.timestamp;
        });
        progression = Object.values(map).map(p => ({
          module: p.module, level: p.level, unlocked: true,
          bestAccuracy: Math.round((p.correct / p.total) * 100),
          attemptsTaken: p.total,
          lastAttempted: new Date(p.last).toLocaleDateString()
        })).sort((a, b) => a.module < b.module ? -1 : a.module > b.module ? 1 : a.level - b.level);
      }
      setLevelProgression(progression);
      setMathsErrorPattern(detectMathsErrorPatterns(mA));
      setLoading(false);
    }).catch(err => {
      console.error('Progress load error:', err);
      setError(err.message || 'Failed to load data.');
      setLoading(false);
    });
  };

  useEffect(() => { if (selectedStudent) loadData(selectedStudent); }, [selectedStudent]);

  return (
    <div className="pb-16 animate-fade-in">
      <div className="flex flex-wrap items-center gap-4 mt-4 mb-8">
        <Link to="/" className="p-2 glass-card hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-primary-progress" />
        </Link>
        <h1 className="text-3xl font-bold text-primary-progress flex-1">{t('category_progress') || 'Progress Report'}</h1>
        <button 
          onClick={handleSeedSampleData} 
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2"
        >
          ✨ Load Sample Progress
        </button>
        <button onClick={() => loadData(selectedStudent || 'guest_user')} className="p-2 glass-card hover:bg-white/10 rounded-full transition-colors title='Refresh'">
          <RefreshCw size={20} className="text-gray-400" />
        </button>
      </div>


      {((profile.role || '').toLowerCase() === 'teacher' || (profile.role || '').toLowerCase() === 'parent') && (
        <div className="mb-8 max-w-sm">
          <label className="block text-sm mb-2 text-gray-300">Select Student</label>
          <select value={selectedStudent || ''} onChange={e => setSelectedStudent(e.target.value)}
            className="w-full bg-black/30 border border-cardBorder rounded-lg px-4 py-2 focus:outline-none focus:border-primary-progress text-white [&>option]:bg-[#0B0F1A]">
            <option value="" disabled>Select...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Error loading data:</p>
            <p>{error}</p>
            <p className="text-xs mt-2 text-red-300">Press F12 ? Console tab for details.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4 text-gray-400">
          <div className="w-10 h-10 border-4 border-primary-progress/30 border-t-primary-progress rounded-full animate-spin"></div>
          <p>Loading your statistics...</p>
        </div>
      ) : totalAttempts === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center glass-card">
          <div className="w-20 h-20 rounded-full bg-primary-progress/10 flex items-center justify-center">
            <Target className="w-10 h-10 text-primary-progress opacity-60" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">No Data Yet</h2>
            <p className="text-gray-400 max-w-md">Complete your first Maths or Science level test to see your progress report here.</p>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/maths/practice" className="px-6 py-3 bg-primary-maths text-white rounded-xl font-semibold hover:opacity-80 transition-opacity">Start Maths</Link>
            <Link to="/science" className="px-6 py-3 bg-primary-science text-white rounded-xl font-semibold hover:opacity-80 transition-opacity">Start Science</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 flex items-center gap-6 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-progress/20 rounded-full blur-2xl"></div>
              <div className="p-4 bg-primary-progress/10 rounded-2xl"><Target className="w-10 h-10 text-primary-progress" /></div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Mastery Score</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold text-white">{masteryScore}</h2>
                  <span className="text-gray-400">/ 100</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{totalAttempts} questions answered</p>
              </div>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center">
              <div className="flex items-start gap-3">
                {readiness?.status?.includes('ready') ? <TrendingUp className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-amber-400" />}
                <div>
                  <h3 className="text-lg font-semibold text-white">{readiness?.status || 'Steady progress'}</h3>
                  <p className="text-sm text-gray-400 mt-1">{readiness?.recommendation || 'Keep practicing.'}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center">
              <div className="flex items-start gap-3">
                <CheckCircle className={`w-6 h-6 ${(consistency?.stdDev || 99) < 15 ? 'text-green-400' : 'text-blue-400'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-white">{consistency?.status || 'Not enough data'}</h3>
                  <p className="text-sm text-gray-400 mt-1">{consistency?.description || 'Need more sessions'}</p>
                </div>
              </div>
            </div>
          </div>

          {(timeInsight || mathsErrorPattern) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timeInsight && timeInsight.type !== 'normal' && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex gap-4 items-start">
                  <Clock className="w-6 h-6 flex-shrink-0 mt-1 text-amber-400" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Pacing Insight</h4>
                    <p className="text-gray-300 text-sm">{timeInsight.status}</p>
                    <p className="text-xs text-gray-400 mt-2">Avg {timeInsight.avgSeconds}s per question</p>
                  </div>
                </div>
              )}
              {mathsErrorPattern && (
                <div className="p-5 rounded-2xl bg-primary-maths/10 border border-primary-maths/30 flex gap-4 items-start">
                  <Info className="w-6 h-6 flex-shrink-0 mt-1 text-primary-maths" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{mathsErrorPattern.pattern}</h4>
                    <p className="text-gray-300 text-sm">{mathsErrorPattern.insight}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 min-h-[350px] lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-400" /> 
                {trendData.length > 1 ? "Accuracy Trend (Moving Average)" : "Monthly Activity (Tests per Day)"}
              </h3>
              {trendData.length > 1 ? (
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} itemStyle={{ color: '#e5e7eb' }} formatter={v => [`${v}%`, '']} />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="mathsAccuracy" name="Maths" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                      <Line type="monotone" dataKey="scienceAccuracy" name="Science" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="day" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelFormatter={(label) => `Day ${label}`}
                        formatter={(value) => [value, 'Tests Given']}
                      />
                      <Bar dataKey="tests" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="glass-card p-6 min-h-[350px]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-primary-maths" /> Maths Breakdown</h3>
              {mathsTopics.length > 0 ? (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mathsTopics} layout="vertical" margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis dataKey="topic" type="category" stroke="#64748b" tick={{ fill: '#aaa', fontSize: 12 }} width={90} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} formatter={v => [`${v.toFixed(0)}%`, 'Accuracy']} />
                      <Bar dataKey="accuracy" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <div className="flex h-[250px] items-center justify-center text-gray-500">No maths data yet</div>}
            </div>

            <div className="glass-card p-6 min-h-[350px]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-primary-science" /> Science Breakdown</h3>
              {scienceTopics.length > 0 ? (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scienceTopics} layout="vertical" margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis dataKey="topic" type="category" stroke="#64748b" tick={{ fill: '#aaa', fontSize: 12 }} width={90} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} formatter={v => [`${v.toFixed(0)}%`, 'Accuracy']} />
                      <Bar dataKey="accuracy" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <div className="flex h-[250px] items-center justify-center text-gray-500">No science data yet</div>}
            </div>
          </div>

          <div className="glass-card p-6 overflow-hidden">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400" /> Level Progression</h3>
            {levelProgression.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="pb-3 px-4 font-medium uppercase tracking-wider">Module</th>
                      <th className="pb-3 px-4 font-medium uppercase tracking-wider">Level</th>
                      <th className="pb-3 px-4 font-medium uppercase tracking-wider">Status</th>
                      <th className="pb-3 px-4 font-medium uppercase tracking-wider text-right">Best Accuracy</th>
                      <th className="pb-3 px-4 font-medium uppercase tracking-wider text-right">Attempts</th>
                      <th className="pb-3 px-4 font-medium uppercase tracking-wider text-right">Last Played</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {levelProgression.map((lp, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium capitalize">
                          <span className={lp.module === 'maths' ? 'text-primary-maths' : 'text-primary-science'}>{lp.module}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">Level {lp.level}</td>
                        <td className="py-4 px-4">
                          {lp.unlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs font-bold border border-gray-500/20">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={lp.bestAccuracy >= 70 ? 'text-green-400 font-bold' : 'text-gray-300'}>{lp.bestAccuracy}%</span>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-400">{lp.attemptsTaken}</td>
                        <td className="py-4 px-4 text-right text-gray-400">{lp.lastAttempted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-medium">No level data yet</p>
                <p className="text-sm opacity-70 mt-1">Complete a level test to see your progression here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressReport;
