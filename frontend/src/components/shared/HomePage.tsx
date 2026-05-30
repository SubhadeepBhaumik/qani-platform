import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowRight, 
  Cpu, 
  TrendingUp, 
  Bolt, 
  CheckCircle, 
  ChevronRight, 
  Quote, 
  ShieldCheck, 
  FileCheck,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, login, showToast } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badgeText: "Next-Generation Recruiting AI",
      badgeIcon: <Cpu className="w-3.5 h-3.5" />,
      titleLine1: "AI-Powered Recruitment",
      titleLine2: "at Scale",
      description: "Streamline candidate evaluation. Screen applicants via interactive conversational interviews evaluated directly by Gemini AI. Get detailed match profiles in seconds.",
      gradient: "from-blue-50/70 via-white to-indigo-50/40",
      primaryText: "Apply as Candidate",
      primaryAction: () => navigate('auth-login'),
      primaryIcon: <ArrowRight className="w-4 h-4" />,
      secondaryText: "Recruiter Terminal",
      secondaryAction: () => login('recruiter@qani.ai', 'recruiter'),
      secondaryIcon: <ChevronRight className="w-4 h-4" />,
      accentBg: "bg-blue-600 hover:bg-blue-700",
      accentBorder: "border-blue-200/50",
      accentText: "text-blue-600",
      accentTextDark: "text-blue-800",
      badgeBg: "bg-blue-50 border-blue-200/50 text-blue-700",
      rightPanel: (
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border border-green-200/50">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Evaluation Server Live</span>
          </div>
          <p className="text-xs font-bold uppercase text-blue-600 tracking-wider">Candidate Screen Loop</p>
          <h4 className="text-sm font-semibold text-gray-900 mt-2">Acme Developer Candidate Integration</h4>
          
          <div className="space-y-4 my-6">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs space-y-1">
              <span className="font-bold text-blue-800">QANI AI Recruiter:</span>
              <p className="text-gray-700">Could you explain your experience designing and maintaining high-performance React frontends with heavy data synchronization?</p>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-xl text-xs text-right space-y-1 ml-6 shadow-sm">
              <span className="font-bold text-gray-900">Steve:</span>
              <p className="text-gray-700">I used context selectors and synchronized local storage state in IndexedDB with lazy background polling so UI updates remained decoupled.</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-gray-500 block">Gemini Output</span>
              <span className="text-green-600 font-bold text-sm">QUALIFIED (88/100)</span>
            </div>
            <button 
              onClick={() => navigate('auth-login')} 
              className="bg-blue-600 text-white text-[11px] font-semibold py-1.5 px-3 rounded hover:bg-blue-700 transition"
            >
              Try It Now
            </button>
          </div>
        </div>
      )
    },
    {
      badgeText: "High-Fidelity Automated Scorecard",
      badgeIcon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" />,
      titleLine1: "Multi-Dimensional",
      titleLine2: "Matching Analytics",
      description: "Match salary ranges, geographic restrictions, technical expertise levels, and work rights instantly. Generate clean scorecards for fast client pipeline filtering.",
      gradient: "from-indigo-50/70 via-white to-emerald-50/40",
      primaryText: "Browse Sandbox Jobs",
      primaryAction: () => navigate('auth-login'),
      primaryIcon: <ArrowRight className="w-4 h-4" />,
      secondaryText: "View Scoring Rubrics",
      secondaryAction: () => navigate('help'),
      secondaryIcon: <ChevronRight className="w-4 h-4" />,
      accentBg: "bg-indigo-600 hover:bg-indigo-700",
      accentBorder: "border-indigo-200/50",
      accentText: "text-indigo-600",
      accentTextDark: "text-indigo-800",
      badgeBg: "bg-indigo-50 border-indigo-200/50 text-indigo-700",
      rightPanel: (
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 space-y-4 relative">
          <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-full border border-indigo-200/50">
            Scorecard Analysis
          </div>
          <p className="text-xs font-bold uppercase text-indigo-600 tracking-wider font-mono">Steve Alignment Metrics</p>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">Match alignment across focus criteria</h4>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-gray-700">
                <span>Geographic Match (Singapore Regional)</span>
                <span className="font-bold text-emerald-600">100% Match</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-gray-700">
                <span>Compensation / Salary Expectations</span>
                <span className="font-bold text-emerald-600">92% Align</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-gray-700">
                <span>Technical Skills Assessment</span>
                <span className="font-bold text-indigo-600">88% Qualify</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[88%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-gray-700">
                <span>Work Rights & Status</span>
                <span className="font-bold text-orange-500">75% Matches</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[75%]" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-2 text-indigo-900 border border-indigo-100 rounded-lg text-center font-bold text-xs mt-3">
            🎯 Cumulative Matching Score: 88.75%
          </div>
        </div>
      )
    },
    {
      badgeText: "Enterprise Private Sandbox",
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
      titleLine1: "Server-Proxy Protection",
      titleLine2: "Zero Credentials Leak",
      description: "Ensure candidate trust and developer protection. Your private Gemini API keys reside uniquely behind server-side container environments, blocked from browser exposure.",
      gradient: "from-emerald-50/70 via-white to-blue-50/40",
      primaryText: "Explore Help Guides",
      primaryAction: () => navigate('help'),
      primaryIcon: <ArrowRight className="w-4 h-4" />,
      secondaryText: "System Root Login",
      secondaryAction: () => login('admin@qani.ai', 'admin'),
      secondaryIcon: <ChevronRight className="w-4 h-4" />,
      accentBg: "bg-emerald-600 hover:bg-emerald-700",
      accentBorder: "border-emerald-200/50",
      accentText: "text-emerald-600",
      accentTextDark: "text-emerald-800",
      badgeBg: "bg-emerald-50 border-emerald-200/50 text-emerald-700",
      rightPanel: (
        <div className="w-full max-w-md bg-gray-950 text-emerald-400 border border-gray-800 rounded-2xl shadow-2xl p-6 font-mono space-y-4 relative">
          <div className="absolute top-4 right-4 bg-emerald-950 text-emerald-400 text-[9px] font-bold uppercase py-0.5 px-2 rounded-full border border-emerald-800/30">
            Secure
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span>TERMINAL SHIELD</span>
          </div>
          <div className="text-[11px] space-y-1.5 text-gray-300">
            <p className="text-emerald-500 font-bold">$ curl https://qani.ai/api/eval</p>
            <p className="text-gray-400">// Note: GEMINI_API_KEY is parsed server-side</p>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 space-y-1 text-[10.5px]">
              <p><span className="text-purple-400">headers:</span> {"{"}</p>
              <p className="pl-4"><span className="text-blue-400">"Authorization"</span>: "Verified Server Proxy",</p>
              <p className="pl-4"><span className="text-blue-400">"X-Client-Secure"</span>: true</p>
              <p>{"}"}</p>
              <p className="text-[10px] text-green-400 mt-2 font-bold">// Response code: 200 OK</p>
              <p className="text-[10px] text-gray-500">// client-side credentials leaked: 0 bytes</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] border-t border-gray-800 pt-3 text-gray-500">
            <span>Singapore Sandbox Regional Link</span>
            <span className="text-emerald-400 font-bold">100% Isolated</span>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      {/* Dynamic Landing Header banner */}
      <div className="bg-blue-600 text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-2">
        <span className="font-semibold">⚡ Introducing QANI Conversational screening:</span>
        <span>Evaluate applicants using Gemini AI. Prevent browser key leakages with full server safety layers.</span>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 h-16 px-6 sm:px-12 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 shadow-md group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-7.5 h-7.5 bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-extrabold text-white text-[13px] tracking-tighter">
              Q
            </div>
          </div>
          <span className="font-extrabold tracking-tight text-lg text-gray-900 group-hover:text-blue-600 transition duration-300">QANI Platform</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing Plans</a>
          <a href="#faqs" className="hover:text-blue-600 transition">FAQs</a>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="homepage-login-btn"
            onClick={() => navigate('auth-login')}
            className="text-sm text-gray-700 hover:text-blue-600 font-semibold px-4 py-2"
          >
            Log In
          </button>
          <button 
            id="homepage-register-recruiter-btn"
            onClick={() => {
              login('recruiter@qani.ai', 'recruiter');
            }}
            className="text-sm bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition hidden sm:block"
          >
            Manager Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`py-16 md:py-24 px-6 sm:px-12 bg-gradient-to-br ${slides[activeSlide].gradient} transition-all duration-700 relative overflow-hidden`}>
        
        {/* Decorative Grid overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Slider content block (Left) */}
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className={`inline-flex items-center gap-2 border rounded-full py-1.5 px-3.5 text-xs font-semibold ${slides[activeSlide].badgeBg} shadow-sm backdrop-blur-sm transition-colors duration-500`}>
              {slides[activeSlide].badgeIcon}
              <span>{slides[activeSlide].badgeText}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {slides[activeSlide].titleLine1} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {slides[activeSlide].titleLine2}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {slides[activeSlide].description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                id="hero-apply-candidate-btn"
                onClick={slides[activeSlide].primaryAction}
                className={`flex items-center justify-center gap-2 text-sm text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-xl shadow-blue-500/10 ${slides[activeSlide].accentBg}`}
              >
                <span>{slides[activeSlide].primaryText}</span>
                {slides[activeSlide].primaryIcon}
              </button>

              <button 
                id="hero-recruit-btn"
                onClick={slides[activeSlide].secondaryAction}
                className="flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-xl transition shadow-sm"
              >
                <span>{slides[activeSlide].secondaryText}</span>
                {slides[activeSlide].secondaryIcon}
              </button>
            </div>

            {/* Manual Slider Navigation controllers */}
            <div className="flex items-center gap-3 pt-6">
              <button 
                onClick={() => {
                  setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                className="w-9 h-9 border border-gray-200 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 rounded-lg transition flex items-center justify-center shadow-sm"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => {
                  setActiveSlide((prev) => (prev + 1) % slides.length);
                }}
                className="w-9 h-9 border border-gray-200 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 rounded-lg transition flex items-center justify-center shadow-sm"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slider visualization/mockup block (Right) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center animate-in fade-in slide-in-from-right-4 duration-500">
            {slides[activeSlide].rightPanel}
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Platform Features</h2>
            <p className="text-gray-600">Everything recruiters and candidates need to secure an optimal matching pipeline without extra fatigue.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Conversational AI Screening</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Candidates converse directly with a conversational interview agent. Gemini understands nuanced explanations instead of relying on rudimentary regex keywords.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Multi-Dimensional Evaluation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automated scorecards analyze Salary budgets, work availability, visa parameters, geographic preferences, and technical skills independently.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Bolt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Server Security Protections</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Platform API keys stay entirely server-side inside container environments. Secrets are never exposed to public client browsers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">How It Works</h2>
            <p className="text-gray-600">A simplistic 4-step workflow to unlock lightning-fast, secure screening.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 relative p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-bold text-gray-900">Post Requirements</h4>
              <p className="text-xs text-gray-600">Recruiter specifies a position and inputs specific screening queries to assess.</p>
            </div>
            <div className="space-y-3 relative p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <h4 className="font-bold text-gray-900">Interactive Chat</h4>
              <p className="text-xs text-gray-600">Candidates answer conversational questions evaluated synchronously by Gemini.</p>
            </div>
            <div className="space-y-3 relative p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <h4 className="font-bold text-gray-900">Scorecard Calculation</h4>
              <p className="text-xs text-gray-600">System weighs geographic location, salary expectation, and expertise alignment scores.</p>
            </div>
            <div className="space-y-3 relative p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <h4 className="font-bold text-gray-900">Decision & Action</h4>
              <p className="text-xs text-gray-600">Recruiter reviews the categorized applicants, manages queue parameters, and filters talent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Pricing Plans</h2>
            <p className="text-gray-600">Choose a scale suited for your enterprise recruitment targets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <div className="p-8 border border-gray-200 rounded-2xl space-y-6 bg-white relative">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Free Starter</h4>
                <p className="text-xs text-gray-500 mt-1">Excellent for parsing personal profiles</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">$0</span>
                <span className="text-xs text-gray-500">forever</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Up to 2 open jobs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Simple local local storage draft</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>30 AI screenings total</span>
                </li>
              </ul>
              <button onClick={() => navigate('auth-login')} className="w-full text-xs font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800 transition">
                Get Started
              </button>
            </div>

            {/* Tier 2 */}
            <div className="p-8 border border-blue-200 rounded-2xl space-y-6 bg-blue-50/20 relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-[10px] uppercase py-0.5 px-2.5 rounded-full">
                Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Enterprise Pro</h4>
                <p className="text-xs text-gray-500 mt-1">Full recruiter pipeline automation</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">$299</span>
                <span className="text-xs text-gray-500">/mo</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Unlimited open positions & drafts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Real server-side Gemini interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Multi-candidate dashboard analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>CSV exporter & spreadsheet synchronization</span>
                </li>
              </ul>
              <button onClick={() => login('recruiter@qani.ai', 'recruiter')} className="w-full text-xs font-semibold py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md shadow-blue-500/10">
                Demo Recruitment Portal
              </button>
            </div>

            {/* Tier 3 */}
            <div className="p-8 border border-gray-200 rounded-2xl space-y-6 bg-white relative">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Enterprise Scale</h4>
                <p className="text-xs text-gray-500 mt-1">Unlimited pipelines & specialized finetuning</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">$999</span>
                <span className="text-xs text-gray-500">/mo</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Custom scoring rubric engines</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Direct Slack / HRIS API integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Dedicated support line</span>
                </li>
              </ul>
              <button onClick={() => navigate('help')} className="w-full text-xs font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-800 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100">
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">What hiring managers say:</h3>
          <p className="text-gray-600 text-sm">
            Hiring teams recover hundreds of engineering screening hours weekly by introducing automated scorecard categorization.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="text-left">
              <span className="text-lg font-bold text-gray-900 block">Sarah Chen</span>
              <span className="text-xs text-gray-500">Talent Acquisition, Acme</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1" />
        <div className="lg:col-span-6 relative flex items-center">
          <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200/50 italic text-gray-700 text-sm leading-relaxed relative flex gap-4">
            <Quote className="w-8 h-8 text-blue-300 shrink-0" />
            <p>
              "Using the Gemini AI recruitment integration, we reduced our timezone screening latency from 4 days to immediate completions. Candidates love the responsive interview layout!"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-12 px-6 sm:px-12 border-t border-gray-800/60 relative overflow-hidden">
        {/* Glowing subtle circular gradient backdrop */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-550/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-gray-800/60">
          
          {/* Brand/Logo column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
              <div className="relative flex items-center justify-center w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3 shadow-md group-hover:rotate-6 transition-all duration-300" />
                <div className="relative w-6.5 h-6.5 bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-black text-white text-xs tracking-tighter">
                  Q
                </div>
              </div>
              <span className="font-black text-white text-base tracking-tight group-hover:text-blue-400 transition">QANI Platform</span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Enterprise-grade AI candidate screening backed by absolute server protection. Evaluate, match, and hire top-tier talent with extreme visual clarity and speed.
            </p>

            {/* Social linkages indicator */}
            <div className="flex items-center gap-3.5 pt-2">
              <a href="#" className="p-2 bg-gray-900 border border-gray-800/80 hover:bg-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-lg transition" aria-label="LinkedIn Profile">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-900 border border-gray-800/80 hover:bg-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-lg transition" aria-label="Twitter Feed">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-900 border border-gray-800/80 hover:bg-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-lg transition" aria-label="GitHub Repository">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Candidate hub */}
          <div className="sm:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Candidate Hub</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('auth-login')} className="hover:text-blue-400 hover:underline transition">
                  Candidate Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('candidate-jobs')} className="hover:text-blue-400 hover:underline transition">
                  Browse Active Jobs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help')} className="hover:text-blue-400 hover:underline transition font-mono">
                  Screener Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Recruiter Hub */}
          <div className="sm:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Recruiter Hub</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => login('recruiter@qani.ai', 'recruiter')} className="hover:text-blue-400 hover:underline transition font-semibold text-blue-300">
                  Access Demo Recruiter Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help')} className="hover:text-blue-400 hover:underline transition">
                  Secure Proxy Details
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help')} className="hover:text-blue-400 hover:underline transition">
                  Evaluation Rubrics
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="lg:col-span-4 space-y-4 bg-gray-900/40 border border-gray-800/70 p-5 rounded-2xl">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Global System Updates</h5>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Stay updated on security guidelines, model upgrades, and new screening capabilities. No spam, ever.
            </p>
            
            {/* Subscription Box widget */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const emailInput = (e.currentTarget.elements.namedItem('footerEmail') as HTMLInputElement).value;
                if (emailInput) {
                  showToast(`Successfully subscribed ${emailInput} to QANI updates.`, 'success');
                  e.currentTarget.reset();
                }
              }}
              className="flex gap-2"
            >
              <input 
                name="footerEmail"
                type="email"
                required
                placeholder="developer@org.com"
                className="flex-grow h-9 bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg px-3 text-[11px] text-white transition outline-none"
              />
              <button 
                type="submit"
                className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition shrink-0 uppercase tracking-widest"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-mono text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span>© 2026 QANI Platform. All rights reserved.</span>
            <span className="hidden md:inline text-gray-800">|</span>
            <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-900/30 text-blue-400 py-1 px-3 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span>SSL SECURED BACKEND CHANNELS SHIELDED</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-blue-400 transition underline">Security Agreement</a>
            <a href="#" className="hover:text-blue-400 transition underline">SLA Index</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
