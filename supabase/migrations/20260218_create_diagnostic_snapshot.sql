-- Create diagnostic_snapshot table for storing immutable diagnosis records
-- Each user can have multiple rows (one per diagnostic attempt)

CREATE TABLE IF NOT EXISTS diagnostic_snapshot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  recruiter_score INTEGER NOT NULL DEFAULT 0,
  coding_score INTEGER NOT NULL DEFAULT 0,
  explanation_score INTEGER NOT NULL DEFAULT 0,
  behavior_score INTEGER NOT NULL DEFAULT 0,
  overall_score INTEGER NOT NULL DEFAULT 0,
  readiness_state TEXT NOT NULL CHECK (readiness_state IN ('ready', 'borderline', 'not_ready')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries by user_id
CREATE INDEX IF NOT EXISTS idx_diagnostic_snapshot_user_id ON diagnostic_snapshot(user_id);

-- Index for ordering by created_at (for first/latest queries)
CREATE INDEX IF NOT EXISTS idx_diagnostic_snapshot_created_at ON diagnostic_snapshot(user_id, created_at);

-- Enable Row Level Security
ALTER TABLE diagnostic_snapshot ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous insert (immutable - insert only)
CREATE POLICY "Allow anonymous insert" ON diagnostic_snapshot
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous select own records
CREATE POLICY "Allow anonymous select" ON diagnostic_snapshot
  FOR SELECT
  TO anon
  USING (true);

-- No UPDATE or DELETE policies - records are immutable
