const sections = [
  {
    id: 1,
    icon: '🎯',
    title: 'Зачем тренироваться?',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Тело человека устроено просто: <strong className="text-slate-100">что не используется — слабеет, что нагружается — укрепляется</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['💪', 'Мышечная масса', 'Гипертрофия за счёт прогрессивной нагрузки'],
            ['⚡', 'Сила', 'Бытовая нагрузка даётся значительно легче'],
            ['🧘', 'Мобильность', 'Суставы и связки остаются здоровыми'],
            ['🧍', 'Осанка', 'Мышцы держат позвоночник правильно'],
            ['🔋', 'Энергия', 'Больше мышц = выше основной обмен'],
            ['🧠', 'Ментальное здоровье', 'Тренировки снижают уровень стресса'],
          ].map(([icon, label, desc]) => (
            <div key={label} className="flex items-start gap-2 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <span className="text-base mt-0.5">{icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-200">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: '🔄',
    title: 'Принцип адаптации',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Когда ты нагружаешь тело, оно воспринимает это как стресс и <strong className="text-slate-100">адаптируется</strong> — становится сильнее.
          Это называется <strong className="text-slate-100">суперкомпенсация</strong>.
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['Нагрузка', '→', 'Усталость', '→', 'Восстановление', '→', 'Стал сильнее'].map((s, i) => (
            s === '→'
              ? <span key={i} className="text-slate-600 font-bold">→</span>
              : <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-200"
                  style={{ background: 'rgba(120,150,190,0.15)', border: '1px solid rgba(120,150,190,0.2)' }}>{s}</span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          {[
            'Отдых между тренировками — это не лень, это часть роста',
            'Нельзя тренироваться каждый день без восстановления',
            'Нагрузка должна постепенно расти, иначе тело перестаёт адаптироваться',
          ].map(t => (
            <div key={t} className="flex items-start gap-2">
              <span className="text-slate-500 mt-0.5">•</span>
              <p className="text-sm text-slate-400 leading-snug">{t}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: '📈',
    title: 'Прогрессия нагрузки',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-400 text-sm leading-relaxed">
          Если делать одно и то же вечно — тело адаптируется и прогресс остановится. Способы усложнить:
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            ['Повторения', '8 → 10 → 12 повторений'],
            ['Подходы', '3 → 4 → 5 подходов'],
            ['Сложность', 'Более тяжёлые гантели, усложненные варианты'],
            ['Упражнение', 'Отжимания с колен → обычные → с ногами на возвышении'],
            ['Темп', '2-1-2 → 3-1-3 (сек вниз-пауза-вверх)'],
            ['Изометрия', 'Пауза в нижней точке 2–3 секунды'],
          ].map(([sp, ex]) => (
            <div key={sp} className="flex items-start gap-3 py-2 px-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,215,230,0.06)' }}>
              <span className="text-xs font-bold text-slate-400 w-24 flex-shrink-0 pt-0.5">{sp}</span>
              <span className="text-xs text-slate-400">{ex}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 italic px-1">
          В этом курсе прогрессия расписана для каждого месяца — тебе не нужно думать, как усложнить.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    icon: '😴',
    title: 'Восстановление мышц',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          После тренировки в мышцах появляются микроповреждения. Во время отдыха организм восстанавливает их и делает чуть прочнее — это и есть <strong className="text-slate-100">рост мышц</strong>.
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            ['😴', 'Сон', 'Основной процесс восстановления идёт ночью. Минимум 7–8 часов.'],
            ['🥩', 'Белок', 'Строительный материал для мышц: мясо, рыба, яйца, бобовые'],
            ['💧', 'Вода', 'Обезвоживание замедляет всё'],
            ['🚶', 'Лёгкое движение', 'Прогулки в дни отдыха улучшают кровоток'],
            ['🧘', 'Без стресса', 'Хронический стресс тормозит восстановление'],
          ].map(([icon, label, desc]) => (
            <div key={label} className="flex items-start gap-2.5 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <span className="text-base">{icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-200">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(120,190,150,0.08)', border: '1px solid rgba(120,190,150,0.15)' }}>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Крепатура</strong> — болезненность через 12–48 ч после тренировки — нормальна для новичка.
            Лёгкая крепатура — хороший знак. Сильная боль — знак, что нагружено слишком много.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    icon: '⚠️',
    title: 'Почему важна техника',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Плохая техника — главная причина травм у новичков. Нагрузка уходит не в целевую мышцу, а в суставы и связки.
        </p>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(200,100,100,0.08)', border: '1px solid rgba(220,100,100,0.15)' }}>
          <p className="text-xs font-bold text-slate-200 mb-1">🏅 Золотое правило</p>
          <p className="text-xs text-slate-400">Лучше сделать 8 повторений идеальной техникой, чем 15 — кое-как.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['🦴', 'Позвоночник', 'Нейтральное положение, не округлять спину'],
            ['🦵', 'Колени', 'Не заваливать внутрь'],
            ['🫁', 'Дыхание', 'Усилие — выдох, возврат — вдох'],
            ['🙆', 'Шея', 'Не задирать и не опускать голову'],
          ].map(([icon, label, desc]) => (
            <div key={label} className="p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <p className="text-xs font-bold text-slate-200 mb-0.5">{icon} {label}</p>
              <p className="text-[11px] text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 6,
    icon: '🌅',
    title: 'Почему разминка обязательна',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Холодные мышцы и суставы — как холодная резина. Менее эластичны и более склонны к повреждениям.
        </p>
        <p className="text-sm font-semibold text-slate-300">Разминка за 5–10 минут:</p>
        <div className="flex flex-col gap-1.5">
          {[
            'Повышает температуру тела и мышц',
            'Улучшает кровообращение',
            'Активирует нервно-мышечные связи',
            'Смазывает суставы (синовиальная жидкость)',
            'Психологически настраивает на тренировку',
          ].map(t => (
            <div key={t} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7a9fc0' }} />
              <p className="text-sm text-slate-400">{t}</p>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(120,150,200,0.08)', border: '1px solid rgba(120,150,200,0.15)' }}>
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Никогда не пропускай разминку</strong>, даже если торопишься.
            Лучше сократить основную часть, чем разминку.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    icon: '📅',
    title: 'Принцип регулярности',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Оптимально для новичка: <strong className="text-slate-100">3 тренировки в неделю</strong> с днями отдыха между ними.
        </p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {[
            { day: 'Пн', type: 'train' }, { day: 'Вт', type: 'rest' },
            { day: 'Ср', type: 'train' }, { day: 'Чт', type: 'rest' },
            { day: 'Пт', type: 'train' }, { day: 'Сб', type: 'light' }, { day: 'Вс', type: 'rest' },
          ].map(({ day, type }) => (
            <div key={day} className="flex flex-col items-center gap-1 py-2 rounded-xl"
              style={{
                background: type === 'train' ? 'rgba(100,160,200,0.15)'
                  : type === 'light' ? 'rgba(160,200,120,0.1)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${type === 'train' ? 'rgba(100,160,200,0.25)'
                  : type === 'light' ? 'rgba(160,200,120,0.15)'
                  : 'rgba(200,215,230,0.07)'}`,
              }}>
              <span className="text-[10px] font-bold text-slate-400">{day}</span>
              <span className="text-base">{type === 'train' ? '💪' : type === 'light' ? '🚶' : '😴'}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(120,150,200,0.08)', border: '1px solid rgba(120,150,200,0.15)' }}>
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Регулярность важнее интенсивности.</strong> Спокойные тренировки 3 раза в неделю дадут больше, чем одна изматывающая тренировка раз в неделю.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    icon: '🍽️',
    title: 'Питание и сон — основа всего',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Тренировки — это лишь <strong className="text-slate-100">30% результата</strong>. Остальные 70% — восстановление, питание и сон.
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            ['🕐', 'Сон', 'Минимум 7–8 часов. Основное гормональное восстановление — в первые 3–4 часа.'],
            ['🥩', 'Белок', '2–2,5 г на кг веса тела — главный строительный материал'],
            ['🍚', 'Углеводы', '50–60% рациона — энергия для тренировок и восстановления'],
            ['🫒', 'Жиры', '25–30% рациона — гормоны, суставы, мозг'],
            ['💧', 'Вода', '35–40 мл/кг; +500–700 мл в дни тренировок'],
            ['📊', 'Калории', 'Для роста мышц: профицит +200–400 ккал от нормы'],
          ].map(([icon, label, desc]) => (
            <div key={label} className="flex items-start gap-2.5 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <span className="text-base">{icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-200">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Питание вокруг тренировки</p>
          <div className="flex gap-2">
            <div className="flex-1 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <p className="text-[10px] font-bold text-slate-400 mb-1">За 1–1,5 часа до</p>
              <p className="text-[11px] text-slate-500">Углеводы + немного белка: каша с творогом, хлеб с яйцами</p>
            </div>
            <div className="flex-1 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <p className="text-[10px] font-bold text-slate-400 mb-1">Через 30–60 мин после</p>
              <p className="text-[11px] text-slate-500">Быстрый белок + углеводы: творог, мясо + рис, картофель</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    icon: '📖',
    title: 'Терминология курса',
    content: (
      <div className="flex flex-col gap-1.5">
        {[
          ['Подход (сет)', 'Серия повторений без остановки'],
          ['Повторение (реп)', 'Одно выполнение упражнения от начала до конца'],
          ['Отдых', 'Пауза между подходами'],
          ['Суперсет', 'Два упражнения подряд без отдыха между ними'],
          ['Темп', 'Скорость выполнения: 2-1-2 = 2 сек вниз, 1 пауза, 2 вверх'],
          ['Изометрия', 'Удержание позиции без движения (планка, стул у стены)'],
          ['Заминка', 'Лёгкие упражнения + растяжка после тренировки'],
          ['ПЗМ', 'Полная амплитуда движения'],
          ['ОФП', 'Общая физическая подготовка'],
        ].map(([term, def]) => (
          <div key={term} className="flex items-start gap-3 py-2 px-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,215,230,0.06)' }}>
            <span className="text-xs font-bold text-slate-300 w-32 flex-shrink-0 pt-0.5">{term}</span>
            <span className="text-xs text-slate-500">{def}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 10,
    icon: '🚫',
    title: 'Когда НЕ тренироваться',
    content: (
      <div className="flex flex-col gap-2">
        {[
          'Поднялась температура (любое ОРВИ, грипп)',
          'Острая боль в суставах или мышцах (не крепатура, а именно острая)',
          'Сильное головокружение или слабость',
          'После любой операции — только с разрешения врача',
          'Сильное обострение хронических заболеваний',
        ].map(t => (
          <div key={t} className="flex items-start gap-2.5 p-2.5 rounded-xl"
            style={{ background: 'rgba(220,80,80,0.07)', border: '1px solid rgba(220,80,80,0.15)' }}>
            <span className="text-sm mt-0.5">❌</span>
            <p className="text-sm text-slate-400 leading-snug">{t}</p>
          </div>
        ))}
        <div className="p-3 rounded-xl mt-1" style={{ background: 'rgba(120,150,200,0.08)', border: '1px solid rgba(120,150,200,0.15)' }}>
          <p className="text-xs text-slate-400">
            Пара пропущенных тренировок не убьёт прогресс. А вот тренировка через боль или болезнь — может причинить серьёзный вред.
          </p>
        </div>
      </div>
    ),
  },
]

import { useState } from 'react'

export default function Theory() {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-4">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">📚 Теория тренировок</h1>
        <p className="text-slate-500 text-sm mt-1">Прочитай перед первой тренировкой. Здесь всё, что нужно знать новичку.</p>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map(section => {
          const isOpen = openId === section.id
          return (
            <div key={section.id}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${isOpen ? 'rgba(120,150,200,0.25)' : 'rgba(200,215,230,0.1)'}`,
                boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
              }}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                style={{ background: isOpen ? 'rgba(120,150,200,0.08)' : 'transparent' }}
                onClick={() => setOpenId(isOpen ? null : section.id)}
              >
                <span className="text-xl w-8 flex-shrink-0 text-center">{section.icon}</span>
                <span className="flex-1 font-semibold text-sm text-slate-100">{section.id}. {section.title}</span>
                <span className="text-slate-500 text-sm font-bold transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1">
                  {section.content}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
