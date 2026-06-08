import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+12182154146';

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    await client.messages.create({
      body: message,
      from: FROM_NUMBER,
      to,
    });
    console.log('SMS sent to:', to);
    return true;
  } catch (error: any) {
    console.error('Twilio error:', error.message);
    return false;
  }
}

export async function sendOTPSMS(to: string, otp: string): Promise<boolean> {
  const message = `Your QANI verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS(to, message);
}

export async function sendInterviewSMS(to: string, candidateName: string, jobTitle: string, dateTime: string): Promise<boolean> {
  const message = `Hi ${candidateName}, you have an interview for ${jobTitle} scheduled at ${dateTime}. Log in to qani.io to confirm. - QANI AI Recruitment`;
  return sendSMS(to, message);
}

export async function sendScreeningCompleteSMS(to: string, candidateName: string, jobTitle: string, score: number): Promise<boolean> {
  const message = `Hi ${candidateName}, your AI screening for ${jobTitle} is complete. Score: ${score}%. Log in to qani.io to view results. - QANI`;
  return sendSMS(to, message);
}
