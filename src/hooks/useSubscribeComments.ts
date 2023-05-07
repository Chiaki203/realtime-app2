import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { 
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload
} from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { Comment } from '@/types';

export const useSubscribeComments = (postId:string) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const subsc = supabase
      // .channel(`public:comments:post_id=eq.${postId}`)
      .channel(`public:comments:${postId}`)
      .on('postgres_changes', 
        {event:'INSERT', schema:'public', table:'comments', filter:`post_id=eq.${postId}`},
        (payload:RealtimePostgresInsertPayload<Comment>) => {
          console.log('subscribeComments insert payload', payload)
          let previousComments = queryClient.getQueryData<Comment[]>(['comments', postId])
          if (!previousComments) {
            console.log('previousCommentsなし！')
            previousComments = []
          }
          queryClient.setQueryData(
            ['comments', postId],
            [
              ...previousComments,
              {
                id: payload.new.id,
                created_at: payload.new.created_at,
                user_id: payload.new.user_id,
                post_id: payload.new.post_id,
                comment: payload.new.comment
              }
            ]
          )
        }
      )
      .on('postgres_changes', 
        {event: 'UPDATE', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}`},
        (payload:RealtimePostgresUpdatePayload<Comment>) => {
          console.log('subscribeComments update payload', payload)
          let previousComments = queryClient.getQueryData<Comment[]>(['comments', postId])
          if (!previousComments) {
            console.log('previousCommentsなし！')
            previousComments = []
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.map(comment => (
              comment.id === payload.new.id 
                ? {
                  id: payload.new.id,
                  created_at: payload.new.created_at,
                  user_id: payload.new.user_id,
                  post_id: payload.new.post_id,
                  comment: payload.new.comment
                }
                : comment
            ))
          )
      })
      .on('postgres_changes', 
        {event: 'DELETE', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}`}, 
        (payload:RealtimePostgresDeletePayload<Comment>) => {
          console.log('subscribeComments delete payload', payload)
          let previousComments = queryClient.getQueryData<Comment[]>(['comments', postId])
          if (!previousComments) {
            console.log('previousCommentsなし！')
            previousComments = []
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.filter(comment => comment.id !== payload.old.id)
          )
      })
      .subscribe()
    const removeSubscription = async() => {
      await supabase.removeChannel(subsc)
    }
    return () => {
      // subsc.unsubscribe()
      removeSubscription()
    }
  }, [queryClient, postId])
}