import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateOTP, storeOTP, verifyOTP, checkOTPValid, consumeOTP } from '../../services/otp.service';
import { sendEmail } from '../../services/email.service';
import { sendOTPSMS } from '../../services/sms.service';
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
      if (user.suspended) {
        return res.status(403).json({ error: 'Your account has been suspended. Please contact your administrator.' });
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
      if (user.suspended) {
        return res.status(403).json({ error: 'Account suspended' });
      }
      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        emailVerified: user.emailVerified,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'userId, currentPassword and newPassword required' });
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const passwordMatch = await AuthService.comparePassword(currentPassword, user.passwordHash);
      if (!passwordMatch) return res.status(401).json({ error: 'Current password is incorrect' });

      if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });

      const newHash = await AuthService.hashPassword(newPassword);
      await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
      return res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: 'Failed to change password' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

      const decoded = AuthService.verifyToken(refreshToken) as any;
      if (!decoded) return res.status(401).json({ error: 'Invalid or expired refresh token' });

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { token, refreshToken: newRefreshToken } = AuthService.generateTokens(user.id, user.email);
      return res.json({ token, refreshToken: newRefreshToken });
    } catch (error) {
      return res.status(401).json({ error: 'Token refresh failed' });
    }
  }

  static async sendOTP(req: Request, res: Response) {
    try {
      const { target, type, userId } = req.body;
      if (!target || !type) return res.status(400).json({ error: 'target and type required' });
      if (type === 'sms') {
        const conflictUser = await prisma.user.findFirst({ where: { phone: target, phoneVerified: true, id: { not: userId } } });
        const conflictProfile = await prisma.candidateProfile.findFirst({ where: { phone: target, phoneVerified: true, userId: { not: userId } } });
        if (conflictUser !== null || conflictProfile !== null) {
          return res.status(409).json({ error: 'This phone number is already verified on a different account. Please use a different number.' });
        }
      }

      const otp = generateOTP();
      const key = userId + ':' + type + ':' + target;
      await storeOTP(key, otp, target, type);

      if (type === 'sms') {
        await sendOTPSMS(target, otp);
        return res.json({ success: true, message: 'OTP sent via SMS' });
      } else {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
            <h2 style="color:#111827;">Your QANI Verification Code</h2>
            <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
              <p style="font-size:36px;font-weight:900;letter-spacing:8px;color:#2563eb;margin:0;">${otp}</p>
            </div>
            <p style="color:#6b7280;font-size:14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          </div>`;
        await sendEmail(target, 'Your QANI Verification Code', html);
        return res.json({ success: true, message: 'OTP sent via email' });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  }

  static async verifyOTPEndpoint(req: Request, res: Response) {
    try {
      const { target, type, otp, userId } = req.body;
      if (!target || !type || !otp) return res.status(400).json({ error: 'target, type and otp required' });

      const key = userId + ':' + type + ':' + target;
      const result = await verifyOTP(key, otp);

      if (!result.valid) return res.status(400).json({ error: result.reason });
      if (type === 'sms' && userId) {
        const verifyingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (verifyingUser !== null) {
          await prisma.user.update({ where: { id: userId }, data: { phone: target, phoneVerified: true } });
          if (verifyingUser.role === 'candidate') {
            await prisma.candidateProfile.upsert({
              where: { userId },
              create: { userId, phone: target, phoneVerified: true },
              update: { phone: target, phoneVerified: true },
            });
          }
        }
      }
      return res.json({ success: true, message: 'OTP verified' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to verify OTP' });
    }
  }

  static seedDemoUsers = async () => {
    // Data already seeded via prisma/seed.ts — just log count
    const count = await prisma.user.count();
    console.log('Demo users ready:', count);
  };

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'email required' });
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.json({ success: true, message: 'If that email exists, a reset code has been sent.' });
      }
      const otp = generateOTP();
      const key = user.id + ':password-reset:' + email;
      await storeOTP(key, otp, email, 'email');
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h2 style="color:#111827;">Reset Your QANI Password</h2>
          <p style="color:#6b7280;font-size:14px;">Use the code below to reset your password.</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
            <p style="font-size:36px;font-weight:900;letter-spacing:8px;color:#2563eb;margin:0;">${otp}</p>
          </div>
          <p style="color:#6b7280;font-size:14px;">This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>`;
      await sendEmail(email, 'Reset Your QANI Password', html);
      return res.json({ success: true, message: 'If that email exists, a reset code has been sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ error: 'Failed to process request' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) return res.status(400).json({ error: 'email, otp and newPassword required' });
      if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Invalid request' });
      const key = user.id + ':password-reset:' + email;
      const result = await checkOTPValid(key, otp);
      if (!result.valid) return res.status(400).json({ error: result.reason });
      const allPastHashes = [user.passwordHash, ...(user.passwordHistory || [])].slice(0, 2);
      for (const oldHash of allPastHashes) {
        const matches = await AuthService.comparePassword(newPassword, oldHash);
        if (matches) {
          return res.status(400).json({ error: 'New password must be different from your last 2 passwords.' });
        }
      }
      const passwordHash = await AuthService.hashPassword(newPassword);
      const newHistory = [user.passwordHash, ...(user.passwordHistory || [])].slice(0, 2);
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash, passwordHistory: newHistory } });
      await consumeOTP(key);
      return res.json({ success: true, message: 'Password reset successfully. Please log in.' });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ error: 'Failed to reset password' });
    }
  }
}
