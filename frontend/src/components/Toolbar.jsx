import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react'

// Extended formation database - 30+ formations without emojis
const FORMATION_CATEGORIES = [
  {
    name: 'Attacking',
    formations: [
      { id: '4-3-3', name: '4-3-3' },
      { id: '4-3-3-attack', name: '4-3-3 Attack' },
      { id: '3-4-3', name: '3-4-3' },
      { id: '4-2-4', name: '4-2-4' },
      { id: '3-3-4', name: '3-3-4' },
      { id: '4-3-3-holding', name: '4-3-3 Holding' },
      { id: '3-4-3-diamond', name: '3-4-3 Diamond' },
    ]
  },
  {
    name: 'Balanced',
    formations: [
      { id: '4-2-3-1', name: '4-2-3-1' },
      { id: '4-4-2', name: '4-4-2' },
      { id: '4-4-2-diamond', name: '4-4-2 Diamond' },
      { id: '4-1-2-1-2', name: '4-1-2-1-2' },
      { id: '3-5-2', name: '3-5-2' },
      { id: '4-3-2-1', name: '4-3-2-1' },
      { id: '4-1-2-1-2-narrow', name: '4-1-2-1-2 Narrow' },
      { id: '4-4-2-flat', name: '4-4-2 Flat' },
    ]
  },
  {
    name: 'Defensive',
    formations: [
      { id: '5-4-1', name: '5-4-1' },
      { id: '5-3-2', name: '5-3-2' },
      { id: '4-5-1', name: '4-5-1' },
      { id: '4-1-4-1', name: '4-1-4-1' },
      { id: '5-2-3', name: '5-2-3' },
      { id: '5-2-1-2', name: '5-2-1-2' },
      { id: '4-4-1-1-defensive', name: '4-4-1-1 Defensive' },
    ]
  },
  {
    name: 'Modern',
    formations: [
      { id: '4-2-2-2', name: '4-2-2-2' },
      { id: '3-4-2-1', name: '3-4-2-1' },
      { id: '4-1-3-2', name: '4-1-3-2' },
      { id: '3-1-4-2', name: '3-1-4-2' },
      { id: '4-4-1-1', name: '4-4-1-1' },
      { id: '4-2-1-3', name: '4-2-1-3' },
      { id: '3-2-4-1', name: '3-2-4-1' },
      { id: '4-3-1-2', name: '4-3-1-2' },
    ]
  }
]

const POPULAR_FORMATIONS = ['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '4-1-4-1', '5-3-2']

const getAllFormations = () => FORMATION_CATEGORIES.flatMap(cat => cat.formations)

export default function Toolbar({
  onExport,
  exporting,
  onClear,
  settings,
  onSettingsChange,
  sidebarOpen,
  onToggleSidebar,
  currentFormation,
  onFormationSelect
}) {
  const [formationOpen, setFormationOpen] = useState(false)
  const currentFormationData = getAllFormations().find(f => f.id === currentFormation) || { name: '4-3-3' }

  return (
    <header className="h-14 bg-[#0c0c0e] border-b border-[#1a1a1f] flex items-center justify-between px-4 shrink-0 z-30">
      {/* Left: Logo & Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <img src="/favicon-32x32.png" alt="FootyBuilder" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-sm font-semibold text-white hidden sm:block">FootyBuilder</span>
        </div>

        <div className="h-5 w-px bg-[#252529]" />

        <button
          onClick={onToggleSidebar}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${sidebarOpen ? 'bg-emerald-500/15 text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-[#1a1a1f]'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Center: Formation Selector - Compact */}
      <div className="flex items-center gap-2">
        <Popover.Root open={formationOpen} onOpenChange={setFormationOpen}>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-2 h-8 px-3 bg-[#1a1a1f] hover:bg-[#252529] border border-[#252529] rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="7" cy="7" r="1.5"/><circle cx="17" cy="7" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/>
              </svg>
              <span className="text-xs font-medium text-white">{currentFormationData.name}</span>
              <svg className={`w-3 h-3 text-zinc-500 transition-transform ${formationOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content className="w-[520px] bg-[#0f0f12] border border-[#252529] rounded-xl shadow-2xl z-50 overflow-hidden" sideOffset={8} align="center">
              {/* Popular */}
              <div className="p-3 border-b border-[#1a1a1f]">
                <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">Popular</div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_FORMATIONS.map(id => {
                    const f = getAllFormations().find(f => f.id === id)
                    return (
                      <button
                        key={id}
                        onClick={() => { onFormationSelect(id); setFormationOpen(false) }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${currentFormation === id ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1f] text-zinc-300 hover:bg-[#252529]'}`}
                      >
                        {f?.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* All Formations */}
              <div className="max-h-[280px] overflow-y-auto p-3">
                <div className="grid grid-cols-4 gap-3">
                  {FORMATION_CATEGORIES.map(category => (
                    <div key={category.name}>
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">{category.name}</div>
                      <div className="space-y-0.5">
                        {category.formations.map(formation => (
                          <button
                            key={formation.id}
                            onClick={() => { onFormationSelect(formation.id); setFormationOpen(false) }}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${currentFormation === formation.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-zinc-400 hover:bg-[#1a1a1f] hover:text-white'}`}
                          >
                            {formation.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Quick Toggles */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-[#1a1a1f] rounded-lg border border-[#252529]">
          <ToggleBtn active={settings.showPhotos} onClick={() => onSettingsChange({ showPhotos: !settings.showPhotos })} icon="photo" title="Show Photos" />
          <ToggleBtn active={settings.showNames} onClick={() => onSettingsChange({ showNames: !settings.showNames })} icon="name" title="Show Names" />
          <ToggleBtn active={settings.showNumbers} onClick={() => onSettingsChange({ showNumbers: !settings.showNumbers })} icon="number" title="Show Numbers" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button onClick={onClear} className="h-8 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Reset</span>
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50" disabled={exporting}>
              {exporting ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Export
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[140px] bg-[#0f0f12] border border-[#252529] rounded-lg p-1 shadow-xl z-50" sideOffset={6} align="end">
              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 rounded hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer outline-none" onClick={() => onExport('png')}>
                <span className="w-6 h-6 rounded bg-pink-500/20 text-pink-400 text-[10px] font-bold flex items-center justify-center">PNG</span>
                PNG Image
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 rounded hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer outline-none" onClick={() => onExport('jpeg')}>
                <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center">JPG</span>
                JPEG Image
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}

function ToggleBtn({ active, onClick, icon, title }) {
  const icons = {
    photo: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21"/></svg>,
    name: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    number: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
  }
  return (
    <button onClick={onClick} title={title} className={`w-9 h-8 rounded-md flex items-center justify-center transition-colors ${active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#252529]'}`}>
      {icons[icon]}
    </button>
  )
}
