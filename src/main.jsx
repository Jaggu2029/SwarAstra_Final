import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LocaleProvider } from './context/LocaleContext.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { startKeepAlive } from './services/keepAlive.js';

// Keep the Render backend warm so sign language detection has no cold-start delay
startKeepAlive();


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <LocaleProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </LocaleProvider>
    </SessionProvider>
  </React.StrictMode>,
);
