import { useState, useCallback, useRef } from 'react'
import Pitch from './components/Pitch'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import PlayerSearch from './components/PlayerSearch'
import { useFormations } from './hooks/useFormations'
import { useLineup } from './hooks/useLineup'
import { useExport } from './hooks/useExport'

function App() {
  const pitchRef = useRef(null)
  const { formations, loading: formationsLoading } = useFormations()
  const {
    lineup,
    settings,
    selectedPosition,
    setSelectedPosition,
    setFormation,
    addPlayer,
    removePlayer,
    swapPlayers,
    movePlayer,
    updateSettings,
    clearLineup
  } = useLineup()
  
  const { exportLineup, exporting } = useExport()
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handlePositionClick = useCallback((positionId) => {
    setSelectedPosition(positionId)
    setSearchOpen(true)
  }, [setSelectedPosition])

  const handlePlayerSelect = useCallback((player) => {
    if (selectedPosition) {
      addPlayer(player, selectedPosition)
      setSearchOpen(false)
      setSelectedPosition(null)
    }
  }, [selectedPosition, addPlayer, setSelectedPosition])

  const handleExport = useCallback(async (format = 'png') => {
    if (pitchRef.current) {
      await exportLineup(pitchRef.current, lineup, settings, format)
    }
  }, [exportLineup, lineup, settings])

  const handlePlayerDrop = useCallback((playerId, positionId, customX, customY) => {
    movePlayer(playerId, positionId, customX, customY)
  }, [movePlayer])

  // Aspect ratio display info
  const aspectRatioInfo = {
    square: { label: 'Square', ratio: '1:1', icon: '◼' },
    portrait: { label: 'Portrait', ratio: '4:5', icon: '▮' }
  }

  return (
    <div className="min-h-screen h-screen bg-[#09090b] flex flex-col overflow-hidden">
      {/* Header */}
      <Toolbar 
        onExport={handleExport}
        exporting={exporting}
        onClear={clearLineup}
        settings={settings}
        onSettingsChange={updateSettings}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentFormation={lineup.formationId}
        onFormationSelect={setFormation}
      />
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          formations={formations}
          loading={formationsLoading}
          currentFormation={lineup.formationId}
          onFormationSelect={setFormation}
          settings={settings}
          onSettingsChange={updateSettings}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Pitch Area */}
        <div className="flex-1 flex flex-col bg-[#111114]">
          {/* Pitch Container */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
            <div className="w-full max-w-xl">
              <Pitch
                ref={pitchRef}
                lineup={lineup}
                settings={settings}
                onPositionClick={handlePositionClick}
                onPlayerRemove={removePlayer}
                onPlayerDrop={handlePlayerDrop}
                onSwapPlayers={swapPlayers}
                selectedPosition={selectedPosition}
              />
            </div>
          </div>
          
          {/* Bottom Controls */}
          <div className="h-12 border-t border-[#252529] bg-[#0c0c0e] flex items-center justify-center gap-6 px-6 shrink-0">
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider hidden sm:block">Size</span>
              <div className="flex items-center gap-0.5 p-0.5 bg-[#1a1a1f] rounded-lg">
                {Object.entries(aspectRatioInfo).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => updateSettings({ aspectRatio: key })}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                      ${settings.aspectRatio === key 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-zinc-400 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-[10px] opacity-80">{info.icon}</span>
                    <span>{info.ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-5 w-px bg-[#252529]" />

            {/* Player Count - More prominent */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1f] rounded-lg">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-bold text-white">{lineup.players.length}</span>
              <span className="text-xs text-zinc-500">/ 11</span>
            </div>

            <div className="h-5 w-px bg-[#252529]" />

            {/* Formation Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a1a1f] rounded-lg">
              <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
              </svg>
              <span className="text-xs font-semibold text-white">{lineup.formationId}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Player Search Modal */}
      <PlayerSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handlePlayerSelect}
        onClose={() => {
          setSearchOpen(false)
          setSelectedPosition(null)
        }}
        position={selectedPosition}
      />
    </div>
  )
}

export default App
