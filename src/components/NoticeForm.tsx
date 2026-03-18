import { FormEvent, FC, memo } from 'react'
import useStore from '@/store'
import { useMutateNotice } from '@/hooks/useMutateNotice'

export const NoticeFormMemo: FC = () => {
  const session = useStore((state) => state.session)
  // console.log('noticeForm session', session)
  // const {editedNotice} = useStore()
  const editedNotice = useStore((state) => state.editedNotice)
  const update = useStore((state) => state.updateEditedNotice)
  const { createNoticeMutation, updateNoticeMutation } = useMutateNotice()
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedNotice.id === '') {
      createNoticeMutation.mutate({
        content: editedNotice.content,
        user_id: session?.user?.id,
      })
    } else {
      updateNoticeMutation.mutate({
        id: editedNotice.id,
        content: editedNotice.content,
      })
    }
  }
  return (
    <form className=" w-full " onSubmit={submitHandler}>
      <input
        type="text"
        className="app-input my-1 w-full"
        placeholder="New Notice"
        value={editedNotice.content}
        onChange={(e) => update({ ...editedNotice, content: e.target.value })}
      />
      <div className="my-3 flex w-full justify-center">
        <button
          type="submit"
          data-testid="btn-notice"
          className="app-button w-full"
          disabled={!editedNotice.content}
        >
          {editedNotice.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

export const NoticeForm = memo(NoticeFormMemo)
