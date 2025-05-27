import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = getSupabase()
    
    // Get the user from the session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = session.user.id

    // Get the profile for the current user
    const { data, error } = await supabase
      .from('cprofile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error in profile display handler:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}