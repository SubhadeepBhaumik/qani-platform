import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useCMS } from '../admin/AdminCMS';
import {
  ArrowRight, Cpu, TrendingUp, Bolt, CheckCircle, ChevronRight,
  Quote, ShieldCheck, ChevronLeft, Sparkles, MapPin, DollarSign,
  Users, Briefcase, Star, Clock, Building2, Award, Zap
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const cms = useCMS();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badgeText: "Australia's #1 AI Recruitment Platform",
      badgeIcon: <Cpu className="w-3.5 h-3.5" />,
      titleLine1: "Let AI Screen Your",
      titleLine2: "Candidates 24/7",
      description: "QANI's AI recruiter interviews every candidate automatically — evaluating skills, salary fit, work rights, and location match. Recruiters get a scored shortlist instantly. No more manual phone screens.",
      gradient: "from-blue-50/70 via-white to-indigo-50/40",
      primaryText: "Apply as Candidate",
      primaryAction: () => navigate('auth-register-candidate-1'),
      secondaryText: "Start Recruiting Free",
      secondaryAction: () => navigate('auth-register-recruiter'),
      badgeBg: "bg-blue-50 border-blue-200/50 text-blue-700",
      accentBg: "bg-blue-600 hover:bg-blue-700",
      rightPanel: (
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border border-green-200/50">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>AI Interviewer Live</span>
          </div>
          <p className="text-xs font-bold uppercase text-blue-600 tracking-wider">Live AI Screening</p>
          <h4 className="text-sm font-semibold text-gray-900 mt-2">Senior React Developer — Sydney</h4>
          <div className="space-y-4 my-6">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs space-y-1">
              <span className="font-bold text-blue-800">QANI AI Recruiter:</span>
              <p className="text-gray-700">Can you describe your experience with high-performance React frontends and state management at scale?</p>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-xl text-xs text-right space-y-1 ml-6 shadow-sm">
              <span className="font-bold text-gray-900">Candidate:</span>
              <p className="text-gray-700">I've built React apps with 500k+ daily users using Redux + React Query with optimistic UI updates...</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-gray-500 block">AI Score</span>
              <span className="text-green-600 font-bold text-sm">QUALIFIED — 88/100</span>
            </div>
            <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer bg-blue-600 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg hover:bg-blue-700 transition">
              Try It Free
            </button>
          </div>
        </div>
      )
    },
    {
      badgeText: "Multi-Dimensional Candidate Scoring",
      badgeIcon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" />,
      titleLine1: "Score Every Candidate",
      titleLine2: "Across 5 Dimensions",
      description: "QANI automatically scores salary expectations, Australian work rights, location match, technical skills, and qualifications. Recruiters see a ranked shortlist — not a pile of resumes.",
      gradient: "from-indigo-50/70 via-white to-emerald-50/40",
      primaryText: "Post a Job Free",
      primaryAction: () => navigate('auth-register-recruiter'),
      secondaryText: "See How Scoring Works",
      secondaryAction: () => navigate('help'),
      badgeBg: "bg-indigo-50 border-indigo-200/50 text-indigo-700",
      accentBg: "bg-indigo-600 hover:bg-indigo-700",
      rightPanel: (
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 space-y-4 relative">
          <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-full border border-indigo-200/50">
            Scorecard
          </div>
          <p className="text-xs font-bold uppercase text-indigo-600 tracking-wider font-mono">Candidate Match Report</p>
          <h4 className="text-sm font-bold text-gray-900">Product Manager — Melbourne</h4>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Australian Work Rights', score: '100%', color: 'bg-emerald-500', width: 'w-full' },
              { label: 'Salary Expectations ($120k)', score: '92%', color: 'bg-emerald-500', width: 'w-[92%]' },
              { label: 'Technical Skills Match', score: '88%', color: 'bg-indigo-600', width: 'w-[88%]' },
              { label: 'Location (Melbourne CBD)', score: '95%', color: 'bg-emerald-500', width: 'w-[95%]' },
              { label: 'Qualifications Match', score: '75%', color: 'bg-orange-500', width: 'w-[75%]' },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-gray-700">
                  <span>{item.label}</span>
                  <span className="font-bold">{item.score}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} ${item.width}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50/50 p-2 text-indigo-900 border border-indigo-100 rounded-lg text-center font-bold text-xs">
            🎯 Overall Match Score: 90%
          </div>
        </div>
      )
    },
    {
      badgeText: "Built for Australian Recruitment Agencies",
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
      titleLine1: "Save 80% of Your",
      titleLine2: "Screening Time",
      description: "Australian recruitment agencies use QANI to screen 10x more candidates without hiring more staff. The AI works overnight — you wake up to a scored, ranked shortlist ready to present to clients.",
      gradient: "from-emerald-50/70 via-white to-blue-50/40",
      primaryText: "Start Free Trial",
      primaryAction: () => navigate('auth-register-recruiter'),
      secondaryText: "View Pricing",
      secondaryAction: () => {},
      badgeBg: "bg-emerald-50 border-emerald-200/50 text-emerald-700",
      accentBg: "bg-emerald-600 hover:bg-emerald-700",
      rightPanel: (
        <div className="w-full max-w-md bg-gray-950 text-emerald-400 border border-gray-800 rounded-2xl shadow-2xl p-6 font-mono space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span>QANI — AI RECRUITER ACTIVE</span>
          </div>
          <div className="text-[11px] space-y-2 text-gray-300">
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 space-y-1.5">
              <p className="text-emerald-400">✓ 47 candidates screened overnight</p>
              <p className="text-emerald-400">✓ 12 qualified for client presentation</p>
              <p className="text-emerald-400">✓ 8 rejected (salary mismatch)</p>
              <p className="text-emerald-400">✓ 27 under review</p>
              <p className="text-gray-500 text-[10px] mt-2">— Processed while you slept —</p>
            </div>
            <p className="text-gray-400 text-[10px]">Time saved vs manual screening: <span className="text-white font-bold">14.5 hours</span></p>
          </div>
          <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition">
            Start Recruiting Free →
          </button>
        </div>
      )
    }
  ];

  const topJobs = [
    { title: 'Senior React Developer', company: 'Atlassian', location: 'Sydney, NSW', salary: '$140k–$170k', type: 'Full-time', tags: ['React', 'TypeScript', 'AWS'] },
    { title: 'Product Manager', company: 'Canva', location: 'Melbourne, VIC', salary: '$120k–$150k', type: 'Full-time', tags: ['Agile', 'B2B', 'SaaS'] },
    { title: 'Data Scientist', company: 'Commonwealth Bank', location: 'Sydney, NSW', salary: '$130k–$160k', type: 'Full-time', tags: ['Python', 'ML', 'SQL'] },
    { title: 'DevOps Engineer', company: 'Seek', location: 'Remote, AUS', salary: '$120k–$145k', type: 'Remote', tags: ['Kubernetes', 'CI/CD', 'AWS'] },
    { title: 'UX Designer', company: 'REA Group', location: 'Melbourne, VIC', salary: '$95k–$120k', type: 'Hybrid', tags: ['Figma', 'Research', 'Design'] },
    { title: 'Backend Engineer', company: 'Afterpay', location: 'Brisbane, QLD', salary: '$125k–$155k', type: 'Full-time', tags: ['Go', 'Microservices', 'Postgres'] },
  ];

  const topCandidates = [
    { name: 'Sarah Chen', role: 'Full Stack Developer', location: 'Sydney', score: 94, skills: ['React', 'Node.js', 'AWS'], available: 'Immediately' },
    { name: 'James Okafor', role: 'Data Engineer', location: 'Melbourne', score: 91, skills: ['Python', 'Spark', 'BigQuery'], available: '2 weeks' },
    { name: 'Priya Sharma', role: 'Product Manager', location: 'Brisbane', score: 89, skills: ['Roadmapping', 'Agile', 'Analytics'], available: 'Immediately' },
    { name: 'Tom Williams', role: 'DevOps Engineer', location: 'Perth', score: 87, skills: ['Terraform', 'AWS', 'Docker'], available: '1 month' },
  ];

  const topRecruiters = [
    { company: 'TechTalent AU', location: 'Sydney', placements: 142, speciality: 'Tech & Engineering', rating: 4.9 },
    { company: 'Hays Australia', location: 'Melbourne', placements: 287, speciality: 'Finance & Accounting', rating: 4.8 },
    { company: 'Robert Half', location: 'Brisbane', placements: 198, speciality: 'IT & Digital', rating: 4.7 },
    { company: 'Michael Page', location: 'Perth', placements: 163, speciality: 'Executive Search', rating: 4.8 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">

      {/* Top banner */}
      {(cms.global?.announcementBarEnabled !== false) && (
      <div className="bg-blue-600 text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5" />
        <span>{cms.global?.announcementBar || "Australia's AI Recruitment Platform — Screen 10x more candidates with zero extra headcount."}</span>
        <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer underline font-bold ml-1 hover:text-blue-200 transition">Start free →</button>
      </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 h-16 px-6 sm:px-12 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl transform rotate-3 shadow-md group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-7 h-7 bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-extrabold text-white text-[13px]">Q</div>
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg text-gray-900 group-hover:text-blue-600 transition">QANI</span>
            <span className="text-[10px] text-gray-400 block -mt-1">{cms.global?.logoSubtext || "AI Recruitment · Australia"}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#jobs" className="cursor-pointer hover:text-blue-600 transition">Browse Jobs</a>
          <a href="#candidates" className="cursor-pointer hover:text-blue-600 transition">Top Candidates</a>
          <a href="#how" className="cursor-pointer hover:text-blue-600 transition">How It Works</a>
          <a href="#pricing" className="cursor-pointer hover:text-blue-600 transition">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('auth-login')} className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 font-semibold px-4 py-2 transition">
            Sign In
          </button>
          <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition hidden sm:block">
            Find Jobs
          </button>
          <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md shadow-blue-500/20">
            Start Recruiting
          </button>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className={`py-16 md:py-24 px-6 sm:px-12 bg-gradient-to-br ${slides[activeSlide].gradient} transition-all duration-700 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className={`inline-flex items-center gap-2 border rounded-full py-1.5 px-3.5 text-xs font-semibold ${slides[activeSlide].badgeBg} shadow-sm`}>
              {slides[activeSlide].badgeIcon}
              <span>{slides[activeSlide].badgeText}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {slides[activeSlide].titleLine1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {slides[activeSlide].titleLine2}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">{slides[activeSlide].description}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={slides[activeSlide].primaryAction} className={`cursor-pointer flex items-center justify-center gap-2 text-sm text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-xl ${slides[activeSlide].accentBg}`}>
                {slides[activeSlide].primaryText} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={slides[activeSlide].secondaryAction} className="cursor-pointer flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-xl transition shadow-sm">
                {slides[activeSlide].secondaryText} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setActiveSlide(p => (p - 1 + slides.length) % slides.length)} className="cursor-pointer w-9 h-9 border border-gray-200 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 rounded-lg transition flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() => setActiveSlide(idx)} className={`cursor-pointer h-2 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
              <button onClick={() => setActiveSlide(p => (p + 1) % slides.length)} className="cursor-pointer w-9 h-9 border border-gray-200 bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 rounded-lg transition flex items-center justify-center shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">{slides[activeSlide].rightPanel}</div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-y border-gray-200 py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2,400+', label: 'Active Job Listings' },
            { value: '18,000+', label: 'Screened Candidates' },
            { value: '340+', label: 'Australian Companies' },
            { value: '94%', label: 'Recruiter Satisfaction' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Job Opportunities */}
      <section id="jobs" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{cms.homepage?.jobs?.title || "Top Job Opportunities"}</h2>
            <p className="text-sm text-gray-500 mt-1">{cms.homepage?.jobs?.subtitle || "AI-screened positions from Australia's leading companies"}</p>
          </div>
          <button onClick={() => navigate('auth-login')} className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition">
            View all jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topJobs.map((job, i) => (
            <div key={i} onClick={() => navigate('auth-login')} className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${job.type === 'Remote' ? 'bg-green-50 text-green-700' : job.type === 'Hybrid' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                  {job.type}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{job.company}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 flex items-center gap-1"><Zap className="w-3 h-3 text-blue-500" />AI Screened</span>
                <span className="text-xs text-blue-600 font-semibold group-hover:underline">Apply Now →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Candidates */}
      <section id="candidates" className="py-20 px-6 sm:px-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top AI-Screened Candidates</h2>
              <p className="text-sm text-gray-500 mt-1">Pre-qualified talent ready for your shortlist</p>
            </div>
            <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition">
              Access all candidates <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {topCandidates.map((c, i) => (
              <div key={i} onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                    <Award className="w-3 h-3" />
                    {c.score}%
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{c.role}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <MapPin className="w-3 h-3" />{c.location}
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.skills.map(s => (
                    <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3" />Available: <span className="text-green-600 font-semibold">{c.available}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Recruiters */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{cms.homepage?.companies?.title || "Top Recruiting Companies"}</h2>
            <p className="text-sm text-gray-500 mt-1">{cms.homepage?.companies?.subtitle || "Australia's most active hirers using QANI AI"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {topRecruiters.map((r, i) => (
            <div key={i} onClick={() => navigate('auth-login')} className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition group">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4">
                {r.company[0]}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{r.company}</h3>
              <p className="text-xs text-gray-500 mt-1">{r.speciality}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <MapPin className="w-3 h-3" />{r.location}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs">
                <span className="text-gray-500"><span className="font-bold text-gray-900">{r.placements}</span> placed</span>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-3 h-3 fill-yellow-400" />{r.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">{cms.homepage?.features?.title || "Why Australian Recruiters Choose QANI"}</h2>
            <p className="text-gray-500">{cms.homepage?.features?.subtitle || "Stop spending 80% of your time on first-round phone screens. Let the AI do it."}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="w-6 h-6" />, title: 'AI Conducts The Interview', desc: 'QANI\'s conversational AI asks your custom questions, understands nuanced answers, and scores every candidate automatically — 24 hours a day.' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Instant Ranked Shortlist', desc: 'Wake up to a ranked list of candidates scored on salary fit, work rights, location, qualifications, and technical skills. No more resume piles.' },
              { icon: <Bolt className="w-6 h-6" />, title: 'Australian Work Rights Check', desc: 'QANI automatically screens for Australian citizenship, PR, and visa status so only work-eligible candidates reach your shortlist.' },
            ].map(f => (
              <div key={f.title} className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center space-y-3 max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{cms.homepage?.howItWorks?.title || "How QANI Works"}</h2>
          <p className="text-gray-500">{cms.homepage?.howItWorks?.subtitle || "From job post to qualified shortlist in under 24 hours."}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: '1', title: 'Post Your Job', desc: 'Recruiter creates a job posting with salary range, location, work rights requirements, and custom screening questions.' },
            { n: '2', title: 'AI Screens Candidates', desc: 'Every applicant gets a conversational AI interview. QANI asks your questions, understands the answers, and scores them.' },
            { n: '3', title: 'Scorecard Generated', desc: 'Each candidate gets a detailed scorecard — salary fit, work rights, location, qualifications, and skills ranked 0–100.' },
            { n: '4', title: 'You Review & Hire', desc: 'Recruiter reviews the ranked shortlist and takes action — progress, hold for review, or reject — with one click.' },
          ].map(s => (
            <div key={s.n} className="space-y-3 p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{s.n}</div>
              <h4 className="font-bold text-gray-900">{s.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">{cms.homepage?.pricing?.title || "Simple, Transparent Pricing"}</h2>
            <p className="text-gray-500">{cms.homepage?.pricing?.subtitle || "No per-candidate fees. No hidden costs. Scale as you grow."}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '$0', period: 'forever', desc: 'For individual recruiters testing QANI', features: ['2 active job postings', '30 AI screenings/month', 'Basic scorecard reports', 'Email support'], cta: 'Get Started Free', action: () => navigate('auth-register-recruiter'), highlight: false },
              { name: 'Professional', price: '$299', period: '/month', desc: 'For growing recruitment agencies', features: ['Unlimited job postings', '500 AI screenings/month', 'Full scorecard analytics', 'Work rights verification', 'CSV export & ATS sync', 'Priority support'], cta: 'Start Free Trial', action: () => navigate('auth-register-recruiter'), highlight: true },
              { name: 'Enterprise', price: '$999', period: '/month', desc: 'For large agencies & in-house teams', features: ['Everything in Professional', 'Unlimited AI screenings', 'Custom scoring rubrics', 'Slack & HRIS integration', 'Dedicated account manager', 'SLA guarantee'], cta: 'Contact Sales', action: () => navigate('help'), highlight: false },
            ].map(plan => (
              <div key={plan.name} className={`p-8 rounded-2xl space-y-6 relative ${plan.highlight ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 scale-105' : 'bg-white border border-gray-200'}`}>
                {plan.highlight && <div className="absolute top-4 right-4 bg-white text-blue-600 font-bold text-[10px] uppercase py-0.5 px-2.5 rounded-full">Most Popular</div>}
                <div>
                  <h4 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h4>
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={`text-xs ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-xs ${plan.highlight ? 'text-blue-50' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={plan.action} className={`cursor-pointer w-full text-sm font-semibold py-2.5 px-4 rounded-xl transition ${plan.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'border border-gray-300 hover:bg-gray-50 text-gray-800'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">What Australian recruiters say</h3>
            <p className="text-gray-500 text-sm">Real results from real recruitment agencies using QANI.</p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">{(cms.homepage?.testimonial?.author || "Sarah Chen").split(' ').map((n: string) => n[0]).join('')}</div>
              <div>
                <span className="text-sm font-bold text-gray-900 block">{cms.homepage?.testimonial?.author || "Sarah Chen"}</span>
                <span className="text-xs text-gray-500">{cms.homepage?.testimonial?.role || "Head of Talent — Atlassian"}</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 italic text-gray-700 text-sm leading-relaxed flex gap-4 items-start">
            <Quote className="w-8 h-8 text-blue-300 shrink-0 mt-1" />
            <p>"{cms.homepage?.testimonial?.quote || "QANI cut our time-to-shortlist from 4 days to 6 hours. The AI asks better screening questions than most of our junior recruiters."}"</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 sm:px-12 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">{cms.homepage?.cta?.title || "Ready to hire smarter?"}</h2>
          <p className="text-blue-100 text-lg">{cms.homepage?.cta?.subtitle || "Join 340+ Australian companies screening candidates with AI. Start free, no credit card required."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer bg-white text-blue-600 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition shadow-lg text-sm">
              Start Recruiting Free →
            </button>
            <button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer bg-transparent border-2 border-white text-white font-bold py-3.5 px-8 rounded-xl hover:bg-white/10 transition text-sm">
              I'm a Candidate
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-12 px-6 sm:px-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('landing')}>
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3" />
                <div className="relative w-full h-full bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-black text-white text-xs">Q</div>
              </div>
              <div>
                <span className="font-black text-white text-base">QANI Platform</span>
                <span className="text-[10px] text-gray-500 block">{cms.global?.logoSubtext || "AI Recruitment · Australia"}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">{cms.footer?.tagline || "Australia's leading AI recruitment platform. Screen more candidates, faster, with zero extra headcount."}</p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">For Candidates</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('auth-register-candidate-1')} className="cursor-pointer hover:text-blue-400 transition">Create Profile</button></li>
              <li><button onClick={() => navigate('auth-login')} className="cursor-pointer hover:text-blue-400 transition">Browse Jobs</button></li>
              <li><button onClick={() => navigate('help')} className="cursor-pointer hover:text-blue-400 transition">How Screening Works</button></li>
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">For Recruiters</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => navigate('auth-register-recruiter')} className="cursor-pointer hover:text-blue-400 transition">Start Free Trial</button></li>
              <li><button onClick={() => navigate('help')} className="cursor-pointer hover:text-blue-400 transition">How AI Scoring Works</button></li>
              <li><button onClick={() => navigate('help')} className="cursor-pointer hover:text-blue-400 transition">Pricing Plans</button></li>
            </ul>
          </div>
          <div className="lg:col-span-4 space-y-4 bg-gray-900/40 border border-gray-800 p-5 rounded-2xl">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider">Stay Updated</h5>
            <p className="text-[11px] text-gray-400">New features, hiring tips, and AI recruitment insights. No spam.</p>
            <form onSubmit={e => { e.preventDefault(); showToast('Subscribed!', 'success'); (e.target as HTMLFormElement).reset(); }} className="flex gap-2">
              <input name="email" type="email" required placeholder="you@company.com.au" className="flex-grow h-9 bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-lg px-3 text-[11px] text-white outline-none transition" />
              <button type="submit" className="cursor-pointer h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <span>{cms.footer?.copyright || "© 2026 QANI Platform Pty Ltd. ABN 00 000 000 000. All rights reserved."}</span>
          <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-900/30 text-blue-400 py-1 px-3 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
