import { useQuery } from 'react-query';
import { supabase } from '@/utils/supabase';
import { Post } from '@/types';

export const useQueryPosts = () => {
  const getPosts = async() => {
    const {data, error} = await supabase
      .from('posts')
      .select('*')
      .order('created_at', {ascending: true})
    if (error) {
      throw new Error(error.message)
    }
    console.log('getPosts supabase data', data)
    return data as Post[]
  }
  return useQuery<Post[], Error>(['posts'], getPosts, {
    staleTime: Infinity,
    onSuccess: () => {
      console.log('useQueryPosts onSuccess!')
    }
  })
}