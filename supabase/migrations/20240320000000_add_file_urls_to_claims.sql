-- Add file_urls column to claims table
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS file_urls JSONB;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_claims_file_urls ON claims USING GIN (file_urls);

-- Update RLS policies to include file_urls
CREATE POLICY "Users can view their own claim files"
  ON claims
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM cprofile p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'agent'
    )
  ); 