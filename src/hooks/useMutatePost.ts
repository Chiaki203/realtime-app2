import { useMutation, useQueryClient } from 'react-query';
import useStore from '@/store';
import { supabase } from '@/utils/supabase';
import { Post, EditedPost } from '@/types';

export const useMutatePost = () => {
  const queryClient = useQueryClient()
  const reset = useStore(state => state.resetEditedPost)
  const createPostMutation = useMutation(async(post:Omit<Post, 'id' | 'created_at'>) => {
    const {data, error} = await supabase
      .from('posts')
      .insert(post)
      .select()
    if (error) throw new Error(error.message)
    console.log('createPostMutation supabase data', data)
    return data
  }, {
    onSuccess: (res) => {
      const createdPost = res?.[0]
      if (createdPost) {
        queryClient.setQueryData<Post[]>(['posts'], (previousPosts = []) => {
          const filteredPosts = previousPosts.filter(post => post.id !== createdPost.id)
          return [createdPost, ...filteredPosts]
        })
      }
      reset()
    },
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  const updatePostMutation = useMutation(async(post:EditedPost) => {
    const {data, error} = await supabase
      .from('posts')
      .update({title: post.title, post_url: post.post_url})
      .eq('id', post.id)
      .select()
    if (error) throw new Error(error.message)
    console.log('updatePostMutation supabase data', data)
    return data
  }, {
    onSuccess: (res) => {
      const updatedPost = res?.[0]
      if (updatedPost) {
        queryClient.setQueryData<Post[]>(['posts'], (previousPosts = []) =>
          previousPosts.map(post => (
            post.id === updatedPost.id ? updatedPost : post
          ))
        )
      }
      reset()
    },
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  const deletePostMutation = useMutation(async(id:string) => {
    const {data, error} = await supabase 
      .from('posts')
      .delete()
      .eq('id', id)
      .select()
    if (error) throw new Error(error.message)
    console.log('deletePostMutation supabase data', data)
    return data
  }, {
    onSuccess: (res) => {
      const deletedPostId = res?.[0]?.id
      if (deletedPostId) {
        queryClient.setQueryData<Post[]>(['posts'], (previousPosts = []) =>
          previousPosts.filter(post => post.id !== deletedPostId)
        )
      }
      reset()
    },
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  return {createPostMutation, updatePostMutation, deletePostMutation}
}
