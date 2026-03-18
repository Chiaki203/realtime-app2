import { FC, ReactNode } from 'react'
import Head from 'next/head'
import { Header } from './Header'
type Props = {
  title: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ children, title = 'Realtime App' }) => {
  return (
    <div className="flex min-h-[100dvh] overflow-x-hidden flex-col font-mono text-gray-800 md:h-screen">
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
      {/* <footer className="flex h-12 w-full items-center justify-center border-t">
        <BadgeCheckIcon className="h-6 w-6 text-blue-500" />
      </footer> */}
    </div>
  )
}
