-- Safe Production Migration: Add Password Reset Fields
-- Date: 2024-08-07
-- Description: Add optional password reset token fields to users table

-- Add password reset fields (nullable, safe to add)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP WITH TIME ZONE;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('reset_token', 'reset_token_expiry');