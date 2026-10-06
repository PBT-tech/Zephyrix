-- ============================================================================
-- ZEPHYRIX - Supabase Database Schema
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor
-- This creates all tables, relationships, and security policies
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  plan VARCHAR(50) DEFAULT 'free', -- free, starter, pro, enterprise
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  is_system_owner BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, editor, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- ============================================================================
-- API KEYS TABLE (Encrypted)
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_name VARCHAR(255) NOT NULL,
  key_type VARCHAR(50) NOT NULL, -- claude, openai, anthropic, manus, viktor
  encrypted_key TEXT NOT NULL, -- AES-256 encrypted
  key_hash VARCHAR(255) NOT NULL, -- For validation without decryption
  is_active BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key_type)
);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- free, starter, pro, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, past_due
  billing_cycle VARCHAR(50) DEFAULT 'monthly', -- monthly, annual
  current_period_start DATE,
  current_period_end DATE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  amount_paid DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, paused, archived
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high

  -- Schedule fields
  frequency VARCHAR(50) NOT NULL, -- daily, weekly, monthly, once
  days_of_week INTEGER[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sun, 1=Mon, etc
  scheduled_time TIME DEFAULT '09:00:00',
  scheduled_date DATE,

  -- Execution
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  last_run_status VARCHAR(50), -- success, failed, pending
  last_run_output TEXT,

  -- Claude configuration
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  prompt TEXT,

  -- Files
  input_files TEXT[] DEFAULT '{}',
  output_files TEXT[] DEFAULT '{}',
  success_criteria TEXT,

  -- Approvals
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_users UUID[] DEFAULT '{}',

  -- Metadata
  template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- report, backup, email, file-ops, data, api, log, conversion
  prompt TEXT NOT NULL,
  input_files TEXT[] DEFAULT '{}',
  output_files TEXT[] DEFAULT '{}',
  success_criteria TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- System templates vs user-created
  available_on_plans VARCHAR(50)[] DEFAULT '{free,starter,pro,enterprise}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- EXECUTION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  execution_type VARCHAR(50) DEFAULT 'scheduled', -- scheduled, manual
  status VARCHAR(50) NOT NULL, -- success, failed, pending, cancelled
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,

  -- Output
  output TEXT,
  error_message TEXT,

  -- Files touched
  files_created TEXT[] DEFAULT '{}',
  files_modified TEXT[] DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PLAN SETTINGS TABLE (For system owner)
-- ============================================================================
CREATE TABLE IF NOT EXISTS plan_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_name VARCHAR(50) NOT NULL UNIQUE, -- free, starter, pro, enterprise
  task_limit INTEGER NOT NULL,
  max_frequency VARCHAR(50) DEFAULT 'monthly', -- daily, weekly, monthly
  max_run_now_per_week INTEGER DEFAULT 4,
  template_count INTEGER DEFAULT 0,
  team_support BOOLEAN DEFAULT FALSE,
  approval_workflows BOOLEAN DEFAULT FALSE,
  api_access BOOLEAN DEFAULT FALSE,
  email_support BOOLEAN DEFAULT FALSE,
  support_response_time VARCHAR(50), -- 24h, 4h, 1h
  price_monthly DECIMAL(10, 2),
  price_annual DECIMAL(10, 2),
  includes_builtin_templates BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ADMIN SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_team_id ON tasks(team_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_next_run_at ON tasks(next_run_at);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_execution_logs_task_id ON execution_logs(task_id);
CREATE INDEX idx_execution_logs_created_at ON execution_logs(created_at);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- ============================================================================
-- SAMPLE PLAN SETTINGS
-- ============================================================================
INSERT INTO plan_settings (plan_name, task_limit, max_frequency, max_run_now_per_week, template_count, team_support, approval_workflows, api_access, email_support, support_response_time, price_monthly, includes_builtin_templates) VALUES
('free', 3, 'monthly', 4, 0, FALSE, FALSE, FALSE, FALSE, NULL, 0.00, FALSE),
('starter', 8, 'monthly', NULL, 4, FALSE, FALSE, FALSE, FALSE, NULL, 8.00, TRUE),
('pro', 30, 'daily', NULL, 8, TRUE, TRUE, FALSE, TRUE, '24h', 35.00, TRUE),
('enterprise', 999, 'daily', NULL, 999, TRUE, TRUE, TRUE, TRUE, '1h', 98.00, TRUE);

-- ============================================================================
-- SAMPLE TEMPLATES (Built-in for all plans)
-- ============================================================================
INSERT INTO templates (created_by, name, description, category, prompt, input_files, output_files, success_criteria, is_system, available_on_plans) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Weekly Report Generator',
  'Summarize data from input files and generate a weekly report',
  'report',
  'Read the data from the input files and create a comprehensive weekly summary report. Include key metrics, trends, and insights.',
  ARRAY['/data/input/']::text[],
  ARRAY['/reports/weekly.md']::text[],
  'Report generated with current week data and key metrics',
  TRUE,
  ARRAY['free','starter','pro','enterprise']::varchar[]
),
(
  (SELECT id FROM users LIMIT 1),
  'Data Backup Automation',
  'Automated daily or weekly backup of important files',
  'backup',
  'Create a backup copy of all files in the input directory with timestamp naming.',
  ARRAY['/data/']::text[],
  ARRAY['/backups/']::text[],
  'Backup files created with proper timestamp naming',
  TRUE,
  ARRAY['free','starter','pro','enterprise']::varchar[]
),
(
  (SELECT id FROM users LIMIT 1),
  'File Organization & Cleanup',
  'Sort, organize, and archive old files',
  'file-ops',
  'Organize files by type and age. Archive files older than 30 days to archive folder.',
  ARRAY['/documents/']::text[],
  ARRAY['/organized/', '/archive/']::text[],
  'Files organized by type and old files archived',
  TRUE,
  ARRAY['starter','pro','enterprise']::varchar[]
),
(
  (SELECT id FROM users LIMIT 1),
  'Email Newsletter Manager',
  'Prepare and schedule email newsletters',
  'email',
  'Compile content from input sources into a formatted newsletter ready to send.',
  ARRAY['/content/']::text[],
  ARRAY['/newsletters/']::text[],
  'Newsletter formatted and ready for distribution',
  TRUE,
  ARRAY['pro','enterprise']::varchar[]
),
(
  (SELECT id FROM users LIMIT 1),
  'Scheduled File Conversion',
  'Convert files between formats on schedule',
  'conversion',
  'Convert input files to the required output format. Maintain quality and metadata.',
  ARRAY['/uploads/']::text[],
  ARRAY['/converted/']::text[],
  'All files successfully converted to target format',
  TRUE,
  ARRAY['starter','pro','enterprise']::varchar[]
),
(
  (SELECT id FROM users LIMIT 1),
  'API Data Sync',
  'Sync data with external APIs',
  'api',
  'Connect to the specified API, retrieve updated data, and sync to output location.',
  ARRAY[]::text[],
  ARRAY['/data/synced/']::text[],
  'Data successfully retrieved from API and synced',
  TRUE,
  ARRAY['free','starter','pro','enterprise']::varchar[]
),
(
  (SELECT id FROM users LIMIT 1),
  'Log Processing & Analysis',
  'Parse, analyze, and summarize log files',
  'log',
  'Read log files, identify errors and patterns, generate analysis report.',
  ARRAY['/logs/']::text[],
  ARRAY['/analysis/']::text[],
  'Logs analyzed with error summary and patterns identified',
  TRUE,
  ARRAY['free','starter','pro','enterprise']::varchar[]
);

-- ============================================================================
-- ADMIN SETTINGS (Default configuration)
-- ============================================================================
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('platform_name', 'ZEPHYRIX', 'Platform name'),
('platform_version', '1.0.0', 'Platform version'),
('max_task_execution_time_seconds', '600', 'Maximum execution time for a task (10 minutes)'),
('encryption_algorithm', 'AES-256', 'Encryption algorithm for API keys'),
('support_email', 'support@zephyrix.com', 'Support email address'),
('enable_social_media_addon', 'false', 'Enable social media scheduler add-on feature'),
('social_media_starter_addon_price', '53.00', 'Price for social media add-on on Starter plan'),
('social_media_pro_addon_price', '44.00', 'Price for social media add-on on Pro plan');

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile (+ public info for teams)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id OR is_system_owner);

-- Users can only see their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (user_id = auth.uid() OR team_id IN (
    SELECT team_id FROM team_members WHERE user_id = auth.uid()
  ));

-- Users can only create tasks for themselves
CREATE POLICY "Users can create own tasks" ON tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can only update their own tasks
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (user_id = auth.uid() OR team_id IN (
    SELECT team_id FROM team_members WHERE user_id = auth.uid()
  ));

-- Users can only see their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (user_id = auth.uid());

-- Users can only see their own execution logs
CREATE POLICY "Users can view own execution logs" ON execution_logs
  FOR SELECT USING (user_id = auth.uid());

-- Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to tasks
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to subscriptions
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- This schema is now ready for the ZEPHYRIX application
-- Copy this entire file into Supabase SQL Editor and execute
