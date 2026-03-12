import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
} from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'

type CommentRow = {
  id: string
  post_id: string
}

export const useSubscribeCommentCounts = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const subsc = supabase
      .channel('public:comments-counts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload: RealtimePostgresInsertPayload<CommentRow>) => {
          const postId = payload.new?.post_id
          if (!postId) return
          queryClient.setQueryData<number>(
            ['comment-count', postId],
            (prev) => (prev ?? 0) + 1
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'comments' },
        (payload: RealtimePostgresDeletePayload<CommentRow>) => {
          const commentId = payload.old?.id
          const directPostId = payload.old?.post_id

          const dec = (postId: string) => {
            queryClient.setQueryData<number>(
              ['comment-count', postId],
              (prev) => Math.max((prev ?? 0) - 1, 0)
            )
          }

          if (directPostId) {
            dec(directPostId)
            return
          }

          if (!commentId) return
          const cached = queryClient.getQueriesData<any>(['comments'])
          for (const [, data] of cached) {
            const arr = Array.isArray(data) ? data : []
            const match = arr.find((c: any) => c?.id === commentId)
            if (match?.post_id) {
              dec(match.post_id)
              break
            }
          }
        }
      )
      .subscribe()

    return () => {
      subsc.unsubscribe()
    }
  }, [queryClient])
}
