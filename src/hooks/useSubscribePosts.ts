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
    const subsc = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        {event: 'INSERT', schema: 'public', table: 'posts'}, 
        (payload:RealtimePostgresInsertPayload<Post>) => {
          console.log('subscribePost insert payload', payload)
          let previousPosts = queryClient.getQueryData<Post[]>(['posts'])
          if (!previousPosts) {
            console.log('previousPostsなし！')
            previousPosts = []
          }
          queryClient.setQueryData(
            ['posts'],
            [
              ...previousPosts, {
                id: payload.new.id,
                created_at: payload.new.created_at,
                title: payload.new.title,
                post_url: payload.new.post_url,
                user_id: payload.new.user_id
              }
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
      .subscribe()
    const removeSubscription = async() => {
      await supabase.removeChannel(subsc)
    }
    return () => {
      // removeSubscription()
      subsc.unsubscribe()
    }
  }, [queryClient])
}