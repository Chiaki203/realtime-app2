import { FC, ReactNode } from 'react'
import Head from 'next/head'
import { BadgeCheckIcon } from '@heroicons/react/solid'

type Props = {
  title: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ children, title = 'Realtime App' }) => {
  return (
    <div className="flex h-screen flex-col font-mono text-gray-800">
      <Head>
        <title>{title}</title>
      </Head>
      <header></header>
      <main className="flex w-screen min-h-0 flex-1 flex-col items-center justify-center overflow-hidden">
        {children}
      </main>
      <footer className="flex h-12 w-full items-center justify-center border-t">
        <BadgeCheckIcon className="h-6 w-6 text-blue-500" />
      </footer>
    </div>
  )
}
