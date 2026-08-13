import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';
import { ApiCreateOtp, ApiValidateOtp } from './docs/otp.controller.swagger';

@Controller('otps')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @ApiCreateOtp()
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() dto: CreateOtpDto) {
    return this.otpService.create(dto);
  }

  @ApiValidateOtp()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validate(@Body() dto: ValidateOtpDto) {
    return this.otpService.validate(dto);
  }
}
