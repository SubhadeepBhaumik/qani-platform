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

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 5001;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/v1/auth/register', AuthController.register);
app.post('/api/v1/auth/login', AuthController.login);

// Role routes
app.post('/api/v1/roles', RolesController.createRole);
app.get('/api/v1/roles', RolesController.getRoles);
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

// Test route
app.get('/api/v1/test', (_req: Request, res: Response) => {
  res.json({ message: 'QANI API running', version: '1.0.0' });
});

app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
});

export default app;