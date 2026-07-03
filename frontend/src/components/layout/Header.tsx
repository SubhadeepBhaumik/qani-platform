import React, { useState } from 'react';
import { TrialBanner } from '../shared/TrialBanner';
import { useApp } from '../AppContext';
import { api } from '../../lib/api';
import { Bell, ChevronDown, CheckCircle2, MapPin, LayoutDashboard } from 'lucide-react';
import { useCMS } from '../admin/AdminCMS';
import { QANILogo } from '../shared/QANILogo';

export const Header: React.FC = () => {
  const { user, notifications, navigate, refreshStates } = useApp();
  const cms = useCMS();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => n.status === 'unread');

  const pageTitle = () => {
    if (!user) return 'QANI — AI Recruitment Australia';
    if (user.role === 'recruiter') return user.companyName ? `${user.companyName} — Recruiter Portal` : 'Recruiter Portal';
    if (user.role === 'candidate') return `Welcome, ${user.firstName}`;
    return cms.global?.logoText ? `${cms.global.logoText} Admin` : 'Admin Panel';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      {/* AI status bar */}
      {user && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-1.5 flex items-center gap-2 text-[11px] text-blue-700 font-medium">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shrink-0" />
          AI Recruiter is active — screening candidates automatically
        </div>
      )}
      {user && user.role === 'recruiter' && <TrialBanner onBuyCredits={() => { navigate('landing'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100); }} />}
      <div className="h-16 px-6 flex items-center justify-between">

      {/* Left: QANI Logo + public nav links */}
      <div className="flex items-center gap-6">
        <QANILogo size="sm" dark={false} onClick={() => navigate('landing')} showText={false} />
      <div className="flex items-center gap-5 text-xs font-medium text-gray-500">
        <button onClick={() => navigate('how-it-works')} className="cursor-pointer hover:text-blue-600 transition">How It Works</button>
        <button onClick={() => navigate('public-jobs')} className="cursor-pointer hover:text-blue-600 transition">Jobs</button>
        <button onClick={() => navigate('public-candidates')} className="cursor-pointer hover:text-blue-600 transition">Candidates</button>
        <button onClick={() => navigate('about')} className="cursor-pointer hover:text-blue-600 transition">About</button>
        <button onClick={() => navigate('contact')} className="cursor-pointer hover:text-blue-600 transition">Contact</button>
      </div>
      </div>

      {/* Right: utilities */}
      <div className="flex items-center gap-3">


        {/* Preview Site button for admin */}
        {user?.role === 'admin' && (
          <button onClick={() => {
            const params = new URLSearchParams(window.location.search);
            const section = params.get('section') || 'global';
            const pageMap: Record<string, string> = {
              'homepage': '/',
              'how-it-works': '/how-it-works',
              'about': '/about',
              'contact': '/contact',
              'public-jobs': '/jobs',
              'public-candidates': '/candidates',
              'header': '/',
              'footer': '/',
              'global': '/',
              'auth': '/login',
              'help': '/help',
            };
            window.open(pageMap[section] || '/', '_blank');
          }} className="cursor-pointer hidden md:flex items-center gap-1.5 text-[11px] bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Preview Site
          </button>
        )}

        {/* Notifications */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="cursor-pointer p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-40 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{unreadNotifs.length} new</span>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">No notifications yet</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={async () => {
                        if (n.status === 'unread') {
                          await api.markNotificationAsRead(n.id);
                          await refreshStates();
                        }
                        setShowNotifDropdown(false);
                        if (n.type === 'invite_sent' && (n as any).interviewDateTime) {
                          if ((n as any).interviewDateTime && user?.role === 'recruiter') {
                            // Open Google Calendar for recruiter
                            const dt = new Date((n as any).interviewDateTime);
                            const dtEnd = new Date(dt.getTime() + 3600000);
                            const fmt = (d: Date) => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
                            const title = encodeURIComponent(n.title || 'Interview');
                            const gcUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
                              '&text=' + title +
                              '&dates=' + fmt(dt) + '/' + fmt(dtEnd) +
                              '&details=' + encodeURIComponent((n as any).message || 'Interview via QANI') +
                              '&sf=true&output=xml';
                            window.open(gcUrl, '_blank');
                          } else {
                            navigate('candidate-notifications');
                          }
                        } else if (n.relatedApplicationId) {
                          const role = user?.role;
                          const ntype = (n as any).type || '';
                          if (role === 'candidate' && (ntype === 'invite_sent' || ntype === 'screening_complete' || ntype === 'new_application')) {
                            navigate('candidate-app-detail', { applicationId: n.relatedApplicationId });
                          } else if (role === 'candidate') {
                            navigate('candidate-app-detail', { applicationId: n.relatedApplicationId });
                          } else navigate('recruiter-applications');
                        } else if (n.relatedJobId) {
                          const role = user?.role;
                          if (role === 'candidate') navigate('candidate-job-detail', { jobId: n.relatedJobId });
                          else navigate('recruiter-jobs');
                        } else {
                          // Route system notifications by type and content
                          const type = (n as any).type || '';
                          const title = (n as any).title || '';
                          const msg = (n as any).message || '';
                          if (type === 'new_application' || title.toLowerCase().includes('application')) {
                            if (user?.role === 'candidate') navigate('candidate-applications');
                            else navigate('recruiter-applications');
                          } else if (type === 'screening_complete' || title.toLowerCase().includes('screening')) {
                            if (user?.role === 'candidate') navigate('candidate-applications');
                            else navigate('recruiter-applications');
                          } else if (type === 'job_expiring' || msg.toLowerCase().includes('job') || title.toLowerCase().includes('job')) {
                            if (user?.role === 'candidate') navigate('candidate-jobs');
                            else navigate('recruiter-jobs');
                          } else if (type === 'candidate_qualified' || title.toLowerCase().includes('qualified')) {
                            navigate('recruiter-applications');
                          } else {
                            if (user?.role === 'candidate') navigate('candidate-notifications');
                            else navigate('recruiter-dashboard');
                          }
                        }
                      }}
                      className={`cursor-pointer p-3 hover:bg-gray-50 border-b border-gray-50 transition ${n.status === 'unread' ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-semibold ${n.status === 'unread' ? 'text-gray-900' : 'text-gray-500'}`}>{n.title}</p>
                        {n.status === 'unread' && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.content || n.message}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">{new Date(n.date || n.createdAt || '').toLocaleString('en-AU')}</span>
                    </div>
                  ))
                )}
                <div className="p-2 border-t border-gray-100">
                  <button onClick={() => { setShowNotifDropdown(false); if (user?.role === 'candidate') navigate('candidate-notifications'); else navigate('recruiter-dashboard'); }}
                    className="w-full text-center text-[11px] text-blue-600 hover:text-blue-800 font-semibold py-1 cursor-pointer">
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sign in/register buttons — only show when NOT logged in */}
        {!user && (
          <>
            <button onClick={() => navigate('auth-login')} className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 font-semibold px-4 py-2 transition">
              Sign In
            </button>
            <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition hidden sm:block">
              Find Jobs
            </button>
            <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md shadow-blue-500/20">
              Start Recruiting
            </button>
          </>
        )}

        {/* Logged in indicator + dashboard link */}
        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <button
              onClick={() => {
                if (user.role === 'candidate') navigate('candidate-dashboard');
                else if (user.role === 'recruiter') navigate('recruiter-dashboard');
                else navigate('admin-dashboard');
              }}
              className="cursor-pointer hidden sm:flex items-center gap-1.5 text-xs bg-gray-900 hover:bg-gray-700 text-white font-semibold py-1.5 px-3 rounded-lg transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};
