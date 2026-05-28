import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'checking...',
  });
});

// Test Route
app.get('/api/v1/test', (req: Request, res: Response) => {
  res.json({
    message: 'QANI API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes (placeholder)
app.post('/api/v1/auth/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // TODO: Hash password, create user in database
  res.status(201).json({
    message: 'User registration endpoint - implement in Sprint 1',
  });
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  // TODO: Implement login
  res.json({
    message: 'Login endpoint - implement in Sprint 1',
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal server error',
      statusCode: err.statusCode || 500,
    },
  });
});

// Start Server
async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');

    app.listen(port, () => {
      console.log(`✓ Server running on http://localhost:${port}`);
      console.log(`✓ API available at http://localhost:${port}/api/v1`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

main();

export default app;
