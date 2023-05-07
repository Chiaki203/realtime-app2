import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/utils/supabase';
import { Profile } from '@/types';

export const useMutateProfile = () => {
  const queryClient = useQueryClient()
  const createProfileMutation = useMutation(async(profile:Omit<Profile, 'updated_at' | 'created_at'>) => {
    const {data, error} = await supabase
      .from('profiles')
      .insert(profile)
      .select()
    if (error) throw new Error(error.message)
    console.log('createProfileMutation supabase data', data)
    return data
  }, {
    onSuccess: (res) => {
      console.log('createProfileMutation onSuccess res', res)
      queryClient.setQueryData(['profile'], res[0])
    },
    onError: (err:any) => {
      alert(err.message)
    }
  })
  const updateProfileMutation = useMutation(async(profile:Omit<Profile, 'updated_at' | 'created_at'>) => {
    const {data, error} = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
    if (error) throw new Error(error.message)
    console.log('updateProfileMutation supabase data', data)
    return data
  }, {
    onSuccess: (res) => {
      console.log('updateProfileMutation onSuccess res')
      queryClient.setQueryData(['profile'], res[0])
    },
    onError: (err:any) => {
      alert(err.message)
    }
  })
  return {createProfileMutation, updateProfileMutation}
}