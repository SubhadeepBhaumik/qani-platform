
import { errorHandler } from './middleware/errorHandler';
import { NotificationsController } from './api/notifications/notifications.controller';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import { AuthController } from './api/auth/auth.controller';
import { RolesController } from './api/roles/roles.controller';
import { RequirementsController } from './api/requirements/requirements.controller';
import { CandidatesController } from './api/candidates/candidates.controller';
import { ApplicationsController } from './api/applications/applications.controller';
import { ScreeningController } from './api/screening/screening.controller';
import { ScoringController } from './api/scoring/scoring.controller';
import { DashboardController } from './api/dashboard/dashboard.controller';

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 5001;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://qani.io', 'http://www.qani.io', 'http://139.180.181.11'], credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// Auth routes
app.post('/api/v1/auth/register', AuthController.register);
app.post('/api/v1/auth/login', AuthController.login);
app.get('/api/v1/auth/me', AuthController.me);

// Role routes
app.post('/api/v1/roles', RolesController.createRole);
app.get('/api/v1/roles', RolesController.getRoles);
app.get('/api/v1/roles/:id', RolesController.getRoleById);
app.put('/api/v1/roles/:id', RolesController.updateRole);
app.delete('/api/v1/roles/:id', RolesController.deleteRole);

// Requirement routes
app.post('/api/v1/requirements', RequirementsController.createRequirement);
app.get('/api/v1/requirements', RequirementsController.getRequirements);
app.put('/api/v1/requirements/:id', RequirementsController.updateRequirement);
app.delete('/api/v1/requirements/:id', RequirementsController.deleteRequirement);

// Candidate routes
app.post('/api/v1/candidates/register', CandidatesController.registerCandidate);
app.get('/api/v1/candidates', CandidatesController.getCandidates);
app.get('/api/v1/candidates/:id', CandidatesController.getCandidate);
app.put('/api/v1/candidates/:id', CandidatesController.updateCandidate);

// Application routes
app.post('/api/v1/applications', ApplicationsController.applyForRole);
app.get('/api/v1/applications', ApplicationsController.getApplications);
app.get('/api/v1/applications/:id', ApplicationsController.getApplication);
app.put('/api/v1/applications/:id/status', ApplicationsController.updateApplicationStatus);

// Screening routes
app.post('/api/v1/screening/start', ScreeningController.startScreening);
app.post('/api/v1/screening/message', ScreeningController.sendMessage);
app.post('/api/v1/screening/end', ScreeningController.endScreening);
app.get('/api/v1/screening/:id', ScreeningController.getSession);

// Scoring routes
app.post('/api/v1/scoring/rules', ScoringController.createScoringRule);
app.get('/api/v1/scoring/rules', ScoringController.getScoringRules);
app.post('/api/v1/scoring/record', ScoringController.recordScore);
app.post('/api/v1/scoring/calculate', ScoringController.calculateDecision);
app.get('/api/v1/scoring/decision', ScoringController.getRoutingDecision);
app.get('/api/v1/scoring/scores', ScoringController.getSessionScores);

// Dashboard routes
app.get('/api/v1/dashboard/stats', DashboardController.getStats);
app.get('/api/v1/dashboard/applications', DashboardController.getApplications);
app.get('/api/v1/dashboard/pipeline', DashboardController.getCandidatePipeline);
app.get('/api/v1/dashboard/role-metrics', DashboardController.getRoleMetrics);
app.get('/api/v1/dashboard/screening-progress', DashboardController.getScreeningProgress);
app.get('/api/v1/dashboard/qualification-breakdown', DashboardController.getQualificationBreakdown);
app.get('/api/v1/dashboard/recommendations', DashboardController.getRecommendations);

// Notification routes
app.post('/api/v1/notifications/send', NotificationsController.sendNotification);
app.get('/api/v1/notifications', NotificationsController.getNotifications);
app.post('/api/v1/notifications/application-status', NotificationsController.sendApplicationStatusEmail);
app.post('/api/v1/notifications/recruiter-alert', NotificationsController.sendRecruiterAlert);
app.get('/api/v1/notifications/history', NotificationsController.getNotificationHistory);
app.put('/api/v1/notifications/:id/read', NotificationsController.markRead);
app.post('/api/v1/notifications/mark-all-read', NotificationsController.markAllRead);

// Test route
app.get('/api/v1/test', (_req: Request, res: Response) => {
  res.json({ message: 'QANI API running', version: '1.0.0' });
});

app.use(errorHandler);


// Stub endpoints to prevent 404s
app.get('/api/v1/screening', ScreeningController.getAllSessions);
app.post('/api/v1/screening/start', (_req, res) => res.status(201).json({ id: 'session-' + Date.now(), status: 'active', messages: [] }));
app.post('/api/v1/screening/message', (_req, res) => res.json({ id: _req.body.sessionId, status: 'active', messages: [] }));
app.post('/api/v1/screening/end', (_req, res) => res.json({ id: _req.body.sessionId, status: 'completed' }));
app.get('/api/v1/audit-logs', (_req, res) => res.json([]));
app.post('/api/v1/audit-logs', (_req, res) => res.status(201).json({}));
app.get('/api/v1/users', (_req, res) => res.json([]));

AuthController.seedDemoUsers().then(() => console.log('Demo users ready'));
app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
});

export default app;