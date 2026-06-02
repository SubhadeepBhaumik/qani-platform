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
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
      
      {/* 1. CANDIDATE DASHBOARD */}
      {subView === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back, {user.firstName}!</h2>
              <p className="text-xs text-gray-500">Monitor active evaluations and AI conversational screens.</p>
            </div>
            <button 
              onClick={() => navigate('candidate-jobs')}
              className="text-xs font-semibold py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Explore Open Jobs
            </button>
          </div>

          {/* Quick counters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Applications</span>
              <p className="text-2xl font-extrabold text-gray-950">{applications.filter(a => a.candidateId === user.id).length}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Under Screening</span>
              <p className="text-2xl font-extrabold text-blue-600">{applications.filter(a => a.candidateId === user.id && a.status === 'screening').length}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qualified Status</span>
              <p className="text-2xl font-extrabold text-green-600">{applications.filter(a => a.candidateId === user.id && a.status === 'qualified').length}</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Notifications</span>
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
                      const job = jobs.find(j => j.id === app.jobId ?? app.roleId);
                      return (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <span className="font-semibold text-gray-900 block">{job?.title || 'Unknown Position'}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{job?.department || 'General'}</span>
                          </td>
                          <td className="p-4 text-gray-600">{app.appliedDate}</td>
                          <td className="p-4 font-mono font-bold text-blue-600">
                            {app.score !== undefined ? `${app.score}/100` : 'Evaluating...'}
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
                        {!job.hideSalary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" /> ${job.salaryMin} - ${job.salaryMax}
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
                  <div className="space-y-1 relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-4 ring-white" />
                    <span className="text-gray-400 text-[10px] font-mono">TODAY</span>
                    <p className="font-semibold text-gray-900">Logged into QANI Platform</p>
                  </div>
                  <div className="space-y-1 relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-white" />
                    <span className="text-gray-400 text-[10px] font-mono">YESTERDAY</span>
                    <p className="font-semibold text-gray-900">Profile available to recruiters</p>
                  </div>
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
                    <button className="text-xs font-semibold py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition cursor-pointer">View details</button>
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
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    {!job.hideSalary && (
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${job.salaryMin} - ${job.salaryMax} / mo</span>
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
                
                {alreadyApplied ? (
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
                ) : (
                  <button 
                    id="apply-job-btn-trigger"
                    onClick={() => applyForJob(job.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-blue-500/15 cursor-pointer"
                  >
                    Apply Now via QANI
                  </button>
                )}

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

        const job = jobs.find(j => j.id === app.jobId ?? app.roleId);

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
                  <h1 className="text-2xl font-extrabold text-gray-950 mt-1">{job?.title || 'Unknown Position'} Application</h1>
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
                {app.scorecard && (
                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Match Assessment</h3>
                      <span className="font-mono text-xl font-extrabold text-blue-600 bg-blue-50 py-1 px-3 rounded-lg">{app.score}/100</span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Work Location Compliances:</span>
                          <span className="font-semibold">{app.scorecard.locationScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${app.scorecard.locationScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Salary Match Projections:</span>
                          <span className="font-semibold">{app.scorecard.salaryScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${app.scorecard.salaryScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Mandatory Certifications Alignment:</span>
                          <span className="font-semibold">{app.scorecard.qualificationsScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${app.scorecard.qualificationsScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Visa / Availability parameters:</span>
                          <span className="font-semibold">{app.scorecard.workRightsScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${app.scorecard.workRightsScore}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>Specific Skills & Software Experience:</span>
                          <span className="font-semibold">{app.scorecard.skillsScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${app.scorecard.skillsScore}%` }} />
                        </div>
                      </div>
                    </div>

                    {app.aiFeedback && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1 pt-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Assessment feedback:</span>
                        <p className="text-xs text-gray-700 leading-relaxed italic">"{app.aiFeedback}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* side info right */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Application Coordinates</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p><strong>Date Applied:</strong> {app.appliedDate}</p>
                    <p><strong>Position:</strong> {job?.title || 'N/A'}</p>
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

        const totalQuestions = job?.screeningQuestions?.length || 5;
        const answeredCount = session.messages.filter(m => m.role === 'user').length;
        const progressPercent = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

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
                <span className="text-xs font-bold text-blue-600">{progressPercent}% Completed</span>
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
              {session.messages.map(msg => {
                const isAI = msg.role === 'assistant';
                return (
                  <div key={msg.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-1 shadow-sm ${
                      isAI 
                        ? 'bg-white border border-gray-200 text-gray-950' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <span className={`text-[9px] font-bold block uppercase ${isAI ? 'text-blue-600' : 'text-blue-100'}`}>
                        {isAI ? 'QANI Virtual Recruiter' : 'Candidate'}
                      </span>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
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
                        const res = await fetch('http://qani.io/api/v1/screening/end', {
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
      {subView === 'profile' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Candidate Profile</h2>
            <p className="text-xs text-gray-500">Edit skills criteria, experience files, and resume parameters.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* profile parameters left */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Candidate Coordinates</h3>
                <button 
                  onClick={() => {
                    if (isEditingProfile) {
                      // Save modifications
                      const updated = {
                        ...user,
                        firstName,
                        lastName,
                        bio,
                        phone,
                        location,
                        skills
                      };
                      saveUser(updated);
                      showToast('Profile coordinates updated successfully.', 'success');
                    }
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="text-xs font-semibold py-1.5 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
                >
                  {isEditingProfile ? 'Save Changes' : 'Edit Coordinates'}
                </button>
              </div>

              {!isEditingProfile ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>First Name:</strong> {firstName}</p>
                    <p><strong>Last Name:</strong> {lastName}</p>
                  </div>
                  <p><strong>Primary Handle (Email):</strong> {user.email}</p>
                  <p><strong>Location Coordinates:</strong> {location || 'Not Specified'}</p>
                  <p><strong>Mobile Suffix:</strong> {phone || 'Not Specified'}</p>
                  <div className="space-y-1">
                    <strong>Professional Summary:</strong>
                    <p className="text-gray-600 leading-relaxed">{bio || 'No bio specified. Edit Coordinates to describe your experience.'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
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
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Bio</label>
                    <textarea value={bio} rows={3} onChange={(e) => setBio(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Location</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Phone</label>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab editing */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Skills Framework</h3>
                {isEditingProfile && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. React" 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)} 
                      className="text-xs p-2 bg-gray-50 border rounded flex-1"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (newSkill && !skills.includes(newSkill)) {
                          setSkills([...skills, newSkill]);
                          setNewSkill('');
                        }
                      }} 
                      className="px-4 py-2 bg-gray-900 text-white rounded text-xs"
                    >
                      Add
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map(skill => (
                    <span key={skill} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 py-1 px-3 rounded-full flex items-center gap-1.5">
                      <span>{skill}</span>
                      {isEditingProfile && (
                        <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="text-blue-500 hover:text-blue-700 font-bold">×</button>
                      )}
                    </span>
                  ))}
                  {skills.length === 0 && <span className="text-gray-400 text-xs italic">No skills specified on profile.</span>}
                </div>
              </div>

              {/* Resume controls */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Candidate CV Files</h3>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <span>{user.resumeName || 'steve_resume.pdf'} (Singapore Region file)</span>
                  </div>
                  <a href="#" className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>

            {/* right visual matching completed summary */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-6 h-fit space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest">Profile Integrity</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Completed Indices:</span>
                  <span className="text-blue-600">80%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '80%' }} />
                </div>
              </div>
              <ul className="text-[11px] text-gray-600 space-y-1 pt-2">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Bio written</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Skills categorized</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> CV registered</li>
                <li className="flex items-center gap-1.5 text-orange-400"><AlertTriangle className="w-3.5 h-3.5" /> Verify github links</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. CANDIDATE SETTINGS */}
      {subView === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Portal Settings</h2>
            <p className="text-xs text-gray-500">Edit notification frequencies and modify credential configurations.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
            <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Account Configurations</h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Primary Communication Handle</label>
                <input type="text" disabled value={user.email} className="w-full text-xs p-2.5 bg-gray-100 text-gray-500 border rounded cursor-not-allowed" />
              </div>

              {/* Password simulation widget */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <span className="text-xs font-bold text-gray-800">Update Account Password</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-2 border rounded text-xs" />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => showToast('Password configuration parsed.', 'success')}
                  className="px-3 py-1.5 bg-gray-950 hover:bg-gray-900 text-white rounded text-[11px] font-semibold"
                >
                  Save Password
                </button>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-800 block">Notification Presets</span>
                <div className="space-y-2 text-xs text-gray-600">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-2" />
                    <span>Notify immediately upon finished AI assessment scoring.</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-2" />
                    <span>Receive recommended weekly job postings matching profile coordinates.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CANDIDATE NOTIFICATIONS */}
      {subView === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Notifications Desk</h2>
            <p className="text-xs text-gray-500">Track pipeline updates, system triggers, and direct recruitment pings.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm max-w-4xl">
            {notifications.map(n => (
              <div key={n.id} className="p-5 hover:bg-gray-50 flex items-start gap-4 transition">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-950">{n.title}</span>
                    <span className="text-[10px] font-mono text-gray-400">{new Date(n.date).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">{n.content}</p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-12 text-center text-gray-400 italic">No notifications inside sandbox.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
