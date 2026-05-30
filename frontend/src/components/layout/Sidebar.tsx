import React from 'react';
import { useApp, AppView } from '../AppContext';
import { 
  Home, 
  Briefcase, 
  FileText, 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  HelpCircle, 
  BarChart2, 
  Users, 
  FolderPlus, 
  ShieldAlert, 
  Activity,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, activeView, navigate, logout, notifications } = useApp();

  if (!user) return null;

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleNav = (view: AppView) => {
    navigate(view);
  };

  // Nav items based on role
  const getNavItems = () => {
    if (user.role === 'candidate') {
      return [
        { id: 'candidate-dashboard', label: 'Dashboard', icon: Home, view: 'candidate-dashboard' as AppView },
        { id: 'candidate-jobs', label: 'Browse Jobs', icon: Briefcase, view: 'candidate-jobs' as AppView },
        { id: 'candidate-profile', label: 'My Profile', icon: User, view: 'candidate-profile' as AppView },
        { id: 'candidate-notifications', label: 'Notifications', icon: Bell, view: 'candidate-notifications' as AppView, badge: unreadCount },
        { id: 'candidate-settings', label: 'Settings', icon: Settings, view: 'candidate-settings' as AppView },
      ];
    } else if (user.role === 'recruiter') {
      return [
        { id: 'recruiter-dashboard', label: 'Dashboard', icon: Home, view: 'recruiter-dashboard' as AppView },
        { id: 'recruiter-applications', label: 'Applications', icon: FileText, view: 'recruiter-applications' as AppView },
        { id: 'recruiter-candidates', label: 'Candidates', icon: Users, view: 'recruiter-candidates' as AppView },
        { id: 'recruiter-jobs', label: 'Jobs Management', icon: Briefcase, view: 'recruiter-jobs' as AppView },
        { id: 'recruiter-queue', label: 'Screening Queue', icon: UserCheck, view: 'recruiter-queue' as AppView },
        { id: 'recruiter-reports', label: 'Reports & Analytics', icon: BarChart2, view: 'recruiter-reports' as AppView },
        { id: 'recruiter-team', label: 'Team Management', icon: Users, view: 'recruiter-team' as AppView },
        { id: 'recruiter-settings', label: 'Organization Setup', icon: Settings, view: 'recruiter-settings' as AppView },
      ];
    } else {
      // Admin
      return [
        { id: 'admin-dashboard', label: 'Admin Terminal', icon: Activity, view: 'admin-dashboard' as AppView },
        { id: 'admin-users', label: 'User Directory', icon: Users, view: 'admin-users' as AppView },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside id="sidebar-navigation" className="w-64 bg-gray-950 text-gray-200 min-h-screen flex flex-col border-r border-gray-800 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
          <div className="relative flex items-center justify-center w-8.5 h-8.5">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3 shadow-sm group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-7 h-7 bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-extrabold text-white text-xs tracking-tighter">
              Q
            </div>
          </div>
          <span className="font-extrabold tracking-wider text-sm text-white group-hover:text-blue-400 transition duration-300">QANI</span>
        </div>
        <div className="text-[9px] bg-blue-950 text-indigo-400 font-mono py-0.5 px-2 rounded-full border border-blue-900/40">
          PRO-STAGE
        </div>
      </div>

      {/* User QuickCard */}
      <div className="p-4 mx-3 my-4 bg-gray-900/60 rounded-xl border border-gray-800/40 flex items-center gap-3">
        <img 
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40'} 
          alt="Avatar" 
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full border border-gray-700 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
        </div>
      </div>

      {/* Navigation Loop */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="text-[10px] font-semibold text-gray-500 uppercase px-3 mb-2 tracking-wider">Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.view || activeView.startsWith(item.id.replace('-dashboard', ''));
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNav(item.view)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 ? (
                <span className="text-xs bg-red-500 text-white py-0.5 px-2 rounded-full font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Persistent Footer utilities */}
      <div className="p-4 border-t border-gray-800/50 space-y-2">
        <button 
          id="nav-help-faqs"
          onClick={() => navigate('help')}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition"
        >
          <HelpCircle className="w-4 h-4 text-gray-500" />
          <span>Help & FAQs</span>
        </button>
        <button 
          id="nav-logout-btn"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition"
        >
          <LogOut className="w-4 h-4 text-red-500/80" />
          <span>Exit Account</span>
        </button>
      </div>
    </aside>
  );
};
