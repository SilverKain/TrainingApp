import { getExerciseImage } from '../utils/exerciseImage.js'

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

/**
 * Карточка упражнения для пикеров.
 *
 * Props:
 *  - ex          — объект упражнения
 *  - isAdded     — true если упражнение уже в списке → показываем «−»
 *  - onToggle    — callback при нажатии +/-
 *  - size="sm"   — "sm" (компактная) | "md" (обычная)
 */
export default function ExercisePickerCard({ ex, isAdded, onToggle, size = 'sm' }) {
  const imgSrc = getExerciseImage(ex)
  const icon = CATEGORY_ICONS[ex.category] || '🏋️'

  const isSm = size === 'sm'

  return (
    <div
      className={`flex flex-col items-center rounded-xl overflow-hidden transition-all duration-200 ${
        isAdded
          ? 'ring-1 ring-emerald-600/50'
          : 'hover:ring-1 hover:ring-slate-500/30'
      }`}
      style={{
        background: isAdded ? 'rgba(100,160,120,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(200,215,235,0.08)',
      }}
    >
      {/* Миниатюра */}
      <div
        className="relative w-full flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          height: isSm ? '72px' : '90px',
          background: imgSrc ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.03)',
        }}
      >
        {imgSrc
          ? <img src={imgSrc} alt={ex.name} className="w-full h-full object-cover" loading="lazy" />
          : <span className="text-2xl">{icon}</span>}

        {/* Кнопка +/- в правом верхнем углу */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-150 ${
            isAdded
              ? 'bg-red-900/80 text-red-300 hover:bg-red-800 hover:text-red-200'
              : 'text-slate-900 hover:scale-110'
          }`}
          style={!isAdded ? { background: 'linear-gradient(135deg,#7a8fa6,#b8cad9)' } : {}}
          title={isAdded ? 'Убрать' : 'Добавить'}
        >
          {isAdded ? '−' : '+'}
        </button>
      </div>

      {/* Название + категория */}
      <div className="w-full px-2 py-1.5 text-center">
        <p className={`font-semibold text-slate-200 truncate leading-tight ${isSm ? 'text-[11px]' : 'text-xs'}`}>
          {ex.name}
        </p>
        {ex.category && (
          <p className="text-[9px] text-slate-500 mt-0.5 truncate">
            {icon} {ex.category}
          </p>
        )}
      </div>
    </div>
  )
}
