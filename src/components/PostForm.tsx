import { FormEvent, FC, memo } from 'react'
import Image from 'next/image'
import { CameraIcon } from '@heroicons/react/solid'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { useMutatePost } from '@/hooks/useMutatePost'
import { useUploadPostImg } from '@/hooks/useUploadPostImg'
import useStore from '@/store'
import { Spinner } from './Spinner'

const POST_MAX_LENGTH = 1000

export const PostFormMemo: FC = () => {
  const session = useStore((state) => state.session)
  const editedPost = useStore((state) => state.editedPost)
  const update = useStore((state) => state.updateEditedPost)
  const reset = useStore((state) => state.resetEditedPost)
  const { createPostMutation } = useMutatePost()
  const { useMutateUploadPostImg } = useUploadPostImg()
  const { fullUrl: postUrl, setFullUrl } = useDownloadUrl(
    editedPost.post_url,
    'posts'
  )

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createPostMutation.mutateAsync({
      user_id: session?.user?.id,
      title: editedPost.title,
      post_url: editedPost.post_url,
    })
    reset()
    setFullUrl('')
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="flex w-full items-start justify-start">
        <label
          htmlFor="post"
          className="mt-2 flex cursor-pointer items-center gap-2"
        >
          <CameraIcon className="app-icon-muted h-7 w-7" />
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
      <textarea
        className="app-input my-1 min-h-[112px] w-full resize-none"
        placeholder="Write a caption"
        value={editedPost.title}
        maxLength={POST_MAX_LENGTH}
        onChange={(e) => update({ ...editedPost, title: e.target.value })}
      />
      <div className="w-full text-right text-xs text-[var(--color-muted)]">
        {editedPost.title.length} / {POST_MAX_LENGTH}
      </div>
      <div className="my-3 flex w-full justify-center">
        <button
          data-testid="btn-post"
          type="submit"
          className="app-button w-full"
          disabled={useMutateUploadPostImg.isLoading || !editedPost.title}
        >
          Create
        </button>
      </div>
    </form>
  )
}

export const PostForm = memo(PostFormMemo)
