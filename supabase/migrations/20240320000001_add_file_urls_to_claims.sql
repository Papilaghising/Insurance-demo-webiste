-- Add file_urls column to claims table
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS file_urls JSONB DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_claims_file_urls ON claims USING GIN (file_urls);

-- Update RLS policies to include file_urls
ALTER POLICY "Users can update their own claims" 
  ON claims 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON claims TO authenticated;
GRANT USAGE ON SEQUENCE claims_id_seq TO authenticated; 