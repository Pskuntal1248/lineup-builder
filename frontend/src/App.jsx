import { useState, useCallback, useRef } from 'react'
import Pitch from './components/Pitch'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import PlayerSearch from './components/PlayerSearch'
import { useFormations } from './hooks/useFormations'
import { useLineup } from './hooks/useLineup'
import { useExport } from './hooks/useExport'
import './styles/App.css'

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

  return (
    <div className="app">
      <Toolbar 
        onExport={handleExport}
        exporting={exporting}
        onClear={clearLineup}
        settings={settings}
        onSettingsChange={updateSettings}
      />
      
      <main className="main-content">
        <Sidebar
          formations={formations}
          loading={formationsLoading}
          currentFormation={lineup.formationId}
          onFormationSelect={setFormation}
          settings={settings}
          onSettingsChange={updateSettings}
        />
        
        <div className="pitch-container">
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
      </main>

      {searchOpen && (
        <PlayerSearch
          onSelect={handlePlayerSelect}
          onClose={() => {
            setSearchOpen(false)
            setSelectedPosition(null)
          }}
          position={selectedPosition}
        />
      )}
    </div>
  )
}

export default App
