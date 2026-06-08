import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../services/auth.service';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role, companyName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      const passwordHash = await AuthService.hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName: firstName || '',
          lastName: lastName || '',
          role: role || 'candidate',
          companyName: companyName || null,
          emailVerified: true,
        }
      });
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
      console.error('Register error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const passwordMatch = await AuthService.comparePassword(password, user.passwordHash);
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
      console.error('Login error:', error);
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
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
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

  static seedDemoUsers = async () => {
    // Data already seeded via prisma/seed.ts — just log count
    const count = await prisma.user.count();
    console.log('Demo users ready:', count);
  };
}
