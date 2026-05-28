import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 5001;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/test', (_req: Request, res: Response) => {
  res.json({ message: 'QANI API running', version: '1.0.0' });
});

app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
});

export default app;