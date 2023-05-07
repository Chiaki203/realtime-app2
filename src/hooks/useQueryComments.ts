import { useQuery } from 'react-query';
import { supabase } from '@/utils/supabase';
import { Comment } from '@/types';

export const useQueryComments = (postId:string) => {
  const getComments = async() => {
    const {data, error} = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', {ascending: true})
    if (error) {
      throw new Error(error.message)
    }
    console.log('getComments supabase data', data)
    return data as Comment[]
  }
  return useQuery<Comment[], Error>(['comments', postId], getComments, {
    staleTime: Infinity
  })
}