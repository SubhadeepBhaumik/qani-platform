import React, { useEffect, useState } from 'react';
import { useApp, AppView } from '../AppContext';
import { api } from '../../lib/api';
import { Job, Application, User, ChatMessage } from '../../types';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'recharts';
import { 
  Home, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  TrendingUp, 
  UserCheck, 
  ChevronRight, 
  Plus, 
  Search, 
  ArrowLeft, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Download, 
  Check, 
  X, 
  Sparkles, 
  PlusCircle, 
  Users2,
  Mail,
  Sliders,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const RecruiterSettings: React.FC<{ user: any; showToast: any }> = ({ user, showToast }) => {
  const [settingsTab, setSettingsTab] = React.useState<'profile'|'email'|'phone'>('profile');
  const [newEmail, setNewEmail] = React.useState('');
  const [newPhone, setNewPhone] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState('');
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const sendOTP = async (target: string) => {
    if (!target) { showToast('Please enter a value first.', 'error'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setOtpSent(true); setSending(false);
    showToast(`OTP sent to ${target}. Demo OTP: 123456`, 'success');
  };
  const verifyOTP = () => {
    if (otpValue === '123456') { setOtpVerified(true); showToast('OTP verified!', 'success'); }
    else showToast('Invalid OTP. Use 123456 for demo.', 'error');
  };
  const saveChange = (type: 'email'|'phone') => {
    showToast(`${type === 'email' ? 'Email' : 'Phone'} updated successfully.`, 'success');
    setOtpSent(false); setOtpValue(''); setOtpVerified(false); setNewEmail(''); setNewPhone(''); setSettingsTab('profile');
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Account Settings</h2>
        <p className="text-xs text-gray-500">Manage your profile, email and phone number.</p>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {([["profile","Profile"],["email","Change Email"],["phone","Change Phone"]] as const).map(([id,label]) => (
          <button key={id} onClick={() => { setSettingsTab(id); setOtpSent(false); setOtpVerified(false); setOtpValue(""); }}
            className={`cursor-pointer px-4 py-2 text-xs font-semibold border-b-2 transition -mb-px ${settingsTab===id?"border-blue-600 text-blue-600":"border-transparent text-gray-500 hover:text-gray-800"}`}>
            {label}
          </button>
        ))}
      </div>
      {settingsTab === "profile" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900">Profile Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {[["First Name", user.firstName],["Last Name", user.lastName],["Email", user.email],["Company", user.companyName||"—"],["Role", user.role]].map(([label, val]) => (
              <div key={String(label)}>
                <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
                <div className="h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 flex items-center text-xs text-gray-800 capitalize">{val}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setSettingsTab("email")} className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">Change Email</button>
            <button onClick={() => setSettingsTab("phone")} className="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold">Change Phone</button>
          </div>
        </div>
      )}
      {(settingsTab === "email" || settingsTab === "phone") && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900">{settingsTab === "email" ? "Change Email Address" : "Change Phone Number"}</h3>
          {settingsTab === "email" && <p className="text-xs text-gray-500">Current: <strong>{user.email}</strong></p>}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">{settingsTab === "email" ? "New Email Address" : "New Phone Number"}</label>
            <input value={settingsTab === "email" ? newEmail : newPhone}
              onChange={e => { settingsTab === "email" ? setNewEmail(e.target.value) : setNewPhone(e.target.value); setOtpSent(false); setOtpVerified(false); }}
              placeholder={settingsTab === "email" ? "new@email.com" : "+61 4XX XXX XXX"}
              type={settingsTab === "email" ? "email" : "tel"}
              className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:border-blue-500" />
          </div>
          {!otpSent && (
            <button onClick={() => sendOTP(settingsTab === "email" ? newEmail : newPhone)} disabled={sending || !(settingsTab === "email" ? newEmail : newPhone)}
              className="cursor-pointer h-9 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg">
              {sending ? "Sending..." : `Send OTP via ${settingsTab === "email" ? "Email" : "SMS"}`}
            </button>
          )}
          {otpSent && !otpVerified && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">OTP sent. <span className="text-gray-500">(Demo: 123456)</span></div>
              <div className="flex gap-2">
                <input value={otpValue} onChange={e => setOtpValue(e.target.value)} placeholder="123456" maxLength={6}
                  className="w-32 h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-center font-mono tracking-widest focus:outline-none focus:border-blue-500" />
                <button onClick={verifyOTP} className="cursor-pointer h-9 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg">Verify OTP</button>
                <button onClick={() => sendOTP(settingsTab === "email" ? newEmail : newPhone)} className="cursor-pointer h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg">Resend</button>
              </div>
            </div>
          )}
          {otpVerified && (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">✅ OTP verified. Confirm to save.</div>
              <button onClick={() => saveChange(settingsTab)} className="cursor-pointer h-9 px-5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg">Confirm Change</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RecruiterPages: React.FC<{ subView: string }> = ({ subView }) => {
  const { 
    user, 
    jobs, 
    applications, 
    sessions, 
    notifications, 
    navigate, 
    saveJob, 
    deleteJob, 
    updateApplicationStatus, 
    showToast,
    refreshStates,
    activeParams,
  goBack,
  } = useApp();

  // Search & sorting state for applications
  const [appSearch, setAppSearch] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState('All');
  const [bulkChecked, setBulkChecked] = useState<string[]>([]);

  // Create Job States
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobCategory, setJobCategory] = useState('Software Engineering');
  const [jobLoc, setJobLoc] = useState('Singapore (Hybrid)');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalMin, setJobSalMin] = useState(8000);
  const [jobSalMax, setJobSalMax] = useState(12000);
  const [jobDesc, setJobDesc] = useState('');
  const [mustReqString, setMustReqString] = useState('');
  const [niceReqString, setNiceReqString] = useState('');
  const [screeningQueries, setScreeningQueries] = useState<string[]>([
    'Explain your experience designing and maintaining high-performance React frontends with heavy data synchronization.',
    'How do you approach RESTful API security and prevent SQL injections in Node.js applications?',
    'Describe a complex production issue you debugged. What was the root cause and how did you resolve it?',
    'What are your compensation expectations and what is your availability for a starting date?'
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Load existing job data when editing
  useEffect(() => {
    if (activeParams.editJobId && subView === 'create-job') {
      // Try from jobs array first, then fetch directly
      const loadJob = async () => {
        let existingJob: any = jobs.find((j: any) => j.id === activeParams.editJobId);
        if (!existingJob) {
          try {
            existingJob = await api.getJobById(activeParams.editJobId);
          } catch (_) {}
        }
        if (existingJob) {
          setJobTitle(existingJob.title || '');
          setJobDept(existingJob.department || 'Engineering');
          setJobCategory(existingJob.category || 'Software Engineering');
          setJobLoc(existingJob.location || '');
          setJobType((existingJob.employmentType && existingJob.employmentType[0]) || 'Full-time');
          setJobSalMin(existingJob.salaryMin || 8000);
          setJobSalMax(existingJob.salaryMax || 12000);
          setJobDesc(existingJob.description || '');
          setMustReqString((existingJob.requirementsMust || []).join('\n'));
          setNiceReqString((existingJob.requirementsNice || []).join('\n'));
          setScreeningQueries(existingJob.screeningQuestions || []);
          if (existingJob.qualificationWeights) {
            setLocationWeight(existingJob.qualificationWeights.locationWeight || 80);
            setSalaryWeight(existingJob.qualificationWeights.salaryWeight || 90);
            setQualificationsWeight(existingJob.qualificationWeights.qualificationsWeight || 85);
            setWorkRightsWeight(existingJob.qualificationWeights.workRightsWeight || 95);
            setSkillsWeight(existingJob.qualificationWeights.skillsWeight || 100);
          }
        }
      };
      loadJob();
    }
  }, [activeParams.editJobId, subView]);
  
  // Custom Slider Coordinates for Weights
  const [locationWeight, setLocationWeight] = useState(80);
  const [salaryWeight, setSalaryWeight] = useState(90);
  const [qualificationsWeight, setQualificationsWeight] = useState(85);
  const [workRightsWeight, setWorkRightsWeight] = useState(95);
  const [skillsWeight, setSkillsWeight] = useState(100);

  // Recruiter notes additions
  const [recNoteText, setRecNoteText] = useState('');

  // Team setup modal triggers
  const [teamEmailInvite, setTeamEmailInvite] = useState('');
  const [teamRoleInvite, setTeamRoleInvite] = useState('Recruiter');

  // Load initial historical applicant listings for dashboard tables
  const allCandidates: any[] = [];

  if (!user) return null;

  // Pie chart data
  const pipelineData = [
    { name: 'Applied', value: applications.filter(a => a.status === 'applied').length, color: '#6366F1' },
    { name: 'Screening', value: applications.filter(a => a.status === 'screening').length, color: '#3B82F6' },
    { name: 'Qualified', value: applications.filter(a => a.status === 'qualified').length, color: '#10B981' },
    { name: 'Review Needed', value: applications.filter(a => a.status === 'review').length, color: '#F59E0B' },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Bar chart evaluation over7 days
  const weeklyScreeningData = [
    { day: 'Mon', screenings: 4, qualified: 1 },
    { day: 'Tue', screenings: 8, qualified: 2 },
    { day: 'Wed', screenings: 12, qualified: 4 },
    { day: 'Thu', screenings: 5, qualified: 2 },
    { day: 'Fri', screenings: 9, qualified: 3 },
    { day: 'Sat', screenings: 2, qualified: 0 },
    { day: 'Sun', screenings: 3, qualified: 1 }
  ];

  const handleBulkStateChange = (targetStatus: Application['status']) => {
    bulkChecked.forEach(id => {
      updateApplicationStatus(id, targetStatus);
    });
    setBulkChecked([]);
    showToast(`Bulk applications moved to ${targetStatus.toUpperCase()}`, 'success');
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) {
      showToast('Please input job title and description.', 'error');
      return;
    }

    const newJob: Job = {
      id: activeParams.editJobId || `job-${Date.now()}`,
      title: jobTitle,
      department: jobDept,
      category: jobCategory,
      location: jobLoc,
      employmentType: [jobType],
      salaryMin: Number(jobSalMin),
      salaryMax: Number(jobSalMax),
      hideSalary: false,
      description: jobDesc,
      benefits: ['Medical coverage', 'Learning allowance'],
      requirementsMust: mustReqString ? mustReqString.split('\n').filter(Boolean) : ['Experience in relevant software engineering roles.'],
      requirementsNice: niceReqString ? niceReqString.split('\n').filter(Boolean) : [],
      experienceLevel: 'Senior',
      experienceYearsMin: 5,
      experienceYearsMax: 10,
      skillsRequired: ['React', 'Backend Node'],
      educationRequired: ["Bachelor's in Computer Science"],
      screeningQuestions: screeningQueries,
      status: 'open',
      postedDate: new Date().toISOString().split('T')[0],
      qualificationWeights: {
        locationWeight,
        salaryWeight,
        qualificationsWeight,
        workRightsWeight,
        skillsWeight
      }
    };

    saveJob(newJob);

    // Reset fields
    setJobTitle('');
    setJobDesc('');
    setMustReqString('');
    setNiceReqString('');

    if (user.role === 'admin') { navigate('admin-jobs'); } else { navigate('recruiter-jobs'); }
  };

  const addQuestionString = () => {
    if (newQuestionText && !screeningQueries.includes(newQuestionText)) {
      setScreeningQueries([...screeningQueries, newQuestionText]);
      setNewQuestionText('');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
      
      {/* 1. RECRUITER DASHBOARD */}
      {subView === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold uppercase py-0.5 px-2.5 rounded-full border border-blue-200">
                TA Terminal Node: {user.companyName}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">Hiring Dashboard Summary</h2>
              <p className="text-xs text-gray-500">Monitor conversational AI screening metrics and candidate match streams.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                id="dashboard-job-creator-trigger"
                onClick={() => navigate('recruiter-create-job')}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Job</span>
              </button>
            </div>
          </div>

          {/* Quick Stats summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Pipeline applications</span>
              <p className="text-3xl font-extrabold text-gray-950">{applications.length}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active AI Screenings</span>
              <p className="text-3xl font-extrabold text-blue-600">{applications.filter(a => a.status === 'screening').length}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Qualified Talent</span>
              <p className="text-3xl font-extrabold text-green-600">{applications.filter(a => a.status === 'qualified').length}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Reject rate percentage</span>
              <p className="text-3xl font-extrabold text-red-500">
                {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'rejected').length / applications.length) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Pipeline Pie chart visualization */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Candidate Pipeline Breakdown</h3>
                <p className="text-[10px] text-gray-400 mt-1">Status distribution across the candidate flow</p>
              </div>
              
              <div className="h-44 w-full flex items-center justify-center">
                {pipelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-gray-400 italic">No application data yet.</span>
                )}
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-gray-500 border-t border-gray-100 pt-3">
                {pipelineData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="truncate">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Screening activity bar chart */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Daily Screen Completions</h3>
                <p className="text-[10px] text-gray-400 mt-1">AI coordinator screening session historical values</p>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyScreeningData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip />
                    <Bar dataKey="screenings" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Screenings Initiated" />
                    <Bar dataKey="qualified" fill="#10B981" radius={[4, 4, 0, 0]} name="Scores Qualified" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Job Openings list */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Acme Corp Open Job Vacancies</h3>
              <button onClick={() => navigate('recruiter-jobs')} className="cursor-pointer text-xs text-blue-600 hover:underline font-bold flex items-center gap-0.5">
                <span>Configure job positions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                    <th className="p-4">Title</th>
                    <th className="p-4">Department / Domain</th>
                    <th className="p-4">Applications volume</th>
                    <th className="p-4">AI Score Average</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                  {jobs.map(job => {
                    const appsForJob = applications.filter(a => a.jobId === job.id || a.roleId === job.id);
                    const scoredApps = appsForJob.filter(a => a.aiScore !== undefined || a.score !== undefined);
                    const avgScore = scoredApps.length ? Math.round(scoredApps.reduce((sum, current) => sum + (current.aiScore ?? current.score ?? 0), 0) / scoredApps.length) : 'N/A';
                    return (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-semibold text-gray-900 block">{job.title}</span>
                          <span className="text-[10px] text-gray-400">{job.location}</span>
                        </td>
                        <td className="p-4">{job.department}</td>
                        <td className="p-4 font-bold text-gray-800">{appsForJob.length} candidates</td>
                        <td className="p-4 font-mono font-bold text-blue-600">{avgScore !== 'N/A' ? `${avgScore}%` : 'Pending'}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => navigate('recruiter-applications', { filterJobId: job.id })} className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                            View Applicants
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. APPLICATIONS MANAGEMENT */}
      {subView === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">Corporate Applications Tracker</h2>
              <p className="text-xs text-gray-500">Filter candidate metrics, evaluate overall scorecards, and execute status modifications.</p>
              {activeParams.filterJobId && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    Filtered: {jobs.find(j => j.id === activeParams.filterJobId)?.title || activeParams.filterJobId}
                  </span>
                  <button onClick={() => navigate('recruiter-applications', {})} className="cursor-pointer text-xs text-gray-400 hover:text-gray-700 underline">Clear filter</button>
                </div>
              )}
            </div>
            {/* Bulk handlers drawer */}
            {bulkChecked.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg py-1.5 px-3 flex items-center gap-3 text-xs w-fit shadow-md">
                <span className="font-semibold text-blue-800">{bulkChecked.length} checked</span>
                <div className="flex gap-1.5">
                  <button onClick={() => handleBulkStateChange('qualified')} className="cursor-pointer bg-green-600 text-white font-bold py-1 px-2.5 rounded text-[10px]">Mark Qualified</button>
                  <button onClick={() => handleBulkStateChange('rejected')} className="cursor-pointer bg-red-600 text-white font-bold py-1 px-2.5 rounded text-[10px]">Reject</button>
                  <button onClick={() => setBulkChecked([])} className="cursor-pointer text-gray-500 hover:text-gray-900 text-[10px]">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* dynamic filter controls */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-3.5" />
              <input 
                type="text"
                placeholder="Search candidates by name, email, or specific skills..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg text-xs pl-11 outline-none focus:bg-white focus:border-blue-500 transition"
              />
            </div>
            
            <select 
              value={appFilterStatus}
              onChange={(e) => setAppFilterStatus(e.target.value)}
              className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none cursor-pointer w-full md:w-56"
            >
              <option value="All">All statuses</option>
              <option value="applied">Applied (Unscreened)</option>
              <option value="screening">Screening Conversation</option>
              <option value="qualified">Qualified AI Match</option>
              <option value="review">Review Needed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-normal">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) setBulkChecked(applications.map(a => a.id));
                        else setBulkChecked([]);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4">Candidate Profile</th>
                  <th className="p-4">Expected Job Title</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">AI Recruiter Score</th>
                  <th className="p-4 text-center">Assessment Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                {applications
                  .filter(app => {
                    const candidate = allCandidates.find(c => c.id === app.candidateId) || allCandidates[0];
                    const job = jobs.find(j => j.id === (app.jobId || app.roleId));
                    const filterJobId = activeParams.filterJobId;

                    const name = (app.candidateName || `${candidate?.firstName || ''} ${candidate?.lastName || ''}`).toLowerCase();
                    const searchMat = name.includes(appSearch.toLowerCase()) ||
                                     (app.candidateEmail || candidate?.email || '').toLowerCase().includes(appSearch.toLowerCase()) ||
                                     (app.jobTitle || job?.title || '').toLowerCase().includes(appSearch.toLowerCase());
                    const statusMat = appFilterStatus === 'All' || app.status === appFilterStatus;
                    const jobMat = !filterJobId || app.jobId === filterJobId || app.roleId === filterJobId;
                    return searchMat && statusMat && jobMat;
                  })
                  .map(app => {
                    const candidate = allCandidates.find(c => c.id === app.candidateId) || allCandidates[0];
                    const job = jobs.find(j => j.id === app.jobId);
                    const isChecked = bulkChecked.includes(app.id);

                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setBulkChecked([...bulkChecked, app.id]);
                              else setBulkChecked(bulkChecked.filter(id => id !== app.id));
                            }}
                            className="rounded border-gray-300 text-blue-600"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={candidate?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40'} 
                              alt="User" 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full border object-cover"
                            />
                            <div>
                              <span className="font-bold text-gray-950 block">{app.candidateName || `${candidate?.firstName || ""} ${candidate?.lastName || ""}`}</span>
                              <span className="text-[10px] text-gray-400 font-mono block">{app.candidateEmail || candidate?.email || ""}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900 block">{app.jobTitle || job?.title || "Unknown Role"}</span>
                          <span className="text-[10px] text-gray-400">{app.company || job?.department || ""}</span>
                        </td>
                        <td className="p-4">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-AU") : app.appliedDate || "—"}</td>
                        <td className="p-4">
                          {(() => { const s = app.aiScore ?? app.score; return s !== undefined ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-900">{s}%</span>
                              <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${s >= 80 ? 'bg-green-500' : s >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${s}%` }} />
                              </div>
                            </div>
                          ) : <span className="text-gray-400 italic text-xs">Pending</span>; })()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block text-[10px] font-bold uppercase py-1 px-2.5 rounded-full ${
                            app.status === 'qualified' ? 'bg-green-150 text-green-700 font-bold bg-green-50 border border-green-250' :
                            app.status === 'screening' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                            app.status === 'reject' || app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            app.status === 'review' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            id={`view-app-details-trigger-${app.id}`}
                            onClick={() => navigate('recruiter-app-detail', { applicationId: app.id })}
                            className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 font-bold"
                          >
                            View Assessment
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. APPLICATION DETAIL / SCORE VIEW */}
      {subView === 'app-detail' && (() => {
        const appId = activeParams.applicationId;
        const app = applications.find(a => a.id === appId);
        if (!app) return <p className="text-red-500">Application context not existing.</p>;

        const job = jobs.find(j => j.id === app.jobId);
        const candidate = allCandidates.find(c => c.id === app.candidateId) || allCandidates[0];
        const session = sessions.find(s => s.applicationId === app.id);

        const handleAddRecNote = (e: React.FormEvent) => {
          e.preventDefault();
          if (!recNoteText.trim()) return;
          updateApplicationStatus(app.id, app.status, {
            recruiterName: `${user.firstName} ${user.lastName}`,
            content: recNoteText
          });
          setRecNoteText('');
        };

        return (
          <div className="space-y-6">
            <button 
              onClick={() => navigate('recruiter-applications')}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Active tracker</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Profile and Scoring details */}
              <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <img 
                      src={candidate?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&h=64'} 
                      alt="Avatar" 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full border object-cover ring-4 ring-gray-100"
                    />
                    <div>
                      <h1 className="text-2xl font-extrabold text-gray-950">{app.candidateName || `${candidate?.firstName || ""} ${candidate?.lastName || ""}`}</h1>
                      <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wide">Applying For: {app.jobTitle || job?.title || "Unknown Role"} {app.company ? `· ${app.company}` : ""}</span>
                    </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{app.candidateEmail}</span>
                        {app.cvUrl ? (
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-semibold">📄 View CV</a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-lg">No CV uploaded</span>
                        )}
                      </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Matching Score</span>
                    <span className="font-mono text-3xl font-extrabold text-blue-600 bg-blue-50 py-1 px-4 rounded-xl border border-blue-100 inline-block mt-1">
                      {(app.aiScore ?? app.score) !== undefined ? `${app.aiScore ?? app.score}%` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* score details micro sliders */}
                {(app.scorecard || app.scoreBreakdown) ? (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Automated Scorecard Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                          <span>Location Compliance:</span>
                          <span className="text-blue-600">{(app.scorecard?.locationScore ?? app.scoreBreakdown?.locationMatch ?? 0)}/100</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(app.scorecard?.locationScore ?? app.scoreBreakdown?.locationMatch ?? 0)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                          <span>Salary Match parity:</span>
                          <span className="text-blue-600">{(app.scorecard?.salaryScore ?? app.scoreBreakdown?.salaryAlignment ?? 0)}/100</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(app.scorecard?.salaryScore ?? app.scoreBreakdown?.salaryAlignment ?? 0)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                          <span>Certifications reached:</span>
                          <span className="text-blue-600">{(app.scorecard?.qualificationsScore ?? app.scoreBreakdown?.qualifications ?? 0)}/100</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(app.scorecard?.qualificationsScore ?? app.scoreBreakdown?.qualifications ?? 0)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                          <span>Timeline feasibility:</span>
                          <span className="text-blue-600">{(app.scorecard?.workRightsScore ?? app.scoreBreakdown?.workRights ?? 0)}/100</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(app.scorecard?.workRightsScore ?? app.scoreBreakdown?.workRights ?? 0)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-dashed rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                        <Sparkles className="w-4 h-4" />
                        <span>Gemini Recruiter Feedback:</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed italic mt-1 pb-2">"{app.aiFeedback}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed rounded-xl">
                    <span className="text-xs text-gray-400 block italic">Conversational screening results not processed yet.</span>
                    <button onClick={() => navigate('recruiter-queue')} className="cursor-pointer mt-3 bg-blue-600 text-white py-1.5 px-3 rounded text-[11px] font-semibold">Invite screen</button>
                  </div>
                )}

                {/* transcribing transcript histories if exists */}
                {(session || (app.transcript && app.transcript.length > 0)) && (
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">AI Screening Transcript</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl max-h-80 overflow-y-auto border border-gray-200">
                      {(session ? session.messages.map(msg => ({ role: msg.role, message: msg.content, timestamp: msg.timestamp, id: msg.id })) : app.transcript || []).map((msg: any, idx: number) => (
                        <div key={msg.id || idx} className="text-xs border-b border-gray-200/50 pb-2 mb-2">
                          <span className={`font-bold block tracking-wider uppercase text-[10px] ${(msg.role === 'assistant' || msg.role === 'ai') ? 'text-blue-600' : 'text-gray-900'}`}>
                            {(msg.role === 'assistant' || msg.role === 'ai') ? 'QANI AI Interviewer' : (app.candidateName || candidate?.firstName || 'Candidate')}
                          </span>
                          <p className="text-gray-700 leading-relaxed mt-1">{msg.content || msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status and Notes editing Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider block">Recruiter Controls</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Update Pipeline Status</label>
                    <div className="flex gap-2">
                      <select 
                        id="recruiter-app-status-setter"
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value as Application['status'])}
                        className="text-xs py-2 px-3 border rounded bg-gray-50 flex-1 outline-none font-semibold cursor-pointer"
                      >
                        <option value="applied">Applied (Unscreened)</option>
                        <option value="screening">Invite Screen</option>
                        <option value="qualified">Qualified AI Match</option>
                        <option value="review">Review Needed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes log form */}
                <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm">
                  <span className="text-xs font-bold text-gray-900 uppercase block">Recruiter Evaluation Notes</span>
                  <form onSubmit={handleAddRecNote} className="space-y-2">
                    <textarea 
                      placeholder="Add notes about candidate conversation alignment..."
                      rows={2}
                      value={recNoteText}
                      onChange={(e) => setRecNoteText(e.target.value)}
                      className="w-full text-xs p-2 border rounded resize-none focus:outline-none focus:border-blue-400"
                    />
                    <button type="submit" className="px-4 py-2 bg-gray-950 text-white rounded text-xs font-semibold hover:bg-gray-900 transition">Save Note</button>
                  </form>

                  {/* historical recruiter notes */}
                  <div className="space-y-3 pt-2 max-h-40 overflow-y-auto divide-y divide-gray-55">
                    {app.notes?.map(n => (
                      <div key={n.id} className="text-xs pt-2.5">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mb-1">
                          <span>{n.recruiterName}</span>
                          <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 leading-normal italic">"{n.content}"</p>
                      </div>
                    ))}
                    {app.recruiterNotes && (
                      <div className="text-xs pt-2.5">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mb-1">
                          <span>Saved Note</span>
                        </div>
                        <p className="text-gray-700 leading-normal italic">"{app.recruiterNotes}"</p>
                      </div>
                    )}
                    {(!app.notes || app.notes.length === 0) && !app.recruiterNotes && (
                      <p className="text-gray-400 text-[10px] italic">No recruiter notes recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. SCREENING QUEUE */}
      {subView === 'queue' && (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">AI Screening Queue</h2>
              <p className="text-xs text-gray-500 mt-1">Manage candidate screening sessions. Invite unscreened applicants or monitor live AI interviews in progress.</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
              AI Recruiter Online
            </div>
          </div>

          {/* Active Screenings */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">🔴 In Progress ({applications.filter(a => a.status === 'screening').length})</h3>
            <div className="space-y-3">
              {applications.filter(a => a.status === 'screening').length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl text-xs italic">No active screenings right now.</div>
              )}
              {applications.filter(a => a.status === 'screening').map(app => {
                const elapsed = app.screeningStartedAt ? Math.round((Date.now() - new Date(app.screeningStartedAt).getTime()) / 60000) : null;
                const questionsAnswered = app.transcript ? app.transcript.filter((m: any) => m.role === 'candidate').length : 0;
                const lastMessage = app.transcript && app.transcript.length > 0 ? app.transcript[app.transcript.length - 1] : null;
                return (
                  <div key={app.id} className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm">
                          {(app.candidateName || 'C').charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-950 block text-sm">{app.candidateName || 'Unknown Candidate'}</span>
                          <span className="text-[10px] text-gray-400 block">{app.jobTitle || 'Unknown Role'} · {app.company || ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {elapsed !== null && <span className="bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-full font-semibold">⏱ {elapsed}m elapsed</span>}
                        <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full font-semibold">💬 {questionsAnswered} answers</span>
                        <button onClick={() => navigate('recruiter-app-detail', { applicationId: app.id })} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">View Live</button>
                      </div>
                    </div>
                    {lastMessage && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 italic truncate">
                        Last: "{lastMessage.message}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Awaiting Invite */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">⏳ Awaiting Screening Invite ({applications.filter(a => a.status === 'applied').length})</h3>
            <div className="space-y-3">
              {applications.filter(a => a.status === 'applied').length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl text-xs italic">No candidates awaiting invite.</div>
              )}
              {applications.filter(a => a.status === 'applied').map(app => (
                <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                      {(app.candidateName || 'C').charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-gray-950 block text-sm">{app.candidateName || 'Unknown Candidate'}</span>
                      <span className="text-[10px] text-gray-400 block">{app.jobTitle || 'Unknown Role'} · Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-AU') : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        await fetch('/api/v1/applications/' + app.id + '/status', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'screening' }) });
                        await fetch('/api/v1/notifications/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: app.candidateEmail, subject: 'You have been invited to screen for ' + (app.jobTitle || 'a role'), message: 'Hi ' + (app.candidateName || 'there') + ', you have been invited to complete your AI screening interview for the role of ' + (app.jobTitle || 'a position') + ' at ' + (app.company || 'our company') + '. Please login to QANI to begin.' }) });
                        showToast('Screening invite sent to ' + app.candidateName, 'success');
                        refreshStates();
                      }}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Invite to Screen
                    </button>
                    <button onClick={() => navigate('recruiter-app-detail', { applicationId: app.id })} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">✅ Completed ({applications.filter(a => ['qualified','review','rejected','hired'].includes(a.status)).length})</h3>
            <div className="space-y-3">
              {applications.filter(a => ['qualified','review','rejected','hired'].includes(a.status)).length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl text-xs italic">No completed screenings yet.</div>
              )}
              {applications.filter(a => ['qualified','review','rejected','hired'].includes(a.status)).map(app => (
                <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center font-bold text-green-600 text-xs">
                      {(app.candidateName || 'C').charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">{app.candidateName}</span>
                      <span className="text-[10px] text-gray-400 block">{app.jobTitle} · Score: {app.aiScore ?? app.score ?? 'N/A'}{(app.aiScore || app.score) ? '%' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${app.status === 'qualified' || app.status === 'hired' ? 'bg-green-50 border-green-200 text-green-700' : app.status === 'review' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <button onClick={() => navigate('recruiter-app-detail', { applicationId: app.id })} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">View Results</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. JOBS MANAGEMENT */}
      {subView === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Position Configurations</h2>
              <p className="text-xs text-gray-500">Manage internal job requirements drafts or publish matching criteria slots.</p>
            </div>
            <button 
              id="job-list-new-job-btn"
              onClick={() => navigate('recruiter-create-job')}
              className="inline-flex items-center gap-1 text-xs font-semibold py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create a New Job</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => {
              const appCount = applications.filter(a => a.jobId === job.id).length;
              const qualCount = applications.filter(a => a.jobId === job.id && a.status === 'qualified').length;

              return (
                <div key={job.id} id={`job-config-card-${job.id}`} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-750 px-2.5 py-0.5 rounded border">
                        {job.department}
                      </span>
                      <button 
                        onClick={() => deleteJob(job.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Delete this position"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-gray-950 leading-tight">{job.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <span className="font-extrabold text-gray-900 block">{appCount}</span>
                      <span>Applied</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <span className="font-extrabold text-green-600 block">{qualCount}</span>
                      <span>Qualified</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-center">
                      <button onClick={() => navigate('recruiter-applications', { filterJobId: job.id })} className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                        Parse candidates
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. CREATE JOB OPENING */}
      {subView === 'create-job' && (
        <div className="space-y-6">
          <button 
            onClick={() => goBack()}
            className="cursor-pointer inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back</span>
          </button>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Configure Matching Position</h2>
            <p className="text-xs text-gray-500">Engage qualification weighting sliders and configure custom screening AI questions.</p>
          </div>

          <form onSubmit={handleCreateJobSubmit} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form params left */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Position Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Senior Frontend Component Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Department</label>
                  <select value={jobDept} onChange={(e) => setJobDept(e.target.value)} className="w-full h-10 px-2 bg-gray-50 border rounded-lg text-xs outline-none cursor-pointer">
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>AI Lab</option>
                    <option>Sales & Marketing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Work arrangement location</label>
                  <input 
                    type="text" 
                    required
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full h-10 px-2 bg-gray-50 border rounded-lg text-xs outline-none">
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Salary Min</label>
                  <input type="number" value={jobSalMin} onChange={(e) => setJobSalMin(Number(e.target.value))} className="w-full h-10 px-3 bg-gray-50 border rounded-lg text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Salary Max</label>
                  <input type="number" value={jobSalMax} onChange={(e) => setJobSalMax(Number(e.target.value))} className="w-full h-10 px-3 bg-gray-50 border rounded-lg text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Job Description</label>
                <textarea 
                  required
                  placeholder="Describe day-to-day operations and team focus area..."
                  rows={4}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-lg text-xs outline-none resize-none focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Mandatory Skills / Requirements (Must be met, 1 per line)</label>
                <textarea 
                  placeholder="e.g. 5+ years writing typescript code"
                  rows={3}
                  value={mustReqString}
                  onChange={(e) => setMustReqString(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-lg text-xs outline-none resize-none"
                />
              </div>

              {/* Configure Custom AI Questions List */}
              <div className="space-y-2 pt-4 border-t">
                <label className="text-xs font-bold text-gray-700 block">AI Screening Questions</label>
                <p className="text-[10px] text-gray-400">Drag to reorder. These questions are asked by the QANI AI recruiter to every candidate.</p>
                <div className="space-y-2">
                  {screeningQueries.map((q, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDragIndex(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex === null || dragIndex === idx) return;
                        const updated = [...screeningQueries];
                        const [moved] = updated.splice(dragIndex, 1);
                        updated.splice(idx, 0, moved);
                        setScreeningQueries(updated);
                        setDragIndex(null);
                      }}
                      className={`flex gap-2 items-start bg-gray-50 p-2.5 rounded-lg border text-xs text-gray-600 cursor-grab active:cursor-grabbing transition ${dragIndex === idx ? 'opacity-50 border-blue-400' : 'hover:border-blue-300'}`}
                    >
                      <span className="text-gray-300 shrink-0 mt-0.5 select-none">⠿</span>
                      <span className="font-bold text-blue-600 shrink-0">Q{idx + 1}:</span>
                      <span className="flex-1">{q}</span>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...screeningQueries];
                            if (idx > 0) { [updated[idx-1], updated[idx]] = [updated[idx], updated[idx-1]]; setScreeningQueries(updated); }
                          }}
                          className="cursor-pointer text-gray-400 hover:text-blue-600 font-bold px-1"
                          title="Move up"
                        >↑</button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...screeningQueries];
                            if (idx < updated.length-1) { [updated[idx], updated[idx+1]] = [updated[idx+1], updated[idx]]; setScreeningQueries(updated); }
                          }}
                          className="cursor-pointer text-gray-400 hover:text-blue-600 font-bold px-1"
                          title="Move down"
                        >↓</button>
                        <button
                          type="button"
                          onClick={() => setScreeningQueries(screeningQueries.filter((_, i) => i !== idx))}
                          className="cursor-pointer text-red-400 font-bold hover:text-red-600 px-1"
                          title="Remove"
                        >×</button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a new screening question and click Add..."
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestionString())}
                      className="text-xs p-2 flex-grow border rounded-lg outline-none focus:border-blue-500"
                    />
                    <button type="button" onClick={addQuestionString} className="cursor-pointer px-3 bg-gray-900 text-white rounded-lg text-xs font-bold shrink-0 hover:bg-gray-800 transition">Add</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider weights coordinates right */}
            <div className="lg:col-span-4 space-y-6 border-l pl-4 border-gray-150">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest block">Qualification Weights</span>
              <p className="text-[10px] text-gray-400">Weight indicators determine how critical each scorecard metric is when Gemini auto-classifies candidate tiers.</p>
              
              <div className="space-y-4">
                <div className="space-y-1.55">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Location Compliances</span>
                    <span className="text-blue-600">{locationWeight}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={locationWeight} onChange={(e) => setLocationWeight(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-1.55">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Salary alignment</span>
                    <span className="text-blue-600">{salaryWeight}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={salaryWeight} onChange={(e) => setSalaryWeight(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-1.55">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Certification checklist</span>
                    <span className="text-blue-600">{qualificationsWeight}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={qualificationsWeight} onChange={(e) => setQualificationsWeight(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-1.55">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Visa / Start Speed</span>
                    <span className="text-blue-600">{workRightsWeight}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={workRightsWeight} onChange={(e) => setWorkRightsWeight(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-1.55">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Skills alignment</span>
                    <span className="text-blue-600">{skillsWeight}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={skillsWeight} onChange={(e) => setSkillsWeight(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>
              </div>

              <div className="pt-6 border-t">
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/10">
                  Publish Setup Position
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 7. REPORTS & ANALYTICS */}
      {subView === 'reports' && (() => {
        const total = applications.length;
        const screened = applications.filter(a => ['screening','qualified','review','rejected','hired'].includes(a.status)).length;
        const qualified = applications.filter(a => a.status === 'qualified' || a.status === 'hired').length;
        const rejected = applications.filter(a => a.status === 'rejected').length;
        const review = applications.filter(a => a.status === 'review').length;
        const inProgress = applications.filter(a => a.status === 'screening').length;
        const avgScore = applications.filter(a => a.aiScore || a.score).length > 0
          ? Math.round(applications.filter(a => a.aiScore || a.score).reduce((s, a) => s + (a.aiScore ?? a.score ?? 0), 0) / applications.filter(a => a.aiScore || a.score).length)
          : 0;
        const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;
        const screeningRate = total > 0 ? Math.round((screened / total) * 100) : 0;

        const funnelStages = [
          { label: 'Applied', count: total, pct: 100, color: 'bg-blue-200 text-blue-800' },
          { label: 'Screened by AI', count: screened, pct: total > 0 ? Math.round((screened/total)*100) : 0, color: 'bg-blue-400 text-white' },
          { label: 'Qualified', count: qualified, pct: total > 0 ? Math.round((qualified/total)*100) : 0, color: 'bg-green-400 text-white' },
          { label: 'Review Needed', count: review, pct: total > 0 ? Math.round((review/total)*100) : 0, color: 'bg-orange-300 text-white' },
          { label: 'Rejected', count: rejected, pct: total > 0 ? Math.round((rejected/total)*100) : 0, color: 'bg-red-300 text-white' },
        ];

        const jobMetrics = jobs.map(job => {
          const jobApps = applications.filter(a => a.roleId === job.id || a.jobId === job.id);
          const jobQual = jobApps.filter(a => a.status === 'qualified' || a.status === 'hired').length;
          const jobAvg = jobApps.filter(a => a.aiScore || a.score).length > 0
            ? Math.round(jobApps.filter(a => a.aiScore || a.score).reduce((s, a) => s + (a.aiScore ?? a.score ?? 0), 0) / jobApps.filter(a => a.aiScore || a.score).length)
            : null;
          return { job, total: jobApps.length, qualified: jobQual, avgScore: jobAvg };
        }).filter(m => m.total > 0);

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Reports & Analytics</h2>
                <p className="text-xs text-gray-500 mt-1">Real-time pipeline metrics, conversion rates and AI screening performance.</p>
              </div>
              <button onClick={() => showToast('CSV export coming in production phase.', 'info')} className="cursor-pointer text-xs font-semibold py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Applications', value: total, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                { label: 'Avg AI Score', value: avgScore ? `${avgScore}%` : 'N/A', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
                { label: 'Qualified Rate', value: `${conversionRate}%`, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                { label: 'Screening Rate', value: `${screeningRate}%`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
              ].map(kpi => (
                <div key={kpi.label} className={`border rounded-xl p-4 ${kpi.bg}`}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">{kpi.label}</p>
                  <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hiring Funnel */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Hiring Funnel</h3>
                <div className="space-y-3">
                  {funnelStages.map((stage, i) => (
                    <div key={stage.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700">
                        <span>{i + 1}. {stage.label}</span>
                        <span>{stage.count} · {stage.pct}%</span>
                      </div>
                      <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full flex items-center px-2 text-[10px] font-bold transition-all ${stage.color}`} style={{ width: `${Math.max(stage.pct, 5)}%` }}>
                          {stage.pct > 10 ? `${stage.pct}%` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Pie */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pipeline Breakdown</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pipelineData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <ChartTooltip formatter={(value: any, name: any) => [`${value} candidates`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2">
                  {pipelineData.map(d => (
                    <span key={d.name} className="flex items-center gap-1 text-[10px] text-gray-600">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />
                      {d.name} ({d.value})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Per Job Metrics */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Performance by Job</h3>
              {jobMetrics.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No job data available yet.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase">
                      <th className="pb-2 text-left font-semibold">Job Title</th>
                      <th className="pb-2 text-center font-semibold">Applications</th>
                      <th className="pb-2 text-center font-semibold">Qualified</th>
                      <th className="pb-2 text-center font-semibold">Avg Score</th>
                      <th className="pb-2 text-center font-semibold">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {jobMetrics.map(m => (
                      <tr key={m.job.id} className="hover:bg-gray-50">
                        <td className="py-3 font-semibold text-gray-900">{m.job.title}</td>
                        <td className="py-3 text-center text-gray-600">{m.total}</td>
                        <td className="py-3 text-center"><span className="text-green-700 font-bold">{m.qualified}</span></td>
                        <td className="py-3 text-center"><span className={`font-bold ${m.avgScore && m.avgScore >= 80 ? 'text-green-600' : m.avgScore && m.avgScore >= 60 ? 'text-orange-500' : 'text-red-500'}`}>{m.avgScore ? `${m.avgScore}%` : '—'}</span></td>
                        <td className="py-3 text-center">{m.total > 0 ? `${Math.round((m.qualified/m.total)*100)}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Score Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">AI Score Distribution</h3>
              <div className="grid grid-cols-3 gap-3">
                {[['High (80-100%)', applications.filter(a => (a.aiScore ?? a.score ?? 0) >= 80).length, 'text-green-600 bg-green-50 border-green-200'],
                  ['Mid (60-79%)', applications.filter(a => { const s = a.aiScore ?? a.score ?? 0; return s >= 60 && s < 80; }).length, 'text-orange-600 bg-orange-50 border-orange-200'],
                  ['Low (<60%)', applications.filter(a => { const s = a.aiScore ?? a.score; return s !== undefined && s < 60; }).length, 'text-red-600 bg-red-50 border-red-200']
                ].map(([label, count, style]) => (
                  <div key={String(label)} className={`border rounded-xl p-4 text-center ${style}`}>
                    <p className="text-2xl font-extrabold">{count}</p>
                    <p className="text-[10px] font-semibold mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
      {subView === 'team' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Workspace Team Members</h2>
            <p className="text-xs text-gray-500">Edit access permissions, invite workspace interviewers, and manage recruiter roles.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm max-w-4xl">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-gray-900 uppercase">Registered Org-Recruiters</span>
              <button 
                type="button" 
                onClick={() => {
                  if (teamEmailInvite) {
                    showToast(`Invited ${teamEmailInvite} as ${teamRoleInvite} successfully.`, 'success');
                    setTeamEmailInvite('');
                  } else {
                    showToast('Invite details are empty.', 'error');
                  }
                }}
                className="inline-flex items-center gap-1 py-1.5 px-3 bg-blue-600 text-white rounded text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invite Workspace User</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="co-worker@company.com" 
                value={teamEmailInvite} 
                onChange={(e) => setTeamEmailInvite(e.target.value)} 
                className="text-xs p-2 border rounded-lg flex-1 outline-none focus:border-blue-400"
              />
              <select value={teamRoleInvite} onChange={(e) => setTeamRoleInvite(e.target.value)} className="text-xs p-2 border rounded-lg cursor-pointer">
                <option>Recruiter (Edit Positions & Assessment)</option>
                <option>Viewer (Auditor read-only access)</option>
                <option>Admin (All settings edits)</option>
              </select>
            </div>

            <div className="space-y-4 pt-4 divide-y divide-gray-100">
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-800 text-xs">SC</div>
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">Sarah Chen (You)</span>
                    <span className="text-[10px] text-gray-400 block font-mono">sarah.chen@acme.com</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Port Admin</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. RECRUITER SETTINGS */}
      {subView === 'settings' && <RecruiterSettings user={user} showToast={showToast} />}

    </div>
  );
};
