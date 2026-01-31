import { useState, useCallback } from 'react'

const DEFAULT_FORMATION = '4-3-3'

const DEFAULT_SETTINGS = {
  pitchStyle: 'grass',
  jerseyColor: '#ff0000',
  showPhotos: true,
  showNames: true,
  showNumbers: true,
  showBranding: false,
  aspectRatio: 'portrait',
  flippedHorizontal: false,
  flippedVertical: false
}

export function useLineup() {
  const [lineup, setLineup] = useState({
    formationId: DEFAULT_FORMATION,
    players: []
  })
  
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [selectedPosition, setSelectedPosition] = useState(null)

  const setFormation = useCallback((formationId) => {
    setLineup(prev => ({
      ...prev,
      formationId,
      // Keep existing players, they'll be repositioned by formation
      players: prev.players
    }))
  }, [])

  const addPlayer = useCallback((player, positionId) => {
    setLineup(prev => {
      // Remove player from any existing position
      const filteredPlayers = prev.players.filter(p => 
        p.playerId !== player.id && p.positionId !== positionId
      )
      
      return {
        ...prev,
        players: [
          ...filteredPlayers,
          {
            playerId: player.id,
            positionId,
            name: player.name,
            displayName: player.displayName,
            photoUrl: player.photoUrl,
            number: player.number,
            customX: null,
            customY: null,
            jerseyColor: null
          }
        ]
      }
    })
  }, [])

  const removePlayer = useCallback((playerId) => {
    setLineup(prev => ({
      ...prev,
      players: prev.players.filter(p => p.playerId !== playerId)
    }))
  }, [])

  const swapPlayers = useCallback((playerId1, playerId2) => {
    setLineup(prev => {
      const player1 = prev.players.find(p => p.playerId === playerId1)
      const player2 = prev.players.find(p => p.playerId === playerId2)
      
      if (!player1 || !player2) return prev
      
      return {
        ...prev,
        players: prev.players.map(p => {
          if (p.playerId === playerId1) {
            return { ...p, positionId: player2.positionId, customX: null, customY: null }
          }
          if (p.playerId === playerId2) {
            return { ...p, positionId: player1.positionId, customX: null, customY: null }
          }
          return p
        })
      }
    })
  }, [])

  const movePlayer = useCallback((playerId, positionId, customX = null, customY = null) => {
    setLineup(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.playerId === playerId) {
          return { ...p, positionId, customX, customY }
        }
        // If moving to an occupied position, remove the other player from that position
        if (positionId && p.positionId === positionId) {
          return { ...p, positionId: null }
        }
        return p
      })
    }))
  }, [])

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  const clearLineup = useCallback(() => {
    setLineup(prev => ({
      ...prev,
      players: []
    }))
  }, [])

  return {
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
  }
}
