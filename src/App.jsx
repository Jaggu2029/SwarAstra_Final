import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';

import { useSession } from './context/SessionContext';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignLanguage = lazy(() => import('./pages/SignLanguage'));
const Maths = lazy(() => import('./pages/Maths'));
const Science = lazy(() => import('./pages/Science'));
const ProgressReport = lazy(() => import('./pages/ProgressReport'));
const TeacherPanel = lazy(() => import('./pages/TeacherPanel'));

const ProtectedRoute = ({ children }) => {
  const { session } = useSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const { session, loading } = useSession();
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('swarastra_splash_played');
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#090909]">
        <Loader2 className="animate-spin w-12 h-12 text-primary-sign" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#090909" }}>
      {showSplash && (
        <SplashScreen
          forcePlay={true}
          targetRoute={session ? "/" : "/login"}
          onComplete={() => setShowSplash(false)}
        />
      )}
      <Header />
      <Suspense fallback={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ width: 32, height: 32, border: "2px solid #262626", borderTopColor: "#6a4cf5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      }>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/sign-language/*" element={<ProtectedRoute><SignLanguage /></ProtectedRoute>} />
          <Route path="/maths/*" element={<ProtectedRoute><Maths /></ProtectedRoute>} />
          <Route path="/science/*" element={<ProtectedRoute><Science /></ProtectedRoute>} />
          <Route path="/progress-report" element={<ProtectedRoute><ProgressReport /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute><TeacherPanel /></ProtectedRoute>} />
          <Route path="/splash" element={<SplashScreen forcePlay={true} targetRoute="/login" />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
