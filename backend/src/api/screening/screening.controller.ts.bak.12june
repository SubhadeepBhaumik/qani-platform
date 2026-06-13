import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';
import { ApplicationsController } from '../applications/applications.controller';
import { pushNotification } from '../notifications/notifications.controller';

const prisma = new PrismaClient();

export class ScreeningController {
  static async startScreening(req: Request, res: Response) {
    try {
      const { applicationId, candidateName } = req.body;
      if (!applicationId) return res.status(400).json({ error: 'applicationId required' });

      const now = new Date().toISOString();

      // Fetch application + job from DB
      let jobData: any = {};
      try {
        const app = await prisma.application.findUnique({
          where: { id: applicationId },
          include: { job: true },
        });
        if (app && app.job) {
          jobData = { ...app.job, candidateName };
        }
      } catch (_) {}

      const mandQ = jobData.mandatoryQuestions || {};
      const mandatoryCount = [
        mandQ.locationCommute,
        mandQ.workRights,
        mandQ.salaryExpectation,
        mandQ.yearsExperience,
        mandQ.driversLicence,
        mandQ.postcode,
      ].filter(Boolean).length;
      const customCount = (jobData.screeningQuestions || []).length;
      const totalQuestions = mandatoryCount + customCount;

      const name = candidateName || 'there';
      const jobTitle = jobData.title || 'this position';
      const company = jobData.company || 'our team';
      const greeting = 'Hi ' + name + ', I\'m QANI from ' + company + '.\r\n\r\nThanks for applying for the ' + jobTitle + ' position and for taking the time to speak with me today.\r\n\r\nI\'m an AI recruitment assistant and my job is to help ' + company + ' work through the large number of applications we receive for roles like this. By doing that, our recruiters can spend more time speaking with candidates who are a good match for the position.\r\n\r\nThis first stage is called Screening and should only take around 3 to 5 minutes to complete.\r\n\r\nI\'ll ask you a series of straightforward questions about things like your work rights, location, salary expectations and the essential requirements for the role. Please answer as honestly and as accurately as you can.\r\n\r\nBased on your answers, I\'ll either move you through to the next stage of the process or let you know if we\'re unable to continue.\r\n\r\nReady to get started?';

      const initialMessages = [{ id: 'msg-1', role: 'assistant', content: greeting, timestamp: now, questionIdx: 0 }];

      // Save session to DB
      const session = await prisma.screeningSession.create({
        data: {
          applicationId,
          status: 'active',
          currentQuestionIdx: 0,
          totalQuestions,
          mandatoryCount,
          startDate: new Date(),
          messages: initialMessages as any,
          jobData: jobData as any,
        },
      });

      // Update application status to screening
      ApplicationsController.setApplicationStatus(applicationId, 'screening');

      return res.status(201).json(session);
    } catch (error) {
      console.error('startScreening error:', error);
      return res.status(500).json({ error: 'Failed to start screening' });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { sessionId, message } = req.body;
      if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' });

      // Load session from DB
      const session = await prisma.screeningSession.findUnique({ where: { id: sessionId } });
      if (!session) return res.status(404).json({ error: 'Session not found' });
      if (session.status !== 'active') return res.status(400).json({ error: 'Session is not active' });

      const messages: any[] = Array.isArray(session.messages) ? session.messages : [];

      // Add user message
      messages.push({
        id: 'msg-' + Date.now() + '-u',
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const job: any = session.jobData || {};
      const mandQ = job.mandatoryQuestions || {};
      const weights = job.qualificationWeights || {
        locationWeight: 20, salaryWeight: 20, qualificationsWeight: 20, workRightsWeight: 20, skillsWeight: 20,
      };

      const mandatoryList = [
        mandQ.postcode ? '1. Suburb & Postcode: What is your current suburb and postcode?' : '',
        mandQ.locationCommute ? '2. Location: Are you based in ' + (job.location || 'the required location') + ' or willing to commute/relocate?' : '',
        mandQ.workRights ? '3. Work Rights: Do you have full working rights in Australia (citizen, PR, or valid work visa)?' : '',
        mandQ.salaryExpectation ? '4. Salary: What is your expected annual salary in AUD?' : '',
        mandQ.yearsExperience ? '5. Experience: How many years of relevant experience do you have?' : '',
        mandQ.driversLicence ? '6. Licence: Do you hold a valid Australian driver licence?' : '',
      ].filter(Boolean).join('\r\n');

      const customQ = (job.screeningQuestions || []).map((q: string, i: number) => (i + 1) + '. ' + q).join('\r\n');
      const salaryRange = job.salaryMin ? '$' + Math.round(job.salaryMin / 1000) + 'k-$' + Math.round(job.salaryMax / 1000) + 'k AUD' : 'not specified';

      const systemPrompt = [
        'You are QANI, an expert AI recruitment interviewer for Australian companies.',
        'Interviewing: ' + (job.candidateName || 'candidate') + ' | Role: ' + (job.title || 'this position') + ' | Location: ' + (job.location || 'not specified') + ' | Salary budget: ' + salaryRange,
        '',
        'STRICT RULES:',
        '- Ask ONE question at a time. Never ask two questions together.',
        '- Ask ALL mandatory questions first IN ORDER before any job-specific questions.',
        '- The greeting ends with "Ready to get started?". Wait for the candidate to confirm they are ready (yes/sure/ok etc). ONLY AFTER confirmation, ask the first mandatory question: their current suburb and postcode. Use their response to assess commute distance to job location (' + (job.location || 'not specified') + '). If beyond 20km, ask if they are willing to commute that distance daily.',
        '- FOLLOW-UP RULE: If a candidate gives a vague, one-word, or evasive answer (under 10 words or no specifics), ask ONE clarifying follow-up before moving to the next question. Example: if asked salary and they say "negotiable" — ask "Could you give me a specific figure or range in AUD?"',
        '- For salary questions: note the job budget is ' + salaryRange + '. If candidate expects more than 20% above max, note this will negatively impact their score.',
        '- Never skip a mandatory question.',
        '- Be warm, professional, and conversational — like a real HR person, not a robot.',
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

      // Build answered questions summary
      const mandatoryLabels = [
        mandQ.postcode ? 'Suburb & Postcode' : '',
        mandQ.locationCommute ? 'Location/commute' : '',
        mandQ.workRights ? 'Work rights' : '',
        mandQ.salaryExpectation ? 'Salary expectation' : '',
        mandQ.yearsExperience ? 'Years of experience' : '',
        mandQ.driversLicence ? 'Driver licence' : '',
      ].filter(Boolean);

      const answeredSummary: string[] = [];
      let qIdx = 0;
      for (let i = 0; i < messages.length - 1; i++) {
        if (messages[i].role === 'assistant' && messages[i + 1] && messages[i + 1].role === 'user') {
          const label = qIdx < mandatoryLabels.length ? mandatoryLabels[qIdx] : 'Job-specific Q' + (qIdx - mandatoryLabels.length + 1);
          answeredSummary.push(label + ': ' + messages[i + 1].content.substring(0, 80));
          qIdx++;
        }
      }

      const answeredBlock = answeredSummary.length > 0
        ? '\r\nALREADY ANSWERED — DO NOT ASK THESE AGAIN:\r\n' + answeredSummary.map((s, i) => (i + 1) + '. ' + s).join('\r\n')
        : '';

      const fullSystemPrompt = systemPrompt + answeredBlock;
      const recentMessages = messages.slice(-20);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...recentMessages,
        ],
        max_tokens: 300,
        temperature: 0.4,
      });

      const aiResponse = completion.choices[0].message.content || 'Thank you for your response.';

      messages.push({
        id: 'msg-' + Date.now() + '-ai',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        questionIdx: session.currentQuestionIdx,
      });

      const isFollowUp = aiResponse.toLowerCase().includes('could you') ||
        aiResponse.toLowerCase().includes('can you clarify') ||
        aiResponse.toLowerCase().includes('can you elaborate') ||
        aiResponse.toLowerCase().includes('could you clarify') ||
        aiResponse.toLowerCase().includes('could you provide') ||
        aiResponse.toLowerCase().includes('could you give') ||
        aiResponse.toLowerCase().includes('could you elaborate') ||
        aiResponse.toLowerCase().includes('please clarify') ||
        aiResponse.toLowerCase().includes('please provide') ||
        aiResponse.toLowerCase().includes('please elaborate') ||
        aiResponse.toLowerCase().includes('what do you mean') ||
        aiResponse.toLowerCase().includes('can you be more specific');

      const newQuestionIdx = isFollowUp
        ? session.currentQuestionIdx
        : Math.min(session.totalQuestions, session.currentQuestionIdx + 1);

      // Save updated session to DB
      const updatedSession = await prisma.screeningSession.update({
        where: { id: sessionId },
        data: {
          messages: messages as any,
          currentQuestionIdx: newQuestionIdx,
        },
      });

      return res.json(updatedSession);
    } catch (error) {
      console.error('sendMessage error:', error);
      return res.status(500).json({ error: 'Failed to process message' });
    }
  }

  static async endScreening(req: Request, res: Response) {
    try {
      const { sessionId, decision } = req.body;
      if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

      // Load session from DB
      const session = await prisma.screeningSession.findUnique({ where: { id: sessionId } });
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const messages: any[] = Array.isArray(session.messages) ? session.messages : [];
      const userMsgs = messages.filter((m: any) => m.role === 'user');
      const transcript = messages
        .map((m: any) => (m.role === 'assistant' ? 'Interviewer' : 'Candidate') + ': ' + m.content)
        .join('\r\n');

      let scorecard = { locationScore: 25, salaryScore: 25, qualificationsScore: 25, workRightsScore: 25, skillsScore: 25 };
      let overallScore = 25;
      let recommendation = 'rejected';
      let feedback = 'Insufficient responses provided.';

      try {
        const openaiScorer = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const job: any = session.jobData || {};
        const weights = job.qualificationWeights || {
          locationWeight: 20, salaryWeight: 20, qualificationsWeight: 20, workRightsWeight: 20, skillsWeight: 20,
        };
        const salaryMin = job.salaryMin || 0;
        const salaryMax = job.salaryMax || 0;
        const salaryRange = salaryMin > 0 ? '$' + Math.round(salaryMin / 1000) + 'k-$' + Math.round(salaryMax / 1000) + 'k AUD' : 'not specified';
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
        recommendation = ['qualified', 'review', 'rejected'].includes(p.recommendation) ? p.recommendation : 'review';
        feedback = p.feedback || 'Screening evaluated.';

      } catch (aiErr) {
        console.error('AI scoring error:', aiErr);
        const base = Math.min(50, 10 + (userMsgs.length * 7));
        overallScore = base;
        scorecard = { locationScore: base, salaryScore: base, qualificationsScore: base, workRightsScore: base, skillsScore: base };
        recommendation = base >= 45 ? 'review' : 'rejected';
        feedback = 'Scored based on response volume due to AI error.';
      }

      // Update session in DB
      const updatedSession = await prisma.screeningSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          decision: decision || recommendation,
          score: overallScore,
        },
      });

      // Update application
      try {
        const transcriptForSave = messages.map((m: any) => ({
          role: m.role,
          message: m.content,
          timestamp: m.timestamp,
        }));

        ApplicationsController.updateApplicationAfterScreening(session.applicationId, {
          score: overallScore,
          scorecard,
          aiFeedback: feedback,
          status: recommendation,
          screeningSessionId: session.id,
          screeningCompletedAt: new Date().toISOString(),
          transcript: transcriptForSave,
        });

        // Fetch app for notifications
        const app = await prisma.application.findUnique({
          where: { id: session.applicationId },
          include: { job: true },
        });

        if (app) {
          const jobTitle = app.job?.title || 'the position';
          const candidateEmail = app.candidateEmail || '';
          const candidateId = app.candidateId || '';

          pushNotification(
            candidateId, candidateEmail,
            'screening_complete',
            'AI Screening Complete — ' + jobTitle,
            'Your AI screening for ' + jobTitle + ' is complete. Score: ' + Math.round(overallScore) + '%. Status: ' + recommendation.charAt(0).toUpperCase() + recommendation.slice(1) + '.',
            app.job?.id, session.applicationId
          );

          const recruiterEmail = app.job?.recruiterId || 'recruiter@qani.io';
          const candidateName = app.candidateName || 'A candidate';
          pushNotification(
            'recruiter-' + recruiterEmail, recruiterEmail,
            'screening_complete',
            'Screening Complete — ' + candidateName,
            candidateName + ' completed AI screening for ' + jobTitle + '. Score: ' + Math.round(overallScore) + '%. Recommendation: ' + recommendation + '.',
            app.job?.id, session.applicationId
          );
        }
      } catch (e) {
        console.error('App update error:', e);
      }

      return res.json({ ...updatedSession, scorecard, aiFeedback: feedback });
    } catch (error) {
      console.error('endScreening error:', error);
      return res.status(500).json({ error: 'Failed to end screening' });
    }
  }

  static async getAllSessions(req: Request, res: Response) {
    try {
      const sessions = await prisma.screeningSession.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.json(sessions);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }

  static async getSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = await prisma.screeningSession.findUnique({ where: { id } });
      if (!session) return res.status(404).json({ error: 'Session not found' });
      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch session' });
    }
  }
}
