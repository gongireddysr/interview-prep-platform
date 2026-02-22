-- Create mock_interview_results table for storing mock interview history
-- Multiple rows per user (each mock = new row), immutable (insert-only)

CREATE TABLE IF NOT EXISTS mock_interview_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 20),
  category_scores JSONB NOT NULL DEFAULT '{}',
  ai_feedback_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries by user_id
CREATE INDEX IF NOT EXISTS idx_mock_interview_results_user_id ON mock_interview_results(user_id);

-- Index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_mock_interview_results_created_at ON mock_interview_results(user_id, created_at);

-- Enable Row Level Security
ALTER TABLE mock_interview_results ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous insert (immutable - insert only)
CREATE POLICY "Allow anonymous insert" ON mock_interview_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous select own records
CREATE POLICY "Allow anonymous select" ON mock_interview_results
  FOR SELECT
  TO anon
  USING (true);

-- No UPDATE or DELETE policies - records are immutable
