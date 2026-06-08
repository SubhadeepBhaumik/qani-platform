import { Request, Response } from 'express';

interface InAppNotification {
  id: string;
  recipientId: string;
  recipientEmail?: string;
  type: 'new_application' | 'screening_complete' | 'job_expiring' | 'candidate_qualified' | 'invite_sent' | 'system';
  title: string;
  message: string;
  status: 'unread' | 'read';
  relatedJobId?: string;
  relatedApplicationId?: string;
  createdAt: string;
}

export const inAppNotifications: InAppNotification[] = [
  {
    id: 'notif-001',
    recipientId: 'recruiter-sarah',
    recipientEmail: 'recruiter@qani.io',
    type: 'new_application',
    title: 'New Application — Senior Full Stack Developer',
    message: 'Liam Nguyen has applied for Senior Full Stack Developer at Atlassian.',
    status: 'unread',
    relatedJobId: 'job-1',
    relatedApplicationId: 'app-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-002',
    recipientId: 'recruiter-sarah',
    recipientEmail: 'recruiter@qani.io',
    type: 'screening_complete',
    title: 'Screening Complete — Liam Nguyen',
    message: 'AI screening completed for Liam Nguyen. Score: 91%. Recommendation: Qualified.',
    status: 'unread',
    relatedJobId: 'job-1',
    relatedApplicationId: 'app-001',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-003',
    recipientId: 'recruiter-sarah',
    recipientEmail: 'recruiter@qani.io',
    type: 'new_application',
    title: 'New Application — Product Designer',
    message: 'Priya Sharma has applied for Product Designer at Canva.',
    status: 'unread',
    relatedJobId: 'job-2',
    relatedApplicationId: 'app-002',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-004',
    recipientId: 'recruiter-sarah',
    recipientEmail: 'recruiter@qani.io',
    type: 'candidate_qualified',
    title: 'Candidate Qualified — Sophie Martin',
    message: 'Sophie Martin scored 88% in AI screening for Product Designer. Ready for interview.',
    status: 'read',
    relatedJobId: 'job-2',
    relatedApplicationId: 'app-006',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-005',
    recipientId: 'recruiter-sarah',
    recipientEmail: 'recruiter@qani.io',
    type: 'job_expiring',
    title: 'Job Expiring Soon — DevOps Engineer',
    message: 'Your job posting for DevOps Engineer expires in 3 days. Renew to keep receiving applications.',
    status: 'unread',
    relatedJobId: 'job-4',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-006',
    recipientId: 'recruiter-sarah',
    recipientEmail: 'recruiter@qani.io',
    type: 'screening_complete',
    title: 'Screening Complete — Jessica Lee',
    message: 'AI screening is in progress for Jessica Lee applying for Data Analyst.',
    status: 'unread',
    relatedJobId: 'job-3',
    relatedApplicationId: 'app-004',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  // ── CANDIDATE NOTIFICATIONS ──
  {
    id: 'notif-c001',
    recipientId: 'candidate-1',
    recipientEmail: 'candidate@qani.io',
    type: 'new_application',
    title: 'Application Received',
    message: 'Your application for Senior Full Stack Developer at Atlassian has been received. AI screening will begin shortly.',
    status: 'unread',
    relatedJobId: 'job-1',
    relatedApplicationId: 'app-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-c002',
    recipientId: 'candidate-1',
    recipientEmail: 'candidate@qani.io',
    type: 'screening_complete',
    title: 'AI Screening Complete',
    message: 'Your AI screening for Senior Full Stack Developer is complete. Score: 91%. You have been marked as Qualified.',
    status: 'unread',
    relatedJobId: 'job-1',
    relatedApplicationId: 'app-001',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-c003',
    recipientId: 'candidate-1',
    recipientEmail: 'candidate@qani.io',
    type: 'system',
    title: 'New Jobs Matching Your Profile',
    message: '5 new jobs matching your React and TypeScript skills have been posted this week.',
    status: 'unread',
    relatedJobId: 'job-6',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-c004',
    recipientId: 'candidate-2',
    recipientEmail: 'priya.sharma@gmail.com',
    type: 'new_application',
    title: 'Application Received',
    message: 'Your application for Product Manager — Platform has been received.',
    status: 'unread',
    relatedJobId: 'job-2',
    relatedApplicationId: 'app-002',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-c005',
    recipientId: 'candidate-3',
    recipientEmail: 'tom.williams@gmail.com',
    type: 'screening_complete',
    title: 'AI Screening Complete',
    message: 'Your AI screening for DevOps Engineer is complete. Your application is under review.',
    status: 'unread',
    relatedJobId: 'job-3',
    relatedApplicationId: 'app-003',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function pushNotification(recipientId: string, recipientEmail: string, type: InAppNotification['type'], title: string, message: string, relatedJobId?: string, relatedApplicationId?: string) {
  const notif: InAppNotification = {
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2,5),
    recipientId,
    recipientEmail,
    type,
    title,
    message,
    status: 'unread',
    relatedJobId,
    relatedApplicationId,
    createdAt: new Date().toISOString(),
  };
  inAppNotifications.push(notif);
}

// Check for expiring jobs and notify recruiters and matching candidates
export function checkJobExpiry(roles: any[], applications: any[]) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  for (const job of roles) {
    if (!job.expiresAt || job.status !== 'open') continue;
    const expiry = new Date(job.expiresAt);
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft === 1) {
      // Notify recruiter
      const recruiterEmail = job.recruiterId || 'recruiter@qani.io';
      pushNotification(
        'recruiter-' + recruiterEmail, recruiterEmail,
        'job_expiring',
        'Job Expiring Tomorrow — ' + job.title,
        'Your job posting for ' + job.title + ' closes tomorrow. Extend the deadline if needed.',
        job.id
      );

      // Notify candidates with matching skills who haven't applied
      const appliedCandidateIds = applications.filter((a: any) => a.roleId === job.id).map((a: any) => a.candidateId);
      // We can only notify candidates who have applied to other jobs (have email in system)
      // For now notify all candidates who applied to other jobs with matching skills
      const notifiedEmails = new Set<string>();
      for (const app of applications) {
        if (appliedCandidateIds.includes(app.candidateId)) continue;
        if (notifiedEmails.has(app.candidateEmail)) continue;
        if (!app.candidateEmail) continue;
        notifiedEmails.add(app.candidateEmail);
        pushNotification(
          app.candidateId, app.candidateEmail,
          'job_expiring',
          'Job Closing Soon — ' + job.title,
          'The ' + job.title + ' role at ' + (job.company || 'QANI') + ' closes tomorrow. Apply now before it\'s too late.',
          job.id
        );
      }
    }
  }
}

export class NotificationsController {
  static async sendNotification(req: Request, res: Response) {
    try {
      const { to, subject, message, recipientId, type, body } = req.body;
      const notification: InAppNotification = {
        id: 'notif-' + Date.now(),
        recipientId: recipientId || to || 'unknown',
        recipientEmail: to,
        type: type || 'system',
        title: subject || 'Notification',
        message: message || body || '',
        status: 'unread',
        createdAt: new Date().toISOString(),
      };
      inAppNotifications.push(notification);
      return res.status(201).json(notification);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const { recipientId, recipientEmail, status } = req.query;
      let filtered = inAppNotifications;
      if (recipientId) filtered = filtered.filter(n => n.recipientId === recipientId);
      if (recipientEmail) filtered = filtered.filter(n => n.recipientEmail === recipientEmail);
      if (status) filtered = filtered.filter(n => n.status === status);
      return res.json(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notif = inAppNotifications.find(n => n.id === id);
      if (!notif) return res.status(404).json({ error: 'Not found' });
      notif.status = 'read';
      return res.json(notif);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to mark read' });
    }
  }

  static async markAllRead(req: Request, res: Response) {
    try {
      const { recipientEmail } = req.body;
      inAppNotifications.filter(n => n.recipientEmail === recipientEmail).forEach(n => n.status = 'read');
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to mark all read' });
    }
  }

  static async sendApplicationStatusEmail(req: Request, res: Response) {
    try {
      const { candidateId, candidateEmail, applicationId, status, decision } = req.body;
      const notification: InAppNotification = {
        id: 'notif-' + Date.now(),
        recipientId: candidateId || 'unknown',
        recipientEmail: candidateEmail,
        type: 'screening_complete',
        title: status === 'screening' ? 'Application Under Review' : 'Application Status Update',
        message: status === 'screening' ? 'Your application is being reviewed.' : `Your application status has been updated to: ${decision || status}.`,
        status: 'unread',
        relatedApplicationId: applicationId,
        createdAt: new Date().toISOString(),
      };
      inAppNotifications.push(notification);
      return res.status(201).json({ success: true, notification });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  static async sendRecruiterAlert(req: Request, res: Response) {
    try {
      const { recruiterId, recruiterEmail, alertType, applicationId, candidateName, jobId } = req.body;
      const typeMap: Record<string, InAppNotification['type']> = {
        qualified_candidate: 'candidate_qualified',
        screening_complete: 'screening_complete',
        action_required: 'new_application',
        job_expiring: 'job_expiring',
      };
      const notification: InAppNotification = {
        id: 'notif-' + Date.now(),
        recipientId: recruiterId || 'unknown',
        recipientEmail: recruiterEmail,
        type: typeMap[alertType] || 'system',
        title: alertType === 'qualified_candidate' ? `Candidate Qualified — ${candidateName}` : alertType === 'screening_complete' ? `Screening Complete — ${candidateName}` : 'Action Required',
        message: alertType === 'qualified_candidate' ? `${candidateName} has qualified. Review their scorecard.` : alertType === 'screening_complete' ? `Screening complete for ${candidateName}. Check results.` : `Application ${applicationId} requires your review.`,
        status: 'unread',
        relatedJobId: jobId,
        relatedApplicationId: applicationId,
        createdAt: new Date().toISOString(),
      };
      inAppNotifications.push(notification);
      return res.status(201).json({ success: true, notification });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send alert' });
    }
  }

  static async getNotificationHistory(req: Request, res: Response) {
    try {
      const { recipientId } = req.query;
      const history = inAppNotifications.filter(n => n.recipientId === recipientId);
      return res.json(history);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  }
}
