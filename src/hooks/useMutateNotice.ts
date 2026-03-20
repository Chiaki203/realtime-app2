import { useMutation } from 'react-query'
import useStore from '@/store'
import { EditedNotice, Notice } from '@/types'
import { supabase } from '@/utils/supabase'

export const useMutateNotice = () => {
  const reset = useStore((state) => state.resetEditedNotice)

  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('notices').insert(notice).select()
      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { error } = await supabase
        .from('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
        .select()
      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  return { createNoticeMutation, updateNoticeMutation, deleteNoticeMutation }
}
