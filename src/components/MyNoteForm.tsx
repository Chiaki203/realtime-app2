import { FC, FormEvent, memo, useState } from 'react'
import useStore from '@/store'
import { useMutateMyNote } from '@/hooks/useMutateMyNote'

export const MyNoteFormMemo: FC = () => {
  const session = useStore((state) => state.session)
  const [note, setNote] = useState('')
  const { createMyNoteMutation } = useMutateMyNote()

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createMyNoteMutation.mutateAsync({
      content: note,
      user_id: session?.user?.id,
    })
    setNote('')
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p className="mb-4 text-center">My Notes</p>
      <form className="w-full" onSubmit={submitHandler}>
        <input
          type="text"
          className="my-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          placeholder="New Note?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </form>
    </div>
  )
}

export const MyNoteForm = memo(MyNoteFormMemo)
