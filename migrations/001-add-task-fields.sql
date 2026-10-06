-- Migration: Add missing fields to tasks table
-- Run this in Supabase SQL Editor

-- Add description column if missing
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify input_files and output_files exist (should already be there)
-- ALTER TABLE tasks ADD COLUMN IF NOT EXISTS input_files TEXT[] DEFAULT '{}';
-- ALTER TABLE tasks ADD COLUMN IF NOT EXISTS output_files TEXT[] DEFAULT '{}';

-- Add execution result columns
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS last_execution_result TEXT;

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT FALSE;

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
