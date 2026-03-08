import React, { useState, useEffect, useRef } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'

function exImg(image) {
  if (!image) return null
  return `${import.meta.env.BASE_URL}exercises/${image}`
}

function pad(n) { return String(n).padStart(2, '0') }
function fmtTotal(sec) {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${pad(m)}:${pad(s)}`
}

/** Таймер обратного отсчёта (для подхода или отдыха) */
function CircleTimer({ total, onDone, color = '#94a3b8', label = 'сек', onSkip }) {
  const [left, setLeft] = useState(total)
  const ref = useRef(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setLeft(l => {
        if (l <= 1) { clearInterval(ref.current); onDone(); return 0 }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])

  const pct = ((total - left) / total) * 100
  const r = 36, circ = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-1 my-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={left <= 5 ? '#f87171' : color}
            strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-2xl leading-none ${left <= 5 ? 'text-red-400' : 'text-slate-100'}`}>
            {left}
          </span>
          <span className="text-slate-500 text-xs mt-0.5">{label}</span>
        </div>
      </div>
      {onSkip && (
        <button
          onClick={() => { clearInterval(ref.current); onSkip() }}
          className="px-4 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500 mt-1"
        >
          Пропустить →
        </button>
      )}
    </div>
  )
}

/** Модальное окно с деталями упражнения */
function ExerciseInfoModal({ exercise, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
        style={{ background: '#1a2235', border: '1px solid rgba(200,215,235,0.12)', maxHeight: '85dvh' }}
        onClick={e => e.stopPropagation()}>

        {/* Изображение упражнения */}
        {exImg(exercise.image) && (
          <div className="w-full flex-shrink-0" style={{ height: '180px', background: 'rgba(0,0,0,0.4)' }}>
            <img src={exImg(exercise.image)} alt={exercise.name} className="w-full h-full object-cover object-center" />
          </div>
        )}

        <div className="p-5 pb-7 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            {exercise.category && (
              <p className="text-xs text-slate-500 mb-1">{exercise.category}</p>
            )}
            <h2 className="text-xl font-black text-slate-100 leading-tight">{exercise.name}</h2>
            {exercise.muscles && (
              <p className="text-xs text-slate-500 mt-1 leading-snug">{exercise.muscles}</p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 text-xl leading-none flex-shrink-0 mt-1">✕</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge bg-slate-800 border border-slate-700 text-slate-300 text-xs">
            📋 {exercise.sets} подх. × {exercise.duration != null ? `${exercise.duration} сек` : `${exercise.reps} повт.`}
          </span>
          {exercise.restSeconds != null && (
            <span className="badge bg-slate-800 border border-slate-700 text-slate-400 text-xs">⏸ Отдых: {exercise.restSeconds} с</span>
          )}
          {exercise.tempo && (
            <span className="badge bg-slate-800 border border-slate-700 text-slate-500 text-xs italic">🎵 {exercise.tempo}</span>
          )}
          {exercise.level && (
            <span className={`badge bg-slate-800 border border-slate-700 text-xs font-semibold ${
              exercise.level === 'easy' ? 'text-emerald-400' : exercise.level === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {exercise.level === 'easy' ? 'Лёгкий' : exercise.level === 'medium' ? 'Средний' : 'Сложный'}
            </span>
          )}
        </div>
        {exercise.technique && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Техника</p>
            <p className="text-sm text-slate-300 leading-relaxed rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,215,230,0.08)' }}>
              {exercise.technique}
            </p>
          </div>
        )}
        </div>{/* end p-5 */}
      </div>
    </div>
  )
}

/** Одно упражнение */
function ExerciseBlock({ exercise, idx, restSeconds, onAllDone, locked }) {
  const [showDetail, setShowDetail] = React.useState(false)
  const total = exercise.sets
  const isTimed = exercise.duration !== null
  const [done, setDone] = useState(0)
  const [phase, setPhase] = useState('idle') // 'idle' | 'exercise' | 'rest'
  const [activeSet, setActiveSet] = useState(null)
  const notifiedRef = useRef(false)

  const allDone = done >= total

  useEffect(() => {
    if (allDone && !notifiedRef.current) {
      notifiedRef.current = true
      onAllDone?.(idx)
    }
  }, [allDone])

  function finishSet() {
    const next = done + 1
    setDone(next)
    setActiveSet(null)
    if (next < total && restSeconds > 0) {
      setPhase('rest')
    } else {
      setPhase('idle')
    }
  }

  function finishRest() { setPhase('idle') }

  function handleSetClick(i) {
    if (done !== i || phase !== 'idle') return
    if (isTimed) {
      setActiveSet(i)
      setPhase('exercise')
    } else {
      finishSet()
    }
  }

  return (
    <div className={`rounded-2xl p-4 transition-all duration-300 ${allDone ? 'opacity-50' : locked ? 'opacity-30 pointer-events-none' : ''}`}
      style={{
        background: allDone ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.045)',
        border: allDone ? '1px solid rgba(200,215,230,0.06)' : '1px solid rgba(200,215,230,0.11)',
        boxShadow: allDone ? 'none' : '0 2px 16px rgba(0,0,0,0.2)',
      }}>

      {/* Картинка упражнения */}
      {exImg(exercise.image) && (
        <div className="w-full rounded-xl overflow-hidden mb-3"
             style={{ height: '130px' }}>
          <img src={exImg(exercise.image)} alt={exercise.name}
               className="w-full h-full object-cover object-center" loading="lazy" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-sm w-5 font-mono flex-shrink-0">{idx + 1}</span>
            <button
              className={`font-bold text-base text-left leading-snug transition-colors ${
                allDone ? 'line-through text-slate-600 cursor-default' : 'text-slate-100 hover:text-sky-300 cursor-pointer'
              }`}
              onClick={() => !allDone && setShowDetail(true)}
            >
              {exercise.name}
            </button>
          </div>
          {showDetail && <ExerciseInfoModal exercise={exercise} onClose={() => setShowDetail(false)} />}
          <div className="ml-7 mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(120,160,195,0.15)', border: '1px solid rgba(120,160,195,0.25)' }}>
            <span className="text-sm font-bold text-slate-200 tracking-wide">
              {total} подх.
            </span>
            <span className="text-slate-500 text-xs">×</span>
            <span className="text-sm font-bold text-slate-200">
              {isTimed ? `${exercise.duration} сек` : `${exercise.reps} повт.`}
            </span>
          </div>
        </div>
        {allDone && (
          <span className="text-lg flex-shrink-0" style={{
            background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>✓</span>
        )}
      </div>

      {/* Таймер упражнения */}
      {phase === 'exercise' && activeSet !== null && (
        <div className="flex justify-center mb-3">
          <CircleTimer
            key={`ex-${activeSet}`}
            total={exercise.duration}
            color="#94a3b8"
            label="сек"
            onDone={finishSet}
          />
        </div>
      )}

      {/* Таймер отдыха */}
      {phase === 'rest' && (
        <div className="flex flex-col items-center mb-3 py-1">
          <p className="text-xs text-slate-500 mb-1 tracking-widest uppercase">⏸ Отдых</p>
          <CircleTimer
            key={`rest-${done}`}
            total={restSeconds}
            color="#627d98"
            label="сек"
            onDone={finishRest}
            onSkip={finishRest}
          />
        </div>
      )}

      {/* Кнопки подходов */}
      {phase !== 'rest' && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const isDone = i < done
            const isActive = phase === 'exercise' && activeSet === i
            const isNext = i === done && phase === 'idle'

            return (
              <button
                key={i}
                onClick={() => handleSetClick(i)}
                disabled={isDone || isActive || (!isNext)}
                className={`flex-1 min-w-[56px] py-2 rounded-xl text-sm font-bold border transition-all duration-150
                  ${isDone
                    ? 'cursor-default border-transparent text-slate-700'
                    : isActive
                      ? 'cursor-default border-transparent animate-pulse'
                      : isNext
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed text-slate-700 border-slate-800 bg-transparent'
                  }`}
                style={isDone ? {
                  background: 'rgba(40,160,80,0.18)',
                  color: '#4ade80',
                  border: '1px solid rgba(60,200,100,0.2)',
                } : isActive ? {
                  background: 'linear-gradient(135deg, #4a6275, #7a9ab5)',
                  color: '#e2eaf2',
                  border: '1px solid rgba(140,175,210,0.3)',
                } : isNext ? {
                  background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
                  color: '#0f1a26',
                  boxShadow: '0 2px 10px rgba(140,170,200,0.25)',
                  border: 'none',
                } : {}}
              >
                {isDone ? `✓ ${i + 1}` : isActive ? '⏱…' : isTimed ? `▸ ${i + 1}` : `${i + 1}`}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function WorkoutSession({ workout, onFinish }) {
  const { logSession, removePlannedExercise } = useWorkouts()
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const [restSeconds, setRestSeconds] = useState(30)
  const [interExRestSec, setInterExRestSec] = useState(60)
  const [interExRest, setInterExRest] = useState(null)
  const [completedIdxs, setCompletedIdxs] = useState(new Set())

  function handleExerciseDone(idx) {
    setCompletedIdxs(prev => { const s = new Set(prev); s.add(idx); return s })
    if (idx < workout.exercises.length - 1 && interExRestSec > 0) {
      setInterExRest({ afterIdx: idx })
    }
  }

  function finishInterRest() { setInterExRest(null) }

  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  function handleFinish() {
    const doneExercises = workout.exercises.filter((_, i) => completedIdxs.has(i))
    logSession(
      workout.id,
      workout.name,
      elapsed,
      doneExercises.length || workout.exercises.length,
      doneExercises.length ? doneExercises : workout.exercises
    )
    if (workout.id.startsWith('planned-')) {
      const dateKey = workout.id.replace('planned-', '')
      workout.exercises.forEach((ex, i) => {
        if (completedIdxs.has(i) && ex.plannedId) {
          removePlannedExercise(dateKey, ex.plannedId)
        }
      })
    }
    setDone(true)
    setTimeout(onFinish, 1800)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <div className="text-6xl mb-2">🎉</div>
        <h2 className="text-3xl font-black" style={{
          background: 'linear-gradient(135deg, #b0c4d8 0%, #e2eaf2 60%, #8fa3ba 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Тренировка завершена!
        </h2>
        <p className="text-slate-500">Время: {fmtTotal(elapsed)}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      {/* Шапка тренировки */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-0.5">Тренировка</p>
          <h2 className="text-xl font-black text-slate-100">{workout.name}</h2>
          <p className="text-xs text-slate-600 mt-0.5">{workout.exercises.length} упр. · {workout.duration} мин</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-600 mb-0.5 uppercase tracking-widest">Время</p>
          <p className="font-mono text-3xl font-black text-slate-100">{fmtTotal(elapsed)}</p>
        </div>
      </div>

      {/* Настройка таймера отдыха между подходами */}
      <div className="flex items-center gap-2 px-1 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-widest flex-shrink-0">⏸ Отдых:</span>
        {[15, 30, 45, 60, 90].map(v => (
          <button
            key={v}
            onClick={() => setRestSeconds(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-150
              ${restSeconds === v ? 'text-slate-900 border-transparent' : 'text-slate-600 border-slate-800 hover:text-slate-300'}`}
            style={restSeconds === v ? { background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 100%)' } : {}}
          >{v}с</button>
        ))}
        <input type="number" min={0} max={600} value={restSeconds}
          onChange={e => setRestSeconds(Math.max(0, +e.target.value))}
          className="w-14 text-center text-xs font-bold rounded-lg py-1 text-slate-300"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,215,230,0.15)' }}
        />
      </div>

      {/* Настройка отдыха между упражнениями */}
      <div className="flex items-center gap-2 px-1 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-widest flex-shrink-0">🏃 Между упр.:</span>
        {[30, 60, 90, 120].map(v => (
          <button
            key={v}
            onClick={() => setInterExRestSec(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-150
              ${interExRestSec === v ? 'text-slate-900 border-transparent' : 'text-slate-600 border-slate-800 hover:text-slate-300'}`}
            style={interExRestSec === v ? { background: 'linear-gradient(135deg, #5a6f82 0%, #8faabf 100%)' } : {}}
          >{v}с</button>
        ))}
        <input type="number" min={0} max={600} value={interExRestSec}
          onChange={e => setInterExRestSec(Math.max(0, +e.target.value))}
          className="w-14 text-center text-xs font-bold rounded-lg py-1 text-slate-300"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,215,230,0.15)' }}
        />
      </div>

      {/* Упражнения */}
      <div className="flex flex-col gap-3">
        {workout.exercises.map((ex, i) => (
          <React.Fragment key={i}>
            {interExRest?.afterIdx === i - 1 && (
              <div className="card flex flex-col items-center gap-3 py-4"
                style={{ border: '1px solid rgba(140,170,200,0.18)', background: 'rgba(140,170,200,0.06)' }}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">🏃 Отдых перед следующим</p>
                <p className="text-sm font-semibold text-slate-300 text-center">{workout.exercises[i].name}</p>
                <CircleTimer
                  key={`inter-${interExRest.afterIdx}`}
                  total={interExRestSec}
                  color="#627d98"
                  label="сек"
                  onDone={finishInterRest}
                  onSkip={finishInterRest}
                />
              </div>
            )}
            <ExerciseBlock
              exercise={ex}
              idx={i}
              restSeconds={ex.restSeconds ?? restSeconds}
              onAllDone={handleExerciseDone}
              locked={interExRest !== null && i > interExRest.afterIdx}
            />
          </React.Fragment>
        ))}
      </div>

      <button className="btn-primary w-full py-4 text-base font-black mt-2" onClick={handleFinish}>
        🏁 Завершить тренировку
      </button>
      <button
        className="text-slate-700 hover:text-slate-400 text-sm text-center transition-colors pb-4"
        onClick={onFinish}
      >
        Отменить
      </button>
    </div>
  )
}