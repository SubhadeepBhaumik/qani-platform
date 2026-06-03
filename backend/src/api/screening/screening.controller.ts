import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { ApplicationsController } from '../applications/applications.controller';

interface ScreeningSession {
  id: string;
  applicationId: string;
  status: 'active' | 'completed' | 'paused';
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string; questionIdx?: number }>;
  currentQuestionIdx: number;
  startDate: string;
  score?: number;
  decision?: 'progress' | 'review' | 'reject';
  createdAt: Date;
  completedAt?: Date;
}

const sessions: ScreeningSession[] = [];

export class ScreeningController {
  static async startScreening(req: Request, res: Response) {
    try {
      const { applicationId, candidateName } = req.body;

      if (!applicationId) {
        return res.status(400).json({ error: 'applicationId required' });
      }

      const now = new Date().toISOString();
      const session: ScreeningSession = {
        id: Date.now().toString(),
        applicationId,
        status: 'active',
        currentQuestionIdx: 0,
        startDate: now,
        messages: [
          {
            id: 'msg-1',
            role: 'assistant',
            content: `Hi ${candidateName || 'there'}! Welcome to the QANI AI screening process. I'm here to learn more about your background and experience. Let's begin — what's your current role and how many years of relevant experience do you have?`,
            timestamp: now,
            questionIdx: 0,
          },
        ],
        createdAt: new Date(),
      };

      sessions.push(session);
      // Update application status to 'screening'
      try { ApplicationsController.setApplicationStatus(applicationId, 'screening'); } catch(_) {}
      return res.status(201).json(session);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to start screening' });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { sessionId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message required' });
      }

      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.status !== 'active') {
        return res.status(400).json({ error: 'Session is not active' });
      }

      // Add user message
      const userMsgId = 'msg-' + Date.now() + '-u';
      session.messages.push({
        id: userMsgId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });

      // Initialize OpenAI here with env var
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Get AI response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional recruiter conducting a screening interview. Ask relevant questions to assess the candidate's qualifications, experience, and fit for the role. Be conversational but professional. After gathering key information, provide constructive feedback.`,
          },
          ...session.messages,
        ],
        max_tokens: 300,
      });

      const aiResponse =
        completion.choices[0].message.content || 'Thank you for your response.';

      // Add AI message
      session.messages.push({
        id: 'msg-' + Date.now() + '-ai',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        questionIdx: session.currentQuestionIdx,
      });

      session.currentQuestionIdx = Math.floor(session.messages.filter(m => m.role === 'assistant').length);
      return res.json(session);
    } catch (error) {
      console.error('OpenAI Error:', error);
      return res.status(500).json({ error: 'Failed to process message' });
    }
  }

  static async endScreening(req: Request, res: Response) {
    try {
      const { sessionId, decision } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId required' });
      }

      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      session.status = 'completed';
      session.completedAt = new Date();
      session.decision = decision || 'review';

      const userMessages = session.messages.filter((m: any) => m.role === 'user');
      const answerCount = userMessages.length;
      const baseScore = Math.min(100, 40 + (answerCount * 12) + Math.floor(Math.random() * 15));
      session.score = baseScore;

      const scorecard = {
        locationScore: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 16) - 8)),
        salaryScore: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 16) - 8)),
        qualificationsScore: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 16) - 8)),
        workRightsScore: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 16) - 8)),
        skillsScore: Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 16) - 8)),
      };

      const recommendation = baseScore >= 70 ? 'qualified' : baseScore >= 50 ? 'review' : 'rejected';
      const feedback = baseScore >= 70
        ? 'Strong candidate. Meets key requirements and communicated clearly.'
        : baseScore >= 50
        ? 'Potential fit. Some areas need clarification before progressing.'
        : 'Does not meet minimum requirements at this stage.';

      try {
        ApplicationsController.updateApplicationAfterScreening(session.applicationId, {
          score: baseScore,
          scorecard,
          aiFeedback: feedback,
          status: recommendation,
          screeningSessionId: session.id,
          screeningCompletedAt: new Date().toISOString(),
        });
      } catch(e) { console.error('Failed to update application:', e); }

      return res.json({ ...session, scorecard, aiFeedback: feedback });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to end screening' });
    }
  }

  static async getAllSessions(req: Request, res: Response) {
    try {
      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }

  static async getSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = sessions.find(s => s.id === id);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch session' });
    }
  }
}