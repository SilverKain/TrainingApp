import { useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext.jsx'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// prop selectedDate: Date | null
// prop onDateSelect: (Date) => void
export default function Calendar({ selectedDate, onDateSelect }) {
  const { sessions, plannedWorkouts } = useWorkouts()
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  // Сессии → Set строк "YYYY-MM-DD"
  const sessionDays = new Set(
    sessions.map(s => dateKey(new Date(s.date)))
  )

  // Запланированные дни (у которых есть хоть одно упражнение)
  const plannedDays = new Set(
    Object.entries(plannedWorkouts)
      .filter(([, arr]) => arr.length > 0)
      .map(([k]) => k)
  )

  function prev() { setViewDate(new Date(year, month - 1, 1)) }
  function next() { setViewDate(new Date(year, month + 1, 1)) }

  const cells = []
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, month: month - 1, year, faded: true })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, month, year, faded: false })
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7)
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, month: month + 1, year, faded: true })

  const monthCount = sessions.filter(s => {
    const d = new Date(s.date)
    return d.getFullYear() === year && d.getMonth() === month
  }).length

  return (
    <div className="card">
      {/* Заголовок месяца */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev}
          className="text-slate-400 hover:text-slate-100 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/8 transition-colors text-xl font-bold">
          ‹
        </button>
        <div className="text-center">
          <span className="font-bold text-slate-100">{MONTHS[month]} {year}</span>
          {monthCount > 0 && (
            <span className="ml-2 text-xs text-slate-500">{monthCount} трен.</span>
          )}
        </div>
        <button onClick={next}
          className="text-slate-400 hover:text-slate-100 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/8 transition-colors text-xl font-bold">
          ›
        </button>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-slate-600 font-semibold py-1 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      {/* Ячейки */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, i) => {
          const cellDate = new Date(cell.year, cell.month, cell.day)
          const key = dateKey(cellDate)
          const isToday = isSameDay(cellDate, today)
          const isSelected = selectedDate && isSameDay(cellDate, selectedDate)
          const hasSession = !cell.faded && sessionDays.has(key)
          const hasPlanned = !cell.faded && plannedDays.has(key)

          let bgStyle = {}
          let borderStyle = 'none'
          let textColor = cell.faded ? '#1e293b' : '#94a3b8'

          if (isSelected) {
            bgStyle = { background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)' }
            textColor = '#0f172a'
          } else if (hasSession) {
            bgStyle = { background: 'rgba(140,165,190,0.18)' }
            textColor = '#b8cad9'
          } else if (isToday) {
            borderStyle = '1.5px solid rgba(160,185,210,0.5)'
            textColor = '#c8dce9'
          }

          return (
            <button
              key={i}
              disabled={cell.faded}
              onClick={() => !cell.faded && onDateSelect && onDateSelect(cellDate)}
              className={`relative flex flex-col items-center justify-center h-9 rounded-xl text-sm transition-all duration-150
                ${!cell.faded ? 'hover:bg-white/8 cursor-pointer active:scale-95' : 'cursor-default'}`}
              style={{
                ...bgStyle,
                border: borderStyle,
                color: textColor,
                fontWeight: isSelected || isToday ? 700 : undefined,
              }}
            >
              {cell.day}
              {/* Индикаторы */}
              <span className="absolute bottom-0.5 flex gap-0.5">
                {hasSession && (
                  <span className="w-1 h-1 rounded-full" style={{ background: isSelected ? '#1e293b' : '#7a9ab8' }} />
                )}
                {hasPlanned && !hasSession && (
                  <span className="w-1 h-1 rounded-full" style={{ background: isSelected ? '#1e293b' : '#a78bfa' }} />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Легенда */}
      <div className="flex gap-4 mt-3 text-[10px] text-slate-600 justify-end flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#7a9ab8' }} />
          Тренировка
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#a78bfa' }} />
          Запланировано
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ border: '1.5px solid rgba(160,185,210,0.5)' }} />
          Сегодня
        </span>
      </div>
    </div>
  )
}
