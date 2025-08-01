import { PrismaClient } from '@prisma/client'
import { env } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Prisma for Supabase transaction mode (connection pooling)
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
  // Optimize for serverless/edge functions with connection pooling
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db