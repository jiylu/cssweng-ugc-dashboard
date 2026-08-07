import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const VERIFICATION_LIFETIME_MS = 15 * 60 * 1000;

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private hash(value: string) {
    const secret = process.env.OTP_HASH_SECRET;
    if (!secret) throw new Error('OTP_HASH_SECRET is not configured');
    return createHash('sha256').update(`${secret}:${value}`).digest('hex');
  }

  async create(dto: CreateOtpDto) {
    const email = dto.email.trim().toLowerCase();
    const otp = randomInt(0, 100_000_000).toString().padStart(8, '0');

    await this.prisma.$transaction([
      this.prisma.registrationOtp.updateMany({
        where: { email, role: dto.role, consumed_at: null },
        data: { consumed_at: new Date() },
      }),
      this.prisma.registrationOtp.create({
        data: {
          email,
          role: dto.role,
          otp_hash: this.hash(otp),
          expires_at: new Date(Date.now() + OTP_LIFETIME_MS),
        },
      }),
    ]);

    await this.emailService.sendRegistrationOtpEmail(email, otp);
    return { message: 'Verification code sent' };
  }

  async validate(dto: ValidateOtpDto) {
    const email = dto.email.trim().toLowerCase();
    const record = await this.prisma.registrationOtp.findFirst({
      where: {
        email,
        role: dto.role,
        verified_at: null,
        consumed_at: null,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });

    const actual = Buffer.from(this.hash(dto.otp), 'hex');
    const expected = record
      ? Buffer.from(record.otp_hash, 'hex')
      : randomBytes(32);
    if (!record || !timingSafeEqual(actual, expected)) {
      throw new UnauthorizedException({
        code: 'INVALID_OR_EXPIRED_OTP',
        message: 'The verification code is invalid or expired.',
      });
    }

    const verificationToken = randomBytes(32).toString('base64url');
    const result = await this.prisma.registrationOtp.updateMany({
      where: { otp_id: record.otp_id, verified_at: null, consumed_at: null },
      data: {
        verified_at: new Date(),
        verification_token_hash: this.hash(verificationToken),
      },
    });
    if (result.count !== 1) {
      throw new UnauthorizedException(
        'The verification code has already been used.',
      );
    }

    return { verificationToken };
  }

  async consumeVerification(
    emailValue: string,
    role: CreateOtpDto['role'],
    token: string,
  ) {
    const email = emailValue.trim().toLowerCase();
    const record = await this.prisma.registrationOtp.findFirst({
      where: {
        email,
        role,
        verification_token_hash: this.hash(token),
        verified_at: { gt: new Date(Date.now() - VERIFICATION_LIFETIME_MS) },
        consumed_at: null,
      },
    });
    if (!record) {
      throw new BadRequestException({
        code: 'OTP_VERIFICATION_REQUIRED',
        message: 'Verify your email before creating an account.',
      });
    }

    const consumed = await this.prisma.registrationOtp.updateMany({
      where: { otp_id: record.otp_id, consumed_at: null },
      data: { consumed_at: new Date() },
    });
    if (consumed.count !== 1) {
      throw new BadRequestException('This verification has already been used.');
    }
  }
}
