import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';

// In-memory store — persists while server is running
const users: any[] = [];

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, companyName, industry, companySize } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      const hashedPassword = await AuthService.hashPassword(password);
      const user = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || 'candidate',
        companyName: companyName || null,
        industry: industry || null,
        companySize: companySize || null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      const { token, refreshToken } = AuthService.generateTokens(user.id, user.email);
      return res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        emailVerified: user.emailVerified,
        token,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const passwordMatch = await AuthService.comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const { token, refreshToken } = AuthService.generateTokens(user.id, user.email);
      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        emailVerified: user.emailVerified,
        token,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const user = users.find(u => u.id === decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        emailVerified: user.emailVerified,
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  // Seed demo users on startup
  static seedDemoUsers = async () => {
    const demoUsers = [
      { email: 'admin@qani.io', password: 'Admin@QANI2026!', firstName: 'Alex', lastName: 'Mercer', role: 'admin' },
      { email: 'recruiter@qani.io', password: 'Recruit@QANI2026!', firstName: 'Sarah', lastName: 'Chen', role: 'recruiter', companyName: 'Atlassian' },
      { email: 'james.hr@techcorp.au', password: 'Recruit@QANI2026!', firstName: 'James', lastName: 'Morrison', role: 'recruiter', companyName: 'Canva' },
      { email: 'emma.hr@seek.com.au', password: 'Recruit@QANI2026!', firstName: 'Emma', lastName: 'Thompson', role: 'recruiter', companyName: 'Seek' },
      { email: 'candidate@qani.io', password: 'Candi@QANI2026!', firstName: 'Liam', lastName: 'Nguyen', role: 'candidate' },
      { email: 'priya.sharma@gmail.com', password: 'Candi@QANI2026!', firstName: 'Priya', lastName: 'Sharma', role: 'candidate' },
      { email: 'tom.williams@gmail.com', password: 'Candi@QANI2026!', firstName: 'Tom', lastName: 'Williams', role: 'candidate' },
      { email: 'jessica.lee@gmail.com', password: 'Candi@QANI2026!', firstName: 'Jessica', lastName: 'Lee', role: 'candidate' },
      { email: 'marcus.vance@gmail.com', password: 'Candi@QANI2026!', firstName: 'Marcus', lastName: 'Vance', role: 'candidate' },
      { email: 'sophie.martin@gmail.com', password: 'Candi@QANI2026!', firstName: 'Sophie', lastName: 'Martin', role: 'candidate' },
    ];
    for (const u of demoUsers) {
      const exists = users.find(x => x.email === u.email);
      if (!exists) {
        const hashedPassword = await AuthService.hashPassword(u.password);
        users.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          email: u.email,
          password: hashedPassword,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          companyName: (u as any).companyName || null,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        });
        await new Promise(r => setTimeout(r, 10));
      }
    }
    console.log('Demo users seeded:', demoUsers.length);
  };
}
