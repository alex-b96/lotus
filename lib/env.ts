import { z } from 'zod'

/**
 * Environment Variables Validation Schema
 * Validates all environment variables at application startup
 */
const envSchema = z.object({
  // Database - Required
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid PostgreSQL connection string').optional(),
  
  // Authentication - Required  
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Email Service - Optional but validated when present
  SMTP_HOST: z.string().min(1, 'SMTP_HOST cannot be empty if provided').optional(),
  SMTP_PORT: z.string().regex(/^\d+$/, 'SMTP_PORT must be a valid port number').optional(),
  SMTP_SECURE: z.enum(['true', 'false']).optional(),
  SMTP_USER: z.string().email('SMTP_USER must be a valid email address').optional(),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS cannot be empty if provided').optional(),
  SMTP_FROM: z.string().email('SMTP_FROM must be a valid email address').optional(),
  
  // File Storage - Optional
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN cannot be empty if provided').optional(),
})

/**
 * Validate and parse environment variables
 * This will throw an error if any required variables are missing or invalid
 */
function validateEnv() {
  try {
    const validatedEnv = envSchema.parse(process.env)
    
    // Additional validation: If any SMTP variable is provided, require basic config
    if (validatedEnv.SMTP_USER || validatedEnv.SMTP_PASS || validatedEnv.SMTP_HOST) {
      if (!validatedEnv.SMTP_HOST || !validatedEnv.SMTP_USER || !validatedEnv.SMTP_PASS) {
        throw new Error('If using email service, SMTP_HOST, SMTP_USER, and SMTP_PASS are all required')
      }
    }
    
    console.log('✅ Environment variables validated successfully')
    return validatedEnv
  } catch (error) {
    console.error('❌ Environment validation failed:')
    
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
    } else {
      console.error(`  ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    console.error('\n💡 Please check your .env file and ensure all required variables are set.')
    process.exit(1)
  }
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety and validation
 */
export const env = validateEnv()

/**
 * Type definition for validated environment variables
 */
export type Env = z.infer<typeof envSchema>