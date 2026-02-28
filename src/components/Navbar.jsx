const NAV_ITEMS = [
  { key: 'home',     label: 'Главная',  icon: '🏠' },
  { key: 'today',    label: 'Сегодня',  icon: '🏋️' },
  { key: 'theory',   label: 'Теория',   icon: '📚' },
  { key: 'progress', label: 'Прогресс', icon: '📈' },
]

const LOGO_STYLE = {
  background: 'linear-gradient(135deg, #b0c4d8 0%, #e2eaf2 60%, #8fa3ba 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}
const ACTIVE_BTN = {
  background: 'linear-gradient(135deg, #7a8fa6 0%, #b8cad9 50%, #7a8fa6 100%)',
  boxShadow: '0 2px 10px rgba(140,170,200,0.25)',
}

export default function Navbar({ page, setPage }) {
  const activePage = ['session', 'create'].includes(page) ? 'home' : page

  return (
    <>
      {/* ── Desktop top navbar ── */}
      <header
        className="hidden sm:block sticky top-0 z-30"
        style={{
          background: 'rgba(22,30,46,0.92)',
          borderBottom: '1px solid rgba(200,215,230,0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="text-base font-black tracking-widest select-none" style={LOGO_STYLE}>
            💪 FITTRACKER
          </span>
          <nav className="flex gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activePage === item.key
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
                style={activePage === item.key ? ACTIVE_BTN : {}}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Mobile: логотип вверху ── */}
      <header
        className="sm:hidden sticky top-0 z-30 flex items-center justify-center h-11"
        style={{
          background: 'rgba(22,30,46,0.95)',
          borderBottom: '1px solid rgba(200,215,230,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span className="text-sm font-black tracking-widest select-none" style={LOGO_STYLE}>
          💪 FITTRACKER
        </span>
      </header>

      {/* ── Mobile: таббар внизу ── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 flex"
        style={{
          background: 'rgba(18,25,40,0.97)',
          borderTop: '1px solid rgba(200,215,230,0.1)',
          backdropFilter: 'blur(16px)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.key
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative transition-colors duration-150"
              style={{ color: isActive ? '#b8cad9' : '#475569' }}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b-full"
                  style={{ background: 'linear-gradient(90deg,#7a8fa6,#b8cad9)' }} />
              )}
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide mt-0.5">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
