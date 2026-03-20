import { useQuery } from 'react-query'
import { Notice } from '@/types'
import { supabase } from '@/utils/supabase'

export const useQueryNotices = () => {
  const getNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as Notice[]
  }

  return useQuery<Notice[], Error>(['notices'], getNotices, {
    staleTime: Infinity,
  })
}
