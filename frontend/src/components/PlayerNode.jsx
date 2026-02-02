import { memo, useState } from 'react'

const PlayerNode = memo(function PlayerNode({
  player,
  position,
  settings,
  onRemove,
  onDragStart,
  onDragEnd,
  isDragging
}) {
  const [imageError, setImageError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const displayName = player.displayName || formatName(player.name)
  const jerseyColor = player.jerseyColor || settings.jerseyColor

  const showPhoto = settings.showPhotos && player.photoUrl && !imageError

  // Determine if color is a gradient
  const isGradient = jerseyColor && jerseyColor.includes('gradient')

  return (
    <div
      className={`flex flex-col items-center gap-0.5 cursor-grab select-none ${isDragging ? 'opacity-40' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Player Container with Jersey Body */}
      <div className="relative">
        {/* Jersey Body Shape */}
        <div 
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-5 md:w-9 md:h-6 rounded-b-lg transition-transform duration-150 ${hovered ? 'scale-110' : ''}`}
          style={{ 
            background: isGradient ? jerseyColor : jerseyColor,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* Jersey collar detail */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1.5 rounded-b-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        </div>

        {/* Jersey Sleeves */}
        <div 
          className={`absolute top-5 -left-1.5 w-2.5 h-3 md:w-3 md:h-3.5 rounded-b-md rounded-l-md transition-transform duration-150 ${hovered ? 'scale-110' : ''}`}
          style={{ 
            background: isGradient ? jerseyColor : jerseyColor,
            transformOrigin: 'right top',
            transform: hovered ? 'scale(1.1) rotate(-10deg)' : 'rotate(-10deg)'
          }}
        />
        <div 
          className={`absolute top-5 -right-1.5 w-2.5 h-3 md:w-3 md:h-3.5 rounded-b-md rounded-r-md transition-transform duration-150 ${hovered ? 'scale-110' : ''}`}
          style={{ 
            background: isGradient ? jerseyColor : jerseyColor,
            transformOrigin: 'left top',
            transform: hovered ? 'scale(1.1) rotate(10deg)' : 'rotate(10deg)'
          }}
        />

        {/* Head Circle */}
        <div 
          className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden transition-transform duration-150 z-10 ${hovered ? 'scale-110' : ''}`}
          style={{ backgroundColor: showPhoto ? '#1a1a1f' : '#f5d0a9' }}
        >
          {showPhoto ? (
            <img 
              src={player.photoUrl} 
              alt={player.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            /* Default face/head when no photo */
            <div className="w-full h-full bg-gradient-to-b from-[#f5d0a9] to-[#e8b88a] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#5a4030]">{getInitials(player.name)}</span>
            </div>
          )}
        </div>

        {/* Jersey Number Badge */}
        {settings.showNumbers && player.number && (
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white z-20"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.7)',
              minWidth: '16px',
              textAlign: 'center'
            }}
          >
            {player.number}
          </div>
        )}
        
        {/* Remove Button */}
        <button 
          className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg border border-white transition-all duration-150 hover:bg-red-600 hover:scale-110 z-20 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onRemove()
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 2l8 8M10 2l-8 8"/>
          </svg>
        </button>
      </div>

      {/* Name Label */}
      {settings.showNames && (
        <div 
          className="max-w-[60px] md:max-w-[70px] px-1 py-0.5 bg-black/90 rounded text-[8px] md:text-[9px] font-semibold text-white text-center truncate shadow-md mt-1" 
          title={player.name}
        >
          {displayName}
        </div>
      )}
    </div>
  )
})

function formatName(fullName) {
  if (!fullName) return ''
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  const lastName = parts[parts.length - 1]
  return lastName.length > 9 ? lastName.substring(0, 8) + '.' : lastName
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default PlayerNode
