/**
 * Function Warmup Utilities
 * Helps reduce cold start impact for critical API routes
 */

// Pre-initialize database connection
import { db } from './db'

let isWarmedUp = false

export async function warmupFunction() {
  if (isWarmedUp) return
  
  try {
    // Warm up database connection with a simple query
    await db.$queryRaw`SELECT 1`
    isWarmedUp = true
  } catch (error) {
    console.error('❌ Function warmup failed:', error)
  }
}

// Warmup middleware for API routes
export function withWarmup<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    // Run warmup in background, don't block the request
    warmupFunction().catch(console.error)
    return handler(...args)
  }
}