/**
 * Utility functions for computing advanced statistics on student attempts.
 */

// Group attempts into session chunks (e.g., by day)
export const groupAttemptsBySession = (attempts) => {
  if (!attempts || attempts.length === 0) return [];
  
  // Sort attempts by timestamp ascending
  const sorted = [...attempts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  const sessions = {};
  sorted.forEach(attempt => {
    // Group by calendar date for v1
    const dateKey = new Date(attempt.timestamp).toLocaleDateString();
    if (!sessions[dateKey]) sessions[dateKey] = [];
    sessions[dateKey].push(attempt);
  });
  
  return Object.keys(sessions).map(dateKey => ({
    date: dateKey,
    attempts: sessions[dateKey],
    total: sessions[dateKey].length,
    correct: sessions[dateKey].filter(a => a.correct).length,
    accuracy: (sessions[dateKey].filter(a => a.correct).length / sessions[dateKey].length) * 100
  }));
};

// Calculate rolling average
export const calculateRollingAverage = (sessionAccuracies, windowSize = 5) => {
  return sessionAccuracies.map((session, index, arr) => {
    const start = Math.max(0, index - windowSize + 1);
    const window = arr.slice(start, index + 1);
    const sum = window.reduce((acc, curr) => acc + curr.accuracy, 0);
    return {
      ...session,
      rollingAccuracy: sum / window.length
    };
  });
};

export const calculateStandardDeviation = (values) => {
  if (!values || values.length < 2) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
};

export const calculateConsistency = (sessionAccuracies) => {
  if (sessionAccuracies.length < 2) return { status: 'Not enough data', description: 'Need more sessions', stdDev: 0 };
  const accuracies = sessionAccuracies.map(s => s.accuracy);
  const stdDev = calculateStandardDeviation(accuracies);
  
  if (stdDev < 15) return { status: 'Very Consistent', description: 'Excellent steady performance.', stdDev };
  if (stdDev < 30) return { status: 'Some Variation', description: 'Normal fluctuations in performance.', stdDev };
  return { status: 'Inconsistent', description: 'Recommend more frequent short practice sessions.', stdDev };
};

export const calculateWeightedMastery = (sessionAccuracies) => {
  if (!sessionAccuracies || sessionAccuracies.length === 0) return 0;
  
  let weightedSum = 0;
  let weightTotal = 0;
  
  // Recency weighting: linear increasing weights for newer sessions
  sessionAccuracies.forEach((session, index) => {
    const weight = index + 1; 
    weightedSum += session.accuracy * weight;
    weightTotal += weight;
  });
  
  return weightedSum / weightTotal;
};

export const calculateTopicBreakdown = (attempts, module) => {
  if (!attempts || attempts.length === 0) return [];
  
  const groups = {};
  attempts.forEach(attempt => {
    let key;
    if (module === 'maths') {
      key = attempt.operation || 'Mixed';
    } else {
      key = attempt.operation ? attempt.operation : `Level ${attempt.level || '?'}`;
    }
    
    if (!groups[key]) groups[key] = { total: 0, correct: 0 };
    groups[key].total += 1;
    if (attempt.correct) groups[key].correct += 1;
  });
  
  return Object.keys(groups).map(key => ({
    topic: key.charAt(0).toUpperCase() + key.slice(1),
    accuracy: (groups[key].correct / groups[key].total) * 100,
    total: groups[key].total
  }));
};

export const detectMathsErrorPatterns = (attempts) => {
  if (!attempts || attempts.length < 5) return null;
  
  const incorrectSubtractions = attempts.filter(a => a.module === 'maths' && a.operation === 'subtraction' && !a.correct);
  const totalSubtractions = attempts.filter(a => a.module === 'maths' && a.operation === 'subtraction').length;
  
  if (totalSubtractions >= 5 && (incorrectSubtractions.length / totalSubtractions >= 0.4)) {
     return {
       pattern: "Frequent subtraction errors",
       insight: "Frequently misses subtraction problems. Check if they are struggling with borrowing/regrouping."
     };
  }
  
  const incorrectDiv = attempts.filter(a => a.module === 'maths' && a.operation === 'division' && !a.correct);
  const totalDiv = attempts.filter(a => a.module === 'maths' && a.operation === 'division').length;
  if (totalDiv >= 5 && (incorrectDiv.length / totalDiv >= 0.4)) {
     return {
       pattern: "Frequent division errors",
       insight: "Struggling with division. Extra practice recommended on tables."
     };
  }
  
  return null;
};

export const calculateResponseTimeInsight = (attempts) => {
  if (!attempts || attempts.length < 2) return null;
  
  let totalDiff = 0;
  let count = 0;
  
  const sorted = [...attempts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i].timestamp);
    const prev = new Date(sorted[i-1].timestamp);
    const diffSeconds = (curr - prev) / 1000;
    
    if (diffSeconds > 0 && diffSeconds < 120) {
      totalDiff += diffSeconds;
      count++;
    }
  }
  
  if (count === 0) return null;
  
  const avgSeconds = totalDiff / count;
  const overallAccuracy = (attempts.filter(a => a.correct).length / attempts.length) * 100;
  
  if (avgSeconds < 5 && overallAccuracy < 40) {
    return {
       avgSeconds: avgSeconds.toFixed(1),
       status: "Answering very fast — check if guessing",
       type: "warning"
    };
  } else if (avgSeconds > 30 && overallAccuracy < 50) {
     return {
       avgSeconds: avgSeconds.toFixed(1),
       status: "Taking a long time and struggling — may need foundational review",
       type: "warning"
    };
  } else {
    return {
       avgSeconds: avgSeconds.toFixed(1),
       status: "Normal pacing",
       type: "normal"
    };
  }
};

export const evaluateReadiness = (rollingAccuracies) => {
  if (!rollingAccuracies || rollingAccuracies.length < 3) {
    return { status: "Steady progress", recommendation: "Keep practicing to build history." };
  }
  
  const last3 = rollingAccuracies.slice(-3);
  const avgOfLast3 = last3.reduce((sum, s) => sum + s.rollingAccuracy, 0) / 3;
  
  if (avgOfLast3 >= 70) {
    return { status: "Likely ready for next level", recommendation: "Great work! Ready to advance." };
  } else if (avgOfLast3 < 50) {
    return { status: "More practice recommended", recommendation: "Focus on fundamentals before advancing." };
  } else {
    return { status: "Steady progress", recommendation: "Doing well, keep going!" };
  }
};

export const generateLevelProgression = (attempts, progress) => {
    if (!progress || !progress.length) return [];
    
    const levels = [];
    progress.forEach(p => {
        const pAttempts = attempts.filter(a => a.module === p.module && a.level === p.level);
        
        let firstAttempt = null;
        let lastAttempt = null;
        if (pAttempts.length > 0) {
            const sorted = [...pAttempts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            firstAttempt = sorted[0];
            lastAttempt = sorted[sorted.length - 1];
        }
        
        let daysSpent = 0;
        if (firstAttempt && lastAttempt) {
            const ms = new Date(lastAttempt.timestamp) - new Date(firstAttempt.timestamp);
            daysSpent = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
        }

        levels.push({
            module: p.module,
            level: p.level,
            unlocked: p.unlocked,
            bestAccuracy: p.best_accuracy,
            attemptsTaken: pAttempts.length,
            daysSpent: daysSpent,
            lastAttempted: p.last_attempted_at ? new Date(p.last_attempted_at).toLocaleDateString() : 'N/A'
        });
    });
    
    return levels.sort((a, b) => {
        if (a.module < b.module) return -1;
        if (a.module > b.module) return 1;
        return a.level - b.level;
    });
};
