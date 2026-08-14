import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 300_000,
    });
    super({
      adapter,
      transactionOptions: {
        maxWait: 10_000,
        timeout: 30_000,
      },
    });
  }
}
