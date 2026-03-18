import { FC, Dispatch, SetStateAction, memo } from 'react'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/solid'
import useStore from '@/store'
import { EditedComment } from '@/types'
import { useQueryAvatar } from '@/hooks/useQueryAvatar'
import { useMutateComment } from '@/hooks/useMutateComment'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { ItemActionMenu } from './ItemActionMenu'

type Props = {
  id: string
  comment: string
  user_id: string | undefined
  setEditedComment: Dispatch<SetStateAction<EditedComment>>
}

export const CommentItemMemo: FC<Props> = ({
  id,
  comment,
  user_id,
  setEditedComment,
}) => {
  const session = useStore((state) => state.session)
  const { data } = useQueryAvatar(user_id)
  const { deleteCommentMutation } = useMutateComment()
  const { fullUrl: avatarUrl } = useDownloadUrl(data?.avatar_url, 'avatars')
  return (
    <li className="mt-3 flex items-start justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-start">
        {avatarUrl ? (
          <div className="relative mt-0.5 h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-100">
            <Image
              src={avatarUrl}
              alt="avatar"
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
        ) : (
          <UserCircleIcon className="app-icon-muted mt-0.5 inline-block h-6 w-6 shrink-0 cursor-pointer" />
        )}
        <div className="ml-2 min-w-0 flex-1 text-sm leading-6">
          <span className="mr-2 font-bold">
            {data?.username || 'Anonymous'}
          </span>
          <span className="whitespace-pre-wrap break-words">{comment}</span>
        </div>
      </div>
      {session?.user?.id === user_id && (
        <div className="shrink-0">
          <ItemActionMenu
            menuTestId="menu-comment"
            editTestId="edit-comment"
            deleteTestId="delete-comment"
            onEdit={() => {
              setEditedComment({ id: id, comment: comment })
            }}
            onDelete={() => {
              deleteCommentMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}

export const CommentItem = memo(CommentItemMemo)
