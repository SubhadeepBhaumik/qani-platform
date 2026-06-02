import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Search, MapPin, Briefcase, Send, CheckCircle, X } from 'lucide-react';

export const CandidatesDirectory: React.FC = () => {
  const { jobs, showToast, user, applications } = useApp();
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState<string | null>(null);
  const [inviteModal, setInviteModal] = useState<{ candidate: any } | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [invited, setInvited] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/v1/candidates')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCandidates(data);
        else setCandidates(DEMO_CANDIDATES);
      })
      .catch(() => setCandidates(DEMO_CANDIDATES))
      .finally(() => setLoading(false));
  }, []);

  const DEMO_CANDIDATES = [
    { id: 'candidate-1', firstName: 'Liam', lastName: 'Nguyen', email: 'candidate@qani.io', location: 'Sydney, NSW', skills: ['React', 'TypeScript', 'Node.js', 'AWS'], bio: 'Senior full-stack developer with 5 years building enterprise-scale apps.', aiScore: 91, available: true },
    { id: 'candidate-2', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@gmail.com', location: 'Melbourne, VIC', skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'], bio: 'Product designer passionate about clean, accessible interfaces.', aiScore: 72, available: true },
    { id: 'candidate-3', firstName: 'Tom', lastName: 'Williams', email: 'tom.williams@gmail.com', location: 'Perth, WA', skills: ['Python', 'SQL', 'Tableau', 'Machine Learning'], bio: 'Data analyst with 3 years experience in mining and resources sector.', aiScore: 38, available: false },
    { id: 'candidate-4', firstName: 'Jessica', lastName: 'Lee', email: 'jessica.lee@gmail.com', location: 'Sydney, NSW', skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Statistics'], bio: 'Data analyst with strong SQL and visualisation skills.', aiScore: undefined, available: true },
    { id: 'candidate-5', firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@gmail.com', location: 'Brisbane, QLD', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], bio: 'DevOps engineer with 4 years cloud infrastructure experience.', aiScore: undefined, available: true },
    { id: 'candidate-6', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@gmail.com', location: 'Melbourne, VIC', skills: ['Figma', 'React', 'CSS', 'User Research', 'Wireframing'], bio: 'Senior product designer with a focus on SaaS and B2B products.', aiScore: 88, available: true },
  ];

  const displayList = (candidates.length > 0 ? candidates : DEMO_CANDIDATES).filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    const skillMatch = (c.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const nameMatch = name.includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase());
    return search === '' || nameMatch || skillMatch;
  });

  const recruiterJobs = jobs.filter(j => !user || j.recruiterId === user.id || true);

  const handleInvite = async () => {
    if (!inviteModal || !selectedJobId) return;
    const job = recruiterJobs.find(j => j.id === selectedJobId);
    setInviting(inviteModal.candidate.id);
    try {
      await fetch('/api/v1/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: inviteModal.candidate.email,
          subject: `You're invited to apply for ${job?.title || 'a role'}`,
          message: `Hi ${inviteModal.candidate.firstName}, you have been personally invited by ${user?.firstName || 'a recruiter'} at ${user?.companyName || 'QANI'} to apply for the role of ${job?.title || 'a position'}. Login to QANI to apply and complete your AI screening interview.`,
        }),
      });
      setInvited(prev => [...prev, inviteModal.candidate.id + '-' + selectedJobId]);
      showToast(`Invite sent to ${inviteModal.candidate.firstName} for ${job?.title}`, 'success');
      setInviteModal(null);
      setSelectedJobId('');
    } catch {
      showToast('Failed to send invite', 'error');
    } finally {
      setInviting(null);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Candidate Directory</h2>
          <p className="text-xs text-gray-500 mt-1">Browse candidates by skill. Invite them to apply for your open jobs.</p>
        </div>
        <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-semibold">{displayList.length} candidates</span>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email or skill (e.g. React, Python, Figma)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 text-xs focus:bg-white outline-none focus:border-blue-500 transition"
          />
        </div>
        {search && (
          <p className="text-xs text-gray-500 mt-2">
            Showing {displayList.length} result{displayList.length !== 1 ? 's' : ''} for "<strong>{search}</strong>"
          </p>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">Loading candidates...</div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
          No candidates found for "<strong>{search}</strong>"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map(cand => {
            const alreadyInvited = invited.some(i => i.startsWith(cand.id));
            const alreadyApplied = applications.some(a => a.candidateId === cand.id);
            const appliedJobTitles = applications.filter(a => a.candidateId === cand.id).map(a => a.jobTitle || a.roleId).join(", ");
            return (
              <div key={cand.id} className="bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {cand.firstName.charAt(0)}{cand.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-950 text-sm">{cand.firstName} {cand.lastName}</h4>
                        <span className="text-[10px] text-gray-400 block">{cand.email}</span>
                      </div>
                    </div>
                    {cand.aiScore !== undefined && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${cand.aiScore >= 80 ? 'bg-green-50 border-green-200 text-green-700' : cand.aiScore >= 60 ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {cand.aiScore}%
                      </span>
                    )}
                  </div>
                  {cand.bio && <p className="text-xs text-gray-500 italic line-clamp-2">"{cand.bio}"</p>}
                  <div className="flex flex-wrap gap-1">
                    {(cand.skills || []).map((s: string) => (
                      <span key={s} className={`text-[10px] py-0.5 px-2 rounded-md font-medium border ${search && s.toLowerCase().includes(search.toLowerCase()) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {cand.location || 'Australia'}
                  </span>
                  {alreadyApplied ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-500" title={`Applied: ${appliedJobTitles}`}>
                      <CheckCircle size={11} /> Already Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => { setInviteModal({ candidate: cand }); setSelectedJobId(recruiterJobs[0]?.id || ''); }}
                      className={`cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${alreadyInvited ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      {alreadyInvited ? <><CheckCircle size={11} /> Invited</> : <><Send size={11} /> Invite to Apply</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Invite {inviteModal.candidate.firstName} to Apply</h3>
              <button onClick={() => setInviteModal(null)} className="cursor-pointer text-gray-400 hover:text-gray-700"><X size={16} /></button>
            </div>
            <p className="text-xs text-gray-500">Select which job you want to invite <strong>{inviteModal.candidate.firstName} {inviteModal.candidate.lastName}</strong> to apply for. They will receive a notification to apply and complete AI screening.</p>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Select Job</label>
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="cursor-pointer w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs outline-none focus:border-blue-500"
              >
                {recruiterJobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} · {j.location}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setInviteModal(null)} className="cursor-pointer flex-1 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg">Cancel</button>
              <button
                onClick={handleInvite}
                disabled={!selectedJobId || !!inviting}
                className="cursor-pointer flex-1 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Send size={11} /> {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
