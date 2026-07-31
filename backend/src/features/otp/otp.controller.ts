import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';

@Controller('otps')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() dto: CreateOtpDto) {
    return this.otpService.create(dto);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validate(@Body() dto: ValidateOtpDto) {
    return this.otpService.validate(dto);
  }
}
