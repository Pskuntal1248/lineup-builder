import { useState, useEffect, useCallback, useRef } from 'react'
import { usePlayerSearch } from '../hooks/usePlayerSearch'
import './PlayerSearch.css'

// Sample player data for offline/demo mode
const SAMPLE_PLAYERS = [
  { id: '1', name: 'Manuel Neuer', displayName: 'Neuer', positions: ['GK'], club: 'Bayern Munich', nationality: 'Germany', number: 1 },
  { id: '2', name: 'Alisson Becker', displayName: 'Alisson', positions: ['GK'], club: 'Liverpool', nationality: 'Brazil', number: 1 },
  { id: '3', name: 'Thibaut Courtois', displayName: 'Courtois', positions: ['GK'], club: 'Real Madrid', nationality: 'Belgium', number: 1 },
  { id: '4', name: 'Virgil van Dijk', displayName: 'Van Dijk', positions: ['CB'], club: 'Liverpool', nationality: 'Netherlands', number: 4 },
  { id: '5', name: 'Rúben Dias', displayName: 'Dias', positions: ['CB'], club: 'Manchester City', nationality: 'Portugal', number: 3 },
  { id: '6', name: 'Antonio Rüdiger', displayName: 'Rüdiger', positions: ['CB'], club: 'Real Madrid', nationality: 'Germany', number: 22 },
  { id: '7', name: 'William Saliba', displayName: 'Saliba', positions: ['CB'], club: 'Arsenal', nationality: 'France', number: 2 },
  { id: '8', name: 'Trent Alexander-Arnold', displayName: 'Trent', positions: ['RB', 'CM'], club: 'Liverpool', nationality: 'England', number: 66 },
  { id: '9', name: 'Kyle Walker', displayName: 'Walker', positions: ['RB'], club: 'Manchester City', nationality: 'England', number: 2 },
  { id: '10', name: 'Andrew Robertson', displayName: 'Robertson', positions: ['LB'], club: 'Liverpool', nationality: 'Scotland', number: 26 },
  { id: '11', name: 'Alphonso Davies', displayName: 'Davies', positions: ['LB', 'LW'], club: 'Bayern Munich', nationality: 'Canada', number: 19 },
  { id: '12', name: 'Kevin De Bruyne', displayName: 'De Bruyne', positions: ['CM', 'CAM'], club: 'Manchester City', nationality: 'Belgium', number: 17 },
  { id: '13', name: 'Luka Modrić', displayName: 'Modrić', positions: ['CM'], club: 'Real Madrid', nationality: 'Croatia', number: 10 },
  { id: '14', name: 'Jude Bellingham', displayName: 'Bellingham', positions: ['CM', 'CAM'], club: 'Real Madrid', nationality: 'England', number: 5 },
  { id: '15', name: 'Pedri', displayName: 'Pedri', positions: ['CM', 'CAM'], club: 'Barcelona', nationality: 'Spain', number: 8 },
  { id: '16', name: 'Rodri', displayName: 'Rodri', positions: ['CDM', 'CM'], club: 'Manchester City', nationality: 'Spain', number: 16 },
  { id: '17', name: 'Declan Rice', displayName: 'Rice', positions: ['CDM', 'CM'], club: 'Arsenal', nationality: 'England', number: 41 },
  { id: '18', name: 'Bruno Fernandes', displayName: 'Bruno', positions: ['CAM', 'CM'], club: 'Manchester United', nationality: 'Portugal', number: 8 },
  { id: '19', name: 'Martin Ødegaard', displayName: 'Ødegaard', positions: ['CAM', 'CM'], club: 'Arsenal', nationality: 'Norway', number: 8 },
  { id: '20', name: 'Joshua Kimmich', displayName: 'Kimmich', positions: ['CDM', 'RB'], club: 'Bayern Munich', nationality: 'Germany', number: 6 },
  { id: '21', name: 'Vinícius Júnior', displayName: 'Vinícius', positions: ['LW', 'RW'], club: 'Real Madrid', nationality: 'Brazil', number: 7 },
  { id: '22', name: 'Kylian Mbappé', displayName: 'Mbappé', positions: ['LW', 'ST', 'RW'], club: 'Real Madrid', nationality: 'France', number: 9 },
  { id: '23', name: 'Bukayo Saka', displayName: 'Saka', positions: ['RW', 'LW'], club: 'Arsenal', nationality: 'England', number: 7 },
  { id: '24', name: 'Mohamed Salah', displayName: 'Salah', positions: ['RW'], club: 'Liverpool', nationality: 'Egypt', number: 11 },
  { id: '25', name: 'Phil Foden', displayName: 'Foden', positions: ['LW', 'RW', 'CAM'], club: 'Manchester City', nationality: 'England', number: 47 },
  { id: '26', name: 'Jamal Musiala', displayName: 'Musiala', positions: ['CAM', 'LW', 'RW'], club: 'Bayern Munich', nationality: 'Germany', number: 42 },
  { id: '27', name: 'Rafael Leão', displayName: 'Leão', positions: ['LW'], club: 'AC Milan', nationality: 'Portugal', number: 10 },
  { id: '28', name: 'Erling Haaland', displayName: 'Haaland', positions: ['ST'], club: 'Manchester City', nationality: 'Norway', number: 9 },
  { id: '29', name: 'Harry Kane', displayName: 'Kane', positions: ['ST'], club: 'Bayern Munich', nationality: 'England', number: 9 },
  { id: '30', name: 'Robert Lewandowski', displayName: 'Lewandowski', positions: ['ST'], club: 'Barcelona', nationality: 'Poland', number: 9 },
  { id: '31', name: 'Lautaro Martínez', displayName: 'Lautaro', positions: ['ST'], club: 'Inter Milan', nationality: 'Argentina', number: 10 },
  { id: '32', name: 'Victor Osimhen', displayName: 'Osimhen', positions: ['ST'], club: 'Napoli', nationality: 'Nigeria', number: 9 },
  { id: '33', name: 'Florian Wirtz', displayName: 'Wirtz', positions: ['CAM', 'LW'], club: 'Bayer Leverkusen', nationality: 'Germany', number: 10 },
  { id: '34', name: 'Lamine Yamal', displayName: 'Yamal', positions: ['RW'], club: 'Barcelona', nationality: 'Spain', number: 19 },
]

function PlayerSearch({ onSelect, onClose, position }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [filteredPlayers, setFilteredPlayers] = useState(SAMPLE_PLAYERS)
  const { results, loading, search } = usePlayerSearch()

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Filter players locally (for demo mode)
  useEffect(() => {
    if (!query.trim()) {
      setFilteredPlayers(SAMPLE_PLAYERS)
      return
    }
    
    const q = query.toLowerCase()
    const filtered = SAMPLE_PLAYERS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.club.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      p.positions.some(pos => pos.toLowerCase().includes(q))
    )
    setFilteredPlayers(filtered)
  }, [query])

  // Try API search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        search({ query, size: 20 })
      }
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [query, search])

  // Use API results if available
  const displayPlayers = results.length > 0 ? results : filteredPlayers

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="player-search-overlay" onClick={onClose}>
      <div className="player-search" onClick={e => e.stopPropagation()}>
        <div className="player-search-header">
          <h2 className="player-search-title">
            Add Player {position && <span className="position-badge">{position.toUpperCase()}</span>}
          </h2>
          <button className="player-search-close" onClick={onClose}>×</button>
        </div>
        
        <div className="player-search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="player-search-input"
            placeholder="Search by name, club, or nationality..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <span className="search-loading">⏳</span>}
        </div>
        
        <div className="player-search-results">
          {displayPlayers.length === 0 ? (
            <div className="player-search-empty">
              No players found. Try a different search.
            </div>
          ) : (
            displayPlayers.map(player => (
              <button
                key={player.id}
                className="player-result"
                onClick={() => onSelect(player)}
              >
                <div className="player-result-avatar">
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} />
                  ) : (
                    <span className="player-result-initials">
                      {getInitials(player.name)}
                    </span>
                  )}
                </div>
                <div className="player-result-info">
                  <div className="player-result-name">{player.name}</div>
                  <div className="player-result-meta">
                    {player.club} • {player.nationality}
                  </div>
                </div>
                <div className="player-result-positions">
                  {player.positions.map(pos => (
                    <span key={pos} className="player-result-position">{pos}</span>
                  ))}
                </div>
                {player.number && (
                  <div className="player-result-number">#{player.number}</div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default PlayerSearch
