import { useState, useEffect, useRef } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

export default function Timer({ activeWorkout, onFinish }) {
  const { logSession } = useWorkouts()

  // Режим: 'stopwatch' | 'countdown'
  const [mode, setMode] = useState('stopwatch')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)       // секундомер — сколько прошло
  const [countdown, setCountdown] = useState(300) // отсчёт — начальное значение
  const [countInput, setCountInput] = useState('05:00')
  const [finished, setFinished] = useState(false)

  const intervalRef = useRef(null)

  // Сброс при смене режима
  useEffect(() => {
    stop()
    setElapsed(0)
    setFinished(false)
    if (mode === 'countdown') {
      setCountdown(parseInput(countInput))
    }
  }, [mode])

  function parseInput(str) {
    const parts = str.split(':').map(Number)
    if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0)
    return parseInt(str) || 0
  }

  function start() {
    if (finished) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setElapsed(e => e + 1)
      } else {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setFinished(true)
            return 0
          }
          return c - 1
        })
      }
    }, 1000)
  }

  function stop() {
    clearInterval(intervalRef.current)
    setRunning(false)
  }

  function reset() {
    stop()
    setElapsed(0)
    setFinished(false)
    if (mode === 'countdown') {
      setCountdown(parseInput(countInput))
    }
  }

  function handleSave() {
    const dur = mode === 'stopwatch' ? elapsed : parseInput(countInput) - countdown
    logSession(
      activeWorkout?.id ?? 'manual',
      activeWorkout?.name ?? 'Ручная тренировка',
      dur,
    )
    reset()
    if (onFinish) onFinish()
  }

  const displayTime = mode === 'stopwatch' ? elapsed : countdown
  const progress = mode === 'countdown'
    ? (1 - countdown / (parseInput(countInput) || 1)) * 100
    : null

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
      {activeWorkout && (
        <div className="card w-full text-center">
          <p className="text-gray-400 text-sm">Тренировка</p>
          <p className="font-bold text-lg text-primary-400">{activeWorkout.name}</p>
        </div>
      )}

      {/* Переключатель режима */}
      <div className="flex bg-gray-800 rounded-xl p-1 w-full">
        {['stopwatch', 'countdown'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-150
              ${mode === m ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {m === 'stopwatch' ? '⏱ Секундомер' : '⏳ Отсчёт'}
          </button>
        ))}
      </div>

      {/* Ввод времени для отсчёта */}
      {mode === 'countdown' && !running && !finished && (
        <div className="w-full">
          <label className="label">Установить время (мм:сс)</label>
          <input
            className="input text-center text-xl"
            value={countInput}
            onChange={e => {
              setCountInput(e.target.value)
              setCountdown(parseInput(e.target.value))
            }}
            placeholder="05:00"
          />
        </div>
      )}

      {/* Дисплей */}
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#1f2937" strokeWidth="6" />
          {mode === 'countdown' && (
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={finished ? '#ef4444' : '#22c55e'}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 * (1 - (progress ?? 0) / 100)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )}
        </svg>
        <div className="absolute text-center">
          <div className={`text-4xl font-mono font-bold ${finished ? 'text-red-400' : 'text-gray-100'}`}>
            {formatTime(displayTime)}
          </div>
          {finished && <div className="text-red-400 text-sm mt-1 animate-pulse">Время вышло!</div>}
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-3 w-full">
        {!running ? (
          <button
            className="btn-primary flex-1"
            onClick={start}
            disabled={finished}
          >
            ▸ Старт
          </button>
        ) : (
          <button className="btn-secondary flex-1" onClick={stop}>
            ⏸ Пауза
          </button>
        )}
        <button className="btn-secondary px-4" onClick={reset}>
          ↺
        </button>
      </div>

      {(elapsed > 0 || (mode === 'countdown' && countdown < parseInput(countInput))) && !running && (
        <button className="btn-primary w-full" onClick={handleSave}>
          ✅ Сохранить тренировку
        </button>
      )}
    </div>
  )
}
