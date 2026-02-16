-- Create user_sessions table to store onboarding information
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  target_role TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL DEFAULT 0,
  interview_status TEXT NOT NULL CHECK (interview_status IN ('scheduled', 'preparing')),
  interview_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts and selects (using anon key)
CREATE POLICY "Allow anonymous access" ON user_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
