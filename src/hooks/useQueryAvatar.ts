import { useQuery } from 'react-query';
import { supabase } from '@/utils/supabase';

type ProfilePreview = {
  avatar_url: string | undefined
  username: string | undefined
}

export const useQueryAvatar = (userId:string|undefined) => {
  const getAvatarUrl = async() => {
    const {data, error} = await supabase
      .from('profiles')
      .select('avatar_url, username')
      .eq('id', userId)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    console.log('getAvatarUrl supabase data', data)
    return data as ProfilePreview
  }
  return useQuery<ProfilePreview, Error>(['avatar-url', userId], getAvatarUrl, {
    refetchOnWindowFocus: true
  })
}
