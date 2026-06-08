import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { pushNotification } from '../notifications/notifications.controller';
import { roles } from '../roles/roles.controller';

const prisma = new PrismaClient();

// Keep exported applications array for backward compatibility with screening controller
export let applications: any[] = [];

export async function syncApplicationsToMemory() {
  const apps = await prisma.application.findMany();
  applications.length = 0;
  apps.forEach(a => applications.push({
    id: a.id,
    candidateId: a.candidateId,
    candidateName: a.candidateName,
    candidateEmail: a.candidateEmail,
    roleId: a.jobId,
    jobId: a.jobId,
    jobTitle: a.jobTitle,
    company: a.company,
    status: a.status,
    aiScore: a.aiScore,
    score: a.aiScore,
    scoreBreakdown: a.scoreBreakdown,
    scorecard: a.scorecard,
    aiFeedback: a.aiFeedback,
    recruiterNotes: a.recruiterNotes,
    notes: a.notes,
    cvUrl: a.cvUrl,
    appliedDate: a.appliedDate,
    appliedAt: a.appliedAt,
    screeningStartedAt: a.screeningStartedAt,
    screeningCompletedAt: a.screeningCompletedAt,
    screeningSessionId: a.screeningSessionId,
    interviewDateTime: a.interviewDateTime,
  }));
}

export class ApplicationsController {
  static async applyForRole(req: Request, res: Response) {
    try {
      const { candidateId, roleId, candidateName, candidateEmail, jobTitle, company } = req.body;
      if (!candidateId || !roleId) {
        return res.status(400).json({ error: 'candidateId and roleId required' });
      }
      const exists = await prisma.application.findFirst({
        where: { candidateId, jobId: roleId }
      });
      if (exists) return res.status(409).json({ error: 'Already applied for this role' });

      const application = await prisma.application.create({
        data: {
          candidateId,
          candidateName: candidateName || 'Unknown',
          candidateEmail: candidateEmail || '',
          jobId: roleId,
          jobTitle: jobTitle || 'Unknown Role',
          company: company || 'Unknown Company',
          status: 'applied',
          appliedDate: new Date(),
          notes: [],
        }
      });

      await syncApplicationsToMemory();

      try {
        const job = roles.find((r: any) => r.id === roleId);
        pushNotification(
          candidateId, candidateEmail || '',
          'new_application',
          'Application Received — ' + (jobTitle || 'Position'),
          'Your application for ' + (jobTitle || 'the position') + ' has been received. AI screening will begin shortly.',
          roleId, application.id
        );
        const recruiterEmail = job?.recruiterId || 'recruiter@qani.io';
        pushNotification(
          'recruiter-' + recruiterEmail, recruiterEmail,
          'new_application',
          'New Application — ' + (jobTitle || 'Position'),
          (candidateName || 'A candidate') + ' has applied for ' + (jobTitle || 'the position') + '.',
          roleId, application.id
        );
      } catch(e) {}

      return res.status(201).json(application);
    } catch (error) {
      console.error('Apply error:', error);
      return res.status(500).json({ error: 'Failed to create application' });
    }
  }

  static async getApplications(req: Request, res: Response) {
    try {
      const { candidateId, roleId, status } = req.query;
      const where: any = {};
      if (candidateId) where.candidateId = candidateId as string;
      if (roleId) where.jobId = roleId as string;
      if (status) where.status = status as string;
      const apps = await prisma.application.findMany({ where, orderBy: { appliedAt: 'desc' } });
      return res.json(apps);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  static async getApplication(req: Request, res: Response) {
    try {
      const app = await prisma.application.findUnique({ where: { id: req.params.id } });
      if (!app) return res.status(404).json({ error: 'Application not found' });
      return res.json(app);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch application' });
    }
  }

  static async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { status, recruiterNotes, interviewDateTime, notes } = req.body;
      const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: 'Application not found' });

      const updateData: any = {};
      if (status) {
        updateData.status = status;
        if (status === 'screening') updateData.screeningStartedAt = new Date();
        if (['qualified','review','rejected','hired'].includes(status)) updateData.screeningCompletedAt = new Date();
      }
      if (recruiterNotes !== undefined) updateData.recruiterNotes = recruiterNotes;
      if (interviewDateTime !== undefined) updateData.interviewDateTime = interviewDateTime ? new Date(interviewDateTime) : null;
      if (notes !== undefined) updateData.notes = notes;

      const app = await prisma.application.update({ where: { id: req.params.id }, data: updateData });
      await syncApplicationsToMemory();
      return res.json(app);
    } catch (error) {
      console.error('Update status error:', error);
      return res.status(500).json({ error: 'Failed to update application' });
    }
  }

  // Called by screening controller
  static setApplicationStatus(applicationId: string, status: string) {
    prisma.application.update({
      where: { id: applicationId },
      data: { status }
    }).then(() => syncApplicationsToMemory()).catch(console.error);
  }

  static updateApplicationAfterScreening(applicationId: string, data: any) {
    prisma.application.update({
      where: { id: applicationId },
      data: {
        aiScore: data.score,
        scorecard: data.scorecard,
        aiFeedback: data.aiFeedback,
        status: data.status,
        screeningSessionId: data.screeningSessionId,
        screeningCompletedAt: data.screeningCompletedAt ? new Date(data.screeningCompletedAt) : new Date(),
      }
    }).then(() => syncApplicationsToMemory()).catch(console.error);
  }
}
