import { FC, useState, Suspense, memo } from 'react'
import Image from 'next/image'
import {
  ExclamationCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/solid'
import { ChatIcon } from '@heroicons/react/outline'
import { ErrorBoundary } from 'react-error-boundary'
import { Spinner } from './Spinner'
import useStore from '@/store'
import { Post } from '@/types'
import { useMutatePost } from '@/hooks/useMutatePost'
import { useQueryCommentCount } from '@/hooks/useQueryCommentCount'
import { useQueryAvatar } from '@/hooks/useQueryAvatar'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { Comments } from './Comments'
import { ItemActionMenu } from './ItemActionMenu'

export const PostItemMemo: FC<Omit<Post, 'created_at'>> = ({
  id,
  title,
  post_url,
  user_id,
}) => {
  const [openComments, setOpenComments] = useState(false)
  const session = useStore((state) => state.session)
  const update = useStore((state) => state.updateEditedPost)
  const { data } = useQueryAvatar(user_id)
  const { deletePostMutation } = useMutatePost()
  const { data: commentCount } = useQueryCommentCount(id)
  const { fullUrl: avatarUrl, isLoading: isLoadingAvatar } = useDownloadUrl(
    data?.avatar_url,
    'avatars'
  )
  const { fullUrl: postUrl, isLoading: isLoadingPost } = useDownloadUrl(
    post_url,
    'posts'
  )
  return (
    <>
      <li className="w-full">
        <div className="app-divider my-5 w-full border border-dashed" />
        <div className="flex items-center justify-between">
          <div className="flex">
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
            <span className="ml-2 font-bold">{title}</span>
          </div>
          {session?.user?.id === user_id && (
            <div className="pr-2">
              <ItemActionMenu
                menuTestId="menu-post"
                editTestId="edit-post"
                deleteTestId="delete-post"
                onEdit={() => {
                  update({
                    id: id,
                    title: title,
                    post_url: post_url,
                  })
                }}
                onDelete={() => {
                  deletePostMutation.mutate(id)
                }}
              />
            </div>
          )}
        </div>
        {postUrl && (
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
        )}
        {(isLoadingAvatar || isLoadingPost) && (
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
