import { EmailService } from '../email.service';

describe('EmailService', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;
  let service: EmailService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    process.env = { ...originalEnv };
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    service = new EmailService();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('sendProposalReminderEmail', () => {
    it('should skip sending when RESEND_API_KEY is not configured', async () => {
      delete process.env.RESEND_API_KEY;

      const res = await service.sendProposalReminderEmail({
        clientEmail: 'client@test.com',
        proposalPublicId: 'proposal-123',
        projectName: 'Summer Campaign',
      });

      expect(res).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should send a proposal reminder email through Resend', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.RESEND_FROM_EMAIL = 'Acseoft <hello@example.com>';
      process.env.FRONTEND_URL = 'https://app.example.com';
      fetchMock.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'email-1' }),
      });

      const res = await service.sendProposalReminderEmail({
        clientEmail: 'client@test.com',
        proposalPublicId: 'proposal-123',
        projectName: 'Summer Campaign',
      });

      expect(res).toEqual({ id: 'email-1' });
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
        }),
      );

      const [, options] = fetchMock.mock.calls[0] as [string, { body: string }];
      const body = JSON.parse(options.body) as {
        from: string;
        to: string;
        subject: string;
        text: string;
        html: string;
      };

      expect(body.from).toBe('Acseoft <hello@example.com>');
      expect(body.to).toBe('client@test.com');
      expect(body.subject).toBe('Register to review proposal: Summer Campaign');
      expect(body.text).toContain('Summer Campaign');
      expect(body.text).toContain(
        'https://app.example.com/client-register?proposalId=proposal-123&email=client%40test.com',
      );
      expect(body.html).toContain('Client registration');
      expect(body.html).toContain('<a ');
      expect(body.html).toContain(
        'https://app.example.com/client-register?proposalId=proposal-123&amp;email=client%40test.com',
      );
    });

    it('should escape the project name in the html template', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';
      fetchMock.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'email-1' }),
      });

      await service.sendProposalReminderEmail({
        clientEmail: 'client@test.com',
        proposalPublicId: 'proposal-123',
        projectName: '<script>alert("x")</script>',
      });

      const [, options] = fetchMock.mock.calls[0] as [string, { body: string }];
      const body = JSON.parse(options.body) as { html: string };

      expect(body.html).toContain(
        '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
      );
      expect(body.html).not.toContain('<script>');
    });

    it('should throw when Resend rejects the email request', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';
      fetchMock.mockResolvedValue({
        ok: false,
        status: 422,
        json: jest.fn().mockResolvedValue({ message: 'Invalid sender' }),
      });

      await expect(
        service.sendProposalReminderEmail({
          clientEmail: 'client@test.com',
          proposalPublicId: 'proposal-123',
          projectName: 'Summer Campaign',
        }),
      ).rejects.toThrow('Invalid sender');
    });
  });
});
