import React, { useState, useEffect, useCallback } from 'react';

interface RecruiterCredit {
  id: string;
  email: string;
  name: string;
  companyName: string;
  registeredAt: string;
  freeTrialDays: number;
  trialExpiresAt: string;
  isOnTrial: boolean;
  daysRemaining: number;
  creditBalance: number;
}

const API = '/api/v1';

export const AdminCredits: React.FC<{ showToast?: (msg: string, type?: string) => void }> = ({ showToast }) => {
  const [recruiters, setRecruiters] = useState<RecruiterCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editDays, setEditDays] = useState<Record<string, string>>({});
  const [adjustAmount, setAdjustAmount] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [localToast, setLocalToast] = useState<{ msg: string; type: string } | null>(null);

  const toast = (msg: string, type: string = 'success') => {
    if (showToast) { showToast(msg, type); return; }
    setLocalToast({ msg, type });
    setTimeout(() => setLocalToast(null), 3500);
  };

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/credits`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('qani_auth_token')}` },
      });
      const data = await res.json();
      setRecruiters(Array.isArray(data) ? data : []);
      const days: Record<string, string> = {};
      (Array.isArray(data) ? data : []).forEach((r: RecruiterCredit) => { days[r.id] = String(r.freeTrialDays); });
      setEditDays(days);
    } catch {
      toast('Failed to load recruiters', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecruiters(); }, [fetchRecruiters]);

  const saveTrial = async (recruiterId: string) => {
    const days = parseInt(editDays[recruiterId], 10);
    if (isNaN(days) || days < 0 || days > 365) {
      toast('Enter a valid number of days (0-365)', 'error');
      return;
    }
    setSaving(recruiterId + '_trial');
    try {
      const res = await fetch(`${API}/admin/credits/${recruiterId}/trial`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('qani_auth_token')}`,
        },
        body: JSON.stringify({ freeTrialDays: days }),
      });
      if (!res.ok) throw new Error();
      toast('Free trial days updated', 'success');
      fetchRecruiters();
    } catch {
      toast('Failed to update trial days', 'error');
    } finally {
      setSaving(null);
    }
  };

  const adjustCredits = async (recruiterId: string, type: 'add' | 'deduct') => {
    const raw = parseInt(adjustAmount[recruiterId] || '0', 10);
    const amount = type === 'deduct' ? -Math.abs(raw) : Math.abs(raw);
    if (!raw || isNaN(raw)) { toast('Enter a valid credit amount', 'error'); return; }

    setSaving(recruiterId + '_credits');
    try {
      const res = await fetch(`${API}/admin/credits/${recruiterId}/adjust`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('qani_auth_token')}`,
        },
        body: JSON.stringify({ amount, reason: 'admin_manual' }),
      });
      if (!res.ok) throw new Error();
      toast(`Credits ${type === 'add' ? 'added' : 'deducted'}`, 'success');
      setAdjustAmount(p => ({ ...p, [recruiterId]: '' }));
      fetchRecruiters();
    } catch {
      toast('Failed to adjust credits', 'error');
    } finally {
      setSaving(null);
    }
  };

  const filtered = recruiters.filter(r =>
    (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.companyName || '').toLowerCase().includes(search.toLowerCase())
  );

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return '-'; }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {localToast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${localToast.type === 'error' ? 'bg-red-600' : localToast.type === 'warning' ? 'bg-orange-500' : 'bg-green-600'}`}>
          {localToast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assign AI Credits</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage free trial days and credit balances for all recruiters. Trial expiry is always calculated from the recruiter's registration date.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-700">{recruiters.length}</div>
          <div className="text-xs text-blue-600 mt-1">Total Recruiters</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-700">{recruiters.filter(r => r.isOnTrial).length}</div>
          <div className="text-xs text-green-600 mt-1">Currently On Trial</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-700">{recruiters.reduce((s, r) => s + (r.creditBalance || 0), 0)}</div>
          <div className="text-xs text-purple-600 mt-1">Total Credits Held</div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading recruiters...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No recruiters found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{r.name || '-'}</div>
                  <div className="text-xs text-gray-500">{r.email} {r.companyName ? `· ${r.companyName}` : ''}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Registered: {fmtDate(r.registeredAt)}</div>
                </div>
                <div className="text-right">
                  {r.isOnTrial ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      On Trial · {r.daysRemaining}d left
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                      Trial Expired
                    </span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">Expires: {fmtDate(r.trialExpiresAt)}</div>
                </div>
              </div>

              <div className="px-5 py-4 flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[220px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Free Trial Days (from registration)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      max={365}
                      value={editDays[r.id] ?? r.freeTrialDays}
                      onChange={e => setEditDays(p => ({ ...p, [r.id]: e.target.value }))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => saveTrial(r.id)}
                      disabled={saving === r.id + '_trial'}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {saving === r.id + '_trial' ? 'Saving...' : 'Update'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Current: {r.freeTrialDays} days · Expires {fmtDate(r.trialExpiresAt)}
                  </div>
                </div>

                <div className="flex-1 min-w-[280px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Credit Balance: <span className="font-bold text-gray-900">{r.creditBalance} credits</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="Amount"
                      value={adjustAmount[r.id] || ''}
                      onChange={e => setAdjustAmount(p => ({ ...p, [r.id]: e.target.value }))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => adjustCredits(r.id, 'add')}
                      disabled={saving === r.id + '_credits'}
                      className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => adjustCredits(r.id, 'deduct')}
                      disabled={saving === r.id + '_credits'}
                      className="px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      - Deduct
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
