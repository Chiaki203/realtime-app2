import { FC } from 'react'
import Image from 'next/image'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { useMutateProfile } from '@/hooks/useMutateProfile'
import { useQueryMyNotes } from '@/hooks/useQueryMyNotes'
import { useQueryProfile } from '@/hooks/useQueryProfile'
import { useUploadAvatarImg } from '@/hooks/useUploadAvatarImg'
import useStore from '@/store'
import { MyNoteForm } from './MyNoteForm'
import { MyNoteItem } from './MyNoteItem'
import { Spinner } from './Spinner'

export const UserProfile: FC = () => {
  const session = useStore((state) => state.session)
  const editedProfile = useStore((state) => state.editedProfile)
  const update = useStore((state) => state.updateEditedProfile)
  const { data: profile } = useQueryProfile()
  const { updateProfileMutation } = useMutateProfile()
  const { useMutateUploadAvatarImg } = useUploadAvatarImg()
  const { data: myNotes } = useQueryMyNotes()
  const { fullUrl: avatarUrl, isLoading } = useDownloadUrl(
    editedProfile.avatar_url,
    'avatars'
  )

  const updateProfile = () => {
    updateProfileMutation.mutate({
      id: session?.user?.id,
      username: editedProfile.username,
      favorites: editedProfile.favorites,
      avatar_url: editedProfile.avatar_url,
    })
  }

  return (
    <div className="flex w-full flex-col items-center justify-center pt-4 md:px-4">
      <p className="mb-4 text-lg">Profile</p>
      <p>{profile?.username}</p>
      <label
        htmlFor="avatar"
        className="group relative my-4 h-[140px] w-[140px] cursor-pointer select-none overflow-hidden rounded-full bg-gray-100"
        title="Change avatar"
      >
        <Image
          src={avatarUrl || '/avatar-placeholder.svg'}
          alt="Avatar"
          fill
          sizes="140px"
          className="object-cover"
        />
        <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 text-xs font-medium text-white group-hover:flex">
          Change
        </span>
      </label>
      <input
        className="hidden"
        type="file"
        id="avatar"
        accept="image/*"
        onChange={(e) => useMutateUploadAvatarImg.mutate(e)}
      />
      {isLoading && <Spinner />}
      <p>Username</p>
      <input
        className="app-input my-2 w-[200px]"
        type="text"
        placeholder="Username"
        value={editedProfile.username || ''}
        onChange={(e) =>
          update({
            ...editedProfile,
            username: e.target.value,
          })
        }
      />
      <button
        className="app-button my-2 w-[200px]"
        onClick={updateProfile}
        disabled={updateProfileMutation.isLoading || !editedProfile.username}
      >
        {updateProfileMutation.isLoading ? 'Loading...' : 'Update'}
      </button>
      <div className="app-divider my-3 w-full border border-dashed" />
      <MyNoteForm />
      <ul data-testid="ul-my-note" className="my-2 w-full">
        {myNotes?.map((myNote) => (
          <MyNoteItem
            key={myNote.id}
            id={myNote.id}
            content={myNote.content}
            user_id={myNote.user_id}
          />
        ))}
      </ul>
    </div>
  )
}
