import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload,
} from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import { Comment } from '@/types'

export const useSubscribeComments = (postId: string) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const channelName = `public:comments:${postId}:${Math.random().toString(36).slice(2)}`
    const subsc = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload: RealtimePostgresInsertPayload<Comment>) => {
          console.log('subscribeComments insert payload', payload)
          let previousComments = queryClient.getQueryData<Comment[]>([
            'comments',
            postId,
          ])
          if (!previousComments) {
            console.log('previousCommentsなし！')
            previousComments = []
          }
          const insertedComment = {
            id: payload.new.id,
            created_at: payload.new.created_at,
            user_id: payload.new.user_id,
            post_id: payload.new.post_id,
            comment: payload.new.comment,
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.some((comment) => comment.id === insertedComment.id)
              ? previousComments.map((comment) =>
                  comment.id === insertedComment.id ? insertedComment : comment
                )
              : [
                  insertedComment,
                  ...previousComments,
                ]
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload: RealtimePostgresUpdatePayload<Comment>) => {
          console.log('subscribeComments update payload', payload)
          let previousComments = queryClient.getQueryData<Comment[]>([
            'comments',
            postId,
          ])
          if (!previousComments) {
            console.log('previousCommentsなし！')
            previousComments = []
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.map((comment) =>
              comment.id === payload.new.id
                ? {
                    id: payload.new.id,
                    created_at: payload.new.created_at,
                    user_id: payload.new.user_id,
                    post_id: payload.new.post_id,
                    comment: payload.new.comment,
                  }
                : comment
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload: RealtimePostgresDeletePayload<Comment>) => {
          console.log('subscribeComments delete payload', payload)
          let previousComments = queryClient.getQueryData<Comment[]>([
            'comments',
            postId,
          ])
          if (!previousComments) {
            previousComments = []
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.filter((comment) => comment.id !== payload.old.id)
          )
        }
      )
      .subscribe((status, err) => {
        console.log('subscribeComments status', status, postId)
        if (err) {
          console.error('subscribeComments error', err)
        }
      })
    return () => {
      supabase.removeChannel(subsc)
    }
  }, [queryClient, postId])
}
