import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Bell, ChevronDown, CheckCircle2, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, notifications, navigate, markNotifRead } = useApp();
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
                      onClick={() => { markNotifRead(n.id); setShowNotifDropdown(false); }}
                      className={`cursor-pointer p-3 hover:bg-gray-50 border-b border-gray-50 transition ${n.status === 'unread' ? 'bg-blue-50/30' : ''}`}
                    >
                      <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.content}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">{new Date(n.date).toLocaleString('en-AU')}</span>
                    </div>
                  ))
                )}
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
