import { FormEvent, FC, memo } from 'react'
import Image from 'next/image'
import { CameraIcon } from '@heroicons/react/solid'
import useStore from '@/store'
import { useMutatePost } from '@/hooks/useMutatePost'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { useUploadPostImg } from '@/hooks/useUploadPostImg'
import { Spinner } from './Spinner'

export const PostFormMemo: FC = () => {
  const session = useStore((state) => state.session)
  const editedPost = useStore((state) => state.editedPost)
  const update = useStore((state) => state.updateEditedPost)
  const { createPostMutation, updatePostMutation } = useMutatePost()
  const { useMutateUploadPostImg } = useUploadPostImg()

  console.log('PostForm editedPost.post_url', editedPost.post_url)

  const { fullUrl: postUrl, setFullUrl } = useDownloadUrl(
    editedPost.post_url,
    'posts'
  )
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedPost.id === '') {
      await createPostMutation.mutateAsync({
        user_id: session?.user?.id,
        title: editedPost.title,
        post_url: editedPost.post_url,
      })
      setFullUrl('')
      console.log('プレビュー終了')
      console.log('editedPost.post_url', editedPost.post_url)
    } else {
      await updatePostMutation.mutateAsync({
        id: editedPost.id,
        title: editedPost.title,
        post_url: editedPost.post_url,
      })
      setFullUrl('')
      console.log('プレビュー終了')
      console.log('editedPost.post_url', editedPost.post_url)
    }
  }
  // console.log('editedPost post_url', editedPost.post_url)
  return (
    <form
      onSubmit={submitHandler}
      className="flex w-full flex-col items-center justify-center"
    >
      <input
        type="text"
        className="my-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
        placeholder="New Post"
        value={editedPost.title}
        onChange={(e) => update({ ...editedPost, title: e.target.value })}
      />
      <div className="flex w-full items-start justify-start">
        <label
          htmlFor="post"
          className="mt-2 flex cursor-pointer items-center gap-2"
        >
          <CameraIcon className=" h-7 w-7  text-gray-500" />
          <span className="text-sm">Upload Image</span>
        </label>
        <input
          className="hidden"
          type="file"
          id="post"
          accept="image/*"
          onChange={async (e) => {
            await useMutateUploadPostImg.mutateAsync(e)
            e.target.value = ''
          }}
        />
      </div>
      <div className="mt-2 flex w-full flex-col items-start justify-start">
        {postUrl && (
          <>
            <Image
              src={postUrl}
              alt="Image"
              className="rounded"
              width={150}
              height={150}
            />
            <div className="w-[150px] text-center text-sm">Preview</div>
          </>
        )}
      </div>
      <div className="flex justify-center">
        {useMutateUploadPostImg.isLoading && <Spinner />}
      </div>
      <div className="my-3 flex w-full justify-center">
        <button
          data-testid="btn-post"
          type="submit"
          className={`w-full rounded bg-indigo-600 px-3 py-2 text-sm text-white`}
          disabled={useMutateUploadPostImg.isLoading || !editedPost.title}
        >
          {editedPost.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

export const PostForm = memo(PostFormMemo)
