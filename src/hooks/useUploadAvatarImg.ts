import { ChangeEvent } from 'react';
import { useMutation } from 'react-query';
import { supabase } from '@/utils/supabase';
import useStore from '@/store';

export const useUploadAvatarImg = () => {
  const editedProfile = useStore(state => state.editedProfile)
  const updateProfile = useStore(state => state.updateEditedProfile)
  const useMutateUploadAvatarImg = useMutation(async(e:ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error('please select the image file')
    }
    console.log('uploadImg e.target', e.target)
    console.log('uploadImg e.target files', e.target.files)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    console.log('fileExt', fileExt)
    const fileName = `${Math.random()}.${fileExt}`
    console.log('fileName', fileName)
    const filePath = `${fileName}`
    const {error} = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
    if (error) throw new Error(error.message)
    updateProfile({
      ...editedProfile,
      avatar_url: filePath
    })
    console.log('image uploaded editedProfile', editedProfile)
  }, {
    onError: (err:any) => {
      alert(err.message)
    }
  })
  return {useMutateUploadAvatarImg}
}