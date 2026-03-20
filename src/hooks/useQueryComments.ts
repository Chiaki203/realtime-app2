import { useQuery } from 'react-query'
import { Comment } from '@/types'
import { supabase } from '@/utils/supabase'

export const useQueryComments = (postId: string) => {
  const getComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    if (error) {
      throw new Error(error.message)
    }
    return data as Comment[]
  }

  return useQuery<Comment[], Error>(['comments', postId], getComments, {
    staleTime: Infinity,
  })
}
