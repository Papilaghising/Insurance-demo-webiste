import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = getSupabase()
    const body = req.body

    console.log('Claim submission body:', body);

    // Construct the API URL correctly
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (req.headers.host ? `http://${req.headers.host}` : 'http://localhost:3000');
    
    console.log('Using base URL:', baseUrl);

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
      });

      if (!fraudAnalysisRes.ok) {
        const errorText = await fraudAnalysisRes.text();
        console.error('Fraud analysis failed:', errorText);
        throw new Error(`Failed to analyze claim for fraud: ${errorText}`);
      }

      const fraudAnalysis = await fraudAnalysisRes.json();
      console.log('Fraud analysis result:', fraudAnalysis);

      // Validate fraud analysis data
      if (!fraudAnalysis || typeof fraudAnalysis.fraudRiskScore === 'undefined') {
        console.error('Invalid fraud analysis response:', fraudAnalysis);
        throw new Error('Invalid fraud analysis response');
      }

      // Insert the claim with fraud analysis results
      const claimData = {
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        policy_number: body.policyNumber,
        claim_type: body.claimType,
        date_of_incident: body.dateOfIncident,
        incident_location: body.incidentLocation,
        incident_description: body.incidentDescription,
        claim_amount: parseFloat(body.claimAmount),
        consent: body.consent === 'true',
        fraud_risk_score: fraudAnalysis.fraudRiskScore,
        risk_level: fraudAnalysis.riskLevel,
        key_findings: fraudAnalysis.keyFindings,
        status: fraudAnalysis.recommendation === 'APPROVE' ? 'APPROVED' : 
                fraudAnalysis.recommendation === 'REJECT' ? 'REJECTED' : 'UNDER_REVIEW'
      };

      console.log('Inserting claim data:', claimData);

      const { data: insertedClaim, error: claimError } = await supabase
        .from('claims')
        .insert([claimData])
        .select();

      if (claimError) {
        console.error('Supabase insert error:', claimError)
        return res.status(400).json({ error: claimError.message })
      }

      console.log('Inserted claim:', insertedClaim);

      // Return the claim data including the ID for file upload
      return res.status(200).json({ 
        message: 'Success', 
        data: insertedClaim[0],
        fraudAnalysis
      })
    } catch (fraudError: any) {
      console.error('Fraud analysis error:', fraudError);
      // If fraud analysis fails, still insert the claim but mark it for review
      const claimData = {
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        policy_number: body.policyNumber,
        claim_type: body.claimType,
        date_of_incident: body.dateOfIncident,
        incident_location: body.incidentLocation,
        incident_description: body.incidentDescription,
        claim_amount: parseFloat(body.claimAmount),
        consent: body.consent === 'true',
        fraud_risk_score: 50, // Default score
        risk_level: 'MEDIUM',
        key_findings: ['Fraud analysis failed - manual review required'],
        status: 'UNDER_REVIEW'
      };

      const { data: insertedClaim, error: claimError } = await supabase
        .from('claims')
        .insert([claimData])
        .select();

      if (claimError) {
        console.error('Supabase insert error:', claimError)
        return res.status(400).json({ error: claimError.message })
      }

      return res.status(200).json({ 
        message: 'Success (with fraud analysis warning)', 
        data: insertedClaim[0],
        warning: 'Fraud analysis failed, claim marked for review'
      })
    }
  } catch (err: any) {
    console.error('API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
