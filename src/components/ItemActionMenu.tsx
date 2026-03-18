import { FC, useEffect, useRef, useState } from 'react'
import { DotsHorizontalIcon } from '@heroicons/react/solid'

type Props = {
  onEdit: () => void
  onDelete: () => void
  menuTestId: string
  editTestId: string
  deleteTestId: string
}

export const ItemActionMenu: FC<Props> = ({
  onEdit,
  onDelete,
  menuTestId,
  editTestId,
  deleteTestId,
}) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        data-testid={menuTestId}
        className="app-icon-accent rounded-full p-1 transition hover:bg-[var(--color-menu-hover)]"
        onClick={() => setOpen((prev) => !prev)}
      >
        <DotsHorizontalIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="app-menu absolute right-0 top-8 z-10 min-w-[96px] rounded-md border py-1 shadow-lg">
          <button
            type="button"
            data-testid={editTestId}
            className="app-menu-item block w-full px-3 py-2 text-left text-sm"
            onClick={() => {
              onEdit()
              setOpen(false)
            }}
          >
            Edit
          </button>
          <button
            type="button"
            data-testid={deleteTestId}
            className="app-menu-item app-menu-item-danger block w-full px-3 py-2 text-left text-sm"
            onClick={() => {
              onDelete()
              setOpen(false)
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
