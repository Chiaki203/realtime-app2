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
    <header className="app-header flex items-center justify-between px-4 py-4 md:px-10">
      <p className="text-lg font-medium">Workspace</p>
      <LogoutIcon
        data-testid="logout"
        className="app-icon-accent h-5 w-5 cursor-pointer"
        onClick={signOut}
      />
    </header>
  )
}
