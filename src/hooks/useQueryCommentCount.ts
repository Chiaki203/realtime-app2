import { useQuery } from 'react-query'
import { supabase } from '@/utils/supabase'

export const useQueryCommentCount = (postId: string) => {
  const getCount = async () => {
    const { count, error } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (error) throw new Error(error.message)
    return count ?? 0
  }

  return useQuery<number, Error>(['comment-count', postId], getCount, {
    suspense: false,
    refetchOnWindowFocus: true,
  })
}

