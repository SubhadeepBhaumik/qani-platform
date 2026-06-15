import React, { useState, useEffect, useRef } from 'react';
import { useApp, AppView } from '../AppContext';
import { api } from '../../lib/api';
import { Job, Application, ScreeningSession, ChatMessage, Notification } from '../../types';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Cpu, 
  User, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight, 
  FileCheck, 
  ArrowLeft, 
  MessageSquare, 
  Activity, 
  X, 
  Check, 
  Download, 
  AlertTriangle,
  History
} from 'lucide-react';

export const CandidatePages: React.FC<{ subView: string }> = ({ subView }) => {
  const { 
    user, 
    jobs, 
    applications, 
    sessions, 
    notifications, 
    navigate, 
    applyForJob, 
    startScreening, 
    sendCandidateMessage, 
    isGeneratingAI,
    saveUser,
    updateUser,
    showToast,
    activeParams,
    refreshStates
  } = useApp();

  // Search/Filters State for Browse Jobs
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterSalary, setFilterSalary] = useState('All');
  const [jobsPage, setJobsPage] = useState(1);
  const JOBS_PER_PAGE = 10;

  // Profile Edit fields
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [linkedIn, setLinkedIn] = useState((user as any)?.linkedIn || '');
  const [workRights, setWorkRights] = useState((user as any)?.workRights || '');
  const [salaryExpectation, setSalaryExpectation] = useState((user as any)?.salaryExpectation || '');
  const [availableFrom, setAvailableFrom] = useState((user as any)?.availableFrom || '');
  const [cvFileName, setCvFileName] = useState((user as any)?.resumeName || '');
  const [cvUploading, setCvUploading] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [interviewModal, setInterviewModal] = useState<{title: string; dateTime: string} | null>(null);
  const [notifyScreening, setNotifyScreening] = useState(true);
  const [notifyJobs, setNotifyJobs] = useState(true);
  const [github, setGithub] = useState((user as any)?.github || '');
  const [avatarUrl, setAvatarUrl] = useState((user as any)?.avatarUrl || '');

  // Load profile from DB on mount
  React.useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem('qani_auth_token');
    fetch(`https://qani.io/api/v1/candidates/${user.id}/profile`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    }).then(r => r.json()).then(p => {
      if (!p || !p.userId) return;
      if (p.bio) setBio(p.bio);
      if (p.phone) setPhone(p.phone);
      if (p.location) setLocation(p.location);
      if (p.skills?.length) setSkills(p.skills);
      if (p.linkedinUrl) setLinkedIn(p.linkedinUrl);
      if (p.githubUrl) setGithub(p.githubUrl);
      if (p.workRights) setWorkRights(p.workRights);
      if (p.salaryExpectation) setSalaryExpectation(p.salaryExpectation.toString());
      if (p.availableFrom) setAvailableFrom(p.availableFrom.split('T')[0]);
      if (p.cvFilename) setCvFileName(p.cvFilename);
      if (p.profilePhotoUrl) setAvatarUrl(p.profilePhotoUrl);
    }).catch(() => {});
  }, [user?.id, subView]);

  // Screening active chat states
  const [userAnswer, setUserAnswer] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll handling for active chat
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, isGeneratingAI, subView]);

  if (!user) return null;

  // Render Sub-Views based on parameter
  return (<>
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
      
      {/* 1. CANDIDATE DASHBOARD */}
      {subView === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back, {user.firstName}!</h2>
              <p className="text-xs text-gray-500">Monitor active evaluations and AI conversational screens.</p>
            </div>
            <div className="flex items-center gap-3">
              {(user as any).avatarUrl ? (
                <img src={(user as any).avatarUrl} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="avatar" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
              <button onClick={() => navigate('candidate-jobs')}
                className="text-xs font-semibold py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer">
                Explore Open Jobs
              </button>
            </div>
          </div>

          {/* Quick counters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Applications</span>
              <p className="text-2xl font-extrabold text-gray-950">{applications.filter(a => a.candidateId === user.id).length}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Screenings Completed</span>
              <p className="text-2xl font-extrabold text-blue-600">{applications.filter(a => a.candidateId === user.id && (a.status === 'qualified' || a.status === 'review' || a.status === 'rejected')).length}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qualified</span>
              <p className="text-2xl font-extrabold text-green-600">{applications.filter(a => a.candidateId === user.id && a.status === 'qualified').length}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unread Notifications</span>
              <p className="text-2xl font-extrabold text-gray-800">{notifications.filter(n => n.status === 'unread').length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Active applications left */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">My Active Applications</h3>
              
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-normal">
                      <th className="p-4">Job Title</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4">AI Recruiter Score</th>
                      <th className="p-4 text-center">Pipeline Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {applications.filter(a => a.candidateId === user.id).map(app => {
                      const job = jobs.find(j => j.id === (app.jobId ?? (app as any).roleId));
                      return (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <span className="font-semibold text-gray-900 block">{job?.title || 'Unknown Position'}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{job?.department || 'General'}</span>
                          </td>
                          <td className="p-4 text-gray-600">{app.appliedDate}</td>
                          <td className="p-4 font-mono font-bold text-blue-600">
                            {(app.score !== undefined || (app as any).aiScore !== undefined) ? `${Math.round(app.score ?? (app as any).aiScore)}/100` : 'Pending...'}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] font-bold uppercase py-1 px-2.5 rounded-full ${
                              app.status === 'qualified' ? 'bg-green-100 text-green-700' :
                              app.status === 'screening' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => navigate('candidate-app-detail', { applicationId: app.id })}
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Track Progress
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {applications.filter(a => a.candidateId === user.id).length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-400 select-none">
                          No active applications found. Tap "Explore Open Jobs" above to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Recommended Jobs */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recommended Positions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {jobs.filter(j => j.status === 'open').slice(0, 2).map(job => (
                    <div key={job.id} className="p-5 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm hover:border-blue-400 transition cursor-pointer" onClick={() => navigate('candidate-job-detail', { jobId: job.id })}>
                      <div>
                        <span className="text-[10px] uppercase text-blue-600 font-bold tracking-wider">{job.department}</span>
                        <h4 className="font-bold text-gray-950 mt-1 line-clamp-1">{job.title}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        {!job.hideSalary && job.salaryMin && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" /> ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k
                          </span>
                        )}
                      </div>
                      <button className="w-full text-xs font-semibold py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar activities */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-blue-50/50 border border-blue-200/50 rounded-xl space-y-4">
                <span className="text-xs bg-blue-600 text-white font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">About QANI AI Screening</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  QANI uses real GPT-4o-mini AI to conduct conversational screening, score candidates, and deliver ranked shortlists to recruiters 24/7.
                </p>
                <div className="pt-2">
                  <button onClick={() => navigate('help')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <span>Read evaluation schema FAQs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-400" />
                  <span>Activity History</span>
                </h4>
                <div className="space-y-4 text-xs relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 pl-6">
                  {applications.filter(a => a.candidateId === user.id).slice(0, 4).map((app, idx) => {
                    const job = jobs.find(j => j.id === (app.jobId ?? (app as any).roleId));
                    const date = app.appliedDate || (app as any).appliedAt?.split('T')[0] || 'Recent';
                    const colors = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500'];
                    return (
                      <div key={app.id} className="space-y-1 relative">
                        <div className={`absolute -left-6 top-1 w-2.5 h-2.5 ${colors[idx % 4]} rounded-full ring-4 ring-white`} />
                        <span className="text-gray-400 text-[10px] font-mono">{date}</span>
                        <p className="font-semibold text-gray-900">Applied — {job?.title || (app as any).jobTitle || 'Position'}</p>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                          app.status === 'qualified' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'screening' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{app.status}</span>
                      </div>
                    );
                  })}
                  {applications.filter(a => a.candidateId === user.id).length === 0 && (
                    <div className="space-y-1 relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 bg-gray-300 rounded-full ring-4 ring-white" />
                      <span className="text-gray-400 text-[10px] font-mono">TODAY</span>
                      <p className="font-semibold text-gray-700">No applications yet — browse jobs to start</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BROWSE JOBS */}
      {subView === 'jobs' && (() => {
        const openJobs = jobs.filter((j: any) => j.status === 'open');
        const departments = ['All', ...Array.from(new Set(openJobs.map((j: any) => j.department).filter(Boolean))).sort() as string[]];
        const locations = ['All', ...Array.from(new Set(openJobs.map((j: any) => {
          const loc = (j.location || '') as string;
          if (loc.includes('Remote')) return 'Remote';
          const m = loc.match(/^([^(,]+)/);
          return m ? m[1].trim() : loc;
        }).filter(Boolean))).sort() as string[]];
        const filtered = openJobs.filter((j: any) => {
          const matchesSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (j.skillsRequired || []).some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (j.department || '').toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDept = filterType === 'All' || j.department === filterType;
          const matchesLoc = filterLocation === 'All' || (j.location || '').includes(filterLocation);
          const matchesSalary = filterSalary === 'All' ||
            (filterSalary === '0-100k' && (j.salaryMax || 0) <= 100000) ||
            (filterSalary === '100k-140k' && (j.salaryMin || 0) >= 100000 && (j.salaryMax || 0) <= 140000) ||
            (filterSalary === '140k-180k' && (j.salaryMin || 0) >= 140000 && (j.salaryMax || 0) <= 180000) ||
            (filterSalary === '180k+' && (j.salaryMin || 0) >= 180000);
          return matchesSearch && matchesDept && matchesLoc && matchesSalary;
        });
        const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
        const paginated = filtered.slice((jobsPage - 1) * JOBS_PER_PAGE, jobsPage * JOBS_PER_PAGE);
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore Open Positions</h2>
                <p className="text-xs text-gray-500">{filtered.length} open {filtered.length === 1 ? 'role' : 'roles'} available across Australia</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center shadow-sm flex-wrap">
              <div className="relative flex-1 w-full min-w-48">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input type="text" placeholder="Search by title, skill, or keyword..." value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setJobsPage(1); }}
                  className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs pl-10 outline-none transition" />
              </div>
              <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setJobsPage(1); }}
                className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none w-full md:w-44 cursor-pointer">
                {departments.map((d: string) => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
              </select>
              <select value={filterLocation} onChange={(e) => { setFilterLocation(e.target.value); setJobsPage(1); }}
                className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none w-full md:w-48 cursor-pointer">
                {locations.map((l: string) => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
              </select>
              <select value={filterSalary} onChange={(e) => { setFilterSalary(e.target.value); setJobsPage(1); }}
                className="h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none w-full md:w-44 cursor-pointer">
                <option value="All">All Salaries</option>
                <option value="0-100k">Under $100k</option>
                <option value="100k-140k">$100k – $140k</option>
                <option value="140k-180k">$140k – $180k</option>
                <option value="180k+">$180k+</option>
              </select>
              {(searchQuery || filterType !== 'All' || filterLocation !== 'All' || filterSalary !== 'All') && (
                <button onClick={() => { setSearchQuery(''); setFilterType('All'); setFilterLocation('All'); setFilterSalary('All'); setJobsPage(1); }}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer whitespace-nowrap">
                  Clear filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginated.map((job: any) => (
                <div key={job.id} id={`job-card-item-${job.id}`}
                  className="bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-6 flex flex-col justify-between gap-5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                  onClick={() => navigate('candidate-job-detail', { jobId: job.id })}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase py-1 px-2.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">{job.department}</span>
                      <div className="flex items-center gap-2">
                        {applications.some((a: any) => (a.jobId === job.id || a.roleId === job.id) && a.candidateId === user.id) && (
                          <span className="text-[10px] font-bold uppercase py-1 px-2.5 bg-green-50 text-green-700 rounded-full border border-green-200">✓ Applied</span>
                        )}
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">{job.experienceLevel} Level</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-950 leading-tight">{job.title}</h3>
                    {job.company && <p className="text-xs font-semibold text-blue-600">{job.company}</p>}
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{job.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(job.skillsRequired || []).slice(0, 4).map((skill: string) => (
                        <span key={skill} className="text-[10px] bg-gray-100 text-gray-700 py-0.5 px-2 rounded-md">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="space-y-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      {!job.hideSalary && job.salaryMin && (
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {applications.some((a: any) => (a.jobId === job.id || a.roleId === job.id) && a.candidateId === user.id) ? (
                        <span className="text-xs font-semibold py-2 px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg">✓ Applied</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); applyForJob(job.id); }}
                          className="text-xs font-semibold py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer">
                          Apply
                        </button>
                      )}
                      <button className="text-xs font-semibold py-2 px-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition cursor-pointer">Details</button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-400 italic">No roles match your filters. Try clearing some filters.</div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button onClick={() => setJobsPage((p: number) => Math.max(1, p - 1))} disabled={jobsPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p: number) => (
                  <button key={p} onClick={() => setJobsPage(p)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg cursor-pointer ${p === jobsPage ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{p}</button>
                ))}
                <button onClick={() => setJobsPage((p: number) => Math.min(totalPages, p + 1))} disabled={jobsPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer">Next</button>
              </div>
            )}
          </div>
        );
      })()}

      {/* 3. JOB DETAIL */}
      {subView === 'job-detail' && (() => {
        const jobId = activeParams.jobId;
        const job = jobs.find(j => j.id === jobId);
        if (!job) return <p className="text-red-500">Job context not existing.</p>;

        const alreadyApplied = applications.some(a => (a.jobId === job.id || a.roleId === job.id) && a.candidateId === user.id);

        return (
          <div className="space-y-6">
            <button 
              onClick={() => navigate('candidate-jobs')}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Browse List</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* main detailed information */}
              <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="space-y-3 pb-6 border-b border-gray-100">
                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 font-bold uppercase py-1 px-3 rounded-full">
                    {job.department}
                  </span>
                  <h1 className="text-3xl font-extrabold text-gray-950">{job.title}</h1>
                  {(job as any).company && <p className="text-sm font-semibold text-blue-600">{(job as any).company}</p>}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    {!job.hideSalary && job.salaryMin && (
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k / yr</span>
                    )}
                    {job.employmentType && Array.isArray(job.employmentType) && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> {job.employmentType.join(' · ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Role Description</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Mandatory Prerequisites</h3>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {job.requirementsMust.map((req, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {job.requirementsNiceToHave && job.requirementsNiceToHave.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Nice to Have</h3>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {job.requirementsNiceToHave.map((req, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-blue-400 shrink-0 mt-0.5">◦</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Screening Dimensions</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">During AI screening, you will be evaluated across these dimensions:</p>
                  <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-700">
                    <span className="p-3 bg-gray-50 rounded-lg">✓ Work Rights & Location</span>
                    <span className="p-3 bg-gray-50 rounded-lg">✓ Salary Alignment</span>
                    <span className="p-3 bg-gray-50 rounded-lg">✓ Technical Skills Match</span>
                    <span className="p-3 bg-gray-50 rounded-lg">✓ Experience & Qualifications</span>
                  </div>
                </div>
              </div>

              {/* apply actions card right */}
              <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-6 h-fit space-y-6 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Action Hub</span>
                
                {(() => {
                  const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date();
                  const isFilled = job.status === 'filled' || job.status === 'closed';
                  const isUnavailable = isExpired || isFilled;
                  if (isUnavailable) return (
                    <div className="space-y-3">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-700 text-xs font-semibold">
                        <span>⚠️</span>
                        <span>{isFilled ? 'This position has been filled.' : 'This job posting has closed.'} Applications are no longer being accepted.</span>
                      </div>
                    </div>
                  );
                  if (alreadyApplied) return (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2.5 text-green-700 text-xs font-semibold">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <span>Applied Already</span>
                      </div>
                      <button
                        onClick={() => {
                          const app = applications.find(a => (a.jobId === job.id || a.roleId === job.id) && a.candidateId === user.id);
                          if (app) navigate('candidate-app-detail', { applicationId: app.id });
                        }}
                        className="w-full py-2.5 bg-gray-950 hover:bg-gray-900 text-white font-semibold rounded-lg text-xs"
                      >
                        Track Screening Results
                      </button>
                    </div>
                  );
                  return (
                    <button
                      id="apply-job-btn-trigger"
                      onClick={() => applyForJob(job.id)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-blue-500/15 cursor-pointer"
                    >
                      Apply Now via QANI
                    </button>
                  );
                })()}

                <div className="text-[10px] text-gray-400 flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Interactive AI Conversational screening will initiate immediately upon application delivery.</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. APPLICATION DETAIL */}
      {subView === 'app-detail' && (() => {
        const appId = activeParams.applicationId;
        const app = applications.find(a => a.id === appId);
        if (!app) return <p className="text-red-500">Application context not existing.</p>;

        const job = jobs.find(j => j.id === (app.jobId ?? (app as any).roleId));

        return (
          <div className="space-y-6">
            <button 
              onClick={() => navigate('candidate-dashboard')}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* main scorecards card left */}
              <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase text-blue-600 font-bold tracking-wider">Evaluation Profile</span>
                  <h1 className="text-2xl font-extrabold text-gray-950 mt-1">{job?.title || (app as any).jobTitle || 'Application'}</h1>
                </div>

                {/* status alert bar */}
                <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Assessment Status:</span>
                    <span className={`block font-bold text-xs uppercase ${
                      app.status === 'qualified' ? 'text-green-600' :
                      app.status === 'screening' ? 'text-blue-600 animate-pulse' :
                      app.status === 'rejected' ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  {(app.status === 'applied' || app.status === 'screening') && (() => {
                    const existingSession = sessions.find(s => s.applicationId === app.id);
                    if (existingSession && existingSession.status === 'active') {
                      return (
                        <button
                          onClick={() => navigate('candidate-screening', { sessionId: existingSession.id, applicationId: app.id })}
                          className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                        >
                          Resume AI Screening
                        </button>
                      );
                    }
                    if (existingSession && existingSession.status === 'completed') {
                      return (
                        <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-600 font-semibold">
                          ✓ AI Screening Already Completed
                        </div>
                      );
                    }
                    const screeningJob = jobs.find((j: any) => j.id === (app.jobId ?? (app as any).roleId));
                    const jobExpired = screeningJob?.expiresAt && new Date(screeningJob.expiresAt) < new Date();
                    const jobFilled = screeningJob?.status === 'filled' || screeningJob?.status === 'closed';
                    if (jobExpired || jobFilled) return (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-semibold">
                        ⚠️ {jobFilled ? 'This position has been filled.' : 'This job posting has closed.'} AI Screening is no longer available for this role.
                      </div>
                    );
                    return (
                      <button
                        id="app-start-screen-btn"
                        onClick={() => startScreening(app.id)}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                      >
                        Start AI Screening Conversation
                      </button>
                    );
                  })()}
                </div>

                {/* score details panel */}
                {!(app.scorecard || (app as any).scoreBreakdown) && (app.status === 'applied' || app.status === 'screening') && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700 font-semibold">
                    Complete the AI screening to see your score and feedback here.
                  </div>
                )}
                {(app.scorecard || (app as any).scoreBreakdown) && (() => { const sc = app.scorecard || { locationScore: (app as any).scoreBreakdown?.locationMatch || 0, salaryScore: (app as any).scoreBreakdown?.salaryAlignment || 0, qualificationsScore: (app as any).scoreBreakdown?.qualifications || 0, workRightsScore: (app as any).scoreBreakdown?.workRights || 0, skillsScore: (app as any).scoreBreakdown?.technicalSkills || 0 }; return (
                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Match Assessment</h3>
                      <span className="font-mono text-xl font-extrabold text-blue-600 bg-blue-50 py-1 px-3 rounded-lg">{Math.round((app as any).score ?? (app as any).aiScore ?? 0)}/100</span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Work Location Compliances:</span>
                          <span className="font-semibold">{sc.locationScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${sc.locationScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Salary Match Projections:</span>
                          <span className="font-semibold">{sc.salaryScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${sc.salaryScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Mandatory Certifications Alignment:</span>
                          <span className="font-semibold">{sc.qualificationsScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${sc.qualificationsScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Visa / Availability parameters:</span>
                          <span className="font-semibold">{sc.workRightsScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${sc.workRightsScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Specific Skills & Software Experience:</span>
                          <span className="font-semibold">{sc.skillsScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${sc.skillsScore}%` }} />
                        </div>
                      </div>
                    </div>

                    {app.aiFeedback && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">AI Assessment Feedback:</span>
                        <p className="text-xs text-gray-700 leading-relaxed italic">"{app.aiFeedback}"</p>
                      </div>
                    )}
                    {(app as any).recruiterNotes && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 uppercase">Recruiter Notes:</span>
                        <p className="text-xs text-blue-800 leading-relaxed">{(app as any).recruiterNotes}</p>
                      </div>
                    )}
                  </div>
                ); })()}
              </div>

              {/* side info right */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Application Coordinates</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p><strong>Date Applied:</strong> {app.appliedDate || (app as any).appliedAt?.split('T')[0] || 'N/A'}</p>
                    <p><strong>Position:</strong> {job?.title || (app as any).jobTitle || 'N/A'}</p>
                    <p><strong>Status:</strong> <span className="capitalize font-semibold">{app.status}</span></p>
                  </div>
                </div>

                {app.screeningSessionId && (
                  <button 
                    onClick={() => {
                      const session = sessions.find(s => s.applicationId === app.id || s.id === app.screeningSessionId);
                      if (session) {
                        navigate('candidate-screening', { sessionId: session.id, applicationId: app.id });
                      } else {
                        showToast('Screening transcript not available in this session.', 'info');
                      }
                    }}
                    className="w-full py-2.5 bg-gray-950 hover:bg-gray-900 text-white font-semibold rounded-lg text-xs cursor-pointer"
                  >
                    View Interview Transcript
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. ACTIVE CHAT / SCREENING INTERVIEW */}
      {subView === 'screening' && (() => {
        const sessionId = activeParams.sessionId;
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return <p className="text-red-500">Screening session context not found.</p>;

        const app = applications.find(a => a.id === session.applicationId);
        const job = jobs.find(j => j.id === app?.jobId);

        const totalQuestions = (session as any).totalQuestions || ((job?.screeningQuestions?.length || 0) + (session as any).mandatoryCount || 5);
        const answeredCount = (session as any).currentQuestionIdx || 0;
        const currentQ = Math.min(answeredCount + 1, totalQuestions);
        const messages = (session as any).messages || [];
        const lastAiMsg = [...messages].reverse().find((m: any) => m.role === 'assistant');
        const screeningDone = lastAiMsg?.content?.includes('Please click End Screening');
        const progressPercent = screeningDone ? 100 : Math.min(99, Math.round((answeredCount / totalQuestions) * 100));

        const handleChatSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!userAnswer.trim() || isGeneratingAI) return;

          const rawText = userAnswer;
          setUserAnswer('');
          sendCandidateMessage(session.id, rawText);
        };

        return (
          <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <button 
                onClick={() => navigate('candidate-dashboard')}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Loop</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Interview Progress</span>
                <span className="text-xs font-bold text-blue-600">{progressPercent}% completed</span>
              </div>
            </div>

            {/* Micro progress line */}
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Scrollable messages container */}
            <div 
              id="screening-chat-viewport"
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-gray-50 rounded-2xl p-4 sm:p-6 space-y-4 border border-gray-200"
            >
              {session.messages.map((msg, msgIdx) => {
                const isAI = msg.role === 'assistant';
                const isGreeting = isAI && msgIdx === 0;
                return (
                  <div key={msg.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isGreeting ? (
                      <div className="w-full max-w-2xl">
                        {/* Greeting card — special design */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-blue-500/20 border border-blue-500/30">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                            <div className="relative w-9 h-9 shrink-0">
                              <div className="absolute inset-0 bg-white/20 rounded-xl transform rotate-3" />
                              <div className="relative w-full h-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center font-mono font-black text-white text-sm">Q</div>
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">QANI</p>
                              <p className="text-blue-200 text-[10px]">AI Recruitment Assistant</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-[10px] text-white font-medium">Live</span>
                            </div>
                          </div>
                          {/* Message lines */}
                          <div className="space-y-3">
                            {msg.content.split(/\r?\n\r?\n/).filter(Boolean).map((para: string, pi: number) => (
                              <p key={pi} className={`leading-relaxed ${pi === 0 ? 'text-white font-bold text-sm' : 'text-blue-100 text-xs'}`}>{para}</p>
                            ))}
                          </div>
                          {/* Footer prompt */}
                          <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                            <p className="text-[11px] text-blue-200 font-medium">Type <span className="text-white font-bold">"Yes"</span> below when you're ready to begin</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-1 shadow-sm ${
                        isAI
                          ? 'bg-white border border-gray-200 text-gray-950'
                          : 'bg-blue-600 text-white'
                      }`}>
                        <span className={`text-[9px] font-bold block uppercase ${isAI ? 'text-blue-600' : 'text-blue-100'}`}>
                          {isAI ? 'QANI Virtual Recruiter' : 'You'}
                        </span>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {isGeneratingAI && (
                <div className="flex justify-start">
                  <div className="p-4 bg-white border border-gray-100 rounded-xl space-y-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">QANI AI is processing your response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Text input prompt */}
            {session.status === 'active' ? (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm('End this screening session? Your responses will be scored.')) return;
                      try {
                        const token = localStorage.getItem('qani_auth_token');
                        const res = await fetch('https://qani.io/api/v1/screening/end', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                          body: JSON.stringify({ sessionId: session.id, decision: 'review' })
                        });
                        const endedSession = await res.json();
                        await refreshStates();
                        showToast('Screening complete! View your results below.', 'success');
                        navigate('candidate-app-detail', { applicationId: session.applicationId });
                      } catch(e) {
                        showToast('Failed to end screening. Try again.', 'error');
                      }
                    }}
                    className="text-xs font-semibold py-1.5 px-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 rounded-lg transition cursor-pointer"
                  >
                    End Screening
                  </button>
                </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                <input 
                  type="text"
                  placeholder="Type your interview response here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isGeneratingAI}
                  className="flex-1 bg-gray-50 p-2.5 border border-gray-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 disabled:opacity-50 transition"
                />
                <button 
                  id="screening-submit-msg-btn"
                  type="submit"
                  disabled={isGeneratingAI || !userAnswer.trim()}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Response</span>
                </button>
              </form>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center space-y-2">
                <span className="text-xs font-bold text-green-700 block">AI Conversational Screening Concluded</span>
                <p className="text-[11px] text-green-600">The evaluation transcripts spent scoring matching slots are locked. Head to details parameters to view results.</p>
                <div>
                  <button 
                    onClick={() => navigate('candidate-app-detail', { applicationId: session.applicationId })}
                    className="py-1.5 px-4 bg-green-600 text-white rounded font-bold text-xs"
                  >
                    View Scorecard Metrics
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 6. CANDIDATE PROFILE */}
      {subView === 'profile' && (() => {
        const profileFields = [bio, phone, location, linkedIn, workRights, salaryExpectation, availableFrom, cvFileName];
        const filled = profileFields.filter(Boolean).length;
        const completionPct = Math.round(((filled + (skills.length > 0 ? 1 : 0)) / (profileFields.length + 1)) * 100);
        return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Candidate Profile</h2>
            <p className="text-xs text-gray-500">Complete your profile to improve your chances with recruiters.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Personal Details</h3>
                <button onClick={() => {
                  if (isEditingProfile) {
                    if (linkedIn && !linkedIn.includes('linkedin.com')) { showToast('LinkedIn URL must be from linkedin.com', 'error'); return; }
                    if (github && !github.includes('github.com')) { showToast('GitHub URL must be from github.com', 'error'); return; }
                    if (phone && !/^[+\d\s\-()]{8,15}$/.test(phone)) { showToast('Please enter a valid phone number', 'error'); return; }
                    // Save to backend
                    const token = localStorage.getItem('qani_auth_token');
                    fetch(`https://qani.io/api/v1/candidates/${user?.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ firstName, lastName, bio, phone, location, skills, linkedinUrl: linkedIn, githubUrl: github, workRights, salaryExpectation, availableFrom }),
                    }).then(() => refreshStates()).catch(console.error);
                    // Update AppContext user state immediately
                    updateUser({ firstName, lastName });
                    showToast('Profile saved successfully.', 'success');
                  }
                  setIsEditingProfile(!isEditingProfile);
                }} className="text-xs font-semibold py-1.5 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition cursor-pointer">
                  {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              {!isEditingProfile ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>First Name:</strong> {firstName || '—'}</p>
                    <p><strong>Last Name:</strong> {lastName || '—'}</p>
                  </div>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {phone || '—'}</p>
                  <p><strong>Location:</strong> {location || '—'}</p>
                  <p><strong>LinkedIn:</strong> {linkedIn ? <a href={linkedIn} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{linkedIn}</a> : '—'}</p>
                  <p><strong>GitHub:</strong> {github ? <a href={github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{github}</a> : '—'}</p>
                  <p><strong>Work Rights:</strong> {workRights || '—'}</p>
                  <p><strong>Salary Expectation:</strong> {salaryExpectation ? `$${salaryExpectation}` : '—'}</p>
                  <p><strong>Available From:</strong> {availableFrom || '—'}</p>
                  <div className="space-y-1 pt-1">
                    <strong>Bio:</strong>
                    <p className="text-gray-600 leading-relaxed">{bio || 'No bio yet. Click Edit Profile to add one.'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Profile Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {avatarUrl ? (
                        <img src={avatarUrl} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" alt="avatar" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">Photo</div>
                      )}
                      <label className="cursor-pointer text-xs font-semibold py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 2 * 1024 * 1024) { showToast('Photo too large. Max 2MB.', 'error'); return; }
                          const reader = new FileReader();
                          reader.onload = async () => {
                            const photoData = reader.result as string;
                            try {
                              const token = localStorage.getItem('qani_auth_token');
                              const res = await fetch(`https://qani.io/api/v1/candidates/${user?.id}/upload-photo`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                body: JSON.stringify({ photoData }),
                              });
                              if (res.ok) {
                                setAvatarUrl(photoData);
                                showToast('Photo uploaded successfully.', 'success');
                              } else {
                                showToast('Failed to upload photo.', 'error');
                              }
                            } catch(e) {
                              showToast('Upload failed. Try again.', 'error');
                            }
                          };
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                      {avatarUrl && <button onClick={() => setAvatarUrl('')} className="cursor-pointer text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Phone</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +61 4XX XXX XXX"
                        className={`w-full text-xs p-2.5 bg-gray-50 border rounded ${phone && !/^[+\d\s\-()]{8,15}$/.test(phone) ? 'border-red-400' : 'border-gray-300'}`} />
                      {phone && !/^[+\d\s\-()]{8,15}$/.test(phone) && <p className="text-[10px] text-red-500">Enter a valid phone number</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Location (City, State)</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sydney, NSW" className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">LinkedIn URL</label>
                      <input type="url" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/yourname"
                        className={`w-full text-xs p-2.5 bg-gray-50 border rounded ${linkedIn && !linkedIn.includes('linkedin.com') ? 'border-red-400' : 'border-gray-300'}`} />
                      {linkedIn && !linkedIn.includes('linkedin.com') && <p className="text-[10px] text-red-500">Must be a linkedin.com URL</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">GitHub URL</label>
                      <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourname"
                        className={`w-full text-xs p-2.5 bg-gray-50 border rounded ${github && !github.includes('github.com') ? 'border-red-400' : 'border-gray-300'}`} />
                      {github && !github.includes('github.com') && <p className="text-[10px] text-red-500">Must be a github.com URL</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Work Rights / Visa Status</label>
                      <select value={workRights} onChange={(e) => setWorkRights(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded cursor-pointer">
                        <option value="">Select...</option>
                        <option value="Australian Citizen">Australian Citizen</option>
                        <option value="Permanent Resident">Permanent Resident</option>
                        <option value="Working Holiday Visa">Working Holiday Visa</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Sponsored (457/482)">Sponsored (457/482)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Salary Expectation (AUD/year)</label>
                      <input type="number" value={salaryExpectation} onChange={(e) => setSalaryExpectation(e.target.value)} placeholder="e.g. 120000" className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Available From</label>
                    <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Bio / Professional Summary</label>
                    <textarea value={bio} rows={4} onChange={(e) => setBio(e.target.value)} placeholder="Describe your experience and what you are looking for..." className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded resize-none" />
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Skills</h3>
                {isEditingProfile && (
                  <div className="flex gap-2">
                    <input type="text" placeholder="e.g. React" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && newSkill && !skills.includes(newSkill)) { setSkills([...skills, newSkill]); setNewSkill(''); } }}
                      className="text-xs p-2 bg-gray-50 border rounded flex-1" />
                    <button type="button" onClick={() => { if (newSkill && !skills.includes(newSkill)) { setSkills([...skills, newSkill]); setNewSkill(''); } }}
                      className="px-4 py-2 bg-gray-900 text-white rounded text-xs cursor-pointer">Add</button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map(skill => (
                    <span key={skill} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 py-1 px-3 rounded-full flex items-center gap-1.5">
                      <span>{skill}</span>
                      {isEditingProfile && <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="text-blue-500 hover:text-red-500 font-bold cursor-pointer">×</button>}
                    </span>
                  ))}
                  {skills.length === 0 && <span className="text-gray-400 text-xs italic">No skills added yet.</span>}
                </div>
              </div>

              {/* CV Upload */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Resume / CV</h3>
                {cvFileName ? (
                  <div className="relative group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 truncate max-w-[180px]">{cvFileName}</p>
                        <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>Uploaded successfully</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => {
                        const token = localStorage.getItem('qani_auth_token');
                        const res = await fetch(`https://qani.io/api/v1/candidates/${user?.id}/profile`, { headers: { Authorization: `Bearer ${token}` } });
                        const p = await res.json();
                        if (p.cvUrl) {
                          const a = document.createElement('a');
                          a.href = p.cvUrl;
                          a.download = cvFileName || 'cv';
                          a.click();
                        }
                      }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                        Download
                      </button>
                      <button onClick={() => setCvFileName('')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-700 border border-red-200 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block p-6 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-center cursor-pointer transition">
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB.', 'error'); return; }
                      setCvUploading(true);
                      try {
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const cvData = reader.result as string;
                          const token = localStorage.getItem('qani_auth_token');
                          const res = await fetch(`https://qani.io/api/v1/candidates/${user?.id}/upload-cv`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                            body: JSON.stringify({ cvData, cvFilename: file.name }),
                          });
                          if (res.ok) {
                            setCvFileName(file.name);
                            showToast('CV uploaded successfully.', 'success');
                          } else {
                            showToast('Failed to upload CV. Try again.', 'error');
                          }
                          setCvUploading(false);
                        };
                        reader.readAsDataURL(file);
                      } catch(e) {
                        showToast('Upload failed. Try again.', 'error');
                        setCvUploading(false);
                      }
                    }} />
                    {cvUploading ? (
                      <span className="text-xs text-blue-600">Uploading...</span>
                    ) : (
                      <>
                        <Download className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-xs text-gray-500">Click to upload PDF or Word document (max 5MB)</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Profile completion sidebar */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-6 h-fit space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">Profile Completion</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Completed:</span>
                  <span className={completionPct >= 80 ? 'text-green-600' : completionPct >= 50 ? 'text-yellow-600' : 'text-red-500'}>{completionPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${completionPct >= 80 ? 'bg-green-500' : completionPct >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${completionPct}%` }} />
                </div>
              </div>
              <ul className="text-[11px] text-gray-600 space-y-2 pt-2">
                {[
                  { label: 'Bio written', done: !!bio },
                  { label: 'Skills added', done: skills.length > 0 },
                  { label: 'CV uploaded', done: !!cvFileName },
                  { label: 'LinkedIn added', done: !!linkedIn },
                  { label: 'GitHub added', done: !!github },
                  { label: 'Work rights set', done: !!workRights },
                  { label: 'Salary expectation set', done: !!salaryExpectation },
                  { label: 'Availability set', done: !!availableFrom },
                  { label: 'Phone number added', done: !!phone },
                  { label: 'Location set', done: !!location },
                ].map(item => (
                  <li key={item.label} className={`flex items-center gap-1.5 ${item.done ? 'text-gray-700' : 'text-orange-400'}`}>
                    {item.done ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        );
      })()}

      {/* MY APPLICATIONS */}
      {subView === 'applications' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Applications</h2>
            <p className="text-xs text-gray-500">{applications.filter(a => a.candidateId === user.id).length} total applications</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Position</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Applied</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {applications.filter(a => a.candidateId === user.id).map(app => {
                  const job = jobs.find(j => j.id === (app.jobId ?? app.roleId));
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('candidate-app-detail', { applicationId: app.id })}>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">{job?.title || 'Unknown Position'}</span>
                      </td>
                      <td className="p-4 text-gray-500">{(job as any)?.company || (job as any)?.organisationId || '—'}</td>
                      <td className="p-4 text-gray-500">{app.appliedDate || '—'}</td>
                      <td className="p-4 font-mono font-bold text-blue-600">
                        {(app.score !== undefined || (app as any).aiScore !== undefined) ? `${Math.round(app.score ?? (app as any).aiScore)}/100` : 'Pending'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block text-[10px] font-bold uppercase py-1 px-2.5 rounded-full ${
                          app.status === 'qualified' ? 'bg-green-100 text-green-700' :
                          app.status === 'screening' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{app.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">View</button>
                      </td>
                    </tr>
                  );
                })}
                {applications.filter(a => a.candidateId === user.id).length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400 italic">No applications yet. Browse jobs to apply.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. CANDIDATE SETTINGS */}
      {subView === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Portal Settings</h2>
            <p className="text-xs text-gray-500">Manage your account, privacy and notification preferences.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Account</h3>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">Email Address</label>
                <input type="text" disabled value={user.email} className="w-full text-xs p-2.5 bg-gray-100 text-gray-500 border rounded cursor-not-allowed" />
                {(() => {
                  const [newEmail, setNewEmailC] = React.useState('');
                  const [otpSentC, setOtpSentC] = React.useState(false);
                  const [otpC, setOtpC] = React.useState('');
                  const [sendingC, setSendingC] = React.useState(false);
                  return (
                    <div className="space-y-2 pt-1">
                      <input type="email" value={newEmail} onChange={e => setNewEmailC(e.target.value)} placeholder="New email address" className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                      {!otpSentC ? (
                        <button onClick={async () => {
                          if (!newEmail) { showToast('Enter new email first.', 'error'); return; }
                          setSendingC(true);
                          const token = localStorage.getItem('qani_auth_token');
                          const res = await fetch('https://qani.io/api/v1/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ target: newEmail, type: 'email', userId: user?.id }) });
                          if (res.ok) { setOtpSentC(true); showToast('OTP sent to new email.', 'success'); }
                          else showToast('Failed to send OTP.', 'error');
                          setSendingC(false);
                        }} disabled={sendingC} className="cursor-pointer text-xs font-semibold py-1.5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                          {sendingC ? 'Sending...' : 'Send OTP to New Email'}
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <input type="text" value={otpC} onChange={e => setOtpC(e.target.value)} placeholder="Enter OTP" maxLength={6} className="flex-1 text-xs p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                          <button onClick={async () => {
                            const token = localStorage.getItem('qani_auth_token');
                            const res = await fetch('https://qani.io/api/v1/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ target: newEmail, type: 'email', otp: otpC, userId: user?.id }) });
                            if (res.ok) { updateUser({ email: newEmail }); showToast('Email updated successfully.', 'success'); setOtpSentC(false); setNewEmailC(''); setOtpC(''); }
                            else showToast('Invalid OTP.', 'error');
                          }} className="cursor-pointer text-xs font-semibold py-1.5 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Verify & Update</button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-800 block">Change Password</span>
                <div className="space-y-2">
                  <input id="cp-current" type="password" placeholder="Current password" className="w-full p-2 border rounded text-xs" />
                  <input id="cp-new" type="password" placeholder="New password (min 8 chars)" className="w-full p-2 border rounded text-xs" />
                  <input id="cp-confirm" type="password" placeholder="Confirm new password" className="w-full p-2 border rounded text-xs" />
                </div>
                <button type="button" onClick={async () => {
                  const current = (document.getElementById('cp-current') as HTMLInputElement)?.value;
                  const newPw = (document.getElementById('cp-new') as HTMLInputElement)?.value;
                  const confirm = (document.getElementById('cp-confirm') as HTMLInputElement)?.value;
                  if (!current || !newPw || !confirm) { showToast('Please fill in all fields.', 'error'); return; }
                  if (newPw !== confirm) { showToast('New passwords do not match.', 'error'); return; }
                  if (newPw.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
                  try {
                    const token = localStorage.getItem('qani_auth_token');
                    const res = await fetch('https://qani.io/api/v1/auth/change-password', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ userId: user?.id, currentPassword: current, newPassword: newPw }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      showToast('Password changed successfully.', 'success');
                      (document.getElementById('cp-current') as HTMLInputElement).value = '';
                      (document.getElementById('cp-new') as HTMLInputElement).value = '';
                      (document.getElementById('cp-confirm') as HTMLInputElement).value = '';
                    } else {
                      showToast(data.error || 'Failed to change password.', 'error');
                    }
                  } catch(e) {
                    showToast('Failed to change password. Try again.', 'error');
                  }
                }} className="px-3 py-1.5 bg-gray-950 hover:bg-gray-900 text-white rounded text-[11px] font-semibold cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Privacy</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition">
                  <input type="checkbox" checked={profileVisible} onChange={(e) => { setProfileVisible(e.target.checked); showToast(e.target.checked ? 'Profile visible to recruiters.' : 'Profile hidden from recruiters.', 'success'); }} className="mt-0.5 cursor-pointer" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Show profile to recruiters</p>
                    <p className="text-[10px] text-gray-500">Recruiters can find and view your profile in the candidate directory.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer opacity-60">
                  <input type="checkbox" checked={true} disabled className="mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">AI screening data used for matching</p>
                    <p className="text-[10px] text-gray-400">Required for platform functionality — cannot be disabled.</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition">
                  <input type="checkbox" checked={notifyScreening} onChange={(e) => { setNotifyScreening(e.target.checked); showToast('Preference saved.', 'success'); }} className="mt-0.5 cursor-pointer" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">AI screening results</p>
                    <p className="text-[10px] text-gray-500">Notify when your screening score is ready.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition">
                  <input type="checkbox" checked={notifyJobs} onChange={(e) => { setNotifyJobs(e.target.checked); showToast('Preference saved.', 'success'); }} className="mt-0.5 cursor-pointer" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">New job recommendations</p>
                    <p className="text-[10px] text-gray-500">Weekly digest of jobs matching your profile.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {subView === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500">{notifications.filter(n => n.status === 'unread').length} unread</p>
            </div>
            {notifications.some(n => n.status === 'unread') && (
              <button onClick={async () => { await api.markAllNotificationsRead(); await refreshStates(); showToast('All marked as read.', 'success'); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">Mark all as read</button>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm max-w-4xl">
            {notifications.map(n => {
              const handleNotifClick = async () => {
                if (n.status === 'unread') { await api.markNotificationAsRead(n.id); await refreshStates(); }
                if (n.type === 'invite_sent' && (n as any).interviewDateTime) {
                  setInterviewModal({ title: n.title, dateTime: (n as any).interviewDateTime });
                  return;
                }
                if (n.type === 'invite_sent' && n.relatedApplicationId) {
                  navigate('candidate-app-detail', { applicationId: n.relatedApplicationId });
                  return;
                }
                if (n.relatedApplicationId) navigate('candidate-app-detail', { applicationId: n.relatedApplicationId });
                else if (n.relatedJobId) navigate('candidate-job-detail', { jobId: n.relatedJobId });
                else if (n.type === 'system' && ((n as any).message || '').toLowerCase().includes('job')) navigate('candidate-jobs');
                else navigate('candidate-notifications');
              };
              return (
                <div key={n.id} onClick={handleNotifClick}
                  className={`p-5 flex items-start gap-4 transition cursor-pointer ${n.status === 'unread' ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className={`p-2 rounded-lg shrink-0 ${n.status === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${n.status === 'unread' ? 'text-gray-950' : 'text-gray-500'}`}>{n.title}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        {n.status === 'unread' && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <span className="text-[10px] text-gray-400">{(n.date || n.createdAt) ? new Date(n.date || n.createdAt || '').toLocaleString() : 'Just now'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{n.content || (n as any).message}</p>
                    {n.type === 'invite_sent' && (n as any).interviewDateTime && (
                      <span className="text-[10px] text-green-600 font-semibold">📅 Click to view interview & add to calendar</span>
                    )}
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div className="p-12 text-center text-gray-400 italic">No notifications yet.</div>
            )}
          </div>
        </div>
      )}

    </div>

    {interviewModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setInterviewModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5" onClick={e => e.stopPropagation()}>
          <div className="text-center space-y-2">
            <span className="text-4xl">📅</span>
            <h2 className="text-lg font-bold text-gray-900">{interviewModal.title}</h2>
            <p className="text-sm text-gray-600">{new Date(interviewModal.dateTime).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 text-center">Duration: 1 hour · Confirm attendance with recruiter</div>
          <div className="space-y-2">
            <button onClick={async () => {
              const dt = new Date(interviewModal.dateTime);
              const dtEnd = new Date(dt.getTime() + 3600000);
              const fmt = (d: Date) => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
              // Open Google Calendar directly
              const gcUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
                '&text=' + encodeURIComponent(interviewModal.title) +
                '&dates=' + fmt(dt) + '/' + fmt(dtEnd) +
                '&details=' + encodeURIComponent('Interview scheduled via QANI AI Recruitment Platform. Please confirm your attendance.') +
                '&sf=true&output=xml';
              window.open(gcUrl, '_blank');
              // Also notify recruiter that candidate accepted
              try {
                // Find the application to get recruiter email
                const matchedApp = applications.find((a: any) => a.id === interviewModal.applicationId);
                const recruiterEmail = (matchedApp as any)?.recruiterEmail || 'recruiter@qani.io';
                await fetch('/api/v1/notifications/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipientEmail: recruiterEmail,
                    recipientId: 'recruiter-' + recruiterEmail,
                    type: 'invite_sent',
                    title: 'Interview Confirmed — ' + user.firstName + ' ' + user.lastName,
                    message: user.firstName + ' ' + user.lastName + ' has confirmed the interview scheduled for ' + dt.toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' }) + '. Click to add to your Google Calendar.',
                    interviewDateTime: interviewModal.dateTime,
                    relatedApplicationId: interviewModal.applicationId,
                  })
                });
              } catch(e) {}
              showToast('Google Calendar opened! Recruiter notified of your confirmation.', 'success');
              setInterviewModal(null);
            }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold cursor-pointer">
              ✅ Confirm & Open Google Calendar
            </button>
            <button onClick={() => {
              const dt = new Date(interviewModal.dateTime);
              const dtEnd = new Date(dt.getTime() + 3600000);
              const fmt = (d: Date) => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
              const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//QANI//EN','BEGIN:VEVENT',
                'DTSTART:'+fmt(dt),'DTEND:'+fmt(dtEnd),
                'SUMMARY:'+interviewModal.title,
                'DESCRIPTION:Interview scheduled via QANI.',
                'STATUS:CONFIRMED','END:VEVENT','END:VCALENDAR'].join('\r\n');
              const blob = new Blob([ics],{type:'text/calendar'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href=url; a.download='interview.ics'; a.click();
              URL.revokeObjectURL(url);
              showToast('Calendar file downloaded for Outlook/Apple Calendar.','success');
              setInterviewModal(null);
            }} className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer">
              📥 Download for Outlook / Apple Calendar
            </button>
            <button onClick={() => setInterviewModal(null)} className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer">Close</button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};
