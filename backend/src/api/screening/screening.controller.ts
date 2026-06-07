import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { ApplicationsController, applications } from '../applications/applications.controller';
import { pushNotification } from '../notifications/notifications.controller';
import { roles } from '../roles/roles.controller';

interface ScreeningSession {
  id: string;
  applicationId: string;
  status: 'active' | 'completed' | 'paused';
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string; questionIdx?: number }>;
  currentQuestionIdx: number;
  totalQuestions: number;
  mandatoryCount: number;
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
      if (!applicationId) return res.status(400).json({ error: 'applicationId required' });

      const now = new Date().toISOString();
      let jobData: any = {};
      try {
        const app = applications.find((a: any) => a.id === applicationId);
        if (app) {
          const job = roles.find((r: any) => r.id === (app.roleId || (app as any).jobId));
          if (job) jobData = { ...job, candidateName };
        }
      } catch(_) {}

      const mandQ = jobData.mandatoryQuestions || {};
      const mandatoryCount = [
        mandQ.locationCommute,
        mandQ.workRights,
        mandQ.salaryExpectation,
        mandQ.yearsExperience,
        mandQ.driversLicence,
      ].filter(Boolean).length;
      const customCount = (jobData.screeningQuestions || []).length;
      const totalQuestions = mandatoryCount + customCount;

      const firstQ = mandQ.locationCommute
        ? 'Are you currently based in ' + (jobData.location || 'the required location') + ', or are you willing to commute or relocate?'
        : mandQ.workRights
        ? 'Do you have full working rights in Australia (citizen, permanent resident, or valid work visa)?'
        : mandQ.salaryExpectation
        ? 'What is your expected annual salary in AUD for this role?'
        : mandQ.yearsExperience
        ? 'How many years of relevant experience do you have for this type of role?'
        : 'What is your current role and how many years of relevant experience do you have?';

      const name = candidateName || 'there';
      const jobTitle = jobData.title || 'this position';
      const greeting = 'Hi ' + name + '! Welcome to the QANI AI screening for the ' + jobTitle + ' role. I have ' + totalQuestions + ' questions to assess your suitability. Let\'s start:\r\n\r\n' + firstQ;

      const session: ScreeningSession = {
        id: Date.now().toString(),
        applicationId,
        status: 'active',
        currentQuestionIdx: 0,
        totalQuestions,
        mandatoryCount,
        startDate: now,
        messages: [{ id: 'msg-1', role: 'assistant', content: greeting, timestamp: now, questionIdx: 0 }],
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
      if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' });

      const session = sessions.find(s => s.id === sessionId);
      if (!session) return res.status(404).json({ error: 'Session not found' });
      if (session.status !== 'active') return res.status(400).json({ error: 'Session is not active' });

      session.messages.push({
        id: 'msg-' + Date.now() + '-u',
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const job = session.jobData || {};
      const mandQ = job.mandatoryQuestions || {};
      const weights = job.qualificationWeights || {
        locationWeight: 20,
        salaryWeight: 20,
        qualificationsWeight: 20,
        workRightsWeight: 20,
        skillsWeight: 20,
      };

      const mandatoryList = [
        mandQ.locationCommute ? '1. Location: Are you based in ' + (job.location || 'the required location') + ' or willing to commute/relocate?' : '',
        mandQ.workRights ? '2. Work Rights: Do you have full working rights in Australia (citizen, PR, or valid work visa)?' : '',
        mandQ.salaryExpectation ? '3. Salary: What is your expected annual salary in AUD?' : '',
        mandQ.yearsExperience ? '4. Experience: How many years of relevant experience do you have?' : '',
        mandQ.driversLicence ? '5. Licence: Do you hold a valid Australian driver licence?' : '',
      ].filter(Boolean).join('\r\n');

      const customQ = (job.screeningQuestions || []).map((q: string, i: number) => (i + 1) + '. ' + q).join('\r\n');
      const salaryRange = job.salaryMin ? '$' + Math.round(job.salaryMin/1000) + 'k-$' + Math.round(job.salaryMax/1000) + 'k AUD' : 'not specified';

      const systemPrompt = [
        'You are QANI, an expert AI recruitment interviewer for Australian companies.',
        'Interviewing: ' + (job.candidateName || 'candidate') + ' | Role: ' + (job.title || 'this position') + ' | Location: ' + (job.location || 'not specified') + ' | Salary budget: ' + salaryRange,
        '',
        'STRICT RULES:',
        '- Ask ONE question at a time. Never ask two questions together.',
        '- Ask ALL mandatory questions first IN ORDER before any job-specific questions.',
        '- FOLLOW-UP RULE: If a candidate gives a vague, one-word, or evasive answer (under 10 words or no specifics), ask ONE clarifying follow-up before moving to the next question. Example: if asked salary and they say "negotiable" — ask "Could you give me a specific figure or range in AUD?"',
        '- Never skip a mandatory question.',
        '- Be professional, concise, and conversational.',
        '- Do not give scoring or feedback during the interview.',
        '- When all questions are done, say exactly: "Thank you for completing the screening. Please click End Screening to receive your results."',
        '',
        'SCORING WEIGHTS (for your awareness — used at end):',
        '- Location fit: ' + weights.locationWeight + '%',
        '- Work rights: ' + weights.workRightsWeight + '%',
        '- Salary alignment: ' + weights.salaryWeight + '%',
        '- Qualifications: ' + weights.qualificationsWeight + '%',
        '- Skills: ' + weights.skillsWeight + '%',
        '',
        'MANDATORY QUESTIONS (ask these first, in this order):',
        mandatoryList,
        '',
        customQ ? 'JOB-SPECIFIC QUESTIONS (ask only after all mandatory questions done):' : '',
        customQ,
        '',
        'REQUIREMENTS: ' + (job.requirementsMust || []).join(', '),
      ].filter(s => s !== undefined).join('\r\n');

      // Token optimisation: only send last 12 messages to GPT, not full history
      const recentMessages = session.messages.slice(-12);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentMessages,
        ],
        max_tokens: 300,
        temperature: 0.4,
      });

      const aiResponse = completion.choices[0].message.content || 'Thank you for your response.';

      session.messages.push({
        id: 'msg-' + Date.now() + '-ai',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        questionIdx: session.currentQuestionIdx,
      });

      const assistantCount = session.messages.filter(m => m.role === 'assistant').length;
      session.currentQuestionIdx = Math.max(0, assistantCount - 1);

      return res.json(session);
    } catch (error) {
      console.error('OpenAI Error:', error);
      return res.status(500).json({ error: 'Failed to process message' });
    }
  }

  static async endScreening(req: Request, res: Response) {
    try {
      const { sessionId, decision } = req.body;
      if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

      const session = sessions.find(s => s.id === sessionId);
      if (!session) return res.status(404).json({ error: 'Session not found' });

      session.status = 'completed';
      session.completedAt = new Date();
      session.decision = decision || 'review';

      const userMsgs = session.messages.filter((m: any) => m.role === 'user');
      const transcript = session.messages
        .map((m: any) => (m.role === 'assistant' ? 'Interviewer' : 'Candidate') + ': ' + m.content)
        .join('\r\n');

      let scorecard = { locationScore: 25, salaryScore: 25, qualificationsScore: 25, workRightsScore: 25, skillsScore: 25 };
      let overallScore = 25;
      let recommendation = 'rejected';
      let feedback = 'Insufficient responses provided.';

      try {
        const openaiScorer = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const job = session.jobData || {};
        const weights = job.qualificationWeights || {
          locationWeight: 20, salaryWeight: 20, qualificationsWeight: 20, workRightsWeight: 20, skillsWeight: 20,
        };
        const salaryMin = job.salaryMin || 0;
        const salaryMax = job.salaryMax || 0;
        const salaryRange = salaryMin > 0 ? '$' + Math.round(salaryMin/1000) + 'k-$' + Math.round(salaryMax/1000) + 'k AUD' : 'not specified';
        const requirements = (job.requirementsMust || []).join(', ') || 'not specified';
        const jobLocation = job.location || 'not specified';

        const scoringPrompt = [
          'You are an expert recruitment AI. Score this interview strictly and realistically.',
          'Role: ' + (job.title || 'not specified') + ' | Location: ' + jobLocation + ' | Salary budget: ' + salaryRange,
          'Requirements: ' + requirements,
          '',
          'INTERVIEW TRANSCRIPT:',
          transcript,
          '',
          'SCORING WEIGHTS — use these to calculate overallScore:',
          '- locationScore weight: ' + weights.locationWeight + '%',
          '- workRightsScore weight: ' + weights.workRightsWeight + '%',
          '- salaryScore weight: ' + weights.salaryWeight + '%',
          '- qualificationsScore weight: ' + weights.qualificationsWeight + '%',
          '- skillsScore weight: ' + weights.skillsWeight + '%',
          '',
          'SCORING RULES — be strict:',
          '- locationScore: confirmed correct location/willing to relocate = 75-90. Wrong location, unwilling = 15-35.',
          '- workRightsScore: confirmed valid rights = 85-95. Unclear/evasive = 30-50. No rights = 5-15.',
          '- salaryScore: within budget = 75-90. Up to 20% above budget = 50-70. More than 20% above = 15-35.',
          '- qualificationsScore: vague one-word answers = 15-30. Some detail = 40-60. Specific with examples/metrics = 70-88.',
          '- skillsScore: no evidence of required skills = 10-25. Partial evidence = 40-60. Strong specific evidence = 70-85.',
          '- overallScore: MUST be weighted average: (locationScore x ' + weights.locationWeight + ' + workRightsScore x ' + weights.workRightsWeight + ' + salaryScore x ' + weights.salaryWeight + ' + qualificationsScore x ' + weights.qualificationsWeight + ' + skillsScore x ' + weights.skillsWeight + ') / 100',
          '- If candidate gave fewer than 3 substantive answers, cap overallScore at 40.',
          '- recommendation: qualified if overall>=70, review if 45-69, rejected if <45.',
          '- feedback: 2 sentences. Honest. Mention strongest and weakest dimension.',
          '',
          'Return ONLY this JSON, no markdown, no extra text:',
          '{"locationScore":0,"salaryScore":0,"qualificationsScore":0,"workRightsScore":0,"skillsScore":0,"overallScore":0,"recommendation":"review","feedback":"2 sentence assessment"}',
        ].join('\r\n');

        const comp = await openaiScorer.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: scoringPrompt }],
          max_tokens: 250,
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
        recommendation = base >= 45 ? 'review' : 'rejected';
        feedback = 'Scored based on response volume due to AI error.';
      }

      session.score = overallScore;

      try {
        ApplicationsController.updateApplicationAfterScreening(session.applicationId, {
          score: overallScore, scorecard, aiFeedback: feedback,
          status: recommendation, screeningSessionId: session.id,
          screeningCompletedAt: new Date().toISOString(),
        });

        const app = applications.find((a: any) => a.id === session.applicationId);
        if (app) {
          const job = roles.find((r: any) => r.id === (app.roleId || (app as any).jobId));
          const jobTitle = job?.title || 'the position';
          const candidateEmail = app.candidateEmail || '';
          const candidateId = app.candidateId || '';

          pushNotification(
            candidateId, candidateEmail,
            'screening_complete',
            'AI Screening Complete — ' + jobTitle,
            'Your AI screening for ' + jobTitle + ' is complete. Score: ' + Math.round(overallScore) + '%. Status: ' + recommendation.charAt(0).toUpperCase() + recommendation.slice(1) + '.',
            job?.id, session.applicationId
          );

          const recruiterEmail = job?.recruiterId || 'recruiter@qani.io';
          const candidateName = (app as any).candidateName || 'A candidate';
          pushNotification(
            'recruiter-' + recruiterEmail, recruiterEmail,
            'screening_complete',
            'Screening Complete — ' + candidateName,
            candidateName + ' completed AI screening for ' + jobTitle + '. Score: ' + Math.round(overallScore) + '%. Recommendation: ' + recommendation + '.',
            job?.id, session.applicationId
          );
        }
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
      if (!session) return res.status(404).json({ error: 'Session not found' });
      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch session' });
    }
  }
}
