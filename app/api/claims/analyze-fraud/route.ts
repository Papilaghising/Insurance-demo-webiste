import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyD1PmCO2SX8Nsf53zfUmpDusLcGf5N07Tg')

interface FraudAnalysisResult {
  fraudRiskScore: number
  riskLevel: 'low' | 'medium' | 'high'
  keyFindings: string[]
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
    const { claimId, claimDetails } = body

    if (!claimId || !claimDetails) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'Claim ID and claim details are required'
      }, { status: 400 })
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Prepare the prompt
    const prompt = `Analyze this insurance claim for potential fraud indicators. Claim details:
    ${JSON.stringify(claimDetails, null, 2)}
    
    Provide a fraud risk analysis with the following:
    1. A fraud risk score from 0-100
    2. Risk level (low/medium/high)
    3. Key findings (list specific concerns or red flags)
    
    Format the response as a JSON object with these exact keys:
    {
      "fraudRiskScore": number,
      "riskLevel": "low" | "medium" | "high",
      "keyFindings": string[]
    }`

    // Generate analysis
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    try {
      const analysis: FraudAnalysisResult = JSON.parse(text)
      
      // Update the claim with fraud analysis results
      const { error: updateError } = await supabase
        .from('claims')
        .update({
          fraud_risk_score: analysis.fraudRiskScore,
          risk_level: analysis.riskLevel,
          key_findings: analysis.keyFindings,
          analyzed_at: new Date().toISOString()
        })
        .eq('claim_id', claimId)

      if (updateError) {
        console.error('Error updating claim with fraud analysis:', updateError)
        return NextResponse.json({
          error: 'Failed to update claim',
          details: updateError.message
        }, { status: 500 })
      }

      return NextResponse.json(analysis, { status: 200 })
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return NextResponse.json({
        error: 'Failed to parse fraud analysis',
        details: 'Invalid response format from AI model'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Fraud analysis error:', error)
    return NextResponse.json({
      error: 'Fraud analysis failed',
      details: error.message
    }, { status: 500 })
  }
} 