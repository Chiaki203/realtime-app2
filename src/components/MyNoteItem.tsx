import { FC, memo } from 'react'
import { TrashIcon } from '@heroicons/react/solid'
import { MyNote } from '@/types'
import { useMutateMyNote } from '@/hooks/useMutateMyNote'

export const MyNoteItemMemo: FC<Omit<MyNote, 'created_at' | 'updated_at'>> = ({
  id,
  content,
}) => {
  const { deleteMyNoteMutation } = useMutateMyNote()

  return (
    <li className="my-3 flex items-start justify-between gap-3">
      <div className="break-words text-left text-sm">{content}</div>
      <TrashIcon
        data-testid="trash-my-note"
        className="h-5 w-5 shrink-0 cursor-pointer text-blue-500"
        onClick={() => {
          deleteMyNoteMutation.mutate(id)
        }}
      />
    </li>
  )
}

export const MyNoteItem = memo(MyNoteItemMemo)
