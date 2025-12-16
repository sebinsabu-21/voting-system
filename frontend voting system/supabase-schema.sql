-- Supabase Database Schema for Voter Portal
-- Run this SQL in your Supabase SQL Editor

-- Create voters table
CREATE TABLE IF NOT EXISTS voters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    face_embedding JSONB,
    face_enrolled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on OTP table for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_username_phone ON otp_verifications(username, phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_verifications(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for voters table (Allow insert and select for anonymous users)
CREATE POLICY "Allow anonymous insert on voters" ON voters
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous select on voters" ON voters
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous update on voters" ON voters
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Create policies for otp_verifications table (Allow insert, select, and delete for anonymous users)
CREATE POLICY "Allow anonymous insert on otp_verifications" ON otp_verifications
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous select on otp_verifications" ON otp_verifications
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous delete on otp_verifications" ON otp_verifications
    FOR DELETE
    TO anon
    USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on voters table
CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON voters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


