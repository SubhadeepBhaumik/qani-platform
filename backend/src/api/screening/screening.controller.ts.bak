import { Request, Response } from 'express';
import { OpenAI } from 'openai';

interface ScreeningSession {
  id: string;
  applicationId: string;
  status: 'active' | 'completed' | 'paused';
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
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

      const session: ScreeningSession = {
        id: Date.now().toString(),
        applicationId,
        status: 'active',
        messages: [
          {
            role: 'assistant',
            content: `Hi ${candidateName}! Welcome to the QANI screening process. I'm an AI assistant here to learn more about your background and experience. Let's start with a few questions about your professional experience. What's your current role and how many years have you been working in your field?`,
          },
        ],
        createdAt: new Date(),
      };

      sessions.push(session);
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
      session.messages.push({
        role: 'user',
        content: message,
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
        role: 'assistant',
        content: aiResponse,
      });

      return res.json({
        sessionId: session.id,
        message: aiResponse,
        messageCount: session.messages.length,
      });
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
      session.score = Math.random() * 100;

      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to end screening' });
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