import { Request, Response } from 'express';

interface Notification {
  id: string;
  recipientId: string;
  type: 'email' | 'sms' | 'in_app';
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  createdAt: Date;
}

const notifications: Notification[] = [];

export class NotificationsController {
  static async sendNotification(req: Request, res: Response) {
    try {
      const { recipientId, type, subject, body } = req.body;

      if (!recipientId || !type || !body) {
        return res.status(400).json({ error: 'recipientId, type, body required' });
      }

      const notification: Notification = {
        id: Date.now().toString(),
        recipientId,
        type,
        subject: subject || '',
        body,
        status: 'pending',
        createdAt: new Date(),
      };

      notifications.push(notification);

      // Simulate sending
      setTimeout(() => {
        const notif = notifications.find(n => n.id === notification.id);
        if (notif) {
          notif.status = 'sent';
          notif.sentAt = new Date();
        }
      }, 1000);

      return res.status(201).json(notification);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const { recipientId, type, status } = req.query;

      let filtered = notifications;

      if (recipientId) {
        filtered = filtered.filter(n => n.recipientId === recipientId);
      }
      if (type) {
        filtered = filtered.filter(n => n.type === type);
      }
      if (status) {
        filtered = filtered.filter(n => n.status === status);
      }

      return res.json(filtered);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  static async sendApplicationStatusEmail(req: Request, res: Response) {
    try {
      const { candidateId, candidateEmail, applicationId, status, decision } = req.body;

      if (!candidateEmail || !applicationId || !status) {
        return res.status(400).json({ error: 'candidateEmail, applicationId, status required' });
      }

      let subject = '';
      let body = '';

      if (status === 'screening') {
        subject = 'Your Application is Being Reviewed';
        body = 'Thank you for applying. We are currently reviewing your application and will be in touch soon.';
      } else if (status === 'completed') {
        if (decision === 'progress') {
          subject = 'Great News! You are Moving Forward';
          body = 'Congratulations! Your application has been reviewed and you are moving forward to the next stage.';
        } else if (decision === 'review') {
          subject = 'Application Under Review';
          body = 'Thank you for your application. We are reviewing your profile and will provide feedback soon.';
        } else {
          subject = 'Application Status Update';
          body = 'Thank you for applying. At this time, we have decided to move forward with other candidates.';
        }
      }

      const notification: Notification = {
        id: Date.now().toString(),
        recipientId: candidateId || 'unknown',
        type: 'email',
        subject,
        body,
        status: 'sent',
        sentAt: new Date(),
        createdAt: new Date(),
      };

      notifications.push(notification);

      return res.status(201).json({
        success: true,
        notification,
        message: `Email sent to ${candidateEmail}`,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  static async sendRecruiterAlert(req: Request, res: Response) {
    try {
      const { recruiterId, recruiterEmail, alertType, applicationId, candidateName } = req.body;

      if (!recruiterEmail || !alertType) {
        return res.status(400).json({ error: 'recruiterEmail, alertType required' });
      }

      let subject = '';
      let body = '';

      if (alertType === 'qualified_candidate') {
        subject = 'Qualified Candidate Alert';
        body = `${candidateName} has qualified for review. Check the dashboard for details.`;
      } else if (alertType === 'screening_complete') {
        subject = 'Screening Complete';
        body = `Screening is complete for application ${applicationId}. Review results in dashboard.`;
      } else if (alertType === 'action_required') {
        subject = 'Action Required';
        body = `Application ${applicationId} requires your review. Please log in to the dashboard.`;
      }

      const notification: Notification = {
        id: Date.now().toString(),
        recipientId: recruiterId || 'unknown',
        type: 'email',
        subject,
        body,
        status: 'sent',
        sentAt: new Date(),
        createdAt: new Date(),
      };

      notifications.push(notification);

      return res.status(201).json({
        success: true,
        notification,
        message: `Alert sent to ${recruiterEmail}`,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send alert' });
    }
  }

  static async getNotificationHistory(req: Request, res: Response) {
    try {
      const { recipientId, limit } = req.query;

      if (!recipientId) {
        return res.status(400).json({ error: 'recipientId required' });
      }

      let history = notifications.filter(n => n.recipientId === recipientId);
      const limitNum = parseInt(limit as string) || 10;
      history = history.slice(-limitNum);

      return res.json(history);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
  }
}