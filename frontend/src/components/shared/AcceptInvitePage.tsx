import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

export const AcceptInvitePage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('recruiter');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const roleParam = params.get('role');
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (roleParam) setRole(decodeURIComponent(roleParam));
  }, []);

  const handleAccept = async () => {
    if (!firstName || !lastName || !email || !password) { showToast('Please fill in all fields.', 'error'); return; }
    if (password !== confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
    if (password.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('https://qani.io/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, role: 'recruiter' }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        showToast('Account created! You can now log in.', 'success');
        setTimeout(() => navigate('auth-login'), 2000);
      } else {
        showToast(data.error || 'Failed to create account.', 'error');
      }
    } catch(e) {
      showToast('Failed to create account. Try again.', 'error');
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Welcome to QANI!</h2>
          <p className="text-sm text-gray-500">Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3 shadow-md" />
              <div className="relative w-full h-full bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-black text-white text-xs">Q</div>
            </div>
            <span className="font-black text-lg text-gray-900 tracking-tight">QANI</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Accept Invitation</h2>
          <p className="text-xs text-gray-500">You have been invited to join QANI as a Recruiter. Complete your profile to get started.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full text-xs p-2.5 border border-gray-200 bg-gray-50 rounded-lg outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Create Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full text-xs p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <button onClick={handleAccept} disabled={loading} className="cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-lg transition">
            {loading ? 'Creating Account...' : 'Accept Invitation & Join QANI'}
          </button>
          <p className="text-center text-xs text-gray-400">Already have an account? <button onClick={() => navigate('auth-login')} className="cursor-pointer text-blue-600 hover:underline font-semibold">Sign in</button></p>
        </div>
      </div>
    </div>
  );
};
