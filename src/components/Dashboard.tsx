import { FC, Suspense } from 'react'
import { useQueryClient } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { LogoutIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { supabase } from '@/utils/supabase'
import useStore from '@/store'
import { Spinner } from './Spinner'
import { UserProfile } from './UserProfile'
import { Notification } from './Notification'
import { Feed } from './Feed'

export const Dashboard: FC = () => {
  const queryClient = useQueryClient()
  const resetProfile = useStore((state) => state.resetEditedProfile)
  const resetNotice = useStore((state) => state.resetEditedNotice)
  const resetPost = useStore((state) => state.resetEditedPost)
  const editedProfile = useStore((state) => state.editedProfile)
  const editedNotice = useStore((state) => state.editedNotice)
  // console.log('editedProfile', editedProfile)
  // console.log('editedNotice', editedNotice)
  const signOut = async () => {
    resetProfile()
    resetNotice()
    resetPost()
    await supabase.auth.signOut()
    queryClient.removeQueries(['profile'])
    queryClient.removeQueries(['notices'])
    queryClient.removeQueries(['posts'])
  }
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center justify-end px-6 py-4">
        <LogoutIcon
          data-testid="logout"
          className="h-6 w-6 cursor-pointer text-blue-500"
          onClick={signOut}
        />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-6 overflow-hidden px-6 pb-6">
        <div className="flex min-h-0 flex-col items-center overflow-y-auto">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <UserProfile />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="flex min-h-0 flex-col items-center overflow-y-auto">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <Feed />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="flex min-h-0 flex-col items-center overflow-y-auto">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <Notification />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
