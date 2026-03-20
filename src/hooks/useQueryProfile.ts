import { useQuery } from 'react-query'
import useStore from '@/store'
import { Profile } from '@/types'
import { supabase } from '@/utils/supabase'
import { useMutateProfile } from './useMutateProfile'

const DEFAULT_USERNAME = 'Anonymous'

export const useQueryProfile = () => {
  const session = useStore((state) => state.session)
  const editedProfile = useStore((state) => state.editedProfile)
  const update = useStore((state) => state.updateEditedProfile)
  const { createProfileMutation } = useMutateProfile()

  const getProfile = async () => {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user?.id)
      .single()
    if (error && status === 406) {
      createProfileMutation.mutate({
        id: session?.user?.id,
        username: DEFAULT_USERNAME,
        favorites: '',
        avatar_url: '',
      })
      update({
        ...editedProfile,
        username: DEFAULT_USERNAME,
      })
    }
    if (error && status !== 406) {
      throw new Error(error.message)
    }
    return data as Profile
  }

  return useQuery<Profile, Error>(['profile'], getProfile, {
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data) {
        update({
          username: data.username,
          favorites: data.favorites,
          avatar_url: data.avatar_url,
        })
      }
    },
  })
}
