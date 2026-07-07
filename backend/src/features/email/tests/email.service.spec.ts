import { BadRequestException, HttpStatus } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailService } from '../email.service';

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

describe('EmailService', () => {
  const originalEnv = process.env;
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GMAIL_USER: 'hello@example.com',
      GMAIL_APP_PASSWORD: 'app-password',
    };

    sendMailMock = jest.fn().mockResolvedValue(undefined);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    service = new EmailService();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('sendProposalReminderEmail', () => {
    it('should initialize nodemailer transporter with gmail settings', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'hello@example.com',
          pass: 'app-password',
        },
      });
    });

    it('should send a proposal reminder email through nodemailer', async () => {
      await expect(
        service.sendProposalReminderEmail('client@test.com', 'Summer Campaign'),
      ).resolves.toBeUndefined();

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Asceoft Notifications <hello@example.com>',
          to: 'client@test.com',
          subject: 'New Proposal Reminder: Summer Campaign',
        }),
      );

      const [mailOptions] = sendMailMock.mock.calls[0] as [
        { text: string; html: string },
      ];
      expect(mailOptions.text).toContain('Summer Campaign');
      expect(mailOptions.html).toContain('Proposal reminder');
      expect(mailOptions.html).toContain('<strong>Summer Campaign</strong>');
    });

    it('should throw a BadRequestException when sendMail fails', async () => {
      sendMailMock.mockRejectedValue(new Error('smtp failed'));

      try {
        await service.sendProposalReminderEmail(
          'client@test.com',
          'Summer Campaign',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).getResponse()).toEqual({
          status: HttpStatus.BAD_REQUEST,
          code: 'UNABLE_TO_SEND_EMAIL',
          message: 'Unable to send email',
        });
      }
    });
  });
});
