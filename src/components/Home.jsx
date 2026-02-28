import { useMemo } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'
import Calendar from './Calendar.jsx'

const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

function todayKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export default function Home({ onStartWorkout }) {
  const { sessions, workouts } = useWorkouts()
  const today = new Date()

  // Сессии за сегодня
  const todaySessions = useMemo(() =>
    sessions.filter(s => todayKey(new Date(s.date)) === todayKey(today)),
    [sessions]
  )

  // Случайная рекомендация (меняется только при изменении списка тренировок)
  const suggested = useMemo(() => {
    if (workouts.length === 0) return null
    // Приоритет — тренировки, которые ещё не делали сегодня
    const notDoneToday = workouts.filter(
      w => !todaySessions.some(s => s.workoutId === w.id)
    )
    const pool = notDoneToday.length > 0 ? notDoneToday : workouts
    return pool[Math.floor(Math.random() * pool.length)]
  }, [workouts.length, todaySessions.length])

  const dateStr = `${WEEKDAYS[today.getDay()]}, ${today.getDate()} ${MONTHS_GEN[today.getMonth()]}`

  return (
    <div className="flex flex-col gap-5">
      {/* Календарь */}
      <Calendar />

      {/* Выполнить сегодня */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-gray-100 text-lg">Выполнить сегодня</h2>
            <p className="text-xs text-gray-500 capitalize">{dateStr}</p>
          </div>
          {todaySessions.length > 0 && (
            <div className="flex items-center gap-1.5 bg-primary-900 text-primary-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
              ✓ {todaySessions.length} выполн.
            </div>
          )}
        </div>

        {todaySessions.length === 0 ? (
          /* Нет тренировок сегодня */
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 text-sm">Сегодня ещё нет тренировок. Начнём?</p>
            {suggested && (
              <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Рекомендуем</p>
                  <p className="font-semibold text-gray-100">{suggested.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {suggested.exercises.length} упр. · {suggested.duration} мин
                  </p>
                </div>
                <button
                  className="btn-primary flex-shrink-0"
                  onClick={() => onStartWorkout(suggested)}
                >
                  ▸ Начать
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Уже тренировались сегодня */
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
              <span className="text-2xl">🔥</span>
              Отличная работа! Вы уже потренировались сегодня.
            </div>
            <ul className="divide-y divide-gray-800 text-sm mt-1">
              {todaySessions.map(s => (
                <li key={s.id} className="py-2 flex justify-between text-gray-300">
                  <span>{s.workoutName}</span>
                  <span className="text-gray-500">
                    {Math.floor(s.duration / 60)} мин {s.duration % 60} сек
                  </span>
                </li>
              ))}
            </ul>
            {suggested && (
              <div className="bg-gray-800 rounded-xl p-3 flex items-center justify-between gap-3 mt-1">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Ещё одна тренировка?</p>
                  <p className="font-medium text-gray-200 text-sm">{suggested.name}</p>
                </div>
                <button
                  className="btn-secondary text-sm py-1.5 flex-shrink-0"
                  onClick={() => onStartWorkout(suggested)}
                >
                  ▸ Начать
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
