import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = getSupabase()

    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Set session for Supabase client with access token
    supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user || !user.email) {
      return res.status(401).json({ error: 'Invalid token or missing email' })
    }

    // Query only selected fields for the logged-in user
    const { data, error } = await supabase
      .from('claims')
      .select('claim_id, claim_type, claim_amount, status')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data || [])
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
