import { NextRequest } from "next/server"

// Simple in-memory rate limiter
// In production, you should use Redis or a proper rate limiting service
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()
  private readonly maxAttempts: number
  private readonly windowMs: number

  constructor(maxAttempts: number, windowMs: number) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return false
    }

    if (record.count >= this.maxAttempts) {
      return true
    }

    // Increment attempt count
    record.count++
    return false
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record) return 0
    
    const now = Date.now()
    return Math.max(0, record.resetTime - now)
  }

  // Clean up expired entries periodically
  cleanup() {
    const now = Date.now()
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key)
      }
    }
  }
}

// Rate limiter for password changes: 3 attempts per 15 minutes per IP
export const passwordChangeRateLimiter = new RateLimiter(3, 15 * 60 * 1000)

// Rate limiter for failed login attempts: 5 attempts per 15 minutes per IP  
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000)

export function getClientIP(request: NextRequest): string {
  // Get IP from various headers (for production with proxies/CDNs)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-forwarded-for')?.split(',')[0]
  
  return forwarded?.split(',')[0] || realIP || remoteAddr || '127.0.0.1'
}

// Clean up expired entries every hour
setInterval(() => {
  passwordChangeRateLimiter.cleanup()
  loginRateLimiter.cleanup()
}, 60 * 60 * 1000)