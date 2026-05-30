import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { api } from '../../lib/api';
import { Mail, Search, Award, MapPin, MessageSquare, CheckCircle } from 'lucide-react';

export const CandidatesDirectory: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [candidateSearch, setCandidateSearch] = useState('');

  const list = api.getUsers().filter(u => u.role === 'candidate');

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Talent Pool Directory</h2>
        <p className="text-xs text-gray-500">Search and contact sandboxed candidates registered on the QANI platform.</p>
      </div>

      <div className="bg-white border rounded-xl p-4 flex gap-4 w-full shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search matching talent by name, skills tags, or criteria..."
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            className="w-full h-10 bg-gray-50 border rounded-lg pl-10 text-xs focus:bg-white outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list
          .filter(u => {
            const name = `${u.firstName} ${u.lastName}`.toLowerCase();
            return name.includes(candidateSearch.toLowerCase()) || u.email.toLowerCase().includes(candidateSearch.toLowerCase());
          })
          .map(cand => (
            <div key={cand.id} className="bg-white border hover:border-blue-500 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition duration-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={cand.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40'} alt="Candidate Avatar" className="w-12 h-12 rounded-full object-cover border" />
                  <div>
                    <h4 className="font-bold text-gray-950 text-sm">{cand.firstName} {cand.lastName}</h4>
                    <span className="text-[10px] text-gray-400 font-mono block">{cand.email}</span>
                  </div>
                </div>

                {cand.bio && <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed">"{cand.bio}"</p>}

                {/* skills */}
                <div className="flex flex-wrap gap-1 Pt-1">
                  {cand.skills?.map(s => (
                    <span key={s} className="text-[10px] bg-blue-50 text-blue-700 py-0.5 px-2 rounded-md font-medium border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{cand.location || 'Singapore'}</span>
                </span>
                
                <button 
                  onClick={() => {
                    showToast(`Dialogue channel parsed with cand ${cand.firstName} successfully.`, 'info');
                    navigate('recruiter-applications');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View Active Trackers
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
