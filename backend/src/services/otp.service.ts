// In-memory OTP store — will move to DB in full production
// Each OTP expires in 10 minutes

interface OTPRecord {
  otp: string;
  target: string;
  type: 'email' | 'sms';
  expiresAt: Date;
  used: boolean;
}

const otpStore: Map<string, OTPRecord> = new Map();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(key: string, otp: string, target: string, type: 'email' | 'sms'): void {
  otpStore.set(key, {
    otp,
    target,
    type,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    used: false,
  });
}

export function verifyOTP(key: string, otp: string): { valid: boolean; reason?: string } {
  const record = otpStore.get(key);
  if (!record) return { valid: false, reason: 'OTP not found or expired' };
  if (record.used) return { valid: false, reason: 'OTP already used' };
  if (new Date() > record.expiresAt) {
    otpStore.delete(key);
    return { valid: false, reason: 'OTP expired' };
  }
  if (record.otp !== otp) return { valid: false, reason: 'Invalid OTP' };
  record.used = true;
  otpStore.delete(key);
  return { valid: true };
}
