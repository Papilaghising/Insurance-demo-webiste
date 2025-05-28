import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = getSupabase()

    // Parse the request body directly since it's already parsed by Next.js
    const body = req.body

    const { data, error } = await supabase.from('claims').insert([
      {
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        policy_number: body.policyNumber,
        claim_type: body.claimType,
        date_of_incident: body.dateOfIncident,
        incident_location: body.incidentLocation,
        incident_description: body.incidentDescription,
        claim_amount: parseFloat(body.claimAmount),
        consent: body.consent === 'true'
      },
    ])

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ message: 'Success', data })
  } catch (err: any) {
    console.error('API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
