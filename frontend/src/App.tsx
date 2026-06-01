import React, { useEffect } from 'react';
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
import { Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, activeView, toast, clearToast, isAppLoading } = useApp();

  // Handle toast timers
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // View Routing maps
  const renderMainSection = () => {
    switch (activeView) {
      // GUEST / AUTH LAYOUTS
      case 'landing':
        return <HomePage />;
      case 'auth-login':
        return <AuthPages subView="login" />;
      case 'auth-register-candidate-1':
        return <AuthPages subView="register-candidate-1" />;
      case 'auth-register-recruiter':
        return <AuthPages subView="register-recruiter" />;
      case 'verify-email':
        return <AuthPages subView="verify-email" />;
      case 'help':
        return <HelpPage />;

      // CANDIDATE PORTAL LAYOUTS
      case 'candidate-dashboard':
        return <CandidatePages subView="dashboard" />;
      case 'candidate-jobs':
        return <CandidatePages subView="jobs" />;
      case 'candidate-job-detail':
        return <CandidatePages subView="job-detail" />;
      case 'candidate-app-detail':
        return <CandidatePages subView="app-detail" />;
      case 'candidate-screening':
        return <CandidatePages subView="screening" />;
      case 'candidate-profile':
        return <CandidatePages subView="profile" />;
      case 'candidate-settings':
        return <CandidatePages subView="settings" />;
      case 'candidate-notifications':
        return <CandidatePages subView="notifications" />;

      // RECRUITER PORTAL LAYOUTS
      case 'recruiter-dashboard':
        return <RecruiterPages subView="dashboard" />;
      case 'recruiter-applications':
        return <RecruiterPages subView="applications" />;
      case 'recruiter-app-detail':
        return <RecruiterPages subView="app-detail" />;
      case 'recruiter-queue':
        return <RecruiterPages subView="queue" />;
      case 'recruiter-jobs':
        return <RecruiterPages subView="jobs" />;
      case 'recruiter-create-job':
        return <RecruiterPages subView="create-job" />;
      case 'recruiter-reports':
        return <RecruiterPages subView="reports" />;
      case 'recruiter-team':
        return <RecruiterPages subView="team" />;
      case 'recruiter-settings':
        return <RecruiterPages subView="settings" />;
      case 'recruiter-candidates':
        return <CandidatesDirectory />;

      // ADMIN PORTAL LAYOUTS
      case 'admin-dashboard':
        return <AdminPages subView="dashboard" />;
      case 'admin-users':
        return <AdminPages subView="users" />;

      default:
        return <HomePage />;
    }
  };

  const isGuestView = ['landing', 'auth-login', 'auth-register-candidate-1', 'auth-register-recruiter', 'verify-email'].includes(activeView);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 shadow-lg" />
            <div className="relative w-10 h-10 bg-gray-950 rounded-lg border border-gray-800 flex items-center justify-center font-mono font-black text-white text-base">Q</div>
          </div>
          <p className="text-sm text-gray-500 animate-pulse">Loading QANI...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="qani-root-frame" className="relative min-h-screen font-sans bg-gray-50 flex flex-col text-gray-900 overflow-hidden selection:bg-blue-200">
      
      {/* Global Toast Alert banner top right */}
      {toast && (
        <div 
          id="global-stage-toast" 
          className="fixed top-6 right-6 z-50 p-4 border rounded-xl flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm bg-white"
        >
          {toast.type === 'success' && <Check className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}

          <p className="text-xs font-semibold text-gray-800 leading-snug">{toast.message}</p>
          <button 
            type="button" 
            onClick={clearToast}
            className="text-gray-400 hover:text-gray-600 font-bold text-sm shrink-0 pl-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Structural Rendering Switch */}
      {user && !isGuestView ? (
        <div className="flex h-screen w-screen overflow-hidden">
          {/* Role based Sidebar navigation */}
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Context Header widgets */}
            <Header />

            {/* Active page contents */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
              {renderMainSection()}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {activeView !== 'landing' && <Header />}
          <main className="flex-grow flex flex-col">
            {renderMainSection()}
          </main>
        </div>
      )}

      {/* Floating Interactive Customer Support Chatbot widget */}
      <SupportChatbot />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
