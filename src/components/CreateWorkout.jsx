import { useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'

const EMPTY_EXERCISE = { name: '', sets: 3, reps: 10, duration: null }

function ExerciseRow({ ex, index, onChange, onRemove }) {
  const [useDuration, setUseDuration] = useState(ex.duration !== null)

  function toggleMode() {
    const next = !useDuration
    setUseDuration(next)
    onChange(index, {
      ...ex,
      reps: next ? null : 10,
      duration: next ? 30 : null,
    })
  }

  return (
    <div className="bg-gray-800 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          className="input flex-1 text-sm"
          placeholder="Название упражнения"
          value={ex.name}
          onChange={e => onChange(index, { ...ex, name: e.target.value })}
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-500 hover:text-red-400 transition-colors px-2"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-2 items-center text-sm">
        <div className="flex flex-col">
          <label className="label text-xs">Подходы</label>
          <input
            type="number" min={1} max={20}
            className="input w-20 text-sm"
            value={ex.sets}
            onChange={e => onChange(index, { ...ex, sets: +e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="label text-xs">{useDuration ? 'Сек.' : 'Повт.'}</label>
          <input
            type="number" min={1}
            className="input w-20 text-sm"
            value={useDuration ? ex.duration ?? 30 : ex.reps ?? 10}
            onChange={e => onChange(index, {
              ...ex,
              reps: useDuration ? null : +e.target.value,
              duration: useDuration ? +e.target.value : null,
            })}
          />
        </div>

        <div className="flex flex-col justify-end pb-0.5">
          <button
            type="button"
            onClick={toggleMode}
          className="text-xs text-slate-500 hover:text-slate-300 whitespace-nowrap mt-5"
          >
            {useDuration ? '↔ повторы' : '↔ время'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CreateWorkout({ onCreated }) {
  const { addWorkout } = useWorkouts()
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'custom',
    difficulty: 'beginner',
    duration: 30,
    exercises: [{ ...EMPTY_EXERCISE }],
  })
  const [saved, setSaved] = useState(false)

  function updateExercise(i, ex) {
    const arr = [...form.exercises]
    arr[i] = ex
    setForm(f => ({ ...f, exercises: arr }))
  }

  function removeExercise(i) {
    setForm(f => ({ ...f, exercises: f.exercises.filter((_, idx) => idx !== i) }))
  }

  function addExercise() {
    setForm(f => ({ ...f, exercises: [...f.exercises, { ...EMPTY_EXERCISE }] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || form.exercises.every(ex => !ex.name.trim())) return
    addWorkout({
      ...form,
      exercises: form.exercises.filter(ex => ex.name.trim()),
    })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setForm({
        name: '', description: '', category: 'custom',
        difficulty: 'beginner', duration: 30,
        exercises: [{ ...EMPTY_EXERCISE }],
      })
      if (onCreated) onCreated()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg mx-auto">
      <div className="card flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-100">Новая тренировка</h2>

        <div>
          <label className="label">Название *</label>
          <input
            className="input"
            placeholder="Моя тренировка"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="label">Описание</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="Краткое описание..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Категория</label>
            <select
              className="input"
              style={{ color: '#cbd5e1', background: '#1e2533' }}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="cardio" style={{ color: '#cbd5e1', background: '#1e2533' }}>Кардио</option>
              <option value="strength" style={{ color: '#cbd5e1', background: '#1e2533' }}>Сила</option>
              <option value="flexibility" style={{ color: '#cbd5e1', background: '#1e2533' }}>Гибкость</option>
              <option value="custom" style={{ color: '#cbd5e1', background: '#1e2533' }}>Своя</option>
            </select>
          </div>
          <div>
            <label className="label">Сложность</label>
            <select
              className="input"
              style={{ color: '#cbd5e1', background: '#1e2533' }}
              value={form.difficulty}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
            >
              <option value="beginner" style={{ color: '#cbd5e1', background: '#1e2533' }}>Начинающий</option>
              <option value="intermediate" style={{ color: '#cbd5e1', background: '#1e2533' }}>Средний</option>
              <option value="advanced" style={{ color: '#cbd5e1', background: '#1e2533' }}>Продвинутый</option>
            </select>
          </div>
          <div>
            <label className="label">Длит. (мин)</label>
            <input
              type="number" min={1} max={300}
              className="input"
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-200">Упражнения</h3>
          <button type="button" className="btn-secondary text-sm py-1" onClick={addExercise}>
            + Добавить
          </button>
        </div>
        {form.exercises.map((ex, i) => (
          <ExerciseRow
            key={i}
            ex={ex}
            index={i}
            onChange={updateExercise}
            onRemove={removeExercise}
          />
        ))}
      </div>

      <button
        type="submit"
        className={`btn-primary w-full text-lg py-3 ${saved ? 'opacity-80' : ''}`}
        disabled={saved}
      >
        {saved ? '✅ Тренировка сохранена!' : '💾 Сохранить тренировку'}
      </button>
    </form>
  )
}
