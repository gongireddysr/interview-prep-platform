-- Create user_readiness table for tracking live user progress
-- One row per user, updated on each diagnostic/mock completion

CREATE TABLE IF NOT EXISTS user_readiness (
  user_id UUID PRIMARY KEY REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  baseline_score INTEGER NOT NULL DEFAULT 0,
  current_score INTEGER NOT NULL DEFAULT 0,
  current_readiness_state TEXT NOT NULL CHECK (current_readiness_state IN ('not_ready', 'borderline', 'ready')) DEFAULT 'not_ready',
  total_diagnostics INTEGER NOT NULL DEFAULT 0,
  total_mocks INTEGER NOT NULL DEFAULT 0,
  last_diagnostic_at TIMESTAMPTZ,
  last_mock_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_readiness ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON user_readiness
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous select own records
CREATE POLICY "Allow anonymous select" ON user_readiness
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow anonymous update own records
CREATE POLICY "Allow anonymous update" ON user_readiness
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
