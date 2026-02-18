-- Create user_documents table to store resume and job description
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  resume_file_path TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  resume_text TEXT,
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);

-- Enable Row Level Security
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous access (using anon key)
CREATE POLICY "Allow anonymous access" ON user_documents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for resumes (run this in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
