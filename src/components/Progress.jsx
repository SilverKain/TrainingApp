import { useWorkouts } from '../context/WorkoutContext.jsx'

function formatDuration(sec) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60), s = sec % 60
  if (m === 0) return `${s} сек`
  return `${m} мин${s > 0 ? ` ${s} сек` : ''}`
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl p-5 text-center"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(200,215,230,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
      <div className="text-2xl font-black mb-1" style={{
        background: 'linear-gradient(135deg, #b0c4d8 0%, #e2eaf2 60%, #8fa3ba 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {value}
      </div>
      <div className="text-xs text-slate-600 uppercase tracking-widest">{label}</div>
    </div>
  )
}

function WeeklyBar({ sessions }) {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const counts = Array(7).fill(0)
  const today = new Date()
  const todayDay = (today.getDay() + 6) % 7

  sessions.forEach(s => {
    const diff = Math.round((today - new Date(s.date)) / 86400000)
    if (diff >= 0 && diff < 7) counts[(todayDay - diff + 7) % 7]++
  })

  const max = Math.max(...counts, 1)

  return (
    <div className="card">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Активность за 7 дней</h3>
      <div className="flex items-end gap-2 h-28">
        {days.map((day, i) => {
          const isRest = counts[i] === 0
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              {isRest ? (
                <div className="w-full flex flex-col items-center justify-end" style={{ height: '80px' }}>
                  <div className="w-full rounded-t-md"
                    style={{
                      height: '32px',
                      background: 'rgba(100,200,140,0.07)',
                      border: '1px dashed rgba(100,200,140,0.18)',
                      borderBottom: 'none',
                    }}
                  />
                </div>
              ) : (
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${(counts[i] / max) * 80}px`,
                    minHeight: '4px',
                    background: 'linear-gradient(180deg, #b8cad9 0%, #7a8fa6 100%)',
                  }}
                />
              )}
              <span className={`text-xs ${isRest ? 'text-emerald-800' : 'text-slate-700'}`}>
                {isRest ? '🌱' : day}
              </span>
              {!isRest && (
                <span className="text-[9px] text-slate-700 -mt-0.5">{day}</span>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/50">
        <span className="text-[10px] text-slate-600 flex items-center gap-1">
          <span className="inline-block w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg,#b8cad9,#7a8fa6)' }} /> Тренировка
        </span>
        <span className="text-[10px] text-emerald-800 flex items-center gap-1">
          🌱 День отдыха
        </span>
      </div>
    </div>
  )
}

export default function Progress() {
  const { sessions, deleteSession } = useWorkouts()

  const totalTime = sessions.reduce((acc, s) => acc + (s.duration || 0), 0)
  const avgTime = sessions.length ? Math.round(totalTime / sessions.length) : 0
  const totalExercises = sessions.reduce((acc, s) => acc + (s.exerciseCount || 0), 0)

  const counts = {}
  sessions.forEach(s => { counts[s.workoutName] = (counts[s.workoutName] || 0) + 1 })
  const topWorkout = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="flex flex-col gap-5">
      {/* Сводка */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard value={sessions.length} label="Тренировок" />
        <StatCard value={totalExercises || '—'} label="Упражнений всего" />
        <StatCard value={formatDuration(totalTime)} label="Общее время" />
        <StatCard value={formatDuration(avgTime)} label="Среднее" />
      </div>

      {topWorkout && (
        <div className="card flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-widest">Любимая тренировка</p>
            <p className="font-bold text-slate-200 mt-0.5">{topWorkout[0]}</p>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{topWorkout[1]} раз</p>
          </div>
        </div>
      )}

      <WeeklyBar sessions={sessions} />

      {/* История */}
      <div className="card">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">История тренировок</h3>
        {sessions.length === 0 ? (
          <div className="text-center text-slate-700 py-8">
            <div className="text-3xl mb-2">📋</div>
            <p>Нет записей. Начните тренироваться!</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800/50">
            {sessions.map(s => (
              <li key={s.id} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-200 text-sm">{s.workoutName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-600">{formatDate(s.date)}</p>
                    {s.exerciseCount != null && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(120,160,195,0.15)', color: '#94a3b8', border: '1px solid rgba(120,160,195,0.2)' }}>
                        {s.exerciseCount} упр.
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>{formatDuration(s.duration)}</span>
                  <button
                    onClick={() => deleteSession(s.id)}
                    className="text-slate-700 hover:text-red-400 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
