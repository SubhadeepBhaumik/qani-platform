import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';

// Mock database (replace with Prisma later)
const users: any[] = [];

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const hashedPassword = await AuthService.hashPassword(password);
      const user = { id: Date.now().toString(), email, password: hashedPassword, firstName, lastName };
      users.push(user);

      const { token, refreshToken } = AuthService.generateTokens(user.id, user.email);

      return res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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

      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await AuthService.comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { token, refreshToken } = AuthService.generateTokens(user.id, user.email);

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        token,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }
}