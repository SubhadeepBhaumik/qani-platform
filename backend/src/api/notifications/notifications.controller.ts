import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type NotifType = 'new_application' | 'screening_complete' | 'job_expiring' | 'candidate_qualified' | 'invite_sent' | 'system';

export async function pushNotification(
  recipientId: string, recipientEmail: string,
  type: NotifType, title: string, message: string,
  relatedJobId?: string, relatedApplicationId?: string,
  interviewDateTime?: string
) {
  try {
    await prisma.notification.create({
      data: {
        recipientId,
        recipientEmail,
        type,
        title,
        message,
        status: 'unread',
        relatedJobId: relatedJobId || null,
        relatedApplicationId: relatedApplicationId || null,
        interviewDateTime: interviewDateTime ? new Date(interviewDateTime) : null,
      }
    });
  } catch(e) {
    console.error('pushNotification error:', e);
  }
}

export async function checkJobExpiry(roles: any[], applications: any[]) {
  const now = new Date();
  for (const job of roles) {
    if (!job.expiresAt || job.status !== 'open') continue;
    const expiry = new Date(job.expiresAt);
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft === 1) {
      const recruiterEmail = job.recruiterId || 'recruiter@qani.io';
      await pushNotification(
        'recruiter-' + recruiterEmail, recruiterEmail,
        'job_expiring',
        'Job Expiring Tomorrow — ' + job.title,
        'Your job posting for ' + job.title + ' closes tomorrow. Extend the deadline if needed.',
        job.id
      );
      const appliedCandidateIds = applications.filter((a: any) => a.roleId === job.id).map((a: any) => a.candidateId);
      const notifiedEmails = new Set<string>();
      for (const app of applications) {
        if (appliedCandidateIds.includes(app.candidateId)) continue;
        if (notifiedEmails.has(app.candidateEmail)) continue;
        if (!app.candidateEmail) continue;
        notifiedEmails.add(app.candidateEmail);
        await pushNotification(
          app.candidateId, app.candidateEmail,
          'job_expiring',
          'Job Closing Soon — ' + job.title,
          'The ' + job.title + ' role at ' + (job.company || 'QANI') + ' closes tomorrow. Apply now.',
          job.id
        );
      }
    }
  }
}

export class NotificationsController {
  static async sendNotification(req: Request, res: Response) {
    try {
      const { to, subject, message, recipientId, recipientEmail, type, body, relatedJobId, relatedApplicationId, interviewDateTime } = req.body;
      const notif = await prisma.notification.create({
        data: {
          recipientId: recipientId || to || 'unknown',
          recipientEmail: recipientEmail || to || null,
          type: type || 'system',
          title: subject || 'Notification',
          message: message || body || '',
          status: 'unread',
          relatedJobId: relatedJobId || null,
          relatedApplicationId: relatedApplicationId || null,
          interviewDateTime: interviewDateTime ? new Date(interviewDateTime) : null,
        }
      });
      return res.status(201).json(notif);
    } catch (error) {
      console.error('Send notification error:', error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const { recipientId, recipientEmail, status } = req.query;
      const where: any = {};
      if (recipientId) where.recipientId = recipientId as string;
      if (recipientEmail) where.recipientEmail = recipientEmail as string;
      if (status) where.status = status as string;
      const notifs = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return res.json(notifs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notif = await prisma.notification.update({
        where: { id },
        data: { status: 'read' }
      });
      return res.json(notif);
    } catch (error) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  static async markAllRead(req: Request, res: Response) {
    try {
      const { recipientEmail } = req.body;
      await prisma.notification.updateMany({
        where: { recipientEmail },
        data: { status: 'read' }
      });
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to mark all read' });
    }
  }

  static async sendApplicationStatusEmail(req: Request, res: Response) {
    try {
      const { candidateId, candidateEmail, applicationId, status, decision } = req.body;
      const notif = await prisma.notification.create({
        data: {
          recipientId: candidateId || 'unknown',
          recipientEmail: candidateEmail || null,
          type: 'screening_complete',
          title: status === 'screening' ? 'Application Under Review' : 'Application Status Update',
          message: status === 'screening' ? 'Your application is being reviewed.' : 'Your application status has been updated to: ' + (decision || status) + '.',
          status: 'unread',
          relatedApplicationId: applicationId || null,
        }
      });
      return res.status(201).json({ success: true, notification: notif });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  static async sendRecruiterAlert(req: Request, res: Response) {
    try {
      const { recruiterId, recruiterEmail, alertType, applicationId, candidateName, jobId } = req.body;
      const typeMap: Record<string, NotifType> = {
        qualified_candidate: 'candidate_qualified',
        screening_complete: 'screening_complete',
        action_required: 'new_application',
        job_expiring: 'job_expiring',
      };
      const notif = await prisma.notification.create({
        data: {
          recipientId: recruiterId || 'unknown',
          recipientEmail: recruiterEmail || null,
          type: typeMap[alertType] || 'system',
          title: alertType === 'qualified_candidate' ? 'Candidate Qualified — ' + candidateName : alertType === 'screening_complete' ? 'Screening Complete — ' + candidateName : 'Action Required',
          message: alertType === 'qualified_candidate' ? candidateName + ' has qualified. Review their scorecard.' : alertType === 'screening_complete' ? 'Screening complete for ' + candidateName + '. Check results.' : 'Application ' + applicationId + ' requires your review.',
          status: 'unread',
          relatedJobId: jobId || null,
          relatedApplicationId: applicationId || null,
        }
      });
      return res.status(201).json({ success: true, notification: notif });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send alert' });
    }
  }

  static async getNotificationHistory(req: Request, res: Response) {
    try {
      const { recipientId } = req.query;
      const notifs = await prisma.notification.findMany({
        where: { recipientId: recipientId as string },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(notifs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  }
}
