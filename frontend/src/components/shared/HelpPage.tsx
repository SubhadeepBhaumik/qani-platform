import React from 'react';
import { useApp } from '../AppContext';
import { HelpCircle, ChevronRight, FileText, ShieldCheck, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { navigate, goBack, refreshStates, showToast } = useApp();

  const handleFullReset = () => {
    localStorage.clear();
    refreshStates();
    showToast('Platform database state refreshed to standard values successfully.', 'warning');
    navigate('landing');
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl mx-auto space-y-8 font-sans bg-gray-50/20">
      
      <div className="flex items-center justify-between">
        <button 
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-950 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <span className="text-[10px] font-mono text-gray-400">Singapore Sandbox Terminal</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-blue-600" />
          <span>Documentation & Platform FAQs</span>
        </h1>
        <p className="text-xs text-gray-500">Understand automated matches, security layers, and how Gemini AI scores candidate criteria.</p>
      </div>

      {/* FAQs blocks */}
      <div className="space-y-4 pt-4">
        
        <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2 shadow-sm">
          <h3 className="font-bold text-sm text-gray-950">How are the 5 qualification match scores computed?</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            The candidate scores are calculated inside the custom server (server.ts) after the screening conversation finishes. 
            The server analyzes geographic location expectations, compensation ranges, work rights, and technical skills against the weights defined by the recruiter.
          </p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2 shadow-sm">
          <h3 className="font-bold text-sm text-gray-950">Is my Gemini API key secure on the QANI Platform?</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Yes, absolutely. QANI implements a clean full-stack architecture where all API requests are proxied securely through the Express backend. This guarantees that your private Gemini API key is never transmitted or exposed in the user's browser DevTools.
          </p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2 shadow-sm">
          <h3 className="font-bold text-sm text-gray-950">How do I test different user views in this sandbox?</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Use the <strong className="text-blue-600">Switch Role (Demo)</strong> utility menu in the header bar. This allows you to log in instantly as a pre-configured candidate or recruiter, allowing you to experience both side of the conversational screening process.
          </p>
        </div>

      </div>

      {/* Reset simulator states */}
      <div className="p-6 bg-red-50/30 border border-red-200 rounded-2xl space-y-3 pt-6">
        <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">Developer Sandbox Controls</span>
        <p className="text-xs text-red-700 leading-relaxed">
          Need to discard current interviews, delete test jobs, or reset local database state? Tap below to perform a hard refresh back to standard values.
        </p>
        <div>
          <button 
            type="button" 
            onClick={handleFullReset}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-red-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Local Database State</span>
          </button>
        </div>
      </div>

    </div>
  );
};
