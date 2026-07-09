import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './components/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './components/shared/HomePage';
import { AuthPages } from './components/auth/AuthPages';
import { HelpPage } from './components/shared/HelpPage';
import { HowItWorksPage, AboutPage, ContactPage, PublicJobsPage, PublicCandidatesPage } from './components/shared/PublicPages';
import { AcceptInvitePage } from './components/shared/AcceptInvitePage';
import { CandidatePages } from './components/candidate/CandidatePages';
import { RecruiterPages } from './components/recruiter/RecruiterPages';
import { CandidatesDirectory, RecruiterCandidateDetailPage } from './components/recruiter/CandidatesDirectory';
import { AdminPages } from './components/admin/AdminPages';
import { SupportChatbot } from './components/shared/SupportChatbot';
import { Check, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { useCMS } from './components/admin/AdminCMS';

export const ROUTES: Record<string, string> = {
  'landing': '/',
  'auth-login': '/login',
  'auth-register-candidate-1': '/register/candidate',
  'auth-register-recruiter': '/register/recruiter',
  'verify-email': '/verify-email',
  'forgot-password': '/forgot-password',
  'help': '/help',
  'accept-invite': '/accept-invite',
  'candidate-dashboard': '/candidate/dashboard',
  'candidate-jobs': '/candidate/jobs',
  'candidate-job-detail': '/candidate/job',
  'candidate-app-detail': '/candidate/application',
  'candidate-screening': '/candidate/screening',
  'candidate-profile': '/candidate/profile',
  'candidate-settings': '/candidate/settings',
  'candidate-notifications': '/candidate/notifications',
  'candidate-applications': '/candidate/applications',
  'recruiter-dashboard': '/recruiter/dashboard',
  'recruiter-applications': '/recruiter/applications',
  'recruiter-app-detail': '/recruiter/application',
  'recruiter-queue': '/recruiter/queue',
  'recruiter-jobs': '/recruiter/jobs',
  'recruiter-job-detail': '/recruiter/job',
  'recruiter-create-job': '/recruiter/jobs/create',
  'recruiter-edit-job': '/recruiter/jobs/edit',
  'recruiter-reports': '/recruiter/reports',
  'recruiter-team': '/recruiter/team',
  'recruiter-settings': '/recruiter/settings',
  'recruiter-candidates': '/recruiter/candidates',
  'recruiter-candidate-detail': '/recruiter/candidates/profile',
  'how-it-works': '/how-it-works',
  'about': '/about',
  'contact': '/contact',
  'public-jobs': '/jobs',
  'public-candidates': '/candidates',
  'admin-dashboard': '/admin',
  'admin-users': '/admin/users',
  'admin-jobs': '/admin/jobs',
  'admin-applications': '/admin/applications',
  'admin-finance': '/admin/finance',
  'admin-cms': '/admin/cms',
  'admin-settings': '/admin/settings',
  'admin-credits': '/admin/credits',
  'admin-pricing': '/admin/pricing',
};

const PATH_TO_VIEW: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTES).map(([view, path]) => [path, view])
);

const guestViews = ['landing', 'auth-login', 'auth-register-candidate-1', 'auth-register-recruiter', 'verify-email', 'forgot-password', 'help', 'accept-invite', 'how-it-works', 'about', 'contact', 'public-jobs', 'public-candidates'];

const RouterSync: React.FC = () => {
  const { activeView, navigate: appNavigate, activeParams } = useApp();
  const routerNavigate = useNavigate();
  const location = useLocation();
  const isSyncing = useRef(false);

  useEffect(() => {
    if (isSyncing.current) return;
    const targetPath = ROUTES[activeView] || '/';
    if (location.pathname !== targetPath) {
      const params = new URLSearchParams();
      if (activeParams.jobId) params.set('jobId', activeParams.jobId);
      if (activeParams.applicationId) params.set('applicationId', activeParams.applicationId);
      if (activeParams.sessionId) params.set('sessionId', activeParams.sessionId);
      if (activeParams.editJobId) params.set('editJobId', activeParams.editJobId);
      if (activeParams.mode) params.set('mode', activeParams.mode);
      if (activeParams.candidateId) params.set('candidateId', activeParams.candidateId);
      if (activeParams.recruiterId) params.set('recruiterId', activeParams.recruiterId);
      const search = params.toString() ? `?${params.toString()}` : '';
      routerNavigate(`${targetPath}${search}`, { replace: false });
    }
  }, [activeView]);

  useEffect(() => {
    const view = PATH_TO_VIEW[location.pathname];
    if (view && view !== activeView) {
      isSyncing.current = true;
      const params = new URLSearchParams(location.search);
      const viewParams: any = {};
      if (params.get('jobId')) viewParams.jobId = params.get('jobId');
      if (params.get('applicationId')) viewParams.applicationId = params.get('applicationId');
      if (params.get('sessionId')) viewParams.sessionId = params.get('sessionId');
      if (params.get('editJobId')) viewParams.editJobId = params.get('editJobId');
      if (params.get('mode')) viewParams.mode = params.get('mode');
      if (params.get('candidateId')) viewParams.candidateId = params.get('candidateId');
      appNavigate(view as any, viewParams);
      setTimeout(() => { isSyncing.current = false; }, 100);
    }
  }, [location.pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const { user, activeView, toast, clearToast, isAppLoading, navigate } = useApp();
  const cms = useCMS();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Wire SEO meta title from CMS
  useEffect(() => {
    if (cms.seo?.metaTitle) document.title = cms.seo.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && cms.seo?.metaDescription) metaDesc.setAttribute('content', cms.seo.metaDescription);
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && cms.seo?.keywords) metaKeywords.setAttribute('content', cms.seo.keywords);
  }, [cms.seo]);
  const renderPage = () => {
    if (user?.role === 'recruiter' && activeView === 'public-jobs') { setTimeout(() => navigate('recruiter-dashboard'), 0); return null; }
    if (user?.role === 'candidate' && activeView === 'public-candidates') { setTimeout(() => navigate('candidate-dashboard'), 0); return null; }
    switch (activeView) {
      case 'landing': return <HomePage />;
      case 'auth-login': return <AuthPages subView="login" />;
      case 'auth-register-candidate-1': return <AuthPages subView="register-candidate-1" />;
      case 'auth-register-recruiter': return <AuthPages subView="register-recruiter" />;
      case 'verify-email': return <AuthPages subView="verify-email" />;
      case 'forgot-password': return <AuthPages subView="forgot-password" />;
      case 'help': return <HelpPage />;
      case 'accept-invite': return <AcceptInvitePage />;
      case 'how-it-works': return <HowItWorksPage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'public-jobs': return <PublicJobsPage />;
      case 'public-candidates': return <PublicCandidatesPage />;
      case 'candidate-dashboard': return <CandidatePages subView="dashboard" />;
      case 'candidate-jobs': return <CandidatePages subView="jobs" />;
      case 'candidate-job-detail': return <CandidatePages subView="job-detail" />;
      case 'candidate-app-detail': return <CandidatePages subView="app-detail" />;
      case 'candidate-screening': return <CandidatePages subView="screening" />;
      case 'candidate-profile': return <CandidatePages subView="profile" />;
      case 'candidate-settings': return <CandidatePages subView="settings" />;
      case 'candidate-notifications': return <CandidatePages subView="notifications" />;
      case 'candidate-applications': return <CandidatePages subView="applications" />;
      case 'recruiter-dashboard': return <RecruiterPages subView="dashboard" />;
      case 'recruiter-applications': return <RecruiterPages subView="applications" />;
      case 'recruiter-app-detail': return <RecruiterPages subView="app-detail" />;
      case 'recruiter-queue': return <RecruiterPages subView="queue" />;
      case 'recruiter-jobs': return <RecruiterPages subView="jobs" />;
      case 'recruiter-job-detail': return <RecruiterPages subView="job-detail" />;
      case 'recruiter-create-job': return <RecruiterPages subView="create-job" />;
      case 'recruiter-edit-job': return <RecruiterPages subView="create-job" />;
      case 'recruiter-reports': return <RecruiterPages subView="reports" />;
      case 'recruiter-team': return <RecruiterPages subView="team" />;
      case 'recruiter-settings': return <RecruiterPages subView="settings" />;
      case 'recruiter-candidates': return <CandidatesDirectory />;
      case 'recruiter-candidate-detail': return <RecruiterCandidateDetailPage />;
      case 'admin-dashboard': return <AdminPages subView="overview" />;
      case 'admin-users': return <AdminPages subView="users" />;
      case 'admin-jobs': return <AdminPages subView="jobs" />;
      case 'admin-applications': return <AdminPages subView="applications" />;
      case 'admin-finance': return <AdminPages subView="finance" />;
      case 'admin-cms': return <AdminPages subView="cms" />;
      case 'admin-settings': return <AdminPages subView="settings" />;
      case 'admin-credits': return <AdminPages subView="credits" />;
      case 'admin-pricing': return <AdminPages subView="pricing" />;
      default: return <HomePage />;
    }
  };

  const isGuest = guestViews.includes(activeView);
  const isPublicPage = ['how-it-works', 'about', 'contact', 'public-jobs', 'public-candidates'].includes(activeView);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="36" height="36" fill="#0D0D0F" rx="6"/>
              <text x="3" y="25" fontFamily="'Sora', sans-serif" fontWeight="800" fontSize="16" fill="white" letterSpacing="-0.5">QAN</text>
              <text x="28.5" y="25" fontFamily="'Sora', sans-serif" fontWeight="800" fontSize="16" fill="white">I</text>
              <polygon points="30,4 32,9 28,9" fill="#C9A24A"/>
              <rect x="29.5" y="9" width="1.2" height="10" fill="#C9A24A"/>
            </svg>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading QANI...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-50 flex flex-col text-gray-900 selection:bg-blue-200">
      <RouterSync />

      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 border rounded-xl flex items-center gap-3 shadow-2xl bg-white max-w-sm">
          {toast.type === 'success' && <Check className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
          <p className="text-xs font-semibold text-gray-800 leading-snug">{toast.message}</p>
          <button onClick={clearToast} className="cursor-pointer text-gray-400 hover:text-gray-600 font-bold text-sm shrink-0 pl-1">×</button>
        </div>
      )}

      {user && !isGuest && !isPublicPage ? (
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
          {activeView !== 'landing' && !isPublicPage && <Header />}
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
