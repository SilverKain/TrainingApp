import { useEffect, useMemo, useRef, useState } from 'react'
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

/* ── Таймер (используется в модалке для отдыха между подходами) ── */
function MiniTimer({ total, onDone, onSkip }) {
  const [left, setLeft] = useState(total)
  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setLeft(l => { if (l <= 1) { clearInterval(ref.current); onDone(); return 0 } return l - 1 })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])
  const pct = ((total - left) / total) * 100
  const r = 30, circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={left <= 5 ? '#f87171' : '#627d98'}
            strokeWidth="8" strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
            className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-xl leading-none ${left <= 5 ? 'text-red-400' : 'text-slate-100'}`}>{left}</span>
          <span className="text-slate-500 text-[10px] mt-0.5">сек</span>
        </div>
      </div>
      {onSkip && (
        <button onClick={() => { clearInterval(ref.current); onSkip() }}
          className="px-4 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500">
          Пропустить →
        </button>
      )}
    </div>
  )
}

/* ── Модальная карточка упражнения ── */
function ExerciseDetailModal({ ex, onClose, onStart }) {
  const lv = LEVEL_LABELS[ex.level]
  const catIcon = CATEGORY_ICONS[ex.category] ?? ''
  const [session, setSession] = useState(null) // null | { setsDone, phase } 'idle'|'rest'

  // Блокировка скролла
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function startSession() { setSession({ setsDone: 0, phase: 'idle' }) }
  function finishSet() {
    const next = (session.setsDone ?? 0) + 1
    if (next >= ex.defaultSets) {
      setSession(null)
      onClose()
    } else if (ex.defaultRest > 0) {
      setSession({ setsDone: next, phase: 'rest' })
    } else {
      setSession({ setsDone: next, phase: 'idle' })
    }
  }
  function finishRest() { setSession(s => ({ ...s, phase: 'idle' })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl p-5 pb-8 flex flex-col gap-4"
        style={{ background: '#1a2235', border: '1px solid rgba(200,215,235,0.12)', maxHeight: '90dvh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        {/* Заголовок */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">{catIcon} {ex.category}</p>
            <h2 className="text-xl font-black text-slate-100 leading-tight">{ex.name}</h2>
            {ex.muscles && <p className="text-xs text-slate-500 mt-1 leading-snug">{ex.muscles}</p>}
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 text-xl leading-none flex-shrink-0 mt-1">✕</button>
        </div>

        {/* Бейджи */}
        <div className="flex flex-wrap gap-2">
          <span className="badge bg-slate-800 border border-slate-700 text-slate-300 text-xs">
            📋 {ex.defaultSets} подх. × {ex.defaultReps != null ? `${ex.defaultReps} повт.` : `${ex.defaultDuration ?? '—'} сек.`}
          </span>
          {ex.defaultRest != null && (
            <span className="badge bg-slate-800 border border-slate-700 text-slate-400 text-xs">⏸ Отдых: {ex.defaultRest} с</span>
          )}
          {ex.defaultTempo && (
            <span className="badge bg-slate-800 border border-slate-700 text-slate-500 text-xs italic">🎵 {ex.defaultTempo}</span>
          )}
          {lv && (
            <span className={`badge bg-slate-800 border border-slate-700 text-xs font-semibold ${lv.color}`}>{lv.label}</span>
          )}
        </div>

        {/* Техника */}
        {ex.technique && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Техника</p>
            <p className="text-sm text-slate-300 leading-relaxed rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,215,230,0.08)' }}>
              {ex.technique}
            </p>
          </div>
        )}

        {/* Мини-сессия */}
        {!session ? (
          <button className="btn-primary w-full py-3 text-base mt-1" onClick={startSession}>
            ▸ Начать упражнение
          </button>
        ) : session.phase === 'rest' ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest">⏸ Отдых перед подходом {session.setsDone + 1}</p>
            <MiniTimer key={`rest-${session.setsDone}`} total={ex.defaultRest ?? 30} onDone={finishRest} onSkip={finishRest} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="text-sm font-bold text-slate-300">
              Подход {session.setsDone + 1} / {ex.defaultSets}
            </p>
            {ex.defaultDuration ? (
              <>
                <MiniTimer key={`ex-${session.setsDone}`} total={ex.defaultDuration} onDone={finishSet} />
              </>
            ) : (
              <button className="btn-primary w-full py-3 text-base" onClick={finishSet}>
                ✓ Подход выполнен
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Элемент плана ── */
function PlannedExerciseItem({ ex, selKey, onStartExercise }) {
  const { removePlannedExercise } = useWorkouts()
  const lv = LEVEL_LABELS[ex.level]
  const catIcon = CATEGORY_ICONS[ex.category] ?? ''
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <li className="py-3 flex flex-col gap-2 border-b border-slate-800/60 last:border-0">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <button
              className="text-sm font-semibold text-slate-200 text-left hover:text-white transition-colors leading-snug"
              onClick={() => setShowModal(true)}
            >
              {ex.name}
            </button>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {ex.category && (
                <span className="text-[10px] text-slate-500 font-medium">{catIcon} {ex.category}</span>
              )}
              {ex.muscles && (
                <span className="text-[10px] text-slate-600 leading-snug">· {ex.muscles}</span>
              )}
            </div>
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
      </li>

      {showModal && (
        <ExerciseDetailModal
          ex={ex}
          onClose={() => setShowModal(false)}
          onStart={() => { setShowModal(false); onStartExercise(ex) }}
        />
      )}
    </>
  )
}

function ExercisePicker({ selKey }) {
  const { exercises, plannedWorkouts, planExercise } = useWorkouts()
  const [selectedCategory, setSelectedCategory] = useState(null)

  const planned = plannedWorkouts[selKey] ?? []

  // Все категории из базы
  const categories = useMemo(() => {
    return [...new Set(exercises.map(e => e.category))].sort()
  }, [exercises])

  const filtered = useMemo(() => {
    return exercises.filter(e => {
      return !selectedCategory || e.category === selectedCategory
    })
  }, [exercises, selectedCategory])

  const activePill = {
    background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
    color: '#0f1a26',
  }

  return (
    <div className="flex flex-col gap-3 mt-2 rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,215,235,0.1)' }}>

      {/* Категории-пилюли */}
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
  const { sessions, plannedWorkouts } = useWorkouts()
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
        reps: e.defaultReps ?? null,
        duration: e.defaultDuration ?? null,
        restSeconds: e.defaultRest ?? 30,
        muscles: e.muscles ?? null,
        technique: e.technique ?? null,
        level: e.level ?? null,
        category: e.category ?? null,
        tempo: e.defaultTempo ?? null,
      })),
    }
    onStartWorkout(workout)
  }

  function startSingleExercise(ex) {
    const totalSec = ex.defaultSets * ((ex.defaultDuration ?? 45) + (ex.defaultRest ?? 30))
    onStartWorkout({
      id: 'single-' + ex.id,
      name: ex.name,
      description: ex.category,
      category: 'custom',
      difficulty: ex.level ?? 'intermediate',
      duration: Math.max(5, Math.ceil(totalSec / 60)),
      exercises: [{ name: ex.name, sets: ex.defaultSets, reps: ex.defaultReps ?? null, duration: ex.defaultDuration ?? null, restSeconds: ex.defaultRest ?? 30, muscles: ex.muscles ?? null, technique: ex.technique ?? null, level: ex.level ?? null, category: ex.category ?? null, tempo: ex.defaultTempo ?? null }],
    })
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
                <PlannedExerciseItem key={ex.id} ex={ex} selKey={selKey} onStartExercise={startSingleExercise} />
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

