/**
 * Keep-alive service for the Render free-tier backend.
 * Pings /health every 14 minutes so the server never cold-starts.
 * Call startKeepAlive() once at app startup (e.g. in main.jsx or App.jsx).
 */

const API_BASE = (import.meta.env.VITE_SIGN_MODEL_API || 'http://localhost:5000').replace(/\/$/, '');
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

let _intervalId = null;

const ping = async () => {
  try {
    await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(8000) });
  } catch {
    // silent — just keeping it warm
  }
};

export const startKeepAlive = () => {
  if (_intervalId) return; // already running
  ping(); // immediate first ping
  _intervalId = setInterval(ping, PING_INTERVAL_MS);
};

export const stopKeepAlive = () => {
  if (_intervalId) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
};
