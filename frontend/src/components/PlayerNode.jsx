import { memo } from 'react'
import './PlayerNode.css'

const PlayerNode = memo(function PlayerNode({
  player,
  position,
  settings,
  onRemove,
  onDragStart,
  onDragEnd,
  isDragging
}) {
  const displayName = player.displayName || formatName(player.name)
  const jerseyColor = player.jerseyColor || settings.jerseyColor

  return (
    <div
      className={`player-node ${isDragging ? 'player-node--dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Jersey / Avatar */}
      <div 
        className="player-jersey"
        style={{ backgroundColor: jerseyColor }}
      >
        {settings.showPhotos && player.photoUrl ? (
          <img 
            src={player.photoUrl} 
            alt={player.name}
            className="player-photo"
          />
        ) : settings.showNumbers && player.number ? (
          <span className="player-number">{player.number}</span>
        ) : (
          <span className="player-initials">{getInitials(player.name)}</span>
        )}
        
        {/* Remove button */}
        <button 
          className="player-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          title="Remove player"
        >
          ×
        </button>
      </div>

      {/* Name label */}
      {settings.showNames && (
        <div className="player-name" title={player.name}>
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
  
  // Return last name, truncate if needed
  const lastName = parts[parts.length - 1]
  if (lastName.length > 10) {
    return lastName.substring(0, 9) + '.'
  }
  return lastName
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default PlayerNode
