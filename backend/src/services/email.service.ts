import sgMail from '@sendgrid/mail';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getEmailConfig() {
  try {
    const settings = await prisma.platformSetting.findMany({
      where: { key: { in: ['sendgridApiKey', 'sendgridFromEmail', 'sendgridFromName'] } }
    });
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    return {
      apiKey: map['sendgridApiKey'] || process.env.SENDGRID_API_KEY || '',
      fromEmail: map['sendgridFromEmail'] || process.env.SENDGRID_FROM_EMAIL || 'noreply@qani.io',
      fromName: map['sendgridFromName'] || process.env.SENDGRID_FROM_NAME || 'QANI AI Recruitment',
    };
  } catch {
    return {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@qani.io',
      fromName: process.env.SENDGRID_FROM_NAME || 'QANI AI Recruitment',
    };
  }
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const config = await getEmailConfig();
    sgMail.setApiKey(config.apiKey);
    await sgMail.send({
      to,
      from: { email: config.fromEmail, name: config.fromName },
      subject,
      html,
    });
    console.log('Email sent to:', to, '|', subject);
    return true;
  } catch (error: any) {
    console.error('SendGrid error:', error?.response?.body || error.message);
    return false;
  }
}

export async function sendApplicationReceivedEmail(to: string, candidateName: string, jobTitle: string, company: string): Promise<boolean> {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <div style="margin-bottom:24px;">
          <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
          <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Application Received</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${candidateName},</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;">Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received successfully.</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;">Our AI screening system will assess your application shortly. You will be notified once the screening is complete.</p>
        <div style="background:#eff6ff;border-radius:8px;padding:16px;margin:24px 0;border-left:4px solid #2563eb;">
          <p style="color:#1e40af;font-size:13px;font-weight:600;margin:0;">Next Step: Complete your AI Screening</p>
          <p style="color:#3b82f6;font-size:13px;margin:8px 0 0;">Log in to qani.io to start your AI screening interview.</p>
        </div>
        <a href="https://qani.io/candidate/dashboard" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Go to Dashboard</a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
      </div>
    </div>
  `;
  return sendEmail(to, `Application Received — ${jobTitle} at ${company}`, html);
}

export async function sendScreeningCompleteEmail(to: string, candidateName: string, jobTitle: string, score: number, recommendation: string): Promise<boolean> {
  const color = recommendation === 'qualified' ? '#059669' : recommendation === 'review' ? '#d97706' : '#dc2626';
  const label = recommendation === 'qualified' ? 'Qualified' : recommendation === 'review' ? 'Under Review' : 'Not Shortlisted';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <div style="margin-bottom:24px;">
          <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
          <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">AI Screening Complete</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${candidateName},</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;">Your AI screening for <strong>${jobTitle}</strong> is complete.</p>
        <div style="text-align:center;margin:24px 0;">
          <div style="display:inline-block;background:#f9fafb;border:2px solid ${color};border-radius:12px;padding:24px 48px;">
            <p style="font-size:40px;font-weight:900;color:${color};margin:0;">${score}%</p>
            <p style="font-size:14px;font-weight:700;color:${color};margin:8px 0 0;">${label}</p>
          </div>
        </div>
        <a href="https://qani.io/candidate/applications" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">View Full Results</a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
      </div>
    </div>
  `;
  return sendEmail(to, `AI Screening Complete — ${jobTitle}`, html);
}

export async function sendInterviewInviteEmail(to: string, candidateName: string, jobTitle: string, company: string, interviewDateTime: string): Promise<boolean> {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <div style="margin-bottom:24px;">
          <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
          <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Interview Invitation</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${candidateName},</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;">Congratulations! You have been invited for an interview for <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
        <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:24px 0;border-left:4px solid #059669;">
          <p style="color:#065f46;font-size:13px;font-weight:600;margin:0;">Interview Scheduled</p>
          <p style="color:#059669;font-size:16px;font-weight:700;margin:8px 0 0;">${interviewDateTime}</p>
        </div>
        <a href="https://qani.io/candidate/notifications" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Confirm Interview</a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
      </div>
    </div>
  `;
  return sendEmail(to, `Interview Invitation — ${jobTitle} at ${company}`, html);
}

export async function sendRecruiterScreeningAlertEmail(to: string, recruiterName: string, candidateName: string, jobTitle: string, score: number, recommendation: string): Promise<boolean> {
  const color = recommendation === 'qualified' ? '#059669' : recommendation === 'review' ? '#d97706' : '#dc2626';
  const label = recommendation === 'qualified' ? 'Qualified' : recommendation === 'review' ? 'Review' : 'Rejected';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <div style="margin-bottom:24px;">
          <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
          <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Screening Complete — Action Required</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${recruiterName},</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;"><strong>${candidateName}</strong> has completed AI screening for <strong>${jobTitle}</strong>.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:24px 0;border:1px solid #e5e7eb;">
          <p style="font-size:28px;font-weight:900;color:${color};margin:0;">${score}% <span style="font-size:14px;font-weight:700;">${label}</span></p>
        </div>
        <a href="https://qani.io/recruiter/applications" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Review Application</a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
      </div>
    </div>
  `;
  return sendEmail(to, `Screening Complete — ${candidateName} scored ${score}% for ${jobTitle}`, html);
}

export async function sendPasswordChangedEmail(to: string, firstName: string, flagToken: string): Promise<boolean> {
  const flagUrl = `https://qani.io/api/v1/auth/flag-password-change?token=${flagToken}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <div style="margin-bottom:24px;">
          <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
          <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Your Password Was Changed</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${firstName},</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;">This is a confirmation that the password for your QANI account was just changed.</p>
        <a href="https://qani.io/" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">Go to Log In</a>
        <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:24px 0;border-left:4px solid #dc2626;">
          <p style="color:#991b1b;font-size:13px;font-weight:600;margin:0 0 8px;">Didn't make this change?</p>
          <p style="color:#7f1d1d;font-size:13px;margin:0 0 12px;">If you did not change your password, click below immediately to secure your account. This will temporarily suspend access until our support team verifies your identity.</p>
          <a href="${flagUrl}" style="display:inline-block;background:#dc2626;color:#fff;font-weight:700;font-size:13px;padding:10px 20px;border-radius:8px;text-decoration:none;">This wasn't me — secure my account</a>
        </div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
      </div>
    </div>
  `;
  return sendEmail(to, 'Your QANI Password Was Changed', html);
}

export async function sendCreditPurchaseEmail(to: string, firstName: string, planName: string, credits: number, amountCents: number, balanceAfter: number): Promise<boolean> {
  const amountFormatted = (amountCents / 100).toFixed(2);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <div style="margin-bottom:24px;">
          <span style="background:#1e40af;color:#fff;font-weight:900;font-size:14px;padding:6px 12px;border-radius:6px;font-family:monospace;">Q</span>
          <span style="font-weight:800;font-size:18px;color:#111827;margin-left:8px;">QANI</span>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Payment Confirmed</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${firstName},</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;">Thanks for your purchase. Here are your receipt details:</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:20px 0;">
          <table style="width:100%;font-size:14px;color:#374151;">
            <tr><td style="padding:6px 0;color:#6b7280;">Plan</td><td style="padding:6px 0;text-align:right;font-weight:600;">${planName}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Credits added</td><td style="padding:6px 0;text-align:right;font-weight:600;">${credits}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Amount charged</td><td style="padding:6px 0;text-align:right;font-weight:600;">AUD $${amountFormatted}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">New balance</td><td style="padding:6px 0;text-align:right;font-weight:600;">${balanceAfter} credits</td></tr>
          </table>
        </div>
        <a href="https://qani.io/" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin:8px 0;">Go to Dashboard</a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="color:#9ca3af;font-size:12px;">QANI AI Recruitment Platform · Australia · <a href="https://qani.io" style="color:#6b7280;">qani.io</a></p>
      </div>
    </div>
  `;
  return sendEmail(to, 'QANI Payment Receipt', html);
}
