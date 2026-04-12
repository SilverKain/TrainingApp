import { useState, useEffect, useRef } from 'react'
import { AuthProvider }    from './context/AuthContext.jsx'
import { WorkoutProvider } from './context/WorkoutContext.jsx'
import Navbar from './components/Navbar.jsx'
import Landing from './components/Landing.jsx'
import TodayPage from './components/TodayPage.jsx'
import WorkoutSession from './components/WorkoutSession.jsx'
import WorkoutList from './components/WorkoutList.jsx'
import Progress from './components/Progress.jsx'
import CreateWorkout from './components/CreateWorkout.jsx'
import Theory from './components/Theory.jsx'

function ConfirmExitModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: '#1a2235', border: '1px solid rgba(200,215,235,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <p className="text-sm font-bold text-slate-200">Выйти из тренировки?</p>
        <p className="text-xs text-slate-500">Прогресс не будет сохранён.</p>
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-xl text-sm font-bold border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
            onClick={onCancel}
          >
            Остаться
          </button>
          <button
            className="flex-1 py-2 rounded-xl text-sm font-bold bg-red-900 text-red-200 border border-red-800 hover:bg-red-800 transition-all"
            onClick={onConfirm}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const [page, setPage] = useState('home')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const pendingPage = useRef(null)

  const isWorkoutActive = activeWorkout !== null

  // beforeunload — подтверждение при закрытии/обновлении вкладки
  useEffect(() => {
    if (!isWorkoutActive) return
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isWorkoutActive])

  function handleNavigate(p) {
    if (!isWorkoutActive) {
      setPage(p)
      return
    }
    // Тренировка активна — показываем подтверждение
    pendingPage.current = p
    setShowExitConfirm(true)
  }

  function confirmExit() {
    setShowExitConfirm(false)
    setActiveWorkout(null)
    if (pendingPage.current) {
      setPage(pendingPage.current)
      pendingPage.current = null
    }
  }

  function cancelExit() {
    setShowExitConfirm(false)
    pendingPage.current = null
  }

  function handleStartWorkout(workout) {
    setActiveWorkout(workout)
    setPage('session')
  }

  function handleSessionFinish() {
    setActiveWorkout(null)
    setPage('progress')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a2235' }}>
      <Navbar page={page} onNavigate={handleNavigate} />

      {showExitConfirm && (
        <ConfirmExitModal onConfirm={confirmExit} onCancel={cancelExit} />
      )}

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24 sm:pb-6">

        {page === 'home' && (
          <Landing onNavigate={handleNavigate} />
        )}

        {page === 'today' && (
          <TodayPage onStartWorkout={handleStartWorkout} />
        )}

        {page === 'session' && activeWorkout && (
          <WorkoutSession workout={activeWorkout} onFinish={handleSessionFinish} onCancel={() => handleNavigate('home')} />
        )}

        {page === 'theory' && (
          <Theory />
        )}

        {page === 'workouts' && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">📋 База упражнений</h1>
            <WorkoutList
              onStartWorkout={handleStartWorkout}
              onCreateWorkout={() => handleNavigate('create')}
            />
          </div>
        )}

        {page === 'progress' && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">📈 Прогресс</h1>
            <Progress />
          </div>
        )}

        {page === 'create' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate('workouts')}
                className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
              >
                ← Назад
              </button>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">➕ Новая тренировка</h1>
            </div>
            <CreateWorkout onCreated={() => handleNavigate('workouts')} />
          </div>
        )}

      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <AppContent />
      </WorkoutProvider>
    </AuthProvider>
  )
}
