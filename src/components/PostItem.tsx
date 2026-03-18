import { ChangeEvent, FC, useEffect, useState, Suspense, memo } from 'react'
import Image from 'next/image'
import { ExclamationCircleIcon, UserCircleIcon } from '@heroicons/react/solid'
import { ChatIcon } from '@heroicons/react/outline'
import { ErrorBoundary } from 'react-error-boundary'
import { useMutation } from 'react-query'
import { Spinner } from './Spinner'
import useStore from '@/store'
import { Post } from '@/types'
import { useMutatePost } from '@/hooks/useMutatePost'
import { useQueryCommentCount } from '@/hooks/useQueryCommentCount'
import { useQueryAvatar } from '@/hooks/useQueryAvatar'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { Comments } from './Comments'
import { ItemActionMenu } from './ItemActionMenu'
import { supabase } from '@/utils/supabase'

const POST_PREVIEW_LENGTH = 140
const POST_MAX_LENGTH = 1000

type Props = Omit<Post, 'created_at'> & {
  isEditing: boolean
  startEditing: () => void
  stopEditing: () => void
}

export const PostItemMemo: FC<Props> = ({
  id,
  title,
  post_url,
  user_id,
  isEditing,
  startEditing,
  stopEditing,
}) => {
  const [openComments, setOpenComments] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftPostUrl, setDraftPostUrl] = useState(post_url)
  const session = useStore((state) => state.session)
  const { data } = useQueryAvatar(user_id)
  const { deletePostMutation, updatePostMutation } = useMutatePost()
  const { data: commentCount } = useQueryCommentCount(id)
  const { fullUrl: avatarUrl, isLoading: isLoadingAvatar } = useDownloadUrl(
    data?.avatar_url,
    'avatars'
  )
  const { fullUrl: postUrl, isLoading: isLoadingPost } = useDownloadUrl(
    post_url,
    'posts'
  )
  const { fullUrl: editPostUrl, isLoading: isLoadingEditedPost } =
    useDownloadUrl(draftPostUrl, 'posts')
  const uploadPostImageMutation = useMutation(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Please select the image file')
      }
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      const { error } = await supabase.storage
        .from('posts')
        .upload(filePath, file)
      if (error) throw new Error(error.message)
      return filePath
    },
    {
      onSuccess: (filePath) => {
        setDraftPostUrl(filePath)
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(title)
      setDraftPostUrl(post_url)
    }
  }, [isEditing, post_url, title])

  const isLongCaption = title.length > POST_PREVIEW_LENGTH
  const visibleCaption =
    expanded || !isLongCaption
      ? title
      : `${title.slice(0, POST_PREVIEW_LENGTH).trimEnd()}...`

  const savePost = async () => {
    await updatePostMutation.mutateAsync({
      id,
      title: draftTitle,
      post_url: draftPostUrl,
    })
    stopEditing()
  }

  const cancelEdit = () => {
    setDraftTitle(title)
    setDraftPostUrl(post_url)
    stopEditing()
  }
  return (
    <>
      <li className="w-full">
        <div className="app-divider my-5 w-full border border-dashed" />
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center">
            {avatarUrl ? (
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                <Image
                  src={avatarUrl}
                  alt="avatar"
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
            ) : (
              <UserCircleIcon className="app-icon-muted inline-block h-6 w-6 cursor-pointer" />
            )}
            <span className="ml-2 truncate text-sm font-bold">
              {data?.username || 'Unknown'}
            </span>
          </div>
          {session?.user?.id === user_id && (
            <div className="pr-2">
              {isEditing ? null : (
                <ItemActionMenu
                  menuTestId="menu-post"
                  editTestId="edit-post"
                  deleteTestId="delete-post"
                  onEdit={startEditing}
                  onDelete={() => {
                    deletePostMutation.mutate(id)
                  }}
                />
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-3">
            {draftPostUrl && (
              <div className="mb-3 w-full">
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg">
                  <Image
                    src={editPostUrl || postUrl}
                    alt="Edited image"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {(isLoadingEditedPost || uploadPostImageMutation.isLoading) && (
              <div className="my-3 flex justify-center">
                <Spinner />
              </div>
            )}
            <div className="flex items-start justify-start">
              <label
                htmlFor={`edit-post-${id}`}
                className="app-link-accent cursor-pointer text-sm font-bold underline"
              >
                Replace image
              </label>
              <input
                id={`edit-post-${id}`}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  await uploadPostImageMutation.mutateAsync(e)
                  e.target.value = ''
                }}
              />
            </div>
            <textarea
              data-testid="edit-post-textarea"
              className="app-input mt-3 min-h-[112px] w-full resize-none"
              maxLength={POST_MAX_LENGTH}
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
            />
            <div className="items-top flex justify-between">
              <div className="mt-3 flex items-center gap-3">
                <button
                  data-testid="save-post"
                  type="button"
                  className="app-button"
                  disabled={
                    updatePostMutation.isLoading ||
                    uploadPostImageMutation.isLoading ||
                    !draftTitle
                  }
                  onClick={savePost}
                >
                  {updatePostMutation.isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  data-testid="cancel-post"
                  type="button"
                  className="app-input bg-transparent px-4 py-2"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
              <div className="mt-1 w-full text-right text-xs text-[var(--color-muted)]">
                {draftTitle.length} / {POST_MAX_LENGTH}
              </div>
            </div>
          </div>
        ) : (
          postUrl && (
            <div className="mt-3 w-full">
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg">
                <Image
                  src={postUrl}
                  alt="Image"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )
        )}
        {!isEditing && (
          <div className="mt-3 text-sm">
            <span>{visibleCaption}</span>
            {isLongCaption && (
              <button
                type="button"
                className="ml-1 font-medium text-[var(--color-muted)]"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? 'less' : 'more'}
              </button>
            )}
          </div>
        )}
        {(isLoadingAvatar || isLoadingPost) && !isEditing && (
          <div className="my-3 flex justify-center">
            <Spinner />
          </div>
        )}
        <div className="mt-2 flex items-center justify-start">
          <div className="flex items-center">
            <ChatIcon
              data-testid="open-comments"
              className="app-icon-accent ml-2 h-6 w-6 cursor-pointer"
              onClick={() => setOpenComments(!openComments)}
            />
            {(commentCount ?? 0) > 0 && (
              <span className="app-icon-accent ml-1 align-text-bottom text-sm">
                {commentCount}
              </span>
            )}
          </div>
        </div>
        {openComments && (
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense
              fallback={
                <div className="flex w-full justify-center">
                  <Spinner />
                </div>
              }
            >
              <div className="flex w-full justify-start">
                <Comments postId={id} />
              </div>
            </Suspense>
          </ErrorBoundary>
        )}
      </li>
    </>
  )
}

export const PostItem = memo(PostItemMemo)
