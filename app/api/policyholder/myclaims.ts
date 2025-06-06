import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize Supabase client
    const supabase = getSupabase()
    
    // Get the authorization header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      console.error('No authorization header found')
      return res.status(401).json({ error: 'No authorization header' })
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('No token found in authorization header')
      return res.status(401).json({ error: 'No token provided' })
    }

    // Set the auth token for this request
    supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    })

    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user || !user.email) {
      console.error('User error or no email:', userError)
      return res.status(401).json({ error: 'Invalid token or missing email' })
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
      return res.status(500).json({ error: error.message })
    }

    console.log(`Found ${data?.length || 0} claims for user:`, user.email)
    return res.status(200).json(data || [])
  } catch (err) {
    console.error('API Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}