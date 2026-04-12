import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'
import { useExerciseImages } from '../hooks/useExerciseImages.js'
import { getExerciseImage } from '../utils/exerciseImage.js'

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
  const [imageVersion, setImageVersion] = useState(0)
  const imgSrc = getExerciseImage(exercise)

  const { uploadImage, removeImage, uploading } = useExerciseImages()
  const [showImageMenu, setShowImageMenu] = useState(false)
  const inputRef = useRef(null)

  // Закрытие меню при клике вне
  useEffect(() => {
    if (!showImageMenu) return
    const handler = () => setShowImageMenu(false)
    const t = setTimeout(() => document.addEventListener('click', handler), 0)
    return () => { clearTimeout(t); document.removeEventListener('click', handler) }
  }, [showImageMenu])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadImage(exercise.id, file).then(() => {
      e.target.value = ''
      setShowImageMenu(false)
      setImageVersion(v => v + 1)
    }).catch(err => console.error(err))
  }

  function handleRemoveImage() {
    removeImage(exercise.id).then(() => {
      setShowImageMenu(false)
      setImageVersion(v => v + 1)
    }).catch(err => console.error(err))
  }

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200 relative"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(200,215,230,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>

      {/* Изображение упражнения */}
      {imgSrc && (
        <div className="w-full overflow-hidden relative" style={{ height: '200px' }}>
          <img
            src={imgSrc}
            alt={exercise.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          {/* Кнопка управления картинкой */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowImageMenu(s => !s) }}
            className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#e2eaf2', border: '1px solid rgba(200,215,230,0.15)' }}
            title="Изменить картинку"
          >
            📷
          </button>

          {showImageMenu && (
            <div
              className="absolute top-11 right-2 rounded-xl overflow-hidden z-10 flex flex-col"
              style={{ background: '#1a2235', border: '1px solid rgba(200,215,235,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading === exercise.id}
                className="px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/50 transition-colors text-left disabled:opacity-50"
              >
                {uploading === exercise.id ? '⏳ Загрузка...' : '📤 Загрузить новую'}
              </button>
              <button
                onClick={handleRemoveImage}
                className="px-3 py-2 text-xs text-red-400 hover:bg-slate-700/50 transition-colors text-left border-t border-slate-700/50"
              >
                🗑 Удалить картинку
              </button>
            </div>
          )}
        </div>
      )}

      {!imgSrc && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center py-8 text-slate-600 hover:text-slate-400 transition-colors"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(200,215,230,0.1)' }}
          title="Добавить картинку"
        >
          📷 Добавить картинку
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col gap-3 p-4">
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
