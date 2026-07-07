import { Injectable, Logger } from '@nestjs/common';

export type ProposalReminderEmail = {
  clientEmail: string;
  proposalPublicId: string;
  projectName: string;
};

type ResendEmailResponse = {
  id?: string;
  message?: string;
  name?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resendApiUrl = 'https://api.resend.com/emails';

  private getFrontendUrl() {
    return (
      process.env.FRONTEND_URL?.replace(/\/$/, '') ??
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  }

  async sendProposalReminderEmail({
    clientEmail,
    proposalPublicId,
    projectName,
  }: ProposalReminderEmail) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.logger.warn(
        'Skipping proposal reminder email because RESEND_API_KEY is not set.',
      );
      return null;
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? 'Acseoft <onboarding@resend.dev>';
    const safeProjectName = escapeHtml(projectName);
    const registrationUrl = `${this.getFrontendUrl()}/client-register?proposalId=${encodeURIComponent(proposalPublicId)}&email=${encodeURIComponent(clientEmail)}`;
    const safeRegistrationUrl = escapeHtml(registrationUrl);
    const subject = `Register to review proposal: ${projectName}`;

    const response = await fetch(this.resendApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: clientEmail,
        subject,
        text: `A content creator has sent you a proposal for "${projectName}". Register as a client to review it: ${registrationUrl}`,
        html: `
          <div style="margin:0;padding:24px;background:#f6f4fb;font-family:Arial,Helvetica,sans-serif;color:#211a2e;">
            <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ebe7f3;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(28,18,46,0.08);">
              <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#7c3aed;font-weight:700;">Client registration</p>
              <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#20172f;">A content creator sent you a proposal</h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4b415f;">
                You have a new proposal waiting for <strong>${safeProjectName}</strong>. Create your client account to review the details.
              </p>
              <a href="${safeRegistrationUrl}" style="display:inline-block;background:#6b1fa8;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:4px;font-size:15px;font-weight:700;">
                Register as client
              </a>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#6f667a;">
                If the button does not work, copy and paste this link into your browser:<br />
                <span style="word-break:break-all;">${safeRegistrationUrl}</span>
              </p>
            </div>
          </div>
        `,
      }),
    });

    const body = (await response
      .json()
      .catch(() => null)) as ResendEmailResponse | null;

    if (!response.ok) {
      throw new Error(
        body?.message ??
          body?.name ??
          `Resend email request failed with status ${response.status}`,
      );
    }

    return body;
  }
}
