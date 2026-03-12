import { FC } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import useStore from '@/store'
import { useQueryProfile } from '@/hooks/useQueryProfile'
import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { useUploadAvatarImg } from '@/hooks/useUploadAvatarImg'
import { Spinner } from './Spinner'
import { useMutateProfile } from '@/hooks/useMutateProfile'

export const UserProfile: FC = () => {
  const session = useStore((state) => state.session)
  const editedProfile = useStore((state) => state.editedProfile)
  const update = useStore((state) => state.updateEditedProfile)
  const { data: profile } = useQueryProfile()
  const { updateProfileMutation } = useMutateProfile()
  const { useMutateUploadAvatarImg } = useUploadAvatarImg()
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
  // if (profile?.created_at) {
  //   console.log('profile?.created_at', profile.created_at)
  //   console.log('new Date(profile.created_at)', new Date(profile.created_at))
  // }
  return (
    <div className="flex w-full flex-col items-center justify-center px-8 pt-4">
      <p className="mb-4 ">Profile</p>
      <p>{profile?.username}</p>
      {/* {profile?.created_at && (
        <p className="my-1 text-sm">
          {format(new Date(profile.created_at), 'yyyy-MM-dd HH:mm:ss')}
        </p>
      )}
      {profile?.updated_at && (
        <p className="text-sm">
          {format(new Date(profile.updated_at), 'yyyy-MM-dd HH:mm:ss')}
        </p>
      )} */}
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
      <p className="">Username</p>
      <input
        className="mx-2 my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
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
      {/* <p>Favorites</p>
      <input
        className="mx-2 my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
        type="text"
        value={editedProfile.favorites || ''}
        onChange={(e) =>
          update({
            ...editedProfile,
            favorites: e.target.value,
          })
        }
      /> */}
      <button
        className={`my-2 rounded px-3 py-2 text-sm font-medium text-white ${
          updateProfileMutation.isLoading || !editedProfile.username
            ? 'bg-gray-400'
            : 'bg-indigo-600'
        }`}
        onClick={updateProfile}
        disabled={updateProfileMutation.isLoading || !editedProfile.username}
      >
        {updateProfileMutation.isLoading ? 'Loading...' : 'Update'}
      </button>
      <div className="my-3 w-full border border-dashed border-gray-400" />
    </div>
  )
}
