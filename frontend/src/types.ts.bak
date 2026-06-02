export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'candidate' | 'recruiter' | 'admin';
  companyName?: string;
  title?: string;
  companySize?: string;
  industry?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  resumeName?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  emailVerified: boolean;
  avatar?: string;
  privacy?: {
    isPublic: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowContact: boolean;
  };
  phone?: string;
  location?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  category: string;
  location: string;
  employmentType: string[]; // e.g. ["Full-time", "Remote"]
  salaryMin?: number;
  salaryMax?: number;
  hideSalary: boolean;
  description: string;
  benefits: string[];
  requirementsMust: string[];
  requirementsNice: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  experienceYearsMin: number;
  experienceYearsMax: number;
  skillsRequired: string[];
  educationRequired: string[];
  screeningQuestions: string[];
  qualificationWeights?: {
    locationWeight: number;
    salaryWeight: number;
    qualificationsWeight: number;
    workRightsWeight: number;
    skillsWeight: number;
  };
  status: 'open' | 'closed' | 'draft';
  postedDate: string;
}

export interface RecruiterNote {
  id: string;
  recruiterName: string;
  content: string;
  timestamp: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'applied' | 'screening' | 'qualified' | 'review' | 'rejected' | 'withdrawn';
  score?: number; // overall score (0-100)
  appliedDate: string;
  scorecard?: {
    locationScore: number;
    salaryScore: number;
    qualificationsScore: number;
    workRightsScore: number;
    skillsScore: number;
  };
  aiFeedback?: string;
  notes?: RecruiterNote[];
  screeningSessionId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  questionIdx?: number;
}

export interface ScreeningSession {
  id: string;
  applicationId: string;
  status: 'active' | 'completed';
  messages: ChatMessage[];
  currentQuestionIdx: number;
  startDate: string;
  endDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'unread' | 'read' | 'archived';
  type: 'job' | 'message' | 'screening' | 'system';
}

export interface HelpArticle {
  title: string;
  category: string;
  content: string;
}

export interface SystemLog {
  id: string;
  event: string;
  user: string;
  details: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
