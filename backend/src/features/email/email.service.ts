import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import nodemailer from 'nodemailer';

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

  async sendProposalReminderEmail(clientEmail: string, projectName: string) {
    try {
      await this.transporter.sendMail({
        from: `Asceoft Notifications <${process.env.ZOHO_USER}>`,
        to: clientEmail,
        subject: `New Proposal Reminder: ${projectName}`,
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
                <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#7c3aed;font-weight:700;">Proposal reminder</p>
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#20172f;">A content creator sent you a proposal</h1>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4b415f;">
                  You have a new proposal waiting for <strong>${projectName}</strong>.
                </p>
                <div style="border-radius:10px;background:#f4efff;border:1px solid #e5d8ff;padding:14px 16px;">
                  <p style="margin:0;font-size:14px;line-height:1.5;color:#37264f;">
                    This is a quick reminder to review the proposal when you have a moment.
                  </p>
                </div>
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
