import { useEffect, useState } from 'react'
import './App.css'
import { LoginForm } from './components/LoginForm'
import { useAuth } from './hooks/useAuth'

type Display = 'digital' | 'analog'

const hourNames = ['dotze', 'una', 'dues', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'onze']

function catalanTime(date: Date) {
  const hour = date.getHours() % 12
  const nextHour = hourNames[(hour + 1) % 12]
  const minutes = date.getMinutes()

  if (minutes < 8) return `Les ${hourNames[hour]} en punt`
  if (minutes < 23) return `Un quart de ${nextHour}`
  if (minutes < 38) return `Dos quarts de ${nextHour}`
  if (minutes < 53) return `Tres quarts de ${nextHour}`
  return `Falten pocs minuts per les ${nextHour}`
}

function App() {
  const [now, setNow] = useState(() => new Date())
  const [display, setDisplay] = useState<Display>('digital')
  const { session, login, logout } = useAuth()

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (!session) {
    return (
      <main className="page">
        <LoginForm onLogin={login} />
      </main>
    )
  }

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const secondRotation = now.getSeconds() * 6
  const minuteRotation = now.getMinutes() * 6 + now.getSeconds() * 0.1
  const hourRotation = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5

  return (
    <main className="page">
      <section className="clock-card" aria-labelledby="clock-title">
        <div className="session-bar">
          <span>Hola, {session.user.fullName ?? session.user.email}</span>
          <button type="button" className="logout-button" onClick={logout}>
            Tanca sessió
          </button>
        </div>

        <p className="eyebrow">FlowSync</p>
        <h1 id="clock-title">Rellotge</h1>

        <div className="display-switch" aria-label="Format del rellotge">
          <button type="button" aria-pressed={display === 'digital'} onClick={() => setDisplay('digital')}>
            Digital
          </button>
          <button type="button" aria-pressed={display === 'analog'} onClick={() => setDisplay('analog')}>
            Analògic
          </button>
        </div>

        {display === 'digital' ? (
          <time className="digital-clock" dateTime={now.toISOString()}>
            {hours}:{minutes}<span>:{seconds}</span>
          </time>
        ) : (
          <time className="analog-clock" dateTime={now.toISOString()} aria-label={`${hours}:${minutes}`}>
            {[12, 3, 6, 9].map((number) => <span key={number} className={`hour hour-${number}`}>{number}</span>)}
            <span className="hand hour-hand" style={{ transform: `rotate(${hourRotation}deg)` }} />
            <span className="hand minute-hand" style={{ transform: `rotate(${minuteRotation}deg)` }} />
            <span className="hand second-hand" style={{ transform: `rotate(${secondRotation}deg)` }} />
            <span className="clock-pin" />
          </time>
        )}

        <p className="catalan-time" lang="ca">{catalanTime(now)}</p>
      </section>
    </main>
  )
}

export default App
