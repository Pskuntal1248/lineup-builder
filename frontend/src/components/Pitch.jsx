import { forwardRef, useMemo, useState, useCallback } from 'react'
import PlayerNode from './PlayerNode'

const Pitch = forwardRef(function Pitch({
  lineup,
  settings,
  onPositionClick,
  onPlayerRemove,
  onPlayerDrop,
  onSwapPlayers,
  selectedPosition,
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
      case 'dark': 
        return 'linear-gradient(180deg, #0d4a1c 0%, #0a3315 50%, #071f0d 100%)'
      case 'light': 
        return 'linear-gradient(180deg, #2d8b4e 0%, #228b22 50%, #1e7b1e 100%)'
      case 'minimal': 
        return 'linear-gradient(180deg, #1a3a2a 0%, #152e22 50%, #0f231a 100%)'
      default: 
        return 'linear-gradient(180deg, #1a8b3c 0%, #168a32 50%, #127828 100%)'
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

  const handleDrop = useCallback((e, positionId) => {
    e.preventDefault()
    if (draggedPlayer) {
      const targetPlayer = positionedPlayers.get(positionId)
      if (targetPlayer && targetPlayer.playerId !== draggedPlayer.playerId) {
        onSwapPlayers(draggedPlayer.playerId, targetPlayer.playerId)
      } else {
        onPlayerDrop(draggedPlayer.playerId, positionId, null, null)
      }
    }
    setDraggedPlayer(null)
    setDragOverPosition(null)
  }, [draggedPlayer, positionedPlayers, onSwapPlayers, onPlayerDrop])

  // Calculate aspect ratio dimensions
  const getAspectRatioStyle = () => {
    switch (settings.aspectRatio) {
      case 'portrait':
        return { aspectRatio: '4/5' }
      default: // square
        return { aspectRatio: '1/1' }
    }
  }

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        ...getAspectRatioStyle(),
        background: getPitchBackground(),
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
      ref={ref}
    >
      {/* Pitch markings - Corrected Aspect Ratio (FIFA Dimensions) */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ opacity: 0.9 }}
      >
        {/* Grass pattern overlay */}
        <defs>
          <pattern id="grassStripes" patternUnits="userSpaceOnUse" width="100" height="5">
            <rect width="100" height="2.5" fill="rgba(255,255,255,0.02)" />
            <rect y="2.5" width="100" height="2.5" fill="transparent" />
          </pattern>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#grassStripes)" />
        
        {/* Outer boundary */}
        <rect x="3" y="3" width="94" height="94" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Center line (halfway line) */}
        <line x1="3" y1="50" x2="97" y2="50" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
        
        {/* Center circle - Using Ellipse to correct distortion (rx=13, ry=8.7) */}
        <ellipse cx="50" cy="50" rx="13" ry="8.7" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Center spot */}
        <circle cx="50" cy="50" r="0.6" fill="rgba(255,255,255,0.95)" />
        
        {/* === TOP HALF === */}
        
        {/* Penalty area */}
        <rect x="20.35" y="3" width="59.3" height="15.7" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Goal area */}
        <rect x="36.5" y="3" width="27" height="5.2" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Top goal */}
        <rect x="44.6" y="0" width="10.8" height="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" rx="0.3" />
        
        {/* Penalty spot */}
        <circle cx="50" cy="13.5" r="0.5" fill="rgba(255,255,255,0.95)" />
        
        {/* Penalty arc - Corrected coordinates for elliptical arc */}
        <path d="M 39.6 18.7 A 13 8.7 0 0 0 60.4 18.7" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* === BOTTOM HALF === */}
        
        {/* Penalty area */}
        <rect x="20.35" y="81.3" width="59.3" height="15.7" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Goal area */}
        <rect x="36.5" y="91.8" width="27" height="5.2" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Bottom goal */}
        <rect x="44.6" y="97" width="10.8" height="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" rx="0.3" />
        
        {/* Penalty spot */}
        <circle cx="50" cy="86.5" r="0.5" fill="rgba(255,255,255,0.95)" />
        
        {/* Penalty arc */}
        <path d="M 39.6 81.3 A 13 8.7 0 0 1 60.4 81.3" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        
        {/* Corner arcs - Corrected to be elliptical (rx=1.5, ry=1) */}
        <path d="M 3 4 A 1.5 1 0 0 0 4.5 3" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <path d="M 95.5 3 A 1.5 1 0 0 0 97 4" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <path d="M 3 96 A 1.5 1 0 0 1 4.5 97" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <path d="M 95.5 97 A 1.5 1 0 0 1 97 96" fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
      </svg>

      {/* Position markers */}
      {positions.map(position => {
        const player = positionedPlayers.get(position.id)
        const isSelected = selectedPosition === position.id
        const isDragOver = dragOverPosition === position.id
        
        return (
          <div
            key={position.id}
            className={`
              absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 
              transition-all duration-300 ease-out
              ${isSelected ? 'scale-110 z-20' : ''} 
              ${isDragOver ? 'scale-105' : ''}
            `}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`
            }}
            onClick={() => !player && onPositionClick(position.id)}
            onDragOver={(e) => handleDragOver(e, position.id)}
            onDrop={(e) => handleDrop(e, position.id)}
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
              <button 
                className={`
                  group w-9 h-9 md:w-10 md:h-10 rounded-full 
                  flex flex-col items-center justify-center gap-0 
                  transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? 'bg-accent/30 border-2 border-accent scale-110 shadow-[0_0_25px_rgba(34,197,94,0.4)]' 
                    : 'bg-black/20 border-2 border-dashed border-white/25 hover:border-white/50 hover:bg-black/30 hover:scale-105'
                  }
                `}
                style={{
                  backdropFilter: 'blur(4px)'
                }}
              >
                <span className={`
                  text-[8px] md:text-[9px] font-bold uppercase tracking-wider
                  ${isSelected ? 'text-accent' : 'text-white/80'}
                `}>
                  {position.label}
                </span>
                <svg className={`
                  w-2 h-2 md:w-2.5 md:h-2.5 transition-colors
                  ${isSelected ? 'text-accent' : 'text-white/40 group-hover:text-white/60'}
                `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>
        )
      })}

      {/* Branding Watermark */}
      {settings.showBranding && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
          <img src="/favicon-32x32.png" alt="FootyBuilder" className="w-4 h-4 rounded-full" />
          <span className="text-[10px] font-semibold text-white/90 tracking-wide">FootyBuilder</span>
        </div>
      )}
    </div>
  )
})

// Comprehensive formations data - all major tactical systems
const FORMATIONS = {
  // === ATTACKING ===
  '4-3-3': {
    id: '4-3-3',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lcm', label: 'CM', x: 30, y: 52 },
      { id: 'cm', label: 'CM', x: 50, y: 48 },
      { id: 'rcm', label: 'CM', x: 70, y: 52 },
      { id: 'lw', label: 'LW', x: 18, y: 28 },
      { id: 'st', label: 'ST', x: 50, y: 18 },
      { id: 'rw', label: 'RW', x: 82, y: 28 }
    ]
  },
  '4-3-3-attack': {
    id: '4-3-3-attack',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'cdm', label: 'CDM', x: 50, y: 58 },
      { id: 'lcam', label: 'CAM', x: 32, y: 42 },
      { id: 'rcam', label: 'CAM', x: 68, y: 42 },
      { id: 'lw', label: 'LW', x: 18, y: 28 },
      { id: 'st', label: 'ST', x: 50, y: 18 },
      { id: 'rw', label: 'RW', x: 82, y: 28 }
    ]
  },
  '3-4-3': {
    id: '3-4-3',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'lwb', label: 'LM', x: 12, y: 52 },
      { id: 'lcm', label: 'CM', x: 38, y: 52 },
      { id: 'rcm', label: 'CM', x: 62, y: 52 },
      { id: 'rwb', label: 'RM', x: 88, y: 52 },
      { id: 'lw', label: 'LW', x: 20, y: 25 },
      { id: 'st', label: 'ST', x: 50, y: 18 },
      { id: 'rw', label: 'RW', x: 80, y: 25 }
    ]
  },
  '4-2-4': {
    id: '4-2-4',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lcm', label: 'CM', x: 35, y: 52 },
      { id: 'rcm', label: 'CM', x: 65, y: 52 },
      { id: 'lw', label: 'LW', x: 15, y: 28 },
      { id: 'lst', label: 'ST', x: 38, y: 20 },
      { id: 'rst', label: 'ST', x: 62, y: 20 },
      { id: 'rw', label: 'RW', x: 85, y: 28 }
    ]
  },
  '3-3-4': {
    id: '3-3-4',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'lcm', label: 'CM', x: 28, y: 52 },
      { id: 'cm', label: 'CM', x: 50, y: 55 },
      { id: 'rcm', label: 'CM', x: 72, y: 52 },
      { id: 'lw', label: 'LW', x: 12, y: 28 },
      { id: 'lst', label: 'ST', x: 38, y: 20 },
      { id: 'rst', label: 'ST', x: 62, y: 20 },
      { id: 'rw', label: 'RW', x: 88, y: 28 }
    ]
  },

  // === BALANCED ===
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
      { id: 'lam', label: 'LAM', x: 22, y: 38 },
      { id: 'cam', label: 'CAM', x: 50, y: 35 },
      { id: 'ram', label: 'RAM', x: 78, y: 38 },
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
      { id: 'lcm', label: 'CM', x: 38, y: 52 },
      { id: 'rcm', label: 'CM', x: 62, y: 52 },
      { id: 'rm', label: 'RM', x: 85, y: 50 },
      { id: 'lst', label: 'ST', x: 38, y: 22 },
      { id: 'rst', label: 'ST', x: 62, y: 22 }
    ]
  },
  '4-4-2-diamond': {
    id: '4-4-2-diamond',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'cdm', label: 'CDM', x: 50, y: 62 },
      { id: 'lcm', label: 'CM', x: 30, y: 48 },
      { id: 'rcm', label: 'CM', x: 70, y: 48 },
      { id: 'cam', label: 'CAM', x: 50, y: 35 },
      { id: 'lst', label: 'ST', x: 38, y: 20 },
      { id: 'rst', label: 'ST', x: 62, y: 20 }
    ]
  },
  '4-1-2-1-2': {
    id: '4-1-2-1-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'cdm', label: 'CDM', x: 50, y: 62 },
      { id: 'lcm', label: 'CM', x: 32, y: 48 },
      { id: 'rcm', label: 'CM', x: 68, y: 48 },
      { id: 'cam', label: 'CAM', x: 50, y: 35 },
      { id: 'lst', label: 'ST', x: 38, y: 20 },
      { id: 'rst', label: 'ST', x: 62, y: 20 }
    ]
  },
  '3-5-2': {
    id: '3-5-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'lwb', label: 'LWB', x: 10, y: 52 },
      { id: 'lcm', label: 'CM', x: 32, y: 52 },
      { id: 'cdm', label: 'CDM', x: 50, y: 58 },
      { id: 'rcm', label: 'CM', x: 68, y: 52 },
      { id: 'rwb', label: 'RWB', x: 90, y: 52 },
      { id: 'lst', label: 'ST', x: 38, y: 22 },
      { id: 'rst', label: 'ST', x: 62, y: 22 }
    ]
  },
  '4-3-2-1': {
    id: '4-3-2-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lcm', label: 'CM', x: 28, y: 55 },
      { id: 'cm', label: 'CM', x: 50, y: 52 },
      { id: 'rcm', label: 'CM', x: 72, y: 55 },
      { id: 'lss', label: 'SS', x: 35, y: 35 },
      { id: 'rss', label: 'SS', x: 65, y: 35 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  },

  // === DEFENSIVE ===
  '5-4-1': {
    id: '5-4-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lwb', label: 'LWB', x: 10, y: 70 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'rwb', label: 'RWB', x: 90, y: 70 },
      { id: 'lm', label: 'LM', x: 18, y: 48 },
      { id: 'lcm', label: 'CM', x: 38, y: 52 },
      { id: 'rcm', label: 'CM', x: 62, y: 52 },
      { id: 'rm', label: 'RM', x: 82, y: 48 },
      { id: 'st', label: 'ST', x: 50, y: 20 }
    ]
  },
  '5-3-2': {
    id: '5-3-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lwb', label: 'LWB', x: 10, y: 65 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'rwb', label: 'RWB', x: 90, y: 65 },
      { id: 'lcm', label: 'CM', x: 30, y: 50 },
      { id: 'cm', label: 'CM', x: 50, y: 48 },
      { id: 'rcm', label: 'CM', x: 70, y: 50 },
      { id: 'lst', label: 'ST', x: 38, y: 22 },
      { id: 'rst', label: 'ST', x: 62, y: 22 }
    ]
  },
  '4-5-1': {
    id: '4-5-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lm', label: 'LM', x: 12, y: 48 },
      { id: 'lcm', label: 'CM', x: 32, y: 52 },
      { id: 'cm', label: 'CM', x: 50, y: 48 },
      { id: 'rcm', label: 'CM', x: 68, y: 52 },
      { id: 'rm', label: 'RM', x: 88, y: 48 },
      { id: 'st', label: 'ST', x: 50, y: 20 }
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
      { id: 'cdm', label: 'CDM', x: 50, y: 62 },
      { id: 'lm', label: 'LM', x: 15, y: 42 },
      { id: 'lcm', label: 'CM', x: 38, y: 45 },
      { id: 'rcm', label: 'CM', x: 62, y: 45 },
      { id: 'rm', label: 'RM', x: 85, y: 42 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  },
  '5-2-3': {
    id: '5-2-3',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lwb', label: 'LWB', x: 10, y: 65 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'rwb', label: 'RWB', x: 90, y: 65 },
      { id: 'lcm', label: 'CM', x: 38, y: 52 },
      { id: 'rcm', label: 'CM', x: 62, y: 52 },
      { id: 'lw', label: 'LW', x: 22, y: 28 },
      { id: 'st', label: 'ST', x: 50, y: 20 },
      { id: 'rw', label: 'RW', x: 78, y: 28 }
    ]
  },

  // === MODERN ===
  '4-2-2-2': {
    id: '4-2-2-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'ldm', label: 'CDM', x: 35, y: 58 },
      { id: 'rdm', label: 'CDM', x: 65, y: 58 },
      { id: 'lam', label: 'CAM', x: 32, y: 40 },
      { id: 'ram', label: 'CAM', x: 68, y: 40 },
      { id: 'lst', label: 'ST', x: 38, y: 22 },
      { id: 'rst', label: 'ST', x: 62, y: 22 }
    ]
  },
  '3-4-2-1': {
    id: '3-4-2-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'lwb', label: 'LM', x: 12, y: 52 },
      { id: 'lcm', label: 'CM', x: 38, y: 55 },
      { id: 'rcm', label: 'CM', x: 62, y: 55 },
      { id: 'rwb', label: 'RM', x: 88, y: 52 },
      { id: 'lss', label: 'SS', x: 35, y: 35 },
      { id: 'rss', label: 'SS', x: 65, y: 35 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  },
  '4-1-3-2': {
    id: '4-1-3-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'cdm', label: 'CDM', x: 50, y: 62 },
      { id: 'lm', label: 'LM', x: 22, y: 45 },
      { id: 'cam', label: 'CAM', x: 50, y: 42 },
      { id: 'rm', label: 'RM', x: 78, y: 45 },
      { id: 'lst', label: 'ST', x: 38, y: 22 },
      { id: 'rst', label: 'ST', x: 62, y: 22 }
    ]
  },
  '3-1-4-2': {
    id: '3-1-4-2',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 28, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 72, y: 78 },
      { id: 'cdm', label: 'CDM', x: 50, y: 65 },
      { id: 'lwb', label: 'LM', x: 12, y: 48 },
      { id: 'lcm', label: 'CM', x: 35, y: 50 },
      { id: 'rcm', label: 'CM', x: 65, y: 50 },
      { id: 'rwb', label: 'RM', x: 88, y: 48 },
      { id: 'lst', label: 'ST', x: 38, y: 22 },
      { id: 'rst', label: 'ST', x: 62, y: 22 }
    ]
  },
  '4-4-1-1': {
    id: '4-4-1-1',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lm', label: 'LM', x: 15, y: 52 },
      { id: 'lcm', label: 'CM', x: 38, y: 55 },
      { id: 'rcm', label: 'CM', x: 62, y: 55 },
      { id: 'rm', label: 'RM', x: 85, y: 52 },
      { id: 'ss', label: 'SS', x: 50, y: 35 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  }
}

export default Pitch
