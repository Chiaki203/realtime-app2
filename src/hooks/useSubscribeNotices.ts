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
    const subsc = supabase
      .channel('public:notices')
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
            [
              ...previousNotices, {
                id: payload.new.id,
                created_at: payload.new.created_at,
                content: payload.new.content,
                user_id: payload.new.user_id
              }
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
      .subscribe()
    const removeSubscription = async() => {
      await supabase.removeChannel(subsc)
    }
    return () => {
      removeSubscription()
    }
  }, [queryClient])
}