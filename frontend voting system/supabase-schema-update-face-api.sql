-- Update Schema for Face Recognition Support
-- Run this SQL if you already have the voters table and want to add face recognition
-- If you're creating a fresh database, the main schema already includes these columns

-- Add face recognition columns to voters table (if they don't exist)
ALTER TABLE voters 
ADD COLUMN IF NOT EXISTS face_embedding JSONB,
ADD COLUMN IF NOT EXISTS face_enrolled BOOLEAN DEFAULT FALSE;

-- Add update policy for voters table (needed for face enrollment)
CREATE POLICY IF NOT EXISTS "Allow anonymous update on voters" ON voters
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

