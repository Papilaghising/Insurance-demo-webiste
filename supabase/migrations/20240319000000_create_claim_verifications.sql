-- Create claim_verifications table
CREATE TABLE IF NOT EXISTS claim_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  identity_verification JSONB,
  invoice_verification JSONB,
  supporting_docs_verification JSONB,
  overall_confidence NUMERIC,
  verification_status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_claim_verifications_claim_id ON claim_verifications(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_verifications_status ON claim_verifications(verification_status);

-- Enable RLS
ALTER TABLE claim_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents can view all verifications"
  ON claim_verifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cprofile p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'agent'
    )
  );

CREATE POLICY "Users can view their own claim verifications"
  ON claim_verifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM claims c 
      WHERE c.id = claim_verifications.claim_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_claim_verifications_updated_at
  BEFORE UPDATE ON claim_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 