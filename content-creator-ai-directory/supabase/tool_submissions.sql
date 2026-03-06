-- Tool submissions table for Supabase
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) to create the table.

CREATE TABLE IF NOT EXISTS tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Video', 'Audio', 'Copywriting', 'Image', 'Productivity', 'Code', 'Other')),
  pricing TEXT CHECK (pricing IS NULL OR pricing IN ('Free', 'Freemium', 'Paid', 'Enterprise')),
  tags TEXT[],
  logo_url TEXT,
  submitted_by_user_id TEXT NOT NULL,
  submitted_by_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: index for listing by status and date
CREATE INDEX IF NOT EXISTS idx_tool_submissions_status_created_at
  ON tool_submissions (status, created_at DESC);

-- Optional: RLS (Row Level Security) - enable if you want to restrict who can read/update
-- ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Service role can do everything" ON tool_submissions FOR ALL USING (true);
