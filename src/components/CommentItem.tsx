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
    <li className="mt-3 flex items-center justify-between">
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
        <span className="mx-1 text-sm">{comment}</span>
      </div>
      {session?.user?.id === user_id && (
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
      )}
    </li>
  )
}

export const CommentItem = memo(CommentItemMemo)
