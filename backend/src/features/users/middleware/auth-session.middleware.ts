import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UserService } from '../users.service';
import {
  parseAuthCookie,
  serializeAuthCookie,
  serializeExpiredAuthCookie,
} from '../utils/auth-cookie';
import type { AuthenticatedRequest } from '../types/authenticated-request.types';

@Injectable()
export class AuthSessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthSessionMiddleware.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authCookie = parseAuthCookie(req.headers.cookie);

    if (!authCookie) {
      return next(
        new UnauthorizedException({
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        }),
      );
    }

    try {
      const user = await this.getUserFromAccessToken(authCookie.accessToken);
      (req as AuthenticatedRequest).authUser = user;
      return next();
    } catch {
      try {
        const { user, session } = await this.refreshSession(
          authCookie.refreshToken,
        );

        (req as AuthenticatedRequest).authUser = user;
        res.setHeader(
          'Set-Cookie',
          serializeAuthCookie(
            {
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
              rememberMe: authCookie.rememberMe,
            },
            authCookie.rememberMe,
          ),
        );

        return next();
      } catch (error) {
        res.setHeader('Set-Cookie', serializeExpiredAuthCookie());
        return next(error);
      }
    }
  }

  private async getUserFromAccessToken(accessToken: string) {
    this.logger.debug(`Getting user from access token`);

    const { data, error } =
      await this.supabase.client.auth.getUser(accessToken);

    if (error || !data.user) {
      this.logger.warn(
        `Invalid access token: ${error?.message ?? 'No user returned'}`,
      );

      throw new UnauthorizedException({
        code: 'INVALID_SESSION',
        message: error?.message ?? 'Invalid session',
      });
    }

    this.logger.debug(`Retrieved user ${data.user.id} from access token`);
    return this.userService.getActiveUserById(data.user.id);
  }

  private async refreshSession(refreshToken: string) {
    this.logger.debug(`Refreshing session`);

    const { data, error } = await this.supabase.client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.user || !data.session) {
      this.logger.warn(
        `Session refresh failed: ${error?.message ?? 'No user or session returned'}`,
      );

      throw new UnauthorizedException({
        code: 'SESSION_REFRESH_FAILED',
        message: error?.message ?? 'Unable to refresh session',
      });
    }

    const user = await this.userService.getActiveUserById(data.user.id);

    this.logger.log(`Session refreshed for user ${user.user_id}`);
    return { user, session: data.session };
  }
}
