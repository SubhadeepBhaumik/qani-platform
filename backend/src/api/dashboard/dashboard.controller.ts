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

// Mock data storage (in production use database)
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

      // Simulate data aggregation
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
      const { organisationId, roleId, status } = req.query;

      if (!organisationId) {
        return res.status(400).json({ error: 'organisationId required' });
      }

      // Mock applications list
      const mockApplications: ApplicationWithScore[] = [
        {
          applicationId: '1',
          candidateName: 'Alice Johnson',
          roleName: 'Senior Developer',
          status: 'completed',
          score: 85,
          decision: 'progress',
          appliedAt: '2026-05-28T12:14:40.274Z',
        },
        {
          applicationId: '2',
          candidateName: 'Bob Smith',
          roleName: 'Senior Developer',
          status: 'screening',
          score: 0,
          decision: 'pending',
          appliedAt: '2026-05-29T04:00:00.000Z',
        },
        {
          applicationId: '3',
          candidateName: 'Carol White',
          roleName: 'Product Manager',
          status: 'completed',
          score: 72,
          decision: 'review',
          appliedAt: '2026-05-28T10:00:00.000Z',
        },
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

      const pipeline = {
        applied: 12,
        screening: 5,
        qualified: 4,
        rejected: 3,
      };

      return res.json(pipeline);
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

      const metrics = [
        {
          roleId: '1779968089611',
          roleName: 'Senior Developer',
          applicants: 8,
          screened: 6,
          qualified: 2,
          avgScore: 78,
        },
        {
          roleId: '2',
          roleName: 'Product Manager',
          applicants: 4,
          screened: 4,
          qualified: 2,
          avgScore: 75,
        },
      ];

      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch role metrics' });
    }
  }

  static async getScreeningProgress(req: Request, res: Response) {
    try {
      const {