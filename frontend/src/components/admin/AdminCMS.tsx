import { useState, useEffect, useCallback, useRef } from 'react';
import { Globe, Layout, LogIn, Users, Briefcase, HelpCircle, ChevronDown, ChevronRight, Eye, EyeOff, Save, RotateCcw, FileText, Layers, Plus, Trash2, AlertCircle, CheckCircle, AlignLeft, Link, Menu } from 'lucide-react';

const CMS_KEY = 'qani_cms_v2';

const DEFAULT_CMS = {
  global: {
    logoText: 'QANI',
    logoSubtext: "AI Recruitment · Australia",
    announcementBar: "🚀 QANI is now live in Australia — AI screening that works 24/7",
    announcementBarEnabled: true,
    headerCtaText: 'Start Recruiting Free',
    footerTagline: "Australia's AI-powered recruitment platform. Screening candidates 24/7 so you don't have to.",
    footerCopyright: '© 2026 QANI. All rights reserved.',
    navLinks: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'For Candidates', href: '#candidates' },
    ],
  },
  homepage: {
    hero: {
      enabled: true,
      badge: "Australia's #1 AI Recruitment Platform",
      title: 'Let AI Screen Your Candidates 24/7',
      subtitle: 'QANI conducts intelligent screening interviews, scores candidates automatically, and delivers a ranked shortlist — so you only talk to the best.',
      primaryButtonText: 'Apply as Candidate',
      secondaryButtonText: 'Start Recruiting Free',
      backgroundImage: '',
      backgroundVideo: '',
    },
    features: {
      enabled: true,
      title: 'Why Recruiters Love QANI',
      subtitle: 'Built for Australian recruitment teams who want to move faster without sacrificing quality.',
      items: [
        { icon: '🤖', title: 'AI-Powered Screening', description: 'GPT-4o conducts natural, intelligent interviews 24/7.' },
        { icon: '⚡', title: 'Instant Shortlists', description: 'Ranked candidates delivered automatically with full scorecards.' },
        { icon: '🎯', title: 'Custom Criteria', description: 'Set your own scoring weights for work rights, salary, location and skills.' },
        { icon: '📊', title: 'Deep Analytics', description: 'Real-time pipeline insights and conversion analytics.' },
      ],
    },
    jobs: { enabled: true, title: 'Top Job Opportunities', subtitle: 'AI-screened candidates are applying right now.' },
    candidates: { enabled: true, title: 'Top AI-Screened Candidates', subtitle: 'Ready to hire — verified skills, real screening transcripts.' },
    companies: { enabled: true, title: 'Top Recruiting Companies', subtitle: "Join Australia's leading organisations using QANI." },
    howItWorks: {
      enabled: true,
      title: 'How QANI Works',
      subtitle: 'From job posting to qualified shortlist in minutes.',
      steps: [
        { step: '1', title: 'Post Your Job', description: 'Create a job with custom screening criteria and AI questions.' },
        { step: '2', title: 'AI Screens Candidates', description: 'QANI conducts intelligent interviews 24/7 on your behalf.' },
        { step: '3', title: 'Get Your Shortlist', description: 'Receive a ranked, scored list of the best candidates.' },
      ],
    },
    pricing: {
      enabled: true,
      title: 'Simple, Transparent Pricing',
      subtitle: 'Start free. Scale as you grow.',
      starter: {
        name: 'Starter', price: '$0', period: '/month',
        description: 'Perfect for small teams hiring occasionally.',
        features: ['3 active jobs', '50 AI screenings/month', 'Basic scorecards', 'Email support'],
        ctaText: 'Get Started Free', highlighted: false,
      },
      professional: {
        name: 'Professional', price: '$299', period: '/month',
        description: 'For growing recruitment teams.',
        features: ['Unlimited jobs', '500 AI screenings/month', 'Advanced analytics', 'Priority support', 'Custom branding', 'Team collaboration'],
        ctaText: 'Start Free Trial', highlighted: true,
      },
      enterprise: {
        name: 'Enterprise', price: '$999', period: '/month',
        description: 'For large organisations with complex needs.',
        features: ['Unlimited everything', 'Dedicated AI model', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager', 'White-label option'],
        ctaText: 'Contact Sales', highlighted: false,
      },
    },
    testimonial: {
      enabled: true,
      quote: 'QANI cut our time-to-hire from 3 weeks to 4 days. The AI screening is remarkably good — candidates actually enjoy the process.',
      author: 'Sarah Chen', role: 'Head of Talent, Atlassian Australia', avatar: '',
    },
    cta: {
      enabled: true,
      title: 'Ready to hire smarter?',
      subtitle: 'Join 500+ Australian companies using QANI to find better candidates, faster.',
      primaryButtonText: 'Start Recruiting Free',
      secondaryButtonText: 'See a Demo',
    },
  },
  loginPage: { tagline: 'Welcome back to QANI', subtagline: 'Your AI recruitment platform', backgroundImage: '' },
  registerCandidate: {
    title: 'Join as a Candidate',
    subtitle: 'Create your profile and get AI-screened for top Australian jobs.',
    step1Title: 'Your Details', step2Title: 'Your Profile',
  },
  registerRecruiter: {
    title: 'Start Recruiting with AI',
    subtitle: "Post jobs and let QANI's AI screen candidates 24/7.",
  },
  candidatePortal: {
    dashboardTitle: 'My Dashboard',
    dashboardWelcome: 'Welcome back',
    jobsTitle: 'Browse Jobs',
    jobsSubtitle: 'AI-screened opportunities matched for you.',
    screeningTitle: 'AI Screening',
    screeningIntro: "Hi! I'm QANI, your AI recruitment interviewer. I'll ask you a series of questions to match you with the right role. Please answer honestly — there are no trick questions.",
    profileTitle: 'My Profile',
  },
  recruiterPortal: {
    dashboardTitle: 'Recruiter Dashboard',
    dashboardWelcome: 'Welcome back',
    applicationsTitle: 'Applications',
    jobsTitle: 'My Jobs',
    queueTitle: 'Screening Queue',
    reportsTitle: 'Reports & Analytics',
    teamTitle: 'Team Management',
  },
  helpPage: {
    title: 'Help & Support',
    subtitle: 'Find answers to common questions about QANI.',
    faqs: [
      { question: 'How does AI screening work?', answer: 'QANI uses GPT-4o to conduct natural language interviews. The AI asks job-specific questions, evaluates responses in real-time, and scores candidates across 5 key dimensions.' },
      { question: 'How long does a screening take?', answer: 'Most screenings take 10-20 minutes depending on the number of questions configured by the recruiter.' },
      { question: 'Can I customise the screening questions?', answer: 'Yes! Recruiters can add custom questions, set question order, and configure scoring weights for each job role.' },
      { question: 'How is the score calculated?', answer: 'Candidates are scored across Work Rights, Salary Alignment, Location Match, Technical Skills, and Qualifications. Each dimension has a recruiter-set weight.' },
      { question: 'Is my data safe?', answer: 'All data is encrypted at rest and in transit. QANI is compliant with Australian Privacy Principles (APPs).' },
    ],
  },
  header: {
    logoText: 'QANI',
    logoSubtext: 'AI Recruitment · Australia',
    logoIcon: 'Q',
    logoImage: '',
    primaryMenu: [
      { label: 'Features', href: '#features', enabled: true },
      { label: 'How It Works', href: '#how-it-works', enabled: true },
      { label: 'Pricing', href: '#pricing', enabled: true },
      { label: 'For Candidates', href: '#candidates', enabled: true },
    ],
    ctaText: 'Start Recruiting Free',
    ctaEnabled: true,
    loginLinkText: 'Log In',
    sticky: true,
  },
  footer: {
    tagline: "Australia's AI-powered recruitment platform. Screening candidates 24/7 so you don't have to.",
    copyright: '© 2026 QANI Platform Pty Ltd. ABN 00 000 000 000. All rights reserved.',
    col1Title: 'For Candidates',
    col1Links: [
      { label: 'Create Profile', href: 'auth-register-candidate-1', enabled: true },
      { label: 'Browse Jobs', href: 'auth-login', enabled: true },
      { label: 'How Screening Works', href: 'help', enabled: true },
    ],
    col2Title: 'For Recruiters',
    col2Links: [
      { label: 'Start Free Trial', href: 'auth-register-recruiter', enabled: true },
      { label: 'How AI Scoring Works', href: 'help', enabled: true },
      { label: 'Pricing Plans', href: 'help', enabled: true },
    ],
    newsletterEnabled: true,
    newsletterTitle: 'Stay Updated',
    newsletterSubtitle: 'New features, hiring tips, and AI recruitment insights. No spam.',
    showSystemStatus: true,
  },
  seo: {
    metaTitle: 'QANI — AI Recruitment Platform · Australia',
    metaDescription: 'AI conducts candidate screening interviews 24/7. Get a ranked shortlist instantly. Built for Australian recruitment teams.',
    ogImage: '', keywords: 'AI recruitment, Australia, candidate screening, automated interviews, hiring',
  },
  contact: {
    email: 'hello@qani.io', phone: '+61 2 9000 0000', address: 'Sydney, NSW, Australia',
    linkedin: 'https://linkedin.com/company/qani', twitter: 'https://twitter.com/qani_io',
  },
};

function useCMSStore() {
  const [cms, setCms] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_KEY);
      if (saved) return { ...DEFAULT_CMS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_CMS;
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const update = useCallback((path: string[], value: unknown) => {
    setCms(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj: any = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
    setDirty(true);
  }, []);

  const save = useCallback(() => {
    setCms(prev => { localStorage.setItem(CMS_KEY, JSON.stringify(prev)); return prev; });
    setSavedAt(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }));
    setDirty(false);
    window.dispatchEvent(new StorageEvent('storage', { key: CMS_KEY }));
  }, []);

  const reset = useCallback(() => {
    setCms(DEFAULT_CMS);
    localStorage.setItem(CMS_KEY, JSON.stringify(DEFAULT_CMS));
    setSavedAt(null);
    setDirty(false);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => save(), 2000);
    return () => clearTimeout(t);
  }, [cms, dirty, save]);

  return { cms, update, save, reset, savedAt, dirty };
}

function Field({ label, value, onChange, placeholder, multiline, rows = 3, hint }: any) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-9 bg-gray-800 border border-gray-700 rounded-lg px-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500" />
      )}
      {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

function Toggle({ label, value, onChange, description }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800">
      <div>
        <p className="text-sm text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${value ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function SectionToggle({ title, enabled, onToggle }: any) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
      <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
      <button onClick={() => onToggle(!enabled)}
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors ${enabled ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
        {enabled ? <Eye size={11} /> : <EyeOff size={11} />}
        {enabled ? 'Visible' : 'Hidden'}
      </button>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-800 rounded-xl mb-3 overflow-hidden">
      <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-800/50 transition-colors cursor-pointer"
        onClick={() => setOpen(o => !o)}>
        {title}
        {open ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
      </button>
      {open && <div className="px-4 pb-4 pt-2 border-t border-gray-800">{children}</div>}
    </div>
  );
}

function GlobalEditor({ cms, update }: any) {
  const g = cms.global;
  return (
    <div>
      <Accordion title="Logo & Branding" defaultOpen>
        <Field label="Logo Text" value={g.logoText} onChange={(v: string) => update(['global', 'logoText'], v)} />
        <Field label="Logo Subtext" value={g.logoSubtext} onChange={(v: string) => update(['global', 'logoSubtext'], v)} />
      </Accordion>
      <Accordion title="Announcement Bar">
        <Toggle label="Show Announcement Bar" value={g.announcementBarEnabled} onChange={(v: boolean) => update(['global', 'announcementBarEnabled'], v)} />
        <div className="mt-3">
          <Field label="Message" value={g.announcementBar} onChange={(v: string) => update(['global', 'announcementBar'], v)} multiline rows={2} />
        </div>
      </Accordion>
      <Accordion title="Navigation">
        <Field label="Header CTA Button Text" value={g.headerCtaText} onChange={(v: string) => update(['global', 'headerCtaText'], v)} />
        <p className="text-xs text-gray-500 mb-2 mt-2">Nav Links</p>
        {g.navLinks.map((link: any, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={link.label} onChange={e => { const l = [...g.navLinks]; l[i] = { ...l[i], label: e.target.value }; update(['global', 'navLinks'], l); }}
              placeholder="Label" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <input value={link.href} onChange={e => { const l = [...g.navLinks]; l[i] = { ...l[i], href: e.target.value }; update(['global', 'navLinks'], l); }}
              placeholder="#section" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
          </div>
        ))}
      </Accordion>
      <Accordion title="Footer">
        <Field label="Footer Tagline" value={g.footerTagline} onChange={(v: string) => update(['global', 'footerTagline'], v)} multiline rows={2} />
        <Field label="Copyright Text" value={g.footerCopyright} onChange={(v: string) => update(['global', 'footerCopyright'], v)} />
      </Accordion>
    </div>
  );
}

function HomepageEditor({ cms, update }: any) {
  const hp = cms.homepage;
  return (
    <div>
      <Accordion title="Hero Section" defaultOpen>
        <SectionToggle title="Hero" enabled={hp.hero.enabled} onToggle={(v: boolean) => update(['homepage', 'hero', 'enabled'], v)} />
        <Field label="Badge Text" value={hp.hero.badge} onChange={(v: string) => update(['homepage', 'hero', 'badge'], v)} />
        <Field label="Main Headline" value={hp.hero.title} onChange={(v: string) => update(['homepage', 'hero', 'title'], v)} multiline rows={2} />
        <Field label="Subtitle" value={hp.hero.subtitle} onChange={(v: string) => update(['homepage', 'hero', 'subtitle'], v)} multiline rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary Button" value={hp.hero.primaryButtonText} onChange={(v: string) => update(['homepage', 'hero', 'primaryButtonText'], v)} />
          <Field label="Secondary Button" value={hp.hero.secondaryButtonText} onChange={(v: string) => update(['homepage', 'hero', 'secondaryButtonText'], v)} />
        </div>
        <Field label="Background Image URL" value={hp.hero.backgroundImage} onChange={(v: string) => update(['homepage', 'hero', 'backgroundImage'], v)} placeholder="https://..." />
        <Field label="Background Video URL" value={hp.hero.backgroundVideo} onChange={(v: string) => update(['homepage', 'hero', 'backgroundVideo'], v)} placeholder="YouTube/Vimeo embed URL" />
      </Accordion>
      <Accordion title="Features Section">
        <SectionToggle title="Features" enabled={hp.features.enabled} onToggle={(v: boolean) => update(['homepage', 'features', 'enabled'], v)} />
        <Field label="Title" value={hp.features.title} onChange={(v: string) => update(['homepage', 'features', 'title'], v)} />
        <Field label="Subtitle" value={hp.features.subtitle} onChange={(v: string) => update(['homepage', 'features', 'subtitle'], v)} multiline rows={2} />
        <p className="text-xs text-gray-500 mb-2 mt-2">Feature Cards</p>
        {hp.features.items.map((item: any, i: number) => (
          <div key={i} className="border border-gray-700 rounded-lg p-3 mb-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Field label="Icon (emoji)" value={item.icon} onChange={(v: string) => { const items = [...hp.features.items]; items[i] = { ...items[i], icon: v }; update(['homepage', 'features', 'items'], items); }} />
              <Field label="Title" value={item.title} onChange={(v: string) => { const items = [...hp.features.items]; items[i] = { ...items[i], title: v }; update(['homepage', 'features', 'items'], items); }} />
            </div>
            <Field label="Description" value={item.description} onChange={(v: string) => { const items = [...hp.features.items]; items[i] = { ...items[i], description: v }; update(['homepage', 'features', 'items'], items); }} />
          </div>
        ))}
      </Accordion>
      <Accordion title="Jobs Section">
        <SectionToggle title="Top Jobs" enabled={hp.jobs.enabled} onToggle={(v: boolean) => update(['homepage', 'jobs', 'enabled'], v)} />
        <Field label="Title" value={hp.jobs.title} onChange={(v: string) => update(['homepage', 'jobs', 'title'], v)} />
        <Field label="Subtitle" value={hp.jobs.subtitle} onChange={(v: string) => update(['homepage', 'jobs', 'subtitle'], v)} />
      </Accordion>
      <Accordion title="Candidates Section">
        <SectionToggle title="Top Candidates" enabled={hp.candidates.enabled} onToggle={(v: boolean) => update(['homepage', 'candidates', 'enabled'], v)} />
        <Field label="Title" value={hp.candidates.title} onChange={(v: string) => update(['homepage', 'candidates', 'title'], v)} />
        <Field label="Subtitle" value={hp.candidates.subtitle} onChange={(v: string) => update(['homepage', 'candidates', 'subtitle'], v)} />
      </Accordion>
      <Accordion title="How It Works">
        <SectionToggle title="How It Works" enabled={hp.howItWorks.enabled} onToggle={(v: boolean) => update(['homepage', 'howItWorks', 'enabled'], v)} />
        <Field label="Title" value={hp.howItWorks.title} onChange={(v: string) => update(['homepage', 'howItWorks', 'title'], v)} />
        <Field label="Subtitle" value={hp.howItWorks.subtitle} onChange={(v: string) => update(['homepage', 'howItWorks', 'subtitle'], v)} />
        {hp.howItWorks.steps.map((step: any, i: number) => (
          <div key={i} className="border border-gray-700 rounded-lg p-3 mb-2">
            <p className="text-xs text-gray-500 mb-2">Step {i + 1}</p>
            <Field label="Title" value={step.title} onChange={(v: string) => { const steps = [...hp.howItWorks.steps]; steps[i] = { ...steps[i], title: v }; update(['homepage', 'howItWorks', 'steps'], steps); }} />
            <Field label="Description" value={step.description} onChange={(v: string) => { const steps = [...hp.howItWorks.steps]; steps[i] = { ...steps[i], description: v }; update(['homepage', 'howItWorks', 'steps'], steps); }} />
          </div>
        ))}
      </Accordion>
      <Accordion title="Pricing Section">
        <SectionToggle title="Pricing" enabled={hp.pricing.enabled} onToggle={(v: boolean) => update(['homepage', 'pricing', 'enabled'], v)} />
        <Field label="Title" value={hp.pricing.title} onChange={(v: string) => update(['homepage', 'pricing', 'title'], v)} />
        <Field label="Subtitle" value={hp.pricing.subtitle} onChange={(v: string) => update(['homepage', 'pricing', 'subtitle'], v)} />
        {(['starter', 'professional', 'enterprise'] as const).map(tier => (
          <div key={tier} className="border border-gray-700 rounded-lg p-3 mb-2">
            <p className="text-xs font-medium text-gray-300 capitalize mb-2">{tier} Plan</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Plan Name" value={hp.pricing[tier].name} onChange={(v: string) => update(['homepage', 'pricing', tier, 'name'], v)} />
              <Field label="Price" value={hp.pricing[tier].price} onChange={(v: string) => update(['homepage', 'pricing', tier, 'price'], v)} />
            </div>
            <Field label="Description" value={hp.pricing[tier].description} onChange={(v: string) => update(['homepage', 'pricing', tier, 'description'], v)} />
            <Field label="CTA Button Text" value={hp.pricing[tier].ctaText} onChange={(v: string) => update(['homepage', 'pricing', tier, 'ctaText'], v)} />
            <p className="text-xs text-gray-500 mb-1 mt-2">Features (one per line)</p>
            <textarea value={hp.pricing[tier].features.join('\n')} onChange={e => update(['homepage', 'pricing', tier, 'features'], e.target.value.split('\n').filter(Boolean))} rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        ))}
      </Accordion>
      <Accordion title="Testimonial">
        <SectionToggle title="Testimonial" enabled={hp.testimonial.enabled} onToggle={(v: boolean) => update(['homepage', 'testimonial', 'enabled'], v)} />
        <Field label="Quote" value={hp.testimonial.quote} onChange={(v: string) => update(['homepage', 'testimonial', 'quote'], v)} multiline rows={3} />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Author Name" value={hp.testimonial.author} onChange={(v: string) => update(['homepage', 'testimonial', 'author'], v)} />
          <Field label="Role / Company" value={hp.testimonial.role} onChange={(v: string) => update(['homepage', 'testimonial', 'role'], v)} />
        </div>
        <Field label="Author Avatar URL" value={hp.testimonial.avatar} onChange={(v: string) => update(['homepage', 'testimonial', 'avatar'], v)} placeholder="https://..." />
      </Accordion>
      <Accordion title="CTA Banner">
        <SectionToggle title="CTA Banner" enabled={hp.cta.enabled} onToggle={(v: boolean) => update(['homepage', 'cta', 'enabled'], v)} />
        <Field label="Title" value={hp.cta.title} onChange={(v: string) => update(['homepage', 'cta', 'title'], v)} />
        <Field label="Subtitle" value={hp.cta.subtitle} onChange={(v: string) => update(['homepage', 'cta', 'subtitle'], v)} multiline rows={2} />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Primary Button" value={hp.cta.primaryButtonText} onChange={(v: string) => update(['homepage', 'cta', 'primaryButtonText'], v)} />
          <Field label="Secondary Button" value={hp.cta.secondaryButtonText} onChange={(v: string) => update(['homepage', 'cta', 'secondaryButtonText'], v)} />
        </div>
      </Accordion>
    </div>
  );
}

function AuthEditor({ cms, update }: any) {
  return (
    <div>
      <Accordion title="Login Page" defaultOpen>
        <Field label="Tagline" value={cms.loginPage.tagline} onChange={(v: string) => update(['loginPage', 'tagline'], v)} />
        <Field label="Sub-tagline" value={cms.loginPage.subtagline} onChange={(v: string) => update(['loginPage', 'subtagline'], v)} />
        <Field label="Background Image URL" value={cms.loginPage.backgroundImage} onChange={(v: string) => update(['loginPage', 'backgroundImage'], v)} placeholder="https://..." />
      </Accordion>
      <Accordion title="Register — Candidate">
        <Field label="Page Title" value={cms.registerCandidate.title} onChange={(v: string) => update(['registerCandidate', 'title'], v)} />
        <Field label="Subtitle" value={cms.registerCandidate.subtitle} onChange={(v: string) => update(['registerCandidate', 'subtitle'], v)} multiline rows={2} />
        <Field label="Step 1 Title" value={cms.registerCandidate.step1Title} onChange={(v: string) => update(['registerCandidate', 'step1Title'], v)} />
        <Field label="Step 2 Title" value={cms.registerCandidate.step2Title} onChange={(v: string) => update(['registerCandidate', 'step2Title'], v)} />
      </Accordion>
      <Accordion title="Register — Recruiter">
        <Field label="Page Title" value={cms.registerRecruiter.title} onChange={(v: string) => update(['registerRecruiter', 'title'], v)} />
        <Field label="Subtitle" value={cms.registerRecruiter.subtitle} onChange={(v: string) => update(['registerRecruiter', 'subtitle'], v)} multiline rows={2} />
      </Accordion>
    </div>
  );
}

function CandidateEditor({ cms, update }: any) {
  const cp = cms.candidatePortal;
  return (
    <div>
      <Accordion title="Dashboard" defaultOpen>
        <Field label="Dashboard Title" value={cp.dashboardTitle} onChange={(v: string) => update(['candidatePortal', 'dashboardTitle'], v)} />
        <Field label="Welcome Message" value={cp.dashboardWelcome} onChange={(v: string) => update(['candidatePortal', 'dashboardWelcome'], v)} hint='Shown as "{message}, FirstName"' />
      </Accordion>
      <Accordion title="Browse Jobs Page">
        <Field label="Page Title" value={cp.jobsTitle} onChange={(v: string) => update(['candidatePortal', 'jobsTitle'], v)} />
        <Field label="Subtitle" value={cp.jobsSubtitle} onChange={(v: string) => update(['candidatePortal', 'jobsSubtitle'], v)} />
      </Accordion>
      <Accordion title="AI Screening Page">
        <Field label="Page Title" value={cp.screeningTitle} onChange={(v: string) => update(['candidatePortal', 'screeningTitle'], v)} />
        <Field label="AI Intro Message" value={cp.screeningIntro} onChange={(v: string) => update(['candidatePortal', 'screeningIntro'], v)} multiline rows={4} hint="First message shown from AI in screening chat." />
      </Accordion>
      <Accordion title="Profile Page">
        <Field label="Page Title" value={cp.profileTitle} onChange={(v: string) => update(['candidatePortal', 'profileTitle'], v)} />
      </Accordion>
    </div>
  );
}

function RecruiterEditor({ cms, update }: any) {
  const rp = cms.recruiterPortal;
  return (
    <div>
      <Accordion title="Dashboard" defaultOpen>
        <Field label="Dashboard Title" value={rp.dashboardTitle} onChange={(v: string) => update(['recruiterPortal', 'dashboardTitle'], v)} />
        <Field label="Welcome Message" value={rp.dashboardWelcome} onChange={(v: string) => update(['recruiterPortal', 'dashboardWelcome'], v)} />
      </Accordion>
      <Accordion title="Page Titles">
        <Field label="Applications" value={rp.applicationsTitle} onChange={(v: string) => update(['recruiterPortal', 'applicationsTitle'], v)} />
        <Field label="Jobs" value={rp.jobsTitle} onChange={(v: string) => update(['recruiterPortal', 'jobsTitle'], v)} />
        <Field label="Screening Queue" value={rp.queueTitle} onChange={(v: string) => update(['recruiterPortal', 'queueTitle'], v)} />
        <Field label="Reports" value={rp.reportsTitle} onChange={(v: string) => update(['recruiterPortal', 'reportsTitle'], v)} />
        <Field label="Team" value={rp.teamTitle} onChange={(v: string) => update(['recruiterPortal', 'teamTitle'], v)} />
      </Accordion>
    </div>
  );
}

function HelpEditor({ cms, update }: any) {
  const hp = cms.helpPage;
  return (
    <div>
      <Accordion title="Page Header" defaultOpen>
        <Field label="Page Title" value={hp.title} onChange={(v: string) => update(['helpPage', 'title'], v)} />
        <Field label="Subtitle" value={hp.subtitle} onChange={(v: string) => update(['helpPage', 'subtitle'], v)} />
      </Accordion>
      <Accordion title="FAQ Items" defaultOpen>
        {hp.faqs.map((faq: any, i: number) => (
          <div key={i} className="border border-gray-700 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">FAQ {i + 1}</p>
              <button onClick={() => update(['helpPage', 'faqs'], hp.faqs.filter((_: any, j: number) => j !== i))} className="text-red-500 hover:text-red-400 cursor-pointer"><Trash2 size={12} /></button>
            </div>
            <Field label="Question" value={faq.question} onChange={(v: string) => { const f = [...hp.faqs]; f[i] = { ...f[i], question: v }; update(['helpPage', 'faqs'], f); }} />
            <Field label="Answer" value={faq.answer} onChange={(v: string) => { const f = [...hp.faqs]; f[i] = { ...f[i], answer: v }; update(['helpPage', 'faqs'], f); }} multiline rows={3} />
          </div>
        ))}
        <button onClick={() => update(['helpPage', 'faqs'], [...hp.faqs, { question: 'New Question', answer: 'Answer here' }])}
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-2">
          <Plus size={12} /> Add FAQ
        </button>
      </Accordion>
    </div>
  );
}

function SeoEditor({ cms, update }: any) {
  return (
    <div>
      <Accordion title="SEO Meta Tags" defaultOpen>
        <Field label="Meta Title" value={cms.seo.metaTitle} onChange={(v: string) => update(['seo', 'metaTitle'], v)} hint="Shown in browser tab and search results." />
        <Field label="Meta Description" value={cms.seo.metaDescription} onChange={(v: string) => update(['seo', 'metaDescription'], v)} multiline rows={3} hint="160 characters recommended." />
        <Field label="Keywords" value={cms.seo.keywords} onChange={(v: string) => update(['seo', 'keywords'], v)} />
        <Field label="OG Image URL" value={cms.seo.ogImage} onChange={(v: string) => update(['seo', 'ogImage'], v)} placeholder="https://..." />
      </Accordion>
      <Accordion title="Contact Information">
        <Field label="Email" value={cms.contact.email} onChange={(v: string) => update(['contact', 'email'], v)} />
        <Field label="Phone" value={cms.contact.phone} onChange={(v: string) => update(['contact', 'phone'], v)} />
        <Field label="Address" value={cms.contact.address} onChange={(v: string) => update(['contact', 'address'], v)} />
        <Field label="LinkedIn URL" value={cms.contact.linkedin} onChange={(v: string) => update(['contact', 'linkedin'], v)} />
        <Field label="Twitter URL" value={cms.contact.twitter} onChange={(v: string) => update(['contact', 'twitter'], v)} />
      </Accordion>
    </div>
  );
}



function LogoUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) { alert("Logo must be under 500KB."); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-400 mb-1">Logo Image</label>
      <p className="text-xs text-gray-600 mb-2">Recommended: 160x40px PNG with transparent background. Max 500KB.</p>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="h-10 w-32 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={value} alt="Logo preview" className="max-h-8 max-w-28 object-contain" />
          </div>
        ) : (
          <div className="h-10 w-32 bg-gray-800 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-xs text-gray-600">No logo</div>
        )}
        <div className="flex flex-col gap-1">
          <button onClick={() => fileRef.current?.click()} className="cursor-pointer h-8 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg flex items-center gap-1.5">
            <Layers size={11} /> Upload Logo
          </button>
          {value && <button onClick={() => onChange("")} className="cursor-pointer h-7 px-3 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs rounded-lg">Remove</button>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleFile} className="hidden" />
    </div>
  );
}
function HeaderEditor({ cms, update }: any) {
  const h = cms.header;
  return (
    <div>
      <Accordion title="Logo" defaultOpen>
        <Field label="Logo Text" value={h.logoText} onChange={(v: string) => update(["header", "logoText"], v)} />
        <Field label="Logo Subtext" value={h.logoSubtext} onChange={(v: string) => update(["header", "logoSubtext"], v)} />
        <Field label="Logo Icon Letter" value={h.logoIcon} onChange={(v: string) => update(["header", "logoIcon"], v)} hint="Single character shown in the logo box." />
        <LogoUploader value={h.logoImage || ''} onChange={(v: string) => update(["header", "logoImage"], v)} />
      </Accordion>
      <Accordion title="Primary Menu" defaultOpen>
        <p className="text-xs text-gray-500 mb-3">Add, remove or reorder nav links. Toggle to show/hide each item.</p>
        {h.primaryMenu.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <button onClick={() => { const m = [...h.primaryMenu]; m[i] = { ...m[i], enabled: !m[i].enabled }; update(["header", "primaryMenu"], m); }}
              className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${item.enabled ? "bg-green-900/40 border-green-800 text-green-400" : "bg-gray-800 border-gray-700 text-gray-600"}`}>
              {item.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <input value={item.label} onChange={e => { const m = [...h.primaryMenu]; m[i] = { ...m[i], label: e.target.value }; update(["header", "primaryMenu"], m); }}
              placeholder="Label" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <input value={item.href} onChange={e => { const m = [...h.primaryMenu]; m[i] = { ...m[i], href: e.target.value }; update(["header", "primaryMenu"], m); }}
              placeholder="#section or /page" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <button onClick={() => update(["header", "primaryMenu"], h.primaryMenu.filter((_: any, j: number) => j !== i))}
              className="shrink-0 text-red-500 hover:text-red-400 cursor-pointer"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => update(["header", "primaryMenu"], [...h.primaryMenu, { label: "New Page", href: "#", enabled: true }])}
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-3">
          <Plus size={12} /> Add Menu Item
        </button>
      </Accordion>
      <Accordion title="CTA Button">
        <Toggle label="Show CTA Button" value={h.ctaEnabled} onChange={(v: boolean) => update(["header", "ctaEnabled"], v)} />
        <div className="mt-3">
          <Field label="CTA Button Text" value={h.ctaText} onChange={(v: string) => update(["header", "ctaText"], v)} />
          <Field label="Login Link Text" value={h.loginLinkText} onChange={(v: string) => update(["header", "loginLinkText"], v)} />
        </div>
      </Accordion>
      <Accordion title="Behaviour">
        <Toggle label="Sticky Header (fixed on scroll)" value={h.sticky} onChange={(v: boolean) => update(["header", "sticky"], v)} />
      </Accordion>
    </div>
  );
}

function FooterEditor({ cms, update }: any) {
  const f = cms.footer;
  return (
    <div>
      <Accordion title="Branding & Tagline" defaultOpen>
        <Field label="Footer Tagline" value={f.tagline} onChange={(v: string) => update(["footer", "tagline"], v)} multiline rows={2} />
        <Field label="Copyright Text" value={f.copyright} onChange={(v: string) => update(["footer", "copyright"], v)} />
      </Accordion>
      <Accordion title="Column 1 — Candidates" defaultOpen>
        <Field label="Column Title" value={f.col1Title} onChange={(v: string) => update(["footer", "col1Title"], v)} />
        {f.col1Links.map((link: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <button onClick={() => { const l = [...f.col1Links]; l[i] = { ...l[i], enabled: !l[i].enabled }; update(["footer", "col1Links"], l); }}
              className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${link.enabled ? "bg-green-900/40 border-green-800 text-green-400" : "bg-gray-800 border-gray-700 text-gray-600"}`}>
              {link.enabled ? <Eye size={11} /> : <EyeOff size={11} />}
            </button>
            <input value={link.label} onChange={e => { const l = [...f.col1Links]; l[i] = { ...l[i], label: e.target.value }; update(["footer", "col1Links"], l); }}
              placeholder="Label" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <input value={link.href} onChange={e => { const l = [...f.col1Links]; l[i] = { ...l[i], href: e.target.value }; update(["footer", "col1Links"], l); }}
              placeholder="view name or #anchor" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <button onClick={() => update(["footer", "col1Links"], f.col1Links.filter((_: any, j: number) => j !== i))}
              className="shrink-0 text-red-500 hover:text-red-400 cursor-pointer"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => update(["footer", "col1Links"], [...f.col1Links, { label: "New Link", href: "#", enabled: true }])}
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-2">
          <Plus size={12} /> Add Link
        </button>
      </Accordion>
      <Accordion title="Column 2 — Recruiters">
        <Field label="Column Title" value={f.col2Title} onChange={(v: string) => update(["footer", "col2Title"], v)} />
        {f.col2Links.map((link: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <button onClick={() => { const l = [...f.col2Links]; l[i] = { ...l[i], enabled: !l[i].enabled }; update(["footer", "col2Links"], l); }}
              className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${link.enabled ? "bg-green-900/40 border-green-800 text-green-400" : "bg-gray-800 border-gray-700 text-gray-600"}`}>
              {link.enabled ? <Eye size={11} /> : <EyeOff size={11} />}
            </button>
            <input value={link.label} onChange={e => { const l = [...f.col2Links]; l[i] = { ...l[i], label: e.target.value }; update(["footer", "col2Links"], l); }}
              placeholder="Label" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <input value={link.href} onChange={e => { const l = [...f.col2Links]; l[i] = { ...l[i], href: e.target.value }; update(["footer", "col2Links"], l); }}
              placeholder="view name or #anchor" className="flex-1 h-8 bg-gray-800 border border-gray-700 rounded-lg px-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500" />
            <button onClick={() => update(["footer", "col2Links"], f.col2Links.filter((_: any, j: number) => j !== i))}
              className="shrink-0 text-red-500 hover:text-red-400 cursor-pointer"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => update(["footer", "col2Links"], [...f.col2Links, { label: "New Link", href: "#", enabled: true }])}
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-2">
          <Plus size={12} /> Add Link
        </button>
      </Accordion>
      <Accordion title="Newsletter & Extras">
        <Toggle label="Show Newsletter Signup" value={f.newsletterEnabled} onChange={(v: boolean) => update(["footer", "newsletterEnabled"], v)} />
        <div className="mt-3">
          <Field label="Newsletter Title" value={f.newsletterTitle} onChange={(v: string) => update(["footer", "newsletterTitle"], v)} />
          <Field label="Newsletter Subtitle" value={f.newsletterSubtitle} onChange={(v: string) => update(["footer", "newsletterSubtitle"], v)} />
        </div>
        <Toggle label="Show System Status Badge" value={f.showSystemStatus} onChange={(v: boolean) => update(["footer", "showSystemStatus"], v)} />
      </Accordion>
    </div>
  );
}
type CMSPage = 'global' | 'header' | 'footer' | 'homepage' | 'auth' | 'candidate' | 'recruiter' | 'help' | 'seo';

const PAGES = [
  { id: 'header' as CMSPage, label: 'Header & Nav', icon: <Layers size={15} />, description: 'Logo, primary menu, CTA button' },
  { id: 'footer' as CMSPage, label: 'Footer', icon: <AlignLeft size={15} />, description: 'Footer links, columns, copyright' },
  { id: 'global' as CMSPage, label: 'Global', icon: <Globe size={15} />, description: 'Logo, nav, footer, announcement' },
  { id: 'homepage' as CMSPage, label: 'Homepage', icon: <Layout size={15} />, description: 'Hero, features, pricing, CTA' },
  { id: 'auth' as CMSPage, label: 'Auth Pages', icon: <LogIn size={15} />, description: 'Login & register branding' },
  { id: 'candidate' as CMSPage, label: 'Candidate Portal', icon: <Users size={15} />, description: 'Dashboard, jobs, screening' },
  { id: 'recruiter' as CMSPage, label: 'Recruiter Portal', icon: <Briefcase size={15} />, description: 'Dashboard, jobs, applications' },
  { id: 'help' as CMSPage, label: 'Help Page', icon: <HelpCircle size={15} />, description: 'FAQ content management' },
  { id: 'seo' as CMSPage, label: 'SEO & Contact', icon: <FileText size={15} />, description: 'Meta tags, social, contact' },
];

export function AdminCMS() {
  const { cms, update, save, reset, savedAt, dirty } = useCMSStore();
  const [activePage, setActivePage] = useState<CMSPage>('global');
  const [showReset, setShowReset] = useState(false);

  const renderEditor = () => {
    switch (activePage) {
      case 'global': return <GlobalEditor cms={cms} update={update} />;
      case 'header': return <HeaderEditor cms={cms} update={update} />;
      case 'footer': return <FooterEditor cms={cms} update={update} />;
      case 'homepage': return <HomepageEditor cms={cms} update={update} />;
      case 'auth': return <AuthEditor cms={cms} update={update} />;
      case 'candidate': return <CandidateEditor cms={cms} update={update} />;
      case 'recruiter': return <RecruiterEditor cms={cms} update={update} />;
      case 'help': return <HelpEditor cms={cms} update={update} />;
      case 'seo': return <SeoEditor cms={cms} update={update} />;
    }
  };

  const active = PAGES.find(p => p.id === activePage)!;

  return (
    <div className="flex" style={{ minHeight: '80vh' }}>
      <div className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 rounded-l-xl">
        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-xs font-bold text-white">CMS Editor</p>
          <p className="text-xs text-gray-500">Content Management</p>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {PAGES.map(page => (
            <button key={page.id} onClick={() => setActivePage(page.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors cursor-pointer ${activePage === page.id ? 'bg-blue-600/20 text-blue-400 border border-blue-800/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
              <span className={activePage === page.id ? 'text-blue-400' : 'text-gray-600'}>{page.icon}</span>
              <p className="text-xs font-medium truncate">{page.label}</p>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-2">
          <button onClick={save}
            className={`w-full flex items-center justify-center gap-2 h-8 rounded-lg text-xs font-medium cursor-pointer transition-all ${dirty ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
            <Save size={12} />
            {dirty ? 'Save Changes' : savedAt ? `Saved ${savedAt}` : 'No Changes'}
          </button>
          <button onClick={() => setShowReset(true)} className="w-full flex items-center justify-center gap-2 h-7 rounded-lg text-xs text-gray-600 hover:text-red-400 cursor-pointer">
            <RotateCcw size={11} /> Reset to Defaults
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">{active.label}</h2>
            <p className="text-xs text-gray-500">{active.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {dirty && <span className="flex items-center gap-1.5 text-xs text-orange-400"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />Unsaved</span>}
            {savedAt && !dirty && <span className="flex items-center gap-1.5 text-xs text-green-500"><CheckCircle size={11} />Saved {savedAt}</span>}
            <button onClick={save}
              className={`flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-medium cursor-pointer transition-colors ${dirty ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
              <Save size={12} /> Save
            </button>
          </div>
        </div>
        <div className="p-6 max-w-2xl">{renderEditor()}</div>
      </div>

      {showReset && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-900/40 flex items-center justify-center">
                <AlertCircle size={16} className="text-red-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Reset All Content?</h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">Resets ALL CMS content back to QANI defaults. Cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowReset(false)} className="flex-1 h-8 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer">Cancel</button>
              <button onClick={() => { reset(); setShowReset(false); }} className="flex-1 h-8 bg-red-700 hover:bg-red-600 text-white text-xs rounded-lg cursor-pointer">Reset Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function useCMS() {
  const [cms, setCms] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_KEY);
      if (saved) return { ...DEFAULT_CMS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_CMS;
  });
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === CMS_KEY) {
        try {
          const saved = localStorage.getItem(CMS_KEY);
          if (saved) setCms({ ...DEFAULT_CMS, ...JSON.parse(saved) });
        } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return cms;
}

export default AdminCMS;
