import { useQuery } from 'react-query';
import { supabase } from '@/utils/supabase';
import useStore from '@/store';
import { Profile } from '@/types';
import { useMutateProfile } from './useMutateProfile';

export const useQueryProfile = () => {
  const session = useStore(state => state.session)
  const editedProfile = useStore(state => state.editedProfile)
  const update = useStore(state => state.updateEditedProfile)
  const {createProfileMutation} = useMutateProfile()
  const getProfile = async() => {
    const {data, error, status} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user?.id)
      .single()
    console.log('getProfile supabase status', status)
    if (error && status === 406) {
      console.log('create default profile!')
      createProfileMutation.mutate({
        id: session?.user?.id,
        username: session?.user?.email,
        favorites: '',
        avatar_url: ''
      })
      update({
        ...editedProfile,
        username: session?.user?.email
      })
    }
    if (error && status !== 406) {
      throw new Error(error.message)
    }
    console.log('getProfile supabase data', data)
    return data as Profile
  }
  return useQuery<Profile, Error>(['profile'], getProfile, {
    staleTime: Infinity,
    onSuccess: (data) => {
      console.log('getProfile onSuccess data', data)
      if (data) {
        update({
          username: data.username,
          favorites: data.favorites,
          avatar_url: data.avatar_url
        })
      }
    }
  })
}