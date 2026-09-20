import { useCallback, useState } from 'react'
import type { AuthSession } from '../lib/auth'
import { login as loginRequest } from '../lib/auth'

const STORAGE_KEY = 'flowsync.session'

function readStoredSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession())

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await loginRequest(email, password)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  return { session, login, logout }
}
