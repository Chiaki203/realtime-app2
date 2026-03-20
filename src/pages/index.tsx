import type { NextPage } from 'next'
import { useEffect } from 'react'
import { Auth } from '@/components/Auth'
import { Dashboard } from '@/components/Dashboard'
import { Layout } from '@/components/Layout'
import useStore from '@/store'
import { supabase } from '@/utils/supabase'

const Home: NextPage = () => {
  const { session } = useStore()
  const setSession = useStore((state) => state.setSession)

  useEffect(() => {
    const setCurrentSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.access_token) {
        supabase.realtime.setAuth(data.session.access_token)
      }
      setSession(data.session)
    }

    setCurrentSession()

    supabase.auth.onAuthStateChange((_, session) => {
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token)
      }
      setSession(session)
    })
  }, [setSession])

  return (
    <Layout title="Dashboard">
      {!session ? <Auth /> : <Dashboard />}
    </Layout>
  )
}

export default Home
