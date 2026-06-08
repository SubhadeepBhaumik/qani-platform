import { Request, Response } from 'express';

interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  location?: string;
  resume?: string;
  createdAt: Date;
}

const candidates: Candidate[] = [];

export class CandidatesController {
  static async registerCandidate(req: Request, res: Response) {
    try {
      const { email, firstName, lastName, phone, location, resume } = req.body;

      if (!email || !firstName || !lastName) {
        return res.status(400).json({ error: 'email, firstName, lastName required' });
      }

      const exists = candidates.find(c => c.email === email);
      if (exists) {
        return res.status(409).json({ error: 'Candidate already exists' });
      }

      const candidate: Candidate = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        phone,
        location,
        resume,
        createdAt: new Date(),
      };

      candidates.push(candidate);
      return res.status(201).json(candidate);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to register candidate' });
    }
  }

  static async getCandidates(req: Request, res: Response) {
    try {
      return res.json(candidates);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }

  static async getCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const candidate = candidates.find(c => c.id === id);

      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      return res.json(candidate);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch candidate' });
    }
  }

  static async updateCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { phone, location, resume } = req.body;

      const candidate = candidates.find(c => c.id === id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      if (phone) candidate.phone = phone;
      if (location) candidate.location = location;
      if (resume) candidate.resume = resume;

      return res.json(candidate);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update candidate' });
    }
  }
}