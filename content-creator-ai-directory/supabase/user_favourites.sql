-- User favourites table for Supabase
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS user_favourites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, tool_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_favourites_user_id
  ON user_favourites (user_id);
