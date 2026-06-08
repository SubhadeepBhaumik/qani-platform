import { Request, Response } from 'express';

interface DashboardStats {
  totalApplications: number;
  screened: number;
  progress: number;
  review: number;
  rejected: number;
  conversionRate: number;
}

interface ApplicationWithScore {
  applicationId: string;
  candidateName: string;
  roleName: string;
  status: string;
  score: number;
  decision: string;
  appliedAt: string;
}

const applications: any[] = [];
const decisions: any[] = [];
const candidates: any[] = [];
const roles: any[] = [];

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;
      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }
      const stats: DashboardStats = {
        totalApplications: 12,
        screened: 10,
        progress: 4,
        review: 3,
        rejected: 3,
        conversionRate: 33.3,
      };
      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  static async getApplications(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;
      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }
      const mockApplications: ApplicationWithScore[] = [
        { applicationId: '1', candidateName: 'Alice Johnson', roleName: 'Senior Developer', status: 'completed', score: 85, decision: 'progress', appliedAt: '2026-05-28T12:14:40.274Z' },
      ];
      return res.json(mockApplications);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  static async getCandidatePipeline(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;
      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }
      return res.json({ applied: 12, screening: 5, qualified: 4, rejected: 3 });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch pipeline' });
    }
  }

  static async getRoleMetrics(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;
      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }
      return res.json([{ roleId: '1', roleName: 'Senior Developer', applicants: 8, screened: 6, qualified: 2, avgScore: 78 }]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch role metrics' });
    }
  }

  static async getScreeningProgress(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;
      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }
      return res.json({ totalSessions: 10, completed: 8, inProgress: 2, avgTimePerSession: 15, avgScorePerSession: 76 });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch screening progress' });
    }
  }

  static async getQualificationBreakdown(req: Request, res: Response) {
    try {
      const { organisationId, roleId } = req.query;
      if (!organisationId || !roleId) {
        return res.status(400).json({ error: 'organisationId and roleId required' });
      }
      return res.json({ mandatory: { passed: 4, failed: 2 }, skills: { excellent: 3, good: 2 }, experience: { wellMatched: 4 } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch breakdown' });
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    try {
      const { organisationId } = req.query;
      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }
      return res.json([{ type: 'high_performer', message: 'Alice is strong match', actionableId: '1' }]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  }
}