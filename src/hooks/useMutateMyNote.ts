import { useMutation, useQueryClient } from 'react-query'
import { supabase } from '@/utils/supabase'
import { MyNote } from '@/types'

export const useMutateMyNote = () => {
  const queryClient = useQueryClient()

  const createMyNoteMutation = useMutation(
    async (note: Omit<MyNote, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('my_notes')
        .insert(note)
        .select()

      if (error) throw new Error(error.message)
      return data as MyNote[]
    },
    {
      onSuccess: (res) => {
        const created = res[0]
        queryClient.setQueryData<MyNote[]>(['my-notes'], (prev = []) => [
          ...prev,
          created,
        ])
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  const deleteMyNoteMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('my_notes')
        .delete()
        .eq('id', id)
        .select()

      if (error) throw new Error(error.message)
      return data as MyNote[]
    },
    {
      onSuccess: (res) => {
        const deletedId = res[0]?.id
        if (!deletedId) return
        queryClient.setQueryData<MyNote[]>(['my-notes'], (prev = []) =>
          prev.filter((note) => note.id !== deletedId)
        )
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  return { createMyNoteMutation, deleteMyNoteMutation }
}
