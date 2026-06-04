-- ============================================
-- PsychoPharmRef: question_comments table
-- Run this in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ============================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS question_comments (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id   INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  comment       TEXT NOT NULL,
  user_email    TEXT NOT NULL DEFAULT 'anonymous',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add an index for fast lookups by question
CREATE INDEX IF NOT EXISTS idx_question_comments_qid
  ON question_comments (question_id);

-- 3. Enable Row Level Security (required for Supabase)
ALTER TABLE question_comments ENABLE ROW LEVEL SECURITY;

-- 4. Policy: authenticated users can INSERT their own comments
CREATE POLICY "Authenticated users can insert comments"
  ON question_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Policy: only service_role (admin) can SELECT/UPDATE/DELETE
--    This means comments are write-only from the client side
CREATE POLICY "Admin can read all comments"
  ON question_comments
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Admin can delete comments"
  ON question_comments
  FOR DELETE
  TO service_role
  USING (true);

-- 6. (Optional) If you also want to let users read their OWN comments:
-- CREATE POLICY "Users can read own comments"
--   ON question_comments
--   FOR SELECT
--   TO authenticated
--   USING (user_email = auth.jwt() ->> 'email');
