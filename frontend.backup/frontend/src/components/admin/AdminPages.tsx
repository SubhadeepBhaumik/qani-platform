import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { api } from '../../lib/api';
import { ShieldAlert, Trash2, ArrowLeft, Activity, Users, FileText, Check, Database } from 'lucide-react';

export const AdminPages: React.FC<{ subView: string }> = ({ subView }) => {
  const { user, logs, navigate, refreshStates, showToast } = useApp();
  const [userSearchText, setUserSearchText] = useState('');

  const allUsersList = api.getUsers();

  const handleHardDeleteUser = (id: string) => {
    // Simulate user hard deletion
    api.deleteUser(id);
    refreshStates();
    showToast('Platform User hard deleted along with linked database coordinates.', 'warning');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <p className="text-red-500 font-bold">Unauthorised sandbox terminal access detected.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. ADMIN DASHBOARD - TERMINAL VIEW */}
      {subView === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] bg-red-100 text-red-700 font-extrabold py-0.5 px-3 rounded-full border border-red-200">
              QANI PLATFORM ROOT ADMIN SECTOR
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-2">Core System Metrics Terminal</h2>
            <p className="text-xs text-gray-500">Track server-side logs, database transactions, and evaluate platform usage variables.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-900 text-white rounded-xl space-y-2 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Total Sandboxed Users</span>
              <p className="text-2xl font-extrabold">{allUsersList.length}</p>
            </div>
            <div className="p-4 bg-gray-900 text-white rounded-xl space-y-2 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Active Job Postings</span>
              <p className="text-2xl font-extrabold text-blue-400">{api.getJobs().length}</p>
            </div>
            <div className="p-4 bg-gray-900 text-white rounded-xl space-y-2 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Evaluation Databases</span>
              <p className="text-2xl font-extrabold text-green-400">{api.getApplications().length}</p>
            </div>
            <div className="p-4 bg-gray-900 text-white rounded-xl space-y-2 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">System Transactions</span>
              <p className="text-2xl font-extrabold text-orange-400">{logs.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Realtime API Transaction log ticker on the left */}
            <div className="lg:col-span-8 bg-white border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase">Interactive System Audit Stream</h3>
                <p className="text-[10px] text-gray-400 mt-1">Real-time local database sync events</p>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-gray-100 font-mono text-[10.5px] text-gray-600 bg-gray-50 p-4 rounded-xl border">
                {logs.map((log, index) => (
                  <div key={index} className="pt-2 flex justify-between gap-4">
                    <span className="text-blue-600 font-bold shrink-0">[{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Sandbox Log'}]</span>
                    <span className="flex-grow">{log.action || log.content}</span>
                    <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{log.userRole || 'system'}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center py-6 italic text-gray-400">Transaction logs empty. Perform dashboard actions to record log coordinate data points.</div>
                )}
              </div>
            </div>

            {/* Admin utilities sidebar right */}
            <div className="lg:col-span-4 bg-white border rounded-xl p-5 space-y-4 shadow-sm h-fit">
              <span className="text-xs font-bold text-gray-900 uppercase block">Root SuperUser Actions</span>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('admin-users')}
                  className="w-full text-xs font-bold py-2.5 px-4 bg-gray-950 text-white rounded-lg hover:bg-gray-900 transition text-left"
                >
                  Manage Sandboxed Users Directory
                </button>
                <p className="text-[10px] text-gray-400 leading-normal pt-1">Admin features allow hard purging credentials or logging specific pipeline metrics.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN USER MANAGEMENT DIRECTORY */}
      {subView === 'users' && (
        <div className="space-y-6">
          <button 
            onClick={() => navigate('admin-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-950 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Profile Root Dashboard</span>
          </button>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sandbox Users Directory</h2>
            <p className="text-xs text-gray-500">Trace registered user handles, manage permissions, and hard purge mock profiles.</p>
          </div>

          <div className="bg-white border rounded-xl p-4 flex gap-4 w-full shadow-sm">
            <input 
              type="text" 
              placeholder="Filter names, role credentials, or profiles..."
              value={userSearchText}
              onChange={(e) => setUserSearchText(e.target.value)}
              className="text-xs p-2 flex-grow border bg-gray-50 focus:bg-white rounded-lg outline-none"
            />
          </div>

          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                  <th className="p-4">Name Coordinate</th>
                  <th className="p-4">Primary Email Handle</th>
                  <th className="p-4">Sandbox Role Permissions</th>
                  <th className="p-4 text-right">Delete Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {allUsersList
                  .filter(u => {
                    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
                    return name.includes(userSearchText.toLowerCase()) || u.email.toLowerCase().includes(userSearchText.toLowerCase());
                  })
                  .map(targetUser => (
                    <tr key={targetUser.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-bold text-gray-900 block">{targetUser.firstName} {targetUser.lastName}</span>
                        <span className="text-[10px] text-gray-400">ID: {targetUser.id}</span>
                      </td>
                      <td className="p-4 font-mono">{targetUser.email}</td>
                      <td className="p-4 capitalize">
                        <span className={`inline-block py-0.5 px-2 rounded-full text-[10px] font-bold border ${
                          targetUser.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' :
                          targetUser.role === 'recruiter' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-green-50 text-green-600 border-green-200'
                        }`}>
                          {targetUser.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {targetUser.id !== user.id ? (
                          <button 
                            onClick={() => handleHardDeleteUser(targetUser.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                            title="Hard Purge User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Static Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
