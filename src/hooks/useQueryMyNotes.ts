import { useQuery } from 'react-query'
import { supabase } from '@/utils/supabase'
import useStore from '@/store'
import { MyNote } from '@/types'

export const useQueryMyNotes = () => {
  const session = useStore((state) => state.session)

  const getMyNotes = async () => {
    const { data, error } = await supabase
      .from('my_notes')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data as MyNote[]
  }

  return useQuery<MyNote[], Error>(['my-notes'], getMyNotes, {
    staleTime: Infinity,
    enabled: !!session?.user?.id,
  })
}
