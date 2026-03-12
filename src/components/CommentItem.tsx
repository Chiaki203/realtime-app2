import { FC, Dispatch, SetStateAction, memo } from 'react'
import Image from 'next/image'
import {
  PencilAltIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/solid'
import useStore from '@/store'
import { EditedComment } from '@/types'
import { useQueryAvatar } from '@/hooks/useQueryAvatar'
import { useMutateComment } from '@/hooks/useMutateComment'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'

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
          <UserCircleIcon className="inline-block h-6 w-6 cursor-pointer text-gray-500" />
        )}
        <span className="mx-1 text-sm">{comment}</span>
      </div>
      {session?.user?.id === user_id && (
        <div className="flex">
          <PencilAltIcon
            data-testid="pencil-comment"
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              setEditedComment({ id: id, comment: comment })
            }}
          />
          <TrashIcon
            data-testid="trash-comment"
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              deleteCommentMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}

export const CommentItem = memo(CommentItemMemo)
