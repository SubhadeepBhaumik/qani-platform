import { Request, Response } from 'express';

interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleId: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'screening' | 'progress' | 'review' | 'rejected' | 'hired' | 'qualified';
  appliedAt: string;
  screeningStartedAt?: string;
  screeningCompletedAt?: string;
  aiScore?: number;
  scoreBreakdown?: {
    workRights: number;
    salaryAlignment: number;
    locationMatch: number;
    technicalSkills: number;
    qualifications: number;
  };
  transcript?: { role: 'ai' | 'candidate'; message: string; timestamp: string }[];
  aiFeedback?: string;
  recruiterNotes?: string;
}

export const applications: Application[] = [
  {
    id: 'app-001',
    candidateId: 'candidate-1',
    candidateName: 'Liam Nguyen',
    candidateEmail: 'candidate@qani.io',
    roleId: 'job-1',
    jobTitle: 'Senior Software Engineer',
    company: 'Atlassian',
    status: 'qualified',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    screeningStartedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    screeningCompletedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 1800000).toISOString(),
    aiScore: 91,
    scoreBreakdown: { workRights: 100, salaryAlignment: 85, locationMatch: 95, technicalSkills: 88, qualifications: 90 },
    transcript: [
      { role: 'ai', message: 'Hi Liam! I\'m QANI, your AI interviewer. Are you currently eligible to work in Australia full-time?', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { role: 'candidate', message: 'Yes, I\'m an Australian citizen with no work restrictions.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 60000).toISOString() },
      { role: 'ai', message: 'Great! The role offers $130k–$160k. What are your salary expectations?', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 120000).toISOString() },
      { role: 'candidate', message: 'I\'m looking for around $150k base, which fits within that range.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 180000).toISOString() },
      { role: 'ai', message: 'This role is based in Sydney CBD. Are you able to commute or relocate?', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 240000).toISOString() },
      { role: 'candidate', message: 'Yes, I live in Sydney and can commute easily.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 300000).toISOString() },
      { role: 'ai', message: 'Tell me about your experience with React and TypeScript.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 360000).toISOString() },
      { role: 'candidate', message: '5 years with React, 3 with TypeScript. Built production apps at Atlassian scale.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 420000).toISOString() },
    ],
    aiFeedback: 'Liam is an excellent candidate. Full work rights, salary expectations aligned, based in Sydney. Strong technical background in React/TypeScript with relevant enterprise experience. Recommended for interview.',
    recruiterNotes: '',
  },
  {
    id: 'app-002',
    candidateId: 'candidate-2',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@gmail.com',
    roleId: 'job-2',
    jobTitle: 'Product Designer',
    company: 'Canva',
    status: 'review',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    screeningStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    screeningCompletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1200000).toISOString(),
    aiScore: 72,
    scoreBreakdown: { workRights: 80, salaryAlignment: 60, locationMatch: 90, technicalSkills: 75, qualifications: 70 },
    transcript: [
      { role: 'ai', message: 'Hi Priya! Are you eligible to work in Australia?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { role: 'candidate', message: 'I\'m on a 482 visa, sponsored by my current employer.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000).toISOString() },
      { role: 'ai', message: 'The salary range is $90k–$120k. What are your expectations?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120000).toISOString() },
      { role: 'candidate', message: 'I\'m looking for $130k minimum.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 180000).toISOString() },
    ],
    aiFeedback: 'Priya has strong design skills but salary expectations exceed the budget by 8%. Visa situation requires employer sponsorship transfer. Recommend review before proceeding.',
    recruiterNotes: '',
  },
  {
    id: 'app-003',
    candidateId: 'candidate-3',
    candidateName: 'Tom Williams',
    candidateEmail: 'tom.williams@gmail.com',
    roleId: 'job-1',
    jobTitle: 'Senior Software Engineer',
    company: 'Atlassian',
    status: 'rejected',
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    screeningStartedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    screeningCompletedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 900000).toISOString(),
    aiScore: 38,
    scoreBreakdown: { workRights: 100, salaryAlignment: 30, locationMatch: 20, technicalSkills: 35, qualifications: 30 },
    transcript: [
      { role: 'ai', message: 'Hi Tom! Are you eligible to work in Australia?', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { role: 'candidate', message: 'Yes, Australian citizen.', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 60000).toISOString() },
      { role: 'ai', message: 'The role is in Sydney. Are you able to work from Sydney?', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 120000).toISOString() },
      { role: 'candidate', message: 'I\'m in Perth and not willing to relocate.', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 180000).toISOString() },
    ],
    aiFeedback: 'Tom has full work rights but is located in Perth and unwilling to relocate to Sydney. Salary expectations and technical skills are also below requirements. Not recommended.',
    recruiterNotes: 'Good attitude but wrong location.',
  },
  {
    id: 'app-004',
    candidateId: 'candidate-4',
    candidateName: 'Jessica Lee',
    candidateEmail: 'jessica.lee@gmail.com',
    roleId: 'job-3',
    jobTitle: 'Data Analyst',
    company: 'Seek',
    status: 'screening',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    screeningStartedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    aiScore: undefined,
    scoreBreakdown: undefined,
    transcript: [
      { role: 'ai', message: 'Hi Jessica! I\'m QANI. Are you eligible to work in Australia?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { role: 'candidate', message: 'Yes, permanent resident.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString() },
      { role: 'ai', message: 'Great! Tell me about your experience with SQL and data visualisation tools.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120000).toISOString() },
    ],
    aiFeedback: undefined,
    recruiterNotes: '',
  },
  {
    id: 'app-005',
    candidateId: 'candidate-5',
    candidateName: 'Marcus Vance',
    candidateEmail: 'marcus.vance@gmail.com',
    roleId: 'job-4',
    jobTitle: 'DevOps Engineer',
    company: 'Atlassian',
    status: 'applied',
    appliedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    aiScore: undefined,
    recruiterNotes: '',
  },
  {
    id: 'app-006',
    candidateId: 'candidate-6',
    candidateName: 'Sophie Martin',
    candidateEmail: 'sophie.martin@gmail.com',
    roleId: 'job-2',
    jobTitle: 'Product Designer',
    company: 'Canva',
    status: 'qualified',
    appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    screeningStartedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    screeningCompletedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1500000).toISOString(),
    aiScore: 88,
    scoreBreakdown: { workRights: 100, salaryAlignment: 90, locationMatch: 100, technicalSkills: 80, qualifications: 85 },
    transcript: [
      { role: 'ai', message: 'Hi Sophie! Are you eligible to work in Australia?', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { role: 'candidate', message: 'Yes, Australian citizen.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60000).toISOString() },
      { role: 'ai', message: 'The salary is $90k–$120k. What are your expectations?', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 120000).toISOString() },
      { role: 'candidate', message: 'I\'m looking for $105k, which fits perfectly.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 180000).toISOString() },
    ],
    aiFeedback: 'Sophie is an excellent fit. Full work rights, salary perfectly aligned, located in Melbourne (role is remote-friendly). Strong Figma and design system experience. Highly recommended.',
    recruiterNotes: 'Great portfolio, schedule interview.',
  },
];

export class ApplicationsController {
  static async applyForRole(req: Request, res: Response) {
    try {
      const { candidateId, roleId, candidateName, candidateEmail, jobTitle, company } = req.body;
      if (!candidateId || !roleId) {
        return res.status(400).json({ error: 'candidateId and roleId required' });
      }
      const exists = applications.find(a => a.candidateId === candidateId && a.roleId === roleId);
      if (exists) {
        return res.status(409).json({ error: 'Already applied for this role' });
      }
      const application: Application = {
        id: 'app-' + Date.now(),
        candidateId,
        candidateName: candidateName || 'Unknown',
        candidateEmail: candidateEmail || '',
        roleId,
        jobTitle: jobTitle || 'Unknown Role',
        company: company || 'Unknown Company',
        status: 'applied',
        appliedAt: new Date().toISOString(),
        recruiterNotes: '',
      };
      applications.push(application);
      return res.status(201).json(application);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create application' });
    }
  }

  static async getApplications(req: Request, res: Response) {
    try {
      const { candidateId, roleId, status } = req.query;
      let filtered = applications;
      if (candidateId) filtered = filtered.filter(a => a.candidateId === candidateId);
      if (roleId) filtered = filtered.filter(a => a.roleId === roleId);
      if (status) filtered = filtered.filter(a => a.status === status);
      return res.json(filtered);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  static async getApplication(req: Request, res: Response) {
    try {
      const application = applications.find(a => a.id === req.params.id);
      if (!application) return res.status(404).json({ error: 'Application not found' });
      return res.json(application);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch application' });
    }
  }

  // Helper called internally by screening controller
  static setApplicationStatus(applicationId: string, status: string) {
    const idx = applications.findIndex((a: any) => a.id === applicationId);
    if (idx !== -1) {
      applications[idx].status = status as any;
    }
  }

  static updateApplicationAfterScreening(applicationId: string, data: any) {
    const idx = applications.findIndex((a: any) => a.id === applicationId);
    if (idx !== -1) {
      (applications as any)[idx] = {
        ...(applications as any)[idx],
        aiScore: data.score,
        score: data.score,
        scorecard: data.scorecard,
        aiFeedback: data.aiFeedback,
        status: data.status,
        screeningSessionId: data.screeningSessionId,
        screeningCompletedAt: data.screeningCompletedAt,
      };
    }
  }

  static async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { status, recruiterNotes } = req.body;
      const application = applications.find(a => a.id === req.params.id);
      if (!application) return res.status(404).json({ error: 'Application not found' });
      if (status) {
        application.status = status;
        if (status === 'screening') application.screeningStartedAt = new Date().toISOString();
        if (['qualified', 'review', 'rejected', 'hired'].includes(status)) application.screeningCompletedAt = new Date().toISOString();
      }
      if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;
      return res.json(application);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update application' });
    }
  }
}
