-- Add fraud analysis fields to claims table
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS fraud_risk_score INTEGER CHECK (fraud_risk_score >= 0 AND fraud_risk_score <= 100),
ADD COLUMN IF NOT EXISTS risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
ADD COLUMN IF NOT EXISTS key_findings TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW')) DEFAULT 'PENDING';

-- Create index for faster status lookups
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- Update RLS policies to include new fields
CREATE POLICY "Agents can update claim status and fraud analysis"
  ON claims
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cprofile p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'agent'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cprofile p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'agent'
    )
  ); 