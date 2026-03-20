import { FormEvent, FC, useState } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { useMutateAuth } from '@/hooks/useMutateAuth'

export const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  } = useMutateAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      loginMutation.mutate()
    } else {
      registerMutation.mutate()
    }
  }

  return (
    <>
      <ShieldCheckIcon className="app-icon-accent mb-8 h-12 w-12" />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            required
            className="app-input my-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            required
            className="app-input my-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="my-6 flex items-center justify-center text-sm">
          <span
            className="app-link-accent cursor-pointer font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            change mode?
          </span>
        </div>
        <button
          type="submit"
          className="app-button flex w-full justify-center rounded-md px-4 py-2"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    </>
  )
}
