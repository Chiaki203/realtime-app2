import { useMutation, useQueryClient } from 'react-query'
import { Profile } from '@/types'
import { supabase } from '@/utils/supabase'

export const useMutateProfile = () => {
  const queryClient = useQueryClient()

  const createProfileMutation = useMutation(
    async (profile: Omit<Profile, 'updated_at' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['profile'], res[0])
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  const updateProfileMutation = useMutation(
    async (profile: Omit<Profile, 'updated_at' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['profile'], res[0])
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  return { createProfileMutation, updateProfileMutation }
}
