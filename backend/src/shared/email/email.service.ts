import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import nodemailer from 'nodemailer';

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
  private readonly transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  private getFrontendUrl() {
    return (
      process.env.FRONTEND_URL?.replace(/\/$/, '') ??
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  }

  async sendRegistrationOtpEmail(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: `Asceoft Notifications <${process.env.ZOHO_USER}>`,
        to: email,
        subject: `Your Asceoft verification code is ${otp}.`,
        text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your account</title>
          </head>
          <body style="margin:0;padding:0;background:#f6f4fb;">
            <div style="margin:0;padding:24px;background:#f6f4fb;font-family:Arial,Helvetica,sans-serif;color:#211a2e;">
              <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ebe7f3;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(28,18,46,0.08);">
                <h1 style="margin:0 0 12px;font-size:28px;line-height:1.3;color:#000000;">Verify it’s you</h1>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#4b415f;">
                  Enter this 8-digit verification code to finish creating your account.
                </p>
                <div style="margin:0 0 22px;padding:22px 12px;background:#f6f4fb;border:1px solid #ebe7f3;border-radius:8px;text-align:center;">
                  <span style="font-size:32px;line-height:1;font-weight:700;letter-spacing:8px;color:#6f667a;">${otp}</span>
                </div>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6f667a;">
                  This code expires in 10 minutes and can only be used once. If you did not request this code, you can safely ignore this email.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (error) {
      this.logger.warn('Failed to send registration OTP email.', error);
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'UNABLE_TO_SEND_OTP',
        message: 'Unable to send verification code',
      });
    }
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    const safeResetUrl = escapeHtml(resetUrl);

    try {
      await this.transporter.sendMail({
        from: `Asceoft Notifications <${process.env.ZOHO_USER}>`,
        to: email,
        subject: 'Reset your Asceoft password',
        text: `Reset your Asceoft password using this link: ${resetUrl}. This link expires and can only be used once.`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your password</title>
          </head>
          <body style="margin:0;padding:0;background:#f6f4fb;">
            <div style="margin:0;padding:24px;background:#f6f4fb;font-family:Arial,Helvetica,sans-serif;color:#211a2e;">
              <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ebe7f3;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(28,18,46,0.08);">
                <h1 style="margin:0 0 12px;font-size:28px;line-height:1.3;color:#000000;">Reset your password</h1>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#4b415f;">
                  We received a request to reset your Asceoft password.
                </p>
                <a href="${safeResetUrl}" style="display:inline-block;background:#6b1fa8;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:4px;font-size:15px;font-weight:700;">
                  Reset password
                </a>
                <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#6f667a;">
                  This link expires and can only be used once. If you did not request a password reset, you can safely ignore this email.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (error) {
      this.logger.warn('Failed to send password reset email.', error);
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'UNABLE_TO_SEND_PASSWORD_RESET',
        message: 'Unable to send password reset email',
      });
    }
  }

  async sendProposalReminderEmail(
    clientEmail: string,
    proposalPublicId: string,
    campaignId: string,
    projectName: string,
  ) {
    const registrationUrl = `${this.getFrontendUrl()}/client-register?proposalId=${encodeURIComponent(proposalPublicId)}&campaignId=${encodeURIComponent(campaignId)}&email=${encodeURIComponent(clientEmail)}`;
    const safeRegistrationUrl = escapeHtml(registrationUrl);
    const subject = `Register to review proposal: ${projectName}`;

    try {
      await this.transporter.sendMail({
        from: `Asceoft Notifications <${process.env.ZOHO_USER}>`,
        to: clientEmail,
        subject: subject,
        text: `A content creator has sent you a proposal for "${projectName}". Please check your Acseoft dashboard when you have a moment.`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Proposal Reminder</title>
          </head>
          <body style="margin:0;padding:0;background:#f6f4fb;">
          <div style="margin:0;padding:24px;background:#f6f4fb;font-family:Arial,Helvetica,sans-serif;color:#211a2e;">
            <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ebe7f3;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(28,18,46,0.08);">
                <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#7c3aed;font-weight:700;">Client registration</p>
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#20172f;">A content creator sent you a proposal</h1>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4b415f;">
                  You have a new proposal waiting for <strong>${projectName}</strong>. Create your client account to review the details.
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
          </body>
          </html>
        `,
      });

      this.logger.log(`Sent proposal reminder email to ${clientEmail}`);
    } catch (error) {
      this.logger.warn(`Failed to send email.`, error);

      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'UNABLE_TO_SEND_EMAIL',
        message: 'Unable to send email',
      });
    }
  }
}
