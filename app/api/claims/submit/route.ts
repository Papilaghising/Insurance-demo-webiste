import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()

    console.log('Claim submission body:', body)

    // Construct the API URL correctly
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
    
    console.log('Using base URL:', baseUrl)

    // First analyze the claim for fraud
    try {
      const fraudAnalysisRes = await fetch(`${baseUrl}/api/claims/analyze-fraud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          claimData: {
            claimType: body.claimType,
            dateOfIncident: body.dateOfIncident,
            incidentLocation: body.incidentLocation,
            incidentDescription: body.incidentDescription,
            claimAmount: body.claimAmount
          } 
        })
      })

      if (!fraudAnalysisRes.ok) {
        const errorText = await fraudAnalysisRes.text()
        console.error('Fraud analysis failed:', errorText)
        throw new Error(`Failed to analyze claim for fraud: ${errorText}`)
      }

      const fraudAnalysis = await fraudAnalysisRes.json()
      console.log('Fraud analysis result:', fraudAnalysis)

      // Validate fraud analysis data
      if (!fraudAnalysis || typeof fraudAnalysis.fraudRiskScore === 'undefined') {
        console.error('Invalid fraud analysis response:', fraudAnalysis)
        throw new Error('Invalid fraud analysis response')
      }

      // Insert the claim into the database
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .insert([{
          email: body.email,
        full_name: body.fullName,
        phone: body.phone,
        policy_number: body.policyNumber,
        claim_type: body.claimType,
        date_of_incident: body.dateOfIncident,
        incident_location: body.incidentLocation,
        incident_description: body.incidentDescription,
          claim_amount: body.claimAmount,
          public_status: 'SUBMITTED',
        fraud_risk_score: fraudAnalysis.fraudRiskScore,
        risk_level: fraudAnalysis.riskLevel,
          key_findings: fraudAnalysis.keyFindings
        }])
        .select()
        .single()

      if (claimError) {
        console.error('Database error:', claimError)
        throw new Error(claimError.message)
      }

      return NextResponse.json({ 
        message: 'Claim submitted successfully',
        data: claimData,
        fraudAnalysis
      })

    } catch (error: any) {
      console.error('Fraud analysis error:', error)
      return NextResponse.json({ 
        error: 'Failed to process claim',
        details: error.message 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Handler error:', error)
    return NextResponse.json({
      error: 'Failed to submit claim',
      details: error.message
    }, { status: 500 })
  }
}
