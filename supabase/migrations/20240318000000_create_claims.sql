-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  claim_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  date_of_incident DATE NOT NULL,
  incident_location TEXT NOT NULL,
  incident_description TEXT NOT NULL,
  claim_amount DECIMAL(12,2) NOT NULL,
  public_status TEXT CHECK (public_status IN ('SUBMITTED', 'IN_REVIEW', 'COMPLETED', 'APPROVED', 'REJECTED')) DEFAULT 'SUBMITTED',
  fraud_risk_score INTEGER CHECK (fraud_risk_score >= 0 AND fraud_risk_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  key_findings TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_email ON claims(email);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at);
CREATE INDEX IF NOT EXISTS idx_claims_public_status ON claims(public_status);

-- Enable RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own claims"
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

CREATE POLICY "Users can insert their own claims"
  ON claims
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 