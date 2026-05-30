import { Job, User, Application, Notification, ScreeningSession, SystemLog, ChatMessage } from '../types';
import { mockJobs, mockUsers, mockApplications, mockScreeningSessions, mockNotifications, mockSystemLogs } from '../data/mockData';

// Storage Keys
const KEYS = {
  JOBS: 'qani_jobs',
  USERS: 'qani_users',
  APPLICATIONS: 'qani_applications',
  NOTIFICATIONS: 'qani_notifications',
  SESSIONS: 'qani_sessions',
  LOGS: 'qani_logs',
  CURRENT_USER: 'qani_current_user',
};

// Initialize Local Storage helper
export function initializeLocalStorage() {
  if (!localStorage.getItem(KEYS.JOBS)) {
    localStorage.setItem(KEYS.JOBS, JSON.stringify(mockJobs));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(KEYS.APPLICATIONS)) {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(mockApplications));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  }
  if (!localStorage.getItem(KEYS.SESSIONS)) {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(mockScreeningSessions));
  }
  if (!localStorage.getItem(KEYS.LOGS)) {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(mockSystemLogs));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    // Default to candidate Steve
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(mockUsers[0]));
  }
}

// Low-level getter/setters
function get<T>(key: string, fallback: T[]): T[] {
  initializeLocalStorage();
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// API methods
export const api = {
  // Current logged in user
  getCurrentUser: (): User => {
    initializeLocalStorage();
    const userStr = localStorage.getItem(KEYS.CURRENT_USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        // Fallback
      }
    }
    return mockUsers[0];
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      // Log event
      api.addLog('Log In', user.email, `User logged in with role ${user.role}.`, 'success');
    } else {
      const current = api.getCurrentUser();
      localStorage.removeItem(KEYS.CURRENT_USER);
      if (current) {
        api.addLog('Log Out', current.email, `User requested session termination.`, 'info');
      }
    }
  },

  // Users Management
  getUsers: (): User[] => get<User>(KEYS.USERS, mockUsers),
  saveUser: (user: User) => {
    const list = api.getUsers();
    const idx = list.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    set(KEYS.USERS, list);
    // Sync current user if changed
    const curr = api.getCurrentUser();
    if (curr && curr.id === user.id) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  deleteUser: (id: string) => {
    const list = api.getUsers();
    const updated = list.filter(u => u.id !== id);
    set(KEYS.USERS, updated);
  },

  registerCandidate: (firstName: string, lastName: string, email: string, pwdLength: number): User => {
    const newUser: User = {
      id: `candidate-${Date.now()}`,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: 'candidate',
      emailVerified: false,
      privacy: {
        isPublic: true,
        showPhone: false,
        showLocation: true,
        allowContact: true
      }
    };
    const list = api.getUsers();
    list.push(newUser);
    set(KEYS.USERS, list);
    api.addLog('Candidate Registered', email, `New profile step 1 completed.`, 'success');
    return newUser;
  },

  registerRecruiter: (companyName: string, firstName: string, lastName: string, email: string, industry: string, companySize: string): User => {
    const newUser: User = {
      id: `recruiter-${Date.now()}`,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: 'recruiter',
      companyName,
      title: 'Talent Acquisition Manager',
      companySize,
      industry,
      emailVerified: false,
    };
    const list = api.getUsers();
    list.push(newUser);
    set(KEYS.USERS, list);
    api.addLog('Recruiter Registered', email, `Created workspace node for organization company ${companyName}.`, 'success');
    return newUser;
  },

  // Jobs
  getJobs: (): Job[] => get<Job>(KEYS.JOBS, mockJobs),
  getJobById: (id: string): Job | undefined => api.getJobs().find(j => j.id === id),
  saveJob: (job: Job) => {
    const list = api.getJobs();
    const idx = list.findIndex(j => j.id === job.id);
    if (idx >= 0) {
      list[idx] = job;
      api.addLog('Job Config Updated', api.getCurrentUser().email, `Updated open requirements for ${job.title}.`, 'info');
    } else {
      list.unshift(job);
      api.addLog('New Job Opened', api.getCurrentUser().email, `Published job posting ${job.title}.`, 'success');
    }
    set(KEYS.JOBS, list);
  },
  deleteJob: (id: string) => {
    const list = api.getJobs();
    const filtered = list.filter(j => j.id !== id);
    set(KEYS.JOBS, filtered);
    api.addLog('Job Extinguished', api.getCurrentUser().email, `Closed and deleted job post ID ${id}.`, 'warning');
  },

  // Applications
  getApplications: (): Application[] => get<Application>(KEYS.APPLICATIONS, mockApplications),
  getApplicationById: (id: string): Application | undefined => api.getApplications().find(a => a.id === id),
  saveApplication: (app: Application) => {
    const list = api.getApplications();
    const idx = list.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      list[idx] = app;
    } else {
      list.unshift(app);
    }
    set(KEYS.APPLICATIONS, list);
  },

  applyForJob: (jobId: string, candidateId: string): Application => {
    const existing = api.getApplications().find(a => a.jobId === jobId && a.candidateId === candidateId);
    if (existing) return existing;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      candidateId,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    api.saveApplication(newApp);

    // Dynamic Notifications to Recruiter
    api.addNotification(
      'New Candidate Application',
      `A new candidate has applied to the role: ${api.getJobById(jobId)?.title}.`,
      'job'
    );

    api.addLog('Job Application Submitted', api.getCurrentUser().email, `Successfully applied for job ID ${jobId}.`, 'success');

    return newApp;
  },

  updateApplicationStatus: (id: string, status: Application['status'], notesCont?: { recruiterName: string; content: string }) => {
    const app = api.getApplicationById(id);
    if (app) {
      app.status = status;
      if (notesCont) {
        if (!app.notes) app.notes = [];
        app.notes.push({
          id: `note-${Date.now()}`,
          recruiterName: notesCont.recruiterName,
          content: notesCont.content,
          timestamp: new Date().toISOString()
        });
      }
      api.saveApplication(app);
      api.addLog('Application Transitioned', api.getCurrentUser().email, `Application status changed to ${status}.`, 'info');

      // Add a candidate notification about status change
      const c = api.getUsers().find(u => u.id === app.candidateId);
      if (c) {
        const title = status === 'qualified' ? 'Congratulations! You are qualified.' :
                      status === 'screening' ? 'Invitation to Screen Started' :
                      status === 'rejected' ? 'Application Status Updated' : 'Application Review Update';
        
        api.addNotification(
          title,
          `The recruitment team updated your application for ${api.getJobById(app.jobId)?.title} to status: ${status.toUpperCase()}.`,
          'screening'
        );
      }
    }
  },

  // Conversations & Interactive sessions
  getSessions: (): ScreeningSession[] => get<ScreeningSession>(KEYS.SESSIONS, mockScreeningSessions),
  getSessionById: (id: string): ScreeningSession | undefined => api.getSessions().find(s => s.id === id),
  saveSession: (session: ScreeningSession) => {
    const list = api.getSessions();
    const idx = list.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.push(session);
    }
    set(KEYS.SESSIONS, list);
  },

  startScreening: (applicationId: string): ScreeningSession => {
    const app = api.getApplicationById(applicationId);
    if (!app) throw new Error('Application context not existing.');

    // Check if session already exists
    if (app.screeningSessionId) {
      const existing = api.getSessionById(app.screeningSessionId);
      if (existing) return existing;
    }

    const job = api.getJobById(app.jobId);
    const questions = job?.screeningQuestions || ['Explain your experiences aligned with this role.'];

    const newSession: ScreeningSession = {
      id: `session-${Date.now()}`,
      applicationId,
      status: 'active',
      currentQuestionIdx: 0,
      startDate: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Hello! Welcome to your AI screening interview powered by QANI for the ${job?.title} position. I will guide you through ${questions.length} questions to evaluate your candidacy. Let's begin!\n\nQuestion 1: ${questions[0]}`,
          timestamp: new Date().toISOString(),
          questionIdx: 0
        }
      ]
    };

    api.saveSession(newSession);

    // Associate session id to application
    app.screeningSessionId = newSession.id;
    app.status = 'screening';
    api.saveApplication(app);

    api.addLog('Screen Session Unlocked', api.getCurrentUser().email, `Started conversational evaluations for App ${applicationId}.`, 'success');

    return newSession;
  },

  submitResponseToAI: async (sessionId: string, userResponseText: string): Promise<ScreeningSession> => {
    const session = api.getSessionById(sessionId);
    if (!session || session.status === 'completed') throw new Error('Session is inactive.');

    const app = api.getApplicationById(session.applicationId);
    if (!app) throw new Error('Application context not found.');

    const job = api.getJobById(app.jobId);
    if (!job) throw new Error('Job context not found.');

    const questions = job.screeningQuestions || [];

    // Push User response
    const userMsg: ChatMessage = {
      id: `usr-msg-${Date.now()}`,
      role: 'user',
      content: userResponseText,
      timestamp: new Date().toISOString(),
      questionIdx: session.currentQuestionIdx
    };
    session.messages.push(userMsg);

    // Call server API for the real Gemini SDK evaluation and response generation
    const nextQuestionIdx = session.currentQuestionIdx + 1;
    const isFinished = nextQuestionIdx >= questions.length;

    try {
      const backendResponse = await fetch('/api/v1/screening/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobTitle: job.title,
          jobDescription: job.description,
          mustRequirements: job.requirementsMust,
          screeningQuestions: job.screeningQuestions,
          currentQuestionIdx: session.currentQuestionIdx,
          userResponse: userResponseText,
          isFinished,
          chatHistory: session.messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!backendResponse.ok) {
        throw new Error('API server failed. Falling back to simple AI responses.');
      }

      const resData = await backendResponse.json();
      
      const assistantMsg: ChatMessage = {
        id: `ast-msg-${Date.now()}`,
        role: 'assistant',
        content: resData.messageText,
        timestamp: new Date().toISOString(),
        questionIdx: session.currentQuestionIdx
      };
      session.messages.push(assistantMsg);

      if (isFinished) {
        session.status = 'completed';
        session.endDate = new Date().toISOString();

        // Server also evaluates a score payload
        const scores = resData.scoreDetails || {
          locationScore: 80,
          salaryScore: 75,
          qualificationsScore: 82,
          workRightsScore: 90,
          skillsScore: 80
        };

        const scoreWeights = job.qualificationWeights || {
          locationWeight: 80,
          salaryWeight: 80,
          qualificationsWeight: 80,
          workRightsWeight: 80,
          skillsWeight: 80
        };

        // Compute overall weighted average
        const totalWeight = Object.values(scoreWeights).reduce((a, b) => a + b, 0);
        const weightedSums = 
          (scores.locationScore * (scoreWeights.locationWeight || 80)) +
          (scores.salaryScore * (scoreWeights.salaryWeight || 80)) +
          (scores.qualificationsScore * (scoreWeights.qualificationsWeight || 80)) +
          (scores.workRightsScore * (scoreWeights.workRightsWeight || 80)) +
          (scores.skillsScore * (scoreWeights.skillsWeight || 80));
        
        const finalScore = Math.round(weightedSums / (totalWeight || 400));
        
        app.score = finalScore;
        app.scorecard = scores;
        app.aiFeedback = resData.feedbackText || 'Screening evaluated by automated scoring models successfully.';
        
        // Auto-categorize based on finalScore
        if (finalScore >= 80) {
          app.status = 'qualified';
        } else if (finalScore >= 50) {
          app.status = 'review';
        } else {
          app.status = 'rejected';
        }

        api.saveApplication(app);

        // Notify recruiters of finished run
        api.addNotification(
          'Screening Process Finished',
          `AI assessment is ready for applicant of position: ${job.title}. Score: ${finalScore}/100.`,
          'screening'
        );

        api.addLog('Interactive Evaluation Scored', 'Gemini Recruiter AI', `Final score calculated for app context: ${app.id}. Overall: ${finalScore}/100.`, 'success');
      } else {
        session.currentQuestionIdx = nextQuestionIdx;
      }

      api.saveSession(session);
      return session;

    } catch (e) {
      console.warn('Backend server-side error during interview sync. Simulating response inline.', e);
      // Fallback response simulation if Gemini endpoint is unconfigured or fails
      const nextQuestion = isFinished ? null : questions[nextQuestionIdx];
      let reply = '';
      if (isFinished) {
        reply = "Wonderful, Steve. Thank you for answering all the questions. This concludes our automated conversation today. The HR talent team will evaluate your detailed transcript immediately and provide feedback.";
      } else {
        reply = `Interesting explanation. Let's move on to the next evaluation point.\n\nQuestion ${nextQuestionIdx + 1}: ${nextQuestion}`;
      }

      const assistantMsg: ChatMessage = {
        id: `ast-msg-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        questionIdx: session.currentQuestionIdx
      };
      session.messages.push(assistantMsg);

      if (isFinished) {
        session.status = 'completed';
        session.endDate = new Date().toISOString();
        
        // Mock assessment scorecards on failure fallback
        app.score = 82;
        app.scorecard = {
          locationScore: 85,
          salaryScore: 80,
          qualificationsScore: 78,
          workRightsScore: 90,
          skillsScore: 81
        };
        app.status = 'qualified';
        app.aiFeedback = "The candidate demonstrated high proficiency across standard software disciplines, maintaining robust communication speed.";
        api.saveApplication(app);
      } else {
        session.currentQuestionIdx = nextQuestionIdx;
      }

      api.saveSession(session);
      return session;
    }
  },

  // Notifications
  getNotifications: (): Notification[] => get<Notification>(KEYS.NOTIFICATIONS, mockNotifications),
  addNotification: (title: string, content: string, type: Notification['type']) => {
    const list = api.getNotifications();
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
      status: 'unread',
      type
    };
    list.unshift(newNotif);
    set(KEYS.NOTIFICATIONS, list);
  },
  markNotificationAsRead: (id: string) => {
    const list = api.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.status = 'read';
      set(KEYS.NOTIFICATIONS, list);
    }
  },
  markAllNotificationsRead: () => {
    const list = api.getNotifications().map(n => ({ ...n, status: 'read' as const }));
    set(KEYS.NOTIFICATIONS, list);
  },
  clearNotifications: () => {
    set(KEYS.NOTIFICATIONS, []);
  },

  // Logs (Admin feed)
  getLogs: (): SystemLog[] => get<SystemLog>(KEYS.LOGS, mockSystemLogs),
  addLog: (event: string, user: string, details: string, type: SystemLog['type'] = 'info') => {
    const list = api.getLogs();
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      event,
      user,
      details,
      timestamp: new Date().toISOString(),
      type
    };
    list.unshift(newLog);
    // Keep last 100 logs
    if (list.length > 100) list.pop();
    set(KEYS.LOGS, list);
  }
};
