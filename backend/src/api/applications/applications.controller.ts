import { Request, Response } from 'express';

interface Application {
  id: string;
  candidateId: string;
  roleId: string;
  status: 'applied' | 'screening' | 'progress' | 'review' | 'rejected' | 'hired';
  appliedAt: Date;
  screeningStartedAt?: Date;
  screeningCompletedAt?: Date;
}

const applications: Application[] = [];

export class ApplicationsController {
  static async applyForRole(req: Request, res: Response) {
    try {
      const { candidateId, roleId } = req.body;

      if (!candidateId || !roleId) {
        return res.status(400).json({ error: 'candidateId and roleId required' });
      }

      const exists = applications.find(
        a => a.candidateId === candidateId && a.roleId === roleId
      );
      if (exists) {
        return res.status(409).json({ error: 'Already applied for this role' });
      }

      const application: Application = {
        id: Date.now().toString(),
        candidateId,
        roleId,
        status: 'applied',
        appliedAt: new Date(),
      };

      applications.push(application);
      return res.status(201).json(application);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create application' });
    }
  }

  static async getApplications(req: Request, res: Response) {
    try {
      const { candidateId, roleId, status } = req.query;
      let filtered = applications;

      if (candidateId) {
        filtered = filtered.filter(a => a.candidateId === candidateId);
      }
      if (roleId) {
        filtered = filtered.filter(a => a.roleId === roleId);
      }
      if (status) {
        filtered = filtered.filter(a => a.status === status);
      }

      return res.json(filtered);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  static async getApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const application = applications.find(a => a.id === id);

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      return res.json(application);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch application' });
    }
  }

  static async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'status required' });
      }

      const application = applications.find(a => a.id === id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      application.status = status;
      if (status === 'screening') {
        application.screeningStartedAt = new Date();
      }
      if (status === 'progress' || status === 'review' || status === 'rejected') {
        application.screeningCompletedAt = new Date();
      }

      return res.json(application);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update application' });
    }
  }
}