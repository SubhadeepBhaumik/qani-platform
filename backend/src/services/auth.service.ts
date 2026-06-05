import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
const JWT_EXPIRY = '24h';
const REFRESH_EXPIRY = '7d';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  static generateTokens(userId: string, email: string) {
    const token = jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );

    return { token, refreshToken };
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}