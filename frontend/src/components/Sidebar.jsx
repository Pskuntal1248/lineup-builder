import * as Switch from '@radix-ui/react-switch'
import * as Tabs from '@radix-ui/react-tabs'

export default function Sidebar({ settings, onSettingsChange, isOpen }) {
  const pitchStyles = [
    { id: 'grass', label: 'Classic', colors: ['#16a34a', '#15803d'] },
    { id: 'dark', label: 'Stadium', colors: ['#14532d', '#0a3315'] },
    { id: 'light', label: 'Vibrant', colors: ['#22c55e', '#16a34a'] },
    { id: 'minimal', label: 'Muted', colors: ['#1e3a2d', '#15302a'] }
  ]

  const jerseyColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#ffffff', '#171717'
  ]

  return (
    <aside className={`bg-[#0c0c0e] border-r border-[#1a1a1f] flex flex-col shrink-0 transition-all duration-200 overflow-hidden ${isOpen ? 'w-60' : 'w-0 border-0'}`}>
      <Tabs.Root defaultValue="style" className="flex flex-col h-full">
        {/* Tabs */}
        <Tabs.List className="flex p-1.5 gap-1 border-b border-[#1a1a1f] shrink-0">
          <Tabs.Trigger value="style" className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 rounded-md transition-colors data-[state=active]:bg-[#1a1a1f] data-[state=active]:text-white">
            Style
          </Tabs.Trigger>
          <Tabs.Trigger value="display" className="flex-1 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 rounded-md transition-colors data-[state=active]:bg-[#1a1a1f] data-[state=active]:text-white">
            Display
          </Tabs.Trigger>
        </Tabs.List>

        {/* Style Tab */}
        <Tabs.Content value="style" className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Pitch Style */}
          <Section title="Pitch Style">
            <div className="grid grid-cols-2 gap-1.5">
              {pitchStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => onSettingsChange({ pitchStyle: style.id })}
                  className={`relative flex flex-col p-2.5 rounded-lg border transition-colors ${settings.pitchStyle === style.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#252529] hover:border-[#333] bg-[#1a1a1f]'}`}
                >
                  <div className="w-full h-8 rounded mb-1.5" style={{ background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})` }}/>
                  <span className="text-[10px] font-medium text-zinc-300">{style.label}</span>
                  {settings.pitchStyle === style.id && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Section>

          {/* Jersey Color */}
          <Section title="Jersey Color">
            <div className="flex flex-wrap gap-1.5">
              {jerseyColors.map(color => (
                <button
                  key={color}
                  onClick={() => onSettingsChange({ jerseyColor: color })}
                  className={`w-7 h-7 rounded-full transition-transform ${settings.jerseyColor === color ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0c0c0e] scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color, border: color === '#ffffff' || color === '#171717' ? '1px solid #333' : 'none' }}
                />
              ))}
              <label className="w-7 h-7 rounded-full cursor-pointer overflow-hidden bg-gradient-to-br from-red-500 via-green-500 to-blue-500 hover:scale-110 transition-transform">
                <input type="color" value={settings.jerseyColor} onChange={(e) => onSettingsChange({ jerseyColor: e.target.value })} className="opacity-0 w-full h-full cursor-pointer"/>
              </label>
            </div>
          </Section>

          {/* Orientation */}
          <Section title="Orientation">
            <div className="grid grid-cols-2 gap-1.5">
              <FlipBtn active={settings.flippedHorizontal} onClick={() => onSettingsChange({ flippedHorizontal: !settings.flippedHorizontal })} label="Horizontal" horizontal />
              <FlipBtn active={settings.flippedVertical} onClick={() => onSettingsChange({ flippedVertical: !settings.flippedVertical })} label="Vertical" />
            </div>
          </Section>
        </Tabs.Content>

        {/* Display Tab */}
        <Tabs.Content value="display" className="flex-1 overflow-y-auto p-3 space-y-4">
          <Section title="Player Display">
            <div className="space-y-1">
              <ToggleRow label="Show Photos" checked={settings.showPhotos} onChange={(v) => onSettingsChange({ showPhotos: v })} />
              <ToggleRow label="Show Names" checked={settings.showNames} onChange={(v) => onSettingsChange({ showNames: v })} />
              <ToggleRow label="Show Numbers" checked={settings.showNumbers} onChange={(v) => onSettingsChange({ showNumbers: v })} />
            </div>
          </Section>
          <Section title="Export">
            <ToggleRow label="Show Branding" checked={settings.showBranding} onChange={(v) => onSettingsChange({ showBranding: v })} />
          </Section>
        </Tabs.Content>
      </Tabs.Root>
    </aside>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">{title}</div>
      {children}
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-[#1a1a1f] transition-colors">
      <span className="text-xs text-zinc-300">{label}</span>
      <Switch.Root checked={checked} onCheckedChange={onChange} className="w-8 h-5 bg-[#252529] rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors">
        <Switch.Thumb className="block w-3.5 h-3.5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[14px]"/>
      </Switch.Root>
    </div>
  )
}

function FlipBtn({ active, onClick, label, horizontal }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors ${active ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-[#252529] bg-[#1a1a1f] text-zinc-400 hover:border-[#333]'}`}>
      <svg className={`w-4 h-4 ${horizontal ? '' : 'rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
      <span className="text-[9px] font-medium uppercase">{label}</span>
    </button>
  )
}
