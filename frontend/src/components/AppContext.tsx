import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Job, User, Application, Notification, ScreeningSession, SystemLog } from '../types';

export type AppView = 
  | 'landing' 
  | 'auth-login' 
  | 'auth-register-candidate-1' 
  | 'auth-register-recruiter'
  | 'verify-email'
  | 'candidate-dashboard'
  | 'candidate-jobs'
  | 'candidate-job-detail'
  | 'candidate-app-detail'
  | 'candidate-screening'
  | 'candidate-profile'
  | 'candidate-settings'
  | 'candidate-notifications'
  | 'recruiter-dashboard'
  | 'recruiter-applications'
  | 'recruiter-app-detail'
  | 'recruiter-queue'
  | 'recruiter-jobs'
  | 'recruiter-create-job'
  | 'recruiter-reports'
  | 'recruiter-candidates'
  | 'recruiter-team'
  | 'recruiter-settings'
  | 'admin-dashboard'
  | 'admin-users'
  | 'help'
  | 'error-404'
  | 'error-403'
  | 'error-500';

interface ViewParams {
  jobId?: string;
  applicationId?: string;
  sessionId?: string;
  editJobId?: string;
}

interface AppContextType {
  user: User | null;
  activeView: AppView;
  activeParams: ViewParams;
  jobs: Job[];
  applications: Application[];
  sessions: ScreeningSession[];
  notifications: Notification[];
  logs: SystemLog[];
  isAppLoading: boolean;
  navigate: (view: AppView, params?: ViewParams) => void;
  previousViews: AppView[];
  goBack: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerCandidate: (payload: { firstName: string; lastName: string; email: string; password: string; bio?: string; skills?: string[]; linkedinUrl?: string }) => Promise<User>;
  registerRecruiter: (payload: { companyName: string; firstName: string; lastName: string; email: string; password: string; industry?: string; companySize?: string }) => Promise<User>;
  saveJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  applyForJob: (jobId: string) => Promise<void>;
  startScreening: (appId: string) => Promise<ScreeningSession>;
  sendCandidateMessage: (sessionId: string, text: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: Application['status'], notes?: { recruiterName: string; content: string }) => Promise<void>;
  refreshStates: () => Promise<void>;
  isGeneratingAI: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [activeParams, setActiveParams] = useState<ViewParams>({});
  const [viewHistory, setViewHistory] = useState<AppView[]>(['landing']);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [sessions, setSessions] = useState<ScreeningSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const clearToast = () => setToast(null);

  const refreshStates = async () => {
    try {
      const [j, a, s, n, l] = await Promise.allSettled([
        api.getJobs(),
        api.getApplications(),
        api.getSessions(),
        api.getNotifications(user?.email),
        api.getLogs(),
      ]);
      if (j.status === 'fulfilled' && Array.isArray(j.value)) setJobs(j.value);
      if (a.status === 'fulfilled' && Array.isArray(a.value)) setApplications(a.value);
      if (s.status === 'fulfilled' && Array.isArray(s.value)) setSessions(s.value);
      if (n.status === 'fulfilled' && Array.isArray(n.value)) setNotifications(n.value);
      if (l.status === 'fulfilled' && Array.isArray(l.value)) setLogs(l.value);
    } catch (err) {
      console.warn('refreshStates error:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsAppLoading(true);
      try {
        const savedUser = await api.validateToken();
        if (savedUser) {
          setUser(savedUser);
          await refreshStates();
          if (savedUser.role === 'candidate') setActiveView('candidate-dashboard');
          else if (savedUser.role === 'recruiter') setActiveView('recruiter-dashboard');
          else setActiveView('admin-dashboard');
        } else {
          setActiveView('landing');
        }
      } catch (_) {
        setActiveView('landing');
      } finally {
        setIsAppLoading(false);
      }
    };
    init();
  }, []);

  const navigate = (view: AppView, params: ViewParams = {}) => {
    setViewHistory(prev => [...prev, activeView]);
    setActiveView(view);
    setActiveParams(params);
  };

  const goBack = () => {
    const copy = [...viewHistory];
    const prev = copy.pop();
    if (prev) {
      setActiveView(prev);
      setViewHistory(copy);
      setActiveParams({});
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: loggedUser } = await api.login(email, password);
      setUser(loggedUser);
      await refreshStates();
      showToast(`Welcome back, ${loggedUser.firstName}!`, 'success');
      if (loggedUser.role === 'candidate') navigate('candidate-dashboard');
      else if (loggedUser.role === 'recruiter') navigate('recruiter-dashboard');
      else navigate('admin-dashboard');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed. Check your credentials.', 'error');
      return false;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setJobs([]);
    setApplications([]);
    setSessions([]);
    setNotifications([]);
    setLogs([]);
    setActiveView('landing');
    setActiveParams({});
    setViewHistory(['landing']);
    showToast('Signed out successfully.', 'info');
  };

  const registerCandidate = async (payload: { firstName: string; lastName: string; email: string; password: string; bio?: string; skills?: string[]; linkedinUrl?: string }): Promise<User> => {
    const newUser = await api.registerCandidate(payload);
    showToast('Account created! Please verify your email.', 'success');
    return newUser;
  };

  const registerRecruiter = async (payload: { companyName: string; firstName: string; lastName: string; email: string; password: string; industry?: string; companySize?: string }): Promise<User> => {
    const newUser = await api.registerRecruiter(payload);
    showToast('Recruiter account created! Please verify your email.', 'success');
    return newUser;
  };

  const saveJob = async (job: Job) => {
    await api.saveJob(job);
    await refreshStates();
    showToast(`Job "${job.title}" saved.`, 'success');
  };

  const deleteJob = async (id: string) => {
    await api.deleteJob(id);
    await refreshStates();
    showToast('Job removed.', 'warning');
  };

  const applyForJob = async (jobId: string) => {
    if (!user) {
      showToast('Please log in to apply.', 'error');
      navigate('auth-login');
      return;
    }
    const app = await api.applyForJob(jobId, user.id);
    await refreshStates();
    showToast('Applied! Screening queue unlocked.', 'success');
    navigate('candidate-app-detail', { applicationId: app.id });
  };

  const startScreening = async (appId: string): Promise<ScreeningSession> => {
    const candidateName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Candidate';
    const session = await api.startScreening(appId, candidateName);
    setSessions(prev => [...prev.filter(s => s.applicationId !== appId), session]);
    showToast('AI screening session started. Good luck!', 'info');
    navigate('candidate-screening', { sessionId: session.id, applicationId: appId });
    return session;
  };

  const sendCandidateMessage = async (sessionId: string, text: string) => {
    setIsGeneratingAI(true);
    try {
      const updated = await api.submitResponseToAI(sessionId, text);
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
    } catch (err: any) {
      showToast(err.message || 'AI response failed. Try again.', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const updateApplicationStatus = async (appId: string, status: Application['status'], notes?: { recruiterName: string; content: string }) => {
    await api.updateApplicationStatus(appId, status, notes);
    await refreshStates();
    showToast(`Status updated to: ${status.toUpperCase()}`, 'success');
  };

  return (
    <AppContext.Provider value={{
      user, activeView, activeParams, jobs, applications, sessions,
      notifications, logs, isAppLoading, navigate, previousViews: viewHistory,
      goBack, login, logout, registerCandidate, registerRecruiter,
      saveJob, deleteJob, applyForJob, startScreening, sendCandidateMessage,
      updateApplicationStatus, refreshStates, isGeneratingAI, toast, showToast, clearToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be inside an AppProvider context.');
  return context;
};
