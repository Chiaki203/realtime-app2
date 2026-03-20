import { useEffect } from 'react'
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js'
import { useQueryClient } from 'react-query'
import { Notice } from '@/types'
import { supabase } from '@/utils/supabase'

export const useSubscribeNotices = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channelName = `public:notices:${Math.random().toString(36).slice(2)}`
    const subsc = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notices' },
        (payload: RealtimePostgresInsertPayload<Notice>) => {
          let previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
          if (!previousNotices) {
            previousNotices = []
          }
          queryClient.setQueryData(['notices'], [
            {
              id: payload.new.id,
              created_at: payload.new.created_at,
              content: payload.new.content,
              user_id: payload.new.user_id,
            },
            ...previousNotices,
          ])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notices' },
        (payload: RealtimePostgresUpdatePayload<Notice>) => {
          let previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
          if (!previousNotices) {
            previousNotices = []
          }
          queryClient.setQueryData(
            ['notices'],
            previousNotices.map((notice) =>
              notice.id === payload.new.id
                ? {
                    id: payload.new.id,
                    created_at: payload.new.created_at,
                    content: payload.new.content,
                    user_id: payload.new.user_id,
                  }
                : notice
            )
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notices' },
        (payload: RealtimePostgresDeletePayload<Notice>) => {
          let previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
          if (!previousNotices) {
            previousNotices = []
          }
          queryClient.setQueryData(
            ['notices'],
            previousNotices.filter((notice) => notice.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subsc)
    }
  }, [queryClient])
}
