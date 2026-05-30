import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Job, User, Application, Notification, ScreeningSession, SystemLog } from '../types';

export type AppView = 
  // Auth
  | 'landing' 
  | 'auth-login' 
  | 'auth-register-candidate-1' 
  | 'auth-register-recruiter'
  | 'verify-email'
  // Candidate
  | 'candidate-dashboard'
  | 'candidate-jobs'
  | 'candidate-job-detail'
  | 'candidate-app-detail'
  | 'candidate-screening'
  | 'candidate-profile'
  | 'candidate-settings'
  | 'candidate-notifications'
  // Recruiter
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
  // Admin
  | 'admin-dashboard'
  | 'admin-users'
  // Shared
  | 'help'
  // Errors
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
  navigate: (view: AppView, params?: ViewParams) => void;
  previousViews: AppView[];
  goBack: () => void;
  
  // Handlers
  login: (email: string, role: User['role']) => boolean;
  logout: () => void;
  registerCandidate: (firstName: string, lastName: string, email: string) => User;
  registerRecruiter: (companyName: string, firstName: string, lastName: string, email: string, industry: string, size: string) => User;
  saveJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  applyForJob: (jobId: string) => void;
  startScreening: (appId: string) => ScreeningSession;
  sendCandidateMessage: (sessionId: string, text: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: Application['status'], notes?: { recruiterName: string; content: string }) => void;
  
  // UI Helpers
  refreshStates: () => void;
  isGeneratingAI: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    // Initial load
    refreshStates();
    const currUser = api.getCurrentUser();
    if (currUser) {
      setUser(currUser);
      // Automatically route logged in users
      if (currUser.role === 'candidate') {
        setActiveView('candidate-dashboard');
      } else if (currUser.role === 'recruiter') {
        setActiveView('recruiter-dashboard');
      } else {
        setActiveView('admin-dashboard');
      }
    }
  }, []);

  const refreshStates = () => {
    setJobs(api.getJobs());
    setApplications(api.getApplications());
    setSessions(api.getSessions());
    setNotifications(api.getNotifications());
    setLogs(api.getLogs());
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const clearToast = () => setToast(null);

  const navigate = (view: AppView, params: ViewParams = {}) => {
    // Prevent standard route leaking, manage history
    setViewHistory(prev => [...prev, activeView]);
    setActiveView(view);
    setActiveParams(params);
    refreshStates();
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const copy = [...viewHistory];
      const prev = copy.pop();
      if (prev) {
        setActiveView(prev);
        setViewHistory(copy);
        setActiveParams({});
      }
    } else {
      setActiveView(user?.role === 'candidate' ? 'candidate-dashboard' : user?.role === 'recruiter' ? 'recruiter-dashboard' : 'landing');
    }
  };

  const login = (email: string, role: User['role']): boolean => {
    const list = api.getUsers();
    let matched = list.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    
    if (!matched) {
      // Lazy construct standard user for quick mock evaluations
      matched = {
        id: `${role}-${Date.now()}`,
        email: email.toLowerCase(),
        firstName: role === 'candidate' ? 'John' : role === 'recruiter' ? 'Sarah' : 'Admin',
        lastName: role === 'candidate' ? 'Doe' : role === 'recruiter' ? 'Chen' : 'System',
        role,
        emailVerified: true,
        companyName: role === 'recruiter' ? 'Acme Tech Solutions' : undefined,
        skills: role === 'candidate' ? ['React', 'TypeScript', 'Node.js'] : undefined,
        privacy: { isPublic: true, showLocation: true, showPhone: true, allowContact: true }
      };
      // Save newly resolved mock user
      api.saveUser(matched);
    }

    setUser(matched);
    api.setCurrentUser(matched);
    showToast(`Logged in successfully as ${matched.firstName}!`, 'success');

    if (role === 'candidate') {
      navigate('candidate-dashboard');
    } else if (role === 'recruiter') {
      navigate('recruiter-dashboard');
    } else {
      navigate('admin-dashboard');
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    api.setCurrentUser(null);
    setActiveView('landing');
    setActiveParams({});
    setViewHistory(['landing']);
    showToast('Signed out of QANI session.', 'info');
  };

  const handNewCandidate = (firstName: string, lastName: string, email: string): User => {
    const u = api.registerCandidate(firstName, lastName, email, 10);
    setUser(u);
    api.setCurrentUser(u);
    refreshStates();
    showToast('Verification request generated. Initial user verified automatically.', 'success');
    return u;
  };

  const handNewRecruiter = (companyName: string, firstName: string, lastName: string, email: string, industry: string, size: string): User => {
    const u = api.registerRecruiter(companyName, firstName, lastName, email, industry, size);
    setUser(u);
    api.setCurrentUser(u);
    refreshStates();
    showToast('Recruiter profile registered! Welcome to the workspace.', 'success');
    return u;
  };

  const handSaveJob = (job: Job) => {
    api.saveJob(job);
    refreshStates();
    showToast(`Job '${job.title}' saved successfully!`, 'success');
  };

  const handDeleteJob = (id: string) => {
    api.deleteJob(id);
    refreshStates();
    showToast('Job posting has been closed and removed.', 'warning');
  };

  const handApply = (jobId: string) => {
    if (!user) {
      showToast('Please log in as a candidate to apply.', 'error');
      navigate('auth-login');
      return;
    }
    const app = api.applyForJob(jobId, user.id);
    refreshStates();
    showToast('Successfully applied to the position! Screening queue unlocked.', 'success');
    navigate('candidate-app-detail', { applicationId: app.id });
  };

  const handStartScreening = (appId: string): ScreeningSession => {
    const session = api.startScreening(appId);
    refreshStates();
    showToast('Gemini interview session initiated. Prepare your arguments!', 'info');
    navigate('candidate-screening', { sessionId: session.id, applicationId: appId });
    return session;
  };

  const handSendCandidateMessage = async (sessionId: string, text: string) => {
    setIsGeneratingAI(true);
    try {
      await api.submitResponseToAI(sessionId, text);
      refreshStates();
    } catch (e) {
      showToast('Error getting response from AI recruiter.', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handUpdateAppStatus = (appId: string, status: Application['status'], notes?: { recruiterName: string; content: string }) => {
    api.updateApplicationStatus(appId, status, notes);
    refreshStates();
    showToast(`Applicant status set to: ${status.toUpperCase()}`, 'success');
  };

  return (
    <AppContext.Provider value={{
      user,
      activeView,
      activeParams,
      jobs,
      applications,
      sessions,
      notifications,
      logs,
      navigate,
      previousViews: viewHistory,
      goBack,
      
      login,
      logout,
      registerCandidate: handNewCandidate,
      registerRecruiter: handNewRecruiter,
      saveJob: handSaveJob,
      deleteJob: handDeleteJob,
      applyForJob: handApply,
      startScreening: handStartScreening,
      sendCandidateMessage: handSendCandidateMessage,
      updateApplicationStatus: handUpdateAppStatus,
      
      refreshStates,
      isGeneratingAI,
      toast,
      showToast,
      clearToast
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
