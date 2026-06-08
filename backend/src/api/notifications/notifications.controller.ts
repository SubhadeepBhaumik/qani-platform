import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail, sendApplicationReceivedEmail, sendScreeningCompleteEmail, sendInterviewInviteEmail, sendRecruiterScreeningAlertEmail } from '../../services/email.service';

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
    // Send real email based on type
    if (recipientEmail && recipientEmail.includes('@')) {
      const firstName = recipientEmail.split('@')[0].split('.')[0];
      const name = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      if (type === 'system' && title.toLowerCase().includes('invited')) {
        // Team invite email
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
            <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
              <div style="margin-bottom:24px;">
                <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
                <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
              </div>
              <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">You've been invited to QANI</h2>
              <p style="color:#374151;font-size:14px;line-height:1.6;">${message || 'You have been invited to join the QANI AI Recruitment Platform.'}</p>
              <a href="https://qani.io/register/recruiter" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Accept Invitation</a>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
              <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
            </div>
          </div>`;
        sendEmail(recipientEmail, title, html).catch(console.error);
      } else if (type === 'new_application') {
        const jobMatch = title.match(/— (.+)$/);
        const jobTitle = jobMatch ? jobMatch[1] : 'the position';
        sendApplicationReceivedEmail(recipientEmail, name, jobTitle, 'QANI').catch(console.error);
      } else if (type === 'screening_complete' && message) {
        const scoreMatch = message.match(/Score: (\d+)%/);
        const recMatch = message.match(/Status: (\w+)|Recommendation: (\w+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        const rec = recMatch ? (recMatch[1] || recMatch[2]).toLowerCase() : 'review';
        const jobMatch = title.match(/— (.+)$/);
        const jobTitle = jobMatch ? jobMatch[1] : 'the position';
        if (score > 0) {
          sendScreeningCompleteEmail(recipientEmail, name, jobTitle, score, rec).catch(console.error);
        }
        // Also alert recruiter
        if (recipientId && recipientId.startsWith('recruiter-')) {
          sendRecruiterScreeningAlertEmail(recipientEmail, name, name, jobTitle, score, rec).catch(console.error);
        }
      } else if (type === 'invite_sent' && interviewDateTime) {
        const jobMatch = title.match(/— (.+)$/);
        const jobTitle = jobMatch ? jobMatch[1] : 'the position';
        const dt = new Date(interviewDateTime).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });
        sendInterviewInviteEmail(recipientEmail, name, jobTitle, 'QANI', dt).catch(console.error);
      }
    }
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
      const { to, subject, title: titleField, message, recipientId, recipientEmail, type, body, relatedJobId, relatedApplicationId, interviewDateTime } = req.body;
      const finalEmail = recipientEmail || to || null;
      const finalTitle = subject || titleField || 'Notification';
      const finalMessage = message || body || '';
      const finalType = type || 'system';

      const notif = await prisma.notification.create({
        data: {
          recipientId: recipientId || to || 'unknown',
          recipientEmail: finalEmail,
          type: finalType,
          title: finalTitle,
          message: finalMessage,
          status: 'unread',
          relatedJobId: relatedJobId || null,
          relatedApplicationId: relatedApplicationId || null,
          interviewDateTime: interviewDateTime ? new Date(interviewDateTime) : null,
        }
      });

      // Send real email for invite notifications
      if (finalEmail && finalEmail.includes('@') && finalType === 'system' && finalTitle.toLowerCase().includes('invited')) {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
            <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
              <div style="margin-bottom:24px;">
                <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
                <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
              </div>
              <h2 style="color:#111827;font-size:20px;margin:0 0 16px;">You have been invited to QANI</h2>
              <p style="color:#374151;font-size:14px;line-height:1.6;">${finalMessage}</p>
              <a href="https://qani.io/register/recruiter" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Accept Invitation</a>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
              <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io">qani.io</a></p>
            </div>
          </div>`;
        sendEmail(finalEmail, finalTitle, html).catch(console.error);
      }

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
