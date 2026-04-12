import { useMemo, useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'
import ExercisePickerCard from './ExercisePickerCard.jsx'

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

/* ── Карточка группы (отображение + действия) ── */
function GroupCard({ group }) {
  const { exercises, deleteGroup, updateGroup, removeExerciseFromGroup, addExerciseToGroup, addGroupToPlan } = useWorkouts()
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [showAddPicker, setShowAddPicker] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const groupExercises = useMemo(
    () => group.exerciseIds.map(id => exercises.find(e => e.id === id)).filter(Boolean),
    [group.exerciseIds, exercises]
  )

  function handleSaveName() {
    if (editName.trim()) {
      updateGroup(group.id, { name: editName.trim() })
    } else {
      setEditName(group.name)
    }
    setEditing(false)
  }

  function handleAddExercise(exercise) {
    addExerciseToGroup(group.id, exercise.id)
  }

  // Фильтр категорий для пикера добавления
  const categories = useMemo(() => {
    return [...new Set(exercises.map(e => e.category))].sort()
  }, [exercises])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const filteredExercises = useMemo(() => {
    return exercises.filter(e => !selectedCategory || e.category === selectedCategory)
  }, [exercises, selectedCategory])

  const groupExerciseIdsSet = new Set(group.exerciseIds)
  const activePill = {
    background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
    color: '#0f1a26',
  }

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,235,0.1)' }}
    >
      {/* Заголовок группы */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base">📁</span>
          {editing
            ? (
                <input
                  className="flex-1 text-sm font-semibold bg-transparent text-slate-100 border-b border-slate-600 focus:border-slate-400 outline-none px-1 py-0.5"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setEditName(group.name); setEditing(false) } }}
                  autoFocus
                />
              )
            : (
                <button
                  className="flex-1 text-left text-sm font-semibold text-slate-200 truncate hover:text-slate-100 transition-colors min-w-0"
                  onClick={() => setExpanded(!expanded)}
                  title={group.name}
                >
                  {group.name}
                </button>
              )}
          <span className="text-xs text-slate-500 flex-shrink-0">({group.exerciseIds.length})</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Добавить группу в план */}
          <button
            onClick={() => addGroupToPlan(window.__selKeyForGroups, group)}
            className="w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,#7a8fa6,#b8cad9)',
              color: '#0f172a',
            }}
            title="Добавить группу в план на выбранный день"
          >
            📅
          </button>
          {/* Редактировать название */}
          <button
            onClick={() => { setEditing(true); setEditName(group.name) }}
            className="w-7 h-7 rounded-lg text-xs transition-colors flex items-center justify-center text-slate-500 hover:text-slate-300"
            title="Редактировать"
          >
            ✏️
          </button>
          {/* Удалить */}
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="w-7 h-7 rounded-lg text-xs transition-colors flex items-center justify-center text-red-500 hover:text-red-400"
            title="Удалить группу"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Модалка подтверждения удаления */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-3"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowConfirmDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: '#1a2235', border: '1px solid rgba(200,215,235,0.12)' }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-sm font-semibold text-slate-200">Удалить группу «{group.name}»?</p>
            <p className="text-xs text-slate-500">Это действие нельзя отменить.</p>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-xl text-sm font-bold border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
                onClick={() => setShowConfirmDelete(false)}
              >
                Отмена
              </button>
              <button
                className="flex-1 py-2 rounded-xl text-sm font-bold bg-red-900 text-red-200 border border-red-800 hover:bg-red-800 transition-all"
                onClick={() => { deleteGroup(group.id); setShowConfirmDelete(false) }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Раскрытый контент */}
      {expanded && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {/* Список упражнений в группе — карточки */}
          {groupExercises.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {groupExercises.map(ex => (
                <ExercisePickerCard
                  key={ex.id}
                  ex={ex}
                  isAdded={true}
                  onToggle={() => removeExerciseFromGroup(group.id, ex.id)}
                  size="sm"
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600 text-center py-2">В группе пока нет упражнений</p>
          )}

          {/* Кнопка добавления упражнений */}
          <button
            onClick={() => setShowAddPicker(s => !s)}
            className="w-full py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
          >
            {showAddPicker ? '✕ Закрыть' : '+ Добавить упражнение'}
          </button>

          {/* Пикер упражнений — карточки */}
          {showAddPicker && (
            <div
              className="flex flex-col gap-2 rounded-xl p-2.5 overflow-y-auto"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,235,0.08)', maxHeight: 'calc(100vh - 280px)' }}
            >
              {/* Категории — фиксированные */}
              <div className="flex flex-wrap gap-1 flex-shrink-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium transition-all border"
                  style={!selectedCategory ? activePill : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }}
                >
                  Все
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium transition-all border"
                    style={selectedCategory === cat ? activePill : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </button>
                ))}
              </div>

              {/* Сетка карточек */}
              <div className="grid grid-cols-2 gap-2 pr-1">
                {filteredExercises.map(ex => (
                  <ExercisePickerCard
                    key={ex.id}
                    ex={ex}
                    isAdded={groupExerciseIdsSet.has(ex.id)}
                    onToggle={() => handleAddExercise(ex)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Форма создания новой группы ── */
function CreateGroupForm() {
  const { exercises, createGroup } = useWorkouts()
  const [name, setName] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  const categories = useMemo(() => {
    return [...new Set(exercises.map(e => e.category))].sort()
  }, [exercises])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const filtered = useMemo(() => {
    return exercises.filter(e => !selectedCategory || e.category === selectedCategory)
  }, [exercises, selectedCategory])

  const selectedSet = new Set(selectedIds)
  const activePill = {
    background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
    color: '#0f1a26',
  }

  function toggleExercise(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleCreate() {
    if (!name.trim()) return
    createGroup(name.trim(), selectedIds)
    setName('')
    setSelectedIds([])
    setShowPicker(false)
  }

  return (
    <div
      className="rounded-xl overflow-hidden p-3 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,235,0.1)' }}
    >
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Новая группа</p>

      {/* Название */}
      <input
        className="w-full text-sm rounded-xl px-3 py-2 bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-slate-500 outline-none transition-all"
        placeholder="Название группы..."
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
      />

      {/* Кнопка пикера */}
      <button
        onClick={() => setShowPicker(s => !s)}
        className="w-full py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
      >
        {showPicker ? '✕ Закрыть' : '+ Выбрать упражнения'}
      </button>

      {/* Выбранные упражнения (мини-превью) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map(id => {
            const ex = exercises.find(e => e.id === id)
            if (!ex) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(120,160,195,0.15)', color: '#94a3b8', border: '1px solid rgba(120,160,195,0.2)' }}
              >
                {ex.name}
                <button onClick={() => toggleExercise(id)} className="text-red-400 hover:text-red-300 ml-0.5">✕</button>
              </span>
            )
          })}
        </div>
      )}

      {/* Пикер упражнений — карточки */}
      {showPicker && (
        <div
          className="flex flex-col gap-2 rounded-xl p-2.5 overflow-y-auto"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,235,0.08)', maxHeight: 'calc(100vh - 280px)' }}
        >
          {/* Категории — фиксированные */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium transition-all border"
              style={!selectedCategory ? activePill : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }}
            >
              Все
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium transition-all border"
                style={selectedCategory === cat ? activePill : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>

          {/* Сетка карточек */}
          <div className="grid grid-cols-2 gap-2 pr-1">
            {filtered.map(ex => (
              <ExercisePickerCard
                key={ex.id}
                ex={ex}
                isAdded={selectedSet.has(ex.id)}
                onToggle={() => toggleExercise(ex.id)}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Кнопка создания */}
      <button
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-default"
        style={{
          background: 'linear-gradient(135deg,#7a8fa6,#b8cad9)',
          color: '#0f172a',
        }}
        disabled={!name.trim()}
        onClick={handleCreate}
      >
        Создать группу{selectedIds.length > 0 ? ` (${selectedIds.length} упр.)` : ''}
      </button>
    </div>
  )
}

/* ── Главный компонент менеджера групп ── */
export default function ExerciseGroupManager() {
  const { exerciseGroups } = useWorkouts()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-300 tracking-wide uppercase">
          📁 Группы упражнений
        </h3>
        <button
          onClick={() => setShowCreate(s => !s)}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150"
          style={showCreate ? {
            background: 'rgba(255,255,255,0.08)',
            color: '#94a3b8',
          } : {
            background: 'linear-gradient(135deg,#7a8fa6,#b8cad9)',
            color: '#0f172a',
          }}
        >
          {showCreate ? '✕ Закрыть' : '+ Новая группа'}
        </button>
      </div>

      {showCreate && <CreateGroupForm />}

      {exerciseGroups.length === 0 && !showCreate ? (
        <p className="text-slate-600 text-sm text-center py-5">
          Групп пока нет. Нажмите «+ Новая группа» чтобы создать.
        </p>
      ) : exerciseGroups.length > 0 && (
        <ul className="flex flex-col gap-2 mt-3">
          {exerciseGroups.map(g => (
            <li key={g.id}>
              <GroupCard group={g} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
