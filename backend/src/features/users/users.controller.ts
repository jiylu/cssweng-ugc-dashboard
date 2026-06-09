import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

const AUTH_COOKIE_NAME = 'ugc_auth_session';
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

type AuthCookiePayload = {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
};

function serializeAuthCookie(payload: AuthCookiePayload, rememberMe: boolean) {
  const maxAge = rememberMe ? `; Max-Age=${THIRTY_DAYS_SECONDS}` : '';
  // TODO: Once in prod, make this unconditional so auth cookies are always sent with the Secure flag.
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  // TODO: Keep an encrypted cookie value instead of the actual session data stored server-side
  const value = encodeURIComponent(JSON.stringify(payload));

  return `${AUTH_COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax${secure}${maxAge}`;
}

function serializeExpiredAuthCookie() {
  // TODO: Keep this Secure behavior matched with serializeAuthCookie.
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';

  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=0`;
}

function parseAuthCookie(req: Request): AuthCookiePayload | null {
  const rawCookie = req.headers.cookie
    ?.split('; ')
    .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!rawCookie) {
    return null;
  }

  try {
    return JSON.parse(
      decodeURIComponent(rawCookie.split('=').slice(1).join('=')),
    ) as AuthCookiePayload;
  } catch {
    return null;
  }
}

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
  async me(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authCookie = parseAuthCookie(req);

    if (!authCookie) {
      throw new UnauthorizedException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    try {
      return await this.userService.getUserFromAccessToken(
        authCookie.accessToken,
      );
    } catch {
      // TODO: Refreshed tokens should also be saved server-side to delete old/stolen cookies
      const data = await this.userService.refreshSession(
        authCookie.refreshToken,
      );

      res.setHeader(
        'Set-Cookie',
        serializeAuthCookie(
          {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            rememberMe: authCookie.rememberMe,
          },
          authCookie.rememberMe,
        ),
      );

      return data.user;
    }
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
