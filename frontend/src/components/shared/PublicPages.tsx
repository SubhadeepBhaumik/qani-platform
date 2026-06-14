import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useCMS } from '../admin/AdminCMS';
import {
  ArrowRight, MapPin, DollarSign, Building2, Zap, Clock,
  Award, CheckCircle, Mail, Phone, ChevronRight,
  Users, Briefcase, Star, Send, AlertCircle, ChevronLeft,
  Linkedin, Twitter, MessageSquare
} from 'lucide-react';

const API = '/api/v1';

// ─── SHARED PUBLIC NAV ────────────────────────────────────────────────────────

const PublicNav: React.FC<{ activePage?: string }> = ({ activePage }) => {
  const { navigate, user } = useApp();
  const cms = useCMS();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', page: 'how-it-works' },
    { label: 'Jobs', page: 'public-jobs' },
    { label: 'Candidates', page: 'public-candidates' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const getDashboardView = () => {
    if (user?.role === 'candidate') return 'candidate-dashboard';
    if (user?.role === 'recruiter') return 'recruiter-dashboard';
    return 'admin-dashboard';
  };

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-30 shadow-sm">
      <div className="h-16 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 shadow-md group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-7 h-7 bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-extrabold text-white text-[13px]">Q</div>
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg text-gray-900 group-hover:text-blue-600 transition">QANI</span>
            <span className="text-[10px] text-gray-400 block -mt-1">{cms.global?.logoSubtext || 'AI Recruitment · Australia'}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map(link => (
            <button key={link.page} onClick={() => navigate(link.page as any)}
              className={`cursor-pointer hover:text-blue-600 transition ${activePage === link.page ? 'text-blue-600 font-semibold' : ''}`}>
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button onClick={() => navigate(getDashboardView() as any)} className="cursor-pointer flex items-center gap-2 text-sm bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition hidden sm:flex">
                Dashboard
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('auth-login')} className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 font-semibold px-4 py-2 transition hidden sm:block">
                Sign In
              </button>
              <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition hidden sm:block">
                Find Jobs
              </button>
              <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md shadow-blue-500/20">
                Start Recruiting
              </button>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
            <div className="w-4 h-0.5 bg-current mb-1" /><div className="w-4 h-0.5 bg-current mb-1" /><div className="w-4 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-40 p-4 space-y-3">
          {navLinks.map(link => (
            <button key={link.page} onClick={() => { navigate(link.page as any); setMenuOpen(false); }}
              className={`cursor-pointer block w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition ${activePage === link.page ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              {link.label}
            </button>
          ))}
          <div className="border-t border-gray-100 pt-3 flex gap-2">
            {user ? (
              <button onClick={() => { navigate(getDashboardView() as any); setMenuOpen(false); }} className="cursor-pointer flex-1 text-sm bg-gray-900 text-white py-2 rounded-lg font-semibold">Dashboard</button>
            ) : (
              <>
                <button onClick={() => { navigate('auth-login'); setMenuOpen(false); }} className="cursor-pointer flex-1 text-sm border border-gray-300 py-2 rounded-lg text-gray-700 font-semibold">Sign In</button>
                <button onClick={() => { navigate('auth-register-recruiter'); setMenuOpen(false); }} className="cursor-pointer flex-1 text-sm bg-blue-600 text-white py-2 rounded-lg font-semibold">Start Recruiting</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// ─── SHARED PUBLIC FOOTER ─────────────────────────────────────────────────────

const PublicFooter: React.FC = () => {
  const { navigate, showToast } = useApp();
  const cms = useCMS();
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-12 px-6 sm:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3" />
              <div className="relative w-full h-full bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-black text-white text-xs">Q</div>
            </div>
            <span className="font-black text-white text-base">QANI Platform</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">{cms.footer?.tagline || "Australia's AI-powered recruitment platform. Screening candidates 24/7 so you don't have to."}</p>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h5 className="text-white text-xs font-bold uppercase tracking-wider">For Candidates</h5>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer hover:text-blue-400 transition">Create Profile</button></li>
            <li><button onClick={() => navigate('public-jobs')} className="cursor-pointer hover:text-blue-400 transition">Browse Jobs</button></li>
            <li><button onClick={() => navigate('how-it-works')} className="cursor-pointer hover:text-blue-400 transition">How Screening Works</button></li>
          </ul>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h5 className="text-white text-xs font-bold uppercase tracking-wider">For Recruiters</h5>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer hover:text-blue-400 transition">Start Recruiting</button></li>
            <li><button onClick={() => navigate('how-it-works')} className="cursor-pointer hover:text-blue-400 transition">How It Works</button></li>
            <li><button onClick={() => navigate('contact')} className="cursor-pointer hover:text-blue-400 transition">Contact Us</button></li>
          </ul>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h5 className="text-white text-xs font-bold uppercase tracking-wider">Company</h5>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => navigate('about')} className="cursor-pointer hover:text-blue-400 transition">About QANI</button></li>
            <li><button onClick={() => navigate('contact')} className="cursor-pointer hover:text-blue-400 transition">Contact</button></li>
            <li><button onClick={() => navigate('help')} className="cursor-pointer hover:text-blue-400 transition">Help & FAQ</button></li>
          </ul>
        </div>
        <div className="lg:col-span-2 space-y-4 bg-gray-900/40 border border-gray-800 p-4 rounded-2xl">
          <h5 className="text-white text-xs font-bold uppercase tracking-wider">Stay Updated</h5>
          <p className="text-[11px] text-gray-400">AI recruitment insights. No spam.</p>
          <form onSubmit={e => { e.preventDefault(); showToast('Subscribed!', 'success'); (e.target as HTMLFormElement).reset(); }} className="flex gap-2">
            <input name="email" type="email" required placeholder="you@company.com.au" className="flex-grow h-9 bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg px-3 text-[11px] text-white outline-none transition" />
            <button type="submit" className="cursor-pointer h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition">→</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <span>{cms.footer?.copyright || '© 2026 QANI Platform Pty Ltd. ABN 00 000 000 000. All rights reserved.'}</span>
        <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-900/30 text-blue-400 py-1 px-3 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  );
};

// ─── HOW IT WORKS PAGE ────────────────────────────────────────────────────────

export const HowItWorksPage: React.FC = () => {
  const { navigate } = useApp();
  const cms = useCMS();
  const hiw = cms.homepage?.howItWorks;

  const steps = hiw?.steps?.length > 0 ? hiw.steps : [
    { step: '1', title: 'Post Your Job', description: 'Create a job with salary range, location, work rights requirements, and custom AI screening questions. Takes less than 5 minutes.' },
    { step: '2', title: 'Candidates Apply', description: 'Candidates discover your role and apply. QANI immediately invites them to complete an AI screening session.' },
    { step: '3', title: 'AI Screens 24/7', description: 'QANI conducts intelligent conversational interviews — asking your questions, probing vague answers, and scoring every response in real time.' },
    { step: '4', title: 'Scorecard Generated', description: 'Each candidate receives a detailed scorecard across 5 dimensions: salary fit, work rights, location, qualifications, and technical skills.' },
    { step: '5', title: 'You Review & Hire', description: 'Log in to see your ranked shortlist. Progress candidates to interview, put them on review, or reject — all in one click.' },
  ];

  const dimensions = [
    { icon: '🏠', title: 'Location Match', desc: 'Calculates real distance using postcode. Asks about commute willingness beyond 20km.' },
    { icon: '💰', title: 'Salary Alignment', desc: 'Compares candidate expectation to your budget. Flags candidates over your maximum.' },
    { icon: '🛂', title: 'Work Rights', desc: 'Verifies Australian citizenship, PR, or valid work visa status.' },
    { icon: '🎓', title: 'Qualifications', desc: 'Assesses years of experience and relevant credentials against your requirements.' },
    { icon: '⚙️', title: 'Technical Skills', desc: 'Evaluates role-specific skills through custom questions with follow-up probing.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <PublicNav activePage="how-it-works" />

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 sm:px-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" /> {hiw?.title || 'How QANI Works'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            From Job Post to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Qualified Shortlist</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{hiw?.subtitle || 'QANI automates the most time-consuming part of recruitment — first-round screening. Here\'s exactly how it works.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition shadow-xl shadow-blue-500/20 text-sm">
              Start Recruiting Free <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-8 rounded-xl transition text-sm">
              Apply as Candidate <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-gray-900">The QANI Process</h2>
            <p className="text-gray-500 mt-2 text-sm">Simple for recruiters. Smooth for candidates.</p>
          </div>
          <div className="space-y-8">
            {steps.map((s: any, i: number) => (
              <div key={i} className={`flex gap-6 items-start p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition ${i % 2 === 0 ? '' : 'flex-row-reverse text-right'}`}>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 shadow-lg shadow-blue-500/20">
                  {s.step || i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Dimensions */}
      <section className="py-20 px-6 sm:px-12 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">5-Dimension Scoring</h2>
            <p className="text-gray-500 mt-2 text-sm">Every candidate is scored across these dimensions — weighted by your priorities.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {dimensions.map(d => (
              <div key={d.title} className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-3 hover:border-blue-200 hover:shadow-md transition">
                <div className="text-3xl">{d.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm">{d.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 sm:px-12 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Ready to see it in action?</h2>
          <p className="text-blue-100">Post your first job free — no credit card required.</p>
          <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer bg-white text-blue-600 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition shadow-lg text-sm">
            Start Recruiting Free →
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();
  const cms = useCMS();

  const values = [
    { icon: '🤖', title: 'AI-First', desc: 'We believe AI should handle the repetitive parts of recruitment so humans can focus on building relationships.' },
    { icon: '🇦🇺', title: 'Built for Australia', desc: 'From work rights to salary expectations — QANI understands the Australian hiring market inside out.' },
    { icon: '⚡', title: 'Speed Without Compromise', desc: 'Faster screening doesn\'t mean lower quality. Our AI is thorough, fair, and consistent every time.' },
    { icon: '🔒', title: 'Privacy by Design', desc: 'Compliant with Australian Privacy Principles. Your data and candidate data is always protected.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <PublicNav activePage="about" />

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 sm:px-12 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            🇦🇺 Sydney, Australia
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">QANI</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">We're building Australia's smartest AI recruitment platform — making great hiring accessible to every company, not just the big ones.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">{cms.homepage?.features?.subtitle || 'QANI was born from a simple frustration: recruitment teams were spending 80% of their time on first-round phone screens — repetitive, manual, and exhausting.'}</p>
            <p className="text-gray-600 leading-relaxed">We built an AI that conducts those interviews 24/7, scores every candidate fairly, and delivers a ranked shortlist so recruiters can focus on what they do best — building relationships and placing great people.</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { value: '340+', label: 'Companies Using QANI' },
                { value: '18,000+', label: 'Candidates Screened' },
                { value: '94%', label: 'Recruiter Satisfaction' },
                { value: '4 days', label: 'Avg. Time Saved/Week' },
              ].map(s => (
                <div key={s.label} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-xl font-extrabold text-blue-600">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 text-green-400 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              QANI AI — Live Screening
            </div>
            {[
              { q: 'QANI:', m: 'What is your expected annual salary in AUD?', c: 'text-blue-400' },
              { q: 'Candidate:', m: 'Around $140,000.', c: 'text-green-400' },
              { q: 'QANI:', m: "That's within our budget. How many years of relevant experience do you have?", c: 'text-blue-400' },
              { q: 'Candidate:', m: '7 years in frontend engineering.', c: 'text-green-400' },
              { q: 'Score:', m: 'Work Rights 95% · Location 100% · Salary 100% · Skills 82%', c: 'text-yellow-400' },
            ].map((line, i) => (
              <div key={i} className={line.c}>
                <span className="text-gray-500">{line.q}</span> {line.m}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 sm:px-12 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-3 hover:border-blue-200 hover:shadow-md transition">
                <div className="text-3xl">{v.icon}</div>
                <h4 className="font-bold text-gray-900">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 sm:px-12 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Join the future of Australian recruitment</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer bg-white text-blue-600 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition shadow-lg text-sm">
              Start Recruiting Free →
            </button>
            <button onClick={() => navigate('contact')} className="cursor-pointer border-2 border-white text-white font-bold py-3.5 px-8 rounded-xl hover:bg-white/10 transition text-sm">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

export const ContactPage: React.FC = () => {
  const { navigate } = useApp();
  const cms = useCMS();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const subjects = ['General Enquiry', 'Sales & Pricing', 'Technical Support', 'Partnership', 'Media & Press', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError('Failed to send message. Please email us directly at hello@qani.io');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <PublicNav activePage="contact" />

      {/* Hero */}
      <section className="py-16 px-6 sm:px-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Get in Touch</h1>
          <p className="text-gray-500">We'd love to hear from you. Our team typically responds within 1 business day.</p>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-4 h-4 text-blue-600" />, label: 'Email', value: cms.contact?.email || 'hello@qani.io', href: `mailto:${cms.contact?.email || 'hello@qani.io'}` },
                  { icon: <Phone className="w-4 h-4 text-blue-600" />, label: 'Phone', value: cms.contact?.phone || '+61 2 9000 0000', href: `tel:${cms.contact?.phone || '+61290000000'}` },
                  { icon: <MapPin className="w-4 h-4 text-blue-600" />, label: 'Location', value: cms.contact?.address || 'Sydney, NSW, Australia', href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition">{item.value}</a>
                      ) : (
                        <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {cms.contact?.linkedin && (
                  <a href={cms.contact.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {cms.contact?.twitter && (
                  <a href={cms.contact.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
              <div className="font-bold text-gray-900 text-sm">Looking to buy credits?</div>
              <p className="text-xs text-gray-500">Register as a recruiter and purchase credits directly from your dashboard.</p>
              <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer text-xs text-blue-600 font-semibold hover:underline">Register now →</button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We've received your message and will get back to you within 1 business day.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' }); }} className="cursor-pointer text-sm text-blue-600 font-semibold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg">Send us a Message</h3>
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com.au" className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-blue-500 transition" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Phone</label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+61 4XX XXX XXX" className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">Subject</label>
                    <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-blue-500 transition bg-white">
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us how we can help..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition resize-none" />
                </div>
                <button type="submit" disabled={sending} className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                  {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

// ─── PUBLIC JOBS PAGE ─────────────────────────────────────────────────────────

export const PublicJobsPage: React.FC = () => {
  const { navigate } = useApp();
  const cms = useCMS();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('page');
    return p ? parseInt(p) : 1;
  });
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const PER_PAGE = 15;

  useEffect(() => {
    fetch(`${API}/roles`)
      .then(r => r.json())
      .then(data => { setJobs(Array.isArray(data) ? data.filter((j: any) => j.status === 'open' || j.status === 'active') : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    window.history.replaceState({}, '', url.toString());
  }, [page]);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || (j.skillsRequired || []).some((s: string) => s.toLowerCase().includes(q));
    const matchLoc = !locationFilter || j.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchLoc;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const locations = [...new Set(jobs.map((j: any) => j.location).filter(Boolean))];

  return (
    <div className="bg-gray-50 min-h-screen">
      <PublicNav activePage="public-jobs" />

      {/* Hero */}
      <section className="py-12 px-6 sm:px-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900">{cms.homepage?.jobs?.title || 'Open Positions'}</h1>
            <p className="text-gray-500 text-sm">{cms.homepage?.jobs?.subtitle || 'AI-screened jobs from top Australian companies. Login to apply.'}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search jobs, companies, skills..." className="flex-1 h-11 border border-gray-200 bg-white rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition shadow-sm" />
            <select value={locationFilter} onChange={e => { setLocationFilter(e.target.value); setPage(1); }} className="h-11 border border-gray-200 bg-white rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition shadow-sm min-w-[140px]">
              <option value="">All Locations</option>
              {locations.map((l: any) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-white border border-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No jobs found</p>
              <p className="text-sm mt-1">Try a different search or check back soon.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{filtered.length}</span> open positions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((job: any) => (
                  <div key={job.id} onClick={() => navigate('auth-login')} className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                          <Zap className="w-2.5 h-2.5" /> AI Screened
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition leading-snug">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company || 'Confidential'}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                      {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                      {job.salaryMin && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${Math.round(job.salaryMin / 1000)}k–${Math.round(job.salaryMax / 1000)}k</span>}
                    </div>
                    {(job.skillsRequired || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(job.skillsRequired || []).slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                        {(job.skillsRequired || []).length > 3 && <span className="text-[10px] text-gray-400">+{job.skillsRequired.length - 3} more</span>}
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(job.postedDate || job.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                      <span className="text-xs text-blue-600 font-semibold group-hover:underline">Login to Apply →</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="cursor-pointer w-9 h-9 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`cursor-pointer w-9 h-9 rounded-lg text-sm font-semibold transition ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="cursor-pointer w-9 h-9 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Auth Gate Banner */}
      <section className="py-12 px-6 sm:px-12 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-extrabold text-white">Ready to apply?</h2>
          <p className="text-blue-100 text-sm">Create a free candidate profile to apply and get AI-screened for any role.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition text-sm">Create Free Profile →</button>
            <button onClick={() => navigate('auth-login')} className="cursor-pointer border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 transition text-sm">Sign In</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

// ─── PUBLIC CANDIDATES PAGE ───────────────────────────────────────────────────

export const PublicCandidatesPage: React.FC = () => {
  const { navigate } = useApp();
  const cms = useCMS();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const PER_PAGE = 15;

  useEffect(() => {
    fetch(`${API}/candidates`)
      .then(r => r.json())
      .then(data => { setCandidates(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = candidates.filter(c => {
    const q = search.toLowerCase();
    return !q || c.firstName?.toLowerCase().includes(q) || c.lastName?.toLowerCase().includes(q) ||
      (c.profile?.skills || []).some((s: string) => s.toLowerCase().includes(q)) ||
      c.profile?.location?.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const getInitials = (c: any) => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase() || '?';
  const getScore = (c: any) => c.latestScore || c.profile?.latestScore || null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <PublicNav activePage="public-candidates" />

      {/* Hero */}
      <section className="py-12 px-6 sm:px-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{cms.homepage?.candidates?.title || 'AI-Screened Candidates'}</h1>
          <p className="text-gray-500 text-sm">{cms.homepage?.candidates?.subtitle || 'Pre-qualified talent ready for your shortlist. Login to view full profiles and screening transcripts.'}</p>
          <div className="max-w-md mx-auto">
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, skill, or location..." className="w-full h-11 border border-gray-200 bg-white rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition shadow-sm" />
          </div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="h-44 bg-white border border-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No candidates found</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6"><span className="font-semibold text-gray-900">{filtered.length}</span> candidates available</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {paginated.map((c: any) => {
                  const score = getScore(c);
                  return (
                    <div key={c.id} onClick={() => navigate('auth-login')} className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(c)}
                        </div>
                        {score !== null && (
                          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${score >= 70 ? 'bg-green-50 text-green-700 border-green-200' : score >= 45 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            <Award className="w-3 h-3" />{Math.round(score)}%
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{c.firstName} {c.lastName}</h3>
                      {c.profile?.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin className="w-3 h-3" />{c.profile.location}
                        </div>
                      )}
                      {(c.profile?.skills || []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(c.profile.skills || []).slice(0, 3).map((s: string) => (
                            <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                          {(c.profile.skills || []).length > 3 && <span className="text-[10px] text-gray-400">+{c.profile.skills.length - 3}</span>}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-blue-600 font-semibold group-hover:underline">
                        Login to view full profile →
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="cursor-pointer w-9 h-9 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`cursor-pointer w-9 h-9 rounded-lg text-sm font-semibold transition ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="cursor-pointer w-9 h-9 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Auth Gate */}
      <section className="py-12 px-6 sm:px-12 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-extrabold text-white">Want to access full profiles?</h2>
          <p className="text-blue-100 text-sm">Register as a recruiter to view complete screening transcripts, scorecards, and contact details.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition text-sm">Start Recruiting Free →</button>
            <button onClick={() => navigate('auth-login')} className="cursor-pointer border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 transition text-sm">Sign In</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
