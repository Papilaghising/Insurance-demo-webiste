import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'

interface ClaimDocument {
  id: string;
  claim_id: string;
  file_url: string;
  document_type: string;
  [key: string]: unknown;
}

interface RawClaim {
  id: string;
  claim_id: string;
  email: string;
  full_name: string;
  claim_type: string;
  claim_amount: number;
  incident_description: string;
  created_at: string;
  updated_at: string | null;
  status: string;
  public_status: string;
  [key: string]: unknown;
}

interface Claim extends RawClaim {
  documents: ClaimDocument[];
}

type DatabaseRecord = Record<string, unknown>;

function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

function validateRawClaim(obj: DatabaseRecord): obj is RawClaim {
  console.log('Validating claim object:', obj);
  
  if (!obj || typeof obj !== 'object') {
    console.log('Validation failed: Not an object');
    return false;
  }

  const requiredFields = [
    'id', 'claim_id', 'email', 'full_name', 'claim_type',
    'claim_amount', 'incident_description', 'created_at',
    'updated_at', 'status', 'public_status'
  ];

  // Check if all required fields exist
  for (const field of requiredFields) {
    if (!(field in obj)) {
      console.log(`Validation failed: Missing field ${field}`);
      return false;
    }
  }

  // Type check each field
  const claim = obj as Record<string, unknown>;
  const isValid = 
    typeof claim.id === 'string' &&
    typeof claim.claim_id === 'string' &&
    typeof claim.email === 'string' &&
    typeof claim.full_name === 'string' &&
    typeof claim.claim_type === 'string' &&
    typeof claim.claim_amount === 'number' &&
    typeof claim.incident_description === 'string' &&
    typeof claim.created_at === 'string' &&
    (claim.updated_at === null || typeof claim.updated_at === 'string') &&
    typeof claim.status === 'string' &&
    typeof claim.public_status === 'string';

  if (!isValid) {
    console.log('Validation failed: Type mismatch', {
      id: typeof claim.id,
      claim_id: typeof claim.claim_id,
      email: typeof claim.email,
      full_name: typeof claim.full_name,
      claim_type: typeof claim.claim_type,
      claim_amount: typeof claim.claim_amount,
      incident_description: typeof claim.incident_description,
      created_at: typeof claim.created_at,
      updated_at: typeof claim.updated_at,
      status: typeof claim.status,
      public_status: typeof claim.public_status
    });
    return false;
  }

  // Validate dates
  if (!isValidDate(claim.created_at as string)) {
    console.log('Validation failed: Invalid created_at date');
    return false;
  }
  if (claim.updated_at !== null && !isValidDate(claim.updated_at as string)) {
    console.log('Validation failed: Invalid updated_at date');
    return false;
  }

  console.log('Claim validation passed');
  return true;
}

function validateClaimDocument(obj: DatabaseRecord): obj is ClaimDocument {
  console.log('Validating document object:', obj);
  
  if (!obj || typeof obj !== 'object') {
    console.log('Document validation failed: Not an object');
    return false;
  }

  const requiredFields = ['id', 'claim_id', 'file_url', 'document_type'];

  // Check if all required fields exist
  for (const field of requiredFields) {
    if (!(field in obj)) {
      console.log(`Document validation failed: Missing field ${field}`);
      return false;
    }
  }

  // Type check each field
  const doc = obj as Record<string, unknown>;
  const isValid = (
    typeof doc.id === 'string' &&
    typeof doc.claim_id === 'string' &&
    typeof doc.file_url === 'string' &&
    typeof doc.document_type === 'string'
  );

  if (!isValid) {
    console.log('Document validation failed: Type mismatch', {
      id: typeof doc.id,
      claim_id: typeof doc.claim_id,
      file_url: typeof doc.file_url,
      document_type: typeof doc.document_type
    });
    return false;
  }

  console.log('Document validation passed');
  return true;
}

export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = getSupabase()
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Extract the token
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

    console.log('Fetching claims for user:', user.email)

    // Get claims for the current user
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ensure we return an array, even if empty
    const claims = Array.isArray(data) ? data : []
    console.log(`Found ${claims.length} claims for user:`, user.email)
    
    return NextResponse.json(claims)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 