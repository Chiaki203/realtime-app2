import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export const useDownloadUrl = (
  filePath: string | undefined,
  key: 'avatars' | 'posts'
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fullUrl, setFullUrl] = useState('')
  const bucketName = key === 'avatars' ? 'avatars' : 'posts'
  useEffect(() => {
    console.log('filePathある？', filePath)
    if (filePath) {
      console.log('ImageUrlダウンロード開始')
      console.log('bucketName', bucketName)
      const download = async() => {
        setIsLoading(true)
        const {data, error} = await supabase.storage
          .from(bucketName)
          .download(filePath)
        if (error) {
          setIsLoading(false)
          throw error
        }
        console.log('downloaded storage data', data)
        console.log('URL.createObjectURL(data)', URL.createObjectURL(data))
        setFullUrl(URL.createObjectURL(data))
        setIsLoading(false)
      }
      download()
    } else {
      console.log('ファイルパスない！')
    }
  }, [filePath, bucketName])
  return {isLoading, fullUrl, setFullUrl}
}