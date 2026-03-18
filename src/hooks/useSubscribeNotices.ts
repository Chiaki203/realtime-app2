import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { 
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload
} from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { Notice } from '@/types';

export const useSubscribeNotices = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const channelName = `public:notices:${Math.random().toString(36).slice(2)}`
    const subsc = supabase
      .channel(channelName)
      .on('postgres_changes', 
        {event: 'INSERT', schema: 'public', table: 'notices'}, 
        (payload:RealtimePostgresInsertPayload<Notice>) => {
          console.log('subscribeNotice insert payload', payload)
          let previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
          if (!previousNotices) {
            console.log('previousNoticesなし！')
            previousNotices = []
          }
          queryClient.setQueryData(
            ['notices'],
            [{
                id: payload.new.id,
                created_at: payload.new.created_at,
                content: payload.new.content,
                user_id: payload.new.user_id
              },
              ...previousNotices,
            ]
          )
      })
      .on('postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'notices'},
        (payload:RealtimePostgresUpdatePayload<Notice>) => {
          console.log('subscribeNotice update payload', payload)
          let previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
          if (!previousNotices) {
            console.log('previousNoticesなし！')
            previousNotices = []
          }
          queryClient.setQueryData(
            ['notices'],
            previousNotices.map(notice => (
              notice.id === payload.new.id  
                ? {
                    id: payload.new.id,
                    created_at: payload.new.created_at,
                    content: payload.new.content,
                    user_id: payload.new.user_id
                }
                : notice
            ))
          )
      })
      .on('postgres_changes', 
        {event: 'DELETE', schema: 'public', table: 'notices'},
        (payload:RealtimePostgresDeletePayload<Notice>) => {
          console.log('subscribeNotice delete payload', payload)
          let previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
          if (!previousNotices) {
            console.log('previousNoticesなし！')
            previousNotices = []
          }
          queryClient.setQueryData(
            ['notices'],
            previousNotices.filter(notice => notice.id !== payload.old.id)
          )
      })
      .subscribe((status, err) => {
        console.log('subscribeNotices status', status)
        if (err) {
          console.error('subscribeNotices error', err)
        }
      })
    return () => {
      supabase.removeChannel(subsc)
    }
  }, [queryClient])
}
