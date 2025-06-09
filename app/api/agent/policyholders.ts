import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('cprofile')
    .select('email,user_id')
    .eq('role', 'policyholder')

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }

  return res.status(200).json(data)
}
