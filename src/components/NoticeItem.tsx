import { FC, memo } from 'react'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/solid'
import useStore from '@/store'
import { Notice } from '@/types'
import { useMutateNotice } from '@/hooks/useMutateNotice'
import { useQueryAvatar } from '@/hooks/useQueryAvatar'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { ItemActionMenu } from './ItemActionMenu'

export const NoticeItemMemo: FC<Omit<Notice, 'created_at'>> = ({
  id,
  content,
  user_id,
}) => {
  const session = useStore((sta) => sta.session)
  const update = useStore((state) => state.updateEditedNotice)
  const { deleteNoticeMutation } = useMutateNotice()
  const { data } = useQueryAvatar(user_id)
  const { fullUrl: avatarUrl } = useDownloadUrl(data?.avatar_url, 'avatars')
  return (
    <li className="my-3">
      <div className="mb-2 flex items-center justify-between">
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
            {data?.username || 'Anonymous'}
          </span>
        </div>
        {session?.user?.id === user_id && (
          <ItemActionMenu
            menuTestId="menu-notice"
            editTestId="edit-notice"
            deleteTestId="delete-notice"
            onEdit={() => {
              update({
                id: id,
                content: content,
              })
            }}
            onDelete={() => {
              deleteNoticeMutation.mutate(id)
            }}
          />
        )}
      </div>
      <div className="text-sm">{content}</div>
    </li>
  )
}

export const NoticeItem = memo(NoticeItemMemo)
