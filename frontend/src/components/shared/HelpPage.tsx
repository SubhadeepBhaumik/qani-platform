import React from 'react';
import { useApp } from '../AppContext';
import { useCMS } from '../admin/AdminCMS';
import { HelpCircle, ChevronRight, FileText, ShieldCheck, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { navigate, goBack, refreshStates, showToast } = useApp();
  const cms = useCMS();


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
          <span>{cms.helpPage?.title || "Help & Support"}</span>
        </h1>
        <p className="text-xs text-gray-500">{cms.helpPage?.subtitle || "Find answers to common questions about QANI."}</p>
      </div>

      {/* FAQs blocks */}
      <div className="space-y-4 pt-4">
        {(cms.helpPage?.faqs || [
          { question: "How does AI screening work?", answer: "QANI uses GPT-4o to conduct natural language interviews. The AI asks job-specific questions, evaluates responses in real-time, and scores candidates across 5 key dimensions." },
          { question: "How long does a screening take?", answer: "Most screenings take 10-20 minutes depending on the number of questions configured by the recruiter." },
          { question: "Can I customise the screening questions?", answer: "Yes! Recruiters can add custom questions, set question order, and configure scoring weights for each job role." },
          { question: "How is the score calculated?", answer: "Candidates are scored across Work Rights, Salary Alignment, Location Match, Technical Skills, and Qualifications. Each dimension has a recruiter-set weight." },
          { question: "Is my data safe?", answer: "All data is encrypted at rest and in transit. QANI is compliant with Australian Privacy Principles (APPs)." },
        ]).map((faq: any, i: number) => (
          <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-gray-950">{faq.question}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
