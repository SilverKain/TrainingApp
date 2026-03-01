const Card = ({ children, color = 'default' }) => {
  const bg = {
    default: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.08)' },
    blue:    { background: 'rgba(100,160,220,0.08)', border: '1px solid rgba(100,160,220,0.18)' },
    green:   { background: 'rgba(100,200,140,0.08)', border: '1px solid rgba(100,200,140,0.18)' },
    red:     { background: 'rgba(220,90,90,0.08)',   border: '1px solid rgba(220,90,90,0.18)' },
    orange:  { background: 'rgba(230,160,60,0.08)',  border: '1px solid rgba(230,160,60,0.18)' },
    purple:  { background: 'rgba(160,120,220,0.08)', border: '1px solid rgba(160,120,220,0.18)' },
  }
  return (
    <div className="p-3 rounded-xl text-xs text-slate-400 leading-relaxed" style={bg[color] ?? bg.default}>
      {children}
    </div>
  )
}

const Tag = ({ children }) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-300 mr-1 mb-1"
    style={{ background: 'rgba(120,150,200,0.2)', border: '1px solid rgba(120,150,200,0.25)' }}>
    {children}
  </span>
)

const Row = ({ icon, label, desc }) => (
  <div className="flex items-start gap-2.5 p-2.5 rounded-xl"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
    {icon && <span className="text-base flex-shrink-0">{icon}</span>}
    <div>
      <p className="text-xs font-bold text-slate-200">{label}</p>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
)

const sections = [
  // ─────────────────────────────────────────────
  //  БЛОК 1: КОНЦЕПЦИЯ
  // ─────────────────────────────────────────────
  {
    id: 1,
    icon: '🧠',
    title: 'Концепция: как на самом деле растут мышцы',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Мышца растёт не во время тренировки — она растёт <strong className="text-slate-100">после неё, в период отдыха</strong>.
          Тренировка — это контролируемый стресс, который запускает цепочку адаптаций.
        </p>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">3 механизма гипертрофии</p>
          {[
            ['⚡', 'Механическое напряжение', 'Основной стимул роста. Мышца работает против сопротивления в полной амплитуде — возникает натяжение миофибрилл, что запускает синтез белка.'],
            ['🔥', 'Метаболический стресс', '"Жжение" в мышце — накопление лактата и ионов водорода. Запускает выброс анаболических гормонов (ГР, ИФР-1).'],
            ['🔩', 'Мышечные микроповреждения', 'Микроразрывы саркомеров при эксцентрической фазе. Воспаление → ремонт → мышца становится толще.'],
          ].map(([icon, label, desc]) => <Row key={label} icon={icon} label={label} desc={desc} />)}
        </div>

        <Card color="blue">
          <strong className="text-slate-200">Суперкомпенсация</strong> — физиологический принцип, при котором после нагрузки и восстановления тело возвращается
          не просто к исходному уровню, а чуть выше него. Именно поэтому нельзя тренироваться каждый день без отдыха:
          ты будешь нагружать систему до того, как она успела компенсироваться.
        </Card>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ключевые условия роста</p>
          {[
            'Прогрессивная нагрузка — каждую неделю становится чуть тяжелее',
            'Достаточный белок — строительный материал для новой ткани',
            'Полноценный сон — 90% восстановления и гормонального синтеза происходит ночью',
            'Каlorийный профицит — без энергии тело не может строить',
            'Регулярность — минимум 2–3 раза в неделю на каждую мышечную группу',
          ].map(t => (
            <div key={t} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
              <p className="text-sm text-slate-400 leading-snug">{t}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: '📈',
    title: 'Прогрессивная перегрузка — единственный закон роста',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Тело быстро адаптируется к одной и той же нагрузке и перестаёт отвечать ростом.
          Нужно <strong className="text-slate-100">постоянно усложнять</strong> — это называется принцип прогрессивной перегрузки.
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            ['Повторения', '3×8 → 3×10 → 3×12 (потом переходишь на следующий уровень упражнения)'],
            ['Подходы', 'Добавить 1 подход к рабочим сетам через 3–4 недели'],
            ['Темп', 'Замедлить опускание: 2 сек → 3 сек → 4 сек (эксцентрик)'],
            ['Пауза', 'Держать нижнюю точку 1 → 2 → 3 секунды'],
            ['Диапазон', 'Углубить амплитуду движения (приседание выше → ниже)'],
            ['Сложность', 'Отжимания с колен → обычные → с ногами на возвышении'],
          ].map(([sp, ex]) => (
            <div key={sp} className="flex items-start gap-3 py-2 px-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,215,230,0.06)' }}>
              <span className="text-xs font-bold text-slate-300 w-28 flex-shrink-0 pt-0.5">{sp}</span>
              <span className="text-xs text-slate-400">{ex}</span>
            </div>
          ))}
        </div>
        <Card color="orange">
          <strong className="text-slate-200">Практило двух недель:</strong> если ты легко делаешь верхнюю границу повторений
          во всех подходах два занятия подряд — пора усложнять.
        </Card>
      </div>
    ),
  },

  // ─────────────────────────────────────────────
  //  БЛОК 2: БОЛЬШИЕ МЫШЕЧНЫЕ ГРУППЫ
  // ─────────────────────────────────────────────
  {
    id: 3,
    icon: '🔵',
    title: 'Большие мышечные группы — Overview',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Большие группы — это «двигатели» тела. Они производят максимальную силу и во многом определяют внешний вид.
          Именно с них нужно начинать тренировку и им уделять <strong className="text-slate-100">наибольший объём работы</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['🏔️', 'Спина', 'Самая большая группа. Квадратный метр мышечной ткани.'],
            ['🛡️', 'Грудь', 'Горизонтальный толчок. Визуально объёмная зона.'],
            ['🦵', 'Ноги', '70% мышечной массы тела — бёдра и ягодицы.'],
            ['🁢',  'Ягодицы', 'Самая мощная мышца тела. Критична для осанки и силы.'],
          ].map(([icon, label, desc]) => (
            <div key={label} className="flex items-start gap-2 p-2.5 rounded-xl"
              style={{ background: 'rgba(100,160,220,0.07)', border: '1px solid rgba(100,160,220,0.15)' }}>
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-200">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Card color="blue">
          <strong className="text-slate-200">Правило приоритета:</strong> большие группы тренируй в начале занятия, пока нервная система свежа.
          Тратить силы на бицепс до того, как поработала спина — ошибка новичка.
        </Card>
      </div>
    ),
  },
  {
    id: 4,
    icon: '🏔️',
    title: 'Спина — широчайшие, трапеции, ромбовидные, разгибатели',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Спина — самая сложная и объёмная группа. Состоит из нескольких слоёв мышц с разными функциями.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              name: '🦅 Широчайшие (latissimus dorsi)',
              func: 'Тянут руки вниз и к телу. Дают ширину спины — тот самый «треугольник».',
              train: 'Тяги вертикальные: подтягивания (любые варианты), тяга верхнего блока. Тяги горизонтальные: тяга штанги/гантели в наклоне, тяга Т-грифа.',
              note: 'Опускай лопатки вниз перед любой тягой — это включает широчайшие, а не бицепс.',
            },
            {
              name: '⛰️ Трапециевидная (trapezius)',
              func: 'Поднимает, опускает и сводит лопатки. Удерживает шею и плечевой пояс.',
              train: 'Шраги, тяги к подбородку, тяга штанги в наклоне. Верхняя трапеция перегружена у офисных работников — тренируй среднюю и нижнюю.',
              note: 'Своди лопатки в конце каждой горизонтальной тяги — финишная фаза нагружает трапецию.',
            },
            {
              name: '🔷 Ромбовидные',
              func: 'Сводят лопатки к позвоночнику. Ключевая мышца правильной осанки.',
              train: 'Горизонтальные тяги с «добивкой» лопаток. Тяга гантели одной рукой, тяга к поясу в тренажёре.',
              note: 'Слабые ромбовидные = сутулость. Включи 1–2 упражнения на сведение лопаток в каждую тренировку спины.',
            },
            {
              name: '🏛️ Разгибатели спины (erector spinae)',
              func: 'Держат позвоночник прямым. Работают во всех упражнениях стоя и в наклоне.',
              train: 'Гиперэкстензии, становая тяга, «Супермен». Работай в низком диапазоне повторений с акцентом на технику.',
              note: 'Не округляй поясницу — это травма-ловушка. Всегда нейтральный позвоночник.',
            },
          ].map(m => (
            <div key={m.name} className="p-3 rounded-xl flex flex-col gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.08)' }}>
              <p className="text-xs font-bold text-slate-200">{m.name}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Функция: </span>{m.func}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Как тренировать: </span>{m.train}</p>
              <p className="text-[11px] text-amber-500/80 mt-0.5">💡 {m.note}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          <Tag>2–3 упр. на тренировку</Tag><Tag>3–4 подхода</Tag><Tag>8–12 повторений</Tag><Tag>отдых 90–120 сек</Tag>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    icon: '🛡️',
    title: 'Грудные мышцы — большая и малая грудная',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Грудные — это горизонтальный толчок. Они работают при любом движении «от себя».
          Хорошо развитая грудь — один из главных визуальных маркеров телосложения.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              name: '🛡️ Большая грудная (pectoralis major)',
              func: 'Сводит руки перед телом, опускает и вращает плечо внутрь. Разделяют на верхний, средний и нижний пучки.',
              train: 'Верхний пучок: отжимания с ногами на возвышении, жим под углом 30–45°. Средний: классические отжимания. Нижний: отжимания с руками на возвышении.',
              note: 'Не разводи локти в стороны — грудные уйдут на второй план, нагрузка перейдёт на плечи.',
            },
            {
              name: '🔹 Малая грудная (pectoralis minor)',
              func: 'Стабилизирует лопатку. При хроническом укорочении тянет плечо вперёд → сутулость.',
              train: 'Работает при всех жимах. Специально тренировать не нужно — лучше растягивать (дверная растяжка).',
              note: 'Если сидишь за компьютером часами — малая грудная укорочена. Регулярно растягивай грудь.',
            },
          ].map(m => (
            <div key={m.name} className="p-3 rounded-xl flex flex-col gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.08)' }}>
              <p className="text-xs font-bold text-slate-200">{m.name}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Функция: </span>{m.func}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Как тренировать: </span>{m.train}</p>
              <p className="text-[11px] text-amber-500/80 mt-0.5">💡 {m.note}</p>
            </div>
          ))}
        </div>
        <Card color="blue">
          <strong className="text-slate-200">Техника отжиманий:</strong> тело — прямая доска, локти 45–60° к туловищу, грудь касается пола,
          полный выпрямление рук наверху. Медленное опускание = больше стимул для роста.
        </Card>
        <div className="flex flex-wrap gap-1">
          <Tag>2 упр. на тренировку</Tag><Tag>3–4 подхода</Tag><Tag>8–15 повторений</Tag><Tag>отдых 60–90 сек</Tag>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    icon: '🦵',
    title: 'Квадрицепс и бицепс бедра — передняя и задняя поверхность',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Мышцы бедра — самые массивные в теле. Их тренировка даёт максимальный гормональный отклик
          (тестостерон, ГР) — что напрямую ускоряет рост <em>всего</em> тела, не только ног.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              name: '🔴 Квадрицепс (quadriceps femoris)',
              func: '4 мышцы на передней поверхности бедра. Разгибают колено — главная функция при приседании, беге, прыжках.',
              train: 'Приседания (все варианты), выпады, зашагивания на возвышение. Работай в глубокую амплитуду (ниже параллели) — это включает весь квадрицепс.',
              note: 'Колено при приседании должно идти в сторону мизинца стопы. Внутреннее заваливание — путь к травме.',
            },
            {
              name: '🔵 Бицепс бедра (hamstrings)',
              func: '3 мышцы на задней поверхности. Сгибают колено и разгибают бедро. Часто отстают у новичков.',
              train: 'Мёртвая тяга на прямых ногах, гиперэкстензии, сгибания лёжа. Тяга всегда принципиальна для бицепса бедра.',
              note: 'Дисбаланс квадрицепс > бицепс бедра — главная причина травм колена у спортсменов. Тренируй равномерно.',
            },
          ].map(m => (
            <div key={m.name} className="p-3 rounded-xl flex flex-col gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.08)' }}>
              <p className="text-xs font-bold text-slate-200">{m.name}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Функция: </span>{m.func}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Как тренировать: </span>{m.train}</p>
              <p className="text-[11px] text-amber-500/80 mt-0.5">💡 {m.note}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <Tag>2–3 упр. на тренировку</Tag><Tag>3–4 подхода</Tag><Tag>8–15 повторений</Tag><Tag>отдых 120 сек</Tag>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    icon: '🍑',
    title: 'Ягодичные мышцы — самая мощная мышца тела',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Большая ягодичная — самая крупная мышца тела. Она разгибает бедро, стабилизирует таз и влияет
          на каждое движение стоя. <strong className="text-slate-100">Слабые ягодицы = боль в пояснице и нестабильность колена.</strong>
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              name: 'Большая ягодичная (gluteus maximus)',
              func: 'Разгибание бедра (встать из приседа, толчок в беге). Самый мощный разгибатель тела.',
              train: 'Приседания, становая тяга, ягодичный мостик, болгарские сплит-приседания. Лучший изолят — ягодичный мостик.',
            },
            {
              name: 'Средняя и малая ягодичные',
              func: 'Отведение бедра и стабилизация таза при ходьбе и беге. Слабость → «падение» таза на шаге.',
              train: 'Ходьба с резинкой, боковые шаги, ягодичный мостик одной ногой, упражнение «пожарный гидрант».',
            },
          ].map(m => (
            <div key={m.name} className="p-3 rounded-xl flex flex-col gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.08)' }}>
              <p className="text-xs font-bold text-slate-200">{m.name}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Функция: </span>{m.func}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Как тренировать: </span>{m.train}</p>
            </div>
          ))}
        </div>
        <Card color="orange">
          <strong className="text-slate-200">«Амнезия ягодиц»</strong> — синдром, при котором после долгого сидения ягодицы перестают правильно
          включаться. Перед тренировкой ног выполни 2–3 активационных упражнения на ягодицы (мини-мост, разведение лёжа).
        </Card>
        <div className="flex flex-wrap gap-1">
          <Tag>2–3 упр. на тренировку</Tag><Tag>3–4 подхода</Tag><Tag>10–20 повторений</Tag>
        </div>
      </div>
    ),
  },

  // ─────────────────────────────────────────────
  //  БЛОК 3: СРЕДНИЕ МЫШЕЧНЫЕ ГРУППЫ
  // ─────────────────────────────────────────────
  {
    id: 8,
    icon: '🟡',
    title: 'Средние мышечные группы — плечи, бицепс, трицепс',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Средние группы работают ассистентами в базовых движениях — плечи во всех жимах и тягах,
          бицепс во всех тягах, трицепс во всех жимах.
        </p>
        <Card color="orange">
          <strong className="text-slate-200">Ошибка новичка</strong> — тратить половину тренировки на бицепс, не уделяя времени спине или ногам.
          Бицепс и трицепс получают достаточный стимул при качественной работе на спину и грудь.
          Изоляция нужна лишь как дополнение.
        </Card>
      </div>
    ),
  },
  {
    id: 9,
    icon: '🔶',
    title: 'Плечи — три головки дельтовидной мышцы',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Дельтовидная состоит из 3 пучков с почти противоположными функциями. Для округлых плеч
          нужно прорабатывать <strong className="text-slate-100">все три</strong>.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { name: '🔴 Передний пучок', func: 'Поднимает руку вперёд', train: 'Жим вертикальный, подъём перед собой. Как правило перегружён — у большинства развит лучше остальных.', note: 'Особо не акцентируй — он работает во всех жимах.' },
            { name: '🔵 Средний пучок', func: 'Отводит руку в сторону', train: 'Подъёмы гантелей через стороны, тяга к подбородку широким хватом. Именно этот пучок даёт «ширину» плеч.', note: 'Приоритет! 2–3 упражнения в неделю.' },
            { name: '🟢 Задний пучок', func: 'Отводит руку назад', train: 'Разводки в наклоне, горизонтальный жим обратным хватом, лицевые тяги.', note: 'Самый забытый и слабый у новичков. Критичен для здоровья плечевого сустава.' },
          ].map(m => (
            <div key={m.name} className="p-3 rounded-xl flex flex-col gap-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.08)' }}>
              <p className="text-xs font-bold text-slate-200">{m.name}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Функция: </span>{m.func}</p>
              <p className="text-[11px] text-slate-400"><span className="text-slate-500">Как тренировать: </span>{m.train}</p>
              <p className="text-[11px] text-amber-500/80 mt-0.5">💡 {m.note}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <Tag>2 упр. на тренировку</Tag><Tag>3 подхода</Tag><Tag>10–15 повторений</Tag><Tag>отдых 60 сек</Tag>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    icon: '💪',
    title: 'Бицепс — двуглавая мышца плеча',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Бицепс — небольшая мышца, которая часто получает непропорционально много внимания.
          Функционально он <strong className="text-slate-100">сгибает предплечье и супинирует его</strong> (проворачивает ладонь вверх).
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            ['Длинная головка', 'Наружная часть. Даёт «пик» бицепса при напряжении. Работает при узком хвате и нейтральном хвате.'],
            ['Короткая головка', 'Внутренняя часть. Даёт ширину. Работает при широком хвате.'],
            ['Плечевая мышца (брахиалис)', 'Под бицепсом. При развитии «выталкивает» бицепс вверх, делая руку визуально больше. Хорошо работает при нейтральном хвате.'],
          ].map(([name, desc]) => (
            <div key={name} className="flex items-start gap-2 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <div>
                <p className="text-xs font-bold text-slate-200">{name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Card color="blue">
          <strong className="text-slate-200">Главное правило подъёма:</strong> локоть неподвижен, движение только в предплечье.
          В верхней точке — небольшое «скручивание» ладони наружу для пикового сокращения.
        </Card>
        <div className="flex flex-wrap gap-1">
          <Tag>1–2 упр.</Tag><Tag>3 подхода</Tag><Tag>10–15 повторений</Tag><Tag>отдых 60 сек</Tag>
        </div>
      </div>
    ),
  },
  {
    id: 11,
    icon: '🦾',
    title: 'Трицепс — трёхглавая мышца плеча',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Трицепс составляет <strong className="text-slate-100">~2/3 объёма руки</strong>. Именно он отвечает за «толщину» руки.
          Функция — разгибание локтя при любом жимовом движении.
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            ['Длинная головка', 'Самая большая. Работает при вертикальных движениях (голова за ухом). Пример: французский жим стоя.'],
            ['Медиальная + латеральная головки', 'Работают при всех отжиманиях и жимах. Хорошо включаются в узкой постановке рук.'],
          ].map(([name, desc]) => (
            <div key={name} className="flex items-start gap-2 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <div>
                <p className="text-xs font-bold text-slate-200">{name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Card color="green">
          Хочешь большие руки — <strong className="text-slate-200">фокусируйся на трицепсе</strong>, а не на бицепсе.
          Включи в рутину отжимания узким хватом и отжимания на брусьях.
        </Card>
        <div className="flex flex-wrap gap-1">
          <Tag>1–2 упр.</Tag><Tag>3 подхода</Tag><Tag>10–15 повторений</Tag><Tag>отдых 60 сек</Tag>
        </div>
      </div>
    ),
  },

  // ─────────────────────────────────────────────
  //  БЛОК 4: МЕЛКИЕ И СТАБИЛИЗИРУЮЩИЕ
  // ─────────────────────────────────────────────
  {
    id: 12,
    icon: '🔩',
    title: 'Мелкие и стабилизирующие мышцы',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Мелкие мышцы не дают визуального объёма, но они — <strong className="text-slate-100">«болты» конструкции</strong>.
          Без них крупные мышцы работают неэффективно и опасно.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { icon: '🧱', name: 'Кор (пресс + поперечная + мультифидус)', desc: 'Стабилизирует позвоночник при каждом упражнении. Слабый кор = боль в пояснице. Планка, птица-собака, dead bug — обязательны.' },
            { icon: '🔄', name: 'Ротаторная манжета плеча', desc: '4 мышцы вокруг плечевого сустава. Удерживают головку плеча. Слабость → импинджмент при жимах. Тренируй внешние вращения с резинкой.' },
            { icon: '🦶', name: 'Икроножная + камбаловидная', desc: 'Подъёмы на носки. Икры работают в беге, прыжках, удержании баланса. Требуют высокого объёма (15–25 повторений).' },
            { icon: '✋', name: 'Предплечья и кисти', desc: 'Сила хвата ограничивает результаты в тягах. Тренируются косвенно при любой тяге. Вис на турнике — лучшая изоляция.' },
          ].map(m => <Row key={m.name} icon={m.icon} label={m.name} desc={m.desc} />)}
        </div>
        <Card color="purple">
          <strong className="text-slate-200">Практично:</strong> добавь 5–10 минут работы на стабилизаторы в конце каждой тренировки или в разминку.
          Это страховка от травм и фундамент для роста рабочих весов.
        </Card>
      </div>
    ),
  },

  // ─────────────────────────────────────────────
  //  БЛОК 5: ПИТАНИЕ
  // ─────────────────────────────────────────────
  {
    id: 13,
    icon: '🍽️',
    title: 'Питание для набора массы — базовые принципы',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Мышцы не берутся из воздуха. Для роста нужен <strong className="text-slate-100">каlorийный профицит</strong> — потреблять
          чуть больше, чем тратишь — и достаточно строительного материала (белка).
        </p>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Шаг 1 — Считаем калории</p>
          <Card color="blue">
            <p className="mb-1"><strong className="text-slate-200">Базовый обмен (BMR):</strong> масса тела (кг) × 22 = примерный BMR</p>
            <p className="mb-1"><strong className="text-slate-200">Уровень активности × коэффициент:</strong></p>
            <p>Малоактивный: BMR × 1.3 | Тренировки 3×/нед: BMR × 1.55 | Ежедневно: BMR × 1.75</p>
            <p className="mt-1"><strong className="text-slate-200">Профицит для массы:</strong> +200–400 ккал/день</p>
            <p className="mt-1 text-slate-500">Пример: 75 кг → BMR ≈ 1650, при тренировках 3×/нед × 1.55 = 2557 + 300 = <strong className="text-slate-300">~2850 ккал</strong></p>
          </Card>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Шаг 2 — Белки, жиры, углеводы</p>
          {[
            { icon: '🥩', label: 'Белок', value: '2–2.5 г / кг веса', desc: 'Говядина, курица, рыба, яйца, творог, бобовые, сывороточный протеин. Главный строительный материал мышечной ткани.' },
            { icon: '🍚', label: 'Углеводы', value: '4–6 г / кг веса', desc: 'Рис, гречка, овсянка, картофель, хлеб. Основной источник энергии для тренировок. Делай акцент на сложные углеводы.' },
            { icon: '🫒', label: 'Жиры', value: '1–1.2 г / кг веса', desc: 'Оливковое масло, орехи, авокадо, жирная рыба. Нужны для синтеза тестостерона и восстановления суставов. Не убирай жиры!' },
          ].map(n => <Row key={n.label} icon={n.icon} label={`${n.label} — ${n.value}`} desc={n.desc} />)}
        </div>
      </div>
    ),
  },
  {
    id: 14,
    icon: '⏰',
    title: 'Питание вокруг тренировки — время имеет значение',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Время приёма пищи влияет на качество тренировки, восстановление и скорость роста.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { time: '⏪ За 1.5–2 часа до', tag: 'Предтрен', bg: 'rgba(100,160,220,0.08)', border: 'rgba(100,160,220,0.2)',
              items: ['Сложные углеводы (100–150 г): каша, рис, картофель', 'Белок (20–30 г): куриная грудка, яйца, творог', 'Минимум жиров — замедляют усвоение', 'Небольшая порция, чтобы не тяжело'] },
            { time: '⏩ Через 30–60 мин после', tag: 'Посттрен', bg: 'rgba(100,200,140,0.08)', border: 'rgba(100,200,140,0.2)',
              items: ['Быстрый белок (30–40 г): творог, яйца, протеиновый коктейль', 'Углеводы (40–60 г): рис, банан, хлеб', 'Это «анаболическое окно» — мышцы максимально восприимчивы к нутриентам', 'Пить воду — не менее 500 мл после тренировки'] },
          ].map(block => (
            <div key={block.tag} className="p-3 rounded-xl"
              style={{ background: block.bg, border: `1px solid ${block.border}` }}>
              <p className="text-xs font-bold text-slate-200 mb-2">{block.time}</p>
              {block.items.map(item => (
                <div key={item} className="flex items-start gap-2 mb-1">
                  <span className="text-slate-500 mt-0.5 flex-shrink-0">•</span>
                  <p className="text-[11px] text-slate-400">{item}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Card>
          <strong className="text-slate-200">Самое важное:</strong> если нет возможности поесть ровно «по протоколу» — ничего страшного.
          Общий суточный белок и калории важнее строгого тайминга.
        </Card>
      </div>
    ),
  },
  {
    id: 15,
    icon: '💊',
    title: 'Добавки — что реально работает',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong className="text-slate-100">90% добавок — маркетинг.</strong> Есть лишь несколько, эффективность которых
          подтверждена серьёзными исследованиями. Сначала — еда и режим. Добавки идут поверх.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { icon: '🥛', name: 'Сывороточный протеин', rating: '★★★★★', desc: 'Просто удобный источник белка. Пьёшь когда не добираешь белка из еды. Не «магия» — обычный белок.' },
            { icon: '⚡', name: 'Креатин моногидрат', rating: '★★★★★', desc: '3–5 г в день. Лучшая добавка с доказанной базой. Увеличивает силу на 5–15%, ускоряет восстановление. Безопасен. Принимай ежедневно, вне зависимости от тренировки.' },
            { icon: '☀️', name: 'Витамин D3 + K2', rating: '★★★★☆', desc: 'Большинство людей в дефиците. Влияет на тестостерон, иммунитет, настроение. 2000–5000 МЕ D3 + 100–200 мкг K2 ежедневно.' },
            { icon: '🐟', name: 'Омега-3', rating: '★★★★☆', desc: 'Снижает воспаление, ускоряет восстановление мышц, улучшает работу суставов. 2–3 г EPA+DHA в день из жирной рыбы или добавки.' },
            { icon: '😴', name: 'Магний (глицинат/малат)', rating: '★★★☆☆', desc: 'Улучшает качество сна и снижает судороги в мышцах. 300–400 мг перед сном.' },
          ].map(s => (
            <div key={s.name} className="flex items-start gap-2.5 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <span className="text-base flex-shrink-0">{s.icon}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-slate-200">{s.name}</p>
                  <span className="text-[10px] text-amber-400">{s.rating}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Card color="red">
          <strong className="text-slate-200">Что пропустить:</strong> L-карнитин, жиросжигатели, предтренировочные комплексы с кофеином, BCAA (бесполезны при достаточном белке),
          гейнеры (лучше есть реальную еду). Это деньги на ветер.
        </Card>
      </div>
    ),
  },
  {
    id: 16,
    icon: '💧',
    title: 'Вода, сон и восстановление — триада результата',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Тренировки создают стимул. <strong className="text-slate-100">Рост происходит в покое.</strong> Без правильного восстановления
          ты разрушаешь больше, чем строишь.
        </p>
        <div className="flex flex-col gap-1.5">
          <Row icon="😴" label="Сон — 7–9 часов в темноте" desc="Пик выброса гормона роста — первые 2 часа после засыпания. Недосыпание повышает кортизол (антагонист тестостерона), снижает синтез белка на 18–20%. Одна плохая ночь = потеря силы на 30%." />
          <Row icon="💧" label="Вода — 35–40 мл / кг + 500–700 мл в дни тренировок" desc="Мышца на 75% состоит из воды. Даже 2% обезвоживания снижают силу и ухудшают работу суставов. Пей равномерно весь день, а не разово большими порциями." />
          <Row icon="🚶" label="Активное восстановление" desc="В дни отдыха — лёгкие прогулки 20–40 мин. Улучшают кровоток, ускоряют вывод продуктов метаболизма из мышц, снижают крепатуру." />
          <Row icon="🧊" label="Холод и тепло" desc="Холодный душ через 30–60 мин после тренировки снижает воспаление и DOMS. Тепловые процедуры (ванна, баня) лучше в дни отдыха для расслабления." />
        </div>
        <Card color="green">
          <strong className="text-slate-200">Золотое правило восстановления:</strong> большая мышечная группа (спина, грудь, ноги)
          восстанавливается 48–72 часа. Никогда не тренируй ту же группу раньше, чем через 2 дня.
        </Card>
      </div>
    ),
  },
  {
    id: 17,
    icon: '📋',
    title: 'Практический план питания на неделю',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-slate-300 text-sm leading-relaxed">
          Пример рациона для человека 75–80 кг, цель — набор массы (~2800–3000 ккал/день, ~160 г белка).
        </p>
        <div className="flex flex-col gap-2">
          {[
            { meal: '☀️ Завтрак', time: '7:00–8:00', foods: ['Овсянка 100 г — 350 ккал', 'Яйца 3 шт — 220 ккал', 'Молоко 200 мл — 120 ккал', 'Банан — 90 ккал'], total: '~780 ккал | 35 г белка' },
            { meal: '🍱 Обед', time: '12:00–13:00', foods: ['Куриное бедро 200 г — 340 ккал', 'Рис варёный 200 г — 260 ккал', 'Овощи + масло — 100 ккал'], total: '~700 ккал | 45 г белка' },
            { meal: '🏋️ Предтрен', time: '15:30–16:00', foods: ['Гречка 100 г — 340 ккал', 'Творог 150 г — 190 ккал'], total: '~530 ккал | 40 г белка' },
            { meal: '💪 Посттрен', time: '18:00–18:30', foods: ['Протеин или 200 г творога — 200 ккал', 'Рис 150 г — 200 ккал', 'Фрукт — 80 ккал'], total: '~480 ккал | 40 г белка' },
            { meal: '🌙 Ужин', time: '20:00–21:00', foods: ['Говядина / рыба 180 г — 300 ккал', 'Картофель запечённый 200 г — 180 ккал', 'Салат с маслом — 80 ккал'], total: '~560 ккал | 38 г белка' },
          ].map(m => (
            <div key={m.meal} className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,215,230,0.07)' }}>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <p className="text-xs font-bold text-slate-200">{m.meal}</p>
                <span className="text-[10px] text-slate-500">{m.time}</span>
              </div>
              {m.foods.map(f => (
                <p key={f} className="text-[11px] text-slate-500 leading-relaxed">· {f}</p>
              ))}
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 pt-1.5"
                style={{ borderTop: '1px solid rgba(200,215,230,0.07)' }}>{m.total}</p>
            </div>
          ))}
        </div>
        <Card color="green">
          <strong className="text-slate-200">Итого за день:</strong> ~3050 ккал | ~198 г белка | ~380 г углеводов | ~80 г жиров.
          Адаптируй порции под свой вес и скорость набора. Растёшь медленно — добавь приём пищи.
        </Card>
      </div>
    ),
  },
  {
    id: 18,
    icon: '📖',
    title: 'Термины и словарь тренирующегося',
    content: (
      <div className="flex flex-col gap-1.5">
        {[
          ['Гипертрофия', 'Рост мышечного волокна в диаметре в ответ на тренировочный стресс'],
          ['Суперкомпенсация', 'Адаптация тела выше исходного уровня после восстановления'],
          ['Подход (сет)', 'Серия повторений без остановки'],
          ['Рабочий подход', 'Подход с нагрузкой, близкой к максимальной (не разминочный)'],
          ['РПЕ (RPE)', 'Шкала воспринимаемого усилия 1–10. RPE 8 = мог бы ещё 2 повторения.'],
          ['Темп', '2-1-2: 2 сек опускание, 1 сек пауза, 2 сек подъём'],
          ['Эксцентрик', 'Фаза опускания / удлинения мышцы. Основной стимул для роста.'],
          ['Концентрик', 'Фаза подъёма / сокращения мышцы'],
          ['Изометрия', 'Удержание позиции без движения (планка, стул у стены)'],
          ['Суперсет', 'Два упражнения подряд без отдыха между ними'],
          ['Дроп-сет', 'После отказа снизить вес на 20–30% и продолжить'],
          ['DOMS', 'Отсроченная мышечная болезненность: крепатура через 12–48 ч'],
          ['Кор', 'Глубокие мышцы туловища: пресс, поперечная мышца живота, мультифидус'],
          ['ПАП', 'Постактивационная потенциация: временный прирост силы после тяжёлого усилия'],
          ['Натуральный потолок', 'Генетически ограниченный максимум мышечной массы без фармакологии'],
        ].map(([term, def]) => (
          <div key={term} className="flex items-start gap-3 py-2 px-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,215,230,0.06)' }}>
            <span className="text-xs font-bold text-slate-300 w-36 flex-shrink-0 pt-0.5">{term}</span>
            <span className="text-xs text-slate-500">{def}</span>
          </div>
        ))}
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
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">📚 Теория набора массы</h1>
        <p className="text-slate-500 text-sm mt-1">
          Концепция гипертрофии · Все мышечные группы · Питание и восстановление
        </p>
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
