import React, { useState, useEffect } from 'react';

interface TrialStatus {
  isOnTrial: boolean;
  daysRemaining: number;
  trialExpiresAt: string;
  trialDaysTotal: number;
  balance: number;
}

export const TrialBanner: React.FC<{ onBuyCredits: () => void }> = ({ onBuyCredits }) => {
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('qani_auth_token');
    if (!token) return;
    fetch('/api/v1/credits/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (!data.error) setStatus(data); })
      .catch(() => {});
  }, []);

  if (!status || dismissed) return null;

  if (status.isOnTrial && status.daysRemaining > 3) return null;

  if (status.isOnTrial && status.daysRemaining <= 3) {
    return (
      <div className="mx-4 mt-3 mb-1 rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold text-amber-800">
            Your free trial expires in {status.daysRemaining} day{status.daysRemaining !== 1 ? 's' : ''}.
          </span>
          <span className="text-amber-600 ml-1">Purchase credits to keep screening candidates.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onBuyCredits} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors">
            Buy Credits
          </button>
          <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-amber-600 text-lg font-light">×</button>
        </div>
      </div>
    );
  }

  if (!status.isOnTrial && status.balance < 5) {
    return (
      <div className="mx-4 mt-3 mb-1 rounded-xl bg-red-50 border-2 border-red-300 px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold text-red-800">Your free trial has ended.</span>
          <span className="text-red-600 ml-1">
            You have {status.balance} credits — minimum 5 required per screening. Purchase a plan to continue.
          </span>
        </div>
        <button onClick={onBuyCredits} className="shrink-0 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">
          Buy Credits
        </button>
      </div>
    );
  }

  if (!status.isOnTrial && status.balance >= 5) {
    return (
      <div className="mx-4 mt-3 mb-1 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-blue-700"><span className="font-semibold">{status.balance} screening credits</span> remaining</span>
        <button onClick={onBuyCredits} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Top up →</button>
      </div>
    );
  }

  return null;
};
