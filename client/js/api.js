// api.js — talks to the Express backend, manages the session in localStorage.
// Loaded before main.js on every page.

const API_BASE = '/api';

const KYH = {
  getToken() { return localStorage.getItem('kyh_token'); },
  getEmail() { return localStorage.getItem('kyh_email'); },
  setSession(token, email) {
    localStorage.setItem('kyh_token', token);
    localStorage.setItem('kyh_email', email);
  },
  logout() {
    localStorage.removeItem('kyh_token');
    localStorage.removeItem('kyh_email');
  },

  // porosity result cached locally so Get Routine works even for guests
  setPorosity(value) { localStorage.setItem('kyh_porosity', value); },
  getPorosity() { return localStorage.getItem('kyh_porosity'); },

  async request(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = KYH.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.msg) data.msg = 'Request failed.';
    return data;
  },

  api: {
    signup(email, password) {
      return KYH.request('/auth/signup', { method: 'POST', body: { email, password } });
    },
    login(email, password) {
      return KYH.request('/auth/login', { method: 'POST', body: { email, password } });
    },
    saveTestResult(porosity) {
      return KYH.request('/tests', { method: 'POST', body: { porosity } });
    },
    getTestResults() {
      return KYH.request('/tests');
    },
    saveRoutine(porosity, steps) {
      return KYH.request('/routines', { method: 'POST', body: { porosity, steps } });
    },
    getRoutines() {
      return KYH.request('/routines');
    },
    saveScalpAnalysis(payload) {
      return KYH.request('/scalp', { method: 'POST', body: payload });
    },
  },
};
