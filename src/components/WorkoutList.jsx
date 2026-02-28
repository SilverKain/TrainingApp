import { useState, useMemo } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'

const LEVEL_LABELS = {
  easy:   { label: 'Лёгкий',   color: 'bg-emerald-950 text-emerald-400 border-emerald-900' },
  medium: { label: 'Средний',  color: 'bg-yellow-950 text-yellow-400 border-yellow-900' },
  hard:   { label: 'Сложный',  color: 'bg-red-950 text-red-400 border-red-900' },
}

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

function ExerciseCard({ exercise }) {
  const [showTechnique, setShowTechnique] = useState(false)
  const level = LEVEL_LABELS[exercise.level] ?? LEVEL_LABELS.medium

  return (
    <div className="flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(200,215,230,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm text-slate-100 leading-tight">{exercise.name}</h3>
        <span className={`badge border text-xs flex-shrink-0 ${level.color}`}>{level.label}</span>
      </div>

      <p className="text-xs text-slate-500 leading-snug">{exercise.muscles}</p>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="badge bg-slate-800 border border-slate-700 text-slate-400">
          {exercise.defaultSets} ×{' '}
          {exercise.defaultReps != null
            ? `${exercise.defaultReps} повт.`
            : `${exercise.defaultDuration} сек.`}
        </span>
        <span className="badge bg-slate-800 border border-slate-700 text-slate-400">
          ⏸ {exercise.defaultRest} с
        </span>
        <span className="badge bg-slate-800 border border-slate-700 text-slate-500 italic">
          {exercise.defaultTempo}
        </span>
      </div>

      <button
        className="text-slate-600 hover:text-slate-300 text-xs text-left font-medium transition-colors"
        onClick={() => setShowTechnique(s => !s)}
      >
        {showTechnique ? '▲ Скрыть технику' : '▾ Показать технику'}
      </button>

      {showTechnique && (
        <p className="text-xs text-slate-300 leading-relaxed rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,215,230,0.08)' }}>
          {exercise.technique}
        </p>
      )}
    </div>
  )
}

export default function WorkoutList({ onStartWorkout, onCreateWorkout }) {
  const { exercises } = useWorkouts()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [exerciseFilter, setExerciseFilter] = useState('all')

  // Категории
  const categories = useMemo(() => {
    const cats = [...new Set(exercises.map(e => e.category))].sort()
    return [{ key: 'all', label: 'Все' }, ...cats.map(c => ({
      key: c,
      label: (CATEGORY_ICONS[c] ? CATEGORY_ICONS[c] + ' ' : '') + c,
    }))]
  }, [exercises])

  // Упражнения текущей категории (для пилюль)
  const exercisesInCategory = useMemo(() => {
    if (categoryFilter === 'all') return []
    return exercises.filter(e => e.category === categoryFilter)
  }, [exercises, categoryFilter])

  // При смене категории сбрасываем выбранное упражнение
  function handleCategoryChange(key) {
    setCategoryFilter(key)
    setExerciseFilter('all')
  }

  const filtered = useMemo(() => {
    return exercises.filter(e => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        e.name.toLowerCase().includes(q) ||
        e.muscles.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      const matchCat      = categoryFilter === 'all' || e.category === categoryFilter
      const matchExercise = exerciseFilter === 'all' || e.id === exerciseFilter
      return matchSearch && matchCat && matchExercise
    })
  }, [exercises, search, categoryFilter, exerciseFilter])

  const activePillStyle = {
    background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
    boxShadow: '0 2px 8px rgba(140,170,200,0.2)',
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Поиск (работает в т.ч. по мышцам) */}
      <input
        className="input"
        placeholder="🔍 Поиск по названию, мышцам, категории..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Фильтр по категориям */}
      <div>
        <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">Категория</p>
        <div className="flex gap-2 flex-wrap">
          {categories.map(f => (
            <button
              key={f.key}
              onClick={() => handleCategoryChange(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
                ${categoryFilter === f.key
                  ? 'text-slate-900 font-bold border-transparent'
                  : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-200 hover:border-slate-600'}`}
              style={categoryFilter === f.key ? activePillStyle : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Пилюли упражнений выбранной категории */}
      {categoryFilter !== 'all' && exercisesInCategory.length > 0 && (
        <div>
          <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">
            Упражнение
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setExerciseFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
                ${exerciseFilter === 'all'
                  ? 'text-slate-900 font-bold border-transparent'
                  : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-200 hover:border-slate-600'}`}
              style={exerciseFilter === 'all' ? activePillStyle : {}}
            >
              Все
            </button>
            {exercisesInCategory.map(ex => (
              <button
                key={ex.id}
                onClick={() => setExerciseFilter(ex.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
                  ${exerciseFilter === ex.id
                    ? 'text-slate-900 font-bold border-transparent'
                    : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-200 hover:border-slate-600'}`}
                style={exerciseFilter === ex.id ? activePillStyle : {}}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600">Найдено: {filtered.length} упражнений</p>

      {filtered.length === 0 ? (
        <div className="text-center text-slate-600 py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p>Упражнения не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  )
}
