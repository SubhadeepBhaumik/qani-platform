
import { errorHandler } from './middleware/errorHandler';
import { NotificationsController } from './api/notifications/notifications.controller';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import { AuthController } from './api/auth/auth.controller';
import { RolesController, syncRolesToMemory } from './api/roles/roles.controller';
import { RequirementsController } from './api/requirements/requirements.controller';
import { CandidatesController } from './api/candidates/candidates.controller';
import { ApplicationsController, syncApplicationsToMemory } from './api/applications/applications.controller';
import { ScreeningController } from './api/screening/screening.controller';
import { ScoringController } from './api/scoring/scoring.controller';
import { DashboardController } from './api/dashboard/dashboard.controller';
import { TeamController } from './api/team/team.controller';

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 5001;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://qani.io', 'http://www.qani.io', 'http://139.180.181.11'], credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
app.post('/api/v1/auth/refresh', AuthController.refreshToken);
app.post('/api/v1/auth/change-password', AuthController.changePassword);
app.post('/api/v1/team/invite', TeamController.createInvite);
app.get('/api/v1/team/members', TeamController.getTeamMembers);
app.post('/api/v1/team/accept', TeamController.acceptInvite);
app.delete('/api/v1/team/members/:id', TeamController.removeTeamMember);
app.post('/api/v1/auth/send-otp', AuthController.sendOTP);
app.post('/api/v1/auth/verify-otp', AuthController.verifyOTPEndpoint);

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
app.post('/api/v1/candidates/:id/upload-cv', CandidatesController.uploadCV);
app.post('/api/v1/candidates/:id/upload-photo', CandidatesController.uploadPhoto);
app.get('/api/v1/candidates/:id/profile', CandidatesController.getProfile);

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
app.get('/api/v1/dashboard/pipeline', DashboardController.getPipeline);
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
app.get('/api/v1/users', async (_req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, companyName: true, suspended: true, createdAt: true }
    });
    res.json(users);
  } catch(e) { res.json([]); }
});

// ─── CMS API ─────────────────────────────────────────────────────────────────
const cmsPrisma = new (require('@prisma/client').PrismaClient)();

app.get('/api/v1/admin/cms', async (_req, res) => {
  try {
    const record = await cmsPrisma.platformSetting.findUnique({ where: { key: 'cms_content' } });
    if (record) return res.json({ success: true, data: JSON.parse(record.value) });
    return res.json({ success: false, data: null });
  } catch(e) { res.json({ success: false, data: null }); }
});

app.post('/api/v1/admin/cms', async (req: any, res: any) => {
  try {
    const data = req.body;
    await cmsPrisma.platformSetting.upsert({
      where: { key: 'cms_content' },
      create: { key: 'cms_content', value: JSON.stringify(data) },
      update: { value: JSON.stringify(data) },
    });
    res.json({ success: true });
  } catch(e: any) { res.status(500).json({ error: 'Failed to save CMS: ' + e.message }); }
});

// ─── PLATFORM SETTINGS API ───────────────────────────────────────────────────
const settingsPrisma = new (require('@prisma/client').PrismaClient)();

app.get('/api/v1/admin/settings', async (_req, res) => {
  try {
    const settings = await settingsPrisma.platformSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s: any) => { map[s.key] = s.value; });
    // Return current config (mask sensitive keys)
    res.json({
      sendgridFromEmail: map['sendgridFromEmail'] || process.env.SENDGRID_FROM_EMAIL || '',
      sendgridFromName: map['sendgridFromName'] || process.env.SENDGRID_FROM_NAME || 'QANI AI Recruitment',
      sendgridApiKey: map['sendgridApiKey'] ? '***configured***' : (process.env.SENDGRID_API_KEY ? '***configured***' : ''),
      twilioAccountSid: map['twilioAccountSid'] || process.env.TWILIO_ACCOUNT_SID || '',
      twilioPhoneNumber: map['twilioPhoneNumber'] || process.env.TWILIO_PHONE_NUMBER || '',
      twilioAuthToken: map['twilioAuthToken'] ? '***configured***' : (process.env.TWILIO_AUTH_TOKEN ? '***configured***' : ''),
      openaiApiKey: map['openaiApiKey'] ? '***configured***' : (process.env.OPENAI_API_KEY ? '***configured***' : ''),
      openaiModel: map['openaiModel'] || 'gpt-4o-mini',
      otpExpiryMinutes: map['otpExpiryMinutes'] || '10',
      otpRetryLimit: map['otpRetryLimit'] || '3',
      featureAiScreening: map['featureAiScreening'] || 'true',
      featureOtpEnforcement: map['featureOtpEnforcement'] || 'true',
    });
  } catch(e) { res.status(500).json({ error: 'Failed to load settings' }); }
});

app.post('/api/v1/admin/settings', async (req: any, res: any) => {
  try {
    const allowed = ['sendgridFromEmail','sendgridFromName','sendgridApiKey','twilioAccountSid','twilioPhoneNumber','twilioAuthToken','openaiApiKey','openaiModel','otpExpiryMinutes','otpRetryLimit','featureAiScreening','featureOtpEnforcement'];
    const updates = req.body;
    for (const key of allowed) {
      if (updates[key] !== undefined && updates[key] !== '' && updates[key] !== '***configured***') {
        await settingsPrisma.platformSetting.upsert({
          where: { key },
          create: { key, value: updates[key] },
          update: { value: updates[key] },
        });
      }
    }
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch(e) { res.status(500).json({ error: 'Failed to save settings' }); }
});

app.post('/api/v1/admin/settings/test-email', async (req: any, res: any) => {
  try {
    const { sendEmail } = require('./services/email.service');
    const recipient = req.body?.recipient || process.env.SENDGRID_FROM_EMAIL || 'bhaumiksubhadeep@gmail.com';
    await sendEmail(recipient, 'QANI — Email Test', '<p>This is a test email from QANI Admin Panel. Email delivery is working correctly.</p>');
    res.json({ success: true, message: 'Test email sent to ' + recipient });
  } catch(e: any) { res.status(500).json({ error: 'Failed to send test email: ' + e.message }); }
});

app.post('/api/v1/admin/settings/test-sms', async (req: any, res: any) => {
  try {
    const { sendSMS } = require('./services/sms.service');
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });
    await sendSMS(phone, 'QANI Test SMS — Your SMS delivery is working correctly.');
    res.json({ success: true, message: 'Test SMS sent successfully' });
  } catch(e: any) { res.status(500).json({ error: 'Failed to send test SMS: ' + e.message }); }
});

// DB Backup trigger
app.post('/api/v1/admin/backup', async (_req, res) => {
  try {
    const { execSync } = require('child_process');
    execSync('bash /home/qani/backups/backup.sh', { timeout: 60000 });
    res.json({ success: true, message: 'Backup completed successfully', timestamp: new Date().toISOString() });
  } catch(e: any) { res.status(500).json({ error: 'Backup failed: ' + e.message }); }
});

// Last backup info
app.get('/api/v1/admin/backup/status', async (_req, res) => {
  try {
    const { execSync } = require('child_process');
    const files = execSync('ls -lt /home/qani/backups/*.gz 2>/dev/null | head -5').toString().trim();
    const lastBackup = execSync('ls -lt /home/qani/backups/*.gz 2>/dev/null | head -1').toString().trim();
    const lastBackupTime = lastBackup ? lastBackup.split(/\s+/).slice(5,8).join(' ') : 'No backups found';
    res.json({ success: true, lastBackup: lastBackupTime, files: files.split('\n').filter(Boolean) });
  } catch(e) { res.json({ success: false, lastBackup: 'No backups found', files: [] }); }
});

// SSL status
app.get('/api/v1/admin/ssl/status', async (_req, res) => {
  try {
    const { execSync } = require('child_process');
    const result = execSync('certbot certificates 2>/dev/null | grep -E "Expiry|Domains"').toString().trim();
    res.json({ success: true, info: result });
  } catch(e) { res.json({ success: false, info: 'Could not read SSL status' }); }
});

// Danger zone — clear OTPs
app.post('/api/v1/admin/danger/clear-otps', async (_req, res) => {
  try {
    const dangerPrisma = new (require('@prisma/client').PrismaClient)();
    const result = await dangerPrisma.otpRecord.deleteMany({});
    res.json({ success: true, message: `Cleared ${result.count} OTP records` });
  } catch(e: any) { res.status(500).json({ error: 'Failed: ' + e.message }); }
});

// Danger zone — clear screening sessions
app.post('/api/v1/admin/danger/clear-sessions', async (_req, res) => {
  try {
    const dangerPrisma = new (require('@prisma/client').PrismaClient)();
    const result = await dangerPrisma.screeningSession.deleteMany({ where: { status: 'completed' } });
    res.json({ success: true, message: `Cleared ${result.count} completed screening sessions` });
  } catch(e: any) { res.status(500).json({ error: 'Failed: ' + e.message }); }
});

app.get('/api/v1/admin/health', async (_req, res) => {
  try {
    await settingsPrisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      database: 'connected',
      api: 'online',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch(e) {
    res.json({ status: 'degraded', database: 'disconnected', api: 'online', uptime: Math.floor(process.uptime()) });
  }
});

AuthController.seedDemoUsers().then(() => console.log('Demo users ready'));
syncRolesToMemory().then(() => console.log('Jobs synced from DB:', require('./api/roles/roles.controller').roles.length));
syncApplicationsToMemory().then(() => console.log('Applications synced from DB:', require('./api/applications/applications.controller').applications.length));
app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
});

export default app;