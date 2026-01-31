import { forwardRef, useMemo, useState, useCallback } from 'react'
import PlayerNode from './PlayerNode'
import './Pitch.css'

const Pitch = forwardRef(function Pitch({
  lineup,
  settings,
  onPositionClick,
  onPlayerRemove,
  onPlayerDrop,
  onSwapPlayers,
  selectedPosition,
  formations
}, ref) {
  const [draggedPlayer, setDraggedPlayer] = useState(null)
  const [dragOverPosition, setDragOverPosition] = useState(null)

  // Get current formation positions
  const currentFormation = useMemo(() => {
    return FORMATIONS[lineup.formationId] || FORMATIONS['4-3-3']
  }, [lineup.formationId])

  // Apply flips if needed
  const positions = useMemo(() => {
    let pos = currentFormation.positions
    if (settings.flippedHorizontal) {
      pos = pos.map(p => ({ ...p, x: 100 - p.x }))
    }
    if (settings.flippedVertical) {
      pos = pos.map(p => ({ ...p, y: 100 - p.y }))
    }
    return pos
  }, [currentFormation, settings.flippedHorizontal, settings.flippedVertical])

  // Map players to positions
  const positionedPlayers = useMemo(() => {
    const map = new Map()
    lineup.players.forEach(player => {
      map.set(player.positionId, player)
    })
    return map
  }, [lineup.players])

  const getPitchBackground = () => {
    switch (settings.pitchStyle) {
      case 'dark': return 'var(--pitch-dark)'
      case 'light': return 'var(--pitch-light)'
      case 'minimal': return 'var(--pitch-minimal)'
      default: return 'var(--pitch-grass)'
    }
  }

  const handleDragStart = useCallback((player) => {
    setDraggedPlayer(player)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedPlayer(null)
    setDragOverPosition(null)
  }, [])

  const handleDragOver = useCallback((e, positionId) => {
    e.preventDefault()
    setDragOverPosition(positionId)
  }, [])

  const handleDrop = useCallback((e, positionId, x, y) => {
    e.preventDefault()
    if (draggedPlayer) {
      const targetPlayer = positionedPlayers.get(positionId)
      if (targetPlayer && targetPlayer.playerId !== draggedPlayer.playerId) {
        // Swap players
        onSwapPlayers(draggedPlayer.playerId, targetPlayer.playerId)
      } else {
        // Move to empty position or free position
        onPlayerDrop(draggedPlayer.playerId, positionId, null, null)
      }
    }
    setDraggedPlayer(null)
    setDragOverPosition(null)
  }, [draggedPlayer, positionedPlayers, onSwapPlayers, onPlayerDrop])

  return (
    <div 
      ref={ref}
      className={`pitch pitch--${settings.aspectRatio}`}
      style={{ backgroundColor: getPitchBackground() }}
    >
      {/* Pitch markings */}
      <svg className="pitch-markings" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Outer boundary */}
        <rect x="2" y="2" width="96" height="96" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Center line */}
        <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Center circle */}
        <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Center spot */}
        <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.5)" />
        
        {/* Top penalty area */}
        <rect x="25" y="2" width="50" height="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Top goal area */}
        <rect x="35" y="2" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Top penalty spot */}
        <circle cx="50" cy="14" r="0.5" fill="rgba(255,255,255,0.5)" />
        
        {/* Top penalty arc */}
        <path d="M 36 20 A 12 12 0 0 0 64 20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Bottom penalty area */}
        <rect x="25" y="80" width="50" height="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Bottom goal area */}
        <rect x="35" y="90" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Bottom penalty spot */}
        <circle cx="50" cy="86" r="0.5" fill="rgba(255,255,255,0.5)" />
        
        {/* Bottom penalty arc */}
        <path d="M 36 80 A 12 12 0 0 1 64 80" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        
        {/* Corner arcs */}
        <path d="M 2 5 A 3 3 0 0 0 5 2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <path d="M 95 2 A 3 3 0 0 0 98 5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <path d="M 2 95 A 3 3 0 0 1 5 98" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <path d="M 95 98 A 3 3 0 0 1 98 95" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
      </svg>

      {/* Position markers */}
      {positions.map(position => {
        const player = positionedPlayers.get(position.id)
        const isSelected = selectedPosition === position.id
        const isDragOver = dragOverPosition === position.id
        
        return (
          <div
            key={position.id}
            className={`position-marker ${isSelected ? 'position-marker--selected' : ''} ${isDragOver ? 'position-marker--drag-over' : ''}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`
            }}
            onClick={() => !player && onPositionClick(position.id)}
            onDragOver={(e) => handleDragOver(e, position.id)}
            onDrop={(e) => handleDrop(e, position.id, position.x, position.y)}
          >
            {player ? (
              <PlayerNode
                player={player}
                position={position}
                settings={settings}
                onRemove={() => onPlayerRemove(player.playerId)}
                onDragStart={() => handleDragStart(player)}
                onDragEnd={handleDragEnd}
                isDragging={draggedPlayer?.playerId === player.playerId}
              />
            ) : (
              <div className="position-empty">
                <span className="position-label">{position.label}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
})

// Built-in formations data
const FORMATIONS = {
  '4-3-3': {
    id: '4-3-3',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lcm', label: 'CM', x: 30, y: 55 },
      { id: 'cm', label: 'CM', x: 50, y: 50 },
      { id: 'rcm', label: 'CM', x: 70, y: 55 },
      { id: 'lw', label: 'LW', x: 15, y: 25 },
      { id: 'st', label: 'ST', x: 50, y: 18 },
      { id: 'rw', label: 'RW', x: 85, y: 25 }
    ]
  },
  '4-2-3-1': {
    id: '4-2-3-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'ldm', label: 'CDM', x: 35, y: 58 },
      { id: 'rdm', label: 'CDM', x: 65, y: 58 },
      { id: 'lam', label: 'LAM', x: 20, y: 38 },
      { id: 'cam', label: 'CAM', x: 50, y: 35 },
      { id: 'ram', label: 'RAM', x: 80, y: 38 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  },
  '4-4-2': {
    id: '4-4-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lm', label: 'LM', x: 15, y: 50 },
      { id: 'lcm', label: 'CM', x: 35, y: 52 },
      { id: 'rcm', label: 'CM', x: 65, y: 52 },
      { id: 'rm', label: 'RM', x: 85, y: 50 },
      { id: 'lst', label: 'ST', x: 35, y: 20 },
      { id: 'rst', label: 'ST', x: 65, y: 20 }
    ]
  },
  '3-5-2': {
    id: '3-5-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 25, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 75, y: 78 },
      { id: 'lwb', label: 'LWB', x: 10, y: 55 },
      { id: 'lcm', label: 'CM', x: 30, y: 52 },
      { id: 'cdm', label: 'CDM', x: 50, y: 58 },
      { id: 'rcm', label: 'CM', x: 70, y: 52 },
      { id: 'rwb', label: 'RWB', x: 90, y: 55 },
      { id: 'lst', label: 'ST', x: 35, y: 20 },
      { id: 'rst', label: 'ST', x: 65, y: 20 }
    ]
  },
  '4-1-4-1': {
    id: '4-1-4-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'cdm', label: 'CDM', x: 50, y: 60 },
      { id: 'lm', label: 'LM', x: 15, y: 42 },
      { id: 'lcm', label: 'CM', x: 35, y: 45 },
      { id: 'rcm', label: 'CM', x: 65, y: 45 },
      { id: 'rm', label: 'RM', x: 85, y: 42 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  },
  '5-3-2': {
    id: '5-3-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lwb', label: 'LWB', x: 10, y: 68 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'rwb', label: 'RWB', x: 90, y: 68 },
      { id: 'lcm', label: 'CM', x: 30, y: 50 },
      { id: 'cm', label: 'CM', x: 50, y: 48 },
      { id: 'rcm', label: 'CM', x: 70, y: 50 },
      { id: 'lst', label: 'ST', x: 35, y: 20 },
      { id: 'rst', label: 'ST', x: 65, y: 20 }
    ]
  },
  '4-3-1-2': {
    id: '4-3-1-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lcm', label: 'CM', x: 30, y: 55 },
      { id: 'cdm', label: 'CDM', x: 50, y: 60 },
      { id: 'rcm', label: 'CM', x: 70, y: 55 },
      { id: 'cam', label: 'CAM', x: 50, y: 38 },
      { id: 'lst', label: 'ST', x: 35, y: 20 },
      { id: 'rst', label: 'ST', x: 65, y: 20 }
    ]
  },
  '3-4-3': {
    id: '3-4-3',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 25, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 75, y: 78 },
      { id: 'lm', label: 'LM', x: 15, y: 50 },
      { id: 'lcm', label: 'CM', x: 38, y: 52 },
      { id: 'rcm', label: 'CM', x: 62, y: 52 },
      { id: 'rm', label: 'RM', x: 85, y: 50 },
      { id: 'lw', label: 'LW', x: 20, y: 25 },
      { id: 'st', label: 'ST', x: 50, y: 18 },
      { id: 'rw', label: 'RW', x: 80, y: 25 }
    ]
  }
}

export default Pitch
