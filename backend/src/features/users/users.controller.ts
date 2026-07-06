import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import {
  serializeAuthCookie,
  serializeExpiredAuthCookie,
} from './utils/auth-cookie';
import type { AuthenticatedRequest } from './types/authenticated-request.types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // TODO: Safeguard
  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.userService.login(dto);
    // TODO: Revisit persistent-session length with the Asceoft's security policy. Current remember-me duration is 30 days for testing.
    const rememberMe = Boolean(dto.rememberMe);

    res.setHeader(
      'Set-Cookie',
      serializeAuthCookie(
        {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          rememberMe,
        },
        rememberMe,
      ),
    );

    return {
      user: data.user,
    };
  }

  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.authUser;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Set-Cookie', serializeExpiredAuthCookie());

    return {
      message: 'Logged out',
    };
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findActiveUserById(userId);
  }

  // TODO: Make /me /update and /deactivate endpoint
}
