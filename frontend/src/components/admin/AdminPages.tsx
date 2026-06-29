import { AdminCMS } from './AdminCMS';
import { AdminCredits } from './AdminCredits';
import { AdminPricingCMS } from './AdminPricingCMS';
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
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
    <div className="cursor-pointer fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="cursor-pointer bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
                ...(form.flaggedReason ? [{ label: 'Flagged Reason', value: form.flaggedReason.replace(/_/g, ' ') }] : []),
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
// ─── ADMIN SETTINGS COMPONENT ────────────────────────────────────────────────
const AdminSettings: React.FC<{ showToast: (msg: string, type: string) => void }> = ({ showToast }) => {
  const token = localStorage.getItem('qani_auth_token');
  const hdrs = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const [sSettings, setSSettings] = useState<any>({});
  const [sLoading, setSLoading] = useState(true);
  const [sHealth, setSHealth] = useState<any>(null);
  const [testSmsPhone, setTestSmsPhone] = useState('');
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [backupStatus, setBackupStatus] = useState<any>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [sslInfo, setSslInfo] = useState<any>(null);

  useEffect(() => {
    fetch('https://qani.io/api/v1/admin/settings', { headers: hdrs }).then(r => r.json()).then(setSSettings).finally(() => setSLoading(false));
    fetch('https://qani.io/api/v1/admin/health', { headers: hdrs }).then(r => r.json()).then(setSHealth);
    fetch('https://qani.io/api/v1/admin/backup/status', { headers: hdrs }).then(r => r.json()).then(setBackupStatus);
    fetch('https://qani.io/api/v1/admin/ssl/status', { headers: hdrs }).then(r => r.json()).then(setSslInfo);
  }, []);

  const saveSettings = async () => {
    const r = await fetch('https://qani.io/api/v1/admin/settings', { method: 'POST', headers: hdrs, body: JSON.stringify(sSettings) });
    const d = await r.json();
    if (d.success) showToast('Settings saved successfully', 'success');
    else showToast('Failed to save settings', 'error');
  };

  const testEmail = async () => {
    const r = await fetch('https://qani.io/api/v1/admin/settings/test-email', { method: 'POST', headers: hdrs, body: JSON.stringify({ recipient: testEmailRecipient || '' }) });
    const d = await r.json();
    if (d.success) showToast('Test email sent!', 'success');
    else showToast(d.error || 'Failed', 'error');
  };

  const testSms = async () => {
    const r = await fetch('https://qani.io/api/v1/admin/settings/test-sms', { method: 'POST', headers: hdrs, body: JSON.stringify({ phone: testSmsPhone }) });
    const d = await r.json();
    if (d.success) showToast('Test SMS sent!', 'success');
    else showToast(d.error || 'Failed', 'error');
  };

  const runBackup = async () => {
    setBackupLoading(true);
    const r = await fetch('https://qani.io/api/v1/admin/backup', { method: 'POST', headers: hdrs });
    const d = await r.json();
    if (d.success) { showToast('Backup completed!', 'success'); fetch('https://qani.io/api/v1/admin/backup/status', { headers: hdrs }).then(r => r.json()).then(setBackupStatus); }
    else showToast(d.error || 'Backup failed', 'error');
    setBackupLoading(false);
  };

  // Field defined as stable ref to avoid re-render focus loss
  const fieldClass = "w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  if (sLoading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Super Admin Settings</h2>
        <p className="text-xs text-gray-500 mt-1">Manage API keys, services, feature flags and platform health</p>
      </div>

      {/* Platform Health */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Activity className="w-4 h-4 text-green-600" /> Platform Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'API Status', value: sHealth?.api || 'checking...', ok: sHealth?.api === 'online' },
            { label: 'Database', value: sHealth?.database || 'checking...', ok: sHealth?.database === 'connected' },
            { label: 'Environment', value: sHealth?.environment || '—', ok: true },
            { label: 'Uptime', value: sHealth?.uptime ? `${Math.floor(sHealth.uptime/3600)}h ${Math.floor((sHealth.uptime%3600)/60)}m` : '—', ok: true },
          ].map(h => (
            <div key={h.label} className={`p-3 rounded-xl border text-center ${h.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm font-bold capitalize ${h.ok ? 'text-green-700' : 'text-red-700'}`}>{h.value}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">{h.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SendGrid */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> Email — SendGrid</h3>
          <div>
              <label className="text-xs font-semibold text-gray-700">From Email</label>
              <input type="text" value={sSettings['sendgridFromEmail'] || ''} placeholder="noreply@qani.io"
                onChange={e => setSSettings((p: any) => ({...p, sendgridFromEmail: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
              <label className="text-xs font-semibold text-gray-700">From Name</label>
              <input type="text" value={sSettings['sendgridFromName'] || ''} placeholder="QANI AI Recruitment"
                onChange={e => setSSettings((p: any) => ({...p, sendgridFromName: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
              <label className="text-xs font-semibold text-gray-700">SendGrid API Key</label>
              <input type="password" value={sSettings['sendgridApiKey'] || ''} placeholder={sSettings.sendgridApiKey === '***configured***' ? '***configured***' : 'SG.xxxx...'}
                onChange={e => setSSettings((p: any) => ({...p, sendgridApiKey: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Test Email Recipient</label>
            <div className="flex gap-2 mt-1">
              <input type="email" value={testEmailRecipient} onChange={e => setTestEmailRecipient(e.target.value)} placeholder="hello@qani.io"
                className="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
              <button onClick={testEmail} className="cursor-pointer px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Send Test
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Leave empty to send to configured from email</p>
          </div>
        </div>

        {/* Stripe */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><DollarSign className="w-4 h-4 text-purple-600" /> Payments — Stripe</h3>
          <div>
              <label className="text-xs font-semibold text-gray-700">Secret Key</label>
              <input type="password" value={sSettings['stripeSecretKey'] || ''} placeholder={sSettings.stripeSecretKey === '***configured***' ? '***configured***' : 'sk_test_...'}
                onChange={e => setSSettings((p: any) => ({...p, stripeSecretKey: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
              <label className="text-xs font-semibold text-gray-700">Webhook Secret</label>
              <input type="password" value={sSettings['stripeWebhookSecret'] || ''} placeholder={sSettings.stripeWebhookSecret === '***configured***' ? '***configured***' : 'whsec_...'}
                onChange={e => setSSettings((p: any) => ({...p, stripeWebhookSecret: e.target.value}))}
                className={fieldClass} />
            </div>
          <p className="text-[10px] text-gray-400">Get these from your Stripe Dashboard → Developers → API keys. Use test mode keys (sk_test_...) for sandbox testing.</p>
        </div>
        {/* Twilio */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4 text-orange-600" /> SMS — Twilio</h3>
          <div>
              <label className="text-xs font-semibold text-gray-700">Account SID</label>
              <input type="text" value={sSettings['twilioAccountSid'] || ''} placeholder="ACxxxx..."
                onChange={e => setSSettings((p: any) => ({...p, twilioAccountSid: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
              <label className="text-xs font-semibold text-gray-700">Auth Token</label>
              <input type="password" value={sSettings['twilioAuthToken'] || ''} placeholder={sSettings.twilioAuthToken === '***configured***' ? '***configured***' : 'Auth token...'}
                onChange={e => setSSettings((p: any) => ({...p, twilioAuthToken: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
              <label className="text-xs font-semibold text-gray-700">From Phone Number</label>
              <input type="text" value={sSettings['twilioPhoneNumber'] || ''} placeholder="+12182154146"
                onChange={e => setSSettings((p: any) => ({...p, twilioPhoneNumber: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Test Phone Number</label>
            <div className="flex gap-2 mt-1">
              <input type="text" value={testSmsPhone} onChange={e => setTestSmsPhone(e.target.value)} placeholder="+61412345678"
                className="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
              <button onClick={testSms} className="cursor-pointer px-3 py-1.5 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg transition">Send Test</button>
            </div>
          </div>
        </div>

        {/* OpenAI */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Bot className="w-4 h-4 text-green-600" /> AI — OpenAI</h3>
          <div>
              <label className="text-xs font-semibold text-gray-700">OpenAI API Key</label>
              <input type="password" value={sSettings['openaiApiKey'] || ''} placeholder={sSettings.openaiApiKey === '***configured***' ? '***configured***' : 'sk-...'}
                onChange={e => setSSettings((p: any) => ({...p, openaiApiKey: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">AI Model</label>
            <select value={sSettings.openaiModel || 'gpt-4o-mini'} onChange={e => setSSettings((p: any) => ({ ...p, openaiModel: e.target.value }))}
              className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500 bg-white">
              <option value="gpt-4o-mini">gpt-4o-mini (Default — Fast & Efficient)</option>
              <option value="gpt-4o">gpt-4o (Best Quality)</option>
              <option value="gpt-4-turbo">gpt-4-turbo (Legacy)</option>
            </select>
          </div>
        </div>

        {/* OTP + Feature Flags */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Shield className="w-4 h-4 text-purple-600" /> OTP & Feature Flags</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">OTP Expiry (minutes)</label>
              <input type="number" value={sSettings.otpExpiryMinutes || '10'} onChange={e => setSSettings((p: any) => ({ ...p, otpExpiryMinutes: e.target.value }))}
                className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">OTP Retry Limit</label>
              <input type="number" value={sSettings.otpRetryLimit || '3'} onChange={e => setSSettings((p: any) => ({ ...p, otpRetryLimit: e.target.value }))}
                className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-700">Feature Flags</p>
            {[
              { label: 'AI Screening Enabled', k: 'featureAiScreening' },
              { label: 'OTP Enforcement Enabled', k: 'featureOtpEnforcement' },
            ].map(f => (
              <div key={f.k} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-700">{f.label}</span>
                <button onClick={() => setSSettings((p: any) => ({ ...p, [f.k]: p[f.k] === 'false' ? 'true' : 'false' }))}
                  className={`cursor-pointer w-10 h-5 rounded-full transition relative ${sSettings[f.k] !== 'false' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${sSettings[f.k] !== 'false' ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Globe className="w-4 h-4 text-purple-600" /> Platform Info</h3>
          <div>
              <label className="text-xs font-semibold text-gray-700">Platform Name</label>
              <input type="text" value={sSettings['platformName'] || ''} placeholder="QANI Platform"
                onChange={e => setSSettings((p: any) => ({...p, platformName: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
              <label className="text-xs font-semibold text-gray-700">Support Email</label>
              <input type="text" value={sSettings['supportEmail'] || ''} placeholder="support@qani.io"
                onChange={e => setSSettings((p: any) => ({...p, supportEmail: e.target.value}))}
                className={fieldClass} />
            </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Region</label>
            <select value={sSettings.region || 'ap-southeast-2'} onChange={e => setSSettings((p: any) => ({ ...p, region: e.target.value }))}
              className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500 bg-white">
              <option value="ap-southeast-2">Australia (ap-southeast-2)</option>
              <option value="ap-southeast-1">Singapore (ap-southeast-1)</option>
              <option value="us-east-1">US East (us-east-1)</option>
            </select>
          </div>
        </div>

        {/* Screening Thresholds */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Bot className="w-4 h-4 text-green-600" /> Screening Thresholds</h3>
          <div>
            <label className="text-xs font-semibold text-gray-700">Auto-Qualify Threshold (%)</label>
            <input type="number" min="1" max="100" value={sSettings.autoQualifyThreshold || '70'}
              onChange={e => setSSettings((p: any) => ({ ...p, autoQualifyThreshold: e.target.value }))}
              className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
            <p className="text-[10px] text-gray-400 mt-1">Candidates scoring above this are marked Qualified</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Auto-Reject Threshold (%)</label>
            <input type="number" min="1" max="100" value={sSettings.autoRejectThreshold || '45'}
              onChange={e => setSSettings((p: any) => ({ ...p, autoRejectThreshold: e.target.value }))}
              className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
            <p className="text-[10px] text-gray-400 mt-1">Candidates scoring below this are marked Rejected</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Max Screening Questions</label>
            <input type="number" min="1" max="20" value={sSettings.maxScreeningQuestions || '10'}
              onChange={e => setSSettings((p: any) => ({ ...p, maxScreeningQuestions: e.target.value }))}
              className="w-full mt-1 h-9 border border-gray-300 rounded-lg px-3 text-xs outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* DB Backup */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600" /> Database Backup</h3>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700">Last Backup</p>
            <p className="text-xs text-gray-500 mt-1">{backupStatus?.lastBackup || 'Loading...'}</p>
          </div>
          {backupStatus?.files?.slice(0,3).map((f: string, i: number) => (
            <p key={i} className="text-[10px] font-mono text-gray-400 truncate">{f}</p>
          ))}
          <button onClick={runBackup} disabled={backupLoading} className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition disabled:opacity-50">
            <Database className="w-3.5 h-3.5" /> {backupLoading ? 'Running backup...' : 'Run Manual Backup Now'}
          </button>
          <p className="text-[10px] text-gray-400">Auto backup runs daily at 2AM. 7-day retention.</p>
        </div>

        {/* SSL */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Shield className="w-4 h-4 text-green-600" /> SSL Certificate</h3>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-green-700">SSL Status: Active</p>
            <p className="text-[10px] text-green-600 mt-1 whitespace-pre-wrap">{sslInfo?.info || 'Loading...'}</p>
          </div>
          <p className="text-[10px] text-gray-400">Auto-renewal via certbot cron (daily 12PM). Let's Encrypt TLS 1.2+</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={saveSettings} className="cursor-pointer flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-md">
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-red-600 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Danger Zone</h3>
        <p className="text-xs text-gray-500">These actions are irreversible. Use with caution.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={async () => {
            if (!window.confirm('Clear all OTP records from DB? This will invalidate any pending OTPs.')) return;
            const r = await fetch('https://qani.io/api/v1/admin/danger/clear-otps', { method: 'POST', headers: hdrs });
            const d = await r.json();
            if (d.success) showToast(d.message, 'success'); else showToast(d.error || 'Failed', 'error');
          }} className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition">
            <Trash2 className="w-3.5 h-3.5" /> Clear All OTP Records
          </button>
          <button onClick={async () => {
            if (!window.confirm('Clear all completed screening sessions? Active sessions will not be affected.')) return;
            const r = await fetch('https://qani.io/api/v1/admin/danger/clear-sessions', { method: 'POST', headers: hdrs });
            const d = await r.json();
            if (d.success) showToast(d.message, 'success'); else showToast(d.error || 'Failed', 'error');
          }} className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition">
            <Trash2 className="w-3.5 h-3.5" /> Clear Completed Sessions
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminPages: React.FC<{ subView: string }> = ({ subView }) => {
  const { user, jobs, applications, logs, navigate, refreshStates, showToast } = useApp();
  const { navigate: appNavigate } = useApp();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [financeFilter, setFinanceFilter] = useState('all');
  const [financePage, setFinancePage] = useState(1);
  const financePerPage = 15;

  const activeTab = subView || 'overview';

  const [dashStats, setDashStats] = useState<any>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('qani_auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    fetch('https://qani.io/api/v1/dashboard/stats', { headers })
      .then(r => r.json()).then(setDashStats).catch(() => {});
    fetch('https://qani.io/api/v1/users', { headers })
      .then(r => r.json()).then((u: any[]) => setTotalUsers(u.length)).catch(() => {});
    fetch('https://qani.io/api/v1/notifications', { headers })
      .then(r => r.json()).then((n: any[]) => setRecentNotifications(n.slice(0, 6))).catch(() => {});
  }, []);
  const setActiveTab = (tab: string) => {
    const viewMap: Record<string, string> = {
      'overview': 'admin-dashboard',
      'users': 'admin-users',
      'jobs': 'admin-jobs',
      'applications': 'admin-applications',
      'finance': 'admin-finance',
      'cms': 'admin-cms',
      'settings': 'admin-settings',
      'credits': 'admin-credits',
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
  const [demoUsers, setDemoUsers] = useState<any[]>([]);
  useEffect(() => {
    api.getUsers().then((users: any[]) => {
      setDemoUsers(users.map(u => ({
        ...u,
        status: u.suspended ? 'suspended' : 'active',
      })));
    }).catch(() => setDemoUsers([]));
  }, []);

  const [demoApps, setDemoApps] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('qani_auth_token');
    fetch('https://qani.io/api/v1/applications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((apps: any[]) => {
        setDemoApps(apps.map(a => ({
          id: a.id,
          candidate: a.candidateName || 'Unknown',
          email: a.candidateEmail || '',
          job: a.jobTitle || 'Unknown Role',
          score: a.aiScore ?? undefined,
          status: a.status,
          date: a.appliedDate ? new Date(a.appliedDate).toISOString().split('T')[0] : new Date(a.appliedAt).toISOString().split('T')[0],
        })));
      }).catch(() => {});
  }, []);

  const [demoJobs, setDemoJobs] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('qani_auth_token');
    fetch('https://qani.io/api/v1/roles', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((jobList: any[]) => {
        setDemoJobs(jobList.map(j => ({
          id: j.id,
          title: j.title,
          company: j.company || 'Unknown',
          location: j.location,
          salary: j.salaryMin ? `$${Math.round(j.salaryMin/1000)}k–$${Math.round(j.salaryMax/1000)}k` : 'Not specified',
          status: j.status,
          posted: j.postedDate ? new Date(j.postedDate).toISOString().split('T')[0] : new Date(j.createdAt).toISOString().split('T')[0],
          apps: 0,
        })));
      }).catch(() => {});
  }, []);

  const allTransactions = [
    { id: 't1', user: 'Atlassian', email: 'billing@atlassian.com', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-05-01', status: 'paid', inv: 'INV-2026-001' },
    { id: 't2', user: 'Canva', email: 'billing@canva.com', plan: 'Professional', amount: '$299', raw: 299, date: '2026-05-01', status: 'paid', inv: 'INV-2026-002' },
    { id: 't3', user: 'Seek', email: 'billing@seek.com.au', plan: 'Professional', amount: '$299', raw: 299, date: '2026-05-03', status: 'paid', inv: 'INV-2026-003' },
    { id: 't4', user: 'REA Group', email: 'billing@rea.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-05-05', status: 'paid', inv: 'INV-2026-004' },
    { id: 't5', user: 'Afterpay', email: 'billing@afterpay.com', plan: 'Professional', amount: '$299', raw: 299, date: '2026-05-07', status: 'paid', inv: 'INV-2026-005' },
    { id: 't6', user: 'TechStartup AU', email: 'admin@techstartup.com.au', plan: 'Starter', amount: '$0', raw: 0, date: '2026-05-10', status: 'trial', inv: 'INV-2026-006' },
    { id: 't7', user: 'HireNow Agency', email: 'billing@hirenow.com.au', plan: 'Professional', amount: '$299', raw: 299, date: '2026-05-12', status: 'paid', inv: 'INV-2026-007' },
    { id: 't8', user: 'BuildCorp', email: 'accounts@buildcorp.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-05-15', status: 'failed', inv: 'INV-2026-008' },
    { id: 't9', user: 'TalentFirst', email: 'billing@talentfirst.com.au', plan: 'Professional', amount: '$299', raw: 299, date: '2026-05-15', status: 'paid', inv: 'INV-2026-009' },
    { id: 't10', user: 'Westpac HR', email: 'hr@westpac.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-05-16', status: 'paid', inv: 'INV-2026-010' },
    { id: 't11', user: 'NAB Talent', email: 'talent@nab.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-05-17', status: 'paid', inv: 'INV-2026-011' },
    { id: 't12', user: 'Xero', email: 'billing@xero.com', plan: 'Professional', amount: '$299', raw: 299, date: '2026-05-18', status: 'paid', inv: 'INV-2026-012' },
    { id: 't13', user: 'Atlassian', email: 'billing@atlassian.com', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-04-01', status: 'paid', inv: 'INV-2026-013' },
    { id: 't14', user: 'Canva', email: 'billing@canva.com', plan: 'Professional', amount: '$299', raw: 299, date: '2026-04-01', status: 'paid', inv: 'INV-2026-014' },
    { id: 't15', user: 'REA Group', email: 'billing@rea.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-04-05', status: 'paid', inv: 'INV-2026-015' },
    { id: 't16', user: 'Seek', email: 'billing@seek.com.au', plan: 'Professional', amount: '$299', raw: 299, date: '2026-04-08', status: 'paid', inv: 'INV-2026-016' },
    { id: 't17', user: 'Afterpay', email: 'billing@afterpay.com', plan: 'Professional', amount: '$299', raw: 299, date: '2026-04-10', status: 'paid', inv: 'INV-2026-017' },
    { id: 't18', user: 'TechRecruit Pro', email: 'billing@techrecruit.com.au', plan: 'Professional', amount: '$299', raw: 299, date: '2026-04-12', status: 'paid', inv: 'INV-2026-018' },
    { id: 't19', user: 'Westpac HR', email: 'hr@westpac.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-04-16', status: 'paid', inv: 'INV-2026-019' },
    { id: 't20', user: 'NAB Talent', email: 'talent@nab.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-04-17', status: 'paid', inv: 'INV-2026-020' },
    { id: 't21', user: 'HireNow Agency', email: 'billing@hirenow.com.au', plan: 'Professional', amount: '$299', raw: 299, date: '2026-03-01', status: 'paid', inv: 'INV-2026-021' },
    { id: 't22', user: 'Atlassian', email: 'billing@atlassian.com', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-03-01', status: 'paid', inv: 'INV-2026-022' },
    { id: 't23', user: 'Canva', email: 'billing@canva.com', plan: 'Professional', amount: '$299', raw: 299, date: '2026-03-01', status: 'paid', inv: 'INV-2026-023' },
    { id: 't24', user: 'StartupAU', email: 'admin@startupau.com', plan: 'Starter', amount: '$0', raw: 0, date: '2026-03-15', status: 'trial', inv: 'INV-2026-024' },
    { id: 't25', user: 'BuildCorp', email: 'accounts@buildcorp.com.au', plan: 'Enterprise', amount: '$999', raw: 999, date: '2026-03-15', status: 'paid', inv: 'INV-2026-025' },
  ];
  const finances = {
    transactions: financeFilter === 'all' ? allTransactions :
      financeFilter === 'paid' ? allTransactions.filter(t => t.status === 'paid') :
      financeFilter === 'failed' ? allTransactions.filter(t => t.status === 'failed') :
      financeFilter === 'trial' ? allTransactions.filter(t => t.status === 'trial') :
      financeFilter === 'may' ? allTransactions.filter(t => t.date.startsWith('2026-05')) :
      financeFilter === 'apr' ? allTransactions.filter(t => t.date.startsWith('2026-04')) :
      allTransactions.filter(t => t.date.startsWith('2026-03'))
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
    { id: 'credits', label: 'Assign AI Credits', icon: CreditCard },
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

  const handleToggleStatus = async (u: any) => {
    const newSuspended = u.status !== 'active';
    try {
      const updated = await api.updateUserStatus(u.id, newSuspended);
      const newStatus = updated.suspended ? 'suspended' : 'active';
      setDemoUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: newStatus, flaggedReason: updated.flaggedReason } : x));
      setSelectedUser((prev: any) => prev ? { ...prev, status: newStatus, flaggedReason: updated.flaggedReason } : null);
      showToast(`${u.firstName} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}.`, newStatus === 'suspended' ? 'warning' : 'success');
    } catch {
      showToast('Failed to update user status.', 'error');
    }
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

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="cursor-pointer fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div className="cursor-pointer bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedApp.candidate}</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedApp.job}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Score + Status + Date */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-extrabold text-blue-600">{selectedApp.score !== undefined ? `${selectedApp.score}/100` : '—'}</p>
                  <p className="text-xs text-gray-500 mt-1">AI Score</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-bold text-gray-900 capitalize">{selectedApp.status}</p>
                  <p className="text-xs text-gray-500 mt-1">Status</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-bold text-gray-900">{selectedApp.date}</p>
                  <p className="text-xs text-gray-500 mt-1">Applied Date</p>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-700 uppercase">Candidate Email</h4>
                <p className="text-sm text-gray-900 font-mono">{selectedApp.email}</p>
              </div>

              {/* Scorecard breakdown */}
              {selectedApp.score !== undefined && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">AI Scorecard Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Australian Work Rights', score: Math.min(100, (selectedApp.score || 80) + 8) },
                      { label: 'Salary Expectations', score: Math.min(100, (selectedApp.score || 80) + 2) },
                      { label: 'Technical Skills', score: selectedApp.score },
                      { label: 'Location Match', score: Math.min(100, (selectedApp.score || 80) + 5) },
                      { label: 'Qualifications', score: Math.max(50, (selectedApp.score || 80) - 5) },
                    ].map(item => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{item.label}</span>
                          <span className={`font-bold ${item.score >= 85 ? 'text-green-600' : item.score >= 70 ? 'text-orange-500' : 'text-red-500'}`}>{item.score}/100</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.score >= 85 ? 'bg-green-500' : item.score >= 70 ? 'bg-orange-400' : 'bg-red-500'}`} style={{width: `${item.score}%`}} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Screening Transcript */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-blue-600" /> AI Screening Transcript
                </h4>
                <div className="space-y-3 bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto border">
                  {[
                    { role: 'ai', text: `Hello! Welcome to your AI screening interview for the ${selectedApp.job} position. I'll guide you through ${4} questions. Let's begin!

Question 1: Describe your most relevant experience for this role.` },
                    { role: 'candidate', text: selectedApp.score >= 85 ? 'I have 6+ years of experience in this domain, having led multiple projects end-to-end. Most recently I delivered a high-impact solution that increased team productivity by 40%.' : 'I have around 3 years of experience and have worked on several related projects in my previous roles.' },
                    { role: 'ai', text: 'Thank you. Question 2: What are your salary expectations and availability?' },
                    { role: "candidate", text: selectedApp.score >= 85 ? "I am looking for $140-160k package. I can start within 2 weeks after notice period." : "I am expecting around $180k+ and would need at least 3 months notice period." },
                    { role: 'ai', text: 'Question 3: Do you have full Australian work rights?' },
                    { role: 'candidate', text: selectedApp.score >= 85 ? 'Yes, I am an Australian citizen with full unrestricted work rights.' : 'I am on a 457 visa currently being converted to PR.' },
                    { role: 'ai', text: `Thank you for completing the screening. Your responses have been evaluated. Final score: ${selectedApp.score}/100. ${selectedApp.score >= 85 ? 'You have been marked as Qualified.' : selectedApp.score >= 70 ? 'Your application is under review.' : 'Unfortunately you did not meet the minimum threshold.'}` },
                  ].map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${msg.role === 'ai' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        {msg.role === 'ai' ? 'AI' : 'C'}
                      </div>
                      <div className={`text-xs p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${msg.role === 'ai' ? 'bg-blue-50 text-blue-900' : 'bg-white border border-gray-200 text-gray-700'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['qualified', 'review', 'rejected', 'screening'].map(s => (
                    <button key={s} onClick={() => { setSelectedApp({...selectedApp, status: s}); showToast(`Status updated to ${s}`, 'success'); }} className={`cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg border transition capitalize ${selectedApp.status === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => window.open(`mailto:${selectedApp.email}`)} className="cursor-pointer flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                  <Mail className="w-3.5 h-3.5" /> Email Candidate
                </button>
                <button onClick={() => { setSelectedApp(null); showToast('Application deleted', 'warning'); }} className="cursor-pointer flex items-center gap-2 text-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold px-4 py-2 rounded-lg transition">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="cursor-pointer fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="cursor-pointer bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            {/* Invoice Header with QANI branding */}
            <div className="bg-gray-950 rounded-t-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 shadow-lg" />
                  <div className="relative w-full h-full bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center font-mono font-black text-white text-base">Q</div>
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm tracking-wide">QANI Platform</p>
                  <p className="text-[10px] text-gray-400">AI Recruitment · Australia</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-bold text-sm">{selectedInvoice.inv}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">TAX INVOICE</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Company details + Bill to */}
              <div className="flex justify-between text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-sm">QANI Platform Pty Ltd</p>
                  <p className="text-gray-500">ABN: 00 000 000 000</p>
                  <p className="text-gray-500">Level 10, 1 Market Street</p>
                  <p className="text-gray-500">Sydney NSW 2000, Australia</p>
                  <p className="text-gray-500">billing@qani.io</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-gray-900 text-sm">Bill To:</p>
                  <p className="text-gray-700 font-semibold">{selectedInvoice.user}</p>
                  <p className="text-gray-500">{selectedInvoice.email}</p>
                  <div className="mt-3">
                    <p className="text-gray-400">Invoice Date: <span className="font-semibold text-gray-700">{selectedInvoice.date}</span></p>
                    <p className="text-gray-400">Due Date: <span className="font-semibold text-gray-700">{selectedInvoice.date}</span></p>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-3 text-left font-bold text-gray-600">Description</th>
                      <th className="p-3 text-center font-bold text-gray-600">Qty</th>
                      <th className="p-3 text-right font-bold text-gray-600">Amount (AUD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 text-gray-700">
                        <p className="font-semibold text-gray-900">QANI {selectedInvoice.plan} Plan</p>
                        <p className="text-gray-500 text-[10px]">Monthly Subscription — AI Recruitment Platform</p>
                      </td>
                      <td className="p-3 text-center text-gray-700">1</td>
                      <td className="p-3 text-right font-semibold text-gray-900">{selectedInvoice.amount}</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="p-3 text-gray-500 text-[10px]" colSpan={2}>GST Included (10%)</td>
                      <td className="p-3 text-right text-gray-500 text-[10px]">Included</td>
                    </tr>
                    <tr className="border-t bg-blue-50">
                      <td className="p-3 font-extrabold text-gray-900" colSpan={2}>Total (AUD incl. GST)</td>
                      <td className="p-3 text-right font-extrabold text-gray-900 text-base">{selectedInvoice.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment status */}
              <div className={`p-3 rounded-lg text-xs font-bold text-center tracking-wider uppercase ${selectedInvoice.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : selectedInvoice.status === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {selectedInvoice.status === 'paid' ? '✓ Payment Received' : selectedInvoice.status === 'failed' ? '✗ Payment Failed — Action Required' : 'Free Trial — No Charge'}
              </div>

              {/* Footer note */}
              <p className="text-[10px] text-gray-400 text-center">Thank you for choosing QANI Platform. For billing enquiries contact billing@qani.io</p>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <button onClick={() => setSelectedInvoice(null)} className="cursor-pointer text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg transition">
                  Close
                </button>
                <button onClick={() => window.open(`mailto:${selectedInvoice.email}?subject=Invoice ${selectedInvoice.inv} — QANI Platform&body=Please find attached your invoice ${selectedInvoice.inv} for QANI ${selectedInvoice.plan} Plan.`)} className="cursor-pointer flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg transition">
                  <Mail className="w-3.5 h-3.5" /> Email Invoice
                </button>
                <button onClick={() => window.print()} className="cursor-pointer flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      

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
              <StatCard label="Total Users" value={totalUsers || 0} icon={<Users className="w-5 h-5 text-blue-600" />} color="bg-blue-50" sub={`${dashStats?.totalCandidates || 0} candidates · ${dashStats?.totalRecruiters || 0} recruiters`} />
              <StatCard label="Active Jobs" value={dashStats?.totalJobs || 0} icon={<Briefcase className="w-5 h-5 text-green-600" />} color="bg-green-50" sub={`${dashStats?.qualifiedApplications || 0} qualified candidates`} />
              <StatCard label="Applications" value={dashStats?.totalApplications || 0} icon={<FileText className="w-5 h-5 text-purple-600" />} color="bg-purple-50" sub={`${dashStats?.screeningApplications || 0} in screening`} />
              <StatCard label="Conversion Rate" value={`${dashStats?.conversionRate || 0}%`} icon={<TrendingUp className="w-5 h-5 text-orange-600" />} color="bg-orange-50" sub={`${dashStats?.qualifiedApplications || 0} qualified of ${dashStats?.totalApplications || 0}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentNotifications.length > 0 ? recentNotifications.map((n: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.type === 'screening_complete' ? 'bg-green-500' : n.type === 'new_application' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{n.title}</p>
                        <p className="text-gray-500">{n.message?.substring(0, 80)}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{new Date(n.createdAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic">No recent activity</p>
                  )}
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
                              <p className="text-[10px] text-gray-400">{u.emailVerified ? '✓ Verified' : '⚠ Unverified'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-600">{u.email}</td>
                        <td className="p-4"><StatusBadge status={u.role} /></td>
                        <td className="p-4 text-gray-500">{u.location}</td>
                        <td className="p-4"><StatusBadge status={u.status} /></td>
                        <td className="cursor-pointer p-4" onClick={e => e.stopPropagation()}>
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
                { label: 'Total', value: demoApps.length, color: 'bg-gray-50 border-gray-200' },
                { label: 'Qualified', value: demoApps.filter(a => a.status === 'qualified').length, color: 'bg-green-50 border-green-200' },
                { label: 'Review', value: demoApps.filter(a => a.status === 'review').length, color: 'bg-orange-50 border-orange-200' },
                { label: 'Screening', value: demoApps.filter(a => a.status === 'screening').length, color: 'bg-blue-50 border-blue-200' },
                { label: 'Rejected', value: demoApps.filter(a => a.status === 'rejected').length, color: 'bg-red-50 border-red-200' },
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
                            <button onClick={() => setSelectedApp(a)} className="cursor-pointer p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View">
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
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Financial Dashboard</h2>
                <p className="text-xs text-gray-500 mt-1">Revenue, subscriptions, and billing management</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[['all','All'], ['may','May 2026'], ['apr','Apr 2026'], ['mar','Mar 2026'], ['paid','Paid'], ['failed','Failed'], ['trial','Trial']].map(([val, label]) => (
                  <button key={val} onClick={() => setFinanceFilter(val)} className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${financeFilter === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {label}
                  </button>
                ))}
              </div>
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
                    {finances.transactions.slice((financePage-1)*financePerPage, financePage*financePerPage).map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-semibold text-gray-900">{t.user}</td>
                        <td className="p-4 text-gray-600">{t.plan}</td>
                        <td className="p-4 font-bold text-gray-900">{t.amount}</td>
                        <td className="p-4 text-gray-500">{t.date}</td>
                        <td className="p-4"><StatusBadge status={t.status} /></td>
                        <td className="p-4 text-right">
                          <div className="flex gap-3 justify-end">
                            <button onClick={() => setSelectedInvoice(t)} className="cursor-pointer text-[10px] text-blue-600 hover:underline font-semibold">View</button>
                            <button onClick={() => showToast(`Invoice sent to ${t.user}`, 'success')} className="cursor-pointer text-[10px] text-green-600 hover:underline font-semibold">Send</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {finances.transactions.length > financePerPage && (
                <div className="flex items-center justify-between pt-4 pb-20">
                  <p className="text-xs text-gray-500">Showing {Math.min((financePage-1)*financePerPage+1, finances.transactions.length)}–{Math.min(financePage*financePerPage, finances.transactions.length)} of {finances.transactions.length}</p>
                  <div className="flex gap-1">
                    <button onClick={() => setFinancePage(p => Math.max(1,p-1))} disabled={financePage===1} className="cursor-pointer text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                    {Array.from({length: Math.ceil(finances.transactions.length/financePerPage)},(_,i)=>(
                      <button key={i} onClick={()=>setFinancePage(i+1)} className={`cursor-pointer text-xs font-semibold px-3 py-1.5 border rounded-lg ${financePage===i+1?'bg-blue-600 text-white border-blue-600':'border-gray-300 hover:bg-gray-50'}`}>{i+1}</button>
                    ))}
                    <button onClick={() => setFinancePage(p => Math.min(Math.ceil(finances.transactions.length/financePerPage),p+1))} disabled={financePage===Math.ceil(finances.transactions.length/financePerPage)} className="cursor-pointer text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CMS ── */}
        {activeTab === 'cms' && (
          <AdminCMS />
        )}
        {/* ── SETTINGS ── */}
        {activeTab === 'credits' && <AdminCredits showToast={showToast} />}
        {activeTab === 'pricing' && <AdminPricingCMS showToast={showToast} />}
        {activeTab === 'settings' && <AdminSettings showToast={showToast} />}

      </div>
    </div>
  );
};
