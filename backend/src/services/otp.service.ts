import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(key: string, otp: string, target: string, type: 'email' | 'sms'): Promise<void> {
  // Delete any existing OTP for this key first
  await prisma.otpRecord.deleteMany({ where: { key } });
  await prisma.otpRecord.create({
    data: {
      key,
      otp,
      target,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    },
  });
}

export async function verifyOTP(key: string, otp: string): Promise<{ valid: boolean; reason?: string }> {
  const record = await prisma.otpRecord.findUnique({ where: { key } });
  if (!record) return { valid: false, reason: 'OTP not found or expired' };
  if (record.used) return { valid: false, reason: 'OTP already used' };
  if (new Date() > record.expiresAt) {
    await prisma.otpRecord.delete({ where: { key } });
    return { valid: false, reason: 'OTP expired' };
  }
  if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP' };
  await prisma.otpRecord.delete({ where: { key } });
  return { valid: true };
}

// Cleanup expired OTPs — call periodically if needed
export async function cleanupExpiredOTPs(): Promise<void> {
  await prisma.otpRecord.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}
export async function checkOTPValid(key: string, otp: string): Promise<{ valid: boolean; reason?: string }> {
  const record = await prisma.otpRecord.findUnique({ where: { key } });
  if (!record) return { valid: false, reason: 'OTP not found or expired' };
  if (record.used) return { valid: false, reason: 'OTP already used' };
  if (new Date() > record.expiresAt) {
    return { valid: false, reason: 'OTP expired' };
  }
  if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP' };
  return { valid: true };
}
export async function consumeOTP(key: string): Promise<void> {
  await prisma.otpRecord.deleteMany({ where: { key } });
}
