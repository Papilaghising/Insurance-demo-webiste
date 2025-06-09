import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'

interface ClaimSubmission {
  claimType: string
  claimAmount: number
  incidentDescription: string
  incidentDate: string
  documents: {
    type: string
    url: string
  }[]
}

export async function POST(req: NextRequest) {
  try {
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

    const supabase = getSupabase()
    
    // Verify the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      console.error('User validation error:', userError)
      return NextResponse.json({ 
        error: 'Invalid session',
        details: userError?.message || 'User validation failed'
      }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const claimData: ClaimSubmission = body

    // Validate required fields
    if (!claimData.claimType || !claimData.claimAmount || !claimData.incidentDescription || !claimData.incidentDate) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'Claim type, amount, description, and incident date are required'
      }, { status: 400 })
    }

    // Generate a unique claim ID
    const claimId = `CLM-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Insert the claim
    const { error: claimError } = await supabase
      .from('claims')
      .insert({
        claim_id: claimId,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Unknown',
        claim_type: claimData.claimType,
        claim_amount: claimData.claimAmount,
        incident_description: claimData.incidentDescription,
        incident_date: claimData.incidentDate,
        status: 'PENDING',
        public_status: 'Under Review',
        created_at: new Date().toISOString()
      })

    if (claimError) {
      console.error('Error inserting claim:', claimError)
      return NextResponse.json({
        error: 'Failed to submit claim',
        details: claimError.message
      }, { status: 500 })
    }

    // Associate documents with the claim if any
    if (claimData.documents && claimData.documents.length > 0) {
      const documents = claimData.documents.map(doc => ({
        claim_id: claimId,
        file_url: doc.url,
        document_type: doc.type,
        uploaded_at: new Date().toISOString()
      }))

      const { error: docError } = await supabase
        .from('claim_documents')
        .insert(documents)

      if (docError) {
        console.error('Error associating documents:', docError)
        // Don't fail the whole request, just log the error
      }
    }

    // Trigger fraud analysis
    try {
      const fraudAnalysisResponse = await fetch('/api/claims/analyze-fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          claimId,
          claimDetails: {
            ...claimData,
            userId: user.id,
            email: user.email
          }
        })
      })

      if (!fraudAnalysisResponse.ok) {
        console.error('Fraud analysis failed:', await fraudAnalysisResponse.text())
      }
    } catch (analysisError) {
      console.error('Error during fraud analysis:', analysisError)
      // Don't fail the whole request, just log the error
    }

    return NextResponse.json({
      message: 'Claim submitted successfully',
      claimId
    }, { status: 200 })
  } catch (error: any) {
    console.error('Claim submission error:', error)
    return NextResponse.json({
      error: 'Failed to submit claim',
      details: error.message
    }, { status: 500 })
  }
} 