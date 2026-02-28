import { useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'

const CATEGORY_LABELS = {
  cardio:      { label: 'Кардио',   color: 'bg-blue-950 text-blue-400 border-blue-900' },
  strength:    { label: 'Сила',     color: 'bg-orange-950 text-orange-400 border-orange-900' },
  flexibility: { label: 'Гибкость', color: 'bg-purple-950 text-purple-400 border-purple-900' },
  custom:      { label: 'Своя',     color: 'bg-slate-800 text-slate-400 border-slate-700' },
}
const DIFFICULTY_LABELS = {
  beginner:     { label: 'Начинающий',  color: 'text-emerald-400' },
  intermediate: { label: 'Средний',     color: 'text-yellow-400' },
  advanced:     { label: 'Продвинутый', color: 'text-red-400' },
}

export default function WorkoutCard({ workout, onStart }) {
  const { deleteWorkout } = useWorkouts()
  const [expanded, setExpanded] = useState(false)

  const cat  = CATEGORY_LABELS[workout.category]   ?? CATEGORY_LABELS.custom
  const diff = DIFFICULTY_LABELS[workout.difficulty] ?? DIFFICULTY_LABELS.beginner

  return (
    <div className="flex flex-col gap-3 rounded-2xl p-5 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(200,215,230,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-100 leading-tight">{workout.name}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{workout.description}</p>
        </div>
        <button
          onClick={() => deleteWorkout(workout.id)}
          className="text-slate-700 hover:text-red-400 transition-colors text-base leading-none mt-0.5 flex-shrink-0"
          title="Удалить"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className={`badge border ${cat.color}`}>{cat.label}</span>
        <span className={`text-xs font-semibold ${diff.color}`}>{diff.label}</span>
        <span className="badge bg-slate-800 text-slate-500 border border-slate-700">⏱ {workout.duration} мин</span>
        <span className="badge bg-slate-800 text-slate-500 border border-slate-700">📋 {workout.exercises.length} упр.</span>
      </div>

      <button
        className="text-slate-600 hover:text-slate-300 text-xs text-left font-medium transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? '▴ Скрыть' : '▾ Упражнения'}
      </button>

      {expanded && (
        <ul className="divide-y divide-slate-800 text-sm">
          {workout.exercises.map((ex, i) => (
            <li key={i} className="py-1.5 flex justify-between text-slate-400">
              <span>{ex.name}</span>
              <span className="text-slate-600">
                {ex.sets} × {ex.reps ? `${ex.reps} повт.` : `${ex.duration} сек`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button className="btn-primary w-full mt-1" onClick={() => onStart(workout)}>
        ▸ Начать
      </button>
    </div>
  )
}
