import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
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
    // Public profile lookup — GET /users/:userId does not require a session.
    // A user id is a UUID, so "/users/me" is never treated as public here.
    const isPublicProfileGet =
      req.method === 'GET' &&
      /^\/(?:api\/)?users\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        req.path,
      );

    if (isPublicProfileGet) {
      return next();
    }

    const authCookie = parseAuthCookie(req.headers.cookie);

    if (!authCookie) {
      return next(
        new UnauthorizedException({
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        }),
      );
    }

    let userId: string;

    try {
      userId = await this.getUserIdFromAccessToken(authCookie.accessToken);
    } catch {
      try {
        const refreshed = await this.refreshSession(authCookie.refreshToken);
        userId = refreshed.userId;
        res.setHeader(
          'Set-Cookie',
          serializeAuthCookie(
            {
              accessToken: refreshed.session.access_token,
              refreshToken: refreshed.session.refresh_token,
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

    // Database or application-user lookup errors are operational failures,
    // not evidence that the Supabase session is invalid. Do not clear the
    // authentication cookie when this lookup fails.
    const user = await this.userService.getActiveUserById(userId);
    (req as AuthenticatedRequest).authUser = user;
    return next();
  }

  private async getUserIdFromAccessToken(accessToken: string) {
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
    return data.user.id;
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

    this.logger.log(`Session refreshed for user ${data.user.id}`);
    return { userId: data.user.id, session: data.session };
  }
}
