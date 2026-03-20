import { useQuery } from 'react-query'
import { Post } from '@/types'
import { supabase } from '@/utils/supabase'

export const useQueryPosts = () => {
  const getPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      throw new Error(error.message)
    }
    return data as Post[]
  }

  return useQuery<Post[], Error>(['posts'], getPosts, {
    staleTime: Infinity,
  })
}
