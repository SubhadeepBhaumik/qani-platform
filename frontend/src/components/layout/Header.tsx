import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Bell, Search, Globe, ChevronDown, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, notifications, navigate, refreshStates, login, logout } = useApp();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadNotifs = notifications.filter(n => n.status === 'unread');

  const triggerRoleSwitch = (role: 'candidate' | 'recruiter' | 'admin') => {
    const defaultEmail = role === 'candidate' ? 'candidate@qani.ai' : role === 'recruiter' ? 'recruiter@qani.ai' : 'admin@qani.ai';
    login(defaultEmail, role);
    setShowRoleSwitcher(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Title block */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 border border-gray-200 text-gray-700 py-1 px-2.5 rounded-full font-medium">
              Org Key: {user?.companyName ? user.companyName : "Global Public Access"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
            <div className="relative flex items-center justify-center w-8.5 h-8.5">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3 shadow-sm group-hover:rotate-6 transition-all duration-300" />
              <div className="relative w-7 h-7 bg-gray-950 rounded border border-gray-800/85 flex items-center justify-center font-mono font-extrabold text-white text-xs tracking-tighter">
                Q
              </div>
            </div>
            <span className="font-extrabold tracking-tight text-sm text-gray-950 group-hover:text-blue-600 transition duration-300">QANI Platform</span>
          </div>
        )}
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4">
        {/* Real-time Switch role preview utility */}
        <div className="relative">
          <button 
            id="role-switcher-toggle"
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-1.5 px-3 rounded-lg font-medium transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Switch Role (Demo)</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] uppercase font-bold text-gray-400 px-4 py-1 tracking-wider border-b border-gray-100">Toggle Workspace Context</p>
              <button 
                onClick={() => triggerRoleSwitch('candidate')} 
                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${user?.role === 'candidate' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                <span>Candidate Portal</span>
                {user?.role === 'candidate' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => triggerRoleSwitch('recruiter')} 
                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${user?.role === 'recruiter' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                <span>Recruiter Portal</span>
                {user?.role === 'recruiter' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => triggerRoleSwitch('admin')} 
                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${user?.role === 'admin' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                <span>Admin Terminal</span>
                {user?.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {user && (
          <div className="relative">
            <button 
              id="header-notif-bell"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-40 max-h-96 overflow-y-auto w-[20rem]">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">Notifications ({unreadNotifs.length} unread)</span>
                  <button 
                    onClick={() => navigate(user.role === 'candidate' ? 'candidate-notifications' : 'recruiter-settings')} 
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {notifications.slice(0, 4).map(n => (
                    <div key={n.id} className={`p-3 hover:bg-gray-50 cursor-pointer ${n.status === 'unread' ? 'bg-blue-50/20' : ''}`}>
                      <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{n.content}</p>
                      <span className="text-[9px] text-gray-400 font-mono block mt-1">
                        {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-xs text-gray-400">
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action item if not signed in */}
        {!user ? (
          <button 
            id="header-login-button"
            onClick={() => navigate('auth-login')}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition active:scale-95 shadow-md shadow-blue-500/10"
          >
            Sign In / Register
          </button>
        ) : (
          <div className="flex items-center gap-2 py-1 pl-2 border-l border-gray-200">
            <span className="text-xs font-sans text-gray-500 hidden sm:block">Singapore</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </header>
  );
};
