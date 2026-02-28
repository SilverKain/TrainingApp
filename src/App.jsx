import { useState } from 'react'
import { WorkoutProvider } from './context/WorkoutContext.jsx'
import Navbar from './components/Navbar.jsx'
import Landing from './components/Landing.jsx'
import TodayPage from './components/TodayPage.jsx'
import WorkoutSession from './components/WorkoutSession.jsx'
import WorkoutList from './components/WorkoutList.jsx'
import Progress from './components/Progress.jsx'
import CreateWorkout from './components/CreateWorkout.jsx'
import Theory from './components/Theory.jsx'

function AppContent() {
  const [page, setPage] = useState('home')
  const [activeWorkout, setActiveWorkout] = useState(null)

  function handleStartWorkout(workout) {
    setActiveWorkout(workout)
    setPage('session')
  }

  function handleSessionFinish() {
    setActiveWorkout(null)
    setPage('progress')
  }

  function navigate(p) {
    setPage(p)
    if (p !== 'session') setActiveWorkout(null)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a2235' }}>
      <Navbar page={page} setPage={navigate} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24 sm:pb-6">

        {page === 'home' && (
          <Landing setPage={navigate} />
        )}

        {page === 'today' && (
          <TodayPage onStartWorkout={handleStartWorkout} />
        )}

        {page === 'session' && activeWorkout && (
          <WorkoutSession workout={activeWorkout} onFinish={handleSessionFinish} />
        )}

        {page === 'theory' && (
          <Theory />
        )}

        {page === 'workouts' && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">📋 База упражнений</h1>
            <WorkoutList
              onStartWorkout={handleStartWorkout}
              onCreateWorkout={() => navigate('create')}
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
                onClick={() => navigate('workouts')}
                className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
              >
                ← Назад
              </button>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">➕ Новая тренировка</h1>
            </div>
            <CreateWorkout onCreated={() => navigate('workouts')} />
          </div>
        )}

      </main>
    </div>
  )
}

export default function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  )
}
