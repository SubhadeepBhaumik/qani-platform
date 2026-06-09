import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { api } from '../../lib/api';
import { Bell, ChevronDown, CheckCircle2, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, notifications, navigate, refreshStates } = useApp();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => n.status === 'unread');

  const pageTitle = () => {
    if (!user) return 'QANI — AI Recruitment Australia';
    if (user.role === 'recruiter') return user.companyName ? `${user.companyName} — Recruiter Portal` : 'Recruiter Portal';
    if (user.role === 'candidate') return `Welcome, ${user.firstName}`;
    return 'Admin Panel';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">

      {/* Left: page context */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">{pageTitle()}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Australia · AI Recruitment Platform
          </p>
        </div>
      </div>

      {/* Right: utilities */}
      <div className="flex items-center gap-3">

        {/* What is QANI — quick explainer for new users */}
        {user && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            AI Recruiter is active — screening candidates automatically
          </div>
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

        {/* Sign in button for guests */}
        {!user && (
          <button
            onClick={() => navigate('auth-login')}
            className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
          >
            Sign In / Register
          </button>
        )}

        {/* Logged in indicator */}
        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
