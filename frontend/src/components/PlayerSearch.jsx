import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { usePlayerSearch } from '../hooks/usePlayerSearch'

export default function PlayerSearch({ open, onOpenChange, onSelect, onClose, position }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [imageErrors, setImageErrors] = useState(new Set())
  const [hasSearched, setHasSearched] = useState(false)
  const { results, loading, search } = usePlayerSearch()

  // Focus and reset on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setHasSearched(false)
    }
  }, [open])

  // Only search when query has at least 1 character
  useEffect(() => {
    if (query.trim().length >= 1) {
      const timeoutId = setTimeout(() => {
        search({ query: query.trim(), size: 30 })
        setHasSearched(true)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [query, search])

  const handleImageError = (playerId) => {
    setImageErrors(prev => new Set([...prev, playerId]))
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[80vh] bg-[#0c0c0e] border border-[#252529] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1f]">
            <Dialog.Title className="text-sm font-semibold text-white flex items-center gap-2">
              Add Player
              {position && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded uppercase">{position}</span>
              )}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-7 h-7 rounded-lg hover:bg-[#1a1a1f] flex items-center justify-center text-zinc-500 hover:text-white transition-colors" onClick={onClose}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>
          
          {/* Search Input */}
          <div className="px-4 py-3 border-b border-[#1a1a1f]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="w-full pl-9 pr-9 py-2.5 bg-[#1a1a1f] border border-[#252529] rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Type player name to search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {query.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1f] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-xs">Start typing to search players</p>
                <p className="text-zinc-600 text-[10px] mt-1">3,700+ players from top 5 leagues</p>
              </div>
            ) : results.length === 0 && hasSearched && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1f] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-xs">No players found for "{query}"</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1a1a1f]">
                {results.map(player => (
                  <button
                    key={player.id}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a1f] transition-colors text-left"
                    onClick={() => { onSelect(player); onClose() }}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#252529] border border-[#333] overflow-hidden shrink-0">
                      {player.photoUrl && !imageErrors.has(player.id) ? (
                        <img src={player.photoUrl} alt="" className="w-full h-full object-cover" onError={() => handleImageError(player.id)} loading="lazy"/>
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xs font-semibold text-zinc-500">{getInitials(player.name)}</span>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{player.name}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{player.club} · {player.nationality}</div>
                    </div>
                    
                    {/* Position */}
                    {player.positions?.[0] && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-[#252529] text-zinc-400 rounded uppercase">{player.positions[0]}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
