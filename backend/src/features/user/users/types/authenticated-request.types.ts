import type { User } from '@prisma/client';
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  authUser: User;
};
