import { LogoutIcon } from '@heroicons/react/solid'
import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { useQueryClient } from 'react-query'

export const Header = () => {
  const queryClient = useQueryClient()
  const resetProfile = useStore((state) => state.resetEditedProfile)
  const resetNotice = useStore((state) => state.resetEditedNotice)
  const resetPost = useStore((state) => state.resetEditedPost)
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
    <header className="flex items-center justify-between bg-gray-200 px-12 py-4">
      <p>Workspace</p>
      <LogoutIcon
        data-testid="logout"
        className="h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
    </header>
  )
}
