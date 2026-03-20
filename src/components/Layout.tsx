import { FC, ReactNode } from 'react'
import Head from 'next/head'
import { Header } from './Header'

type Props = {
  title: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ children, title = 'Realtime App' }) => {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden text-gray-800 md:h-screen">
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <Header />
      <main className="flex min-h-0 w-full flex-1 flex-col items-center justify-start overflow-x-hidden overflow-y-auto md:justify-center md:overflow-hidden">
        {children}
      </main>
    </div>
  )
}
