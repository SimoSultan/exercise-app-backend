-- This migration adds picture columnd to user table.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS picture TEXT

