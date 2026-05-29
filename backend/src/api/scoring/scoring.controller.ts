import { Request, Response } from 'express';

interface ScoringRule {
  id: string;
  roleId: string;
  requirementId: string;
  name: string;
  category: string;
  minScore: number;
  maxScore: number;
  mandatory: boolean;
  weight: number;
  createdAt: Date;
}

interface CandidateScore {
  id: string;
  sessionId: string;
  requirementId: string;
  score: number;
  feedback: string;
  createdAt: Date;
}

interface RoutingDecision {
  id: string;
  applicationId: string;
  totalScore: number;
  decision: 'progress' | 'review' | 'reject';
  reason: string;
  createdAt: Date;
}

const scoringRules: ScoringRule[] = [];
const candidateScores: CandidateScore[] = [];
const routingDecisions: RoutingDecision[] = [];

export class ScoringController {
  static async createScoringRule(req: Request, res: Response) {
    try {
      const { roleId, requirementId, name, category, minScore, maxScore, mandatory, weight } = req.body;

      if (!roleId || !requirementId || !name) {
        return res.status(400).json({ error: 'roleId, requirementId, name required' });
      }

      const rule: ScoringRule = {
        id: Date.now().toString(),
        roleId,
        requirementId,
        name,
        category,
        minScore: minScore || 0,
        maxScore: maxScore || 100,
        mandatory: mandatory || false,
        weight: weight || 1,
        createdAt: new Date(),
      };

      scoringRules.push(rule);
      return res.status(201).json(rule);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create scoring rule' });
    }
  }

  static async getScoringRules(req: Request, res: Response) {
    try {
      const { roleId } = req.query;

      if (!roleId) {
        return res.status(400).json({ error: 'roleId required' });
      }

      const rules = scoringRules.filter(r => r.roleId === roleId);
      return res.json(rules);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch scoring rules' });
    }
  }

  static async recordScore(req: Request, res: Response) {
    try {
      const { sessionId, requirementId, score, feedback } = req.body;

      if (!sessionId || !requirementId || score === undefined) {
        return res.status(400).json({ error: 'sessionId, requirementId, score required' });
      }

      const candidateScore: CandidateScore = {
        id: Date.now().toString(),
        sessionId,
        requirementId,
        score: Math.min(Math.max(score, 0), 100),
        feedback: feedback || '',
        createdAt: new Date(),
      };

      candidateScores.push(candidateScore);
      return res.status(201).json(candidateScore);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to record score' });
    }
  }

  static async calculateDecision(req: Request, res: Response) {
    try {
      const { applicationId, sessionId, roleId } = req.body;

      if (!applicationId || !sessionId || !roleId) {
        return res.status(400).json({ error: 'applicationId, sessionId, roleId required' });
      }

      // Get all scores for this session
      const scores = candidateScores.filter(s => s.sessionId === sessionId);
      
      // Get rules for this role
      const rules = scoringRules.filter(r => r.roleId === roleId);

      // Calculate weighted score
      let totalScore = 0;
      let totalWeight = 0;
      let mandatoryPass = true;

      for (const rule of rules) {
        const score = scores.find(s => s.requirementId === rule.requirementId);
        
        if (rule.mandatory && (!score || score.score < rule.minScore)) {
          mandatoryPass = false;
        }

        if (score) {
          totalScore += score.score * rule.weight;
          totalWeight += rule.weight;
        }
      }

      const avgScore = totalWeight > 0 ? totalScore / totalWeight : 0;

      // Make decision
      let decision: 'progress' | 'review' | 'reject';
      let reason = '';

      if (!mandatoryPass) {
        decision = 'reject';
        reason = 'Failed mandatory requirement';
      } else if (avgScore >= 80) {
        decision = 'progress';
        reason = 'Strong candidate - meets all requirements';
      } else if (avgScore >= 60) {
        decision = 'review';
        reason = 'Good candidate - requires recruiter review';
      } else {
        decision = 'reject';
        reason = 'Score below threshold';
      }

      const routingDecision: RoutingDecision = {
        id: Date.now().toString(),
        applicationId,
        totalScore: Math.round(avgScore),
        decision,
        reason,
        createdAt: new Date(),
      };

      routingDecisions.push(routingDecision);
      return res.status(201).json(routingDecision);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to calculate decision' });
    }
  }

  static async getRoutingDecision(req: Request, res: Response) {
    try {
      const { applicationId } = req.query;

      if (!applicationId) {
        return res.status(400).json({ error: 'applicationId required' });
      }

      const decision = routingDecisions.find(d => d.applicationId === applicationId);

      if (!decision) {
        return res.status(404).json({ error: 'Decision not found' });
      }

      return res.json(decision);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch decision' });
    }
  }

  static async getSessionScores(req: Request, res: Response) {
    try {
      const { sessionId } = req.query;

      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId required' });
      }

      const scores = candidateScores.filter(s => s.sessionId === sessionId);
      return res.json(scores);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch scores' });
    }
  }
}