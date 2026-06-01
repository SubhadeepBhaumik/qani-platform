import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import {
  ShieldAlert, Trash2, Activity, Users, Briefcase,
  FileText, Settings, Edit3, Save, X, Eye,
  Plus, Search, Download, DollarSign, TrendingUp,
  Lock, Unlock, PenTool, Database, Shield, Bell,
  Ban, Mail, Layout, Globe, Zap, Package, CreditCard,
  CheckCircle, AlertCircle, Clock, Bot, BarChart2
} from 'lucide-react';

// ─── RICH TEXT EDITOR ─────────────────────────────────────────────────────────
const RichTextEditor: React.FC<{ value: string; onChange: (v: string) => void; label: string }> = ({ value, onChange, label }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">{label}</label>
        {!editing ? (
          <button onClick={() => { setDraft(value); setEditing(true); }} className="cursor-pointer flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { onChange(draft); setEditing(false); }} className="cursor-pointer flex items-center gap-1 text-[11px] text-green-600 font-semibold">
              <Save className="w-3 h-3" /> Save
            </button>
            <button onClick={() => setEditing(false)} className="cursor-pointer flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}
      </div>
      {editing ? (
        <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} className="w-full border border-blue-400 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-y" autoFocus />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 min-h-[50px] whitespace-pre-wrap">{value || <span className="text-gray-400 italic">Empty</span>}</div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string; sub?: string }> = ({ label, value, icon, color, sub }) => (
  <div className="p-5 rounded-xl border bg-white shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
    <p className="text-2xl font-extrabold text-gray-900 mt-3">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    {sub && <p className="text-[10px] text-green-600 font-semibold mt-1">{sub}</p>}
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    qualified: 'bg-green-50 text-green-700 border-green-200',
    review: 'bg-orange-50 text-orange-700 border-orange-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    screening: 'bg-blue-50 text-blue-700 border-blue-200',
    applied: 'bg-gray-50 text-gray-700 border-gray-200',
    open: 'bg-green-50 text-green-700 border-green-200',
    closed: 'bg-red-50 text-red-700 border-red-200',
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
    candidate: 'bg-blue-50 text-blue-700 border-blue-200',
    recruiter: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-red-50 text-red-700 border-red-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    trial: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>{status}</span>;
};

// ─── USER DETAIL MODAL ────────────────────────────────────────────────────────
const UserModal: React.FC<{ user: any; onClose: () => void; onSave: (u: any) => void; onDelete: (id: string) => void; onToggleStatus: (u: any) => void }> = ({ user, onClose, onSave, onDelete, onToggleStatus }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {form.firstName[0]}{form.lastName[0]}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{form.firstName} {form.lastName}</h3>
              <StatusBadge status={form.role} />
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">First Name</label>
                  <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Last Name</label>
                  <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Email</label>
                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500 bg-white">
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Location</label>
                <input value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
              </div>
              {form.role === 'recruiter' && (
                <div>
                  <label className="text-xs font-semibold text-gray-700">Company</label>
                  <input value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Email', value: form.email },
                { label: 'Role', value: form.role },
                { label: 'Location', value: form.location || '—' },
                { label: 'Status', value: form.status },
                { label: 'Verified', value: form.verified ? 'Yes ✓' : 'No ✗' },
                ...(form.role === 'recruiter' ? [{ label: 'Company', value: form.company || '—' }] : []),
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-500 font-medium">{item.label}</span>
                  <span className="text-gray-900 font-semibold capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex flex-wrap gap-2">
          {editing ? (
            <>
              <button onClick={() => { onSave(form); setEditing(false); }} className="cursor-pointer flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
              <button onClick={() => setEditing(false)} className="cursor-pointer flex items-center gap-2 text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg transition">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="cursor-pointer flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button onClick={() => onToggleStatus(form)} className={`cursor-pointer flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition ${form.status === 'active' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}>
                {form.status === 'active' ? <><Ban className="w-3.5 h-3.5" /> Suspend</> : <><Unlock className="w-3.5 h-3.5" /> Reactivate</>}
              </button>
              <button onClick={() => { if (window.confirm(`Permanently delete ${form.firstName} ${form.lastName}? This cannot be undone.`)) { onDelete(form.id); onClose(); } }} className="cursor-pointer flex items-center gap-2 text-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold px-4 py-2 rounded-lg transition">
                <Trash2 className="w-3.5 h-3.5" /> Delete User
              </button>
              <button onClick={() => window.open(`mailto:${form.email}`)} className="cursor-pointer flex items-center gap-2 text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 font-semibold px-4 py-2 rounded-lg transition">
                <Mail className="w-3.5 h-3.5" /> Send Email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ADMIN PAGES ─────────────────────────────────────────────────────────
export const AdminPages: React.FC<{ subView: string }> = ({ subView }) => {
  const { user, jobs, applications, logs, navigate, refreshStates, showToast } = useApp();
  const { navigate: appNavigate } = useApp();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const activeTab = subView || 'overview';
  const setActiveTab = (tab: string) => {
    const viewMap: Record<string, string> = {
      'overview': 'admin-dashboard',
      'users': 'admin-users',
      'jobs': 'admin-jobs',
      'applications': 'admin-applications',
      'finance': 'admin-finance',
      'cms': 'admin-cms',
      'settings': 'admin-settings',
    };
    appNavigate(viewMap[tab] as any || 'admin-dashboard');
  };

  const defaultCMS = {
    heroTitle: "Let AI Screen Your Candidates 24/7",
    heroSubtitle: "Australia's #1 AI Recruitment Platform",
    heroDescription: "QANI's AI recruiter interviews every candidate automatically — evaluating skills, salary fit, work rights, and location match.",
    announcementBar: "Australia's AI Recruitment Platform — Screen 10x more candidates with zero extra headcount.",
    pricingStarterPrice: '$0',
    pricingProPrice: '$299',
    pricingEnterprisePrice: '$999',
    metaTitle: 'QANI — AI Recruitment Platform · Australia',
    metaDescription: 'AI-powered recruitment screening for Australian companies.',
    contactEmail: 'hello@qani.io',
    linkedinUrl: 'https://linkedin.com/company/qani',
    footerTagline: "Australia's leading AI recruitment platform.",
  };
  const [cmsContent, setCmsContent] = useState(() => {
    try {
      const saved = localStorage.getItem('qani_cms_content');
      return saved ? JSON.parse(saved) : defaultCMS;
    } catch { return defaultCMS; }
  });

  const saveCMS = () => {
    localStorage.setItem('qani_cms_content', JSON.stringify(cmsContent));
    showToast('Content saved successfully! Changes will reflect on next deploy.', 'success');
  };

  const [demoUsers, setDemoUsers] = useState([
    { id: 'u1', firstName: 'Steve', lastName: 'Begg', email: 'admin@qani.io', role: 'admin', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u2', firstName: 'Sarah', lastName: 'Chen', email: 'recruiter@qani.io', role: 'recruiter', location: 'Sydney, NSW', status: 'active', verified: true, company: 'Atlassian' },
    { id: 'u3', firstName: 'James', lastName: 'Morrison', email: 'james.hr@techcorp.au', role: 'recruiter', location: 'Melbourne, VIC', status: 'active', verified: true, company: 'Canva' },
    { id: 'u4', firstName: 'Emma', lastName: 'Thompson', email: 'emma.hr@seek.com.au', role: 'recruiter', location: 'Brisbane, QLD', status: 'active', verified: true, company: 'Seek' },
    { id: 'u5', firstName: 'Michael', lastName: 'Zhang', email: 'michael.hr@rea.com.au', role: 'recruiter', location: 'Melbourne, VIC', status: 'active', verified: true, company: 'REA Group' },
    { id: 'u6', firstName: 'Liam', lastName: 'Nguyen', email: 'candidate@qani.io', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u7', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@gmail.com', role: 'candidate', location: 'Melbourne, VIC', status: 'active', verified: true },
    { id: 'u8', firstName: 'Tom', lastName: 'Williams', email: 'tom.williams@gmail.com', role: 'candidate', location: 'Brisbane, QLD', status: 'active', verified: true },
    { id: 'u9', firstName: 'Jessica', lastName: 'Lee', email: 'jessica.lee@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u10', firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@gmail.com', role: 'candidate', location: 'Melbourne, VIC', status: 'active', verified: true },
    { id: 'u11', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@gmail.com', role: 'candidate', location: 'Perth, WA', status: 'active', verified: true },
    { id: 'u12', firstName: 'Natalie', lastName: 'Kim', email: 'natalie.kim@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: false },
    { id: 'u13', firstName: 'David', lastName: 'Patel', email: 'david.patel@gmail.com', role: 'candidate', location: 'Melbourne, VIC', status: 'active', verified: true },
    { id: 'u14', firstName: 'Ethan', lastName: 'Brown', email: 'ethan.brown@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u15', firstName: 'Ava', lastName: 'Thomas', email: 'ava.thomas@gmail.com', role: 'candidate', location: 'Melbourne, VIC', status: 'active', verified: true },
    { id: 'u16', firstName: 'Noah', lastName: 'Anderson', email: 'noah.anderson@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'suspended', verified: true },
    { id: 'u17', firstName: 'Grace', lastName: 'White', email: 'grace.white@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u18', firstName: 'Oliver', lastName: 'Harris', email: 'oliver.harris@gmail.com', role: 'candidate', location: 'Melbourne, VIC', status: 'active', verified: true },
    { id: 'u19', firstName: 'Emily', lastName: 'Clark', email: 'emily.clark@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u20', firstName: 'Henry', lastName: 'Robinson', email: 'henry.robinson@gmail.com', role: 'candidate', location: 'Perth, WA', status: 'active', verified: true },
    { id: 'u21', firstName: 'Charlotte', lastName: 'Lewis', email: 'charlotte.lewis@gmail.com', role: 'candidate', location: 'Adelaide, SA', status: 'active', verified: true },
    { id: 'u22', firstName: 'Jack', lastName: 'Walker', email: 'jack.walker@gmail.com', role: 'candidate', location: 'Sydney, NSW', status: 'active', verified: true },
    { id: 'u23', firstName: 'Amelia', lastName: 'Hall', email: 'amelia.hall@gmail.com', role: 'candidate', location: 'Melbourne, VIC', status: 'active', verified: true },
    { id: 'u24', firstName: 'Lucas', lastName: 'Jackson', email: 'lucas.jackson@gmail.com', role: 'candidate', location: 'Brisbane, QLD', status: 'active', verified: true },
    { id: 'u25', firstName: 'William', lastName: 'Young', email: 'william.young@gmail.com', role: 'candidate', location: 'Brisbane, QLD', status: 'active', verified: true },
  ]);

  const demoApps = [
    { id: 'a1', candidate: 'Liam Nguyen', email: 'candidate@qani.io', job: 'Senior Full Stack Developer', score: 92, status: 'qualified', date: '2026-05-16' },
    { id: 'a2', candidate: 'Priya Sharma', email: 'priya.sharma@gmail.com', job: 'Product Manager — Platform', score: 89, status: 'qualified', date: '2026-05-19' },
    { id: 'a3', candidate: 'Tom Williams', email: 'tom.williams@gmail.com', job: 'DevOps / Platform Engineer', score: 94, status: 'qualified', date: '2026-05-21' },
    { id: 'a4', candidate: 'Jessica Lee', email: 'jessica.lee@gmail.com', job: 'UX/UI Product Designer', score: 78, status: 'review', date: '2026-05-23' },
    { id: 'a5', candidate: 'Marcus Vance', email: 'marcus.vance@gmail.com', job: 'Data Scientist — AI/ML', score: 91, status: 'qualified', date: '2026-05-25' },
    { id: 'a6', candidate: 'Sophie Martin', email: 'sophie.martin@gmail.com', job: 'Backend Engineer — Go', score: 88, status: 'qualified', date: '2026-05-27' },
    { id: 'a7', candidate: 'Noah Anderson', email: 'noah.anderson@gmail.com', job: 'QA Automation Engineer', score: 87, status: 'qualified', date: '2026-05-28' },
    { id: 'a8', candidate: 'Natalie Kim', email: 'natalie.kim@gmail.com', job: 'Cybersecurity Analyst', score: 93, status: 'qualified', date: '2026-05-29' },
    { id: 'a9', candidate: 'Ava Thomas', email: 'ava.thomas@gmail.com', job: 'ML Engineer — LLM Systems', score: 82, status: 'review', date: '2026-05-30' },
    { id: 'a10', candidate: 'David Patel', email: 'david.patel@gmail.com', job: 'Senior Full Stack Developer', score: 76, status: 'review', date: '2026-05-17' },
    { id: 'a11', candidate: 'James Wilson', email: 'james.wilson@gmail.com', job: 'Product Manager — Platform', score: 45, status: 'rejected', date: '2026-05-20' },
    { id: 'a12', candidate: 'Ethan Brown', email: 'ethan.brown@gmail.com', job: 'DevOps / Platform Engineer', score: 96, status: 'qualified', date: '2026-05-22' },
    { id: 'a13', candidate: 'Grace White', email: 'grace.white@gmail.com', job: 'Data Scientist — AI/ML', score: undefined, status: 'screening', date: '2026-05-26' },
    { id: 'a14', candidate: 'Emily Clark', email: 'emily.clark@gmail.com', job: 'UX/UI Product Designer', score: undefined, status: 'applied', date: '2026-05-31' },
    { id: 'a15', candidate: 'Amelia Hall', email: 'amelia.hall@gmail.com', job: 'Growth Engineer', score: undefined, status: 'applied', date: '2026-05-31' },
  ];

  const [demoJobs, setDemoJobs] = useState([
    { id: 'job-1', title: 'Senior Full Stack Developer', company: 'Atlassian', location: 'Sydney, NSW', salary: '$130k–$160k', status: 'open', posted: '2026-05-15', apps: 8 },
    { id: 'job-2', title: 'Product Manager — Platform', company: 'Canva', location: 'Melbourne, VIC', salary: '$120k–$150k', status: 'open', posted: '2026-05-18', apps: 5 },
    { id: 'job-3', title: 'DevOps / Platform Engineer', company: 'Seek', location: 'Remote (AU)', salary: '$120k–$145k', status: 'open', posted: '2026-05-20', apps: 6 },
    { id: 'job-4', title: 'UX/UI Product Designer', company: 'REA Group', location: 'Sydney, NSW', salary: '$95k–$125k', status: 'open', posted: '2026-05-22', apps: 4 },
    { id: 'job-5', title: 'Data Scientist — AI/ML', company: 'Afterpay', location: 'Melbourne, VIC', salary: '$130k–$165k', status: 'open', posted: '2026-05-24', apps: 3 },
    { id: 'job-6', title: 'Backend Engineer — Go', company: 'Atlassian', location: 'Brisbane, QLD', salary: '$120k–$150k', status: 'open', posted: '2026-05-26', apps: 2 },
    { id: 'job-7', title: 'QA Automation Engineer', company: 'Canva', location: 'Remote (AU)', salary: '$90k–$110k', status: 'open', posted: '2026-05-28', apps: 3 },
    { id: 'job-8', title: 'Cybersecurity Analyst', company: 'Commonwealth Bank', location: 'Sydney, NSW', salary: '$110k–$140k', status: 'open', posted: '2026-05-29', apps: 4 },
    { id: 'job-9', title: 'ML Engineer — LLM Systems', company: 'Canva', location: 'Sydney, NSW', salary: '$150k–$190k', status: 'open', posted: '2026-05-30', apps: 2 },
    { id: 'job-10', title: 'Growth Engineer', company: 'Seek', location: 'Melbourne, VIC', salary: '$110k–$135k', status: 'draft', posted: '2026-05-31', apps: 0 },
  ]);

  const finances = {
    transactions: [
      { id: 't1', user: 'Atlassian', plan: 'Enterprise', amount: '$999', date: '2026-05-01', status: 'paid' },
      { id: 't2', user: 'Canva', plan: 'Professional', amount: '$299', date: '2026-05-01', status: 'paid' },
      { id: 't3', user: 'Seek', plan: 'Professional', amount: '$299', date: '2026-05-03', status: 'paid' },
      { id: 't4', user: 'REA Group', plan: 'Enterprise', amount: '$999', date: '2026-05-05', status: 'paid' },
      { id: 't5', user: 'Afterpay', plan: 'Professional', amount: '$299', date: '2026-05-07', status: 'paid' },
      { id: 't6', user: 'TechStartup AU', plan: 'Starter', amount: '$0', date: '2026-05-10', status: 'trial' },
      { id: 't7', user: 'HireNow Agency', plan: 'Professional', amount: '$299', date: '2026-05-12', status: 'paid' },
      { id: 't8', user: 'BuildCorp', plan: 'Enterprise', amount: '$999', date: '2026-05-15', status: 'failed' },
    ]
  };

  useEffect(() => { refreshStates(); }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <p className="text-red-600 font-bold text-lg">Access Denied</p>
        <p className="text-sm text-gray-500">Admin credentials required.</p>
        <button onClick={() => navigate('landing')} className="cursor-pointer text-sm text-blue-600 hover:underline">Return to homepage</button>
      </div>
    );
  }

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'cms', label: 'Content (CMS)', icon: PenTool },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSaveUser = (updated: any) => {
    setDemoUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    showToast(`${updated.firstName}'s profile updated.`, 'success');
  };

  const handleDeleteUser = (id: string) => {
    setDemoUsers(prev => prev.filter(u => u.id !== id));
    showToast('User permanently deleted.', 'warning');
  };

  const handleToggleStatus = (u: any) => {
    const newStatus = u.status === 'active' ? 'suspended' : 'active';
    setDemoUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: newStatus } : x));
    setSelectedUser((prev: any) => prev ? { ...prev, status: newStatus } : null);
    showToast(`${u.firstName} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}.`, newStatus === 'suspended' ? 'warning' : 'success');
  };

  const handleToggleJobStatus = (id: string) => {
    setDemoJobs(prev => prev.map(j => j.id === id ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } : j));
    showToast('Job status updated.', 'success');
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Delete this job posting? This cannot be undone.')) {
      setDemoJobs(prev => prev.filter(j => j.id !== id));
      showToast('Job deleted.', 'warning');
    }
  };

  const filteredUsers = demoUsers
    .filter(u => filterRole === 'all' || u.role === filterRole)
    .filter(u => !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* User detail modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Admin top nav */}
      <div className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest mr-3 shrink-0">SUPER ADMIN</span>
        {navTabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition shrink-0 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
              <p className="text-xs text-gray-500 mt-1">Real-time metrics — logged in as Steve Begg (Super Admin)</p>
            </div>

            {/* AI Status Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">QANI AI Recruiter — Active</p>
                  <p className="text-xs text-blue-100">Screening candidates 24/7 · Powered by OpenAI GPT-4o · 47 sessions completed this month</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-400/20 border border-green-400/30 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-200">ONLINE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={25} icon={<Users className="w-5 h-5 text-blue-600" />} color="bg-blue-50" sub="+8 this month" />
              <StatCard label="Active Jobs" value={9} icon={<Briefcase className="w-5 h-5 text-green-600" />} color="bg-green-50" sub="1 draft pending" />
              <StatCard label="Applications" value={15} icon={<FileText className="w-5 h-5 text-purple-600" />} color="bg-purple-50" sub="3 need review" />
              <StatCard label="Monthly Revenue" value="$47,200" icon={<DollarSign className="w-5 h-5 text-orange-600" />} color="bg-orange-50" sub="+12% vs last month" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { event: 'AI Screening Completed', detail: 'Liam Nguyen — Score 92/100 — Qualified', type: 'success', time: '10:28' },
                    { event: 'New Job Posted', detail: 'Senior Full Stack Developer — Atlassian', type: 'info', time: '09:00' },
                    { event: 'Application Rejected', detail: 'James Wilson — Score below threshold', type: 'warning', time: '08:45' },
                    { event: 'New User Registered', detail: 'Priya Sharma — Candidate', type: 'success', time: '08:30' },
                    { event: 'AI Screening Completed', detail: 'Tom Williams — Score 94/100 — Qualified', type: 'success', time: '08:15' },
                    { event: 'Payment Received', detail: 'Atlassian — Enterprise Plan — $999', type: 'success', time: '07:00' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${l.type === 'success' ? 'bg-green-500' : l.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{l.event}</p>
                        <p className="text-gray-500">{l.detail}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{l.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Manage Users', icon: Users, action: () => setActiveTab('users'), color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                    { label: 'Post New Job', icon: Plus, action: () => navigate('recruiter-create-job'), color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                    { label: 'View Finance', icon: DollarSign, action: () => setActiveTab('finance'), color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                    { label: 'Edit Content', icon: PenTool, action: () => setActiveTab('cms'), color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                    { label: 'Applications', icon: FileText, action: () => setActiveTab('applications'), color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                    { label: 'Settings', icon: Settings, action: () => setActiveTab('settings'), color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
                  ].map(a => (
                    <button key={a.label} onClick={a.action} className={`cursor-pointer flex items-center gap-2 p-3 rounded-lg text-xs font-semibold transition ${a.color}`}>
                      <a.icon className="w-4 h-4" />{a.label}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 mb-2">Demo Login Credentials</h4>
                  <div className="space-y-1 font-mono text-[10px] bg-gray-50 rounded-lg p-3 border">
                    <p><span className="text-red-600 font-bold">ADMIN:</span> admin@qani.io / Admin@QANI2026!</p>
                    <p><span className="text-purple-600 font-bold">RECRUITER:</span> recruiter@qani.io / Recruit@QANI2026!</p>
                    <p><span className="text-blue-600 font-bold">CANDIDATE:</span> candidate@qani.io / Candi@QANI2026!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <p className="text-xs text-gray-500 mt-1">{demoUsers.length} total · {demoUsers.filter(u=>u.role==='candidate').length} candidates · {demoUsers.filter(u=>u.role==='recruiter').length} recruiters · click any row to view/edit</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full h-9 pl-8 pr-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500" />
              </div>
              {['all', 'candidate', 'recruiter', 'admin'].map(r => (
                <button key={r} onClick={() => setFilterRole(r)} className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${filterRole === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
                </button>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedUser(u)}>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                              {u.firstName[0]}{u.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                              <p className="text-[10px] text-gray-400">{u.verified ? '✓ Verified' : '⚠ Unverified'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-600">{u.email}</td>
                        <td className="p-4"><StatusBadge status={u.role} /></td>
                        <td className="p-4 text-gray-500">{u.location}</td>
                        <td className="p-4"><StatusBadge status={u.status} /></td>
                        <td className="p-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setSelectedUser(u)} className="cursor-pointer p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View & Edit">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleToggleStatus(u)} className={`cursor-pointer p-1.5 rounded-lg transition ${u.status === 'active' ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`} title={u.status === 'active' ? 'Suspend' : 'Reactivate'}>
                              {u.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => window.open(`mailto:${u.email}`)} className="cursor-pointer p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Email">
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            {u.id !== 'u1' && (
                              <button onClick={() => { if (window.confirm(`Delete ${u.firstName}?`)) handleDeleteUser(u.id); }} className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── JOBS ── */}
        {activeTab === 'jobs' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Job Management</h2>
                <p className="text-xs text-gray-500 mt-1">{demoJobs.filter(j=>j.status==='open').length} active · {demoJobs.filter(j=>j.status==='draft').length} draft</p>
              </div>
              <button onClick={() => navigate('recruiter-create-job')} className="cursor-pointer flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                <Plus className="w-3.5 h-3.5" /> Post New Job
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                      <th className="p-4">Job Title</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4">Apps</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {demoJobs.map(j => (
                      <tr key={j.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-semibold text-gray-900">{j.title}</td>
                        <td className="p-4 text-gray-600">{j.company}</td>
                        <td className="p-4 text-gray-600">{j.location}</td>
                        <td className="p-4 font-medium text-gray-700">{j.salary}</td>
                        <td className="p-4 text-gray-600">{j.apps}</td>
                        <td className="p-4"><StatusBadge status={j.status} /></td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => { navigate('recruiter-create-job', { editJobId: j.id }); }} className="cursor-pointer p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleToggleJobStatus(j.id)} className="cursor-pointer p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition" title="Toggle Status">
                              {j.status === 'open' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => handleDeleteJob(j.id)} className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {activeTab === 'applications' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Applications</h2>
              <p className="text-xs text-gray-500 mt-1">Every candidate application and AI screening result</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Total', value: 15, color: 'bg-gray-50 border-gray-200' },
                { label: 'Qualified', value: 9, color: 'bg-green-50 border-green-200' },
                { label: 'Review', value: 3, color: 'bg-orange-50 border-orange-200' },
                { label: 'Screening', value: 1, color: 'bg-blue-50 border-blue-200' },
                { label: 'Rejected', value: 2, color: 'bg-red-50 border-red-200' },
              ].map(s => (
                <div key={s.label} className={`p-3 rounded-xl border text-center ${s.color}`}>
                  <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Job</th>
                      <th className="p-4">AI Score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {demoApps.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-semibold text-gray-900">{a.candidate}</td>
                        <td className="p-4 font-mono text-gray-500 text-[10px]">{a.email}</td>
                        <td className="p-4 text-gray-600">{a.job}</td>
                        <td className="p-4">
                          {a.score !== undefined ? (
                            <span className={`font-bold ${a.score >= 85 ? 'text-green-600' : a.score >= 70 ? 'text-orange-500' : 'text-red-500'}`}>{a.score}/100</span>
                          ) : <span className="text-gray-400">Pending</span>}
                        </td>
                        <td className="p-4"><StatusBadge status={a.status} /></td>
                        <td className="p-4 text-gray-500">{a.date}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => showToast(`Viewing ${a.candidate}'s application`, 'info')} className="cursor-pointer p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => window.open(`mailto:${a.email}`)} className="cursor-pointer p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Email Candidate">
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { if (window.confirm(`Delete ${a.candidate}'s application?`)) showToast('Application deleted.', 'warning'); }} className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── FINANCE ── */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Financial Dashboard</h2>
              <p className="text-xs text-gray-500 mt-1">Revenue, subscriptions, and billing management</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Monthly Recurring Revenue" value="$47,200" icon={<TrendingUp className="w-5 h-5 text-green-600" />} color="bg-green-50" sub="+12% vs last month" />
              <StatCard label="Annual Recurring Revenue" value="$566,400" icon={<DollarSign className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
              <StatCard label="Active Subscriptions" value={47} icon={<Package className="w-5 h-5 text-purple-600" />} color="bg-purple-50" sub="12 on free trial" />
              <StatCard label="Avg Revenue Per User" value="$1,004" icon={<CreditCard className="w-5 h-5 text-orange-600" />} color="bg-orange-50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { plan: 'Starter (Free)', users: 18, revenue: '$0/mo', color: 'bg-gray-50 border-gray-200' },
                { plan: 'Professional ($299/mo)', users: 24, revenue: '$7,176/mo', color: 'bg-blue-50 border-blue-200' },
                { plan: 'Enterprise ($999/mo)', users: 5, revenue: '$4,995/mo', color: 'bg-purple-50 border-purple-200' },
              ].map(p => (
                <div key={p.plan} className={`p-4 rounded-xl border ${p.color}`}>
                  <p className="text-xs font-bold text-gray-900">{p.plan}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-2">{p.users}</p>
                  <p className="text-[10px] text-gray-500">active accounts</p>
                  <p className="text-sm font-bold text-green-600 mt-1">{p.revenue}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Recent Transactions</h3>
                <button onClick={() => showToast('Exporting CSV...', 'info')} className="cursor-pointer flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase">
                      <th className="p-4">Company</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {finances.transactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-semibold text-gray-900">{t.user}</td>
                        <td className="p-4 text-gray-600">{t.plan}</td>
                        <td className="p-4 font-bold text-gray-900">{t.amount}</td>
                        <td className="p-4 text-gray-500">{t.date}</td>
                        <td className="p-4"><StatusBadge status={t.status} /></td>
                        <td className="p-4 text-right">
                          <button onClick={() => showToast(`Invoice sent to ${t.user}`, 'success')} className="cursor-pointer text-[10px] text-blue-600 hover:underline font-semibold">
                            Send Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CMS ── */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Content Management</h2>
              <p className="text-xs text-gray-500 mt-1">Edit website content without touching code. Changes saved to localStorage and applied on next deploy.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 flex items-start gap-2">
              <Zap className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Click <strong>Edit</strong> on any field to change it. Click <strong>Save All Changes</strong> at the bottom to apply everything.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Layout className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">Hero Section</h3>
                </div>
                <RichTextEditor label="Hero Badge Text" value={cmsContent.heroSubtitle} onChange={v => setCmsContent((p: any) => ({ ...p, heroSubtitle: v }))} />
                <RichTextEditor label="Hero Main Title" value={cmsContent.heroTitle} onChange={v => setCmsContent((p: any) => ({ ...p, heroTitle: v }))} />
                <RichTextEditor label="Hero Description" value={cmsContent.heroDescription} onChange={v => setCmsContent((p: any) => ({ ...p, heroDescription: v }))} />
                <RichTextEditor label="Announcement Bar" value={cmsContent.announcementBar} onChange={v => setCmsContent((p: any) => ({ ...p, announcementBar: v }))} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-bold text-gray-900">Pricing</h3>
                </div>
                <RichTextEditor label="Starter Plan Price" value={cmsContent.pricingStarterPrice} onChange={v => setCmsContent((p: any) => ({ ...p, pricingStarterPrice: v }))} />
                <RichTextEditor label="Professional Plan Price" value={cmsContent.pricingProPrice} onChange={v => setCmsContent((p: any) => ({ ...p, pricingProPrice: v }))} />
                <RichTextEditor label="Enterprise Plan Price" value={cmsContent.pricingEnterprisePrice} onChange={v => setCmsContent((p: any) => ({ ...p, pricingEnterprisePrice: v }))} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-gray-900">SEO & Metadata</h3>
                </div>
                <RichTextEditor label="Page Title" value={cmsContent.metaTitle} onChange={v => setCmsContent((p: any) => ({ ...p, metaTitle: v }))} />
                <RichTextEditor label="Meta Description" value={cmsContent.metaDescription} onChange={v => setCmsContent((p: any) => ({ ...p, metaDescription: v }))} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-bold text-gray-900">Contact & Social</h3>
                </div>
                <RichTextEditor label="Contact Email" value={cmsContent.contactEmail} onChange={v => setCmsContent((p: any) => ({ ...p, contactEmail: v }))} />
                <RichTextEditor label="LinkedIn URL" value={cmsContent.linkedinUrl} onChange={v => setCmsContent((p: any) => ({ ...p, linkedinUrl: v }))} />
                <RichTextEditor label="Footer Tagline" value={cmsContent.footerTagline} onChange={v => setCmsContent((p: any) => ({ ...p, footerTagline: v }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={saveCMS} className="cursor-pointer flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-md">
                <Save className="w-4 h-4" /> Save All Changes
              </button>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
              <p className="text-xs text-gray-500 mt-1">Security, notifications, AI configuration</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600" /> Security</h3>
                {[
                  { label: 'Require email verification for new accounts', on: true },
                  { label: 'Two-factor authentication for admins', on: true },
                  { label: 'Rate limiting on API endpoints', on: true },
                  { label: 'Auto-lockout after 5 failed logins', on: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-700">{s.label}</span>
                    <button onClick={() => showToast('Setting updated', 'success')} className={`cursor-pointer w-10 h-5 rounded-full transition relative ${s.on ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.on ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4 text-orange-600" /> Notifications</h3>
                {[
                  { label: 'Email alerts for new applications', on: true },
                  { label: 'Email alerts when AI screening completes', on: true },
                  { label: 'Weekly digest to recruiters', on: false },
                  { label: 'Candidate status update notifications', on: true },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-700">{s.label}</span>
                    <button onClick={() => showToast('Setting updated', 'success')} className={`cursor-pointer w-10 h-5 rounded-full transition relative ${s.on ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.on ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Bot className="w-4 h-4 text-green-600" /> AI Recruiter Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">AI Model</label>
                    <select className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500 bg-white">
                      <option>gpt-4o (Recommended)</option>
                      <option>gpt-4o-mini</option>
                      <option>gpt-4-turbo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Auto-qualify threshold (%)</label>
                    <input type="number" defaultValue={80} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Auto-reject threshold (%)</label>
                    <input type="number" defaultValue={50} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Max questions per screening</label>
                    <input type="number" defaultValue={4} className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Globe className="w-4 h-4 text-purple-600" /> Platform Info</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Platform Name</label>
                    <input type="text" defaultValue="QANI Platform" className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Support Email</label>
                    <input type="email" defaultValue="support@qani.io" className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Region</label>
                    <select className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500 bg-white">
                      <option>Australia (ap-southeast-2)</option>
                      <option>Singapore (ap-southeast-1)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => showToast('Settings saved!', 'success')} className="cursor-pointer flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-md">
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
