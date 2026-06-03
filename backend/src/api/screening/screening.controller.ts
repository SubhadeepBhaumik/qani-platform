import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { ApplicationsController, applications } from '../applications/applications.controller';
import { roles } from '../roles/roles.controller';

interface ScreeningSession {
  id: string;
  applicationId: string;
  status: 'active' | 'completed' | 'paused';
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string; questionIdx?: number }>;
  currentQuestionIdx: number;
  jobData?: any;
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
      // Get application and job data for screening context
      let jobData: any = {};
      try {
        const app = applications.find((a: any) => a.id === applicationId);
        if (app) {
          const job = roles.find((r: any) => r.id === (app.roleId || (app as any).jobId));
          if (job) jobData = { ...job, candidateName };
        }
      } catch(_) {}

      // Build first question based on mandatory questions setup
      const mandQ = jobData.mandatoryQuestions || {};
      const firstQ = mandQ.locationCommute
        ? 'Are you currently based in ' + (jobData.location || 'the required location') + ', or are you willing to commute or relocate?'
        : mandQ.workRights
        ? 'Do you have full working rights in Australia (citizen, permanent resident, or valid work visa)?'
        : mandQ.salaryExpectation
        ? 'What is your expected annual salary in AUD for this role?'
        : mandQ.yearsExperience
        ? 'How many years of relevant experience do you have for this type of role?'
        : "What is your current role and how many years of relevant experience do you have?";

      const name = candidateName || 'there';
      const jobTitle = jobData.title || 'this position';
      const greeting = 'Hi ' + name + '! Welcome to the QANI AI screening process for the ' + jobTitle + ' role. I have a few questions to assess your suitability. Let\'s start: ' + firstQ;

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
            content: greeting,
            timestamp: now,
            questionIdx: 0,
          },
        ],
        createdAt: new Date(),
        jobData,
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
            content: (() => {
              const job = session.jobData || {};
              const mandQ = job.mandatoryQuestions || {};
              const mandatoryList = [
                mandQ.locationCommute ? 'Ask: Are you based in ' + (job.location || 'the required location') + ' or willing to commute/relocate?' : '',
                mandQ.workRights ? 'Ask: Do you have full working rights in Australia (citizen, PR, or valid work visa)?' : '',
                mandQ.salaryExpectation ? 'Ask: What is your expected annual salary in AUD?' : '',
                mandQ.yearsExperience ? 'Ask: How many years of relevant experience do you have in this field?' : '',
                mandQ.driversLicence ? 'Ask: Do you hold a valid Australian driver licence?' : '',
              ].filter(Boolean).join('\n');
              const customQ = (job.screeningQuestions || []).join('\n');
              return [
                'You are QANI, an expert AI recruitment interviewer for Australian companies.',
                'You are interviewing ' + (session.jobData?.candidateName || 'the candidate') + ' for the role of ' + (job.title || 'this position') + '.',
                '',
                'INSTRUCTIONS:',
                '- Ask ONE question at a time',
                '- Be professional and conversational',
                '- Start with mandatory questions first, then job-specific questions',
                '- Do NOT skip mandatory questions',
                '- After all questions, give brief professional feedback',
                '',
                mandatoryList ? 'MANDATORY QUESTIONS (ask these first in order):' : '',
                mandatoryList,
                '',
                customQ ? 'JOB-SPECIFIC QUESTIONS (ask after mandatory):' : '',
                customQ,
                '',
                job.requirementsMust ? 'ROLE REQUIREMENTS: ' + (job.requirementsMust || []).join(', ') : '',
              ].filter(s => s !== undefined).join('\n');
            })(),
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
      const userMsgs = session.messages.filter((m: any) => m.role === 'user');
      const transcript = session.messages
        .map((m: any) => (m.role === 'assistant' ? 'Interviewer' : 'Candidate') + ': ' + m.content)
        .join('\n');

      let scorecard = { locationScore: 25, salaryScore: 25, qualificationsScore: 25, workRightsScore: 25, skillsScore: 25 };
      let overallScore = 25;
      let recommendation = 'rejected';
      let feedback = 'Insufficient responses provided.';

      try {
        const openaiScorer = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const promptLines = [
          'You are a strict recruitment AI scoring a job interview.',
          'Score the CANDIDATE honestly based on quality of their answers.',
          '',
          'INTERVIEW TRANSCRIPT:',
          transcript,
          '',
          'SCORING RULES:',
          '- One-word or meaningless answers = 15-30 per dimension',
          '- Partial answers with some detail = 40-60 per dimension',
          '- Clear detailed professional answers = 65-85 per dimension',
          '- No answers at all = 5-15 per dimension',
          '',
          'Return ONLY this JSON no markdown:',
          '{"locationScore":0,"salaryScore":0,"qualificationsScore":0,"workRightsScore":0,"skillsScore":0,"overallScore":0,"recommendation":"review","feedback":"one sentence"}'
        ];
        const comp = await openaiScorer.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: promptLines.join('\n') }],
          max_tokens: 200,
          temperature: 0.1,
        });
        const raw = (comp.choices[0].message.content || '{}').trim().replace(/```json/g, '').replace(/```/g, '').trim();
        const p = JSON.parse(raw);
        scorecard = {
          locationScore: Math.min(100, Math.max(0, Number(p.locationScore) || 0)),
          salaryScore: Math.min(100, Math.max(0, Number(p.salaryScore) || 0)),
          qualificationsScore: Math.min(100, Math.max(0, Number(p.qualificationsScore) || 0)),
          workRightsScore: Math.min(100, Math.max(0, Number(p.workRightsScore) || 0)),
          skillsScore: Math.min(100, Math.max(0, Number(p.skillsScore) || 0)),
        };
        overallScore = Math.min(100, Math.max(0, Number(p.overallScore) || 0));
        recommendation = ['qualified','review','rejected'].includes(p.recommendation) ? p.recommendation : 'review';
        feedback = p.feedback || 'Screening evaluated.';
      } catch(aiErr) {
        console.error('AI scoring error:', aiErr);
        const base = Math.min(50, 10 + (userMsgs.length * 7));
        overallScore = base;
        scorecard = { locationScore: base, salaryScore: base, qualificationsScore: base, workRightsScore: base, skillsScore: base };
        recommendation = base >= 40 ? 'review' : 'rejected';
        feedback = 'Scored based on response volume.';
      }

      session.score = overallScore;

      try {
        ApplicationsController.updateApplicationAfterScreening(session.applicationId, {
          score: overallScore, scorecard, aiFeedback: feedback,
          status: recommendation, screeningSessionId: session.id,
          screeningCompletedAt: new Date().toISOString(),
        });
      } catch(e) { console.error('App update error:', e); }

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