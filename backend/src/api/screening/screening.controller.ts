import { Request, Response } from 'express';
import { checkScreeningAllowed, deductCredits } from '../credits/credits.controller';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';
import { ApplicationsController } from '../applications/applications.controller';
import { pushNotification } from '../notifications/notifications.controller';

const prisma = new PrismaClient();

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function getPostcodeLatLng(postcode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/au/${postcode.trim()}`);
    if (!res.ok) return null;
    const data: any = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) };
  } catch { return null; }
}

async function getCityLatLng(city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // If location contains a postcode (4 digits), use postcode lookup first for accuracy
    const postcodeMatch = city.match(/(\d{4})/);
    if (postcodeMatch) {
      const result = await getPostcodeLatLng(postcodeMatch[1]);
      if (result) return result;
    }
    // Otherwise use Nominatim with full address
    const query = city.toLowerCase().includes('australia') ? city : city + ', Australia';
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'QANI-Platform/1.0 (hello@qani.io)' } }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data?.[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch { return null; }
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcLocationScore(distanceKm: number, willingToCommute: boolean): number {
  if (distanceKm <= 20) return 100;
  if (!willingToCommute) return 10;
  const roundTrip = distanceKm * 2;
  return Math.max(30, 100 - (roundTrip - 20) * 1.0);
}

function calcSalaryScore(candidateSalary: number, salaryMax: number, salaryMin: number = 0, yearsExp: number | null = null): number {
  if (salaryMax <= 0) return 100;
  // Above max — penalise
  if (candidateSalary > salaryMax) {
    const overagePct = ((candidateSalary - salaryMax) / salaryMax) * 100;
    let score = Math.max(0, 100 - overagePct * 2.5);
    // Low experience + high salary = extra penalty
    if (yearsExp !== null && yearsExp < 3 && candidateSalary > salaryMax * 1.1) {
      score = Math.max(0, score - 20);
    }
    return score;
  }
  // Below min — penalise proportionally
  if (salaryMin > 0 && candidateSalary < salaryMin) {
    const shortfallPct = ((salaryMin - candidateSalary) / salaryMin) * 100;
    let score = Math.max(20, 100 - shortfallPct * 2);
    // High experience + low salary = extra penalty (suspicious — will likely leave)
    if (yearsExp !== null && yearsExp >= 8 && candidateSalary < salaryMin * 0.85) {
      score = Math.max(10, score - 20);
    }
    return score;
  }
  return 100;
}

function extractPostcodeFromTranscript(messages: any[]): string | null {
  let lastPostcode: string | null = null;
  for (const m of messages) {
    if (m.role === 'user') {
      const match = m.content.match(/\b([0-9]{4})\b/);
      if (match) lastPostcode = match[1];
    }
  }
  return lastPostcode;
}

function extractSalaryFromTranscript(messages: any[]): number | null {
  for (const m of messages) {
    if (m.role === 'user') {
      const c = m.content.toLowerCase();
      // Only match if salary context words present in the message
      const hasSalaryContext = c.includes('salary') || c.includes('aud') || c.includes('annual') || c.includes('year') || c.includes('earn') || c.includes('expect') || c.includes('paid') || c.includes('per year') || c.includes('/yr') || c.includes('k aud') || c.includes('000');
      if (!hasSalaryContext) continue;
      const kMatch = c.match(/\$?\s*(\d+(?:\.\d+)?)\s*k/);
      if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
      const fullMatch = c.match(/\$?\s*(\d{2,3}),?(\d{3})/);
      if (fullMatch) return parseInt(fullMatch[1] + fullMatch[2]);
    }
  }
  return null;
}

function extractYearsExperience(messages: any[]): number | null {
  for (const m of messages) {
    if (m.role === 'user') {
      const c = m.content.toLowerCase();
      const match = c.match(/(\d+)\s*(?:years?|yrs?)/);
      if (match) return parseInt(match[1]);
    }
  }
  return null;
}

function extractCommuteWillingness(messages: any[]): boolean {
  for (const m of messages) {
    if (m.role === 'user') {
      const c = m.content.toLowerCase();
      if (c.includes('not willing') || c.includes('unable') || c.includes('too far') || c.includes("can't") || c.includes('cant')) return false;
    }
  }
  return true;
}

// ─── CONTROLLER ──────────────────────────────────────────────────────────────

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
      const recruiterId = jobData.recruiterId;
      if (recruiterId) {
        const gate = await checkScreeningAllowed(recruiterId);
        if (gate.allowed === false) {
          const recruiterUser = await prisma.user.findUnique({ where: { id: recruiterId } });
          if (recruiterUser) {
            const jt = jobData.title || "a role";
            pushNotification(
              recruiterId, recruiterUser.email,
              "system",
              "Candidate waiting to start AI screening",
              "A candidate is ready to begin AI screening for " + jt + ", but your trial or credits have run out. Purchase credits to let screening continue.",
              jobData.id, applicationId
            ).catch(() => {});
          }
          return res.status(402).json({
            error: "insufficient_credits",
            message: "This role's AI screening is temporarily paused while the hiring team finalizes some account settings. Please check back again in a little while.",
            balance: gate.balance,
          });
        }
      }

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
      const jobForGate: any = session.jobData || {};
      const recruiterIdForGate = jobForGate.recruiterId;
      if (recruiterIdForGate) {
        const gateMid = await checkScreeningAllowed(recruiterIdForGate);
        if (gateMid.allowed === false) {
          return res.status(402).json({
            error: "insufficient_credits",
            message: "This role's AI screening is temporarily paused while the hiring team finalizes some account settings. Please check back again in a little while.",
            balance: gateMid.balance,
          });
        }
      }

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

      // ── RED FLAG EARLY EXIT ───────────────────────────────────────────────
      // Only check during mandatory questions phase
      if (session.currentQuestionIdx <= (session.mandatoryCount || 6)) {
        const userMsg = message.toLowerCase();
        const salaryMax = job.salaryMax || 0;
        const salaryMin = job.salaryMin || 0;
        const requiresLicence = mandQ.driversLicence;

        let redFlagReason = '';

        // Work rights: check last 3 AI messages for work rights context
        const recentUserMsgs = messages.filter((m: any) => m.role === 'user').slice(-2).map((m: any) => m.content.toLowerCase()).join(' ');
        const recentAiContext = messages.filter((m: any) => m.role === 'assistant').slice(-3).map((m: any) => m.content.toLowerCase()).join(' ');
        if (mandQ.workRights) {
          const workRightsTopicActive = recentAiContext.includes('work right') || recentAiContext.includes('working right') || recentAiContext.includes('citizen') || recentAiContext.includes('visa') || recentAiContext.includes('eligible to work') || recentAiContext.includes('work in australia') || recentAiContext.includes('allow') || recentAiContext.includes('work status');
          if (workRightsTopicActive) {
            const noWorkRights =
              recentUserMsgs.includes('no i do not') ||
              recentUserMsgs.includes('i do not have') ||
              recentUserMsgs.includes("i don't have") ||
              recentUserMsgs.includes('i dont') ||
              recentUserMsgs.includes('not eligible') ||
              recentUserMsgs.includes('no visa') ||
              recentUserMsgs.includes('no work right') ||
              recentUserMsgs.includes('no right') ||
              recentUserMsgs.includes('not allowed to work') ||
              recentUserMsgs.includes('cannot work') ||
              recentUserMsgs.includes('no permission') ||
              recentUserMsgs.includes('no any') ||
              (recentUserMsgs.trim() === 'no' || recentUserMsgs.trim() === 'nope' || recentUserMsgs.trim() === 'nah');
            if (noWorkRights) redFlagReason = "work rights";
          }
        }

        // Driver's licence: no licence when required — only check if licence question was just asked
        if (!redFlagReason && requiresLicence) {
          const lastAiMsg = messages.filter((m: any) => m.role === 'assistant').slice(-1)[0]?.content?.toLowerCase() || '';
          const licenceQuestionAsked = lastAiMsg.includes('driver') || lastAiMsg.includes('licence') || lastAiMsg.includes('license');
          if (licenceQuestionAsked) {
            const noLicence =
              recentUserMsgs.includes('no licence') ||
              recentUserMsgs.includes('no license') ||
              recentUserMsgs.includes('do not have a lic') ||
              recentUserMsgs.includes("don't have a lic") ||
              recentUserMsgs.includes('do not hold a') ||
              (recentUserMsgs.trim() === 'no' || recentUserMsgs.trim() === 'nope' || recentUserMsgs.trim() === 'nah');
            if (noLicence) redFlagReason = "driver's licence requirement";
          }
        }


        // Location: beyond 80km and not willing to commute
        if (!redFlagReason) {
          const cp = extractPostcodeFromTranscript(messages);
          if (cp && job.location) {
            const [cLL, jLL] = await Promise.all([getPostcodeLatLng(cp), getCityLatLng(job.location)]);
            if (cLL && jLL) {
              const distKm = Math.round(haversineKm(cLL.lat, cLL.lng, jLL.lat, jLL.lng));
              if (distKm > 80 && !extractCommuteWillingness(messages)) {
                redFlagReason = "location distance";
              }
            }
          }
        }

        if (redFlagReason) {
          const candidateName = job.candidateName || 'there';
          const closingMessage = `Thank you for your honesty, ${candidateName}. Based on your response regarding ${redFlagReason}, I'm afraid this particular role isn't the right fit at this stage. This isn't a reflection of your overall capabilities — it simply comes down to the specific requirements for this position.

I genuinely appreciate you taking the time to speak with me today, and I wish you all the best in your job search. Please keep an eye out for other opportunities that may be a better match for your situation.

Take care, and thank you again.`;

          messages.push({
            id: 'msg-' + Date.now() + '-ai',
            role: 'assistant',
            content: closingMessage,
            timestamp: new Date().toISOString(),
            questionIdx: session.currentQuestionIdx,
            redFlag: true,
          });

          await prisma.screeningSession.update({
            where: { id: sessionId },
            data: {
              messages: messages as any,
              status: 'completed',
              completedAt: new Date(),
              decision: 'rejected',
              score: 10,
            },
          });

          // Update application
          try {
            ApplicationsController.updateApplicationAfterScreening(session.applicationId, {
              score: 10,
              scorecard: { locationScore: 10, salaryScore: 10, qualificationsScore: 10, workRightsScore: 10, skillsScore: 10 },
              aiFeedback: `Screening ended early due to ${redFlagReason} mismatch. Candidate did not meet mandatory requirements.`,
              status: 'rejected',
              screeningSessionId: session.id,
              screeningCompletedAt: new Date().toISOString(),
              transcript: messages.map((m: any) => ({ role: m.role, message: m.content, timestamp: m.timestamp })),
            });
          } catch (e) { console.error('Red flag app update error:', e); }

          const updatedSession = await prisma.screeningSession.findUnique({ where: { id: sessionId } });
          const recruiterId = job.recruiterId;
          if (recruiterId) {
            deductCredits(recruiterId, 5, "screening_mandatory", session.id).catch((e) => console.error("deductCredits error:", e));
          }
          return res.json({ ...updatedSession, messages, redFlag: true });
        }
      }
      // ─────────────────────────────────────────────────────────────────────
      const weights = job.qualificationWeights || {
        locationWeight: 20, salaryWeight: 20, qualificationsWeight: 20, workRightsWeight: 20, skillsWeight: 20,
      };

      // ── SALARY PRE-COMPUTE ───────────────────────────────────────────────
      const salaryMin = job.salaryMin || 0;
      const salaryMax = job.salaryMax || 0;
      const salaryRange = salaryMin > 0 ? '$' + Math.round(salaryMin / 1000) + 'k-$' + Math.round(salaryMax / 1000) + 'k AUD' : 'not specified';
      let salaryDirective = '';
      const detectedSalary = extractSalaryFromTranscript(messages);
      if (detectedSalary && salaryMax > 0) {
        if (detectedSalary >= salaryMin && detectedSalary <= salaryMax) {
          salaryDirective = `SALARY RESOLVED: Candidate stated $${Math.round(detectedSalary/1000)}k which is within the budget of ${salaryRange}. Do NOT question or ask them to revise. Accept and move to next question.`;
        } else if (detectedSalary < salaryMin) {
          salaryDirective = `SALARY ACTION: Candidate stated $${Math.round(detectedSalary/1000)}k which is below the minimum of $${Math.round(salaryMin/1000)}k. If not already done, inform them the range is ${salaryRange} and ask if they'd like to revise.`;
        } else {
          salaryDirective = `SALARY ACTION: Candidate stated $${Math.round(detectedSalary/1000)}k which is above the maximum of $${Math.round(salaryMax/1000)}k. If not already done, inform them the budget is ${salaryRange} and ask if there is flexibility.`;
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      // ── DISTANCE CALCULATION ──────────────────────────────────────────────
      let locationQuestion = mandQ.locationCommute
        ? '2. Location: Are you based in ' + (job.location || 'the required location') + ' or willing to commute/relocate?'
        : '';

      const candidatePostcode = extractPostcodeFromTranscript(messages);
      if (candidatePostcode && job.location) {
        const [cLL, jLL] = await Promise.all([
          getPostcodeLatLng(candidatePostcode),
          getCityLatLng(job.location),
        ]);
        if (cLL && jLL) {
          const distKm = Math.round(haversineKm(cLL.lat, cLL.lng, jLL.lat, jLL.lng));
          if (distKm <= 20) {
            locationQuestion = mandQ.locationCommute
              ? '2. Location/Commute: Candidate is only ' + distKm + 'km from ' + job.location + ' — perfectly within range. DO NOT ask about commute. Acknowledge their location with a positive comment like "Great, you are nice and close to our office!" and move directly to the next question.'
              : '';
          } else {
            locationQuestion = mandQ.locationCommute
              ? '2. Location/Commute: Ask EXACTLY — "The role is based in ' + job.location + '. Based on your postcode, you appear to be approximately ' + distKm + 'km away. Are you willing to commute that distance on a daily basis?"'
              : '';
          }
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      const mandatoryList = [
        mandQ.postcode ? '1. Suburb & Postcode: What is your current suburb and postcode?' : '',
        locationQuestion,
        mandQ.workRights ? '3. Work Rights: Do you have full working rights in Australia (citizen, PR, or valid work visa)?' : '',
        mandQ.salaryExpectation ? '4. Salary: What is your expected annual salary in AUD?' : '',
        mandQ.yearsExperience ? '5. Experience: How many years of relevant experience do you have?' : '',
        mandQ.driversLicence ? '6. Licence: Do you hold a valid Australian driver licence?' : '',
      ].filter(Boolean).join('\r\n');

      const customQ = (job.screeningQuestions || []).map((q: string, i: number) => (i + 1) + '. ' + q).join('\r\n');
      const customCount = (job.screeningQuestions || []).length;

      const systemPrompt = [
        'You are QANI, an expert AI recruitment interviewer for Australian companies.',
        'Interviewing: ' + (job.candidateName || 'candidate') + ' | Role: ' + (job.title || 'this position') + ' | Location: ' + (job.location || 'not specified') + ' | Salary budget: ' + salaryRange,
        '',
        salaryDirective ? 'SALARY STATUS: ' + salaryDirective : '',
        '',
        'STRICT RULES:',
        '- Ask ONE question at a time. Never ask two questions together.',
        '- Ask ALL mandatory questions first IN ORDER before any job-specific questions.',
        '- The greeting ends with "Ready to get started?". Wait for the candidate to confirm they are ready (yes/sure/ok etc). ONLY AFTER confirmation, ask the first mandatory question: their current suburb and postcode. Use their response to assess commute distance to job location (' + (job.location || 'not specified') + '). If beyond 20km, ask if they are willing to commute that distance daily.',
        '- FOLLOW-UP RULE: If a candidate gives a vague, one-word, or evasive answer (under 10 words or no specifics), ask ONE clarifying follow-up before moving to the next question. Example: if asked salary and they say "negotiable" — ask "Could you give me a specific figure or range in AUD?"',
        '- SALARY RULE: When candidate gives a salary figure, compare to job budget ' + salaryRange + '. If within range — accept it and move on, do NOT ask them to revise. If below minimum — say "Just so you know, the budgeted range for this role is ' + salaryRange + '. Is that still your expectation, or would you like to revise?" If above maximum — say "The budget for this role is ' + salaryRange + '. Your expectation is above that — is there flexibility on your end?" Do NOT ask to be more specific if they already gave a clear number.',
        '- Never skip a mandatory question.',
        '- Be warm, professional, and conversational — like a real HR person, not a robot.',
        '- Do not give scoring or feedback during the interview.',
        '- CRITICAL: There are ' + customCount + ' job-specific questions that MUST all be asked after mandatory questions. Do NOT say thank you for completing until every job-specific question has been asked and answered.',
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
        aiResponse.toLowerCase().includes('can you be more specific') ||
        aiResponse.toLowerCase().includes('km away') ||
        aiResponse.toLowerCase().includes('willing to commute') ||
        aiResponse.toLowerCase().includes('is that still your expectation') ||
        aiResponse.toLowerCase().includes('is there flexibility');

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

        // ── PRE-COMPUTE LOCATION SCORE ────────────────────────────────────
        let preLocationScore: number | null = null;
        let locationNote = '';
        const cp = extractPostcodeFromTranscript(messages);
        if (cp && jobLocation !== 'not specified') {
          const [cLL, jLL] = await Promise.all([getPostcodeLatLng(cp), getCityLatLng(jobLocation)]);
          if (cLL && jLL) {
            const distKm = Math.round(haversineKm(cLL.lat, cLL.lng, jLL.lat, jLL.lng));
            const willing = extractCommuteWillingness(messages);
            preLocationScore = calcLocationScore(distKm, willing);
            if (distKm <= 20) {
              locationNote = `Candidate is ${distKm}km from ${jobLocation} — within acceptable radius. Good location fit.`;
            } else if (willing) {
              locationNote = `Candidate is ${distKm}km from ${jobLocation} (${distKm * 2}km daily round trip). Willing to commute but this distance is significant and may impact reliability.`;
            } else {
              locationNote = `Candidate is ${distKm}km from ${jobLocation} and unwilling to commute. Critical location mismatch.`;
            }
          }
        }

        // ── PRE-COMPUTE SALARY SCORE ──────────────────────────────────────
        let preSalaryScore: number | null = null;
        let salaryNote = '';
        const cSal = extractSalaryFromTranscript(messages);
        if (cSal && salaryMax > 0) {
          const yearsExp = extractYearsExperience(messages);
          preSalaryScore = Math.round(calcSalaryScore(cSal, salaryMax, salaryMin, yearsExp));
          if (cSal <= salaryMax) {
            salaryNote = `Candidate expects $${Math.round(cSal / 1000)}k which is within the $${Math.round(salaryMin / 1000)}k-$${Math.round(salaryMax / 1000)}k budget.`;
          } else {
            const over = Math.round(((cSal - salaryMax) / salaryMax) * 100);
            salaryNote = `Candidate expects $${Math.round(cSal / 1000)}k which is ${over}% above the maximum budget of $${Math.round(salaryMax / 1000)}k.`;
          }
        }
        // ─────────────────────────────────────────────────────────────────

        const locationScoreRule = preLocationScore !== null
          ? `- locationScore: USE EXACTLY ${preLocationScore} — pre-calculated from real distance data. DO NOT change this.`
          : '- locationScore: confirmed correct location/willing to relocate = 75-90. Wrong location, unwilling = 15-35.';

        const salaryScoreRule = preSalaryScore !== null
          ? `- salaryScore: USE EXACTLY ${preSalaryScore} — pre-calculated from candidate salary vs budget. DO NOT change this.`
          : '- salaryScore: within budget = 75-90. Up to 20% above budget = 50-70. More than 20% above = 15-35.';

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
          locationScoreRule,
          '- workRightsScore: confirmed valid rights = 85-95. Unclear/evasive = 30-50. No rights = 5-15.',
          salaryScoreRule,
          '- qualificationsScore: VERY STRICT — one strong answer among weak ones = 25-35. Mix of good and vague = 30-45. Consistently specific with examples = 55-70. Exceptional with metrics/outcomes = 75-85. NEVER give above 50 unless majority of answers had real specifics. If ANY answer was one-liner or generic, cap at 45.',
          '- skillsScore: VERY STRICT — even ONE strong answer does not compensate for weak ones. Average ALL answers. Generic one-liners like "I design in figma using AI" or "I follow standards" = 5-15 each. Weight the average down. Cap at 40 unless ALL answers showed technical depth.',
          '- overallScore penalty: If qualificationsScore < 50 AND skillsScore < 50, apply additional 5-point reduction to overallScore.',
          '- overallScore: MUST be weighted average: (locationScore x ' + weights.locationWeight + ' + workRightsScore x ' + weights.workRightsWeight + ' + salaryScore x ' + weights.salaryWeight + ' + qualificationsScore x ' + weights.qualificationsWeight + ' + skillsScore x ' + weights.skillsWeight + ') / 100',
          '- If candidate gave fewer than 3 substantive answers, cap overallScore at 40.',
          '- recommendation: qualified if overall>=70, review if 45-69, rejected if <45.',
          '- feedback: Write 3-4 sentences. Write like a SENIOR RECRUITER with 20+ years experience summarising for a hiring manager who has no time to read the transcript. Start with candidate first name. Be brutally honest. Cover: (1) location only if notable, (2) salary — if below budget AND candidate has many years experience, explicitly flag this as suspicious e.g. "X years experience quoting $Yk raises questions about the accuracy of stated experience or their awareness of market rates", (3) technical quality — reference SPECIFIC answers, quote vague ones directly, (4) bottom line — do not recommend unless genuinely strong. Use words like "not recommended", "requires further technical assessment", "proceed with caution". NEVER say "solid", "strong background", "positive factor" for vague answers.',
          '- feedback: Write 3-4 sentences. Write like a SENIOR RECRUITER with 20+ years experience summarising for a hiring manager who has no time to read the transcript. Start with candidate first name. Be brutally honest. Cover: (1) location only if notable, (2) salary — if below budget AND candidate has many years experience, explicitly flag this as suspicious e.g. "X years experience quoting $Yk raises questions about the accuracy of stated experience or their awareness of market rates", (3) technical quality — reference SPECIFIC answers, quote vague ones directly, (4) bottom line — do not recommend unless genuinely strong. Use words like "not recommended", "requires further technical assessment", "proceed with caution". NEVER say "solid", "strong background", "positive factor" for vague answers.',
          locationNote ? '- Location context: ' + locationNote : '',
          salaryNote ? '- Salary context: ' + salaryNote : '',
          'Return ONLY this JSON, no markdown, no extra text:',
          '{"locationScore":0,"salaryScore":0,"qualificationsScore":0,"workRightsScore":0,"skillsScore":0,"overallScore":0,"recommendation":"review","feedback":"recruiter summary"}',
        ].filter(Boolean).join('\r\n');

        const comp = await openaiScorer.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: scoringPrompt }],
          max_tokens: 250,
          temperature: 0.1,
        });

        const raw = (comp.choices[0].message.content || '{}').trim().replace(/```json/g, '').replace(/```/g, '').trim();
        const p = JSON.parse(raw);

        scorecard = {
          locationScore: preLocationScore !== null ? preLocationScore : Math.min(100, Math.max(0, Number(p.locationScore) || 0)),
          salaryScore: preSalaryScore !== null ? preSalaryScore : Math.min(100, Math.max(0, Number(p.salaryScore) || 0)),
          qualificationsScore: Math.min(100, Math.max(0, Number(p.qualificationsScore) || 0)),
          workRightsScore: Math.min(100, Math.max(0, Number(p.workRightsScore) || 0)),
          skillsScore: Math.min(100, Math.max(0, Number(p.skillsScore) || 0)),
        };

        // Recalculate overallScore deterministically
        overallScore = Math.round(
          (scorecard.locationScore * weights.locationWeight +
            scorecard.workRightsScore * weights.workRightsWeight +
            scorecard.salaryScore * weights.salaryWeight +
            scorecard.qualificationsScore * weights.qualificationsWeight +
            scorecard.skillsScore * weights.skillsWeight) / 100
        );
        overallScore = Math.min(100, Math.max(0, overallScore));

        // Cap recommendation if location is critically low
        if (overallScore >= 70 && scorecard.locationScore < 50) {
          recommendation = 'review';
        } else {
          recommendation = overallScore >= 70 ? 'qualified' : overallScore >= 45 ? 'review' : 'rejected';
        }

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
          const recruiterId = app.job?.recruiterId;
          if (recruiterId) {
            const hasCustomQuestions = (app.job?.screeningQuestions || []).length > 0;
            const creditAmount = hasCustomQuestions ? 15 : 5;
            const creditReason = hasCustomQuestions ? "screening_full" : "screening_mandatory";
            deductCredits(recruiterId, creditAmount, creditReason, session.id).catch((e) => console.error("deductCredits error:", e));
          }
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
