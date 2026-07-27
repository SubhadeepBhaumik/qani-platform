import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../services/auth.service';
import { pushNotification } from '../notifications/notifications.controller';
import { roles } from '../roles/roles.controller';

const prisma = new PrismaClient();
const isHiddenForCompany = (profile: any, callerCompanyName?: string | null): boolean => {
  if (!profile) return false;
  if (profile.profileVisible === false) return true;
  if (!callerCompanyName) return false;
  const blocked: string[] = Array.isArray(profile.hiddenFromCompanies) ? profile.hiddenFromCompanies : [];
  return blocked.some((c: string) => c.trim().toLowerCase() === callerCompanyName.trim().toLowerCase());
};

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

export async function expireStaleApplications() {
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  try {
    const result = await prisma.application.updateMany({
      where: {
        status: 'applied',
        aiScore: null,
        screeningCompletedAt: null,
        appliedAt: { lt: fiveDaysAgo },
      },
      data: { status: 'expired' },
    });
    if (result.count > 0) {
      console.log(`Expired ${result.count} stale application(s) with no completed screening.`);
      await syncApplicationsToMemory();
    }
  } catch (err) {
    console.error('expireStaleApplications error:', err);
  }
}

export class ApplicationsController {
  static async applyForRole(req: Request, res: Response) {
    try {
      await expireStaleApplications();
      const { candidateId, roleId, candidateName, candidateEmail, jobTitle, company, cvUrl, cvFilename } = req.body;
      if (!candidateId || !roleId) {
        return res.status(400).json({ error: 'candidateId and roleId required' });
      }
      const exists = await prisma.application.findFirst({
        where: { candidateId, jobId: roleId, status: { not: 'expired' } }
      });
      if (exists) return res.status(409).json({ error: 'Already applied for this role' });

      const application = await prisma.application.create({
        data: {
          candidateId,
          candidateName: candidateName || 'Unknown',
          candidateEmail: candidateEmail || '',
          job: roleId ? { connect: { id: roleId } } : undefined,
          jobTitle: jobTitle || 'Unknown Role',
          company: company || 'Unknown Company',
          status: 'applied',
          appliedDate: new Date(),
          notes: [],
          ...(cvUrl && { cvUrl }),
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
      await expireStaleApplications();
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const caller = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (caller === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const { candidateId, roleId, status } = req.query;
      const where: any = {};
      if (caller.role === 'admin') {
      if (candidateId) where.candidateId = candidateId as string;
      if (roleId) where.jobId = roleId as string;
      } else if (caller.role === 'recruiter') {
        const myJobs = await prisma.job.findMany({ where: { recruiterId: caller.id }, select: { id: true } });
        const myJobIds = myJobs.map((j: any) => j.id);
        where.jobId = { in: myJobIds };
        const allProfiles = await prisma.candidateProfile.findMany({ select: { userId: true, profileVisible: true, hiddenFromCompanies: true } });
        const hiddenIds = allProfiles.filter((p: any) => isHiddenForCompany(p, caller.companyName)).map((p: any) => p.userId);
        if (hiddenIds.length > 0) { where.candidateId = { notIn: hiddenIds }; }
      } else {
        where.candidateId = caller.id;
      }
      if (status) where.status = status as string;
      const apps = await prisma.application.findMany({ where, orderBy: { appliedAt: 'desc' } });
      return res.json(apps);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  static async getApplication(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const caller = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (caller === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const app = await prisma.application.findUnique({ where: { id: req.params.id } });
      if (!app) return res.status(404).json({ error: 'Application not found' });
      if (caller.role === 'admin') {
        return res.json(app);
      } else if (caller.role === 'recruiter') {
        if (app.jobId === null) { return res.status(403).json({ error: 'Forbidden' }); }
        const job = await prisma.job.findUnique({ where: { id: app.jobId } });
        if (job === null || job.recruiterId !== caller.id) { return res.status(403).json({ error: 'Forbidden' }); }
        if (app.candidateId) {
          const cProf = await prisma.candidateProfile.findUnique({ where: { userId: app.candidateId } });
          if (isHiddenForCompany(cProf, caller.companyName)) { return res.status(403).json({ error: 'Forbidden' }); }
        }
        return res.json(app);
      } else {
        if (app.candidateId !== caller.id) { return res.status(403).json({ error: 'Forbidden' }); }
        return res.json(app);
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch application' });
    }
  }

  static async updateApplicationStatus(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const caller = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (caller === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const { status, recruiterNotes, interviewDateTime, notes } = req.body;
      const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: 'Application not found' });
      if (caller.role !== 'admin' && caller.role !== 'recruiter') { return res.status(403).json({ error: 'Forbidden' }); }
      if (caller.role === 'recruiter' && existing.jobId === null) { return res.status(403).json({ error: 'Forbidden' }); }
      if (caller.role === 'recruiter' && existing.jobId !== null) { const ownedJob = await prisma.job.findUnique({ where: { id: existing.jobId } }); if (ownedJob === null || ownedJob.recruiterId !== caller.id) { return res.status(403).json({ error: 'Forbidden' }); } }
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
        ...(data.transcript && { transcript: data.transcript }),
      }
    }).then(() => syncApplicationsToMemory()).catch(console.error);
  }
}
