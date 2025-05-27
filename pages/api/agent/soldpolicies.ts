import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('soldpolicies').select('*')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
}