import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@qani.io';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'QANI AI Recruitment';

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    await sgMail.send({
      to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
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
