import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = getSupabase()
    const { fullName, email } = req.body

    // Get the user from the session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    console.log('Session debug:', session) // Debug log
    console.log('Auth error debug:', authError) // Debug log

    if (authError || !session) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        details: authError?.message || 'No session found'
      })
    }

    // Update the profile in cprofile table
    const { error: updateError } = await supabase
      .from('cprofile')
      .upsert({
        email: email,
        fullName: fullName,
        updated_at: new Date().toISOString()
      })
      .match({ email: email })

    if (updateError) {
      return res.status(500).json({ error: updateError.message })
    }

    return res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error in profile update handler:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}