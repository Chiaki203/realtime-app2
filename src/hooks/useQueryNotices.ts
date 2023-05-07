import { useQuery } from 'react-query';
import { supabase } from '@/utils/supabase';
import { Notice } from '@/types';

export const useQueryNotices = () => {
  const getNotices = async() => {
    const {data, error} = await supabase
      .from('notices')
      .select('*')
      .order('created_at', {ascending: true})
    if (error) throw new Error(error.message)
    console.log('getNotices supabase data', data)
    return data as Notice[]
  }
  return useQuery<Notice[], Error>(['notices'], getNotices, {
    staleTime: Infinity,
    onSuccess: (_) => {
      console.log('useQueryNotices onSuccess!')
    }
  })
}