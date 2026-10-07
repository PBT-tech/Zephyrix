-- Migration: Add approval workflow columns to execution_logs
-- Date: 2026-10-07
-- Purpose: Enable task execution approval workflow

ALTER TABLE execution_logs ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE execution_logs ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE execution_logs ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE execution_logs ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- Add index for approval status queries
CREATE INDEX IF NOT EXISTS idx_execution_logs_approval_status ON execution_logs(approval_status);
