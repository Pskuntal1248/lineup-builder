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

  return (
    <div
      className={`flex flex-col items-center gap-0.5 cursor-grab select-none ${isDragging ? 'opacity-40' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar Container */}
      <div className="relative">
        {/* Main Circle */}
        <div 
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden transition-transform duration-150 ${hovered ? 'scale-110' : ''}`}
          style={{ backgroundColor: showPhoto ? '#1a1a1f' : jerseyColor }}
        >
          {showPhoto ? (
            <img 
              src={player.photoUrl} 
              alt={player.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : settings.showNumbers && player.number ? (
            <span className="text-xs md:text-sm font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{player.number}</span>
          ) : (
            <span className="text-[10px] font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{getInitials(player.name)}</span>
          )}
        </div>
        
        {/* Remove Button - Always visible on hover with better styling */}
        <button 
          className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg border border-white transition-all duration-150 hover:bg-red-600 hover:scale-110 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
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
        <div className="max-w-[60px] md:max-w-[70px] px-1 py-0.5 bg-black/90 rounded text-[8px] md:text-[9px] font-semibold text-white text-center truncate shadow-md" title={player.name}>
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
