import { useQuery } from 'react-query';
import { supabase } from '@/utils/supabase';
import { Profile } from '@/types';

type Avatar = {
  avatar_url: string | undefined
}

export const useQueryAvatar = (userId:string|undefined) => {
  const getAvatarUrl = async() => {
    const {data, error} = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    console.log('getAvatarUrl supabase data', data)
    return data as Avatar
  }
  return useQuery<Avatar, Error>(['avatar-url', userId], getAvatarUrl, {
    refetchOnWindowFocus: true
  })
}