import { FC } from 'react'
import { useQueryNotices } from '@/hooks/useQueryNotices'
import { useSubscribeNotices } from '@/hooks/useSubscribeNotices'
import { NoticeForm } from './NoticeForm'
import { NoticeItem } from './NoticeItem'

export const Notification: FC = () => {
  const { data: notices } = useQueryNotices()

  useSubscribeNotices()

  return (
    <div className="flex w-full flex-col items-center justify-center pt-4 md:px-4">
      <p className="mb-4 text-center text-lg">Notification</p>
      <NoticeForm />
      <ul data-testid="ul-notice" className="my-2 w-full">
        {notices?.map((notice) => (
          <NoticeItem
            key={notice.id}
            id={notice.id}
            content={notice.content}
            user_id={notice.user_id}
          />
        ))}
      </ul>
    </div>
  )
}
