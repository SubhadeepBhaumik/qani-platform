import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load variables from environment
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini client (Lazy initialization to prevent crash if key is initially absent)
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Falling back to simulated AI interview.');
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// API endpoint to handle real-time Gemini AI recruitment interview exchanges
app.post('/api/v1/screening/exchange', async (req, res) => {
  const {
    jobTitle,
    jobDescription,
    mustRequirements,
    screeningQuestions,
    currentQuestionIdx,
    userResponse,
    isFinished,
    chatHistory
  } = req.body;

  try {
    const ai = getGeminiClient();

    // System instruction to prime the Recruiter AI personality
    const systemInstruction = `You are a professional, objective, and supportive AI Recruiter interviewing a applicant for the position: "${jobTitle}".
Job Details: ${jobDescription}
Mandatory Requirements: ${mustRequirements.join(', ')}
Preconfigured Screening Questions List:
${screeningQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

Always stay supportive, empathetic, and professional. Conduct a standard interview flow.`;

    // Construct prompt
    let userPromptText = '';
    if (isFinished) {
      userPromptText = `The candidate has supplied their last response for the interview.
Candidate response: "${userResponse}"

Since this was the final question, you must:
1. Provide a professional, friendly closing message thanking the candidate for their time.
2. Evaluate the entire interview dialogue and provide constructive analytical summary comments regarding their strengths, potential, and alignments for the recruiters.
3. Compute micro-scores on a scale from 0 to 100 for each of these 5 metrics:
   - locationScore: alignment with required location or work arrangements.
   - salaryScore: alignment of their compensation targets with job budgets.
   - qualificationsScore: satisfaction of certifications, degrees, or licenses.
   - workRightsScore: alignment with visa rights and availability dates.
   - skillsScore: technical depth and relevant hands-on skills discussed.`;
    } else {
      userPromptText = `The candidate answered: "${userResponse}"
Acknowledge candidate response, show professional appreciation, and ask the next question from the preconfigured list which is question #${currentQuestionIdx + 2}: "${screeningQuestions[currentQuestionIdx + 1]}". Do not write any other filler. Keep response crisp.`;
    }

    // Convert history into contents structure
    const previousTurns = chatHistory.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'user' : 'model', // Map roles correctly for the API if needed, or keep standard contents
      parts: [{ text: msg.content }]
    }));

    // Generate output with structured JSON schema
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Let's start the conversational screening roleplay. Ensure compliance with recruiter guidelines.` }] },
        ...chatHistory.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: userPromptText }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            messageText: {
              type: Type.STRING,
              description: 'The response dialogue text spoken directly to the applicant candidate.'
            },
            feedbackText: {
              type: Type.STRING,
              description: 'Constructive performance summary comments generated exclusively for the recruiters to see.'
            },
            scoreDetails: {
              type: Type.OBJECT,
              properties: {
                locationScore: { type: Type.INTEGER, description: 'Score 0-100 indicating geographic or onsite compliance.' },
                salaryScore: { type: Type.INTEGER, description: 'Score 0-100 reflecting salary budget parity.' },
                qualificationsScore: { type: Type.INTEGER, description: 'Score 0-100 for education or training prerequisites reached.' },
                workRightsScore: { type: Type.INTEGER, description: 'Score 0-100 regarding timeline start speed and visa feasibility.' },
                skillsScore: { type: Type.INTEGER, description: 'Score 0-100 based on software expertise or design depth demonstrated.' }
              },
              required: ['locationScore', 'salaryScore', 'qualificationsScore', 'workRightsScore', 'skillsScore']
            }
          },
          required: ['messageText']
        }
      }
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);

    res.json(parsed);

  } catch (err: any) {
    console.error('Gemini call error:', err);
    res.status(500).json({
      error: 'Gemini server transaction error',
      messageText: isFinished 
        ? "Excellent details provided, Steve. That concludes our questions. The assessment scores will be automatically parsed based on our qualification sliders momentarily."
        : `Fascinating perspective. Let's move on to the next evaluation point.\n\nQuestion ${currentQuestionIdx + 2}: ${screeningQuestions[currentQuestionIdx + 1]}`,
      scoreDetails: {
        locationScore: 82,
        salaryScore: 80,
        qualificationsScore: 78,
        workRightsScore: 90,
        skillsScore: 85
      },
      feedbackText: 'Screening concluded with fallbacks due to missing Gemini parameters.'
    });
  }
});

// API endpoint to handle customer support assistant chat queries
app.post('/api/v1/support/chat', async (req, res) => {
  const { message, chatHistory } = req.body;

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are "QANI Support Bot", a professional, knowledgeable, and delightfully helpful customer assistant.
You help candidate applicants and recruiters navigate the QANI Recruitment Platform.
Platform features context:
1. Screening Candidates: Candidates undergo real-time screening interviews. Recruitment scorecards assess location match, salary expectations, technical skills, and work eligibility.
2. Direct Integrations: No client-side leaks. Your Gemini API key is secure inside cloud-run backend container proxy systems.
3. Switch Role Facility: Users can toggle between Candidate, Recruiter, and Admin workspaces using the "Switch Role (Demo)" link in the header.
4. Job Board Sandbox: Recruiters can design new jobs, questions, slider rubrics, and inspect results.

Keep your guidance friendly, highly informative, clear, and professional. Please answer in elegant markdown format, and be succinct.`;

    const chatHistoryPayload = (chatHistory || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...chatHistoryPayload,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I'm here to support you! Let me know how I can help.";
    res.json({ reply });

  } catch (err) {
    // Elegant fallback responses if GEMINI_API_KEY is not defined or is failing
    const query = (message || "").toLowerCase();
    let reply = "";

    if (query.includes("evaluate") || query.includes("qualification") || query.includes("score")) {
      reply = "### QANI Candidate Evaluation\nEvery applicant on the **QANI Platform** is scored across 5 core dimensions:\n1. **Geographic Alignment**: Match for Singapore or remote requirements.\n2. **Salary Expectations**: Alignment with org budgets.\n3. **Qualifications & Education**: Checkmarks for training prerequisites.\n4. **Work Rights & Availability**: Visa status check.\n5. **Technical depth**: Interactive Gemini AI conversations.\n\nRecruiters can modify weightage sliders Live inside the recruiter terminal!";
    } else if (query.includes("secure") || query.includes("key") || query.includes("credential")) {
      reply = "### Ultimate Server-Proxy Shield\nOn **QANI**, we completely block client-side key leakage:\n- All Gemini interactions are mediated securely by Express container servers.\n- Your secret key is never sent, bundled, or cached in the browser.\n- Standard `process.env.GEMINI_API_KEY` keys are fully protected on the backend.";
    } else if (query.includes("role") || query.includes("switch") || query.includes("demo")) {
      reply = "### Demo Role Switching\nYou can easily experience QANI as a Candidate, Recruiter, or Admin:\n- Click on the **Switch Role (Demo)** dropdown at the top-right of your screen.\n- Select either **Candidate Portal**, **Recruiter Portal**, or **Admin Terminal**.\n- The system will immediately update your workspace and mock data.";
    } else if (query.includes("create") || query.includes("add") || query.includes("job")) {
      reply = "### Creating New Job Screener\nRecruiters can design custom interview questions easily:\n1. Go to **Switch Role (Demo)** -> **Recruiter Portal**.\n2. Click on **Job Postings** on the side menu.\n3. Click **Create New Job**.\n4. Define salary boundaries, location limits, and individual screening questions that the candidate will be prompted with!";
    } else {
      reply = `### Hello there! Welcome to QANI Support
I am your **QANI Support Bot** operating directly on Node.js. Ask me anything about:
- 💡 **How screening scorecards work**
- 🛡️ **Server-side API key isolation & protection**
- 🔄 **Switching between applicant and assessment roles**
- 📝 **Designing custom questions as a recruiter or client**

Tell me, are you currently testing as a candidate or a recruiter?`;
    }

    res.json({ reply });
  }
});

// Configure Vite middleware or Static asset paths
async function configureServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QANI Workspace Service running on http://localhost:${PORT}`);
  });
}

configureServer();
