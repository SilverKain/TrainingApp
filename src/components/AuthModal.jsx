import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

// ─── Иконка Google ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// ─── Локализация ошибок Firebase ──────────────────────────────────────────────
function firebaseErrorMsg(code) {
  const map = {
    'auth/email-already-in-use': 'Этот email уже зарегистрирован',
    'auth/invalid-email':        'Некорректный email',
    'auth/weak-password':        'Пароль должен содержать минимум 6 символов',
    'auth/user-not-found':       'Пользователь не найден',
    'auth/wrong-password':       'Неверный пароль',
    'auth/invalid-credential':   'Неверный email или пароль',
    'auth/too-many-requests':    'Слишком много попыток. Попробуйте позже',
    'auth/popup-closed-by-user': 'Вход через Google отменён',
    'auth/network-request-failed': 'Ошибка сети. Проверьте подключение',
  }
  return map[code] ?? 'Произошла ошибка. Попробуйте снова'
}

// ─── Основной компонент ───────────────────────────────────────────────────────
export default function AuthModal({ onClose }) {
  const { signUp, logIn, logInWithGoogle } = useAuth()

  const [mode, setMode]           = useState('login') // 'login' | 'register'
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [showPass, setShowPass]   = useState(false)

  function reset() {
    setError(''); setName(''); setEmail(''); setPassword('')
  }

  function switchMode(m) {
    reset(); setMode(m)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      if (mode === 'register') {
        await signUp(email, password, name.trim() || undefined)
      } else {
        await logIn(email, password)
      }
      onClose()
    } catch (err) {
      setError(firebaseErrorMsg(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(''); setLoading(true)
    try {
      await logInWithGoogle()
      onClose()
    } catch (err) {
      setError(firebaseErrorMsg(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* ── Card ── */}
      <div
        className="w-full max-w-sm rounded-2xl p-6 sm:p-8 flex flex-col gap-5 relative"
        style={{
          background: 'rgba(26, 34, 53, 0.98)',
          border: '1px solid rgba(180,200,230,0.15)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors text-lg"
          aria-label="Закрыть"
        >
          ×
        </button>

        {/* Logo + Title */}
        <div className="text-center">
          <div className="text-3xl mb-2">💪</div>
          <h2 className="text-xl font-black text-slate-100">
            {mode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login'
              ? 'Войдите, чтобы синхронизировать прогресс'
              : 'Сохраняйте прогресс в облаке'}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-semibold text-sm text-slate-200 transition-all active:scale-95 disabled:opacity-50"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <GoogleIcon />
          Войти через Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(180,200,230,0.12)' }} />
          <span className="text-xs text-slate-600">или</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(180,200,230,0.12)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(180,200,230,0.15)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(160,185,215,0.5)'}
              onBlur={e => e.target.style.borderColor  = 'rgba(180,200,230,0.15)'}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(180,200,230,0.15)',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(160,185,215,0.5)'}
            onBlur={e => e.target.style.borderColor  = 'rgba(180,200,230,0.15)'}
          />

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Пароль"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-slate-200 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(180,200,230,0.15)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(160,185,215,0.5)'}
              onBlur={e => e.target.style.borderColor  = 'rgba(180,200,230,0.15)'}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs select-none"
              tabIndex={-1}
            >
              {showPass ? '🙈' : '👁'}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-xs bg-red-900/20 rounded-xl px-3 py-2.5"
                 style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="mt-px">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-slate-900 transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
            style={{
              background: loading
                ? 'rgba(180,200,230,0.4)'
                : 'linear-gradient(135deg, #c8d8e8 0%, #edf2f7 50%, #a0b8cc 100%)',
            }}
          >
            {loading
              ? '⏳ Загрузка...'
              : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-xs text-slate-500">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="text-slate-300 font-semibold hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            {mode === 'login' ? 'Создать' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  )
}
