import { useMemo, useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'
import Calendar from './Calendar.jsx'

const CATEGORY_ICONS = {
  'Грудь':      '💪',
  'Спина':      '🔙',
  'Плечи':      '🏋️',
  'Руки':       '💪',
  'Ноги':       '🦵',
  'Ягодицы':    '🍑',
  'Пресс':      '⚡',
  'Активация':  '🔥',
  'Мобильность':'🧘',
  'Разминка':   '🤸',
}

const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]
const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']

const LEVEL_LABELS = {
  easy:   { label: 'Лёгкий',  color: 'text-emerald-400' },
  medium: { label: 'Средний', color: 'text-yellow-400' },
  hard:   { label: 'Сложный', color: 'text-red-400' },
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fmtDuration(sec) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60); const s = sec % 60
  return m > 0 ? `${m} мин${s ? ` ${s} сек` : ''}` : `${s} сек`
}

function PlannedExerciseItem({ ex, selKey }) {
  const { removePlannedExercise } = useWorkouts()
  const [showTechnique, setShowTechnique] = useState(false)
  const lv = LEVEL_LABELS[ex.level]

  return (
    <li className="py-3 flex flex-col gap-2 border-b border-slate-800/60 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200">{ex.name}</p>
          {ex.muscles && (
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{ex.muscles}</p>
          )}
        </div>
        <button
          onClick={() => removePlannedExercise(selKey, ex.id)}
          className="text-slate-700 hover:text-red-400 transition-colors text-sm px-1 flex-shrink-0 mt-0.5"
        >✕</button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="badge bg-slate-800 border border-slate-700/60 text-slate-300 text-xs">
          {ex.defaultSets} × {ex.defaultReps != null ? `${ex.defaultReps} повт.` : `${ex.defaultDuration ?? '—'} сек.`}
        </span>
        {ex.defaultRest != null && (
          <span className="badge bg-slate-800 border border-slate-700/60 text-slate-400 text-xs">
            ⏸ {ex.defaultRest} с
          </span>
        )}
        {ex.defaultTempo && (
          <span className="badge bg-slate-800 border border-slate-700/60 text-slate-500 text-xs italic">
            {ex.defaultTempo}
          </span>
        )}
        {lv && (
          <span className={`badge bg-slate-800 border border-slate-700/60 text-xs font-semibold ${lv.color}`}>
            {lv.label}
          </span>
        )}
      </div>

      {ex.technique && (
        <>
          <button
            className="text-slate-600 hover:text-slate-300 text-xs text-left font-medium transition-colors w-fit"
            onClick={() => setShowTechnique(s => !s)}
          >
            {showTechnique ? '▲ Скрыть технику' : '▾ Показать технику'}
          </button>
          {showTechnique && (
            <p className="text-xs text-slate-300 leading-relaxed rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,215,230,0.08)' }}>
              {ex.technique}
            </p>
          )}
        </>
      )}
    </li>
  )
}

function ExercisePicker({ selKey }) {
  const { exercises, plannedWorkouts, planExercise } = useWorkouts()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const planned = plannedWorkouts[selKey] ?? []

  // Все категории из базы
  const categories = useMemo(() => {
    return [...new Set(exercises.map(e => e.category))].sort()
  }, [exercises])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return exercises.filter(e => {
      const matchCat = !selectedCategory || e.category === selectedCategory
      const matchSearch = !q ||
        e.name.toLowerCase().includes(q) ||
        e.muscles.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [exercises, search, selectedCategory])

  const activePill = {
    background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
    color: '#0f1a26',
  }

  return (
    <div className="flex flex-col gap-3 mt-2 rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,215,235,0.1)' }}>

      {/* Поиск */}
      <input
        className="input text-sm py-1.5"
        placeholder="🔍 Поиск упражнений..."
        value={search}
        onChange={e => { setSearch(e.target.value); setSelectedCategory(null) }}
        autoFocus
      />

      {/* Категории-пилюли */}
      {!search && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Категория</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 border"
              style={!selectedCategory
                ? activePill
                : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }}
            >
              Все
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 border"
                style={selectedCategory === cat
                  ? activePill
                  : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }}
              >
                {(CATEGORY_ICONS[cat] ?? '') + ' ' + cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Список упражнений */}
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="text-slate-600 text-xs text-center py-4">Упражнения не найдены</p>
        ) : filtered.map(ex => {
          const added = planned.some(p => p.id === ex.id)
          return (
            <div key={ex.id}
              className="flex items-center justify-between gap-2 py-2 px-2 rounded-lg transition-colors"
              style={{ background: added ? 'rgba(100,160,120,0.12)' : 'transparent' }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{ex.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{ex.muscles}</p>
              </div>
              <button
                onClick={() => !added && planExercise(selKey, ex)}
                className={`flex-shrink-0 w-7 h-7 rounded-lg text-sm font-bold transition-all duration-150 ${
                  added
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : 'text-slate-900 hover:scale-110'
                }`}
                style={!added ? {
                  background: 'linear-gradient(135deg,#7a8fa6,#b8cad9)',
                } : {}}
              >
                {added ? '✓' : '+'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TodayPage({ onStartWorkout }) {
  const { sessions, plannedWorkouts, removePlannedExercise } = useWorkouts()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [showPicker, setShowPicker] = useState(false)

  const selKey = dateKey(selectedDate)
  const todayKey = dateKey(today)
  const isToday = selKey === todayKey
  const isFuture = selectedDate > today && !isToday

  const plannedList = plannedWorkouts[selKey] ?? []

  const sessionsOnDay = useMemo(() =>
    sessions.filter(s => dateKey(new Date(s.date)) === selKey),
    [sessions, selKey]
  )

  function startPlanned() {
    const workout = {
      id: 'planned-' + selKey,
      name: 'Тренировка по плану',
      description: `${selectedDate.getDate()} ${MONTHS_GEN[selectedDate.getMonth()]}`,
      category: 'custom',
      difficulty: 'intermediate',
      duration: Math.max(20, plannedList.length * 5),
      exercises: plannedList.map(e => ({
        name: e.name,
        sets: e.defaultSets,
        reps: String(e.defaultReps).match(/^\d/) ? parseInt(e.defaultReps) : null,
        duration: String(e.defaultReps).includes('сек') ? 30 : null,
      })),
    }
    onStartWorkout(workout)
  }

  const dateStr = `${WEEKDAYS[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTHS_GEN[selectedDate.getMonth()]}`

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-4">

      {/* Заголовок */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight">
            {isToday ? 'Сегодня' : 'Выбранный день'}
          </h1>
          <p className="text-slate-500 text-sm capitalize mt-0.5">{dateStr}</p>
        </div>
        {isToday && sessionsOnDay.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(120,160,140,0.15)', border: '1px solid rgba(120,180,140,0.25)', color: '#7bc49a' }}>
            ✓ {sessionsOnDay.length} вып.
          </div>
        )}
      </div>

      {/* Календарь */}
      <Calendar selectedDate={selectedDate} onDateSelect={(d) => { setSelectedDate(d); setShowPicker(false) }} />

      {/* Запланированные упражнения */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 tracking-wide uppercase">
            📋 {isToday ? 'План на сегодня' : `План на ${selectedDate.getDate()} ${MONTHS_GEN[selectedDate.getMonth()]}`}
          </h3>
          <button
            onClick={() => setShowPicker(s => !s)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150"
            style={showPicker ? {
              background: 'rgba(255,255,255,0.08)',
              color: '#94a3b8',
            } : {
              background: 'linear-gradient(135deg,#7a8fa6,#b8cad9)',
              color: '#0f172a',
            }}
          >
            {showPicker ? '✕ Закрыть' : '+ Добавить'}
          </button>
        </div>

        {showPicker && <ExercisePicker selKey={selKey} />}

        {plannedList.length === 0 && !showPicker ? (
          <p className="text-slate-600 text-sm text-center py-5">
            Упражнений нет. Нажмите «+ Добавить» чтобы выбрать из базы.
          </p>
        ) : plannedList.length > 0 && (
          <>
            <ul className="mt-2">
              {plannedList.map(ex => (
                <PlannedExerciseItem key={ex.id} ex={ex} selKey={selKey} />
              ))}
            </ul>
            {(isToday || isFuture) && (
              <button
                className="btn-primary w-full mt-3 py-2.5"
                onClick={startPlanned}
                disabled={!isToday}
                title={isFuture ? 'Тренировку можно начать только сегодня' : ''}
              >
                {isToday ? '▸ Начать по плану' : '⏳ Тренировка запланирована'}
              </button>
            )}
          </>
        )}
      </div>


      {/* Выполненные сессии в этот день */}
      {sessionsOnDay.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-bold text-slate-400 tracking-widets uppercase mb-3">
            🔥 {isToday ? 'Выполнено сегодня' : 'Выполнено в этот день'}
          </h3>
          <ul className="divide-y divide-slate-800/60">
            {sessionsOnDay.map(s => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <p className="font-semibold text-slate-200 text-sm">{s.workoutName}</p>
                <span className="text-xs font-semibold text-slate-400">{fmtDuration(s.duration)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}


    </div>
  )
}

