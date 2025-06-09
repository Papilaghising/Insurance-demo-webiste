import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

interface Claim {
  claim_id: string;
  claim_type: string;
  claim_amount: number;
  date_of_incident: string;
  created_at: string;
  public_status: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  fraud_risk_score?: number;
  risk_level?: string;
  key_findings?: string[];
}

interface ClaimStatusDetails {
  status: Claim['public_status'];
  risk_assessment: {
    score: number;
    level: string;
    findings: string[];
  } | null;
  submitted_date: string;
  incident_date: string;
}

interface StatusSummary {
  total: number;
  submitted: number;
  in_review: number;
  approved: number;
  rejected: number;
  total_amount: number;
  claims: Array<Claim & { status_details: ClaimStatusDetails }>;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase()
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader) {
      console.error('No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('No token found in authorization header')
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user || !user.email) {
      console.error('User error or no email:', userError)
      return NextResponse.json({ error: 'Invalid token or missing email' }, { status: 401 })
    }

    console.log('Fetching claim status for user:', user.email)

    // Get claims with their status information
    const { data, error } = await supabase
      .from('claims')
      .select(`
        claim_id,
        claim_type,
        claim_amount,
        date_of_incident,
        created_at,
        public_status
      `)
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const claims = data as Claim[]

    // Transform the data to include status summaries
    const statusSummary: StatusSummary = {
      total: claims.length,
      submitted: claims.filter(claim => claim.public_status === 'SUBMITTED').length,
      in_review: claims.filter(claim => claim.public_status === 'IN_REVIEW').length,
      approved: claims.filter(claim => claim.public_status === 'APPROVED').length,
      rejected: claims.filter(claim => claim.public_status === 'REJECTED').length,
      total_amount: claims.reduce((sum, claim) => sum + (claim.claim_amount || 0), 0),
      claims: claims.map(claim => ({
        ...claim,
        status_details: {
          status: claim.public_status,
          risk_assessment: claim.fraud_risk_score ? {
            score: claim.fraud_risk_score,
            level: claim.risk_level || 'unknown',
            findings: claim.key_findings || []
          } : null,
          submitted_date: new Date(claim.created_at).toISOString(),
          incident_date: claim.date_of_incident
        }
      }))
    }

    console.log(`Found ${statusSummary.total} claims for user:`, user.email)
    return NextResponse.json(statusSummary)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 