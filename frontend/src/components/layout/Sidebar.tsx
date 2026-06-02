import React from 'react';
import { useApp, AppView } from '../AppContext';
import {
  Home, Briefcase, FileText, User, Settings, Bell, LogOut,
  HelpCircle, BarChart2, Users, UserCheck, Activity, PlusCircle,
  DollarSign, PenTool, Users2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, activeView, navigate, logout, notifications } = useApp();

  if (!user) return null;

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const getNavItems = () => {
    if (user.role === 'candidate') {
      return [
        { id: 'candidate-dashboard', label: 'My Dashboard', icon: Home, view: 'candidate-dashboard' as AppView },
        { id: 'candidate-jobs', label: 'Browse Jobs', icon: Briefcase, view: 'candidate-jobs' as AppView },
        { id: 'candidate-profile', label: 'My Profile', icon: User, view: 'candidate-profile' as AppView },
        { id: 'candidate-notifications', label: 'Notifications', icon: Bell, view: 'candidate-notifications' as AppView, badge: unreadCount },
        { id: 'candidate-settings', label: 'Settings', icon: Settings, view: 'candidate-settings' as AppView },
      ];
    } else if (user.role === 'recruiter') {
      return [
        { id: 'recruiter-dashboard', label: 'Dashboard', icon: Home, view: 'recruiter-dashboard' as AppView },
        { id: 'recruiter-jobs', label: 'My Job Postings', icon: Briefcase, view: 'recruiter-jobs' as AppView },
        { id: 'recruiter-create-job', label: 'Post New Job', icon: PlusCircle, view: 'recruiter-create-job' as AppView },
        { id: 'recruiter-applications', label: 'All Applications', icon: FileText, view: 'recruiter-applications' as AppView },
        { id: 'recruiter-queue', label: 'AI Screening Queue', icon: UserCheck, view: 'recruiter-queue' as AppView },
        { id: 'recruiter-candidates', label: 'Candidate Directory', icon: Users, view: 'recruiter-candidates' as AppView },
        { id: 'recruiter-team', label: 'Team Management', icon: Users2, view: 'recruiter-team' as AppView },
        { id: 'recruiter-reports', label: 'Reports & Analytics', icon: BarChart2, view: 'recruiter-reports' as AppView },
        { id: 'recruiter-settings', label: 'Company Settings', icon: Settings, view: 'recruiter-settings' as AppView },
      ];
    } else {
      return [
        { id: 'admin-dashboard', label: 'Overview', icon: Activity, view: 'admin-dashboard' as AppView },
        { id: 'admin-users', label: 'Users', icon: Users, view: 'admin-users' as AppView },
        { id: 'admin-jobs', label: 'Jobs', icon: Briefcase, view: 'admin-jobs' as AppView },
        { id: 'admin-applications', label: 'Applications', icon: FileText, view: 'admin-applications' as AppView },
        { id: 'admin-finance', label: 'Finance', icon: DollarSign, view: 'admin-finance' as AppView },
        { id: 'admin-cms', label: 'Content (CMS)', icon: PenTool, view: 'admin-cms' as AppView },
        { id: 'admin-settings', label: 'Settings', icon: Settings, view: 'admin-settings' as AppView },
      ];
    }
  };

  const navItems = getNavItems();

  const roleLabel = user.role === 'candidate' ? 'Candidate Portal' : user.role === 'recruiter' ? 'Recruiter Portal' : 'Admin Panel';
  const roleBg = user.role === 'candidate' ? 'bg-blue-950 text-blue-300 border-blue-900' : user.role === 'recruiter' ? 'bg-emerald-950 text-emerald-300 border-emerald-900' : 'bg-red-950 text-red-300 border-red-900';

  return (
    <aside className="w-64 bg-gray-950 text-gray-200 min-h-screen flex flex-col border-r border-gray-800 shrink-0">

      {/* Brand */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => { /* logo click does nothing when logged in */ }}>
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3 group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-full h-full bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-extrabold text-white text-xs">Q</div>
          </div>
          <div>
            <span className="font-extrabold text-sm text-white group-hover:text-blue-400 transition">QANI</span>
            <span className="text-[9px] text-gray-500 block">AI Recruitment · AU</span>
          </div>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${roleBg}`}>
          {user.role.toUpperCase()}
        </span>
      </div>

      {/* User card */}
      <div className="p-4 mx-3 my-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="text-[10px] font-bold text-gray-500 uppercase px-3 mb-2 mt-1 tracking-wider">{roleLabel}</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.view)}
              className={`cursor-pointer w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] bg-red-500 text-white py-0.5 px-1.5 rounded-full font-bold">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <button onClick={() => navigate('help')} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </button>
        <button onClick={logout} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
