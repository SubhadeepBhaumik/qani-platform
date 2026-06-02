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
];

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
