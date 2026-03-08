import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'

const WEEKDAYS_FULL = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

const MENU = [
  {
    key: 'today',
    icon: '🏋️',
    label: 'Начать тренировку',
    sub: 'Выполнить сегодня',
    gradient: 'from-slate-700/60 to-slate-600/40',
    accent: '#b0c4d8',
    glow: 'rgba(160,185,210,0.22)',
  },
  {
    key: 'theory',
    icon: '📚',
    label: 'Теория',
    sub: 'Принципы тренировок',
    gradient: 'from-slate-800/60 to-slate-700/40',
    accent: '#9ab0c8',
    glow: 'rgba(130,165,200,0.15)',
  },
  {
    key: 'workouts',
    icon: '📋',
    label: 'База упражнений',
    sub: 'Ваши тренировки',
    gradient: 'from-slate-800/60 to-slate-700/40',
    accent: '#9ab0c8',
    glow: 'rgba(130,165,200,0.15)',
  },
  {
    key: 'progress',
    icon: '📈',
    label: 'Прогресс',
    sub: 'Статистика и результаты',
    gradient: 'from-slate-800/60 to-slate-700/40',
    accent: '#9ab0c8',
    glow: 'rgba(130,165,200,0.15)',
  },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Доброе утро'
  if (h >= 12 && h < 17) return 'Добрый день'
  if (h >= 17 && h < 22) return 'Добрый вечер'
  return 'Доброй ночи'
}

export default function Landing({ setPage }) {
  const { user, logOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const today = new Date()
  const dayStr = `${WEEKDAYS_FULL[today.getDay()]}, ${today.getDate()} ${MONTHS_GEN[today.getMonth()]}`

  const userName = user?.displayName || user?.email?.split('@')[0] || null

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8 px-4">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Приветствие */}
      <div className="text-center mb-10 mt-4">
        <p className="text-slate-500 text-sm tracking-widest uppercase mb-2">{dayStr}</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3" style={{
          background: 'linear-gradient(135deg, #c8d8e8 0%, #edf2f7 50%, #a0b8cc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {getGreeting()}{userName ? `, ${userName}` : ''}! 👋
        </h1>
        <p className="text-slate-400 text-base max-w-xs mx-auto leading-relaxed">
          Готовы к тренировке? Отслеживайте прогресс и достигайте целей.
        </p>
      </div>

      {/* Блок авторизации */}
      {user ? (
        /* Залогинен */
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6 w-full max-w-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(180,200,230,0.12)',
          }}
        >
          {/* Аватар */}
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base font-bold text-slate-900"
                 style={{ background: 'linear-gradient(135deg, #c8d8e8 0%, #a0b8cc 100%)' }}>
              {(userName ?? '?')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-semibold truncate">{userName}</p>
            <p className="text-slate-500 text-xs truncate">{user.email}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full"
                  style={{ border: '1px solid rgba(52,211,153,0.2)' }}>
              ✓ Синхронизировано
            </span>
            <span className="sm:hidden inline-flex items-center justify-center w-6 h-6 text-xs text-emerald-400 bg-emerald-900/30 rounded-full"
                  style={{ border: '1px solid rgba(52,211,153,0.2)' }}>
              ✓
            </span>
            <button
              onClick={logOut}
              className="ml-1 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-slate-700/50"
            >
              Выйти
            </button>
          </div>
        </div>
      ) : (
        /* Не залогинен */
        <button
          onClick={() => setShowAuth(true)}
          className="flex items-center gap-2.5 rounded-2xl px-5 py-3.5 mb-6 w-full max-w-xl transition-all active:scale-[0.98] hover:-translate-y-0.5"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(180,200,230,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <span className="text-xl">🔐</span>
          <div className="text-left flex-1">
            <p className="text-slate-200 text-sm font-semibold">Войти в аккаунт</p>
            <p className="text-slate-500 text-xs">Синхронизировать прогресс в облаке</p>
          </div>
          <span className="text-slate-600 text-lg">›</span>
        </button>
      )}

      {/* Декоративная линия */}
      <div className="w-16 h-px mb-10" style={{
        background: 'linear-gradient(90deg, transparent, rgba(180,200,220,0.4), transparent)',
      }} />

      {/* Кнопки меню */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {MENU.map((item, i) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${item.gradient}`}
            style={{
              border: '1px solid rgba(200,215,230,0.12)',
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${item.glow}, 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)` }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)` }}
          >
            {/* Фоновый блик */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle, ${item.accent}, transparent)` }} />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-slate-100 text-base leading-tight">{item.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
              </div>
              <div className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors text-lg">›</div>
            </div>
          </button>
        ))}
      </div>

      {/* Нижний декор */}
      <div className="mt-12 text-slate-700 text-xs tracking-widest">
        FITTRACKER
      </div>
    </div>
  )
}
