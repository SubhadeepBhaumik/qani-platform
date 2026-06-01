import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './components/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './components/shared/HomePage';
import { AuthPages } from './components/auth/AuthPages';
import { HelpPage } from './components/shared/HelpPage';
import { CandidatePages } from './components/candidate/CandidatePages';
import { RecruiterPages } from './components/recruiter/RecruiterPages';
import { CandidatesDirectory } from './components/recruiter/CandidatesDirectory';
import { AdminPages } from './components/admin/AdminPages';
import { SupportChatbot } from './components/shared/SupportChatbot';
import { Check, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';

// Route map: internal view name → URL path
export const ROUTES: Record<string, string> = {
  'landing': '/',
  'auth-login': '/login',
  'auth-register-candidate-1': '/register/candidate',
  'auth-register-recruiter': '/register/recruiter',
  'verify-email': '/verify-email',
  'help': '/help',
  'candidate-dashboard': '/candidate/dashboard',
  'candidate-jobs': '/candidate/jobs',
  'candidate-job-detail': '/candidate/job',
  'candidate-app-detail': '/candidate/application',
  'candidate-screening': '/candidate/screening',
  'candidate-profile': '/candidate/profile',
  'candidate-settings': '/candidate/settings',
  'candidate-notifications': '/candidate/notifications',
  'recruiter-dashboard': '/recruiter/dashboard',
  'recruiter-applications': '/recruiter/applications',
  'recruiter-app-detail': '/recruiter/application',
  'recruiter-queue': '/recruiter/queue',
  'recruiter-jobs': '/recruiter/jobs',
  'recruiter-create-job': '/recruiter/jobs/create',
  'recruiter-reports': '/recruiter/reports',
  'recruiter-team': '/recruiter/team',
  'recruiter-settings': '/recruiter/settings',
  'recruiter-candidates': '/recruiter/candidates',
  'admin-dashboard': '/admin',
  'admin-users': '/admin/users',
  'admin-finance': '/admin/finance',
  'admin-cms': '/admin/cms',
  'admin-settings': '/admin/settings',
  'admin-jobs': '/admin/jobs',
  'admin-applications': '/admin/applications',
};

// Reverse map: URL path → view name
const PATH_TO_VIEW: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTES).map(([view, path]) => [path, view])
);

const guestViews = ['landing', 'auth-login', 'auth-register-candidate-1', 'auth-register-recruiter', 'verify-email', 'help'];

// Syncs React Router URL with AppContext view state
const RouterSync: React.FC = () => {
  const { activeView, navigate: appNavigate, activeParams } = useApp();
  const routerNavigate = useNavigate();
  const location = useLocation();

  // When AppContext view changes → update browser URL
  useEffect(() => {
    const targetPath = ROUTES[activeView] || '/';
    const params = new URLSearchParams();
    if (activeParams.jobId) params.set('jobId', activeParams.jobId);
    if (activeParams.applicationId) params.set('applicationId', activeParams.applicationId);
    if (activeParams.sessionId) params.set('sessionId', activeParams.sessionId);
    const search = params.toString() ? `?${params.toString()}` : '';
    const fullPath = `${targetPath}${search}`;
    if (location.pathname !== targetPath) {
      routerNavigate(fullPath);
    }
  }, [activeView, activeParams]);

  // When browser URL changes (back/forward) → update AppContext view
  useEffect(() => {
    const view = PATH_TO_VIEW[location.pathname];
    if (view && view !== activeView) {
      const params = new URLSearchParams(location.search);
      const viewParams: any = {};
      if (params.get('jobId')) viewParams.jobId = params.get('jobId');
      if (params.get('applicationId')) viewParams.applicationId = params.get('applicationId');
      if (params.get('sessionId')) viewParams.sessionId = params.get('sessionId');
      appNavigate(view as any, viewParams);
    }
  }, [location.pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const { user, activeView, toast, clearToast, isAppLoading } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const renderPage = () => {
    switch (activeView) {
      case 'landing': return <HomePage />;
      case 'auth-login': return <AuthPages subView="login" />;
      case 'auth-register-candidate-1': return <AuthPages subView="register-candidate-1" />;
      case 'auth-register-recruiter': return <AuthPages subView="register-recruiter" />;
      case 'verify-email': return <AuthPages subView="verify-email" />;
      case 'help': return <HelpPage />;
      case 'candidate-dashboard': return <CandidatePages subView="dashboard" />;
      case 'candidate-jobs': return <CandidatePages subView="jobs" />;
      case 'candidate-job-detail': return <CandidatePages subView="job-detail" />;
      case 'candidate-app-detail': return <CandidatePages subView="app-detail" />;
      case 'candidate-screening': return <CandidatePages subView="screening" />;
      case 'candidate-profile': return <CandidatePages subView="profile" />;
      case 'candidate-settings': return <CandidatePages subView="settings" />;
      case 'candidate-notifications': return <CandidatePages subView="notifications" />;
      case 'recruiter-dashboard': return <RecruiterPages subView="dashboard" />;
      case 'recruiter-applications': return <RecruiterPages subView="applications" />;
      case 'recruiter-app-detail': return <RecruiterPages subView="app-detail" />;
      case 'recruiter-queue': return <RecruiterPages subView="queue" />;
      case 'recruiter-jobs': return <RecruiterPages subView="jobs" />;
      case 'recruiter-create-job': return <RecruiterPages subView="create-job" />;
      case 'recruiter-reports': return <RecruiterPages subView="reports" />;
      case 'recruiter-team': return <RecruiterPages subView="team" />;
      case 'recruiter-settings': return <RecruiterPages subView="settings" />;
      case 'recruiter-candidates': return <CandidatesDirectory />;
      case 'admin-dashboard': return <AdminPages subView="dashboard" />;
      case 'admin-users': return <AdminPages subView="users" />;
      default: return <HomePage />;
    }
  };

  const isGuest = guestViews.includes(activeView);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 shadow-lg" />
            <div className="relative w-full h-full bg-gray-950 rounded-lg border border-gray-800 flex items-center justify-center font-mono font-black text-white text-base">Q</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading QANI...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-50 flex flex-col text-gray-900 selection:bg-blue-200">
      <RouterSync />

      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 border rounded-xl flex items-center gap-3 shadow-2xl bg-white max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          {toast.type === 'success' && <Check className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
          <p className="text-xs font-semibold text-gray-800 leading-snug">{toast.message}</p>
          <button onClick={clearToast} className="cursor-pointer text-gray-400 hover:text-gray-600 font-bold text-sm shrink-0 pl-1">×</button>
        </div>
      )}

      {user && !isGuest ? (
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
              {renderPage()}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {activeView !== 'landing' && <Header />}
          <main className="flex-grow flex flex-col">
            {renderPage()}
          </main>
        </div>
      )}

      <SupportChatbot />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
