const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api/v1'

export type AuthUser = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
  initials: string
}

export type AuthSession = {
  user: AuthUser
  token: string
}

export class LoginError extends Error {}

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = body?.errors?.[0]?.message ?? 'No s’ha pogut iniciar la sessió.'
    throw new LoginError(message)
  }

  return body.data as AuthSession
}
