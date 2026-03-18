import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { 
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload
} from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { Post } from '@/types';

export const useSubscribePosts = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const channelName = `public:posts:${Math.random().toString(36).slice(2)}`
    const subsc = supabase
      .channel(channelName)
      .on('postgres_changes', 
        {event: 'INSERT', schema: 'public', table: 'posts'}, 
        (payload:RealtimePostgresInsertPayload<Post>) => {
          console.log('subscribePost insert payload', payload)
          let previousPosts = queryClient.getQueryData<Post[]>(['posts'])
          if (!previousPosts) {
            console.log('previousPostsなし！')
            previousPosts = []
          }
          const insertedPost = {
            id: payload.new.id,
            created_at: payload.new.created_at,
            title: payload.new.title,
            post_url: payload.new.post_url,
            user_id: payload.new.user_id
          }
          queryClient.setQueryData(
            ['posts'],
            previousPosts.some(post => post.id === insertedPost.id)
              ? previousPosts.map(post => (
                  post.id === insertedPost.id ? insertedPost : post
                ))
              : [
                  insertedPost,
                  ...previousPosts
                ]
          )
      }) 
      .on('postgres_changes', 
        {event: 'UPDATE', schema: 'public', table: 'posts'}, 
        (payload:RealtimePostgresUpdatePayload<Post>) => {
          console.log('subscribePosts update payload', payload)
          let previousPosts = queryClient.getQueryData<Post[]>(['posts'])
          if (!previousPosts) {
            console.log('previousPostsなし！')
            previousPosts = []
          }
          queryClient.setQueryData(
            ['posts'],
            previousPosts.map(post => (
              post.id === payload.new.id
                ? {
                  id: payload.new.id,
                  created_at: payload.new.created_at,
                  title: payload.new.title,
                  post_url: payload.new.post_url,
                  user_id: payload.new.user_id
                }
                : post
            ))
          )
      })
      .on('postgres_changes', 
        {event: 'DELETE', schema: 'public', table: 'posts'}, 
        (payload:RealtimePostgresDeletePayload<Post>) => {
          console.log('subscribePosts delete payload', payload)
          let previousPosts = queryClient.getQueryData<Post[]>(['posts'])
          if (!previousPosts) {
            console.log('previousPostsなし！')
            previousPosts = []
          }
          queryClient.setQueryData(
            ['posts'],
            previousPosts.filter(post => post.id !== payload.old.id)
          )
      })
      .subscribe((status, err) => {
        console.log('subscribePosts status', status)
        if (err) {
          console.error('subscribePosts error', err)
        }
      })
    return () => {
      supabase.removeChannel(subsc)
    }
  }, [queryClient])
}
