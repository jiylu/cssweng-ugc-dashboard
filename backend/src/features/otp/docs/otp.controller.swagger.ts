import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOtpDto } from '../dto/create-otp.dto';
import { ValidateOtpDto } from '../dto/validate-otp.dto';

export function ApiCreateOtp() {
  return applyDecorators(
    ApiOperation({
      summary: 'Sends a verification code to an email',
      description:
        'Generates an 8-digit verification code and emails it to the given email address. ' +
        'Any previously issued, unconsumed code for the same email and role is invalidated first. ' +
        'The code expires after 10 minutes.',
    }),
    ApiBody({ type: CreateOtpDto }),
    ApiResponse({
      status: 202,
      description: 'Verification code sent',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid payload',
    }),
  );
}

export function ApiValidateOtp() {
  return applyDecorators(
    ApiOperation({
      summary: 'Validates a verification code',
      description:
        'Verifies the 8-digit code for the given email and role. ' +
        'On success the code is marked verified and a verificationToken is returned. ' +
        'The token is valid for 15 minutes and is consumed when the user registers.',
    }),
    ApiBody({ type: ValidateOtpDto }),
    ApiResponse({
      status: 200,
      description: 'Code validated, returns the verificationToken',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid payload',
    }),
    ApiResponse({
      status: 401,
      description: 'The verification code is invalid or expired',
    }),
  );
}
