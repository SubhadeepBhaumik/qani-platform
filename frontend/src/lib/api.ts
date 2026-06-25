import { Job, User, Application, Notification, ScreeningSession, SystemLog, ChatMessage } from '../types';

const API_BASE = 'https://qani.io/api/v1';

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('qani_refresh_token');
    if (!refreshToken) return null;
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('qani_auth_token', data.token);
      localStorage.setItem('qani_refresh_token', data.refreshToken);
      return data.token;
    }
    return null;
  } catch {
    return null;
  }
}

const KEYS = {
  AUTH_TOKEN: 'qani_auth_token',
  CURRENT_USER: 'qani_current_user',
};

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem(KEYS.AUTH_TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function call<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers as Record<string, string> || {}) },
  });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const e = await res.json(); msg = e.message || e.error || msg; } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // ── AUTH ──────────────────────────────────────────────────
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const data = await call<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = data.token;
    if (!token) throw new Error('No token from server');
    localStorage.setItem(KEYS.AUTH_TOKEN, token);
    if (data.refreshToken) localStorage.setItem('qani_refresh_token', data.refreshToken);
    const user: User = data.user || {
      id: data.id || '',
      email: data.email || email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: data.role || 'candidate',
      emailVerified: true,
    };
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return { user, token };
  },

  logout: () => {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem('qani_refresh_token');
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(KEYS.CURRENT_USER);
    try { return s ? JSON.parse(s) : null; } catch (_) { return null; }
  },

  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
  },

  validateToken: async (): Promise<User | null> => {
    if (!localStorage.getItem(KEYS.AUTH_TOKEN)) return null;
    try {
      const user = await call<User>('/auth/me');
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    } catch (_) {
      localStorage.removeItem(KEYS.AUTH_TOKEN);
      localStorage.removeItem(KEYS.CURRENT_USER);
      return null;
    }
  },

  registerCandidate: async (payload: {
    firstName: string; lastName: string; email: string; password: string;
    bio?: string; skills?: string[]; linkedinUrl?: string;
  }): Promise<User> => {
    const data = await call<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...payload, role: 'candidate' }),
    });
    if (data.token) localStorage.setItem(KEYS.AUTH_TOKEN, data.token);
    return data.user || data;
  },

  registerRecruiter: async (payload: {
    companyName: string; firstName: string; lastName: string;
    email: string; password: string; industry?: string; companySize?: string;
  }): Promise<User> => {
    const data = await call<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...payload, role: 'recruiter' }),
    });
    if (data.token) localStorage.setItem(KEYS.AUTH_TOKEN, data.token);
    return data.user || data;
  },

  // ── USERS ─────────────────────────────────────────────────
  getUsers: async (): Promise<User[]> => {
    try { return await call<User[]>('/users'); } catch (_) { return []; }
  },

  getCandidates: async (): Promise<any[]> => {
    try { return await call<any[]>('/candidates'); } catch (_) { return []; }
  },

  getPublicCandidates: async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/v1/candidates/public');
      return await res.json();
    } catch (_) { return []; }
  },

  sendOTP: async (target: string, type: 'email' | 'sms', userId: string): Promise<{ success: boolean; message?: string }> => {
    return call<any>('/auth/send-otp', { method: 'POST', body: JSON.stringify({ target, type, userId }) });
  },

  verifyOTPCode: async (target: string, type: 'email' | 'sms', otp: string, userId: string): Promise<{ success: boolean; message?: string }> => {
    return call<any>('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ target, type, otp, userId }) });
  },

  saveUser: async (user: Partial<User> & { id?: string }): Promise<User> => {
    const method = user.id ? 'PUT' : 'POST';
    const endpoint = user.id ? `/users/${user.id}` : '/users';
    return call<User>(endpoint, { method, body: JSON.stringify(user) });
  },

  deleteUser: async (id: string): Promise<void> => {
    await call(`/users/${id}`, { method: 'DELETE' });
  },

  // ── JOBS ──────────────────────────────────────────────────
  getJobs: async (): Promise<Job[]> => {
    try { return await call<Job[]>('/roles'); } catch (_) { return []; }
  },
  getJobsByRecruiter: async (recruiterId: string): Promise<Job[]> => {
    try { return await call<Job[]>(`/roles?recruiterId=${recruiterId}`); } catch (_) { return []; }
  },

  getJobById: async (id: string): Promise<Job | null> => {
    try { return await call<Job>(`/roles/${id}`); } catch (_) { return null; }
  },

  saveJob: async (job: Partial<Job> & { id?: string }): Promise<Job> => {
    const method = job.id ? 'PUT' : 'POST';
    const endpoint = job.id ? `/roles/${job.id}` : '/roles';
    return call<Job>(endpoint, { method, body: JSON.stringify(job) });
  },

  deleteJob: async (id: string): Promise<void> => {
    await call(`/roles/${id}`, { method: 'DELETE' });
  },

  // ── APPLICATIONS ──────────────────────────────────────────
  getApplications: async (): Promise<Application[]> => {
    try { return await call<Application[]>('/applications'); } catch (_) { return []; }
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    try { return await call<Application>(`/applications/${id}`); } catch (_) { return null; }
  },

  applyForJob: async (jobId: string, candidateId: string, candidateName?: string, candidateEmail?: string, jobTitle?: string, company?: string, cvUrl?: string | null, cvFilename?: string | null): Promise<Application> => {
    return call<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify({ roleId: jobId, candidateId, candidateName, candidateEmail, jobTitle, company, cvUrl, cvFilename, status: 'applied' }),
    });
  },

  updateApplicationStatus: async (
    id: string,
    status: Application['status'],
    notesCont?: { recruiterName: string; content: string }
  ): Promise<void> => {
    const body: any = { status };
    if (notesCont) body.recruiterNotes = notesCont.content;
    await call(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(body) });
  },

  // ── SCREENING ─────────────────────────────────────────────
  getSessions: async (): Promise<ScreeningSession[]> => {
    try { return await call<ScreeningSession[]>('/screening'); } catch (_) { return []; }
  },

  getSessionById: async (id: string): Promise<ScreeningSession | null> => {
    try { return await call<ScreeningSession>(`/screening/${id}`); } catch (_) { return null; }
  },

  startScreening: async (applicationId: string, candidateName?: string): Promise<ScreeningSession> => {
    return call<ScreeningSession>('/screening/start', {
      method: 'POST',
      body: JSON.stringify({ applicationId, candidateName }),
    });
  },

  submitResponseToAI: async (sessionId: string, message: string): Promise<ScreeningSession> => {
    return call<ScreeningSession>('/screening/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message }),
    });
  },

  // ── NOTIFICATIONS ─────────────────────────────────────────
  getNotifications: async (email?: string): Promise<Notification[]> => {
    try {
      const qs = email ? `?recipientEmail=${encodeURIComponent(email)}` : '';
      return await call<Notification[]>(`/notifications${qs}`);
    } catch (_) { return []; }
  },

  addNotification: async (title: string, content: string, type: Notification['type']): Promise<void> => {
    await call('/notifications/send', {
      method: 'POST',
      body: JSON.stringify({ title, content, type }),
    });
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await call(`/notifications/${id}/read`, { method: 'PUT' });
  },

  markAllNotificationsRead: async (): Promise<void> => {
    try {
      const list = await api.getNotifications();
      await Promise.all(list.map(n => api.markNotificationAsRead(n.id)));
    } catch (_) {}
  },

  clearNotifications: async (recipientEmail: string): Promise<void> => {
    await call('/notifications/mark-all-read', { method: 'POST', body: JSON.stringify({ recipientEmail }) });
  },

  // ── LOGS ──────────────────────────────────────────────────
  getLogs: async (): Promise<SystemLog[]> => {
    try { return await call<SystemLog[]>('/audit-logs'); } catch (_) { return []; }
  },

  addLog: async (event: string, user: string, details: string, type: SystemLog['type'] = 'info'): Promise<void> => {
    try {
      await call('/audit-logs', { method: 'POST', body: JSON.stringify({ event, user, details, type }) });
    } catch (_) {}
  },

  // ── DASHBOARD ─────────────────────────────────────────────
  getDashboardStats: async (organisationId?: string): Promise<any> => {
    try {
      const qs = organisationId ? `?organisationId=${organisationId}` : '';
      return await call(`/dashboard/stats${qs}`);
    } catch (_) { return null; }
  },
};
