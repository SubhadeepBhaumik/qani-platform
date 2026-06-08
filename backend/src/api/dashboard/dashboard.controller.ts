import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const [totalJobs, totalApps, totalCandidates, totalRecruiters] = await Promise.all([
        prisma.job.count(),
        prisma.application.count(),
        prisma.user.count({ where: { role: 'candidate' } }),
        prisma.user.count({ where: { role: 'recruiter' } }),
      ]);
      const qualifiedApps = await prisma.application.count({ where: { status: 'qualified' } });
      const screeningApps = await prisma.application.count({ where: { status: 'screening' } });
      const rejectedApps = await prisma.application.count({ where: { status: 'rejected' } });
      return res.json({
        totalJobs, totalApplications: totalApps, totalCandidates, totalRecruiters,
        qualifiedApplications: qualifiedApps, screeningApplications: screeningApps,
        rejectedApplications: rejectedApps,
        conversionRate: totalApps > 0 ? Math.round((qualifiedApps / totalApps) * 100) : 0,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  static async getApplications(req: Request, res: Response) {
    try {
      const apps = await prisma.application.findMany({ orderBy: { appliedAt: 'desc' }, take: 50 });
      return res.json(apps);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  static async getPipeline(req: Request, res: Response) {
    try {
      const statuses = ['applied', 'screening', 'qualified', 'review', 'rejected', 'hired'];
      const pipeline = await Promise.all(
        statuses.map(async (status) => ({
          status,
          count: await prisma.application.count({ where: { status } })
        }))
      );
      return res.json(pipeline);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch pipeline' });
    }
  }

  static async getRoleMetrics(req: Request, res: Response) {
    try {
      const jobs = await prisma.job.findMany({ take: 20, orderBy: { createdAt: 'desc' } });
      const metrics = await Promise.all(jobs.map(async (job) => {
        const apps = await prisma.application.findMany({ where: { jobId: job.id } });
        const qualified = apps.filter(a => a.status === 'qualified').length;
        const avgScore = apps.filter(a => a.aiScore).length > 0
          ? Math.round(apps.filter(a => a.aiScore).reduce((sum, a) => sum + (a.aiScore || 0), 0) / apps.filter(a => a.aiScore).length)
          : 0;
        return { jobId: job.id, title: job.title, company: job.company, totalApps: apps.length, qualified, avgScore };
      }));
      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch role metrics' });
    }
  }

  static async getScreeningProgress(req: Request, res: Response) {
    try {
      const sessions = await prisma.screeningSession.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch screening progress' });
    }
  }

  static async getQualificationBreakdown(req: Request, res: Response) {
    try {
      const apps = await prisma.application.findMany({ where: { aiScore: { not: null } } });
      const breakdown = {
        qualified: apps.filter(a => (a.aiScore || 0) >= 70).length,
        review: apps.filter(a => (a.aiScore || 0) >= 45 && (a.aiScore || 0) < 70).length,
        rejected: apps.filter(a => (a.aiScore || 0) < 45).length,
      };
      return res.json(breakdown);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch breakdown' });
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    try {
      const topCandidates = await prisma.application.findMany({
        where: { status: 'qualified', aiScore: { not: null } },
        orderBy: { aiScore: 'desc' },
        take: 5,
      });
      return res.json(topCandidates);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  }
}
