-- Create claim_files table
CREATE TABLE IF NOT EXISTS claim_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  document_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_claim_files_claim_id ON claim_files(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_files_uploaded_by ON claim_files(uploaded_by);

-- Enable RLS
ALTER TABLE claim_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own claim files"
  ON claim_files
  FOR SELECT
  USING (
    auth.uid() = uploaded_by OR 
    EXISTS (
      SELECT 1 FROM claims c 
      WHERE c.id = claim_files.claim_id 
      AND c.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM cprofile p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'agent'
    )
  );

CREATE POLICY "Users can upload their own claim files"
  ON claim_files
  FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (
      SELECT 1 FROM claims c 
      WHERE c.id = claim_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_claim_files_updated_at
  BEFORE UPDATE ON claim_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
