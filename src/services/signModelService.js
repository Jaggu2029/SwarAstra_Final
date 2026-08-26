/**
 * Service to interact with the SwarAstra Gujarati Sign Language Model API
 * default endpoint: http://localhost:5000
 */

const API_BASE = (import.meta.env.VITE_SIGN_MODEL_API || 'http://localhost:5000').replace(/\/$/, '');

export const getApiBaseUrl = () => API_BASE;

export const GUJARATI_SCRIPT_MAP = {
  ka: 'ક', kha: 'ખ', ga: 'ગ', gha: 'ઘ', nga: 'ઙ',
  cha: 'ચ', chha: 'છ', ja: 'જ', jha: 'ઝ', nya: 'ઞ',
  ta: 'ત', tha: 'થ', da: 'દ', dha: 'ધ', na: 'ન',
  pa: 'પ', pha: 'ફ', ba: 'બ', bha: 'ભ', ma: 'મ',
  ya: 'ય', ra: 'ર', la: 'લ', va: 'વ', sha: 'શ',
  sa: 'સ', ha: 'હ',
  Ta: 'ટ', Tha: 'ઠ', Da: 'ડ', Dha: 'ઢ', Na: 'ણ',
  Sha: 'ષ', La: 'ળ', ksha: 'ક્ષ', gyna: 'જ્ઞ',
  alaaa: 'ળ', ana: 'ણ', daaa: 'દ', taah: 'ત', the: 'થ', TTHAAA: 'ઠ',
};

/**
 * Checks if the Model API server is online
 */
export const checkModelHealth = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` };
    const data = await res.json();
    return { status: 'ok', classes: data.classes || [] };
  } catch (err) {
    clearTimeout(timeoutId);
    return { status: 'offline', error: err.message };
  }
};

/**
 * Sends an image (Blob or File) to the model for sign prediction
 * @param {Blob | File} imageBlob 
 * @returns {Promise<{ hand_detected: boolean, label: string | null, confidence: number | null, gujaratiLabel?: string }>}
 */
export const predictSign = async (imageBlob) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');

    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
    });


    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const gujaratiLabel = data.label ? (GUJARATI_SCRIPT_MAP[data.label] || data.label) : null;

    return {
      hand_detected: data.hand_detected || false,
      label: data.label || null,
      confidence: data.confidence !== undefined ? data.confidence : null,
      gujaratiLabel,
    };
  } catch (err) {
    console.error('Sign prediction failed:', err);
    throw err;
  }
};
