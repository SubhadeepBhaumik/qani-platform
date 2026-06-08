import { Job, User, Application, Notification, ScreeningSession, SystemLog, HelpArticle } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-candidate-1',
    email: 'candidate@qani.ai',
    firstName: 'Steve',
    lastName: '',
    role: 'candidate',
    bio: 'Senior Full Stack Engineer with 6+ years of experience building scalable React, Node.js, and Python applications. Specialized in cloud-native system design and machine learning integrations.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'AWS', 'Next.js'],
    resumeName: 'steve_resume.pdf',
    resumeUrl: '#',
    linkedinUrl: 'https://linkedin.com/in/steve',
    portfolioUrl: 'https://steve.dev',
    githubUrl: 'https://github.com/steve',
    emailVerified: true,
    location: 'Singapore',
    phone: '+65 9123 4567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    privacy: {
      isPublic: true,
      showPhone: true,
      showLocation: true,
      allowContact: true,
    }
  },
  {
    id: 'user-recruiter-1',
    email: 'recruiter@qani.ai',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'recruiter',
    companyName: 'Acme Technology Corp',
    title: 'Director of Talent Acquisition',
    companySize: '200-500 employees',
    industry: 'Technology & AI Services',
    emailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150'
  },
  {
    id: 'user-admin-1',
    email: 'admin@qani.ai',
    firstName: 'Alex',
    lastName: 'Mercer',
    role: 'admin',
    emailVerified: true,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150'
  }
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior full-stack developer',
    department: 'Engineering',
    category: 'Software Engineering',
    location: 'Singapore (Hybrid)',
    employmentType: ['Full-time', 'Hybrid'],
    salaryMin: 8000,
    salaryMax: 12000,
    hideSalary: false,
    description: 'We are looking for a Senior Full-Stack Developer to lead the engineering of our client-facing portal. You will build highly responsive UI components and configure our robust Node.js backend. This role requires full architectural ownership and close collaboration with our product design teams.',
    benefits: ['Comprehensive health insurance', 'Personal learning budget of $2000/year', 'Flexible working hours', 'Quarterly team retreats', 'Latest Macbook Pro provisioned'],
    requirementsMust: [
      '6+ years of professional software development experience.',
      'Strong proficiency in React, TypeScript, and Tailwind CSS.',
      'Experience with Node.js and building RESTful APIs.',
      'Familiarity with containerized deployments (Docker) and AWS.'
    ],
    requirementsNice: [
      'Experience with database optimization (PostgreSQL/Redis).',
      'Contributions to open-source developer tools.',
      'Leadership experience or mentoring junior engineers.'
    ],
    experienceLevel: 'Senior',
    experienceYearsMin: 6,
    experienceYearsMax: 15,
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
    educationRequired: ["Bachelor's Degree in Computer Science or related field"],
    screeningQuestions: [
      'Explain your experience designing and maintaining high-performance React frontends with heavy data synchronization.',
      'How do you approach RESTful API security and prevent SQL injections in Node.js applications?',
      'Describe a complex production issue you debugged. What was the root cause and how did you resolve it?',
      'What are your compensation expectations and what is your availability for a starting date?'
    ],
    status: 'open',
    postedDate: '2026-05-20',
    qualificationWeights: {
      locationWeight: 80,
      salaryWeight: 90,
      qualificationsWeight: 85,
      workRightsWeight: 95,
      skillsWeight: 100
    }
  },
  {
    id: 'job-2',
    title: 'Product Designer (UX/UI)',
    department: 'Product',
    category: 'Product Design',
    location: 'Remote (APAC)',
    employmentType: ['Full-time', 'Remote'],
    salaryMin: 5000,
    salaryMax: 8000,
    hideSalary: false,
    description: 'Join our fully remote team as a Product Designer to shape the visual patterns and user journeys of our platform. You will work on user research, wires, design systems, and high-fidelity mockups in Figma.',
    benefits: ['Work from anywhere mandate', 'Workplace stipend of $1500', 'Medical benefits', 'Annual wellness allowance'],
    requirementsMust: [
      '3+ years designing complex SaaS products.',
      'Robust portfolio showcasing user research and finished UI/UX deliverables.',
      'Power user skills in Figma and maintaining component design systems.'
    ],
    requirementsNice: [
      'Familiarity with frontend code (HTML/CSS) to collaborate with engineers.',
      'Experience running user interviews and interpreting web analytics.'
    ],
    experienceLevel: 'Mid',
    experienceYearsMin: 3,
    experienceYearsMax: 6,
    skillsRequired: ['Figma', 'UX Research', 'Design Systems', 'Prototyping'],
    educationRequired: ["Diploma or Bachelor's in Design, HCI or equivalent experienced-based portfolio"],
    screeningQuestions: [
      'Describe your UX research process when tackling a completely ambiguous feature request.',
      'How do you construct and maintain a scalable Figma design system for a team of designers and developers?',
      'Give an example of a feedback cycle where engineering constraints changed your design. How did you negotiate details?',
      'Please state your target monthly salary and when you can theoretically start.'
    ],
    status: 'open',
    postedDate: '2026-05-24',
    qualificationWeights: {
      locationWeight: 50,
      salaryWeight: 80,
      qualificationsWeight: 75,
      workRightsWeight: 60,
      skillsWeight: 90
    }
  },
  {
    id: 'job-3',
    title: 'Machine Learning Engineer',
    department: 'AI Lab',
    category: 'Artificial Intelligence',
    location: 'Singapore (Office)',
    employmentType: ['Full-time', 'Onsite'],
    salaryMin: 10000,
    salaryMax: 16000,
    hideSalary: true,
    description: 'We are pioneering specialized candidate evaluation models and screening orchestration logic. You will train, specialize, and integrate state-of-the-art LLMs, fine-tuning them on private domain datasets while maintaining high safety and sub-second latency targets.',
    benefits: ['Relocation support', 'Generous company stock options', 'Flexible wellness allowances', 'Conference sponsorships'],
    requirementsMust: [
      'Expertise in Python, PyTorch, and NLP architectures.',
      'Practical production experience orchestrating and deploying open-weights models (Llama, Gemma).',
      'Solid experience with vector databases and semantic index optimizations (FAISS, pgvector).'
    ],
    requirementsNice: [
      'Published research works at NeurIPS, ICML, or CVPR.',
      'In-depth knowledge of parameter-efficient fine-tuning (LoRA, QLoRA).'
    ],
    experienceLevel: 'Lead',
    experienceYearsMin: 5,
    experienceYearsMax: 12,
    skillsRequired: ['Python', 'PyTorch', 'Transformers', 'Vector Databases', 'NLP', 'Gemma'],
    educationRequired: ["Master's or Ph.D. in Computer Science, Machine Learning, or Mathematics"],
    screeningQuestions: [
      'What mechanisms do you implement to evaluate and mitigate model hallucinations and biases in automated feedback?',
      'Describe your architecture for deploying low-latency LLM agents that integrate conversational memory and retrieval.',
      'Explain your experience with Parameter-Efficient Fine-Tuning (LoRA) and how you optimize compute during training cycles.',
      'What is your expected salary bracket and how long is your notification period?'
    ],
    status: 'open',
    postedDate: '2026-05-27',
    qualificationWeights: {
      locationWeight: 90,
      salaryWeight: 85,
      qualificationsWeight: 95,
      workRightsWeight: 90,
      skillsWeight: 100
    }
  },
  {
    id: 'job-4',
    title: 'QA Automation Engineer',
    department: 'Engineering',
    category: 'Software Testing',
    location: 'Singapore (Hybrid)',
    employmentType: ['Contract'],
    salaryMin: 4500,
    salaryMax: 6500,
    hideSalary: false,
    description: 'We are seeking a Contract QA Engineer to build out our end-to-end testing suite for the QANI scoring platform. You will implement automated tests mimicking recruiters and candidates.',
    benefits: ['Hybrid arrangement', 'Prorated medical coverage', 'Extension opportunities'],
    requirementsMust: [
      '2+ years writing automated tests with Playwright or Cypress.',
      'Familiarity with CI/CD integration pipelines (GitHub Actions).'
    ],
    requirementsNice: [
      'Experience run-load testing (K6).',
      'Familiarity with container services.'
    ],
    experienceLevel: 'Mid',
    experienceYearsMin: 2,
    experienceYearsMax: 5,
    skillsRequired: ['Playwright', 'Jest', 'CI/CD', 'TypeScript'],
    educationRequired: ['Bachelor or Diploma in Computer Science/Engineering'],
    screeningQuestions: [
      'What are your best practices for writing robust, non-flaky end-to-end browser workflows in Playwright?',
      'How do you parallelize and integrate automated regression suites within standard continuous delivery pipelines?',
      'Describe a tricky async race condition you encountered during test automation, and how you stabilized it.',
      'Confirm your target billing rate and when you can assume full contract duties.'
    ],
    status: 'draft',
    postedDate: '2026-05-28',
    qualificationWeights: {
      locationWeight: 80,
      salaryWeight: 70,
      qualificationsWeight: 80,
      workRightsWeight: 80,
      skillsWeight: 80
    }
  }
];

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    candidateId: 'user-candidate-1',
    status: 'applied',
    appliedDate: '2026-05-29'
  },
  {
    id: 'app-completed-1',
    jobId: 'job-1',
    candidateId: 'candidate-historical-1',
    status: 'qualified',
    score: 88,
    appliedDate: '2026-05-25',
    scorecard: {
      locationScore: 90,
      salaryScore: 85,
      qualificationsScore: 80,
      workRightsScore: 100,
      skillsScore: 85
    },
    aiFeedback: 'The candidate demonstrates strong theoretical knowledge and solid coding tenure with complex React web components. They expressed sensible salary alignments and are fully resident in the required region.',
    notes: [
      {
        id: 'note-1',
        recruiterName: 'Sarah Chen',
        content: 'Candidate sounded fully engaged and responsive. Recommending for immediate standard technical interview scheduled next Wednesday.',
        timestamp: '2026-05-27T10:15:00Z'
      }
    ],
    screeningSessionId: 'session-completed-1'
  },
  {
    id: 'app-completed-2',
    jobId: 'job-2',
    candidateId: 'candidate-historical-2',
    status: 'review',
    score: 68,
    appliedDate: '2026-05-26',
    scorecard: {
      locationScore: 100,
      salaryScore: 60,
      qualificationsScore: 70,
      workRightsScore: 40,
      skillsScore: 71
    },
    aiFeedback: 'The candidate has excellent mid-level portfolio items, but salary alignment is slightly higher than our current budget ceiling. Additionally, their current visa arrangement would require remote processing or sponsorship.',
    notes: [
      {
        id: 'note-2',
        recruiterName: 'Sarah Chen',
        content: 'Visual portfolio elements look gorgeous but need to negotiate compensation rates carefully with our internal steering committee first.',
        timestamp: '2026-05-28T09:40:00Z'
      }
    ],
    screeningSessionId: 'session-completed-2'
  },
  {
    id: 'app-completed-3',
    jobId: 'job-1',
    candidateId: 'candidate-historical-3',
    status: 'rejected',
    score: 35,
    appliedDate: '2026-05-24',
    scorecard: {
      locationScore: 20,
      salaryScore: 40,
      qualificationsScore: 30,
      workRightsScore: 50,
      skillsScore: 35
    },
    aiFeedback: 'The candidate lacks the requested senior software experience level (having only 1 year of internship exposure). Salary expectations also far exceed standard bounds for intermediate testing cohorts.',
    notes: [
      {
        id: 'note-3',
        recruiterName: 'Sarah Chen',
        content: 'Lacks required timeline experience. Candidate rejected automatically.',
        timestamp: '2026-05-26T16:20:00Z'
      }
    ],
    screeningSessionId: 'session-completed-3'
  }
];

export const mockHistoricalCandidates: User[] = [
  {
    id: 'candidate-historical-1',
    email: 'marcus.v@qani.ai',
    firstName: 'Marcus',
    lastName: 'Vance',
    role: 'candidate',
    bio: 'Software engineer focusing on building highly efficient distributed microservices in TypeScript and Node.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
    resumeName: 'marcus_vance_cv.pdf',
    linkedinUrl: 'https://linkedin.com/in/marcus',
    emailVerified: true,
    location: 'Singapore',
    phone: '+65 9212 9010'
  },
  {
    id: 'candidate-historical-2',
    email: 'suyin.l@qani.ai',
    firstName: 'Su Yin',
    lastName: 'Lim',
    role: 'candidate',
    bio: 'Visual product designer specialized in SaaS complex dashboards and developer tools interfaces.',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'HTML/CSS'],
    resumeName: 'suyin_ux_folder.pdf',
    linkedinUrl: 'https://linkedin.com/in/suyin',
    portfolioUrl: 'https://suyin.design',
    emailVerified: true,
    location: 'Kuala Lumpur',
    phone: '+60 12 454 4920'
  },
  {
    id: 'candidate-historical-3',
    email: 'billy.g@qani.ai',
    firstName: 'Billy',
    lastName: 'Gomez',
    role: 'candidate',
    bio: 'Junior web enthusiast and cybersecurity hobbyist looking for entry level front end frameworks roles.',
    skills: ['JavaScript', 'HTML', 'CSS', 'React basics'],
    resumeName: 'gomez_fresh_resume.pdf',
    emailVerified: true,
    location: 'Philippines',
    phone: '+63 919 281 9931'
  }
];

export const mockScreeningSessions: ScreeningSession[] = [
  {
    id: 'session-completed-1',
    applicationId: 'app-completed-1',
    status: 'completed',
    currentQuestionIdx: 4,
    startDate: '2026-05-25T14:00:00Z',
    endDate: '2026-05-25T14:24:00Z',
    messages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content: "Hello Marcus! Welcome to your AI recruitment screening session with QANI. I am your virtual screening coordinator. Over the next 4 questions, we will explore your alignment with the Senior Full-Stack Developer opening at Acme Corp. Let's start! Could you explain your experience designing and maintaining high-performance React frontends with heavy data synchronization?",
        timestamp: '2026-05-25T14:02:00Z',
        questionIdx: 0
      },
      {
        id: 'msg-2',
        role: 'user',
        content: "Hi. I've been with React for about 6 years. At my last job, we engineered an active fleet tracker with real-time WebSocket feeds and synchronized offline state in IndexedDB. I optimized the renders using context selectors and structured atomic state modifications so dashboard panels wouldn't re-trigger unnecessarily.",
        timestamp: '2026-05-25T14:07:00Z',
        questionIdx: 0
      },
      {
        id: 'msg-3',
        role: 'assistant',
        content: 'Excellence in localized memoizations and index cache synchronizations is crucial. Moving to question 2: How do you approach RESTful API security and prevent SQL injections in Node.js applications?',
        timestamp: '2026-05-25T14:08:00Z',
        questionIdx: 1
      },
      {
        id: 'msg-4',
        role: 'user',
        content: "In Node.js systems, I always leverage query builders like Prisma or raw parameterization queries which encapsulate data completely, eliminating SQL injection vulnerability entirely. I also enforce strict HTTP parameter pollutions guards, validation schemas using Yup/Zod, and set security headers with Helmet.",
        timestamp: '2026-05-25T14:13:00Z',
        questionIdx: 1
      },
      {
        id: 'msg-5',
        role: 'assistant',
        content: 'Solid defenses. Let’s address question 3: Describe a complex production issue you debugged. What was the root cause and how did you resolve it?',
        timestamp: '2026-05-25T14:14:00Z',
        questionIdx: 2
      },
      {
        id: 'msg-6',
        role: 'user',
        content: "We experienced a memory leak in Node because of open event listeners mapping within a WebSocket handle retry block. It would accumulate over days and trigger OOM crashing. I used Chrome DevTools heap memory profiles to isolate the uncleared listeners and implemented proper disposers in teardown blocks to stabilize it.",
        timestamp: '2026-05-25T14:20:00Z',
        questionIdx: 2
      },
      {
        id: 'msg-7',
        role: 'assistant',
        content: "Outstanding. Proper cleanups prevent resource leakages entirely. For our final question: What are your compensation expectations and what is your availability for a starting date?",
        timestamp: '2026-05-25T14:21:00Z',
        questionIdx: 3
      },
      {
        id: 'msg-8',
        role: 'user',
        content: "I am targeting around $9,500 SGD monthly on base compensation, and my availability is exactly 1 month from signature as I have a standard notification period to clear.",
        timestamp: '2026-05-25T14:23:00Z',
        questionIdx: 3
      },
      {
        id: 'msg-9',
        role: 'assistant',
        content: "Excellent. Thank you Marcus, this concludes your AI conversational screening with QANI. Our recruitment team will review the evaluation logs and follow up with you shortly. Have a stellar day!",
        timestamp: '2026-05-25T14:24:00Z'
      }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Candidate Application Received',
    content: 'Marcus Vance applied for the Senior Full-Stack Developer position.',
    date: '2026-05-25T14:30:00Z',
    status: 'read',
    type: 'job'
  },
  {
    id: 'notif-2',
    title: 'Screening Completed',
    content: 'Marcus Vance has finished the AI screening conversational loop with an overall score of 88/100.',
    date: '2026-05-25T14:24:30Z',
    status: 'unread',
    type: 'screening'
  },
  {
    id: 'notif-3',
    title: 'New Position Registered',
    content: 'Machine Learning Engineer position was drafted and published successfully.',
    date: '2026-05-27T11:00:00Z',
    status: 'unread',
    type: 'job'
  },
  {
    id: 'notif-4',
    title: 'Welcome to QANI Platform',
    content: 'Explore your workspace tools, establish evaluation areas, and start automation-assisted recruiting.',
    date: '2026-05-29T10:00:00Z',
    status: 'unread',
    type: 'system'
  }
];

export const mockSystemLogs: SystemLog[] = [
  {
    id: 'log-1',
    event: 'User Registration',
    user: 'candidate@qani.ai',
    details: 'New candidate profile created successfully.',
    timestamp: '2026-05-29T12:00:00Z',
    type: 'success'
  },
  {
    id: 'log-2',
    event: 'Database Migration',
    user: 'System Process',
    details: 'Clean local persistence indices established for workspace nodes.',
    timestamp: '2026-05-29T11:45:00Z',
    type: 'info'
  },
  {
    id: 'log-3',
    event: 'Vite Ingress Mount',
    user: 'System Process',
    details: 'Reverse proxy binding secured at port 3000.',
    timestamp: '2026-05-29T11:30:00Z',
    type: 'info'
  },
  {
    id: 'log-4',
    event: 'QANI AI Session Init',
    user: 'sarah.recruiter@qani.ai',
    details: 'QANI AI conversational core loaded on engine gpt-4o-mini.',
    timestamp: '2026-05-29T10:15:00Z',
    type: 'success'
  }
];

export const faqArticles: HelpArticle[] = [
  {
    category: 'Getting Started',
    title: 'How do I initiate candidate screening?',
    content: 'When an applicant applies for an open role that has screening enabled, they are prompted directly on their candidate dashboard or via their notifications. They can tap the "Start Screening" button, which loads a chat terminal powered by our custom server-side QANI AI integration using GPT-4o-mini. The AI acts as your dedicated assistant, guiding the applicant through your exact pre-configured screening questions.'
  },
  {
    category: 'Features',
    title: 'What are the 5 core evaluation areas calculated?',
    content: 'Our candidate matching engine evaluates candidates across five distinct aspects: Location Alignment (geographic proximity), Salary Alignment (cohesion of expectations against role budgets), Qualifications & Licenses (degree and cert checklist adherence), Work Rights/Availability (start schedules), and Skills & Experience (depth match using parsing & reasoning).'
  },
  {
    category: 'Security & Keys',
    title: 'How do you secure LLM API Keys?',
    content: 'All API integrations with AI models (specifically the OpenAI GPT-4o-mini API) are executed through server-side processes in `server.ts`. This completely prevents client-side exposure of your company API secrets in browser developer consoles.'
  },
  {
    category: 'Troubleshooting',
    title: 'Why is my candidate screening conversation delayed?',
    content: 'Ensure you have configured a valid `GEMINI_API_KEY` inside the workspace Secrets configuration or local environment parameters. Since models operate server-to-server, any missing key would manifest as an alert on the UI dashboard.'
  }
];
