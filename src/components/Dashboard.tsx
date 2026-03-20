import { FC, ReactNode, Suspense, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { ErrorBoundary } from 'react-error-boundary'
import { Feed } from './Feed'
import { Notification } from './Notification'
import { Spinner } from './Spinner'
import { UserProfile } from './UserProfile'

type TabKey = 'Profile' | 'Feed' | 'Notification'

const DashboardBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
      }
    >
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

const DashboardPanel: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-y-auto">
      <DashboardBoundary>{children}</DashboardBoundary>
    </div>
  )
}

export const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('Feed')

  return (
    <div className="flex w-full flex-col md:h-full md:min-h-0">
      <div className="md:hidden">
        <div role="tablist" aria-label="Dashboard tabs">
          <div className="app-divider flex w-full min-w-0 overflow-hidden bg-white/80 backdrop-blur">
            {(['Profile', 'Feed', 'Notification'] as const).map((tab) => {
              const isActive = tab === activeTab
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className={`app-tab min-w-0 flex-1 truncate px-2 py-2 text-sm font-medium transition ${
                    isActive ? 'app-tab-active shadow-sm' : ''
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 pt-4 sm:px-6 md:hidden">
        <DashboardBoundary>
          {activeTab === 'Profile' && <UserProfile />}
          {activeTab === 'Feed' && <Feed />}
          {activeTab === 'Notification' && <Notification />}
        </DashboardBoundary>
      </div>

      <div className="hidden min-h-0 flex-1 grid-cols-[2fr_3fr_2fr] gap-6 overflow-hidden px-6 md:grid">
        <DashboardPanel>
          <UserProfile />
        </DashboardPanel>
        <DashboardPanel>
          <Feed />
        </DashboardPanel>
        <DashboardPanel>
          <Notification />
        </DashboardPanel>
      </div>
    </div>
  )
}
