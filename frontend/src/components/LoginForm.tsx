import { useState } from 'react'
import type { FormEvent } from 'react'
import { LoginError } from '../lib/auth'

type LoginFormProps = {
  onLogin: (email: string, password: string) => Promise<void>
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err instanceof LoginError ? err.message : 'Hi ha hagut un error inesperat.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-card" aria-labelledby="login-title">
      <p className="eyebrow">FlowSync</p>
      <h1 id="login-title">Inicia sessió</h1>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Correu electrònic</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Contrasenya</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? (
          <p className="login-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciant sessió…' : 'Inicia sessió'}
        </button>
      </form>
    </section>
  )
}
