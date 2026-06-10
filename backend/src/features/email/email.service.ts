import { Injectable, Logger } from '@nestjs/common';

export type ProposalReminderEmail = {
  clientEmail: string;
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

  async sendProposalReminderEmail({
    clientEmail,
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
    const subject = `New proposal reminder: ${projectName}`;

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
        text: `A content creator has sent you a proposal for "${projectName}". Please check your Acseoft dashboard when you have a moment.`,
        html: `
          <div style="margin:0;padding:24px;background:#f6f4fb;font-family:Arial,Helvetica,sans-serif;color:#211a2e;">
            <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ebe7f3;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(28,18,46,0.08);">
              <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#7c3aed;font-weight:700;">Proposal reminder</p>
              <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#20172f;">A content creator sent you a proposal</h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4b415f;">
                You have a new proposal waiting for <strong>${safeProjectName}</strong>.
              </p>
              <div style="border-radius:10px;background:#f4efff;border:1px solid #e5d8ff;padding:14px 16px;">
                <p style="margin:0;font-size:14px;line-height:1.5;color:#37264f;">
                  This is a quick reminder to review the proposal when you have a moment.
                </p>
              </div>
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
